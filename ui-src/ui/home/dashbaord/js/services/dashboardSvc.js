(function() {
    'use strict';



    function factory($http,baseSvc) {
        return {
            getLeaseList: function(obj) {
                return baseSvc.getTenentData('/api/dashboard', obj);
            }
        };
    }

    angular
        .module('ui')
        .factory('dashboardSvc', factory);

    factory.$inject = ['$http','baseSvc'];

})();