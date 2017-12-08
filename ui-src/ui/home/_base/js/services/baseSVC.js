(function() {
    'use strict';



    function factory($http) {
        return {
            getTenentData: function(pagename, obj) {
                return $http.post("/api/" + pagename, obj);
            }
        };
    }

    angular
        .module('ui')
        .factory('baseSvc', factory);

    factory.$inject = ['$http'];

})();