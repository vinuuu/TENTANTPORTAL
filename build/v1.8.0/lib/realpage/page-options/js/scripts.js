//  Source: _lib\realpage\page-options\js\_bundle.inc
angular.module("rpPageOptions", []);

//  Source: _lib\realpage\page-options\js\templates\add-to-favorites.js
//  Add To Favorites Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/add-to-favorites.html";

    templateHtml = "" +

    "<div class='add-to-favorites rp-inline-workflow not-ready' " +
        "rp-slide-toggle='model.slideToggle'>" +
        "<div class='workflow-inner-wrap'>" +
            "<a href='' class='workflow-close' ng-click='fav.closeForm()'>" +
            "</a>" +
            "<h2 class='workflow-title'>" +
                "{{model.text.title}}" +
            "</h2>" +

            "<div class='select-group'>" +
                "<p class='menu-label'>{{model.text.group}}</p>" +

                "<select " +
                    "name='favGroup' " +
                    "class='rp-form-select' " +
                    "ng-model='model.groupId' " +
                    "rp-update-display-text='true' " +
                    "rp-select-options='model.groupOptions' " +
                    "ng-options='option.value as option.name for option in model.groupOptions.options'>" +
                "</select> " +
            "</div>" +

            "<p class='workflow-actions'>" +
                "<a href='' class='button add' ng-click='fav.add()'>" +
                    "{{model.text.add}}" +
                "</a>" +
                "<a href='' class='button white cancel' " +
                    "ng-click='fav.closeForm()'>" +
                    "{{model.text.cancel}}" +
                "</a>" +
            "</p>" +
        "</div>" +
    "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpPageOptions")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\page-options\js\models\add-to-favorites.js
//  Add To Favorites Model

(function (angular) {
    "use strict";

    function factory(groupOptions) {
        var text,
            state,
            options,
            model = {},
            slideToggle;

        state = {
            open: false
        };

        slideToggle = {
            state: state,
            name: 'favForm'
        };

        text = {
            title: 'Add To Favorites',
            group: 'Group',
            add: 'Add',
            cancel: 'Cancel'
        };

        model.init = function () {
            model.text = text;
            model.slideToggle = slideToggle;
            model.groupOptions = groupOptions;
            model.groupId = groupOptions.getSelectedValue();
            groupOptions.onReady(model.onReady);
            return model;
        };

        model.onReady = function () {
            model.groupId = groupOptions.getSelectedValue();
        };

        model.open = function () {
            state.open = true;
        };

        model.close = function () {
            state.open = false;
        };

        return model.init();
    }

    angular
        .module("rpPageOptions")
        .factory('addToFavoritesModel', ['favGroupOptions', factory]);
})(angular);

//  Source: _lib\realpage\page-options\js\controllers\add-to-favorites.js
//  Add To Favorites Controller

(function (angular) {
    "use strict";

    function AddToFavoritesCtrl($scope, location, model, favoritesModel, authorization, favoritesSvc) {
        var options,
            vm = this;

        vm.init = function() {
            $scope.model = model;
            $scope.$on('$destroy', vm.closeForm);
        };

        vm.add = function() {
            var fav, pageInfo = authorization.pageInfo();

            fav = {
                groupId: model.groupId,
                link: {
                    sequence: 0,
                    favoriteID: 0,
                    dirtyBit: true,
                    guid: pageInfo.guid,
                    legacyFunctionName: "",
                    url: location.absUrl(),
                    tempGroupID: model.groupId,
                    title: pageInfo.activityName,
                    favoriteGroupID: model.groupId,
                    displayName: pageInfo.activityName,
                    activityUIID: pageInfo.activityUIID
                }
            };

            favoritesModel.addFav(fav).save().then(favoritesModel.reLoad);
            vm.closeForm();
        };


        vm.closeForm = function() {
            model.close();
        };

        vm.init();
    }

    angular
        .module("rpPageOptions")
        .controller('AddToFavoritesCtrl', [
            '$scope',
            'location',
            'addToFavoritesModel',
            'favoritesModel',
            'authorization',
            'favorites',
            AddToFavoritesCtrl
        ]);
})(angular);

//  Source: _lib\realpage\page-options\js\directives\add-to-favorites.js
//  Add To Favorites Directive

(function (angular) {
    "use strict";

    function addToFavorites() {
        function link(scope, elem, attr) {}

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            controller: 'AddToFavoritesCtrl as fav',
            templateUrl: "templates/realpage/add-to-favorites.html"
        };
    }

    angular
        .module("rpPageOptions")
        .directive('addToFavorites', [addToFavorites]);
})(angular);


//  Source: _lib\realpage\page-options\js\templates\page-options.js
//  Page Options Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/page-options.html";

    templateHtml = "" +

    "<div class='page-options' ng-class='ctrl.getState()'>" +
        "<div class='rp-actions-menu' model='model.menuOptions'>" +
        "</div>" +
        "<span class='icon-fav'>" +
        "</span>" +
    "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpPageOptions")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\page-options\js\models\page-options.js
//  Page Options Model

(function (angular) {
    "use strict";

    function factory() {
        var model = {};

        model.setActions = function (actions) {
            model.menuOptions = {
                className: 'rp-actions-menu-1',
                actions: [
                    {
                        hide: false,
                        text: 'Add to Favorites',
                        className: 'add-fav-link',
                        iconClassName: 'add-fav',
                        method: actions.openForm
                    },
                    {
                        hide: false,
                        text: 'Remove from Favorites',
                        className: 'del-fav-link',
                        iconClassName: 'del-fav',
                        method: actions.delFav
                    },
                    {
                        hide: false,
                        iconClassName: 'set-as-home',
                        className: 'set-as-home-link',
                        text: 'Make this my Home page',
                        method: actions.setAsHome
                    }
                ]
            };
        };

        model.setAsHome = function (bool) {
            model.menuOptions.actions.forEach(function (item) {
                if (item.iconClassName == 'set-as-home') {
                    item.hide = bool;
                }
            });
        };

        return model;
    }

    angular
        .module("rpPageOptions")
        .factory('pageOptionsModel', [factory]);
})(angular);

//  Source: _lib\realpage\page-options\js\controllers\page-options.js
//  Add To Favorites Controller

(function (angular) {
    "use strict";

    function PageOptionsCtrl($scope, location, model, pageOptions, auth, userAccess, favoritesModel, homepage) {
        var options,
            vm = this,
            pageInfo = auth.pageInfo();

        vm.init = function () {
            $scope.model = model;
        };

        vm.setAsHome = function (pageInfo) {
            var homepg = {
                activityUIID: pageInfo.activityUIID
            };

            pageOptions.setHomepage(homepg);
            homepage.set(pageInfo.url);
        };

        vm.atHome = function () {
            return location.fullUrl() == homepage.get();
        };

        vm.getState = function () {
            return {
                'allow-fav': userAccess.allowSetFav(),
                'is-fav': favoritesModel.isFav(pageInfo.guid),
                'allow-home': userAccess.allowSetHome() && !vm.atHome()
            };
        };

        vm.init();
    }

    angular
        .module("rpPageOptions")
        .controller('PageOptionsCtrl', [
            '$scope',
            'location',
            'pageOptionsModel',
            'pageOptions',
            'authorization',
            'userAccess',
            'favoritesModel',
            'rpHomepage',
            PageOptionsCtrl
        ]);
})(angular);

//  Source: _lib\realpage\page-options\js\directives\page-options.js
//  Page Options Directive

(function (angular) {
    "use strict";

    function pageOptions(model, favoritesModel, form, authorization) {
        function link(scope, elem, attr, ctrl) {
            var dir = {},
                pageInfo = authorization.pageInfo();

            dir.init = function () {
                scope.dir = dir;
                scope.model = model;
                model.pageInfo=pageInfo;
                model.setActions(dir);
            };

            dir.openForm = function () {
                form.open();
            };

            dir.delFav = function () {
                favoritesModel.delFav(model.pageInfo.guid).save().then(favoritesModel.reLoad);
            };

            dir.setAsHome = function () {
                ctrl.setAsHome(model.pageInfo);
            };

            dir.init();
        }

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            controller: 'PageOptionsCtrl as ctrl',
            templateUrl: "templates/realpage/page-options.html"
        };
    }

    angular
        .module("rpPageOptions")
        .directive('pageOptions', [
            'pageOptionsModel',
            'favoritesModel',
            'addToFavoritesModel',
            'authorization',
            pageOptions
        ]);
})(angular);

//  Source: _lib\realpage\page-options\js\services\page-options.js
//  Favorites Service

(function (angular) {
    "use strict";

    function pageOptions($resource) {
        var prefix = '/api/core/common/homepage/:activityUIID',
            defaults, actions, url;

        function setHomepage() {
            url = prefix;

            defaults = {};

            actions = {
                setHomepage: {
                    method: 'POST',
                    params: {
                        activityUIID: '@activityUIID'
                    }
                }
            };

            return $resource(url, defaults, actions).setHomepage;
        }

        return {
            setHomepage: setHomepage()
        };
    }

    angular
        .module("rpPageOptions")
        .factory('pageOptions', ['$resource', pageOptions]);
})(angular);

