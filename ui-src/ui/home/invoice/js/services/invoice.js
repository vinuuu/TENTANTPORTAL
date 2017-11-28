(function() {
    'use strict';


    function factory($http) {

        return {
            getInvoiceList: function(obj) {
                return $http.post('/api/viewPay', obj);
            }
        };

    }

    angular
        .module('uam')
        .factory('invoiceSvc', factory);
    factory.$inject = ['$http'];
})();