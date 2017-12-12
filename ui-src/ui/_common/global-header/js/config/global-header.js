//  Global Header Config

(function(angular) {
    "use strict";

    function config(cdnVer, headerModel, state) {
        headerModel.extendData({
            productLink: "#/dashbaord",
            // showProductName: true,
            // productNameText: "Commerical"
        });

        headerModel.setUserLinks([{
            "text": "Sign out",
            "event": "signout.rpGlobalHeader"
        }]);

        headerModel.setToolbarIcons({
            homeIcon: {
                // url: "#/",
                active: true
            }
        });
        headerModel.setToolbarIcons({
            homeIcon: {
                url: "#/dashboard",
                active: true
            },

            helpIcon: {
                active: true
            }
        });
        headerModel.userLinks.invoke = function(link) {
            sessionStorage.removeItem('sessionID');
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('companyName');
            state.go('login');
        };
        headerModel.toolbarIcons.invoke = function(icon) {
            state.go('home.dashbaord');
        };
    }

    angular
        .module("ui")
        .run(["cdnVer", "rpGlobalHeaderModel", '$state', config]);
})(angular);