angular.module("rpFormTrackChanges", []);

//  Source: _lib\realpage\form-track-changes\js\templates\templates.inc.js
angular.module("rpFormTrackChanges").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/form-track-changes/templates/unsaved-changes-alert-modal.html",
"<div class=\"rp-modal-wrap\"><div class=\"rp-modal\" ng-click=\"$hide()\"><div class=\"rp-modal-dialog rp-unsaved-changes-modal\" rp-stop-event=\"click\"><div class=\"rp-modal-header\"><span class=\"rp-modal-close\" ng-click=\"$hide()\"></span><h2 class=\"rp-modal-header-title\">Unsaved Changes</h2></div><div class=\"rp-modal-content\"><p>You are leaving without saving your changes.</p><p>Do you wish to continue?</p></div><div class=\"rp-modal-footer\"><div class=\"rp-modal-footer-btns\"><button ng-click=\"$hide()\" ng-click=\"unsavedChanges.denyChange()\" class=\"btn rounded btn-outline b-primary text-primary\">Cancel</button> <button class=\"btn rounded primary\" ng-click=\"unsavedChanges.allowChange()\">Continue</button></div></div></div></div></div>");
}]);

//  Source: _lib\realpage\form-track-changes\js\directives\track-form-changes.js
//  Track Form Changes Directive

(function (angular, undefined) {
    "use strict";

    function rpTrackFormChanges(timeout, unsavedChanges) {
        var change = "change.trackFormChanges";

        function link(scope, elem, attr) {
            var dir = {
                disableAlert: angular.noop
            };

            dir.init = function () {
                dir.alertEnabled = false;
                scope.rpTrackFormChanges = dir;
                elem.on(change, dir.onChange);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.setData = function (data) {
                dir.form = data;
                dir.cleanForm = angular.copy(data);
                return dir;
            };

            dir.onChange = function () {
                scope.$apply(dir.checkState);
            };

            dir.isDirty = function () {
                return !angular.equals(dir.form, dir.cleanForm);
            };

            dir.checkState = function () {
                if (dir.isDirty() && !dir.alertEnabled) {
                    dir.alertEnabled = true;
                    dir.disableAlert = unsavedChanges.enableAlert();
                }
                else if (dir.alertEnabled && !dir.isDirty()) {
                    dir.reset();
                }
            };

            dir.reset = function () {
                dir.disableAlert();
                dir.alertEnabled = false;
                dir.disableAlert = angular.noop;
            };

            dir.destroy = function () {
                dir.reset();
                dir.destWatch();
                elem.off(change);

                dir = undefined;
                elem = undefined;
                attr = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpFormTrackChanges")
        .directive("rpTrackFormChanges", [
            "timeout",
            "rpUnsavedChanges",
            rpTrackFormChanges
        ]);
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

    function factory($state, $window, $rootScope, modalModel) {
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
            var url = "realpage/form-track-changes/templates/unsaved-changes-alert-modal.html";
            svc.dialog = modalModel(url);
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
            "rpModalModel",
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
