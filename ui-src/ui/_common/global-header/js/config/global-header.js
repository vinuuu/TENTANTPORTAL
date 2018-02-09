//  Global Header Config

(function(angular) {
    "use strict";

    function config(cdnVer, headerModel, state, http) {
        headerModel.extendData({
            productLink: "#/dashbaord",
            // showProductName: true,
            // productNameText: "Commerical"
        });

        headerModel.setUserLinks([{
            "text": "Sign out",
            "event": "signout.rpGlobalHeader"
        },{
            "text": "Settings",
            "event": "signout.rpGlobalHeader"
        }]);

        headerModel.setToolbarIcons({
            homeIcon: {
                 url: "#/dashboard",
                active: true
            }
        });
        headerModel.setToolbarIcons({
            homeIcon: {
                url: "#/dashboard",
                active: true
            },

            // helpIcon: {
            //     active: true
            // }
        });
        headerModel.userLinks.invoke = function(link) {
            if(link.text==="Settings"){
                state.go('home.settings');
            }
            else{
            //var URL="https://rpidevntw008.realpage.com/users/sarroju/Q12018RELEASE-QA.accounting/tenant/apigw.phtml";
            var URL = 'api/logout';
            http.post(URL,
                {
                    "request": {
                      "operation": {
                        "content": {
                          "function": {
                               "getlogout": {}
                          }
                        }
                      }
                    }
                  }
            ).then(function(){
                sessionStorage.removeItem('sessionID');
                sessionStorage.removeItem('userName');
                sessionStorage.removeItem('companyName');
                state.go('login');
            });
        }
        };
        headerModel.toolbarIcons.invoke = function(icon) {
            state.go('home.dashbaord');
        };
    }

    angular
        .module("ui")
        .run(["cdnVer", "rpGlobalHeaderModel", '$state', '$http', config]);
})(angular);

angular.module("ui").filter('IsNumber',['$filter', function ($filter) {
    return function (item) {
      if (angular.isNumber(item)) {
         return $filter('currency')(item);
      }
      else{
          return item !=""?'$'+item:"";
      }   
      return item;
    };
  }]); 