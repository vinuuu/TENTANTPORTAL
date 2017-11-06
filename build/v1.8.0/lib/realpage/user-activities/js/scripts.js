//  Source: _lib\realpage\user-activities\js\_bundle.inc
angular.module("rpUserActivities", []);

//  Source: _lib\realpage\user-activities\js\templates\user-activities.js
//  User Activities Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/common/user-activities/user-activities.html";

    templateHtml = "" +

    "<div class='user-activities'>" +
        "<div ng-repeat='activity in model.activities'>" +
            "<div class='activity'> " +
                "<div class='activity-type-icon activity-icon'></div>" +
                "<div class='heading'>" +
                    "<div class='title'>{{::activity.msgTitle}}</div>" +
                    "<div class='date'>{{::activity.msgUserActionDesciption}} on {{::activity.msgulLogDate}}</div>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpUserActivities")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\user-activities\js\models\user-activities.js
//  User Activities Model

(function (angular) {
    "use strict";

    function factory(userActivities) {
        var model = {};

        model.activities = [];

        model.load = function () {
            return userActivities.get(model.update).$promise;
        };

        model.update = function (data) {
            model.activities = data.omsMessageUserActivityList;
        };

        model.reset = function () {
            model.activities.flush();
        };

        return model;
    }

    angular
        .module("rpUserActivities")
        .factory('userActivitiesModel', ['userActivities', factory]);
})(angular);

//  Source: _lib\realpage\user-activities\js\services\user-activities.js
//  User Activities Service

(function (angular) {
    "use strict";

    function userActivities($resource) {
        function getActivities() {
            var url = '/api/core/common/OMSMessage/User/Activities';
            return $resource(url).get;
        }

        // function updateActivity () {
        //     var actions,
        //         defaults = {},
        //         url = '/api/core/common/OMSMessage/UserLog/:msgID/:msgulActionID';

        //     actions = {
        //         updateActivity: {
        //             method: 'PUT',

        //              params: {
        //                 msgID: 0,
        //                 msgulActionID: 2
        //             }
        //         }
        //     };

        //     return $resource(url, defaults, actions).updateActivity;
        // }

        return {
            get: getActivities()
            //update: updateActivity()
        };
    }

    angular
        .module("rpUserActivities")
        .factory('userActivities', ['$resource', userActivities]);
})(angular);

//  Source: _lib\realpage\user-activities\js\directives\user-activities.js
//  User Activities Directive

(function (angular) {
    "use strict";

    function userActivities(model) {
        function link(scope, elem, attr) {
            var watch,
                dir = {};

            dir.init = function () {
                scope.dir = dir;
                model.load();
                scope.model = model;
                watch = scope.$on('$destroy', dir.destroy);
            };

            dir.destroy = function () {
                watch();
                model.reset();
            };

            dir.init();
        }

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/common/user-activities/user-activities.html"
        };
    }

    angular
        .module("rpUserActivities")
        .directive('userActivities', ['userActivitiesModel', userActivities]);
})(angular);

