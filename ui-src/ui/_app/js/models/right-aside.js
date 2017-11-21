//  Right Aside Model

(function (angular, undefined) {
    "use strict";

    function factory($aside) {
        function RightAsideModal() {
            var s = this;
            s.init();
        }

        var p = RightAsideModal.prototype;

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

        p.setAsideUrl = function (url) {
            var s = this;
            s.asideData.templateUrl = url;
            return s;
        };

        p.load = function () {
            var s = this;
            s.aside = $aside(s.asideData);
            return s.aside.$promise;
        };

        p.show = function () {
            var s = this;
            if (s.isReady) {
                s.aside.show();
            }
            else {
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

        p.hide = function () {
            var s = this;
            s.aside.hide();
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
            return (new RightAsideModal()).setAsideUrl(url);
        };
    }

    angular
        .module("ui")
        .factory("rightAsideModal", ["$aside", factory]);
})(angular);
