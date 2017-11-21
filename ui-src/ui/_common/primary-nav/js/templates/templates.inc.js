angular.module('ui').run(['$templateCache', function($templateCache) {
    $templateCache.put("app/templates/nav.html",
        "<div class=\"leftNavWrapper\"><!--Toggle Wrapper--><div class=\"toggleWrapper\"><a href=\"javascript:void(0);\" class=\"toggleButton\"><i class=\"fa fa-bars\" aria-hidden=\"true\"></i></a></div><!--End Toggle Wrapper--><div class=\"scrollWrapper\"><!-- Left Nav Item Wrapper--><div class=\"topNavWrapper\" ng-repeat=\"navItem in model.navData\"><a ng-href=\"../{{ navItem.labelLink }}\" class=\"topNavHeaderClick\"><div class=\"topNavHeader\"><i class=\"icon\" ng-class=\"navItem.icon\" aria-hidden=\"true\"></i> <span class=\"topNavHeaderText\">{{ navItem.labelText }}</span> <i ng-show=\"navItem.subNav\" class=\"fa fa-chevron-down endPoint\" aria-hidden=\"true\"></i></div></a><!-- <div class=\"subNavMouseOver\">\n" +
        "              <div class=\"subNavWrapper\" ng-repeat=\"navSubItem in navData\">\n" +
        "                <div class=\"subNavItemWrapper\">\n" +
        "                 <a ng-href=\"../{{ navSubItem.labelLink }}\" class=\"subNavClick\">\n" +
        "                    <span class=\"subNavTextWrapper\">{{ navSubItem.labelText }}</span>\n" +
        "                  </a>\n" +
        "                </div>\n" +
        "              </div>\n" +
        "            </div> --></div><!-- End Left Nav Item Wrapper--></div></div>");
}]);