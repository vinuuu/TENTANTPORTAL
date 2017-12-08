(function() {
    'use strict';


    function Controller(invoiceMdl, stateParams) {
        /* jshint validthis:true */
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = invoiceMdl.init();
            model.loadData(stateParams.id === 0 ? undefined : stateParams.id);
        };
        vm.init();
    }
    angular
        .module('uam')
        .controller('invoiceCtrl', Controller);

    Controller.$inject = ['invoiceMdl', '$stateParams'];

})();