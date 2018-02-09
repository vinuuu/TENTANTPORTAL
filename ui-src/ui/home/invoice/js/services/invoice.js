(function() {
    'use strict';


    function factory($http,baseSvc) {

        return {
            getInvoiceList: function(obj) {
                return baseSvc.getTenentData('/api/invoice', obj);
            }
        };

    }

    angular
        .module('uam')
        .factory('invoiceSvc', factory);
    factory.$inject = ['$http','baseSvc'];
})();