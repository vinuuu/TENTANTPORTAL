(function() {
    'use strict';



    function factory($http,baseSvc) {
        return {
            getInvoiceList: function(obj) {
                return baseSvc.getTenentData('/api/payments', obj);
            }
        };
    }

    angular
        .module('ui')
        .factory('viewPaySvc', factory);

    factory.$inject = ['$http','baseSvc'];

})();