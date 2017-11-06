//  Source: _lib\realpage\property-picker\js\_bundle.inc
angular.module("rpPropertyPicker", []);

//  Source: _lib\realpage\property-picker\js\templates\templates.inc.js
angular.module("rpPropertyPicker").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/property-picker/templates/property-context.html",
"<div class=\"rp-property-context\" ng-click=\"context.togglePicker()\"><i class=\"icon\" ng-class=\"context.model.iconState\"></i><div class=\"property-name\" title=\"{{context.model.property.name}}\">{{context.model.property.name}}</div><div class=\"property-address\" title=\"{{context.model.property.address}}\">{{context.model.property.address}}</div></div>");
$templateCache.put("realpage/property-picker/templates/property-picker.html",
"<div ng-class=\"picker.state\" class=\"rp-property-picker\"><span class=\"divider-h fw\"></span> <span class=\"icon-close rp-icon-delete-2\" ng-click=\"picker.close()\"></span><ul class=\"nav nav-md ng-hide\"><li class=\"nav-item inline\"><a class=\"nav-link active\" href=\"\" data-toggle=\"tab\" data-target=\"#tab_0\"><span class=\"text-md\">RealPage Icons</span> <small class=\"block text-muted hidden-xs\">Custom Icons by RealPage</small></a></li><li class=\"nav-item inline\"><a class=\"nav-link\" href=\"\" data-toggle=\"tab\" data-target=\"#tab_1\"><span class=\"text-md\">Font Awesome</span> <small class=\"block text-muted hidden-xs\">Awesome font icons</small></a></li><li class=\"nav-item inline\"><a class=\"nav-link\" href=\"\" data-toggle=\"tab\" data-target=\"#tab_2\"><span class=\"text-md\">Material <span class=\"hidden-xs\">Design</span></span> <small class=\"block text-muted hidden-xs\">Google material design icons</small></a></li></ul><div class=\"slider-wrap\" ng-class=\"picker.propertyInfo.state\"><div class=\"slider\"><div class=\"select-property\"><h2 class=\"ft-medium ft-s-18 ft-track-20\">Select a Property</h2><div class=\"property-list-wrap\" ng-controller=\"RpPropertyListCtrl as propertyList\"><div class=\"filters row\"><div class=\"col-md-6\"><input class=\"form-control\" placeholder=\"Property name\" ng-model=\"propertyList.model.filter.name\"></div><div class=\"col-md-3\"><select class=\"form-control c-select\" ng-model=\"propertyList.model.filter.state\" ng-options=\"option.value as option.name for option in propertyList.model.states.options\"></select></div><div class=\"col-md-3\"><select class=\"form-control c-select\" ng-model=\"propertyList.model.filter.country\" ng-options=\"option.value as option.name for option in propertyList.model.countries.options\"></select></div></div><div class=\"list-group property-list\"><a href=\"\" class=\"list-group-item property\" ng-click=\"propertyList.selectProperty(property)\" ng-repeat=\"property in propertyList.model.list | filter: propertyList.model.filter\"><span rp-kill-event=\"click\" class=\"pull-right text-primary icon-info\" ng-click=\"propertyList.showPropInfo(property)\"><i class=\"rp-icon-info-circle\"></i></span><div class=\"block _500\">{{property.name}}</div><div class=\"text-muted\">{{property.address}}</div></a></div></div></div><div class=\"property-info\" ng-controller=\"RpPropertyInfoCtrl as propertyInfo\"><p class=\"back-to-property-list\" ng-click=\"propertyInfo.hide()\"><i class=\"icon rp-icon-angle-left\"></i> Property List</p><h3 class=\"ft-medium ft-s-16 ft-track-5\">{{propertyInfo.model.property.name}}</h3><p class=\"ar-date\" ng-if=\"propertyInfo.model.arDate\"><span class=\"ar-date-label\">A/R Date</span> <span class=\"ar-date-value\">{{propertyInfo.model.arDate}}</span></p><h4 class=\"centers-title\">Active Centers</h4><ul class=\"centers-list\"><li ng-repeat=\"center in propertyInfo.model.centers\">{{center.name}}</li></ul></div></div></div><div class=\"property-groups\" ng-controller=\"RpPropertyGroupsCtrl as pgs\"><h2 class=\"ft-medium ft-s-18 ft-track-20\">Property Groups</h2><ul class=\"property-groups-list\"><li ng-click=\"pgs.selectGroup(group)\" class=\"property-group text-primary\" ng-repeat=\"group in pgs.model.groupsList\">{{group.name}}</li></ul></div><span class=\"divider-h fw\"></span></div>");
}]);


//  Source: _lib\realpage\property-picker\js\services\property-context.js
//  Property Context Swithc Service

(function (angular) {
    "use strict";

    function rpPropertyContext($resource) {
        var url, defaults, actions;

        defaults = {
            siteID: 1000,
            recordActivity: 1
        };

        url = '/api/core/common/changeproperty/:siteID/:recordActivity';

        actions = {
            switchTo: {
                method: 'POST',
                params: {
                    siteID: '@siteID',
                    recordActivity: '@recordActivity'
                }
            }
        };

        return $resource(url, defaults, actions);
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyContext", ["$resource", rpPropertyContext]);
})(angular);


//  Source: _lib\realpage\property-picker\js\models\filter.js
//  Picker States Model

(function (angular) {
    "use strict";

    function factory() {
        return function () {
            var model,
                params = {};

            model = {
                keys: [],
                options: [],
                nameKey: "name",
                valueKey: "value"
            };

            model.defaultOption = {
                name: "All",
                value: ""
            };

            model.setNameKey = function (key) {
                model.nameKey = key;
                return model;
            };

            model.setValueKey = function (key) {
                model.valueKey = key;
                return model;
            };

            model.setDefault = function (option) {
                var isValid = model.nameKey &&
                    model.valueKey &&
                    option[model.nameKey] &&
                    option[model.valueKey];

                if (isValid) {
                    model.defaultOption = {
                        name: option[model.nameKey],
                        value: option[model.valueKey]
                    };
                }
                else {
                    logc("rpPickerFilterModel: Invalid default option!");
                }

                return model;
            };

            model.reset = function () {
                model.keys = [];
                model.options = [model.defaultOption];
                return model;
            };

            model.addOption = function (option) {
                if (model.keys.indexOf(option[model.nameKey]) == -1) {
                    model.options.push(option);
                    model.keys.push(option[model.nameKey]);
                }
                return model;
            };

            model.setOptions = function (options) {
                options.forEach(model.addOption);
            };

            return model;
        };
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPickerFilterModel", [factory]);
})(angular);

//  Source: _lib\realpage\property-picker\js\models\property-picker-state.js
//  Property Picker State

(function (angular) {
    "use strict";

    function factory(cookie, eventStream) {
        var model = {};

        model.change = eventStream();

        model.data = {
            open: false,
            inactive: cookie.read("crossover") === "True"
        };

        model.get = function () {
            return model.data;
        };

        model.toggle = function () {
            if (cookie.read("crossover") !== "True") {
                model.data.open = !model.data.open;
                model.publish();
            }
        };

        model.close = function () {
            model.data.open = false;
            model.publish();
        };

        model.publish = function () {
            model.change.publish(model.data.open);
        };

        model.subscribe = function (cb) {
            model.change.subscribe(cb);
        };

        return model;
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyPickerState", ["rpCookie", "eventStream", factory]);
})(angular);


//  Source: _lib\realpage\property-picker\js\controllers\property-groups.js
//  Property Groups Controller

(function (angular) {
    "use strict";

    function RpPropertyGroupsCtrl(propertyGroups, propertyContext) {
        var vm = this;

        vm.init = function () {
            vm.model = propertyGroups;
        };

        vm.selectGroup = function (group) {
            propertyContext.switchTo(group);
        };

        vm.init();
    }

    angular
        .module("rpPropertyPicker")
        .controller("RpPropertyGroupsCtrl", [
            "rpPropertyGroupsModel",
            "rpPropertyContextModel",
            RpPropertyGroupsCtrl
        ]);
})(angular);

//  Source: _lib\realpage\property-picker\js\models\property-groups.js
//  Property Groups Model

(function (angular) {
    "use strict";

    function factory(session) {
        var model = {};

        model.load = function () {
            model.groupsList = [{
                name: "All My Properties",
                siteID: session.get("pmcid")
            }];
        };

        model.flush = function () {
            model.groupsList = [];
        };

        return model;
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyGroupsModel", ["sessionInfo", factory]);
})(angular);


//  Source: _lib\realpage\property-picker\js\models\property-list.js
//  Property List Model

(function (angular) {
    "use strict";

    function factory(propertyList, filterModel) {
        var model,
            states = filterModel(),
            countries = filterModel();

        model = {
            list: [],
            states: states,
            countries: countries
        };

        model.initFilter = function () {
            model.filter = {
                name: "",
                state: "",
                country: ""
            };

            return model;
        };

        model.load = function () {
            model.initFilter();
            propertyList.get(model.onLoad);
        };

        model.flush = function () {
            model.list.flush();
        };

        model.onLoad = function (data) {
            model.list = data.list;

            states.reset();
            countries.reset();

            data.list.forEach(function (item) {
                if (item.state) {
                    states.addOption({
                        name: item.state,
                        value: item.state
                    });
                }

                if (item.country) {
                    countries.addOption({
                        name: item.country,
                        value: item.country
                    });
                }
            });
        };

        return model.initFilter();
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyListModel", [
            "rpPropertyList",
            "rpPickerFilterModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\property-picker\js\controllers\property-list.js
//  Property List Controller

(function (angular) {
    "use strict";

    function RpPropertyListCtrl(model, pickerState, propertyContext, propertyInfo, propertyGroups) {
        var vm = this;

        vm.init = function () {
            vm.model = model;
            pickerState.subscribe(vm.onChange);
        };

        vm.onChange = function (load) {
            model[load ? "load" : "flush"]();
            propertyGroups[load ? "load" : "flush"]();
        };

        vm.selectProperty = function (property) {
            propertyContext.switchTo(property);
        };

        vm.showPropInfo = function (property) {
            propertyInfo.load(property);
        };

        vm.init();
    }

    angular
        .module("rpPropertyPicker")
        .controller("RpPropertyListCtrl", [
            "rpPropertyListModel",
            "rpPropertyPickerState",
            "rpPropertyContextModel",
            "rpPropertyInfoModel",
            "rpPropertyGroupsModel",
            RpPropertyListCtrl
        ]);
})(angular);

//  Source: _lib\realpage\property-picker\js\services\property-list.js
//  Property List Service

(function (angular) {
    "use strict";

    function rpPropertyList($resource) {
        var url;

        url = "/api/core/common/changeproperty";

        return $resource(url);
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyList", ["$resource", rpPropertyList]);
})(angular);


//  Source: _lib\realpage\property-picker\js\models\property-info.js
//  Property Info Model

(function (angular) {
    "use strict";

    function factory(propertyInfo) {
        var state,
            model = {};

        model.state = state = {
            active: false
        };

        model.load = function (property) {
            var data = {
                siteID: property.siteID
            };

            model.property = property;
            propertyInfo.get(data, model.onLoad);
        };

        model.onLoad = function (data) {
            state.active = true;
            model.arDate = data.details.arDate;
            model.centers = data.details.centers;
        };

        model.hide = function () {
            state.active = false;
        };

        return model;
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyInfoModel", ["rpPropertyInfo", factory]);
})(angular);

//  Source: _lib\realpage\property-picker\js\controllers\property-info.js
//  Property Info Controller

(function (angular) {
    "use strict";

    function RpPropertyInfoCtrl(model) {
        var vm = this;

        vm.init = function () {
            vm.model = model;
        };

        vm.hide = function () {
            model.hide();
        };

        vm.init();
    }

    angular
        .module("rpPropertyPicker")
        .controller("RpPropertyInfoCtrl", ["rpPropertyInfoModel", RpPropertyInfoCtrl]);
})(angular);

//  Source: _lib\realpage\property-picker\js\services\property-info.js
//  Property Info Service

(function (angular) {
    "use strict";

    function rpPropertyInfo($resource) {
        var url, defaults, actions;

        actions = {};

        defaults = {
            siteID: 1192563
        };

        url = "/api/core/common/changeproperty/:siteID/details";

        return $resource(url, defaults, actions);
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyInfo", ["$resource", rpPropertyInfo]);
})(angular);


//  Source: _lib\realpage\property-picker\js\models\property-picker.js
//  Property Picker Model

(function (angular) {
    "use strict";

    function factory() {
        var model = {};

        model.update = function () {

        };

        return model;
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyPickerModel", [factory]);
})(angular);

//  Source: _lib\realpage\property-picker\js\controllers\property-picker.js
//  Property Picker Controller

(function (angular) {
    "use strict";

    function RpPropertyPickerCtrl(pickerState, propertyInfo) {
        var vm = this;

        vm.init = function () {
            vm.state = pickerState.get();
            vm.propertyInfo = propertyInfo;
        };

        vm.close = function () {
            pickerState.close();
        };

        vm.init();
    }

    angular
        .module("rpPropertyPicker")
        .controller("RpPropertyPickerCtrl", [
            "rpPropertyPickerState",
            "rpPropertyInfoModel",
            RpPropertyPickerCtrl
        ]);
})(angular);

//  Source: _lib\realpage\property-picker\js\directives\property-picker.js
//  Property Picker Directive

(function (angular) {
    "use strict";

    function rpPropertyPicker() {
        function link(scope, elem, attr) {

        }

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            controller: "RpPropertyPickerCtrl as picker",
            templateUrl: "realpage/property-picker/templates/property-picker.html"
        };
    }

    angular
        .module("rpPropertyPicker")
        .directive("rpPropertyPicker", [rpPropertyPicker]);
})(angular);


//  Source: _lib\realpage\property-picker\js\models\property-context.js
//  Property Context Model

(function (angular) {
    "use strict";

    function factory(session, propertyContext, pickerState) {
        var model = {};

        model.init = function () {
            model.iconState = pickerState.get();
            model.sessionWatch = session.subscribe("update", model.setContext);

            if (session.isReady()) {
                model.setContext();
            }

            return model;
        };

        model.setContext = function (data) {
            if (data && data.name) {
                model.property = {
                    name: data.name,
                    address: data.address
                };
            }
            else {
                model.property = {
                    name: session.get("siteName"),
                    address: session.get("address")
                };

                model.sessionWatch();
            }

            pickerState.close();
        };

        model.switchTo = function (context) {
            model.setContext(context);

            var data = {
                recordActivity: 1,
                siteID: context.siteID
            };

            propertyContext.switchTo(data, model.onSwitch);
        };

        model.onSwitch = function () {
            session.load();
        };

        return model.init();
    }

    angular
        .module("rpPropertyPicker")
        .factory("rpPropertyContextModel", [
            "sessionInfo",
            "rpPropertyContext",
            "rpPropertyPickerState",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\property-picker\js\controllers\property-context.js
//  Property Context Controller

(function (angular) {
    "use strict";

    function RpPropertyContextCtrl(model, pickerState) {
        var vm = this;

        vm.init = function () {
            vm.model = model;
        };

        vm.togglePicker = function () {
            pickerState.toggle();
        };

        vm.init();
    }

    angular
        .module("rpPropertyPicker")
        .controller("RpPropertyContextCtrl", [
            "rpPropertyContextModel",
            "rpPropertyPickerState",
            RpPropertyContextCtrl
        ]);
})(angular);

//  Source: _lib\realpage\property-picker\js\directives\property-context.js
//  Property Context Directive

(function (angular) {
    "use strict";

    function rpPropertyContext() {
        function link(scope, elem, attr) {

        }

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            controller: "RpPropertyContextCtrl as context",
            templateUrl: "realpage/property-picker/templates/property-context.html"
        };
    }

    angular
        .module("rpPropertyPicker")
        .directive("rpPropertyContext", [rpPropertyContext]);
})(angular);

