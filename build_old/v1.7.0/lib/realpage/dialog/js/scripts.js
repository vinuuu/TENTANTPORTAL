//  Source: _lib\realpage\dialog\js\_bundle.inc
angular.module("rpDialog", []);

// Templates

//  Source: _lib\realpage\dialog\js\templates\dialogs.js
//  Dialog Display Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "/templates/realpage/dialog/dialogs.html";

    templateHtml = "" +
        "<div class='rp-dialogs' ng-show='model.list.length'>" +
            "<div id='{{::dialog.data.id}}' " +
                "ng-repeat='dialog in model.list' " +
                "class='rp-dialog {{::dialog.data.type}}'>" +

                "<span class='close-dialog' " +
                    "ng-click='dir.close(dialog)'>" +
                "</span>" +

                "<div class='modal-header'>" +
                    "<span class='icon'></span>" +
                    "<h2 class='modal-title'>{{::dialog.data.title}}</h2>" +
                "</div>" +

                "<div class='modal-content'>" +
                    "<p class='info'>{{::dialog.data.info}}</p>" +
                    "<p class='question'>{{::dialog.data.question}}</p>" +
                "</div>" +

                "<div class='modal-footer buttons'>" +
                    "<a ng-if='dialog.data.showContinue' " +
                        "class='button' ng-click='dir.continue(dialog)'>" +
                        "{{::dialog.data.continueButtonText}}" +
                    "</a>" +

                    "<a ng-if='dialog.data.showCancel' " +
                        "class='button white' ng-click='dir.cancel(dialog)'>" +
                        "{{::dialog.data.cancelButtonText}}" +
                    "</a>" +
                "</div>" +
            "</div>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpDialog")
        .run(['$templateCache', installTemplate]);
})(angular);


//  Services

//  Source: _lib\realpage\dialog\js\services\dialogs.js
//  Dialogs Service

(function (angular) {
    "use strict";

    function dialogsSvc() {
        var svc = {},
            dialogs = {
                list: []
            };

        svc.get = function () {
            return dialogs;
        };

        svc.show = function (dialog) {
            dialogs.list.push(dialog);
        };

        svc.hide = function (dialog) {
            dialogs.list = dialogs.list.filter(function (listItem) {
                return dialog.data.id !== listItem.data.id;
            });
        };

        svc.isActive = function (dialog) {
            var bool = false;
            dialogs.list.forEach(function (item) {
                if (item.data.id === dialog.data.id) {
                    bool = true;
                }
            });
            return bool;
        };

        return svc;
    }

    angular
        .module("rpDialog")
        .factory('rpDialogSvc', [dialogsSvc]);
})(angular);


//  Models

//  Source: _lib\realpage\dialog\js\models\dialog.js
//  Dialog Model Service

(function (angular) {
    "use strict";

    function dialogModel(eventStream, svc) {
        var index = 1;

        return function (id) {
            var model = {};

            id = id || 'dialog' + index++;

            model.events = eventStream();

            model.data = {
                id: id,
                type: 'info', //  confirm, error, info, warn
                showCancel: true,
                showContinue: true,
                info: 'Dialog info',
                title: 'Dialog title',
                cancelButtonText: 'Cancel',
                question: 'Dialog question',
                continueButtonText: 'Continue'
            };

            model.getID = function () {
                return model.data.id;
            };

            model.update = function (data) {
                angular.extend(model.data, data);
                return model;
            };

            model.show = function () {
                svc.show(model);
                return model;
            };

            model.hide = function () {
                svc.hide(model);
                return model;
            };

            model.isActive = function () {
                return svc.isActive(model);
            };

            model.subscribe = function () {
                var fn = model.events.subscribe;
                fn.apply(fn, arguments);
                return model;
            };

            return model;
        };
    }

    angular
        .module("rpDialog")
        .factory('rpDialogModel', [
            'eventStream',
            'rpDialogSvc',
            dialogModel
        ]);
})(angular);


//  Directives

//  Source: _lib\realpage\dialog\js\directives\dialog.js
//  Dialog Directive

(function (angular) {
    "use strict";

    function rpDialog($timeout) {
        function link(scope, elem, attr, vm) {
            var dir = {};

            dir.init = function () {
                $timeout(dir.setMarginTop);
            };

            dir.setMarginTop = function () {
                var outerHeight = elem.outerHeight();

                elem.css({
                    visibility: 'visible',
                    marginTop: -Math.round(outerHeight/2)
                });
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpDialog")
        .directive('rpDialog', ['$timeout', rpDialog]);
})(angular);

//  Source: _lib\realpage\dialog\js\directives\dialogs.js
//  Dialog Display Directive

(function (angular) {
    "use strict";

    function rpDialogs(svc) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.dir = dir;
                scope.model = svc.get();
            };

            dir.close = function (dialog) {
                dialog.hide().events.publish('close');
            };

            dir.continue = function (dialog) {
                dialog.hide().events.publish('continue');
            };

            dir.cancel = function (dialog) {
                dialog.hide().events.publish('cancel');
            };

            dir.init();
        }

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "/templates/realpage/dialog/dialogs.html"
        };
    }

    angular
        .module("rpDialog")
        .directive('rpDialogs', ['rpDialogSvc', rpDialogs]);
})(angular);

