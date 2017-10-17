angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenity-details/templates/floorplans.html",
"<div class=\"grid-col-cursor\" fpu-amenity-detail-actions ng-click=\"amenityDetailActions.showPropDetails(record)\"><span class=\"grid-col-floorPlans\">{{record.floorPlans}}</span></div>");
$templateCache.put("home/floorplan-unit/amenity-details/templates/index.html",
"<div ng-controller=\"FpuAmenityDetailsCtrl as amenityDetails\" class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-1\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\" ng-if=\"amenityDetails.isPageActive\"><a ng-click=\"amenityDetails.model.closeAsideDetail()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Amenity Details - {{amenityDetails.model.record.amenityName}}</h2></div><div class=\"rp-aside-modal-content floorplan-amenity-details\" ng-if=\"amenityDetails.isPageActive\"><div class=\"row-detail\"><div class=\"row-detail-head\"><div class=\"grid-col-name\">Name</div><div class=\"grid-col-prop\">Properties</div><div class=\"grid-col-price\">Price</div></div><div class=\"row-detail-body\"><div class=\"grid-col-name\"><span class=\"amenity-name\">{{amenityDetails.model.record.amenityName}}</span><br><span class=\"synd-name\">{{amenityDetails.model.record.amenitySyndicationName}}</span></div><div class=\"grid-col-prop\">{{amenityDetails.model.record.totalProperties}}</div><div class=\"grid-col-price\">{{amenityDetails.model.record.priceRange}}</div></div></div><div class=\"prop-detail\"><div class=\"prop-detail-header-title\">Properties</div><div class=\"new-btn\"><button class=\"btn rounded primary\" ng-click=\"amenityDetails.assignPropertiesToAmenity()\"><i class=\"fa fa-fw fa-plus icon-size\"></i> Assign Properties</button></div><div class=\"filters\"><div class=\"grid-controls\"><!-- <div class=\"grid-control-item \">\n" +
"                        <i class=\"icon fa fa-th-list \"></i>\n" +
"                    </div>\n" +
"                    <div class=\"grid-control-item \">\n" +
"                        <i class=\"icon fa  fa-th-large icon-color\"></i>\n" +
"                    </div> --><div class=\"grid-control-item\"><i class=\"icon rp-icon-printer\"></i> <span class=\"text\">Print</span></div><div class=\"grid-control-item\"><rp-toggle model=\"amenityDetails.grid.filtersModel.state.active\" options=\"{\n" +
"                                defaultText: 'Filter' ,\n" +
"                                activeIconClass: 'rp-icon-filter',\n" +
"                                defaultIconClass: 'rp-icon-filter active'\n" +
"                            }\"></rp-toggle></div></div></div></div><div class=\"prop-detail-grid\"><rp-grid model=\"amenityDetails.grid\"></rp-grid><rp-grid-pagination model=\"amenityDetails.gridPagination\"></rp-grid-pagination></div></div></div>");
$templateCache.put("home/floorplan-unit/amenity-details/templates/name.html",
"<div class=\"grid-col-cursor\" fpu-amenity-detail-actions ng-click=\"amenityDetailActions.showPropDetails(record)\"><span class=\"grid-col-name\">{{record.siteName}}</span></div>");
$templateCache.put("home/floorplan-unit/amenity-details/templates/units.html",
"<div class=\"grid-col-cursor\" fpu-amenity-detail-actions ng-click=\"amenityDetailActions.showPropDetails(record)\"><span class=\"grid-col-units\">{{record.units}}</span></div>");
}]);
