//  Source: _lib\realpage\collapsible-list\js\_bundle.inc
angular.module("rpCollapsibleList", []);

//  Source: _lib\realpage\collapsible-list\js\directives\collapsible-list.js
//  Collapsible List Directive

(function (angular) {
    "use strict";

    function rpCollapsibleList(timeout) {
        function link(scope, elem, attr) {
            var state,
                dim = {},
                dir = {};

            dir.state = state = {
                open: false,
                busy: false
            };

            dir.init = function () {
                timeout(dir.setup);
            };

            dir.setup = function () {
                dir.head = elem.find('.rp-collapsible-list-title:first');
                dir.con = elem.find('.rp-collapsible-list-content:first');
                dir.state.open = dir.con.hasClass('open');
                scope.rpCollapsibleList = dir;
                return dir;
            };

            dir.open = function () {
                if (state.busy) {
                    return dir;
                }
                state.busy = true;
                state.open = true;
                dim.openHt = dir.con.prop('scrollHeight');
                dir.animate();
                return dir;
            };

            dir.afterOpen = function () {
                state.busy = false;

                dir.con.css({
                    height: 'auto',
                    overflow: 'auto'
                });

                return dir;
            };

            dir.close = function () {
                if (state.busy) {
                    return dir;
                }
                state.busy = true;
                state.open = false;
                dir.con.css('overflow', 'hidden');
                dir.animate();
                return dir;
            };

            dir.afterClose = function () {
                state.busy = false;
            };

            dir.toggle = function () {
                dir[state.open ? 'close' : 'open']();
                return dir;
            };

            dir.animate = function () {
                var fn = angular.noop,
                    ht = state.open ? dim.openHt : 0,
                    after = state.open ? dir.afterOpen : dir.afterClose;

                dir.con.animate({
                    height: ht
                }, 250, after);

                return dir;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpCollapsibleList")
        .directive('rpCollapsibleList', [
            'timeout',
            rpCollapsibleList
        ]);
})(angular);

