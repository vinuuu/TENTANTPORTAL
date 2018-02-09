angular.module("rpSessionInfo", []);

//  Source: _lib\realpage\session-info\js\services\session.js
//  Session Info Service

(function (angular) {
    "use strict";

    function factory($resource) {
        return $resource('/api/core/common/shell');
    }

    angular
        .module("rpSessionInfo")
        .factory('sessionInfoSvc', ['$resource', factory]);
})(angular);

//  Source: _lib\realpage\session-info\js\models\session.js
//  Session Info Model

(function (angular) {
    "use strict";

    function factory(session, cookie, eventStream, authentication) {
        var model = {},
            ready = false;

        /**
         * Session Data
         * @type {Object}
         */
        model._data = {};

        /**
         * Events Object
         * @type {Object}
         */
        model.events = {
            update: eventStream()
        };

        /**
         * Method to determine if session is ready
         * @return {Boolean} ready state of session
         */
        model.isReady = function () {
            return ready;
        };

        /**
         * Method to determine if authorization is
         * present
         * @return {Boolean} authorization state
         */
        model.hasAuth = function () {
            return authentication.hasAuth();
        };

        /**
         * Loads session data
         * @return {promise} returns promise if authorization
         * is present
         */
        model.load = function () {
            if (model.hasAuth()) {
                ready = false;
                return session.get(model.update);
            }
        };

        /**
         * Update session data
         * @param  {object} data contains updated session data
         * @return {void}
         */
        model.update = function (data) {
            ready = true;
            model._data = data.shellInfoResult;
            model.events.update.publish(model._data);
        };

        /**
         * Get value for a given key
         * @param  {string} key key for the expected data
         * @return {void}
         */
        model.get = function (key) {
            return model.hasData(key) ? model._data.shellInfo[key] : "";
        };

        /**
         * Get all of session data
         * @return {object} session data
         */
        model.getData = function () {
            return model._data;
        };

        /**
         * Check data availability for a given key
         * @param  {string}  key data key
         * @return {Boolean}     shows if data is available
         */
        model.hasData = function (key) {
            return model._data.shellInfo && model._data.shellInfo[key];
        };

        /**
         * Determine and return proeprtyID
         * @return {number} PropertyID
         */
        model.getPropertyID = function () {
            var pmcID = model.get("pmcid"),
                siteID = model.get("siteID");

            if (siteID === "" || siteID === null || siteID === undefined || siteID === pmcID) {
                return 0;
            }
            else {
                return siteID;
            }
        };

        /**
         * Subscribe to session events
         * @param  {string}   eventName event name
         * @param  {Function} callback  callback function
         * @return {function}           returns a function that will
         * unsubscribe if the event name is valid
         */
        model.subscribe = function (eventName, callback) {
            if (model.events[eventName]) {
                return model.events[eventName].subscribe(callback);
            }
            else {
                logc("rpSessionInfo: " + eventName + " is not a valid event name");
            }
        };

        return model;
    }

    angular
        .module("rpSessionInfo")
        .factory("sessionInfo", [
            "sessionInfoSvc",
            "rpCookie",
            "eventStream",
            "authentication",
            factory
        ]);
})(angular);
