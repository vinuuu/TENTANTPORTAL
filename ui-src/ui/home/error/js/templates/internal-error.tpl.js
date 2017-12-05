(function() {
    'use strict';

    var templateHtml, templateUrl;

    templateUrl = "app/error/templates/internal-error.tpl.html";

    templateHtml = "" +
        '<div class="app-body primary bg-auto">' +
        '<div class="text-center pos-rlt p-y-md">' +
        '<h1 class="text-shadow text-white text-4x">' +
        '<span class="text-2x font-bold block m-t-lg">{{::page.model.statusCode}}</span>' +
        '</h1>' +
        '<p class="h5 m-y-lg font-bold">{{::page.model.title}}</p>' +
        '<p class="h5 m-y-lg font-bold">{{::page.model.message}}</p>' +
        '<a ui-sref="home" class="btn rounded accent md-raised p-x-md">' +
        '<span class="text-white">{{::page.model.btnBackText}}</span>' +
        '</a>' +
        '</div>' +
        '</div>';

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module('ui')
        .run(['$templateCache', installTemplate]);
})();