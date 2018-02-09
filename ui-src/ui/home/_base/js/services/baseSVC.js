(function() {
    'use strict';



    function factory($http) {
        return {
            getTenentData: function(pagename, obj) {
                var URL="https://rpidevntw008.realpage.com/users/sarroju/Q12018RELEASE-QA.accounting/tenant/apigw.phtml";
                 //return $http.post(URL, obj);
                 return $http.post("api/" + pagename, obj);
            }
        };
    }

    angular
        .module('ui')
        .factory('baseSvc', factory);

    factory.$inject = ['$http'];

})();