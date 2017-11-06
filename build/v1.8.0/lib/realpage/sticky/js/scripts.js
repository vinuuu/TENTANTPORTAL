//  Source: _lib\realpage\sticky\js\_bundle.inc
angular.module("rpSticky", []);

//  Source: _lib\realpage\sticky\js\directives\sticky.js
//  Stick To Top Directive

(function (angular) {
    "use strict";

    function rpSticky(windowScroll, windowSize) {
        var index = 1;

        function link(scope, elem, attr) {
            var dir = {};

            dir.data = {};
            dir.isLocked = false;

            dir.init = function () {
                var opt = dir.getOptions(),
                    instName = opt.instName ? opt.instName : 'rpSticky' + index++;

                scope[instName] = instName;

                dir.setup().recordElemData();
                scope.$on('$destroy', dir.destroy);
                dir.sizeWatch = windowSize.subscribe(dir.onWinResize);
                dir.scrollWatch = windowScroll.subscribe(dir.onWinScroll);
            };

            dir.setup = function () {
                var className = dir.getOptions().phdrClassName,
                    html = '<div class="' + className + '" />';
                dir.phdr = angular.element(html).insertAfter(elem);
                return dir;
            };

            dir.onWinScroll = function (ev) {
                if (!dir.isDisabled()) {
                    var lockTop = dir.getOptions().lockTop,
                        lock = ev.scrollTop > dir.data.offsetTop - lockTop;
                    dir[lock ? 'lock' : 'unlock']();
                }
            };

            dir.recordElemData = function () {
                dir.data.elemWd = elem.outerWidth();
                dir.data.elemHt = elem.outerHeight();
                dir.data.offsetTop = elem.offset().top;
                dir.data.offsetLeft = elem.offset().left;
                return dir;
            };

            dir.recordPhdrData = function () {
                dir.data.elemWd = dir.phdr.width();
                dir.data.offsetLeft = dir.phdr.offset().left;
                return dir;
            };

            dir.onWinResize = function () {
                if (!dir.isLocked) {
                    dir.recordElemData();
                }
                else {
                    dir.recordPhdrData();

                    var elemCss = {
                        width: dir.data.elemWd,
                        left: dir.data.offsetLeft
                    };

                    elem.css(elemCss);
                }
            };

            dir.lock = function () {
                var elemCss, phdrCss;

                dir.isLocked = true;

                elemCss = {
                    marginLeft: 0,
                    width: dir.data.elemWd,
                    left: dir.data.offsetLeft,
                    top: dir.getOptions().lockTop
                };

                phdrCss = {
                    display: 'block',
                    height: dir.data.elemHt
                };

                dir.phdr.css(phdrCss);
                elem.css(elemCss).addClass('locked');
            };

            dir.unlock = function () {
                var elemCss, phdrCss;

                dir.isLocked = false;

                elemCss = {
                    top: '',
                    left: '',
                    width: '',
                    marginLeft: ''
                };

                phdrCss = {
                    height: '',
                    display: ''
                };

                dir.phdr.css(phdrCss);
                elem.css(elemCss).removeClass('locked');

                dir.recordElemData();
            };

            dir.getOptions = function () {
                var options,
                    newOptions;

                options = {
                    lockTop: 0,
                    isDisabled: false,
                    phdrClassName: 'rp-sticky-placeholder'
                };

                newOptions = scope.$eval(attr.rpSticky) || {};

                return angular.extend(options, newOptions);
            };

            dir.isDisabled = function () {
                return dir.getOptions().isDisabled;
            };

            dir.destroy = function () {
                dir.sizeWatch();
                dir.scrollWatch();
                dir.phdr.remove();
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpSticky")
        .directive('rpSticky', ['windowScroll', 'windowSize', rpSticky]);
})(angular);

