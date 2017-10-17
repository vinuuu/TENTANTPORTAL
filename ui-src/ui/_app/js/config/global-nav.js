// Configure Primary Navigation

(function (angular) {
	'use strict';

	function config(prov) {
		var navData = [{
			labelText: 'Leasing & Occupancy',
			labelLink: '/ui/lrc/',
			iconClassName: 'rp-icon-hotel-2'
		}, {
			labelText: 'Payments',
			labelLink: '/ui/coming-soon/',
			iconClassName: 'rp-icon-card'
		}, {
			labelText: 'Affordable',
			labelLink: '/ui/affordable/',
			iconClassName: 'rp-icon-home'
		}, {
			labelText: 'Care',
			labelLink: '/ui/coming-soon/',
			iconClassName: 'rp-icon-heartbeat'
		}, {
			labelText: 'Budgeting',
			labelLink: '/ui/budgeting/',
			iconClassName: 'rp-icon-statistics-5'
		}, {
			labelText: 'Documents',
			labelLink: '/ui/coming-soon/',
			iconClassName: 'rp-icon-folder'
		}];

		prov.setData(navData);
	}

	angular
        .module('uam')
        .config(['rpGlobalNavModelProvider', config]);
})(angular);
