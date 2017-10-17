//  Source: _lib\realpage\expandable-list\js\_bundle.inc
angular.module("rpExpandibleList", []);

//  Source: _lib\realpage\expandable-list\js\directives\expandable-list.js
//  Expandable List Directive

(function (angular) {
    "use strict";

    function rpExpandableList(timeout, device) {
        var index = 1,
            header = '.rp-expandable-list-header',
            toggle = '.rp-expandable-list-toggle',
            content = '.rp-expandable-list-content';

        function link(scope, elem, attr) {
            var dir = {},
                watch1 = angular.noop;

            dir.state = {
                busy: false,
                open: false
            };

            dir.clickEvent = device.clickEvent('rpExpandableList');

            dir.init = function () {
                dir.header = elem.children(header);
                dir.content = elem.children(content);
                dir.toggle = dir.header.find(toggle);

                var allPresent = dir.header.length !== 0 &&
                    dir.content.length !== 0 &&
                    dir.toggle.length !== 0;

                if (allPresent) {
                    dir.bindEvents().setState().exposeInstance();
                }
                else {
                    elem.addClass('ready');
                }
            };

            dir.bindEvents = function () {
                dir.toggle.on(dir.clickEvent, dir.onToggleClick);
                watch1 = scope.$on('$destroy', dir.destroy);
                return dir;
            };

            dir.setState = function () {
                timeout(function () {
                    var hh = dir.headerHeight();
                    elem.height(hh).addClass('ready');
                }, 100);
                return dir;
            };

            dir.exposeInstance = function () {
                dir.instName = attr.rpExpandableListName || 'rpExpandableList' + index++;
                scope[dir.instName] = dir;
                return dir;
            };

            dir.onToggleClick = function () {
                if (!dir.state.busy) {
                    dir.state.busy = true;
                    scope.$apply(dir.toggleState);

                    timeout(function () {
                        dir.state.busy = false;
                    }, 255);
                }
            };

            dir.toggleState = function () {
                if (dir.state.open) {
                    dir.collapse();
                }
                else {
                    dir.expand();
                }
            };

            dir.expand = function () {
                dir.state.open = true;
                elem.addClass('open');
                dir.animate().showOverflow();
            };

            dir.collapse = function () {
                dir.state.open = false;
                elem.removeClass('open');
                dir.hideOverflow().animate();
            };

            dir.hideOverflow = function () {
                elem.removeClass('show-overflow');
                return dir;
            };

            dir.showOverflow = function () {
                timeout(function () {
                    elem.addClass('show-overflow').height('');
                }, 250);

                return dir;
            };

            dir.contentHeight = function () {
                return dir.content.get(0).scrollHeight;
            };

            dir.headerHeight = function () {
                return dir.header.height();
            };

            dir.animate = function () {
                var hh = dir.headerHeight(),
                    ch = dir.contentHeight(),
                    ht = hh + (dir.state.open ? ch : 0);

                elem.animate({
                    height: ht
                }, 250);

                return dir;
            };

            dir.destroy = function () {
                watch1();
                scope[dir.instName] = undefined;
                dir = undefined;
            };

            timeout(dir.init, 100);
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpExpandableList")
        .directive('rpExpandableList', ['timeout', 'deviceInfoSvc', rpExpandableList]);
})(angular);

