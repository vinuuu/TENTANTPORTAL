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
        .module('ui')
        .factory('loginSvc', factory);

    factory.$inject = ['$http'];


})();