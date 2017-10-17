//  Initialize Angular App Modules

(function () {
    "use strict";
    var base, dependencies;

    base = ["app"];

    dependencies = [
        "rpActionsMenu",
        "rpAuthorization",
		"rpAuthentication",
        "rpBreadcrumbs",
        "rpBusyIndicator",
        "rpCollapsibleList",
        "rpComplexGrid",
        "rpDatepicker",
        "rpDatetimepicker",
        "rpDateRange",
        "rpDraggable",
        "rpDroppable",
        "rpExpandableList",
        "rpFloatScroll",
        "rpFormTrackChanges",
        "rpFormInput",
        "rpFormInputDate",
        "rpFormInputText",
        "rpFormSelectMenu",
		"rpGlobalNav",
        "rpGlobalHeader",
        "rpGrid",
        "rpInlineDialog",
        "rpInputDate",
        "rpLanguage",
        "rpNotifications",
        "rpPageTitle",
        "rpPagination",
        "rpPopover",
        "rpPrimaryNav",
        "rpPropertyPicker",
        "rpSessionInfo",
        "rpSlideToggle",
        "rpTabsMenu",
        "rpToggle",
        "rpUser",
        "rpWorkspaces",
        "rpScrollingTabsMenu",
        "rpFormTextarea",
        "rpDaterangepicker",
		"rpGlobalNavModelProvider"
    ];

    dependencies.forEach(function (moduleName) {
        angular.module(moduleName, []);
    });

    angular
        .module("uam", dependencies.concat(base));
})();
