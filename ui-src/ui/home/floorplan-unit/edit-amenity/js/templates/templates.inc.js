angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/edit-amenity/templates/index.html",
"<div ng-controller=\"FpuEditAmenityCtrl as editAmenity\" class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-1\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\">Edit Amenity {{editAmenity.amenity}}</div><div class=\"rp-aside-modal-content\"></div></div>");
}]);
