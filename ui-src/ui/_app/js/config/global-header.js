//  Global Header Config

(function (angular) {
    "use strict";

    function config(cdnVer, headerModel) {
        headerModel.extendData({
            logoLink: "",
            logoImgSrc: "../" + cdnVer + "/lib/realpage/global-header/images/rp-logo-white.png",

            productLink: "",
            productName: "My RealPage",

            "homeUrl": "/#/",
            "manageUrl": "/#/products",

            "userAvatarUrl": "../" + cdnVer + "/lib/realpage/global-header/images/user-avatar.jpg"
        });

        headerModel.setUserLinks([
            {
                "type": "link",
                "newWindow": false,
                "text": "Settings",
                "url": "/#/profile-settings",
            },
            {
                "type": "event",
                "text": "Sign out",
                "eventName": "signout"
            }
        ]);
    }

    angular
        .module("uam")
        .run(["cdnVer", "rpGlobalHeaderModel", config]);
})(angular);
