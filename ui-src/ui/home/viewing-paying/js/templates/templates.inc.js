angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/viewing-paying/templates/checkbox.html",
"");
$templateCache.put("home/viewing-paying/templates/textbox.html",
"<div class=\"grid-edit-title\" ng-controller=\"viewpayCtrl as editTitle\"><rp-form-input-text config=\"ctrl.model.formConfig.lease\" rp-model=\"record[config.key]\"></rp-form-input-text></div>");
}]);
