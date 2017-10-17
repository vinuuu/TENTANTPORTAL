//  Source: _lib\realpage\chart\js\config\highcharts.js
//  Highcharts Service

(function (angular) {
    "use strict";

    function factory($window) {
        return $window.Highcharts;
    }

    angular
        .module("app")
        .factory("highcharts", ["$window", factory]);
})(angular);


//  Source: _lib\realpage\chart\js\templates\templates.inc.js
angular.module('rpChart').run(['$templateCache', function ($templateCache) {
$templateCache.put("realpage/chart/templates/pie-chart2.html",
"<div class=\"easyPieChart rp-pie-chart-2\" data-percent=\"{{model.data}}\" data-redraw=\"true\"><div>{{model.data}}%</div></div>");
}]);


//  Source: _lib\realpage\chart\js\models\sparkline-chart-config.js
//  Sparkline Chart Config Model

(function (angular) {
    "use strict";

    function factory(colors) {
        return function () {
            var model = {};

            model.bar = {
                height: 20,
                type: "bar",
                barWidth: 4,
                barSpacing: 2,
                barColor: colors.prim
            };

            model.stackedBar = {
                type: "bar",
                height: 20,
                barWidth: 4,
                barSpacing: 2,
                stackedBarColor: [colors.prim04, "rgba(0, 0, 0, 0.1)"]
            };

            model.tristate = {
                height: 20,
                width: "auto",
                type: "tristate",
                colorMap: {
                    "-1": colors.prim,
                    "1": colors.prim04
                }
            };

            model.line = {
                type: "line",
                height: 20,
                width: "auto",
                lineWidth: 1,
                valueSpots: {
                    "0:": colors.info
                },
                lineColor: colors.prim,
                spotColor: colors.info,
                fillColor: "",
                highlightLineColor: colors.white,
                spotRadius: 0
            };

            model.pie = {
                height: 40,
                type: "pie",
                sliceColors: [colors.prim02, colors.prim]
            };

            model.discrete = {
                width: 40,
                height: 20,
                type: "discrete",
                lineColor: colors.prim04
            };

            model.get = function (type) {
                if (model[type]) {
                    return model[type];
                }
                else {
                    logc("sparklineConfig: data for type " + type + " was not found!");
                }
            };

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpSparklineChartConfig", ["rpColors", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\highchart-config.js
//  Highchart Config Model

(function (angular) {
    "use strict";

    function factory() {
        return function () {
            return {};
        };
    }

    angular
        .module("rpChart")
        .factory("rpHighchartConfig", [factory]);
})(angular);


//  Source: _lib\realpage\chart\js\directives\base.js
//  Base Sparkline Dir

(function (angular) {
    "use strict";

    function factory() {
        return function (scope, elem, attr) {
            var dir = {},
                model = scope.model;

            dir.init = function () {
                dir.initChart();
                model.setSrc(dir);
                scope.chart = dir;
            };

            dir.initChart = function () {

            };

            dir.updateChart = function () {

            };

            dir.reflow = function () {

            };

            dir.destroy = function () {

            };

            return dir;
        };
    }

    angular
        .module("rpChart")
        .factory("rpBaseChartDir", [factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\base-chart.js
//  Base Chart Model

(function (angular, undefined) {
    "use strict";

    function factory(methodsRepo) {
        return function () {
            var model = {
                data: {},
                config: {},
                options: {},
                methods: methodsRepo()
            };

            model.reflow = model.methods.get("reflow");
            model.updateChart = model.methods.get("updateChart");

            model.setSrc = function (src) {
                model.methods.setSrc(src);
            };

            model.setData = function (data) {
                model.data = data;
                return model;
            };

            model.setOptions = function (options) {
                angular.extend(model.options, options || {});
            };

            model.getData = function () {
                return model.data;
            };

            model.setConfig = function (config) {
                model.config = config;
                return model;
            };

            model.extendConfig = function (config) {
                model.config.extend(config);
                return model;
            };

            model.getConfig = function () {
                return model.config;
            };

            model.getOptions = function () {
                return model.options;
            };

            model.destroy = function () {
                model.methods.destroy();
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpBaseChartModel", ["rpMethodsRepo", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\base-chart-config.js
//  Base Chart Config

(function (angular, undefined) {
    "use strict";

    function factory() {
        return function () {
            var model = {
                data: {}
            };

            model.getData = function () {
                return model.data;
            };

            model.setData = function (data) {
                model.data = data;
            };

            model.extend = function (update) {
                angular.extend(model.data, update);
            };

            model.destroy = function () {
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpBaseChartConfig", [factory]);
})(angular);


//  Source: _lib\realpage\chart\js\directives\bar-chart1.js
//  Bar Chart 1 Directive

(function (angular) {
    "use strict";

    function rpBarChart1(baseDir) {
        var template = "<div class='rp-bar-chart1' />";

        function link(scope, elem, attr) {
            var model = scope.model,
                dir = baseDir(scope, elem, attr);

            dir.initChart = function () {
                var data = model.getData(),
                    config = model.getConfig().getData();
                elem.sparkline(data, config);
            };

            dir.updateChart = function () {
                dir.initChart();
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            template: template
        };
    }

    angular
        .module("rpChart")
        .directive("rpBarChart1", ["rpBaseChartDir", rpBarChart1]);
})(angular);

//  Source: _lib\realpage\chart\js\models\bar-chart1.js
//  Bar Chart 1 Model

(function (angular) {
    "use strict";

    function factory(baseModel) {
        return function () {
            return baseModel();
        };
    }

    angular
        .module("rpChart")
        .factory("rpBarChart1Model", ["rpBaseChartModel", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\bar-chart1-config.js
//  Bar Chart 1 Config

(function (angular) {
    "use strict";

    function factory(baseChartConfig, sparklineConfig) {
        return function () {
            var model = baseChartConfig();

            model.setType = function (type) {
                var configData = sparklineConfig().get(type);
                model.setData(configData);
                return model;
            };

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpBarChart1Config", ["rpBaseChartConfig", "rpSparklineChartConfig", factory]);
})(angular);


//  Source: _lib\realpage\chart\js\directives\bar-chart2.js
//  Bar Chart 2 Directive

(function (angular) {
    "use strict";

    function rpBarChart1(baseDir, highcharts, timeout) {
        var index = 1,
            id = "bar-chart-",
            template = "<div class='rp-bar-chart2' />";

        function link(scope, elem, attr) {
            var model = scope.model,
                chartID = id + index++,
                dir = baseDir(scope, elem, attr);

            dir.initChart = function () {
                var chartData;

                elem.attr("id", chartID);
                chartData = model.getData();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.highchart = new highcharts.chart(chartID, chartData);
                highcharts.setOptions(model.getOptions());
            };

            dir.reflow = function () {
                timeout(function () {
                    dir.highchart.reflow();
                });
            };

            dir.updateChart = function () {
                dir.initChart();
            };

            dir.destroy = function () {
                dir.highchart.destroy();
                elem.html("");
                dir.destWatch();

                dir = undefined;
                elem = undefined;
                scope = undefined;
                model = undefined;
                chartID = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            template: template
        };
    }

    angular
        .module("rpChart")
        .directive("rpBarChart2", ["rpBaseChartDir", "highcharts", "timeout", rpBarChart1]);
})(angular);

//  Source: _lib\realpage\chart\js\models\bar-chart2.js
//  Bar Chart 2 Model

(function (angular) {
    "use strict";

    function factory(baseModel) {
        return function () {
            return baseModel();
        };
    }

    angular
        .module("rpChart")
        .factory("rpBarChart2Model", ["rpBaseChartModel", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\bar-chart2-config.js
//  Bar Chart 2 Config

(function (angular, undefined) {
    "use strict";

    function factory(colors, baseChartConfig) {
        return function () {
            var model = baseChartConfig(),
                oldDestroy = model.destroy;

            model.setData({
                colors: ["#42a5f5", "#ff6437", "#2d71a8", "#28343b", "#cc4f2d", "#495e69"],
                chart: {
                    width: 300,
                    height: 300,
                    type: "column"
                },
                title: {
                    text: "Monthly Average Rainfall"
                },
                subtitle: {
                    text: "Source: WorldClimate.com"
                },
                xAxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Rainfall (mm)"
                    }
                },
                tooltip: {
                    headerFormat: "<span style=%22font-size:10px%22>{point.key}</span><table>",
                    pointFormat: "<tr><td style=%22color:{series.color};padding:0%22>{series.name}: </td>" + "<td style=%22padding:0%22><b>{point.y:.1f} mm</b></td></tr>",
                    footerFormat: "</table>",
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                }
            });

            model.destroy = function () {
                oldDestroy();
                model = undefined;
                oldDestroy = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpBarChart2Config", ["rpColors", "rpBaseChartConfig", factory]);
})(angular);


//  Source: _lib\realpage\chart\js\directives\pie-chart1.js
//  Bar Chart 1 Directive

(function (angular) {
    "use strict";

    function rpPieChart1(baseDir) {
        var template = "<div class='rp-pie-chart1' />";

        function link(scope, elem, attr) {
            var model = scope.model,
                dir = baseDir(scope, elem, attr);

            dir.initChart = function () {
                var data = model.getData(),
                    config = model.getConfig().getData();
                elem.sparkline(data, config);
            };

            dir.updateChart = function () {
                dir.initChart();
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            template: template
        };
    }

    angular
        .module("rpChart")
        .directive("rpPieChart1", ["rpBaseChartDir", rpPieChart1]);
})(angular);

//  Source: _lib\realpage\chart\js\models\pie-chart1.js
//  Bar Chart 1 Model

(function (angular) {
    "use strict";

    function factory(baseModel) {
        return function () {
            return baseModel();
        };
    }

    angular
        .module("rpChart")
        .factory("rpPieChart1Model", ["rpBaseChartModel", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\pie-chart1-config.js
//  Bar Chart 1 Config

(function (angular) {
    "use strict";

    function factory(baseChartConfig, sparklineConfig) {
        return function () {
            var model = baseChartConfig();

            model.setData(sparklineConfig().get("pie"));

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpPieChart1Config", ["rpBaseChartConfig", "rpSparklineChartConfig", factory]);
})(angular);


//  Source: _lib\realpage\chart\js\directives\pie-chart2.js
//  Bar Chart 2 Directive

(function (angular) {
    "use strict";

    function rpPieChart2($timeout, baseDir) {
        function link(scope, elem, attr) {
            var model = scope.model,
                dir = baseDir(scope, elem, attr);

            dir.initChart = function () {
                $timeout.cancel(dir.timer);

                model.config.extend({
                    percent: model.data
                });

                dir.timer = $timeout(function () {
                    var chartData = model.getConfig().getData();
                    elem.easyPieChart(chartData);
                });
            };

            dir.updateChart = function () {
                elem.data("easyPieChart").update(model.getData());
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/chart/templates/pie-chart2.html"
        };
    }

    angular
        .module("rpChart")
        .directive("rpPieChart2", ["$timeout", "rpBaseChartDir", rpPieChart2]);
})(angular);

//  Source: _lib\realpage\chart\js\models\pie-chart2.js
//  Bar Chart 2 Model

(function (angular) {
    "use strict";

    function factory(baseModel) {
        return function () {
            var model = baseModel();

            model.data = 75;

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpPieChart2Model", ["rpBaseChartModel", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\pie-chart2-config.js
//  Bar Chart 1 Config

(function (angular) {
    "use strict";

    function factory(colors, baseChartConfig) {
        return function () {
            var model = baseChartConfig();

            model.setData({
                lineWidth: 5,
                trackColor: "rgba(0, 0, 0, 0.05)",
                barColor: colors.prim,
                scaleColor: "transparent",
                size: 75,
                scaleLength: 0,
                rotate: 0
            });

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpPieChart2Config", ["rpColors", "rpBaseChartConfig", factory]);
})(angular);


//  Source: _lib\realpage\chart\js\directives\pie-chart3.js
//  Bar Chart 3 Directive

(function (angular) {
    "use strict";

    function rpPieChart3($, $timeout, baseDir) {
        function link(scope, elem, attr) {
            var model = scope.model,
                dir = baseDir(scope, elem, attr);

            dir.initChart = function () {
                var data = model.getData(),
                    config = model.getConfig().getData();
                $.plot(elem, data, config);
            };

            dir.updateChart = function () {

            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            template: "<div class='rp-pie-chart3' />"
        };
    }

    angular
        .module("rpChart")
        .directive("rpPieChart3", ["jQuery", "$timeout", "rpBaseChartDir", rpPieChart3]);
})(angular);

//  Source: _lib\realpage\chart\js\models\pie-chart3.js
//  Bar Chart 2 Model

(function (angular) {
    "use strict";

    function factory(baseModel) {
        return function () {
            var model = baseModel();
            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpPieChart3Model", ["rpBaseChartModel", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\pie-chart3-config.js
//  Bar Chart 1 Config

(function (angular) {
    "use strict";

    function factory(colors, baseChartConfig) {
        return function () {
            var model = baseChartConfig();

            model.setData({
                series: {
                    pie: {
                        show: true,
                        innerRadius: 0.6,

                        stroke: {
                            width: 0
                        },

                        label: {
                            show: true,
                            threshold: 0.05
                        }
                    }
                },

                legend: {
                    backgroundColor: "transparent"
                },

                colors: [colors.prim, colors.accent, colors.sec03, colors.prim04],

                grid: {
                    hoverable: true,
                    clickable: true,
                    borderWidth: 0,
                    color: "rgba(120, 120, 120, 0.5)"
                },

                tooltip: true,

                tooltipOpts: {
                    content: "%s: %p.0%"
                }
            });

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpPieChart3Config", ["rpColors", "rpBaseChartConfig", factory]);
})(angular);


//  Source: _lib\realpage\chart\js\directives\line-chart1.js
//  Line Chart Directive

(function (angular) {
    "use strict";

    function rpLineChart1(baseDir) {
        var template = "<div class='rp-line-chart1' />";

        function link(scope, elem, attr) {
            var model = scope.model,
                dir = baseDir(scope, elem, attr);

            dir.initChart = function () {
                var data = model.getData(),
                    config = model.getConfig().getData();
                elem.sparkline(data, config);
            };

            dir.updateChart = function () {
                dir.initChart();
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            template: template
        };
    }

    angular
        .module("rpChart")
        .directive("rpLineChart1", ["rpBaseChartDir", rpLineChart1]);
})(angular);

//  Source: _lib\realpage\chart\js\models\line-chart1.js
//  Line Chart Model

(function (angular) {
    "use strict";

    function factory(baseModel) {
        return function () {
            return baseModel();
        };
    }

    angular
        .module("rpChart")
        .factory("rpLineChart1Model", ["rpBaseChartModel", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\line-chart1-config.js
//  Line Chart 1 Config

(function (angular) {
    "use strict";

    function factory(baseChartConfig, sparklineConfig) {
        return function () {
            var model = baseChartConfig();

            model.setData(sparklineConfig().get("line"));

            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpLineChart1Config", ["rpBaseChartConfig", "rpSparklineChartConfig", factory]);
})(angular);


//  Source: _lib\realpage\chart\js\directives\line-chart2.js
//  Line Chart 2 Directive

(function (angular, undefined) {
    "use strict";

    function rpLineChart2(baseDir, highcharts, timeout) {
        var index = 1,
            id = "line-chart-",
            template = "<div class='rp-line-chart2' />";

        function link(scope, elem, attr) {
            var model = scope.model,
                chartID = id + index++,
                dir = baseDir(scope, elem, attr);

            dir.initChart = function () {
                var chartData;

                elem.attr("id", chartID);
                chartData = model.getData();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.highchart = new highcharts.chart(chartID, chartData);
                highcharts.setOptions(model.getOptions());
            };

            dir.reflow = function () {
                timeout(function () {
                    dir.highchart.reflow();
                });
            };

            dir.updateChart = function () {
                dir.initChart();
            };

            dir.destroy = function () {
                dir.highchart.destroy();
                elem.html("");
                dir.destWatch();

                dir = undefined;
                elem = undefined;
                scope = undefined;
                model = undefined;
                chartID = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            template: template
        };
    }

    angular
        .module("rpChart")
        .directive("rpLineChart2", ["rpBaseChartDir", "highcharts", "timeout", rpLineChart2]);
})(angular);

//  Source: _lib\realpage\chart\js\models\line-chart2.js
//  Line Chart 2 Model

(function (angular) {
    "use strict";

    function factory(baseModel) {
        return function () {
            return baseModel();
        };
    }

    angular
        .module("rpChart")
        .factory("rpLineChart2Model", ["rpBaseChartModel", factory]);
})(angular);

//  Source: _lib\realpage\chart\js\models\line-chart2-config.js
//  Line Chart 2 Config

(function (angular) {
    "use strict";

    function factory(baseChartConfig) {
        return function () {
            var model = baseChartConfig();
            return model;
        };
    }

    angular
        .module("rpChart")
        .factory("rpLineChart2Config", ["rpBaseChartConfig", factory]);
})(angular);

