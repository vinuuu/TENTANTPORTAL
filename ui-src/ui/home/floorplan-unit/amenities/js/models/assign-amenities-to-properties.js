//  Amenities List Manager Model

(function (angular) {
    "use strict";

    function factory(slectamenitiesSvc, selectManagerModel, assignPropModel, ameAssignPropAsideManager) {
        var model = {};

        model.init = function () {

            return model;
        };

        model.getSelectData = function (selAmenities) {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            slectamenitiesSvc.getData(params)
                .then(model.setDataFromSvc, model.setDataErr);
        };

        model.setDataFromSvc = function (data) {
            selectManagerModel.setData(data);
            model.setAllData(selectManagerModel.getList());
            model.assignPropertiesToAmenity();
            return model;
        };

        model.getPropertyList = function () {
            return selectManagerModel.getSelectedList();
        };

        model.assignPropertiesToAmenity = function () {
            // assignPropModel.assignPropertiesToAmenity();
            ameAssignPropAsideManager.showAsideModal();
        };

        model.setAllData = function (data) {
            assignPropModel.setAllData(data);
            return model;
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("assignAmenitiesToProperties", ["selectAmenityDetailDataSvc", "SelectAmenitiesListManager", "amenityAssignPropModel", "AmenityAssignPropAsideManager", factory]);
})(angular);
