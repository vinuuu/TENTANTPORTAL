angular.module("rpWorkspaces", []);

//  Source: _lib\realpage\workspaces\js\templates\templates.inc.js
angular.module("rpWorkspaces").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/workspaces/templates/workspaces.html",
"<div class=\"rp-workspaces scroll-workspace\"><!-- <rp-busy-indicator model=\"busyModel\">\n" +
"    </rp-busy-indicator>\n" +
"    --><div class=\"rp-workspaces-list\" ng-class=\"listCtrl.list.state\"><rp-toggle model=\"listCtrl.list.state.active\" class=\"rp-workspaces-list-toggle header-text ft-medium ft-s-18 ft-track-20\" options=\"{\n" +
"                bodyToggle: true,\n" +
"                activeText: 'Workspaces',\n" +
"                defaultText: 'Workspaces',\n" +
"                defaultIconClass: 'rp-icon-angle-up',\n" +
"                activeIconClass: 'rp-icon-angle-down'\n" +
"            }\"></rp-toggle><ul rp-stop-event=\"click\" class=\"rp-workspaces-list-wrap dropdown-menu dropdown-menu-width ft-form\"><li class=\"rp-workspaces-list-item\" ng-if=\"!workspace.isPlaceholder()\" ng-repeat=\"workspace in model.list track by workspace.id\"><label for=\"{{::workspace.id}}\" class=\"rp-workspaces-list-item-label md-check dark-bluebox\">{{::workspace.getTitle()}} <input type=\"checkbox\" id=\"{{::workspace.id}}\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"ui-check\" ng-change=\"model.save()\" ng-model=\"workspace.data().isActive\"> <i class=\"primary\"></i></label></li></ul></div><rp-daterangepicker ng-if=\"model.isDateSensitive()\" rp-model=\"workspaces.dateRange\" class=\"inline workspaces-date-range\" config=\"workspaces.daterangepickerConfig\"></rp-daterangepicker><div class=\"rp-workspaces-border-b b-b b-b-neutral-06\"></div><span class=\"scroll-left rp-icon-angle-right text-neutral-04\" ng-click=\"workspaceScroll.left()\" ng-class=\"workspaceScroll.state.scrollLeft\"></span> <span class=\"scroll-right rp-icon-angle-left text-neutral-04\" ng-click=\"workspaceScroll.right()\" ng-class=\"workspaceScroll.state.scrollRight\"></span><div class=\"rp-workspaces-screen-wrap\"><div class=\"rp-workspaces-screen rp-draggable-wrap\"><div class=\"rp-workspaces-slider\"><div ng-show=\"workspace.isActive()\" rp-droppable=\"{{::workspace.id}}\" rp-draggable=\"{{::workspace.id}}\" rp-drag=\"workspaces.drag(workspace)\" rp-drag-enabled=\"workspace.allowDrag\" rp-drag-end=\"workspaces.endDrag(workspace)\" rp-drag-start=\"workspaces.startDrag(workspace)\" class=\"rp-workspace {{workspace.data().className}}\" ng-repeat=\"workspace in model.list track by workspace.id\"><div class=\"rp-workspaces-box\"><div class=\"box-workspaces-header b-b b-b-neutral-04\"><h3 class=\"text-primary ft-medium ft-s-16 ft-track-5 text-u-c\">{{::workspace.getTitle()}}</h3></div><ul ng-mouseout=\"workspace.enableDrag()\" ng-mouseover=\"workspace.disableDrag()\" rp-touchend=\"workspace.enableDrag()\" rp-touchstart=\"workspace.disableDrag()\" class=\"metrics details-{{workspace.metricCount()}}\"><li ng-click=\"workspace.goTo(detail)\" ng-repeat=\"detail in workspace.data().details\" class=\"{{::workspace.getListClass()}} {{$even ? ' pad-left' : ' pad-right'}}\"><span class=\"metric text-{{detail.status}}\">{{::detail.metric}} </span><span class=\"desc\" title=\"{{::workspace.getDesc(detail)}}\">{{::workspace.getDesc(detail)}}</span></li></ul></div></div></div></div></div></div>");
}]);


//  Source: _lib\realpage\workspaces\js\services\workspaces.js
//  Workspaces Service

(function (angular) {
    "use strict";

    function factory($resource) {
        var svc = {};

        svc.config = {
            dateSensitive: true
        };

        svc.get = angular.noop;

        svc.save = angular.noop;

        svc.setConfig = function (config) {
            angular.extend(svc.config, config);
            svc.configGet().configSave();
            return svc;
        };

        svc.configGet = function () {
            var ds, url, defaults;

            ds = svc.config.dateSensitive;

            url = svc.config.getUrl + (ds ? '/:startDate/:endDate' : '');

            defaults = {
                endDate: 1445230800000,
                startDate: 1446267600000
            };

            svc.get = $resource(url, ds ? defaults : {}).get;

            return svc;
        };

        svc.configSave = function () {
            var url, actions;

            actions = {
                save: {
                    method: 'PUT'
                }
            };

            url = svc.config.saveUrl;

            svc.save = $resource(url, {}, actions).save;

            return svc;
        };

        svc.isDateSensitive = function () {
            return svc.config.dateSensitive;
        };

        return svc;
    }

    angular
        .module("rpWorkspaces")
        .factory('workspaces', ['$resource', factory]);
})(angular);

//  Source: _lib\realpage\workspaces\js\services\workspaces-links.js
//  Workspaces Links Service

(function (angular) {
    "use strict";

    function factory($window) {
        var svc = {};

        svc.links = {};

        svc.setLinks = function (links) {
            if (links) {
                svc.links = links;
            }
        };

        svc.goTo = function (guid) {
            if (svc.links[guid]) {
                $window.location.href = svc.links[guid];
            }
            else {
                logc('WorkspaceLinks: ' + guid + ' does not have a link defined!');
            }
        };

        return svc;
    }

    angular
        .module("rpWorkspaces")
        .factory('workspacesLinks', ['$window', factory]);
})(angular);

//  Source: _lib\realpage\workspaces\js\services\workspaces-config.js
//  Workspaces Config Service

(function (angular) {
    "use strict";

    function factory(workspaces, links, dateRange, workspaceTranslate) {
        var svc = {};

        svc.config = {
            links: {},
            getUrl: "",
            translate: {},
            appName: "lrc",
            dateSensitive: true,
            saveUrl: "/api/core/common/workspace"
        };

        svc.setConfig = function (data) {
            angular.extend(svc.config, data);
            workspaces.setConfig(svc.config);
            links.setLinks(svc.config.links);
            dateRange.setAppName(svc.config.appName);
            workspaceTranslate.set(data.translator);
        };

        return svc;
    }

    angular
        .module("rpWorkspaces")
        .factory("workspacesConfig", [
            "workspaces",
            "workspacesLinks",
            "workspacesDateRange",
            "workspaceTranslate",
            factory
        ]);
})(angular);


//  Source: _lib\realpage\workspaces\js\models\workspace-scroll.js
//  Workspace Scroll Model

(function (angular) {
    "use strict";

    function factory(eventStream) {
        var model = {};

        model.events = eventStream();

        model.state = {
            scrollLeft: {
                hide: false
            },

            scrollRight: {
                hide: true
            }
        };

        model.getState = function () {
            return model.state;
        };

        model.reset = function () {
            model.state.scrollLeft.hide = false;
            model.state.scrollRight.hide = true;
            return model;
        };

        model.publish = function (eventName) {
            model.events.publish(eventName);
            return model;
        };

        model.subscribe = function (fn) {
            model.events.subscribe(fn);
            return model;
        };

        model.hideScrollLeft = function (bool) {
            model.state.scrollLeft.hide = bool;
            return model;
        };

        model.hideScrollRight = function (bool) {
            model.state.scrollRight.hide = bool;
            return model;
        };

        return model;
    }

    angular
        .module("rpWorkspaces")
        .factory('workspaceScrollModel', ['eventStream', factory]);
})(angular);

//  Source: _lib\realpage\workspaces\js\models\workspace.js
//  Workspace Model

(function (angular) {
    "use strict";

    function factory(links, cookie, workspaceTranslate) {
        var index = 1;

        return function (id) {
            var model = {};

            model.id = id || 'workspace' + index++;

            model.allowDrag = true;

            model._data = {
                details: [],
                isActive: false
            };

            model.data = function (data) {
                if (data) {
                    model._data = data;
                    return model;
                }
                else {
                    return model._data;
                }
            };

            model.getID = function () {
                return model.id;
            };

            model.enableDrag = function () {
                model.allowDrag = true;
            };

            model.disableDrag = function () {
                model.allowDrag = false;
            };

            model.state = function () {
                return {
                    active: model._data.isActive
                };
            };

            model.isActive = function () {
                return model._data.isActive;
            };

            model.isPlaceholder = function () {
                return model._data.className == 'placeholder';
            };

            model.is = function (item) {
                return model.id === item.id;
            };

            model.metricCount = function () {
                return model._data.details.length;
            };

            model.getTitle = function () {
                return workspaceTranslate.translate(model._data.guid + "-title");
            };

            model.setDirty = function () {
                model._data.dirtyBit = true;
                return model;
            };

            model.goTo = function (workspaceDetail) {
                if (workspaceDetail.disabled) {
                    return;
                }

                var key = workspaceDetail.guid + "-desc",
                    val = workspaceTranslate.translate(key);

                model.setCookie(val);
                links.goTo(model._data.guid);
            };

            model.setCookie = function (val) {
                cookie.create('WorkspaceLink', val, 1);
            };

            model.setSequence = function (sequence) {
                model._data.sequence = sequence;
                return model;
            };

            model.getDesc = function (workspaceDetail) {
                var desc, tranDesc;
                tranDesc = workspaceTranslate.translate(workspaceDetail.guid + "-desc");
                desc = workspaceDetail.description === "" ? "" : ": " + workspaceDetail.description;
                desc = tranDesc + desc;
                return desc;
            };

            model.getListClass = function () {
                var cnt = model.metricCount();
                var className = "";
                switch (cnt) {
                case 1:
                    className = "col-xs-12";
                    break;
                case 2:
                    className = "col-xs-6";
                    break;
                case 3:
                    className = "col-xs-12";
                    break;
                case 4:
                    className = "col-xs-6";
                    break;
                case 5:
                    className = "col-xs-6";
                    break;
                case 6:
                    className = "col-xs-6";
                    break;
                default:
                    className = "col-xs-6";
                    break;
                }

                if (model._data.disabled) {
                    className += " link-disabled";
                }

                return className;
            };

            return model;
        };
    }

    angular
        .module("rpWorkspaces")
        .factory('workspaceModel', ['workspacesLinks', 'rpCookie', 'workspaceTranslate', factory]);
})(angular);

//  Source: _lib\realpage\workspaces\js\models\workspaces-date-range.js
//  Workspaces Date Range Model

(function (angular) {
    "use strict";

    function factory(moment, storage) {
        var model = {};

        model.id = 'workspacesDateRange';

        model.setAppName = function (name) {
            model.id = name + 'WorkspacesDateRange';
            return model;
        };

        model.get = function (fmt) {
            var range = {};

            if (storage.has(model.id)) {
                var data = storage.get(model.id);
                range.endDate = moment(data.endDate, "x");
                range.startDate = moment(data.startDate, "x");
            }
            else {
                range.endDate = moment().endOf("month");
                range.startDate = moment().startOf("day");
            }

            if (fmt) {
                range = {
                    endDate: range.endDate.format(fmt),
                    startDate: range.startDate.format(fmt)
                };
            }

            return range;
        };

        model.set = function (data) {
            storage.set(model.id, data);
        };

        return model;
    }

    angular
        .module("rpWorkspaces")
        .factory('workspacesDateRange', ['moment', 'rpSessionStorage', factory]);
})(angular);

//  Source: _lib\realpage\workspaces\js\models\workspaces.js
//  Workspaces Model

(function (angular, und) {
    "use strict";

    function factory(workspaces, workspaceModel) {
        var model = {};

        model.list = [];

        model._placeholderIndex = und;

        model._placeholder = workspaceModel('placeholder').data({
            title: '',
            details: [],
            isActive: true,
            className: 'placeholder'
        });

        model.isDateSensitive = function () {
            return workspaces.isDateSensitive();
        };

        model.load = function (params) {
            model.flush();

            if (params) {
                return workspaces.get(params, model.update).$promise;
            }
            else {
                return workspaces.get(model.update).$promise;
            }
        };

        model.update = function (data) {
            data.records = data.records || [];
            data.records.forEach(model.addToList);
        };

        model.addToList = function (workspaceData) {
            var workspace = workspaceModel().data(workspaceData);
            model.list.push(workspace);
        };

        model.getIndex = function (workspace) {
            var workspaceIndex;

            model.list.forEach(function (item, index) {
                if (workspace.is(item)) {
                    workspaceIndex = index;
                }
            });

            return workspaceIndex;
        };

        model.insertWorkspaceAt = function (index, workspace) {
            model.list.insertAt(index, workspace);
            return model;
        };

        model.removeWorkspace = function (workspace) {
            model.list = model.list.filter(function (item) {
                return !workspace.is(item);
            });
            return model;
        };

        model.eachWorkspace = function (fn) {
            model.list.forEach(fn);
            return model;
        };

        model.insertPlaceholderAt = function (index) {
            model._placeholderIndex = index;
            model.insertWorkspaceAt(index, model._placeholder);
        };

        model.removePlaceholder = function () {
            model.removeWorkspace(model._placeholder);
            return model;
        };

        model.replacePlaceholderWith = function (workspace) {
            var plIndex = model._placeholderIndex,
                oldIndex = model.getIndex(workspace),
                newIndex = oldIndex < plIndex ? plIndex - 1 : plIndex;

            model
                .removeWorkspace(workspace)
                .removePlaceholder()
                .insertWorkspaceAt(newIndex, workspace);

            return model;
        };

        model.flush = function () {
            model.list.flush();
        };

        model.updatedList = function () {
            var list = [];

            model.list.forEach(function (workspace, index) {
                workspace.setSequence(index + 1).setDirty();
                list.push(workspace.data());
            });

            return {
                workspaceList: list
            };
        };

        model.save = function (params) {
            var data = model.updatedList();
            return workspaces.save(params, data).$promise;
        };

        return model;
    }

    angular
        .module("rpWorkspaces")
        .factory('workspacesModel', ['workspaces', 'workspaceModel', factory]);
})(angular);

//  Source: _lib\realpage\workspaces\js\models\workspace-translate.js
//  Workspaces Date Range Model

(function (angular) {
    "use strict";

    function factory() {
        var model = {
            translator: {
                translate: angular.noop
            }
        };

        model.set = function (translator) {
            model.translator = translator;
        };

        model.translate = function (langKey) {
            return model.translator.translate(langKey);
        };

        return model;
    }

    angular
        .module("rpWorkspaces")
        .factory('workspaceTranslate', [factory]);
})(angular);


//  Source: _lib\realpage\workspaces\js\controllers\workspaces.js
//  Workspaces Controller

(function (angular, und) {
    "use strict";

    function WorkspacesCtrl($scope, session, model, dateRange, draggable, droppable, busyModelSvc, daterangepickerConfig) {
        var vm = this,
            firstPass = true;

        vm.busy = false;
        vm.activeIndex = und;
        vm.activeWorkspace = und;

        vm.init = function () {
            $scope.model = model;
            $scope.busyModel = busyModelSvc();

            if (model.isDateSensitive()) {
                vm.initDaterangePicker();
            }

            if (session.isReady()) {
                vm.updateModel();
            }

            $scope.$on("$destroy", vm.destroy);

            vm.sessionWatch = session.subscribe("update", vm.updateModel);
        };

        vm.initDaterangePicker = function () {
            vm.dateRange = dateRange.get();

            vm.daterangepickerConfig = daterangepickerConfig({
                onChange: vm.onDateRangeChange
            });
        };

        vm.onDateRangeChange = function (dateRangeData) {
            dateRange.set(dateRangeData);
            vm.updateModel();
        };

        vm.updateModel = function () {
            if (vm.busy) {
                return;
            }

            vm.busy = true;
            var dateRangeData = dateRange.get("x");

            $scope.busyModel.busy();

            if (model.isDateSensitive()) {
                model.load(dateRangeData).then(vm.afterUpdate);
            }
            else {
                model.load().then(vm.afterUpdate);
            }
        };

        vm.afterUpdate = function () {
            $scope.busyModel.off();
            vm.busy = false;
        };

        vm.startDrag = function (workspace) {
            vm.activeIndex = model.getIndex(workspace);
            model.insertPlaceholderAt(vm.activeIndex);
        };

        vm.drag = function (workspace) {
            vm.activeWorkspace = workspace;
            model.eachWorkspace(vm.movePlaceholder);
        };

        vm.movePlaceholder = function (item, index) {
            if (item.is(vm.activeWorkspace) || item.isPlaceholder()) {
                return;
            }

            var id = vm.activeWorkspace.getID(),
                point = draggable(id).dragPoint();

            if (droppable(item.getID()).contains(point) && index != vm.activeIndex) {
                vm.activeIndex = index;
                model.removePlaceholder().insertPlaceholderAt(index);
            }
        };

        vm.endDrag = function (workspace) {
            model.replacePlaceholderWith(workspace).save();
        };

        vm.destroy = function () {
            model.flush();
            vm.sessionWatch();
        };

        vm.init();
    }

    angular
        .module("rpWorkspaces")
        .controller("WorkspacesCtrl", [
            "$scope",
            "sessionInfo",
            "workspacesModel",
            "workspacesDateRange",
            "rpDraggableSvc",
            "rpDroppableSvc",
            "rpBusyIndicatorModel",
            "rpDaterangepickerConfig",
            WorkspacesCtrl
        ]);
})(angular);


//  Source: _lib\realpage\workspaces\js\directives\workspace-screen.js
//  Workspace Screen Directive

(function (angular) {
    "use strict";

    function workspacesScreen(model, timeout) {
        function link(scope, elem, attr) {
            var dir = {},
                updateTimer;

            dir.init = function () {
                scope.workspacesScreen = dir;
                model.reset().subscribe(dir.eventHandler);
                elem.on('scroll', dir.onScroll);
            };

            dir.onScroll = function () {
                timeout.cancel(updateTimer);
                updateTimer = timeout(dir.updateControls, 200);
            };

            dir.updateControls = function () {
                var stops = dir.getStops(),
                    scroll = dir.getScroll();

                model.hideScrollRight(scroll === 0);
                model.hideScrollLeft(scroll >= stops[stops.length - 1] - 2);
            };

            dir.eventHandler = function (eventName) {
                dir[eventName]();
            };

            dir.sliderWidth = function () {
                return elem.children('.rp-workspaces-slider').outerWidth();
            };

            dir.slideWidth = function () {
                return elem.children('.rp-workspaces-slider').children('.rp-workspace').outerWidth(true);
            };

            dir.screenWidth = function () {
                return elem.width();
            };

            dir.getScroll = function () {
                return elem.scrollLeft();
            };

            dir.getStep = function () {
                return dir.slideWidth() * Math.floor(dir.screenWidth() / dir.slideWidth());
            };

            dir.getStops = function () {
                var stop = 0,
                    stops = [],
                    step = dir.getStep(),
                    max = dir.sliderWidth() - dir.screenWidth();

                while (stop < max) {
                    stops.push(stop);
                    stop += step;
                    if (stop > max) {
                        stop = max;
                        stops.push(stop);
                    }
                }

                return stops;
            };

            dir.scrollLeft = function () {
                var newStop,
                    stops = dir.getStops(),
                    scroll = dir.getScroll();

                stops.forEach(function (stop) {
                    if (!newStop && stop > scroll) {
                        newStop = stop;
                    }
                });

                dir.animate(newStop);
            };

            dir.scrollRight = function () {
                var newStop,
                    scroll = dir.getScroll(),
                    stops = dir.getStops().reverse();

                stops.forEach(function (stop) {
                    if (!newStop && stop < scroll) {
                        newStop = stop;
                    }
                });

                dir.animate(newStop);
            };

            dir.animate = function (scroll) {
                elem.animate({
                    scrollLeft: scroll
                }, 200);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpWorkspaces")
        .directive('rpWorkspacesScreen', [
            'workspaceScrollModel',
            'timeout',
            workspacesScreen
        ]);
})(angular);

//  Source: _lib\realpage\workspaces\js\directives\workspace-scroll.js
//  Scroll Workspace Directive

(function (angular) {
    "use strict";

    function scrollWorkspace(model) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.state = model.getState();

            dir.init = function () {
                scope.workspaceScroll = dir;
            };

            dir.left = function () {
                model.publish('scrollLeft');
            };

            dir.right = function () {
                model.publish('scrollRight');
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpWorkspaces")
        .directive('scrollWorkspace', ['workspaceScrollModel', scrollWorkspace]);
})(angular);

//  Source: _lib\realpage\workspaces\js\directives\workspaces.js
//  Workspaces Directive

(function (angular) {
    "use strict";

    function rpWorkspaces() {
        function link(scope, elem, attr) {}

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            controller: 'WorkspacesCtrl as workspaces',
            templateUrl: "realpage/workspaces/templates/workspaces.html"
        };
    }

    angular
        .module("rpWorkspaces")
        .directive('rpWorkspaces', [rpWorkspaces]);
})(angular);
