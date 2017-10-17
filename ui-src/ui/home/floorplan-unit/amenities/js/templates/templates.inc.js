angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenities/templates/amenity-name.html",
"<div fpu-amenity-actions class=\"grid-col-cursor\" ng-click=\"amenityActions.showAmenity(record)\"><span class=\"grid-col-name\">{{record.amenityName}}</span> <span class=\"grid-col-synd-name\">{{record.amenitySyndicationName}}</span></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/amenity-price.html",
"<div fpu-amenity-actions class=\"grid-col-cursor\" ng-click=\"amenityActions.showAmenity(record)\"><span class=\"grid-col-price\">{{record.priceRange}}</span></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/amenity-prop.html",
"<div fpu-amenity-actions class=\"grid-col-cursor\" ng-click=\"amenityActions.showAmenity(record)\"><span class=\"grid-col-prop\">{{record.totalProperties}}</span></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/delete-amenities.html",
"<div class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">Delete Amenities</h5></div><div class=\"modal-body p-lg\"><p>You are about to remove {{ctrl.model.amenityNames}} from the amenity’s list. It will no longer be listed for your property or available to assign to floor plans /units.</p></div><div class=\"modal-footer text-center\"><button type=\"button\" class=\"btn rounded neutral p-x-md\" ng-click=\"ctrl.hideModal()\">Cancel</button> <button type=\"button\" class=\"btn rounded primary p-x-md\" ng-click=\"ctrl.confirmDeleteSelectedAmenities()\">Delete</button></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/delete-amenity.html",
"<div class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">Delete Amenities</h5></div><div class=\"modal-body p-lg\"><p>You are about to delete {{ctrl.model.delRecord.amenityName}} from the Master list. It will no longer be listed or available to assign to properties..</p></div><div class=\"modal-footer text-center\"><button type=\"button\" class=\"btn rounded neutral p-x-md\" ng-click=\"ctrl.hideDeleteAmenityModal()\">Cancel</button> <button type=\"button\" class=\"btn rounded primary p-x-md\" ng-click=\"ctrl.confirmDeleteAmenity()\">Delete</button></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/edit-amenity.html",
"<div fpu-amenity-actions><a ng-click=\"amenityActions.editAmenity(record)\"><i class=\"icon rp-icon-pencil\"></i></a></div>");
}]);
