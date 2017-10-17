// Primary Nav Directive

(function(angular) {
    'use strict';

    function primaryNav(primaryNavModel) {
        function link(scope, el, attrs) {
            var dir = {};

            function init() {
                scope.dir = dir;
				scope.navData={
					navData:[{
				labelText: 'Overview',
				labelLink: '/Overview/',
				iconClassName: 'rp-icon-hotel-2'
			}, {
				labelText: 'Account & Payments',
				labelLink: '/AcctPayments/',
				iconClassName: 'rp-icon-card'
			}, {
				labelText: 'Maintenance Request',
				labelLink: '/MaintRequest/',
				iconClassName: 'rp-icon-home'
			}, {
				labelText: 'Management Staff',
				labelLink: '/MgmtStaff/',
				iconClassName: 'rp-icon-heartbeat'
			}, {
				labelText: 'Documents',
				labelLink: '/Documents/',
				iconClassName: 'rp-icon-statistics-5'
			}, {
				labelText: 'Contact Us',
				labelLink: '/ContactUs/',
				iconClassName: 'rp-icon-folder'
			}]
				};
                scope.model = scope.navData;//primaryNavModel;
				logc(scope.model.navData);
                dir.watch = scope.$on('$destroy', dir.destroy);
            }

            dir.destroy = function () {
                dir.watch();
                dir = undefined;
            };

            init();
        }

        return {
            restrict: 'E',
            replace: true,
            link: link,
            scope: {},
            templateUrl: 'app/templates/nav.html'
        };
    }

    angular
        .module("rpPrimaryNav")
        .directive('rpPrimaryNav', ['primaryNav', primaryNav]);
})(angular);
