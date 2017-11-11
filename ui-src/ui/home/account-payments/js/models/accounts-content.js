// Recall Distributed Allocations content
(function(angular) {
    'use strict';

    function factory(langTranslate) {
        var translate = langTranslate('Accounts').translate,
            model = {
                pageHeading: translate('accountsHeader'),
                pageComingSoon: translate('comingsoon')
            };
        return model;
    }
    angular.module("uam").
    factory('accountsContent', ['appLangTranslate', factory]);
})(angular);