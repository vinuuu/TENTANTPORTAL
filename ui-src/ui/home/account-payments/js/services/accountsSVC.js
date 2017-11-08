(function() {
    'use strict';

    function factory(http) {
        return {
            getcustData: function() {
                return http.get('api/controller/getcustdata');
            }
        };
    }
    angular
        .module('uam')
        .factory('accountsSvc', factory);

    factory.$inject = ['$http'];


})();