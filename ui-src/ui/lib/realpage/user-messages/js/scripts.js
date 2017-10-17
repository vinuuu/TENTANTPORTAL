//  Source: _lib\realpage\user-messages\js\_bundle.inc
angular.module("rpUserMessages", []);

//  Source: _lib\realpage\user-messages\js\templates\user-messages.js
//  User Messages Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/common/user-messages/user-messages.html";

    templateHtml = "" +

    "<div class='user-messages' ng-class='model.state'>" +
        "<div class='message {{::msg.data.statusType}}' " +
            "ng-repeat='msg in model.messages'>" +

            "<div class='message-icon-{{::msg.data.statusType}}'></div>" +

            "<div class='heading'>" +
                "<div class='title'>" +
                    "{{::msg.translate('title', msg.data)}}" +
                "</div>" +
                "<div class='date'>{{::msg.data.msgStartDate}}</div>" +
            "</div>" +

            "<div class='message-content' " +
                "toggle-message-content='msg.data'>" +
                "<any ng-bind-html='msg.translate(\"actionValue\", msg.data) | htmlUnsafe'>" +
                "</any>" +
            "</div>" +

            "<div class='action' ng-if='msg.data.actionType'>" +
                "<div ng-switch='msg.data.actionType'>" +
                    "<div ng-switch-when='accept'>" +
                        "<input type='checkbox' " +
                            "id='checkbox{{$index}}' " +
                            "class='rp-form-checkbox' " +
                            "ng-model='msg.data.acceptBit' " +
                            "ng-change='model.updateActivityLog(msg.data.msgID)'/>" +
                        "<label class='checkbox-label' " +
                            "for='checkbox{{$index}}' >" +
                            "{{::msg.translate('actionText', msg.data)}}" +
                        "</label>" +
                    "</div>" +

                    "<div ng-switch-when='link'>" +
                        "<a href='{{::msg.data.actionUrl}}'>" +
                            "{{::msg.translate('actionText', msg.data)}}" +
                        "</a>" +
                    "</div>" +
                "</div>" +
            "</div>" +

        "</div>" +
    "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpUserMessages")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\user-messages\js\services\user-messages.js
//  User Messages Service

(function (angular) {
    "use strict";

    function userMessages($resource, cookie) {
        var langKey = cookie.read('LANG') || 'en-us';

        function getMessages() {
			var url = '/api/core/common/omsmessage/user/messages/' + langKey;
			return $resource(url).get;
        }

        function recordActivity () {
            var actions,
                defaults = {},
                url = '/api/core/common/OMSMessage/UserLog/:msgID/:msgulActionID';

            actions = {
                recordActivity: {
                    method: 'POST',

                     params: {
                        msgID: '@msgID',
                        msgulActionID: 2
                    }
                }
            };

            return $resource(url, defaults, actions).recordActivity;
        }

        return {
            get: getMessages(),
            recordActivity: recordActivity()
        };

    }

    angular
        .module("rpUserMessages")
        .factory('userMessages', [
            '$resource',
            'rpCookie',
            userMessages
        ]);
})(angular);

//  Source: _lib\realpage\user-messages\js\models\user-messages.js
//  User Messages Model

(function (angular) {
    "use strict";

    function factory(userMessages, userMessage, sessionStorage) {
        var state = {
            'critical-messages': false
        };

        var changePasswordMessage = {
            messageID: 0
        };

        var model = {
            state: state,
            messages: [],
            changePasswordUrl: '/ui/signin/#/change-password'
        };

        model.text = {
            viewAllMessages: 'view all messages'
        };

        model.load = function () {
            return userMessages.get(model.update);
        };

        model.update = function (data) {
            if (data && data.omsMessageUserList && data.omsMessageUserList.forEach) {
                data.omsMessageUserList.forEach(function (msg) {
                    var msgData = model.updateMsgData(msg);
                    model.messages.push(userMessage().init(msgData));
                });
            }
            return model;
        };

        model.updateMsgData = function (msg) {
            if (msg.actionName === 'change-password') {
                msg.actionUrl = model.changePasswordUrl;
                changePasswordMessage.messageID = msg.msgID;
                sessionStorage.set('changePasswordMessageData', changePasswordMessage);
            }
            return msg;
        };

        model.showAllMessages = function () {
            state['critical-messages'] = false;
            return model;
        };

        model.showCriticalMessages = function () {
            state['critical-messages'] = true;
            return model;
        };

        model.getMessagesCount = function () {
            return model.messages.length;
        };

        model.hasMessages = function () {
            return model.messages.length > 0;
        };

        model.getCriticalMessagesCount = function () {
            var count = 0;
            model.messages.forEach(function (message) {
                if (message.isCritical()) {
                    count++;
                }
            });
            return count;
        };

        model.hasCriticalMessages = function () {
            return model.getCriticalMessagesCount() > 0;
        };

        model.reset = function () {
            model.messages.flush();
            state['critical-messages'] = false;
        };

        model.updateActivityLog = function (msgId) {
            var dataParams = {
                'msgID': msgId,
                'msgulActionID': 2
            };

            userMessages.recordActivity(dataParams, {});
        };

        return model;
    }

    angular
        .module("rpUserMessages")
        .factory('userMessagesModel', [
            'userMessages',
            'userMessageModel',
            'rpSessionStorage',
            factory
        ]);
})(angular);

//  Source: _lib\realpage\user-messages\js\models\user-message.js
//  User Message Model

(function (angular) {
    "use strict";

    function factory(appTranslate, sessionStorage) {
        return function () {
            var model = {};

            model.data = {};

            model.translate = appTranslate('userMessages').translate;

            model.init = function (data) {
                model.data = data;
                model.updateChangePassword(data);
                return model;
            };

            model.isCritical = function () {
                return model.data.statusType === 'critical';
            };

            model.updateChangePassword = function (data) {
                if (data.actionName == 'change-password') {
                    var msgData = {};
                    msgData.messageID = msgData.msgID;
                    data.actionUrl = '/ui/signin/#/change-password';
                    sessionStorage.set('changePasswordMessageData', msgData);
                }

                return data;
            };

            model.updateMessageData = function (data) {
                var saveData = data;
                if (data) {
                    data = model.translate('messageData', data);
                }
                return saveData;
            };

            return model;
        };
    }

    angular
        .module("rpUserMessages")
        .factory('userMessageModel', ['appLangTranslate', 'rpSessionStorage', factory]);
})(angular);

//  Source: _lib\realpage\user-messages\js\directives\user-messages.js
//  User Messages Directive

(function (angular, und) {
    "use strict";

    function userMessages(model) {
        function link(scope, elem, attr) {
            var watch,
                dir = {};

            dir.init = function () {
                scope.dir = dir;
                model.load();
                scope.model = model;
                watch = scope.$on('$destroy', dir.destroy);
            };

            dir.showAllMessages = function () {
                model.showAllMessages();
            };

            dir.destroy = function () {
                watch();
                model.reset();
                scope.model = und;
            };

            dir.init();
        }

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/common/user-messages/user-messages.html"
        };
    }

    angular
        .module("rpUserMessages")
        .directive('userMessages', ['userMessagesModel', userMessages]);
})(angular);

//  Source: _lib\realpage\user-messages\js\directives\toggle-message-content.js
//  Toggle Message Content Directive

(function (angular) {
    "use strict";

    function toggleMessageContent($compile, appTranslate, timeout, device) {
        var index = 1;

        function link(scope, elem, attr) {
            var dir = {
                isOpen: false,
                toggleText: 'readMore',
                instName: 'toggleMessageContent' + index++,
                translate: appTranslate('common').translate,
                click: device.clickEvent('toggleMessageContent')
            };

            dir.init = function () {
                scope[dir.instName] = dir;
                dir.watch = scope.$watch(dir.hasHeight, dir.setup);
            };

            dir.getToggleElem = function () {
                var html = '<span class="toggle-message-content">' +
                    '{{' + dir.instName + '.translate(' + dir.instName +
                    '.toggleText)}}</span>',
                    toggle = angular.element(html);

                return $compile(toggle)(scope);
            };

            dir.setup = function (bool) {
                if (bool) {
                    dir.watch();
                }

                if (dir.enabled()) {
                    dir.closedHeight = 65;
                    dir.openHeight = elem.height();
                    var toggle = dir.getToggleElem();

                    elem
                        .append(toggle)
                        .css('height', dir.closedHeight)
                        .addClass('toggle-enabled closed');

                    toggle.on(dir.click, dir.onClick);
                }
            };

            dir.onClick = function () {
                scope.$apply(dir.toggleContent);
            };

            dir.toggleContent = function () {
                if (dir.isOpen) {
                    dir.isOpen = false;
                    elem.addClass('closed');
                    dir.openHeight = elem.height();
                    elem.height(dir.openHeight);
                    elem.height(dir.closedHeight);
                    dir.toggleText = 'readMore';
                }
                else {
                    dir.isOpen = true;
                    elem.height(dir.openHeight);
                    elem.removeClass('closed');
                    timeout(dir.setAutoHeight, 210);
                    dir.toggleText = 'readLess';
                }
            };

            dir.setAutoHeight = function () {
                elem.height('');
            };

            dir.getData = function () {
                return scope.$eval(attr.toggleMessageContent);
            };

            dir.hasHeight = function () {
                return elem.outerHeight() > 75;
            };

            dir.enabled = function () {
                return !dir.getData().showFullMessage && dir.hasHeight();
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpUserMessages")
        .directive('toggleMessageContent', [
            '$compile',
            'appLangTranslate',
            'timeout',
            'deviceInfoSvc',
            toggleMessageContent
        ]);
})(angular);

