//  Home Controller

(function(angular, undefined) {
    "use strict";

    function accountsMdl(accountsSvc) {
        var model = {},
            response = {};
        model.init = function() {
            return model;
        };
        model.mockData = function() {
            response.custData = {
                tenantName: 'Kim Resident',
                leaseTerm: '1/1/2016-12/31/2018',
                PrevoiusStatement: 'XXXXXXXXXXXXXXXX',
                PreviousBalance: '$27,885.14',
                lastPayment: '$27,885.16',
                lastPaymentReceivedOn: '1/1/2016',
                currentStatement: 'XXXXXXXXXXXX',
                currentBalance: '$27,885.14',
                dueDate: '2/1/2016'
            };
        };

        model.bindtenantdata = function(response) {
            model.list = response.records;
        };

        model.getCustData = function() {
            accountsSvc.getcustData().then(function() {

            }).catch(function() {
                model.mockData();
            });
        };



        return model;
    }

    angular
        .module("uam")
        .factory("accountsMdl", [accountsMdl]);
    factory.$inject = ['accountsSvc'];
})(angular);