// //  Amenities List Item Model

// (function (angular) {
//     "use strict";

//     function factory() {
//         return function () {
//             var model = {};

//             model.amenityID = "";
//             model.amenityName = "";
//             model.amenitySyndicationName = "";
//             model.totalProperties = "";
//             model.minPrice = "";
//             model.maxPrice = "";
//             model.priceRange = model.getPriceRange();
//             model.isSelected = false;

//             model.setData = function (item) {
//                 model.setAmenityID(item.amenityID);
//                 model.setAmenityName(item.amenityName);
//                 model.setAmenitySyndicationName(item.amenitySyndicationName);
//                 model.setTotalProperties(item.totalProperties);
//                 model.setMinPrice(item.minPrice);
//                 model.setMaxPrice(item.maxPrice);
//                 model.getPriceRange();
//                 model.setSelected(item.isSelected);
//                 return model;
//             };

//             model.setAmenityID = function (id) {
//                 model.amenityID = id;
//                 return model;
//             };

//             model.setAmenityName = function (name) {
//                 model.amenityName = name;
//                 return model;
//             };

//             model.setAmenitySyndicationName = function (name) {
//                 model.amenitySyndicationName = name;
//                 return model;
//             };

//             model.setTotalProperties = function (prop) {
//                 model.totalProperties = prop;
//                 return model;
//             };

//             model.setMinPrice = function (min) {
//                 model.minPrice = min;
//                 return model;
//             };

//             model.setMaxPrice = function (max) {
//                 model.maxPrice = max;
//                 return model;
//             };

//             model.getPriceRange = function () {
//                 return model.minPrice + "  " + model.maxPrice;
//             };

//             model.setSelected = function (bool) {
//                 model.isSelected = bool;
//                 return model;
//             };

//             model.destroy = function () {
//                 model = undefined;
//             };

//             return model;
//         };
//     }

//     angular
//         .module("uam")
//         .factory("amenitiesListItem", [factory]);
// })(angular);
