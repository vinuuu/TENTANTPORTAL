(function() {
    'use strict';

    angular
        .module('uam')
        .factory('accountsSvc', factory)

    factory.$inject = ['$http'];

    function factory(http) {
        return {
            getcustData: function() {
                return http.get('api/controller/getcustdata');
            }
        };
    }
})();