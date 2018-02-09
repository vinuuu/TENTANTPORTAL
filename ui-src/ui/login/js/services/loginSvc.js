(function() {
    'use strict';

    function factory($http) {
        var URL="https://rpidevntw008.realpage.com/users/sarroju/Q12018RELEASE-QA.accounting/tenant/apigw.phtml";
        return {
            getLoginDetails: function(obj) {
                //return $http.post(URL, obj);
                return $http.post("api/login", obj);
            },
            changePwd: function(obj) {
                //return $http.post(URL, obj);
                return $http.post("api/changePwd", obj);
            },
            forgotPwd: function(obj) {
               //return $http.post(URL, obj);
               return $http.post("api/forgetPwd", obj);
            }
        };
    }

    angular
        .module('ui')
        .factory('loginSvc', factory);

    factory.$inject = ['$http'];

})();