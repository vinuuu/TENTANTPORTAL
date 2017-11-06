//  Source: _lib\realpage\draggable\js\_bundle.inc
angular.module("rpDraggable", []);

//  Source: _lib\realpage\draggable\js\services\draggable.js
//  Draggable Service

(function (angular) {
    "use strict";

    function factory(pool) {
        var svc = pool();
        return svc;
    }

    angular
        .module("rpDraggable")
        .factory('rpDraggableSvc', ['rpPoolSvc', factory]);
})(angular);

//  Source: _lib\realpage\draggable\js\models\draggable.js
//  Draggable Model

(function (angular) {
    "use strict";

    function factory(svc, point) {
        var body,
            index = 1;

        return function (scope, elem, attr) {
            var dir = {},
                dragEvent,
                start = {},
                coord = {},
                styles = {},
                evns = '.drag' + index++,
                mouseup = 'mouseup' + evns,
                mousedown = 'mousedown' + evns,
                mousemove = 'mousemove' + evns,
                mouseleave = 'mouseleave' + evns,
                ref = elem.parents('.rp-draggable-wrap');

            function init() {
                svc(attr.rpDraggable, dir);
                elem.on(mousedown, dir.activateElem);
                body = body || angular.element('body');
            }

            dir.enabled = function () {
                return !!scope.$eval(attr.rpDragEnabled);
            };

            dir.setStyles = function (css) {
                if (!css) {
                    for (var key in styles) {
                        styles[key] = '';
                    }
                }
                else {
                    styles = css;
                }
                elem.css(styles);
                return dir;
            };

            dir.updateStyles = function (css) {
                angular.extend(styles, css);
                elem.css(styles);
            };

            dir.activateElem = function (e) {
                if (!dir.enabled()) {
                    return;
                }

                var offset = elem.offset(),
                    pOffset = ref.offset();

                e.preventDefault();
                e.stopPropagation();

                start = {
                    x: e.pageX,
                    y: e.pageY
                };

                coord = {
                    y: offset.top - pOffset.top + ref.scrollTop(),
                    x: offset.left - pOffset.left + ref.scrollLeft()
                };

                dir.setStyles({
                    top: coord.y,
                    left: coord.x
                });

                elem.addClass('rp-drag-active');

                body.on(mousemove, dir.dragElem);
                body.on(mouseup, dir.deactivateElem);
                body.on(mouseleave, dir.deactivateElem);

                scope.$apply(attr['rpDragStart'], elem);
            };

            dir.dragElem = function (e) {
                if (!dir.enabled()) {
                    return;
                }

                dragEvent = e;

                dir.updateStyles({
                    top: coord.y + e.pageY - start.y,
                    left: coord.x + e.pageX - start.x
                });

                e.preventDefault();
                e.stopPropagation();

                scope.$apply(attr['rpDrag'], elem);
            };

            dir.dragPoint = function () {
                return point().fromEvent(dragEvent);
            };

            dir.deactivateElem = function () {
                dir.setStyles().cleanup();
                elem.removeClass('rp-drag-active');
                scope.$apply(attr['rpDragEnd'], elem);
            };

            dir.cleanup = function () {
                body.off(evns);
            };

            init();
        };
    }

    angular
        .module("rpDraggable")
        .factory('rpDraggableModel', ['rpDraggableSvc', 'point', factory]);
})(angular);

//  Source: _lib\realpage\draggable\js\models\draggable-touch.js
//  Draggable Touch Model

(function (angular) {
    "use strict";

    function factory(svc, point) {
        var body,
            index = 1;

        return function (scope, elem, attr) {
            var timer,
                dir = {},
                dragEvent,
                start = {},
                coord = {},
                styles = {},
                evns = '.drag' + index++,
                touchend = 'touchend' + evns,
                touchmove = 'touchmove' + evns,
                touchstart = 'touchstart' + evns,
                contextmenu = 'contextmenu' + evns,
                ref = elem.parents('.rp-draggable-wrap');

            function init() {
                svc(attr.rpDraggable, dir);
                elem.on(touchstart, dir.enableDrag);
                body = body || angular.element('body');
            }

            dir.disableContextMenu = function () {
                return false;
            };

            dir.enableDrag = function (e) {
                timer = setTimeout(function () {
                    dir.activateElem(e);
                }, 200);

                elem.on(touchend, dir.disableDrag);
                body.on(touchmove, dir.disableDrag);
                body.on(contextmenu, dir.disableContextMenu);
            };

            dir.disableDrag = function () {
                clearTimeout(timer);
            };

            dir.enabled = function () {
                return !!scope.$eval(attr.rpDragEnabled);
            };

            dir.setStyles = function (css) {
                if (!css) {
                    for (var key in styles) {
                        styles[key] = '';
                    }
                }
                else {
                    styles = css;
                }
                elem.css(styles);
                return dir;
            };

            dir.updateStyles = function (css) {
                angular.extend(styles, css);
                elem.css(styles);
            };

            dir.activateElem = function (e) {
                if (!dir.enabled()) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                var offset = elem.offset(),
                    ev, pOffset = ref.offset();

                ev = {
                    pageX: e.originalEvent.touches[0].pageX,
                    pageY: e.originalEvent.touches[0].pageY
                };

                start = {
                    x: ev.pageX,
                    y: ev.pageY
                };

                coord = {
                    y: offset.top - pOffset.top + ref.scrollTop(),
                    x: offset.left - pOffset.left + ref.scrollLeft()
                };

                dir.setStyles({
                    top: coord.y,
                    left: coord.x
                });

                elem.addClass('rp-drag-active');

                body.on(touchmove, dir.dragElem);
                body.on(touchend, dir.deactivateElem);

                scope.$apply(attr['rpDragStart'], elem);
            };

            dir.dragElem = function (e) {
                if (!dir.enabled()) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                var ev = {
                    pageY: e.originalEvent.touches[0].pageY,
                    pageX: e.originalEvent.touches[0].pageX
                };

                dragEvent = ev;

                dir.updateStyles({
                    top: coord.y + ev.pageY - start.y,
                    left: coord.x + ev.pageX - start.x
                });

                scope.$apply(attr['rpDrag'], elem);
            };

            dir.dragPoint = function () {
                return point().fromEvent(dragEvent);
            };

            dir.deactivateElem = function () {
                dir.setStyles().cleanup();
                elem.removeClass('rp-drag-active');
                scope.$apply(attr['rpDragEnd'], elem);
            };

            dir.cleanup = function () {
                body.off(evns);
                elem.off(touchend);
            };

            init();
        };
    }

    angular
        .module("rpDraggable")
        .factory('rpDraggableTouchModel', ['rpDraggableSvc', 'point', factory]);
})(angular);

//  Source: _lib\realpage\draggable\js\directives\draggable.js
//  Draggable Directive

(function (angular) {
    "use strict";

    function rpDraggable(deviceInfo, draggable, draggableTouch) {
        function link(scope, elem, attr) {
            var hasTouch = deviceInfo.hasTouch();
            if (!hasTouch) {
                draggable(scope, elem, attr);
            }
            else {
                draggableTouch(scope, elem, attr);
            }
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpDraggable")
        .directive('rpDraggable', [
            'deviceInfoSvc',
            'rpDraggableModel',
            'rpDraggableTouchModel',
            rpDraggable
        ]);
})(angular);

