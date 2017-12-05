(function() {
    'use strict';

    var templateHtml, templateUrl;

    templateUrl = "app/error/templates/default-not-found.tpl.html";

    templateHtml = "" +
        '<div class="app-body warning bg-auto">' +
        '<div class="text-center pos-rlt p-y-md">' +
        '<h1 class="text-shadow m-a-0 text-white text-4x">' +
        '<span class="text-2x font-bold block m-t-lg">{{::page.model.statusCode}}</span>' +
        '</h1>' +
        '<h2 class="h1 m-y-lg text-white">{{::page.model.title}}</h2>' +
        '<p class="h5 m-y-lg font-bold text-white">{{::page.model.message}}</p>' +
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