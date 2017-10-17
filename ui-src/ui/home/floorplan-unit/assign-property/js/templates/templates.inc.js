angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/assign-property/templates/assign-property-aside.html",
"<div class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-2\" ng-controller=\"FloorPlanUnitAmenityAssignPropCtrl as fpaPropCtrl\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\" ng-if=\"fpaPropCtrl.isPageActive\"><a ng-click=\"fpaPropCtrl.closeAside()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Assign Properties</h2></div><div class=\"rp-aside-modal-content floorplan-amenity-assign-prop\" ng-if=\"fpaPropCtrl.isPageActive\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><rp-toggle model=\"fpaPropCtrl.grid.filtersModel.state.active\" options=\"{\n" +
"                    defaultText: 'Filter',\n" +
"                    activeIconClass: 'rp-icon-filter',\n" +
"                    defaultIconClass: 'rp-icon-filter active'\n" +
"                }\"></rp-toggle></div></div><div class=\"assign-prop-grid\"><rp-grid model=\"fpaPropCtrl.grid\"></rp-grid><rp-grid-pagination model=\"fpaPropCtrl.gridPagination\"></rp-grid-pagination></div></div><div class=\"rp-aside-modal-footer rp-aside-modal-footer-btns aside-btns\"><button ng-click=\"fpaPropCtrl.closeAside()\" class=\"btn rounded btn-outline b-primary text-primary pad-left\">Cancel</button> <button ng-click=\"fpaPropCtrl.assign()\" class=\"btn rounded primary pad-left\">Assign</button></div></div>");
}]);
