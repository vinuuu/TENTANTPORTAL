//  Global Header Config

(function (angular) {
    "use strict";

    function config(cdnVer, headerModel) {
        headerModel.extendData({
            showProductName: true,
            productNameText: "AngularJS RAUL Demo"
        });

        headerModel.setUserLinks([
            {
                "newWin": true,
                "text": "Client Portal",
                "url": "/product/clientportal"
            },
            {
                "text": "Manage Profile",
                "event": "manageProfile.rpGlobalHeader"
            },
            {
                "text": "Sign out",
                "event": "signout.rpGlobalHeader"
            }
        ]);

        headerModel.setToolbarIcons({
            homeIcon: {
                url: "#/",
                active: true
            }
        });
    }

    angular
        .module("rp-demo")
        .run(["cdnVer", "rpGlobalHeaderModel", config]);
})(angular);
