//  Source: _lib\realpage\on-screen-console\js\_bundle.inc
angular.module("rpOnScreenConsole", []);

//  Source: _lib\realpage\on-screen-console\js\templates\console.js
//  On Screen Console Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/common/standalone/on-screen-console.html";

    templateHtml = "" +
        "<div class='on-screen-console'>" +
            "<span class='button clear' " +
                "ng-click='dir.clear()'>" +
                "clear" +
            "</span>" +
            "<p ng-repeat='item in model.list'>" +
                "{{::item.text}}" +
            "</p>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpOnScreenConsole")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\on-screen-console\js\models\console.js
//  Console Model

(function (angular) {
    "use strict";

    var id = 1;

    function factory() {
        var model = {
            list: []
        };

        model.log = function (data) {
            model.list.push({
                id: id++,
                text: data
            });
        };

        model.clear = function () {
            model.list.flush();
        };

        return model;
    }

    angular
        .module("rpOnScreenConsole")
        .factory('onScreenConsoleModel', [factory]);
})(angular);

//  Source: _lib\realpage\on-screen-console\js\directives\console.js
//  On Screen Console Directive

(function (angular) {
    "use strict";

    function onScreenConsole(model) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.dir = dir;
                scope.model = model;
            };

            dir.clear = function () {
                model.clear();
            };

            dir.init();
        }

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/common/standalone/on-screen-console.html"
        };
    }

    angular
        .module("rpOnScreenConsole")
        .directive('onScreenConsole', ['onScreenConsoleModel', onScreenConsole]);
})(angular);

