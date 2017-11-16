(function() {
    'use strict';



    function factory($http) {
        return {
            getLoginDetails: function(obj) {
                return $http.post('http://rpidevntw008.realpage.com/users/sarroju/RPGITSERVICES.accounting/tenant/apigw.phtml', obj);
            }
        };
    }

    angular
        .module('uam')
        .factory('loginSvc', factory);

    factory.$inject = ['$http'];


})();