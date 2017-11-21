//  Mocks Config

(function(angular) {
    "use strict";

    function PassThrough($httpBackend) {
        $httpBackend.whenGET(/\.html.*$/).passThrough();
        $httpBackend.whenGET(/\/api\/leasing-and-rents\/tasks\/\d+\/\d+/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/masterchart\/list/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/common\/osaproperty\/combo/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/masterchart\/new/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/masterchart\/\d+/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccountlist\/\d+/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/accounttype\/list/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/masterchart\/clone\/propertylist/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/masterchart\/clone\/propertylist\/save/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccounts\/importosa\/\d+\/\d+/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccount\/saveimportdata\/\d+\/osa/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/lrmasterchart\/list/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/lrmasterchart\/properties\/^[a-z ,.'-0-9]+$/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/lrimport\/\d+\/^[a-z ,.'-0-9]+$/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/lrimport\/status\/^[0-9,]+$/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccountstaginglist\/\d+/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccountstaging\/copy\/\d+\/^[a-z]+$/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccountstaging\/delete\/\d+/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccountstaging\/delete/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccount\/New/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccount\/updatefield/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccount\/delete/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/masterchart\/delete/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/masterchart\/copy/).passThrough();

        ///api/budgeting/coa/glaccount/
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccount\/\d+/).passThrough();

        ///api/budgeting/coa/glaccount/Update
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/glaccount\/Update/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/csvimport\/\d+/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/coa\/propertychart\/\list/).passThrough();

        $httpBackend.whenGET(/\/api\/budgeting\/coa\/property\/glaccount\/movetomasterchart/).passThrough();

        //dashboard URL
        $httpBackend.whenGET(/\/api\/budgeting\/common\/tasks\/\d+/).passThrough();

        //budget workflow status URL's

        //$httpBackend.whenGET(/\/api\/budgeting\/budgetmodel\/sequence\/\d+\/budgetworkflowstatus/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/budgetmodel\/workflow\/budgetstatus\/update\/\d+/).passThrough();

        $httpBackend.whenGET(/\/api\/budgeting\/common\/contracts\/all\/\d+/).passThrough();
        $httpBackend.whenGET(/\/api\/budgeting\/common\/contracts\/expired\/\d+/).passThrough();

    }

    angular
        .module("ui")
        .run(['$httpBackend', PassThrough])
        .requires.push('ng-mock-e2e');
})(angular);