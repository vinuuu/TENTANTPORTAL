angular.module("rpFloatScroll", []);

//  Source: _lib\realpage\float-scroll\js\directives\float-scroll.js
//  Floating Scrollbar Directive

(function (angular, undefined) {
    "use strict";

    function rpFloatScroll(timeout, winScroll, winSize) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.floatScroll = dir;
                dir.setSizeBusy = false;
                dir.append().setupBar().setVis();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.sizeWatch = winSize.subscribe(dir.delaySetSize);
                dir.scrollWatch = winScroll.subscribe(dir.delaySetSize);
            };

            dir.append = function () {
                var html = "<div class='rp-float-scrollbar'><div /></div>";

                dir.bar = angular.element(html);
                dir.barCon = dir.bar.children();

                elem.append(dir.bar);
                return dir;
            };

            dir.setupBar = function () {
                dir.bar.on("scroll", dir.onScroll);
                dir.setSize();
                return dir;
            };

            dir.show = function () {
                dir.bar.show();
                return dir;
            };

            dir.hide = function () {
                dir.bar.hide();
                return dir;
            };

            dir.onScroll = function () {
                var sl = dir.bar.scrollLeft();
                elem.scrollLeft(sl);
            };

            dir.delaySetSize = function () {
                if (!dir.setSizeBusy) {
                    dir.setSizeBusy = true;
                    dir.sizeTimer = timeout(dir.setSize, 150);
                }
            };

            dir.setVis = function () {
                var sl = elem.scrollLeft(),
                    winHt = winSize.getSize().height,
                    scrollTop = winScroll.getScrollTop(),
                    rect = elem.get(0).getBoundingClientRect(),
                    current = winHt + scrollTop,
                    elemTop = scrollTop + rect.top,
                    elemBottom = elemTop + elem.outerHeight(),
                    show = current > elemTop && current < elemBottom;

                dir[show ? "show" : "hide"]().bar.scrollLeft(show ? sl : 0);

                return dir;
            };

            dir.setSize = function () {
                var barStyle = {
                    left: elem.offset().left,
                    width: elem.outerWidth()
                };

                dir.bar.css(barStyle);
                dir.setSizeBusy = false;
                dir.barCon.width(elem.get(0).scrollWidth);

                dir.setVis();
            };

            dir.destroy = function () {
                dir.sizeWatch();
                dir.destWatch();
                dir.bar.remove();
                dir.scrollWatch();
                timeout.cancel(dir.sizeTimer);

                scope.floatScroll = undefined;
                dir = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpFloatScroll")
        .directive("rpFloatScroll", [
            "timeout",
            "windowScroll",
            "windowSize",
            rpFloatScroll
        ]);
})(angular);
