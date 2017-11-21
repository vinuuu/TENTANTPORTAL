//  Tabs Menu Directive

(function(angular) {
    "use strict";

    function factory($state) {
        function link(scope, elem, attr) {
            //do now
            scope.viewStatement = function() {
                $state.go('#/dashboard');
            };
        }

        return {
            scope: {
                leaseid: '=',
                displaytext: '='
            },
            link: link,
            restrict: 'E',
            template: "<a ng-click=scope.viewStatement()><i class=icon></i><span class=p-l-sm>{{scope.displaytext}}</span></a>",
        };
    }
    angular
        .module("ui")
        .directive('viewStatement', ['$state', factory]);
})(angular);