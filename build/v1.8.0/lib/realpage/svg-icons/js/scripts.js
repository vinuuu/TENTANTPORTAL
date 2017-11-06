angular.module("rpSvgIcon", []);
//  Source: _lib\realpage\svg-icons\js\directives\svg-icon.js
//  SVG Icon Directive

(function (angular) {
    "use strict";

    function rpSvgIcon(cache) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.getIcon();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.getIcon = function () {
                if (attr.svgSrc) {
                    cache.get(attr.svgSrc, dir.insertIcon);
                }
                else {
                    logc("rpSvgIcon.getIcon: svg src is invalid! => ", elem);
                }
            };

            dir.insertIcon = function (iconData) {
                elem.html(iconData);
            };

            dir.destroy = function () {
                elem.html("");
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
        .module("rpSvgIcon")
        .directive("rpSvgIcon", ["rpSvgIconCache", rpSvgIcon]);
})(angular);

//  Source: _lib\realpage\svg-icons\js\services\svg-icon-cache.js
//  Svg Icon Cache Service

(function (angular) {
    "use strict";

    function RpSvgIconCache($http, eventStream) {
        var svc = this,
            iconCache = {},
            inProgress = {},
            eventStreams = {};

        // Getters

        svc.get = function (url, callback) {
            var iconData = iconCache[url];

            if (iconData) {
                callback(iconData);
            }
            else {
                if (!inProgress[url]) {
                    inProgress[url] = true;
                    svc.getData(url, callback);
                }

                svc.queueReq(url, callback);
            }
        };

        svc.getData = function (url, callback) {
            eventStreams[url] = eventStream();
            eventStreams[url].subscribe(callback);
            $http.get(url).then(svc.onGetData);
        };

        // Actions

        svc.onGetData = function (resp) {
            var url = resp.config.url;
            svc.storeData(url, resp.data).publishData(url, resp.data);
        };

        svc.publishData = function (url, data) {
            delete inProgress[url];
            eventStreams[url].publish(data).destroy();
            delete eventStreams[url];
        };

        svc.queueReq = function (url, callback) {
            eventStreams[url].subscribe(callback);
        };

        svc.storeData = function (url, data) {
            iconCache[url] = data;
            return svc;
        };
    }

    angular
        .module("rpSvgIcon")
        .service("rpSvgIconCache", [
            "$http",
            "eventStream",
            RpSvgIconCache
        ]);
})(angular);

