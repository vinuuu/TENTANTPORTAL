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
