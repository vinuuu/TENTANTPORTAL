//  Source: _lib\realpage\form-track-changes\js\_bundle.inc
angular.module("rpFormTrackChanges", []);

//  Source: _lib\realpage\form-track-changes\js\templates\templates.inc.js
angular.module('rpFormTrackChanges').run(['$templateCache', function ($templateCache) {
$templateCache.put("realpage/form-track-changes/templates/unsaved-changes-alert-modal.html",
"<div class=\"modal rp-unsaved-changes-modal am-fade-and-slide-top\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" ng-click=\"$hide()\">×</button><h4 class=\"modal-title\">Unsaved Changes</h4></div><div class=\"modal-body\"><p>You are leaving without saving your changes.</p><p>Do you wish to continue?</p></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"unsavedChanges.denyChange()\">Cancel</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"unsavedChanges.allowChange()\">Continue</button></div></div></div></div>");
}]);

//  Source: _lib\realpage\form-track-changes\js\directives\track-form-changes.js
//  Track Form Changes Directive

(function (angular) {
    "use strict";

    function rpTrackFormChanges(unsavedChanges, watchList) {
        function link(scope, elem, attr) {
            var dir = {
                watchList: watchList(),
                disableAlert: angular.noop
            };

            dir.init = function () {
                var key = attr.name + '.$dirty',
                watch = scope.$watch(key, dir.checkState);
                dir.watchList.add(watch);

                watch = scope.$on('$destroy', dir.destroy);
                dir.watchList.add(watch);
            };

            dir.checkState = function (dirty) {
                if (dirty && dir.disableAlert == angular.noop) {
                    dir.disableAlert = unsavedChanges.enableAlert();
                }
                else {
                    dir.disableAlert();
                    dir.disableAlert = angular.noop;
                }
            };

            dir.destroy = function () {
                dir.watchList.destroy();
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module('rpFormTrackChanges')
        .directive('rpTrackFormChanges', ['rpUnsavedChanges', 'rpWatchList', rpTrackFormChanges]);
})(angular);

//  Source: _lib\realpage\form-track-changes\js\directives\unsaved-changes-modal.js
//  Unsaved Changes Modal Directive

(function (angular) {
    "use strict";

    function rpUnsavedChangesModal(unsavedChanges) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.unsavedChanges = dir;
            };

            dir.allowChange = function () {
                scope.$hide();
                unsavedChanges.onUserAction("continue");
            };

            dir.denyChange = function () {
                scope.$hide();
                unsavedChanges.onUserAction("cancel");
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpFormTrackChanges")
        .directive("rpUnsavedChangesModal", ["rpUnsavedChanges", rpUnsavedChangesModal]);
})(angular);

//  Source: _lib\realpage\form-track-changes\js\services\unsaved-changes.js
//  Unsaved Changes Service

(function (angular) {
    "use strict";

    function factory($state, $window, $rootScope, $modal) {
        var svc, index = 1;

        svc = {
            nextUrl: "",
            nextState: "",
            changesList: [],
            skipCheck: false
        };

        svc.init = function () {
            svc.setDialog()
                .watchStateChange()
                .watchWindowUnload()
                .watchLocationChange()
                .watchRpAppStateChange();

            return svc;
        };

        // Setters

        svc.setDialog = function () {
            svc.dialog = $modal({
                show: false,
                templateUrl: "realpage/form-track-changes/templates/unsaved-changes-alert-modal.html"
            });
            return svc;
        };

        // Watchers

        svc.watchStateChange = function () {
            $rootScope.$on("$stateChangeStart", svc.onStateChange);
            return svc;
        };

        svc.watchWindowUnload = function () {
            var win = angular.element($window);
            win.on("beforeunload.unsavedChanges", svc.onWindowUnload);
            return svc;
        };

        svc.watchLocationChange = function () {
            $rootScope.$on("$locationChangeStart", svc.onLocationChange);
            return svc;
        };

        svc.watchRpAppStateChange = function (data) {
            $rootScope.$on("rpAppStateChange", svc.onRpAppStateChange);
            return svc;
        };

        // Watch Actions

        svc.onStateChange = function (ev, state) {
            if (svc.hasChanges() && !svc.skipCheck) {
                ev.preventDefault();
                svc.nextState = state.name;
                svc.alertUser();
            }
        };

        svc.onWindowUnload = function () {
            if (!svc.hasChanges()) {
                return;
            }

            return "You are leaving without saving your changes. Do you wish to continue?";
        };

        svc.onLocationChange = function (ev, url) {
            if (svc.hasChanges() && !svc.skipCheck) {
                ev.preventDefault();
                svc.nextUrl = url;
                svc.alertUser();
            }
        };

        svc.onRpAppStateChange = function ($event, data) {
            var actions = {
                onCancel: angular.noop,
                onContinue: angular.noop
            };

            if (svc.hasChanges() && !svc.skipCheck) {
                $event.preventDefault();
                svc.rpStateChange = angular.extend({}, actions, data);
                svc.alertUser();
            }
        };

        svc.enableAlert = function () {
            var change = {
                id: "change" + index++
            };

            svc.skipCheck = false;
            svc.changesList.push(change);

            return function () {
                svc.changesList = svc.changesList.filter(function (item) {
                    return item.id !== change.id;
                });
            };
        };

        svc.disableAlert = function () {
            svc.changesList.flush();
            return svc;
        };

        svc.onUserAction = function (action) {
            if (action == "continue") {
                svc.skipCheck = true;
                svc.disableAlert().allowChange();
            }
            else if (action == "cancel") {
                svc.skipCheck = false;
                svc.denyChange();
            }
        };

        svc.allowChange = function () {
            if (svc.nextUrl) {
                svc.goToUrl(svc.nextUrl);
                svc.nextUrl = "";
            }
            else if (svc.nextState) {
                svc.goToState(svc.nextState);
                svc.nextState = "";
            }
            else if (svc.rpStateChange) {
                svc.rpStateChange.onContinue();
                svc.rpStateChange = "";
            }
        };

        svc.denyChange = function () {
            if (svc.rpStateChange) {
                svc.rpStateChange.onCancel();
            }
        };

        svc.goToUrl = function (url) {
            $window.location.href = url;
        };

        svc.goToState = function (stateName) {
            $state.go(stateName);
        };

        svc.hasChanges = function () {
            return svc.changesList.length !== 0;
        };

        svc.alertUser = function () {
            svc.dialog.show();
        };

        return svc;
    }

    angular
        .module("rpFormTrackChanges")
        .factory("rpUnsavedChanges", [
            "$state",
            "$window",
            "$rootScope",
            "$modal",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\form-track-changes\js\config\unsaved-changes.js
// DOM based lazyloading

(function (angular) {
    "use strict";

    function init(unsavedChanges) {
        unsavedChanges.init();
    }

    angular
        .module("rpFormTrackChanges")
        .run(["rpUnsavedChanges", init]);
})(angular);

