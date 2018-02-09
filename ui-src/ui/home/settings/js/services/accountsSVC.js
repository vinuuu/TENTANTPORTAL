(function() {
    'use strict';

    function Factory(http) {
        return {
            getAccountsInfo: function(obj) {
                return http.post('/api/accounts', obj);
            }
        };
    }
    angular
        .module('ui')
        .factory('accountsSvc', Factory);

    Factory.$inject = ['$http'];


})();