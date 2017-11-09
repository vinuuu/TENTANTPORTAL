//  Source: ui\home\viewing-paying\js\controllers\viewPay.js
(function() {
    'use strict';




    function controller($location) {
        /* jshint validthis:true */
        var vm = this;

    }
    angular
        .module('uam')
        .controller('viewpayCtrl', controller);
    controller.$inject = ['$location'];

})();

//  Source: ui\home\viewing-paying\js\models\viewPay.js
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

