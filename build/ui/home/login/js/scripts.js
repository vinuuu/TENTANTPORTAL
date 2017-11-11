//  Source: ui\home\login\js\controllers\login.js
(function() {
    'use strict';


    function controller(loginMdl) {
        /* jshint validthis:true */
        var vm = this;

    }

    angular
        .module('uam')
        .controller('loginCtrl', controller);
    controller.$inject = ['loginMdl'];
})();

//  Source: ui\home\login\js\models\login.js
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

