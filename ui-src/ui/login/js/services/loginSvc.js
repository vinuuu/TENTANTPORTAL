(function() {
    'use strict';

    function factory($http) {
        return {
            getLoginDetails: function(obj) {
                return $http.post('/api/login', obj);
            },
            changePwd: function(obj) {
                return $http.post('/api/changepwd', obj);
            }
        };
    }

    angular
        .module('ui')
        .factory('loginSvc', factory);

    factory.$inject = ['$http'];

})();