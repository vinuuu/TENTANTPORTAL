(function() {
    'use strict';

    function factory($http) {
        var model = {};

        return model;
    }

    angular
        .module('uam')
        .factory('loginMdl', factory);

    factory.$inject = ['$http'];

})();