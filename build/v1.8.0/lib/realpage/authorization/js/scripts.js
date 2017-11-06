//  Source: _lib\realpage\authorization\js\_bundle.inc
angular.module("rpAuthorization", []);

//  Source: _lib\realpage\authorization\js\config\auth-error-handler.js
//  Global Authorization Error Handler

(function (angular) {
    "use strict";

    function httpInterceptor($provide, $httpProvider) {
        function factory($q, $window, cookie) {
            return {
                response: function (response) {
                    return response || $q.when(response);
                },

                responseError: function (rejection) {
                    if (rejection.status === 401) {
                        cookie.erase('authorization');
                        logc("401: Access Denied!");
                        $window.location.href = '/ui/signin/#/';
                    }
                    return $q.reject(rejection);
                }
            };
        }

        $provide.factory('httpInterceptor', ['$q', '$window', 'rpCookie', factory]);

        $httpProvider.interceptors.push('httpInterceptor');
    }

    angular
        .module("rpAuthorization")
        .config(['$provide', '$httpProvider', httpInterceptor]);
})(angular);

//  Source: _lib\realpage\authorization\js\config\http.js
//  Http Headers Config

(function (angular) {
    "use strict";

    function config($http, cookie) {
        var authorization = cookie.read('authorization');

        if (authorization !== undefined) {
            authorization = 'Bearer ' + authorization;
            $http.defaults.headers.common.Authorization = authorization;
        }
    }

    angular
        .module("rpAuthorization")
        .run(['$http', 'rpCookie', config]);
})(angular);


//  Source: _lib\realpage\authorization\js\config\authorization.js
//  Authorization Check

(function (angular) {
    "use strict";

    var notAuth, url, prodName,
        checkAccess, isSigninHome;

    function authCheck() {
        if (!window.location.href.match(/\/ui\//)) {
            return;
        }

        notAuth = !RealPage.cookie.read('authorization');
        url = window.location.href.replace(/^[^\/]*\/{2}[^\/]+(\/.*)/g, '$1');
        prodName = window.location.href.replace(/.*\/ui\/([^\/]+)\/.*/g, '$1');

        isSigninHome = url == '/ui/signin/#/' || url == '/ui/signin/';

        checkAccess = prodName !== 'ui-library' && !isSigninHome;

        if (notAuth && checkAccess && !isSigninHome) {
            window.location.href = '/ui/signin/#/';
        }
    }

    authCheck();

    function run(authorization) {
        if (checkAccess) {
            authorization.check();
        }
    }

    angular
        .module("rpAuthorization")
        .run(['authorization', run]);
})(angular);

//  Source: _lib\realpage\authorization\js\services\authorization.js
//  Authorization Service

(function (angular) {
    "use strict";

    function factory($http, $window, location, eventStream, cookie) {
        var svc = {},
            authData,
            events = {},
            url = '/api/core/common/access/productarea?ProductAreaRouteURI=';

        authData = {
            accessModelList: []
        };

        events.ready = eventStream();

        svc.events = events;

        svc.isEmpty = function () {
            return authData.accessModelList.length === 0;
        };

        svc.req = function () {
            var req,
                urlParam = location.appUrl();

            req = {
                method: 'GET',

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                url: url + $window.encodeURIComponent(urlParam)
            };

            return req;
        };

        svc.success = function (response) {
            var skipBlockingUrl = false,
                valid = response &&
                response.data &&
                response.data.productAreaAccessModel &&
                response.data.productAreaAccessModel.userHasAccess !== undefined;

            skipBlockingUrl = cookie.read('skipBlockingUrl');

            if (!valid) {
                logc('Authorization: Invalid authorization response');
            }
            else if (response.data.blockingURL && !skipBlockingUrl) {
                logc('Authorization: Has blocking URL => ', response.data.blockingURL);
                // $window.location.href = response.data.blockingURL;
            }
            else if (!response.data.productAreaAccessModel.userHasAccess) {
                // svc.login();
                logc('Authorization: userHasAccess => false');
            }
            else {
                authData = response.data.productAreaAccessModel;
                events.ready.publish();
            }
        };

        svc.error = function () {
            // svc.login();
            logc('Authorization: failed!');
        };

        svc.check = function () {
            var req = svc.req();
            return $http(req).then(svc.success, svc.error);
        };

        svc.login = function () {
            $window.location.href = '/ui/signin/#/';
        };

        svc.pageInfo = function () {
            var data = false,
                url = location.fullUrl();

            authData.accessModelList.forEach(function (item) {
                if (item.url == url) {
                    data = item;
                }
            });

            return data;
        };

        svc.getActivityGUID = function (url) {
            var guid = false;

            authData.accessModelList.forEach(function (item) {
                var regex = item.url.replace(/\//g, '\\/');

                regex = new RegExp('^' + regex + item.urlPartRegEx + '$');

                if (url.match(regex)) {
                    guid = item.guid;
                }
            });

            return guid;
        };

        return svc;
    }

    angular
        .module("rpAuthorization")
        .factory('authorization', [
            '$http',
            '$window',
            'location',
            'eventStream',
            'rpCookie',
            factory
        ]);
})(angular);


//  Source: _lib\realpage\authorization\js\services\user-access.js
//  User Access Service

(function (angular) {
    "use strict";

    function factory($q, $http, $window, location, authorization, cookie) {
        var svc = {},
            deferred,
            accessModel,
            reqUrl = '/api/core/common/access/activity?ActivityGUID=';

        accessModel = {
            isFavoritable: false,
            allowedToMakeHomePage: false
        };

        svc.req = function () {
            var req, url = location.fullUrl();

            req = {
                method: 'GET',
                url: reqUrl + authorization.getActivityGUID(url)
            };

            return req;
        };

        svc.check = function () {
            if (authorization.isEmpty()) {
                deferred = $q.defer();
                authorization.events.ready.subscribe(svc.check);
                return deferred;
            }

            var req = svc.req();

            return $http(req).then(svc.success, svc.error);
        };

        svc.success = function (response) {
            // var skipBlockingUrl = cookie.read('skipBlockingUrl');

            // if (response.data && response.data.blockingUrl && !skipBlockingUrl) {
            //     $window.location.href = response.data.blockingUrl;
            //     return;
            // }

            angular.extend(accessModel, response.data.activityAccessModel || {});

            if (accessModel.userHasAccess) {
                svc.resolve();
            }
            else {
                svc.accessDenied();
            }
        };

        svc.error = function () {
            svc.resolve();
        };

        svc.accessDenied = function () {
            logc('User Access: access denied! missing data?');
            // $window.location.href = '/ui/onesite/#/messages/access-denied';
        };

        svc.resolve = function () {
            if (deferred) {
                deferred.resolve();
                deferred = undefined;
            }
        };

        svc.allowSetHome = function () {
            return accessModel.allowedToMakeHomePage;
        };

        svc.allowSetFav = function () {
            return accessModel.isFavoritable;
        };

        return svc;
    }

    angular
        .module("rpAuthorization")
        .factory('userAccess', [
            '$q',
            '$http',
            '$window',
            'location',
            'authorization',
            'rpCookie',
            factory
        ]);
})(angular);

