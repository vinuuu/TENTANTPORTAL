(function() {
    'use strict';


    function Controller(invoiceMdl, stateParams, gridConfig) {
        /* jshint validthis:true */
        var vm = this,
            model;

        vm.init = function() {
            gridConfig.setSrc(vm);
            vm.model = model = invoiceMdl.init();
        };
        vm.onPayAmount = function(record) {
            model.onPayAmount(record);
        };
        vm.init();
    }
    angular
        .module('uam')
        .controller('invoiceCtrl', Controller);

    Controller.$inject = ['invoiceMdl', '$stateParams', 'invoiceGrid1Config', ];

})();