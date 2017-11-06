angular.module("rpAuthentication", []);

//  Source: _lib\realpage\authentication\js\services\authentication.js
//  Authentication Service

(function (angular) {
    "use strict";

    function Authentication($http, guid, cookie, serialize) {
        var svc = this;

        svc.headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        };

        svc.data = {
            client_id: "OS_web",
            sessionGuid: guid.getNew(),
        };

        svc.req = {
            method: "POST",
            headers: svc.headers,
            transformRequest: serialize,
            url: "/api/core/authentication/login"
        };

        svc.hasAuth = function () {
            return cookie.read("authorization") !== undefined;
        };

        svc.getExpTime = function () {
            return 1000 * parseInt(cookie.read("authExpires"));
        };

        svc.authenticate = function (user) {
            svc.req.data = angular.extend({}, svc.data, user, {
                grant_type: "password"
            });

            return $http(svc.req);
        };

        svc.storeAuth = function (resp) {
            var d = resp.data;
            cookie.create("reauth", d.refresh_token);
            cookie.create("authExpires", d.expires_in);
            cookie.create("authorization", d.access_token);
        };

        svc.reauthenticate = function () {
            svc.req.data = angular.extend({}, svc.data, {
                grant_type: "refresh_token",
                refresh_token: cookie.read("reauth")
            });

            return $http(svc.req);
        };

        svc.storeReauth = function (resp) {
            var d = resp.data;
            cookie.create("reauth", d.refresh_token);
            cookie.create("authExpires", d.expires_in);
        };

        svc.erase = function () {
            cookie.erase("reauth");
            cookie.erase("authExpires");
            cookie.erase("authorization");

            return $http({
                method: "DELETE",
                url: "/api/core/authentication/logout"
            });
        };
    }

    angular
        .module("rpAuthentication")
        .service("authentication", [
            "$http",
            "guid",
            "rpCookie",
            "serialize",
            Authentication
        ]);
})(angular);

