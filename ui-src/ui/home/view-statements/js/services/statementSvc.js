(function() {
    'use strict';


    function Factory($http,baseSvc) {

        return {
            getStatementList: function(obj) {
                return baseSvc.getTenentData('/api/statements', obj);
            }
        };

    }
    angular
        .module('ui')
        .factory('statementSvc', Factory);

    Factory.$inject = ['$http','baseSvc'];

})();