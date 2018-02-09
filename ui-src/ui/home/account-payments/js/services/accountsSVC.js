(function() {
    'use strict';

    function Factory(http,baseSvc) {
        return {
            getAccountsInfo: function(obj) {
                return baseSvc.getTenentData('/api/accounts', obj);
            }
        };
    }
    angular
        .module('ui')
        .factory('accountsSvc', Factory);

    Factory.$inject = ['$http','baseSvc'];


})();