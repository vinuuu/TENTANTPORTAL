//  Home Controller

(function(angular, undefined) {
    "use strict";

    function HomeCtrl($scope, tabsModel, rpBdgtBreadcrumbsModel, $location, $timeout, storage, globalHeaderUsername, state) {
        var vm = this,
            menu;

        vm.init = function() {
            if (!sessionStorage.getItem('sessionID')) {
                state.go('login');
            }
            vm.dynamicMenu();
            globalHeaderUsername.setUsername(sessionStorage.getItem('userName'));
            rpBdgtBreadcrumbsModel.setLinks("event", $location.absUrl(), $location.absUrl());
        };
        vm.dynamicMenu = function() {
            $timeout(function() {
                var permissions = storage.get('permissionsFormenu');
                $('.rp-gh-logo>a').click(function() { return false; });
                if (permissions.Documents) {
                    $('.rp-global-nav-menu>li:contains("Documents")').css('display', 'block');
                } else {
                    $('.rp-global-nav-menu>li:contains("Documents")').css('display', 'none');
                }
                if (permissions.Invoices) {
                    $('.rp-global-nav-menu>li:contains("Invoices")').css('display', 'block');
                } else {
                    $('.rp-global-nav-menu>li:contains("Invoices")').css('display', 'none');
                }
                if (permissions.Statements) {
                    $('.rp-global-nav-menu>li:contains("Statements")').css('display', 'block');
                } else {
                    $('.rp-global-nav-menu>li:contains("Statements")').css('display', 'none');
                }

                if (permissions.Notes) {}
                if (permissions.Payments) {
                    $('.rp-global-nav-menu>li:contains("Payments")').css('display', 'block');
                } else {
                    $('.rp-global-nav-menu>li:contains("Payments")').css('display', 'none');
                }
                if (permissions["Service Request"]) {}
            }, 0, false);
        };
        vm.destroy = function() {
            vm = undefined;
            $scope = undefined;
        };      
        vm.init();
    }

    angular
        .module("ui")
        .controller("HomeCtrl", ["$scope", "baseModel", 'rpBdgtBreadcrumbsModel', '$location', '$timeout', 'rpSessionStorage', 'globalHeaderUsername', '$state', HomeCtrl]);
})(angular);

