(function() {
    'use strict';



    function factory($http) {
        var model = {};
        return model;
    }

    angular
        .module('uam')
        .factory('viewpayMdl', factory);
    factory.$inject = ['$http'];

})();