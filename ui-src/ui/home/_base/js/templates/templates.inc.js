angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/base/templates/checkbox.html",
"");
$templateCache.put("home/base/templates/textbox.html",
"<div class=\"grid-edit-title\">{{record[config.key]}}<!-- <rp-form-input-text config=\"model.formConfig.lease\" rp-model=\"record[config.key]\">\n" +
"    </rp-form-input-text> --></div>");
}]);
