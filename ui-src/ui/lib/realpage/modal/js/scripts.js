//  Source: _lib\realpage\modal\js\models\modal.js
//  Modal Model

(function (angular, undefined) {
    "use strict";

    function factory($modal) {
        function ModalModel() {
            var s = this;
            s.init();
        }

        var p = ModalModel.prototype;

        p.init = function () {
            var s = this;
            s.ready = false;
            s.data = {
                show: false,
                backdrop: true,
                placement: "top",
                animation: "top am-fade-and-slide-top"
            };
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        // Actions

        p.hide = function () {
            var s = this;
            s.modal.hide();
            return s;
        };

        p.load = function () {
            var s = this;
            s.modal = $modal(s.data);
            return s.modal.$promise;
        };

        p.show = function () {
            var s = this;
            if (s.ready) {
                s.modal.show();
            }
            else {
                s.load().then(s.showOnLoad.bind(s));
            }
            return s;
        };

        p.showOnLoad = function () {
            var s = this;
            s.ready = true;
            s.show();
            return s;
        };

        // Destroy/Reset

        p.destroy = function () {
            var s = this;
            s.modal.destroy();
            s.modal = undefined;
            s.ready = undefined;
            s.data = undefined;
        };

        return function (url) {
            return (new ModalModel()).setData({
                templateUrl: url
            });
        };
    }

    angular
        .module("rpModal")
        .factory("rpModalModel", ["$modal", factory]);
})(angular);
