(function() {
    'use strict';


    function Factory($http) {

        return {
            getStatementList: function(obj) {
                return $http.post('/api/statement', obj);
            }
        };

    }
    angular
        .module('ui')
        .factory('statementSvc', Factory);

    Factory.$inject = ['$http'];

})();