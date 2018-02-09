//  Source: _lib\realpage\carousel\js\components\carousel.js
// Carousel Component

(function (angular, undefined) {
    "use strict";

    function Controller($scope, windowSize) {
        var vm = this;

        vm.$onInit = function () {
            vm.winSizeWatch = windowSize.subscribe(vm.onWinSizeChange);
        };

        vm.$onDestroy = function () {
            vm.winSizeWatch();
            vm.model.destroy();
        };

        vm.onWinSizeChange = function () {
            $scope.$apply(vm.resetModel);
        };

        vm.resetModel = function () {
            vm.model.reset();
        };

        vm.getState = function () {
            return vm.model.getState();
        };

        vm.setScreen = function (screen) {
            vm.model.setScreen(screen);
        };

        vm.setSlider = function (slider) {
            vm.model.setSlider(slider);
        };

        vm.scrollLeft = function () {
            vm.model.scrollLeft();
        };

        vm.scrollRight = function () {
            vm.model.scrollRight();
        };
    }

    var component = {
        bindings: {
            model: "="
        },
        controller: [
            "$scope",
            "windowSize",
            Controller
        ],
        templateUrl: "realpage/carousel/templates/carousel.html"
    };

    angular
        .module("rpCarousel")
        .component("rpCarousel", component);
})(angular);

//  Source: _lib\realpage\carousel\js\components\carousel-unit.js
// Carousel Unit Component

(function (angular, undefined) {
    "use strict";

    function Controller($scope, $compile, $elem, timeout) {
        var vm = this;

        vm.$onInit = function () {
            if (vm.model.hasTemplateUrl()) {
                timeout(vm.updateUnitContent, 50);
            }
        };

        vm.updateUnitContent = function () {
            $elem.html(vm.getContent());
        };

        vm.getContent = function () {
            var newScope = $scope.$new(),
                content = vm.model.getTemplateContent();

            newScope.model = vm.model;
            return $compile(content)($scope);
        };
    }

    var component = {
        bindings: {
            model: "="
        },
        controller: [
            "$scope",
            "$compile",
            "$element",
            "timeout",
            Controller
        ],
        templateUrl: "realpage/carousel/templates/carousel-unit.html"
    };

    angular
        .module("rpCarousel")
        .component("rpCarouselUnit", component);
})(angular);

//  Source: _lib\realpage\carousel\js\directives\carousel-screen.js
//  Carousel Screen Directive

(function (angular, undefined) {
    "use strict";

    function rpCarouselScreen() {
        function link(scope, elem, attr) {
            var dir = {},
                scroll = "scroll.rpCarouselScreen";

            dir.init = function () {
                scope.$ctrl.setScreen(dir);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.setHeight = function (height) {
                elem.height(height);
                elem.parent().height(height);
            };

            dir.getScrollLeft = function () {
                return elem.scrollLeft();
            };

            dir.getWidth = function () {
                return elem.width();
            };

            dir.scrollLeft = function (scrollLeft) {
                elem.animate({
                    scrollLeft: scrollLeft
                }, 200);
            };

            dir.onScroll = function (callback) {
                elem.on(scroll, callback);
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.off(scroll);
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C",
        };
    }

    angular
        .module("rpCarousel")
        .directive("rpCarouselScreen", [rpCarouselScreen]);
})(angular);

//  Source: _lib\realpage\carousel\js\directives\carousel-slider.js
//  Carousel Slider Directive

(function (angular, undefined) {
    "use strict";

    function rpCarouselSlider() {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.$ctrl.setSlider(dir);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.setWidth = function (width) {
                elem.width(width);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpCarousel")
        .directive("rpCarouselSlider", [rpCarouselSlider]);
})(angular);

//  Source: _lib\realpage\carousel\js\models\carousel.js
//  Carousel Model

(function (angular, undefined) {
    "use strict";

    function factory(timeout, unitModel) {
        function CarouselModel() {
            var s = this;
            s.init();
        }

        var p = CarouselModel.prototype;

        p.init = function () {
            var s = this;

            s.data = {
                units: [],
                unitWidth: 250,
                unitHeight: 80,
                unitSeparation: 20
            };

            s.units = [];
            s.state = {};
            s.slider = undefined;
            s.screen = undefined;
            s.scrollLeftEnabled = false;
            s.scrollRightEnabled = false;
        };

        p.getState = function () {
            var s = this;
            return s.state;
        };

        p.getStopIndex = function (stops) {
            var s = this,
                found = false,
                stopIndex = {},
                stopCount = stops.length,
                currentStop = s.screen.getScrollLeft();

            stops.forEach(function (stop, index) {
                if (found) {
                    return;
                }

                if (currentStop === stop) {
                    found = true;
                    stopIndex = {
                        prev: index - 1 < 0 ? 0 : index - 1,
                        next: index + 1 === stopCount ? index : index + 1
                    };
                }
                else if (stop < currentStop && currentStop < stops[index + 1]) {
                    found = true;
                    stopIndex = {
                        prev: index,
                        next: index + 1
                    };
                }
            });

            return stopIndex;
        };

        p.getNextStop = function () {
            var s = this,
                stops = s.getStops(),
                stopIndex = s.getStopIndex(stops);

            return stops[stopIndex.next];
        };

        p.getPrevStop = function () {
            var s = this,
                stops = s.getStops(),
                stopIndex = s.getStopIndex(stops);

            return stops[stopIndex.prev];
        };

        p.getSliderWidth = function () {
            var s = this,
                count = s.units.length,
                width = s.data.unitWidth,
                sep = s.data.unitSeparation;

            return ((width + sep) * (count - 1)) + width;
        };

        p.getStops = function () {
            var s = this,
                stop = 0,
                stops = [stop],
                stopWidth = s.getStopWidth(),
                sliderWidth = s.getSliderWidth(),
                excess = sliderWidth - s.screen.getWidth();

            while (stop < excess) {
                stop += stopWidth;
                stops.push(stop < excess ? stop : excess);
            }

            return stops;
        };

        p.getStopWidth = function () {
            var s = this,
                screenWidth = s.screen.getWidth(),
                stepWidth = s.data.unitWidth + s.data.unitSeparation;
            return stepWidth * Math.floor(screenWidth / stepWidth);
        };

        p.getUnitStyle = function (index) {
            var s = this,
                last = s.units.length === index + 1,
                marginRight = last ? 0 : s.data.unitSeparation;

            return {
                width: s.data.unitWidth,
                marginRight: marginRight,
                height: s.data.unitHeight
            };
        };

        p.initContainers = function () {
            var s = this;
            s.initScreen().initSlider().updateControls();
            s.state.ready = true;
            return s;
        };

        p.initControls = function () {
            var s = this;
            s.scrollLeftEnabled = s.getSliderWidth() > s.screen.getWidth();
            return s;
        };

        p.initScreen = function () {
            var s = this;
            s.screen.setHeight(s.data.unitHeight);
            return s;
        };

        p.initSlider = function () {
            var s = this;
            s.slider.setWidth(s.getSliderWidth());
            return s;
        };

        p.onScroll = function () {
            var s = this;
            if (!s.scrollTimer) {
                s.scrollTimer = timeout(s.updateControls.bind(s), 200);
            }
            return s;
        };

        p.updateControls = function () {
            var s = this,
                stops = s.getStops(),
                currentStop = s.screen.getScrollLeft();

            s.scrollTimer = undefined;
            s.scrollRightEnabled = currentStop !== 0;
            s.scrollLeftEnabled = stops.length > 1 && currentStop !== stops[stops.length - 1];
            return s;
        };

        p.reset = function () {
            var s = this;
            s.screen.scrollLeft(0);
            s.updateControls();
            return s;
        };

        p.scrollLeft = function () {
            var s = this,
                stop = s.getNextStop();
            s.screen.scrollLeft(stop);
            return s;
        };

        p.scrollRight = function () {
            var s = this,
                stop = s.getPrevStop();
            s.screen.scrollLeft(stop);
            return s;
        };

        p.setData = function (data) {
            var s = this;

            s.data = angular.extend(s.data, data || {});

            s.units = (s.data.units || []).map(function (unitData) {
                unitData = angular.extend({
                    templateUrl: s.data.templateUrl
                }, unitData);

                return unitModel(unitData);
            });

            timeout(s.initContainers.bind(s), 100);

            return s;
        };

        p.setScreen = function (screen) {
            var s = this;
            s.screen = screen;
            s.screen.onScroll(s.onScroll.bind(s));
            return s;
        };

        p.setSlider = function (slider) {
            var s = this;
            s.slider = slider;
            return s;
        };

        p.destroyUnit = function (unit) {
            unit.destroy();
        };

        p.destroy = function () {
            var s = this;

            if (s.units) {
                timeout.cancel(s.scrollTimer);
                s.units.forEach(s.destroyUnit);

                s.data = undefined;
                s.state = undefined;
                s.units = undefined;
                s.screen = undefined;
                s.slider = undefined;
                s.scrollTimer = undefined;
                s.scrollLeftEnabled = undefined;
                s.scrollRightEnabled = undefined;
            }
        };

        return function (data) {
            return (new CarouselModel()).setData(data);
        };
    }

    angular
        .module("rpCarousel")
        .factory("rpCarouselModel", ["timeout", "rpCarouselUnitModel", factory]);
})(angular);

//  Source: _lib\realpage\carousel\js\models\carousel-unit.js
//  Carousel Unit Model

(function (angular, undefined) {
    "use strict";

    var index = 1;

    function factory($cache) {
        function CarouselUnitModel() {
            var s = this;
            s.init();
        }

        var p = CarouselUnitModel.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
            s.carouselId = index++;
        };

        p.setData = function (data) {
            var s = this;
            s.data = data || s.data;
            return s;
        };

        p.getData = function () {
            var s = this;
            return s.data;
        };

        p.getTemplateUrl = function () {
            var s = this;
            return s.data.templateUrl;
        };

        p.getTemplateContent = function () {
            var s = this;
            return $cache.get(s.data.templateUrl);
        };

        p.hasTemplateUrl = function () {
            var s = this;
            return !!s.data.templateUrl && s.templateUrlIsValid();
        };

        p.templateUrlIsValid = function () {
            var s = this,
                url = s.data.templateUrl,
                valid = $cache.get(url) !== undefined;

            if (!valid) {
                logw("CarouselUnitModel: " + url + " is not a valid template url!");
            }

            return valid;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function (data) {
            return (new CarouselUnitModel()).setData(data);
        };
    }

    angular
        .module("rpCarousel")
        .factory("rpCarouselUnitModel", [
            "$templateCache",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\carousel\js\templates\templates.inc.js
angular.module("rpCarousel").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/carousel/templates/carousel-unit.html",
"<div class=\"rp-carousel-unit\">Carousel Unit #{{$ctrl.model.carouselId}}</div>");
$templateCache.put("realpage/carousel/templates/carousel.html",
"<div class=\"rp-carousel\" ng-class=\"$ctrl.getState()\"><span ng-click=\"$ctrl.scrollLeft()\" class=\"rp-carousel-scroll-left\" ng-if=\"$ctrl.model.scrollLeftEnabled\"></span> <span ng-click=\"$ctrl.scrollRight()\" class=\"rp-carousel-scroll-right\" ng-if=\"$ctrl.model.scrollRightEnabled\"></span><div class=\"rp-carousel-screen-wrap\"><div class=\"rp-carousel-screen\" ng-style=\"carouselScreen.getStyle()\"><div class=\"rp-carousel-slider\"><rp-carousel-unit model=\"unit\" ng-repeat=\"unit in $ctrl.model.units\" ng-style=\"$ctrl.model.getUnitStyle($index)\"></rp-carousel-unit></div></div></div></div>");
}]);
