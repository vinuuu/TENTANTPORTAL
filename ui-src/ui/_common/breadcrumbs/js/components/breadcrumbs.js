(function (angular) {
    "use strict";

    function Controller(rpBdgtBreadcrumbs) {
        var events,
            vm = this;

        vm.$onInit = function () {
           vm.model = rpBdgtBreadcrumbs;
        };      

        vm.$onDestroy = function () {
           
        };
    }

    var component = {
        controller: [
            'rpBdgtBreadcrumbsModel',
            Controller
        ],
        templateUrl: "app/templates/breadcrumbs.html"
    };

    angular
        .module("budgeting")
        .component("rpBdgtBreadcrumbs", component);
})(angular);