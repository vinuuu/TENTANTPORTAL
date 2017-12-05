//  Source: ui\home\error\js\controllers\error.js
//  not-found Controller

(function (angular) {
    "use strict";

    function ErrorCtrl($scope, $state, $stateParams, appLayout, langTranslate) {
        var vm = this,
            translate = langTranslate('error').translate;

        vm.init = function () {
            //appLayout.setLayout({
            //    appHeader: false,
            //    appNav: false,
            //    appFooter: false,
            //    maxHeight: true
            //});
            if (!$stateParams.templateUrl) {
                switch ($stateParams.errorCode) {
                    case "401":
                        vm.templateUrl = "app/error/templates/unauthorised-error.tpl.html";
                        vm.model = {
                            statusCode: translate('lbl_401_statusCode'),
                            title: translate('lbl_401_title'),
                            message: translate('lbl_401_message'),
                            btnBackText: translate('lbl_back_btn_text')
                        };
                        break;
                    case "500":
                        vm.templateUrl = "app/error/templates/internal-error.tpl.html";
                        vm.model = {
                            statusCode: translate('lbl_500_statusCode'),
                            title: translate('lbl_500_title'),
                            message: translate('lbl_500_message'),
                            btnBackText: translate('lbl_back_btn_text')
                        };
                        break;
                    default:
                        vm.templateUrl = "app/error/templates/default-not-found.tpl.html";
                        vm.model = {
                            statusCode: translate('lbl_404_statusCode'),
                            title: translate('lbl_404_title'),
                            message: translate('lbl_404_message'),
                            btnBackText: translate('lbl_back_btn_text')
                        };
                        break;
                }
            }
            else {
                vm.templateUrl = $stateParams.templateUrl;
                vm.model = $stateParams.model;
            }
            $scope.$on("$destroy", vm.destroy);
        };

        vm.navigateTo = function (name, params) {
            $state.go(name, params);
        };


        vm.destroy = function () {
            //appLayout.setLayout({
            //    appHeader: true,
            //    appNav: true,
            //    appFooter: true,
            //    maxHeight: false
            //});
        };

        vm.init();
    }

    angular
        .module("budgeting")
        .controller("ErrorCtrl", [
            "$scope",
            "$state",
            "$stateParams",
            "appLayout",
            "appLangTranslate",
            ErrorCtrl]);
})(angular);


//  Source: ui\home\error\js\templates\default-not-found.tpl.js
(function() {
    'use strict';

    var templateHtml, templateUrl;

    templateUrl = "app/error/templates/default-not-found.tpl.html";

    templateHtml = "" +
        '<div class="app-body warning bg-auto">' +
        '<div class="text-center pos-rlt p-y-md">' +
        '<h1 class="text-shadow m-a-0 text-white text-4x">' +
        '<span class="text-2x font-bold block m-t-lg">{{::page.model.statusCode}}</span>' +
        '</h1>' +
        '<h2 class="h1 m-y-lg text-white">{{::page.model.title}}</h2>' +
        '<p class="h5 m-y-lg font-bold text-white">{{::page.model.message}}</p>' +
        '<a ui-sref="home" class="btn rounded accent md-raised p-x-md">' +
        '<span class="text-white">{{::page.model.btnBackText}}</span>' +
        '</a>' +
        '</div>' +
        '</div>';

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module('ui')
        .run(['$templateCache', installTemplate]);
})();

//  Source: ui\home\error\js\templates\internal-error.tpl.js
(function() {
    'use strict';

    var templateHtml, templateUrl;

    templateUrl = "app/error/templates/internal-error.tpl.html";

    templateHtml = "" +
        '<div class="app-body primary bg-auto">' +
        '<div class="text-center pos-rlt p-y-md">' +
        '<h1 class="text-shadow text-white text-4x">' +
        '<span class="text-2x font-bold block m-t-lg">{{::page.model.statusCode}}</span>' +
        '</h1>' +
        '<p class="h5 m-y-lg font-bold">{{::page.model.title}}</p>' +
        '<p class="h5 m-y-lg font-bold">{{::page.model.message}}</p>' +
        '<a ui-sref="home" class="btn rounded accent md-raised p-x-md">' +
        '<span class="text-white">{{::page.model.btnBackText}}</span>' +
        '</a>' +
        '</div>' +
        '</div>';

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module('ui')
        .run(['$templateCache', installTemplate]);
})();

//  Source: ui\home\error\js\templates\unauthorised-error.tpl.js
(function() {
    'use strict';

    var templateHtml, templateUrl;

    templateUrl = "app/error/templates/unauthorised-error.tpl.html";

    templateHtml = "" +
        '<div class="app-body primary bg-auto">' +
        '<div class="text-center pos-rlt p-y-md">' +
        '<h1 class="text-shadow text-white text-4x">' +
        '<span class="text-2x font-bold block m-t-lg">{{::page.model.statusCode}}</span>' +
        '</h1>' +
        '<p class="h5 m-y-lg font-bold">{{::page.model.title}}</p>' +
        '<p class="h5 m-y-lg font-bold">{{::page.model.message}}</p>' +
        '<a ui-sref="home" class="btn rounded accent md-raised p-x-md">' +
        '<span class="text-white">{{::page.model.btnBackText}}</span>' +
        '</a>' +
        '</div>' +
        '</div>';

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module('ui')
        .run(['$templateCache', installTemplate]);
})();
