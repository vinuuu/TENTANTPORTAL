angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/invoice/templates/checkbox.html",
"");
$templateCache.put("home/invoice/templates/labelStatus.html",
"<div class=\"grid-edit-title\">dddd <span style=\"color:red\">haiiii</span></div>");
$templateCache.put("home/invoice/templates/textbox.html",
"<div class=\"grid-edit-title\"><rp-form-input-text config=\"model.formConfig.lease\" rp-model=\"record[config.key]\"></rp-form-input-text></div>");
}]);
