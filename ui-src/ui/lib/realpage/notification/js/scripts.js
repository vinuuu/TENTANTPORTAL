//  Source: _lib\realpage\notification\js\models\notification.js
//  Notification Model

(function (angular, undefined) {
    "use strict";

    function factory($rootScope, $compile, $templateCache, timeout, pNotify, stack, options) {
        function Notification() {
            var s = this;
            s.init();
        }

        var p = Notification.prototype;

        p.init = function () {
            var s = this;
            s.data = options();
            s.scope = $rootScope.$new();
        };

        // Setters

        p.setData = function (data) {
            var nfnData,
                s = this,
                type = "";

            angular.extend(s.data, data || {});
            nfnData = angular.copy(s.data);

            nfnData.stack = stack;
            type = s.data.type ? (" " + s.data.type) : " info";
            nfnData.addclass = stack.addclass + " rp-notification-wrap" + type;

            s.appendCallback(nfnData);

            s.nfn = pNotify(nfnData);

            return s;
        };

        // Getters

        p.getHtml = function () {
            var s = this;
            return $templateCache.get(s.data.templateUrl);
        };

        p.getNfnContent = function () {
            var s = this,
                html = s.getHtml(),
                elem = angular.element(html);

            s.scope.data = s.data;
            elem = $compile(elem)(s.scope);

            return elem;
        };

        // Actions

        p.afterClose = function () {
            var s = this;

            if (angular.isFunction(s.data.afterClose)) {
                s.data.afterClose();
            }

            timeout(s.cleanup.bind(s), 1000);
            return s;
        };

        p.afterInit = function (nfn) {
            var s = this,
                elem = s.getNfnContent();
            nfn.get().children().html(elem);

            nfn.get().css({
                left: "50%",
                marginLeft: -nfn.get().width() / 2
            });

            if (angular.isFunction(s.data.afterInit)) {
                s.data.afterInit();
            }

            return s;
        };

        p.appendCallback = function (data) {
            var s = this;
            data.after_init = s.afterInit.bind(s);
            data.after_close = s.afterClose.bind(s);
            data.after_open = s.execCallback.bind(s, "afterOpen");
            data.before_init = s.execCallback.bind(s, "beforeInit");
            data.before_open = s.execCallback.bind(s, "beforeOpen");
            data.before_close = s.execCallback.bind(s, "beforeClose");
        };

        p.execCallback = function (cbName) {
            var s = this;

            if (angular.isFunction(s.data[cbName])) {
                s.data[cbName]();
            }

            return s;
        };

        p.cleanup = function () {
            var s = this;

            if (s.nfn) {
                s.scope.$destroy();
                s.nfn.get().children().html("");
                s.nfn = undefined;
            }
        };

        p.close = function () {
            var s = this;
            s.nfn.close();
            return s;
        };

        return function (data) {
            return (new Notification()).setData(data);
        };
    }

    angular
        .module("rpNotification")
        .factory("rpNotificationModel", [
            "$rootScope",
            "$compile",
            "$templateCache",
            "timeout",
            "pNotify",
            "rpNotificationStack",
            "rpNotificationOptions",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\notification\js\models\notification-options.js
//  PNotify Settings Factory

(function (angular, undefined) {
    "use strict";

    function factory() {
        return function () {
            var options = {
                // Additional classes to be added to the notice. (For custom styling.)
                addclass: "",

                // Speed at which the notice animates in and out. "slow", "normal",
                // or "fast". Respectively, 400ms, 250ms, 100ms.
                animate_speed: "normal",

                // The animation to use when displaying and hiding the notice. "none"
                // and "fade" are supported through CSS. Others are supported
                // through the Animate module and Animate.css.
                animation: "fade",

                // Display the notice when it is created.
                auto_display: true,

                // Class to be added to the notice for corner styling.
                cornerclass: "",

                // Delay in milliseconds before the notice is removed.
                delay: 4000,

                // Whether to remove the notice from the global array when it is closed.
                destroy: true,

                // After a delay, remove the notice.
                hide: true,

                // Set icon to true to use the default icon for the selected
                // style/type, false for no icon, or a string for your own icon class.
                icon: true,

                // Change new lines to br tags.
                insert_brs: true,

                // Minimum height of the notice. It will expand to fit content.
                min_height: "16px",

                // Reset the hide timer if the mouse moves over the notice.
                mouse_reset: true,

                // More details callback
                moreDetailsCallback: angular.noop,

                // More details text
                moreDetailsText: "More Details",

                // Message Text
                msgText: "",

                // Remove the notice's elements from the DOM after it is removed.
                remove: true,

                // Display a drop shadow.
                shadow: true,

                // The stack on which the notices will be placed. Also controls the
                // direction the notices stack.
                stack: "defaultStack",

                // What styling classes to use. (Can be either "brighttheme", "bootstrap3", or "fontawesome".)
                styling: "brighttheme",

                // Default Template Url
                templateUrl: "realpage/notification/templates/notification.html",

                // The notice's text.
                text: false,

                // Whether to escape the content of the text. (Not allow HTML.)
                text_escape: false,

                // The notice's title.
                title: false,

                // Whether to escape the content of the title. (Not allow HTML.)
                title_escape: false,

                // Type of the notice. "notice", "info", "success", or "error".
                type: "notice",

                // Width of the notice.
                width: "500px"
            };

            options.buttons = {
                // The classes to use for button icons. Leave them null to use the classes from the styling you're using.
                classes: {
                    closer: null,
                    pin_up: null,
                    pin_down: null
                },

                // Provide a button for the user to manually close the notice.
                closer: true,

                // Only show the closer button on hover.
                closer_hover: true,

                // The various displayed text, helps facilitating internationalization.
                labels: {
                    close: "Close",
                    stick: "Stick",
                    unstick: "Unstick"
                },

                // Provide a button for the user to manually stick the notice.
                sticker: true,

                // Only show the sticker button on hover.
                sticker_hover: true,

                // Show the buttons even when the nonblock module is in use.
                show_on_nonblock: false
            };

            return options;
        };
    }

    angular
        .module("rpNotification")
        .factory("rpNotificationOptions", [factory]);
})(angular);

//  Source: _lib\realpage\notification\js\models\notification-stack.js
//  Notification Stack

(function (angular, undefined) {
    "use strict";

    function factory() {
        return {
            dir1: "up",
            dir2: "right",
            firstpos1: 20,
            firstpos2: "50%",
            addclass: "stack-bottomright"
        };
    }

    angular
        .module("rpNotification")
        .factory("rpNotificationStack", [factory]);
})(angular);

//  Source: _lib\realpage\notification\js\services\pnotify.js
//  PNotify Service

(function (angular) {
    "use strict";

    function factory($window) {
        return function (data) {
            return new $window.PNotify(data);
        };
    }

    angular
        .module("rpNotification")
        .factory("pNotify", ["$window", factory]);
})(angular);

//  Source: _lib\realpage\notification\js\templates\templates.inc.js
angular.module("rpNotification").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/notification/templates/notification.html",
"<div class=\"rp-notification\"><div class=\"rp-notification-cell rp-notification-icon-wrap\"><span class=\"rp-notification-icon\"></span></div><div class=\"rp-notification-cell rp-notification-msg-wrap\"><p class=\"rp-notification-msg\">{{::data.msgText}}</p></div><div ng-click=\"data.moreDetailsCallback()\" class=\"rp-notification-cell rp-notification-more-details-wrap\"><span ng-if=\"::data.moreDetailsText\" class=\"rp-notification-more-details\">{{::data.moreDetailsText}}</span></div></div>");
}]);
