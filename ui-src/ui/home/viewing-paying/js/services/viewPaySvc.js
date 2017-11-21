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
        .module('ui')
        .factory('viewPaySvc', factory);

    factory.$inject = ['$http'];

})();