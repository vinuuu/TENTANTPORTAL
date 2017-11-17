(function() {
    'use strict';



    function factory($http) {
        return {
            getLoginDetails: function(obj) {
                return $http.post('/api/login', obj);
            }
        };
    }

    angular
        .module('uam')
        .factory('loginSvc', factory);

    factory.$inject = ['$http'];


})();