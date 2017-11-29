angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("app/templates/breadcrumbs.html",
"<div class=\"rp-breadcrumbs\"><a class=\"home-icon {{::$ctrl.model.home.icon}}\" href=\"{{::$ctrl.model.home.url}}\"></a><div class=\"pull-left ft-b-r\"><div class=\"product-name\">{{$ctrl.model.product.name}}</div><div class=\"rp-breadcrumbs-links\"><div class=\"rp-breadcrumb home-link\"><a href=\"{{$ctrl.model.home.url}}\" class=\"rp-breadcrumb-text\">{{$ctrl.model.home.text}}</a></div><ul class=\"rp-breadcrumbs-list\"><li ng-repeat=\"link in $ctrl.model.links\" class=\"rp-breadcrumb p-a-0\"><a href=\"{{link.href}}\" class=\"rp-breadcrumb-text\">{{link.text}}</a></li></ul><div class=\"active-page rp-breadcrumb\"><span class=\"active-page-text rp-breadcrumb-text\">{{$ctrl.model.activePage.text}}</span></div></div><div class=\"rp-breadcrumb home-link\" ng-if=\"!$ctrl.model.hasBreadCrumb\"><a href=\"{{$ctrl.model.backLink.href}}\" class=\"rp-breadcrumb-text\"><i class=\"rp-icon-angle-left ft-s-10 p-r-xs\"></i>{{$ctrl.model.backLink.text}}</a></div></div></div>");
$templateCache.put("app/templates/history-navigation.html",
"<div class=\"rp-breadcrumbs\" ng-show=\"model.isVisible\"><a class=\"home-icon {{::model.home.icon}}\" href=\"{{::model.home.url}}\"></a><div class=\"pull-left ft-b-r\"><div class=\"product-name\">{{model.product.name}}</div><div class=\"rp-breadcrumbs-links\"><div class=\"home-link\"><a href=\"{{model.url}}\" class=\"rp-breadcrumb-text\"><i class=\"rp-icon-angle-left\"></i>{{model.home.text}}</a></div><div class=\"rp-breadcrumb home-link\"><a href=\"{{model.home.url}}\" class=\"rp-breadcrumb-text\">{{model.home.text}}</a></div><ul class=\"rp-breadcrumbs-list\"><li ng-repeat=\"link in model.links\" class=\"rp-breadcrumb p-a-0\"><a href=\"{{link.href}}\" class=\"rp-breadcrumb-text\">{{link.text}}</a></li></ul><div class=\"active-page rp-breadcrumb\"><span class=\"active-page-text rp-breadcrumb-text\">{{model.activePage.text}}</span></div></div></div></div>");
$templateCache.put("app/templates/nav.html",
"<div class=\"leftNavWrapper\"><!--Toggle Wrapper--><div class=\"toggleWrapper\"><a href=\"javascript:void(0);\" class=\"toggleButton\"><i class=\"fa fa-bars\" aria-hidden=\"true\"></i></a></div><!--End Toggle Wrapper--><div class=\"scrollWrapper\"><!-- Left Nav Item Wrapper--><div class=\"topNavWrapper\" ng-repeat=\"navItem in model.navData\"><a ng-href=\"../{{ navItem.link }}\" class=\"topNavHeaderClick\"><div class=\"topNavHeader\"><i class=\"icon\" ng-class=\"navItem.icon\" aria-hidden=\"true\"></i> <span class=\"topNavHeaderText\">{{ navItem.text }}</span> <i ng-show=\"navItem.subNav\" class=\"fa fa-chevron-down endPoint\" aria-hidden=\"true\"></i></div></a><!-- <div class=\"subNavMouseOver\">\n" +
"              <div class=\"subNavWrapper\" ng-repeat=\"navSubItem in navItem.subNav\">\n" +
"                <div class=\"subNavItemWrapper\">\n" +
"                  <a ng-href=\"../{{ navSubItem.link }}\" class=\"subNavClick\">\n" +
"                    <span class=\"subNavTextWrapper\">{{ navSubItem.text }}</span>\n" +
"                  </a>\n" +
"                </div>\n" +
"              </div>\n" +
"            </div> --></div><!--End Left Nav Item Wrapper--></div></div>");
$templateCache.put("app/templates/textbox.html",
"<div class=\"grid-edit-title\"><rp-form-input-text config=\"model.formConfig.lease\" rp-model=\"record[config.key]\"></rp-form-input-text></div>");
}]);
