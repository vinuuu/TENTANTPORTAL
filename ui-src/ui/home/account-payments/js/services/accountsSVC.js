(function() {
    'use strict';

    function Factory(http) {
        return {
            getcustData: function() {
                return http.get('api/controller/getcustdata');
            }
        };
    }
    angular
        .module('ui')
        .factory('accountsSvc', Factory);

    Factory.$inject = ['$http'];


})();