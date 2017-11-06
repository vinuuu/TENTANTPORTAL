//  Source: _lib\realpage\language\js\_bundle.inc
angular.module("rpLanguage", []);

//  Source: _lib\realpage\language\js\providers\app-lang-keys.js
//  App Language Keys Provider

(function (angular) {
    "use strict";

    function AppLangKeys() {
        var app = {},
            prov = this;

        function provide(name) {
            var model = {
                name: name
            };

            model.set = function (keys) {
                model.keys = keys;
                return model;
            };

            model.get = function () {
                return model.keys;
            };

            return model;
        }

        prov.app = function (name) {
            app[name] = app[name] || provide(name);
            return app[name];
        };

        prov.$get = function () {
            return {};
        };
    }

    angular
        .module("rpLanguage")
        .provider('appLangKeys', [AppLangKeys]);
})(angular);

//  Source: _lib\realpage\language\js\providers\app-lang-data.js
//  App Lang Data Provider

(function (angular) {
    "use strict";

    function AppLangData(appLangKeys) {
        var prov = this;

        prov.app = function (name) {
            var model = {
                appName: name,
                data: undefined
            };

            model.lang = function (name) {
                model.langName = name;
                return model;
            };

            model.set = function (data) {
                model.data = data;
            };

            model.get = function () {
                return model.data;
            };

            model.hasData = function () {
                return model.data !== undefined;
            };

            model.test = function () {
                var an = model.appName,
                    ln = model.langName,
                    keys = appLangKeys.app(model.appName).get();

                keys.forEach(function (key) {
                    var msg = '';

                    if (model.data[key] === undefined) {
                        msg += 'AppLangData: data for key ' + key;
                        msg += ' in ' + an + ' ' + ln + ' bundle was not defined!';
                        logw(msg);
                    }
                });
            };

            return model;
        };

        prov.$get = function () {
            return {};
        };
    }

    angular
        .module("rpLanguage")
        .provider('appLangData', ['appLangKeysProvider', AppLangData]);
})(angular);

//  Source: _lib\realpage\language\js\providers\app-lang-bundle.js
//  App Language Bundle Provider

(function (angular) {
    "use strict";

    function AppLangBundle(appLangData) {
        var bundle = {},
            prov = this;

        function provide (name) {
            var model = {
                data: {},
                langName: name
            };

            model.app = function (name) {
                model.data[name] = model.data[name] || appLangData.app(name).lang(model.langName);
                return model.data[name];
            };

            model.hasApp = function (name) {
                return model.data[name] !== undefined;
            };

            return model;
        }

        prov.lang = function (name) {
            bundle[name] = bundle[name] || provide(name);
            return bundle[name];
        };

        prov.$get = function () {
            return {
                lang: prov.lang
            };
        };
    }

    angular
        .module("rpLanguage")
        .provider('appLangBundle', ['appLangDataProvider', AppLangBundle]);
})(angular);


//  Source: _lib\realpage\language\js\services\translate.js
//  Translate Service

(function (angular) {
    "use strict";

    function appLangTranslate(appLangBundle, cookie) {
        var langKey = cookie.read('LANG') || 'en-us';

        return function (appName) {
            var model = {
                app: appLangBundle.lang(langKey).app(appName)
            };

            model.hasData = function () {
                return model.app.hasData();
            };

            model.getAppData = function () {
                return model.app.get();
            };

            model.translate = function (key, data) {
                if (model.hasData()) {
                    return model.getText(key, data);
                }
            };

            model.getText = function (key, data) {
                var text,
                    appData = model.getAppData();

                if (appData[key] === undefined) {
                    logc(key + ' is not a valid app lang bundle key');
                    return '[There is no data available for the key ' + key + ']';
                }

                if (typeof appData[key] === 'function') {
                    return appData[key](data);
                }

                text = appData[key];

                if (data) {
                    for (var token in data) {
                        text = text.replace('{{' + token + '}}', data[token]);
                    }
                }

                return text;
            };

            return model;
        };
    }

    angular
        .module("rpLanguage")
        .factory('appLangTranslate', [
            'appLangBundle',
            'rpCookie',
            appLangTranslate
        ]);
})(angular);

