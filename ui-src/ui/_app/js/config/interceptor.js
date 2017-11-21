(function(app) {
    'use strict';
    angular.module('ui').factory('errorInterceptor', ['$rootScope', '$q', function($rootScope, $q) {
        return {
            request: function(config) {
                //writeit ardam kaley o

                config.headers = config.headers || {};
                if (config.url != "/api/login") {
                    config.headers['authentication-token'] = sessionStorage.getItem('sessionID');
                }
                config.headers['Content-Type'] = 'application/json';

                return config;
            },
            responseError: function(rejection) {
                $rootScope.$broadcast('notify-error', rejection);
                return $q.reject(rejection);
            },
            response: function(config) {
                var deferred = $q.defer();
                deferred.resolve(config);
                return deferred.promise;
            }
        };
    }]);
    angular.module('ui').config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('errorInterceptor');
    }]);
}());