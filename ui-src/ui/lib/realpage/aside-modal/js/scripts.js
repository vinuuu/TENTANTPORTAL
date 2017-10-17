angular.module("rpAsideModal", []);

//  Source: _lib\realpage\aside-modal\js\models\aside.js
//  Right Aside Model

(function (angular, undefined) {
    "use strict";

    function factory($aside) {
        function AsideModal() {
            var s = this;
            s.init();
        }

        var p = AsideModal.prototype;

        p.init = function () {
            var s = this;
            s.isReady = false;
            s.asideData = {
                show: false,
                backdrop: true,
                placement: "right",
                animation: "am-fade-and-slide-right"
            };
        };

        p.hide = function () {
            var s = this;
            s.aside.hide();
            return s;
        };

        p.load = function () {
            var s = this;
            s.aside = $aside(s.asideData);
            return s.aside.$promise;
        };

        p.setData = function (data) {
            var s = this;
            angular.extend(s.asideData, data);
            return s;
        };

        p.show = function () {
            var s = this;
            if (s.isReady) {
                s.aside.show();
            }
            else {
                s.aside = $aside(s.asideData);
                s.load().then(s.showOnLoad.bind(s));
            }
            return s;
        };

        p.showOnLoad = function () {
            var s = this;
            s.isReady = true;
            s.show();
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.aside.destroy();
            s.aside = undefined;
            s.isReady = undefined;
            s.asideData = undefined;
        };

        return function (url) {
            return (new AsideModal()).setData({
                templateUrl: url
            });
        };
    }

    angular
        .module("rpAsideModal")
        .factory("rpAsideModal", ["$aside", factory]);
})(angular);

