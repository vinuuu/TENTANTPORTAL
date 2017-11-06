//  Source: _lib\__foundation-ui-library\jquery\google-maps\js\load-google-maps.js
/*!
 * JavaScript - loadGoogleMaps( version, apiKey, language )
 *
 * - Load Google Maps API using jQuery Deferred.
 *   Useful if you want to only load the Google Maps API on-demand.
 * - Requires jQuery 1.5
 *
 * Copyright (c) 2011 Glenn Baker
 * Dual licensed under the MIT and GPL licenses.
 */
/*globals window, google, jQuery*/
var loadGoogleMaps = (function($) {

    var now = $.now(),

        promise;

    return function( version, apiKey, language ) {

        if( promise ) { return promise; }

        //Create a Deferred Object
        var	deferred = $.Deferred(),

        //Declare a resolve function, pass google.maps for the done functions
            resolve = function () {
                deferred.resolve( window.google && google.maps ? google.maps : false );
            },

        //global callback name
            callbackName = "loadGoogleMaps_" + ( now++ ),

        // Default Parameters
            params = $.extend(
                {'sensor': false}
                , apiKey ? {"key": apiKey} : {}
                , language ? {"language": language} : {}
            );

        //If google.maps exists, then Google Maps API was probably loaded with the <script> tag
        if( window.google && google.maps ) {

            resolve();

            //If the google.load method exists, lets load the Google Maps API in Async.
        } else if ( window.google && google.load ) {

            google.load("maps", version || 3, {"other_params": $.param(params) , "callback" : resolve});

            //Last, try pure jQuery Ajax technique to load the Google Maps API in Async.
        } else {

            //Ajax URL params
            params = $.extend( params, {
                'v': version || 3,
                'callback': callbackName
            });

            //Declare the global callback
            window[callbackName] = function( ) {

                resolve();

                //Delete callback
                setTimeout(function() {
                    try{
                        delete window[callbackName];
                    } catch( e ) {}
                }, 20);
            };

            //Can't use the jXHR promise because 'script' doesn't support 'callback=?'
            $.ajax({
                dataType: 'script',
                data: params,
                url: 'https://maps.google.com/maps/api/js'
            });

        }

        promise = deferred.promise();

        return promise;
    };

}(jQuery));

//  Source: _lib\__foundation-ui-library\angular\ui-map\js\ui-map.js
'use strict';
(function () {
  var app = angular.module('ui.map', ['ui.event']);
  function bindMapEvents(scope, eventsStr, googleObject, element) {
    angular.forEach(eventsStr.split(' '), function (eventName) {
      window.google.maps.event.addListener(googleObject, eventName, function (event) {
        element.triggerHandler('map-' + eventName, event);
        if (!scope.$$phase) {
          scope.$apply();
        }
      });
    });
  }
  app.value('uiMapConfig', {}).directive('uiMap', [
    'uiMapConfig',
    '$parse',
    function (uiMapConfig, $parse) {
      var mapEvents = 'bounds_changed center_changed click dblclick drag dragend ' + 'dragstart heading_changed idle maptypeid_changed mousemove mouseout ' + 'mouseover projection_changed resize rightclick tilesloaded tilt_changed ' + 'zoom_changed';
      var options = uiMapConfig || {};
      return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
          var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
          var map = new window.google.maps.Map(elm[0], opts);
          var model = $parse(attrs.uiMap);
          model.assign(scope, map);
          bindMapEvents(scope, mapEvents, map, elm);
        }
      };
    }
  ]);
  app.value('uiMapInfoWindowConfig', {}).directive('uiMapInfoWindow', [
    'uiMapInfoWindowConfig',
    '$parse',
    '$compile',
    function (uiMapInfoWindowConfig, $parse, $compile) {
      var infoWindowEvents = 'closeclick content_change domready ' + 'position_changed zindex_changed';
      var options = uiMapInfoWindowConfig || {};
      return {
        link: function (scope, elm, attrs) {
          var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
          opts.content = elm[0];
          var model = $parse(attrs.uiMapInfoWindow);
          var infoWindow = model(scope);
          if (!infoWindow) {
            infoWindow = new window.google.maps.InfoWindow(opts);
            model.assign(scope, infoWindow);
          }
          bindMapEvents(scope, infoWindowEvents, infoWindow, elm);
          elm.replaceWith('<div></div>');
          var _open = infoWindow.open;
          infoWindow.open = function open(a1, a2, a3, a4, a5, a6) {
            $compile(elm.contents())(scope);
            _open.call(infoWindow, a1, a2, a3, a4, a5, a6);
          };
        }
      };
    }
  ]);
  function mapOverlayDirective(directiveName, events) {
    app.directive(directiveName, [function () {
        return {
          restrict: 'A',
          link: function (scope, elm, attrs) {
            scope.$watch(attrs[directiveName], function (newObject) {
              if (newObject) {
                bindMapEvents(scope, events, newObject, elm);
              }
            });
          }
        };
      }]);
  }
  mapOverlayDirective('uiMapMarker', 'animation_changed click clickable_changed cursor_changed ' + 'dblclick drag dragend draggable_changed dragstart flat_changed icon_changed ' + 'mousedown mouseout mouseover mouseup position_changed rightclick ' + 'shadow_changed shape_changed title_changed visible_changed zindex_changed');
  mapOverlayDirective('uiMapPolyline', 'click dblclick mousedown mousemove mouseout mouseover mouseup rightclick');
  mapOverlayDirective('uiMapPolygon', 'click dblclick mousedown mousemove mouseout mouseover mouseup rightclick');
  mapOverlayDirective('uiMapRectangle', 'bounds_changed click dblclick mousedown mousemove mouseout mouseover ' + 'mouseup rightclick');
  mapOverlayDirective('uiMapCircle', 'center_changed click dblclick mousedown mousemove ' + 'mouseout mouseover mouseup radius_changed rightclick');
  mapOverlayDirective('uiMapGroundOverlay', 'click dblclick');
}());

