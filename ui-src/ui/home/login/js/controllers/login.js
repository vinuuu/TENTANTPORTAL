(function() {
    'use strict';


    function controller(loginMdl) {
        /* jshint validthis:true */
        var vm = this,
            model;
        vm.init = function() {
            vm.model = model = loginMdl;
            model.showHideFlag = "login";
            model.rdnEmailCode = 'email';
            model.rdnmobCode = false;
        };

        vm.init();
    }

    angular
        .module('uam')
        .controller('loginCtrl', controller);
    controller.$inject = ['loginMdl'];

})();