(function() {
    'use strict';



    function factory($http) {
        return {
            getLeaseList: function(obj) {
                return $http.post('/api/dashboard', obj);
            }
        };
    }

    angular
        .module('ui')
        .factory('dashboardSvc', factory);

    factory.$inject = ['$http'];

})();