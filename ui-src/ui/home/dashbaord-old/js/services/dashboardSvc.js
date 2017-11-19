(function() {
    'use strict';

    function factory(http) {
        return {
            getDashboardData: function(obj) {
                return http.post('/api/dashboard', obj);
            }
        };
    }

    angular
        .module('uam')
        .factory('dashboardSvc', factory);

    factory.$inject = ['$http'];
})();