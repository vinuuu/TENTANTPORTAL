(function() {
    'use strict';




    function controller(viewpayMdl) {
        /* jshint validthis:true */
        var vm = this,
            model;


        vm.init = function() {
            vm.model = model = viewpayMdl.init();
        };
        vm.init();
    }
    angular
        .module('ui')
        .controller('viewpayCtrl', controller);
    controller.$inject = ['viewpayMdl'];

})();