// External Modules

//  Source: ui\lib\angular\strap\js\scripts.js
//  Source: node_modules\angular-strap\dist\angular-strap.js
/**
 * angular-strap
 * @version v2.3.12 - 2017-01-26
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
  'use strict';
  bsCompilerService.$inject = [ '$q', '$http', '$injector', '$compile', '$controller', '$templateCache' ];
  angular.module('mgcrea.ngStrap.typeahead', [ 'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions' ]).provider('$typeahead', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'typeahead',
      prefixEvent: '$typeahead',
      placement: 'bottom-left',
      templateUrl: 'typeahead/typeahead.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      minLength: 1,
      filter: 'bsAsyncFilter',
      limit: 6,
      autoSelect: false,
      comparator: '',
      trimValue: true
    };
    this.$get = [ '$window', '$rootScope', '$tooltip', '$$rAF', '$timeout', function($window, $rootScope, $tooltip, $$rAF, $timeout) {
      function TypeaheadFactory(element, controller, config) {
        var $typeahead = {};
        var options = angular.extend({}, defaults, config);
        $typeahead = $tooltip(element, options);
        var parentScope = config.scope;
        var scope = $typeahead.$scope;
        scope.$resetMatches = function() {
          scope.$matches = [];
          scope.$activeIndex = options.autoSelect ? 0 : -1;
        };
        scope.$resetMatches();
        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $typeahead.activate(index);
          });
        };
        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $typeahead.select(index);
          });
        };
        scope.$isVisible = function() {
          return $typeahead.$isVisible();
        };
        $typeahead.update = function(matches) {
          scope.$matches = matches;
          if (scope.$activeIndex >= matches.length) {
            scope.$activeIndex = options.autoSelect ? 0 : -1;
          }
          safeDigest(scope);
          $$rAF($typeahead.$applyPlacement);
        };
        $typeahead.activate = function(index) {
          scope.$activeIndex = index;
        };
        $typeahead.select = function(index) {
          if (index === -1) return;
          var value = scope.$matches[index].value;
          controller.$setViewValue(value);
          controller.$render();
          scope.$resetMatches();
          if (parentScope) parentScope.$digest();
          scope.$emit(options.prefixEvent + '.select', value, index, $typeahead);
          if (angular.isDefined(options.onSelect) && angular.isFunction(options.onSelect)) {
            options.onSelect(value, index, $typeahead);
          }
        };
        $typeahead.$isVisible = function() {
          if (!options.minLength || !controller) {
            return !!scope.$matches.length;
          }
          return scope.$matches.length && angular.isString(controller.$viewValue) && controller.$viewValue.length >= options.minLength;
        };
        $typeahead.$getIndex = function(value) {
          var index;
          for (index = scope.$matches.length; index--; ) {
            if (angular.equals(scope.$matches[index].value, value)) break;
          }
          return index;
        };
        $typeahead.$onMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
        };
        $typeahead.$$updateScrollTop = function(container, index) {
          if (index > -1 && index < container.children.length) {
            var active = container.children[index];
            var clientTop = active.offsetTop;
            var clientBottom = active.offsetTop + active.clientHeight;
            var highWatermark = container.scrollTop;
            var lowWatermark = container.scrollTop + container.clientHeight;
            if (clientBottom >= highWatermark && clientTop < highWatermark) {
              container.scrollTop = Math.max(0, container.scrollTop - container.clientHeight);
            } else if (clientBottom > lowWatermark) {
              container.scrollTop = clientTop;
            }
          }
        };
        $typeahead.$onKeyDown = function(evt) {
          if (!/(38|40|13)/.test(evt.keyCode)) return;
          if ($typeahead.$isVisible() && !(evt.keyCode === 13 && scope.$activeIndex === -1)) {
            evt.preventDefault();
            evt.stopPropagation();
          }
          if (evt.keyCode === 13 && scope.$matches.length) {
            $typeahead.select(scope.$activeIndex);
          } else if (evt.keyCode === 38 && scope.$activeIndex > 0) {
            scope.$activeIndex--;
          } else if (evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) {
            scope.$activeIndex++;
          } else if (angular.isUndefined(scope.$activeIndex)) {
            scope.$activeIndex = 0;
          }
          $typeahead.$$updateScrollTop($typeahead.$element[0], scope.$activeIndex);
          scope.$digest();
        };
        var show = $typeahead.show;
        $typeahead.show = function() {
          show();
          $timeout(function() {
            if ($typeahead.$element) {
              $typeahead.$element.on('mousedown', $typeahead.$onMouseDown);
              if (options.keyboard) {
                if (element) element.on('keydown', $typeahead.$onKeyDown);
              }
            }
          }, 0, false);
        };
        var hide = $typeahead.hide;
        $typeahead.hide = function() {
          if ($typeahead.$element) $typeahead.$element.off('mousedown', $typeahead.$onMouseDown);
          if (options.keyboard) {
            if (element) element.off('keydown', $typeahead.$onKeyDown);
          }
          if (!options.autoSelect) {
            $typeahead.activate(-1);
          }
          hide();
        };
        return $typeahead;
      }
      function safeDigest(scope) {
        scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
      }
      TypeaheadFactory.defaults = defaults;
      return TypeaheadFactory;
    } ];
  }).filter('bsAsyncFilter', [ '$filter', function($filter) {
    return function(array, expression, comparator) {
      if (array && angular.isFunction(array.then)) {
        return array.then(function(results) {
          return $filter('filter')(results, expression, comparator);
        });
      }
      return $filter('filter')(array, expression, comparator);
    };
  } ]).directive('bsTypeahead', [ '$window', '$parse', '$q', '$typeahead', '$parseOptions', function($window, $parse, $q, $typeahead, $parseOptions) {
    var defaults = $typeahead.defaults;
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        element.off('change');
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'filter', 'limit', 'minLength', 'watchOptions', 'selectMode', 'autoSelect', 'comparator', 'id', 'prefixEvent', 'prefixClass' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'trimValue', 'filter' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide', 'onSelect' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        if (!element.attr('autocomplete')) element.attr('autocomplete', 'off');
        var filter = angular.isDefined(options.filter) ? options.filter : defaults.filter;
        var limit = options.limit || defaults.limit;
        var comparator = options.comparator || defaults.comparator;
        var bsOptions = attr.bsOptions;
        if (filter) {
          bsOptions += ' | ' + filter + ':$viewValue';
          if (comparator) bsOptions += ':' + comparator;
        }
        if (limit) bsOptions += ' | limitTo:' + limit;
        var parsedOptions = $parseOptions(bsOptions);
        var typeahead = $typeahead(element, controller, options);
        if (options.watchOptions) {
          var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
          scope.$watchCollection(watchedOptions, function(newValue, oldValue) {
            parsedOptions.valuesFn(scope, controller).then(function(values) {
              typeahead.update(values);
              controller.$render();
            });
          });
        }
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          scope.$modelValue = newValue;
          parsedOptions.valuesFn(scope, controller).then(function(values) {
            if (options.selectMode && !values.length && newValue.length > 0) {
              controller.$setViewValue(controller.$viewValue.substring(0, controller.$viewValue.length - 1));
              return;
            }
            if (values.length > limit) values = values.slice(0, limit);
            typeahead.update(values);
            controller.$render();
          });
        });
        controller.$formatters.push(function(modelValue) {
          var displayValue = parsedOptions.displayValue(modelValue);
          if (displayValue) {
            return displayValue;
          }
          if (angular.isDefined(modelValue) && typeof modelValue !== 'object') {
            return modelValue;
          }
          return '';
        });
        controller.$render = function() {
          if (controller.$isEmpty(controller.$viewValue)) {
            return element.val('');
          }
          var index = typeahead.$getIndex(controller.$modelValue);
          var selected = index !== -1 ? typeahead.$scope.$matches[index].label : controller.$viewValue;
          selected = angular.isObject(selected) ? parsedOptions.displayValue(selected) : selected;
          var value = selected ? selected.toString().replace(/<(?:.|\n)*?>/gm, '') : '';
          var ss = element[0].selectionStart;
          var sd = element[0].selectionEnd;
          element.val(options.trimValue === false ? value : value.trim());
          element[0].setSelectionRange(ss, sd);
        };
        scope.$on('$destroy', function() {
          if (typeahead) typeahead.destroy();
          options = null;
          typeahead = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.tooltip', [ 'mgcrea.ngStrap.core', 'mgcrea.ngStrap.helpers.dimensions' ]).provider('$tooltip', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      customClass: '',
      prefixClass: 'tooltip',
      prefixEvent: 'tooltip',
      container: false,
      target: false,
      placement: 'top',
      templateUrl: 'tooltip/tooltip.tpl.html',
      template: '',
      titleTemplate: false,
      trigger: 'hover focus',
      keyboard: false,
      html: false,
      show: false,
      title: '',
      type: '',
      delay: 0,
      autoClose: false,
      bsEnabled: true,
      mouseDownPreventDefault: true,
      mouseDownStopPropagation: true,
      viewport: {
        selector: 'body',
        padding: 0
      }
    };
    this.$get = [ '$window', '$rootScope', '$bsCompiler', '$q', '$templateCache', '$http', '$animate', '$sce', 'dimensions', '$$rAF', '$timeout', function($window, $rootScope, $bsCompiler, $q, $templateCache, $http, $animate, $sce, dimensions, $$rAF, $timeout) {
      var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
      var isTouch = 'createTouch' in $window.document && isNative;
      var $body = angular.element($window.document);
      function TooltipFactory(element, config) {
        var $tooltip = {};
        var options = $tooltip.$options = angular.extend({}, defaults, config);
        var promise = $tooltip.$promise = $bsCompiler.compile(options);
        var scope = $tooltip.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        var nodeName = element[0].nodeName.toLowerCase();
        if (options.delay && angular.isString(options.delay)) {
          var split = options.delay.split(',').map(parseFloat);
          options.delay = split.length > 1 ? {
            show: split[0],
            hide: split[1]
          } : split[0];
        }
        $tooltip.$id = options.id || element.attr('id') || '';
        if (options.title) {
          scope.title = $sce.trustAsHtml(options.title);
        }
        scope.$setEnabled = function(isEnabled) {
          scope.$$postDigest(function() {
            $tooltip.setEnabled(isEnabled);
          });
        };
        scope.$hide = function() {
          scope.$$postDigest(function() {
            $tooltip.hide();
          });
        };
        scope.$show = function() {
          scope.$$postDigest(function() {
            $tooltip.show();
          });
        };
        scope.$toggle = function() {
          scope.$$postDigest(function() {
            $tooltip.toggle();
          });
        };
        $tooltip.$isShown = scope.$isShown = false;
        var timeout;
        var hoverState;
        var compileData;
        var tipElement;
        var tipContainer;
        var tipScope;
        promise.then(function(data) {
          compileData = data;
          $tooltip.init();
        });
        $tooltip.init = function() {
          if (options.delay && angular.isNumber(options.delay)) {
            options.delay = {
              show: options.delay,
              hide: options.delay
            };
          }
          if (options.container === 'self') {
            tipContainer = element;
          } else if (angular.isElement(options.container)) {
            tipContainer = options.container;
          } else if (options.container) {
            tipContainer = findElement(options.container);
          }
          bindTriggerEvents();
          if (options.target) {
            options.target = angular.isElement(options.target) ? options.target : findElement(options.target);
          }
          if (options.show) {
            scope.$$postDigest(function() {
              if (options.trigger === 'focus') {
                element[0].focus();
              } else {
                $tooltip.show();
              }
            });
          }
        };
        $tooltip.destroy = function() {
          unbindTriggerEvents();
          destroyTipElement();
          scope.$destroy();
        };
        $tooltip.enter = function() {
          clearTimeout(timeout);
          hoverState = 'in';
          if (!options.delay || !options.delay.show) {
            return $tooltip.show();
          }
          timeout = setTimeout(function() {
            if (hoverState === 'in') $tooltip.show();
          }, options.delay.show);
        };
        $tooltip.show = function() {
          if (!options.bsEnabled || $tooltip.$isShown) return;
          scope.$emit(options.prefixEvent + '.show.before', $tooltip);
          if (angular.isDefined(options.onBeforeShow) && angular.isFunction(options.onBeforeShow)) {
            options.onBeforeShow($tooltip);
          }
          var parent;
          var after;
          if (options.container) {
            parent = tipContainer;
            if (tipContainer[0].lastChild) {
              after = angular.element(tipContainer[0].lastChild);
            } else {
              after = null;
            }
          } else {
            parent = null;
            after = element;
          }
          if (tipElement) destroyTipElement();
          tipScope = $tooltip.$scope.$new();
          tipElement = $tooltip.$element = compileData.link(tipScope, function(clonedElement, scope) {});
          tipElement.css({
            top: '-9999px',
            left: '-9999px',
            right: 'auto',
            display: 'block',
            visibility: 'hidden'
          });
          if (options.animation) tipElement.addClass(options.animation);
          if (options.type) tipElement.addClass(options.prefixClass + '-' + options.type);
          if (options.customClass) tipElement.addClass(options.customClass);
          if (after) {
            after.after(tipElement);
          } else {
            parent.prepend(tipElement);
          }
          $tooltip.$isShown = scope.$isShown = true;
          safeDigest(scope);
          $tooltip.$applyPlacement();
          if (angular.version.minor <= 2) {
            $animate.enter(tipElement, parent, after, enterAnimateCallback);
          } else {
            $animate.enter(tipElement, parent, after).then(enterAnimateCallback);
          }
          safeDigest(scope);
          $$rAF(function() {
            if (tipElement) tipElement.css({
              visibility: 'visible'
            });
            if (options.keyboard) {
              if (options.trigger !== 'focus') {
                $tooltip.focus();
              }
              bindKeyboardEvents();
            }
          });
          if (options.autoClose) {
            bindAutoCloseEvents();
          }
        };
        function enterAnimateCallback() {
          scope.$emit(options.prefixEvent + '.show', $tooltip);
          if (angular.isDefined(options.onShow) && angular.isFunction(options.onShow)) {
            options.onShow($tooltip);
          }
        }
        $tooltip.leave = function() {
          clearTimeout(timeout);
          hoverState = 'out';
          if (!options.delay || !options.delay.hide) {
            return $tooltip.hide();
          }
          timeout = setTimeout(function() {
            if (hoverState === 'out') {
              $tooltip.hide();
            }
          }, options.delay.hide);
        };
        var _blur;
        var _tipToHide;
        $tooltip.hide = function(blur) {
          if (!$tooltip.$isShown) return;
          scope.$emit(options.prefixEvent + '.hide.before', $tooltip);
          if (angular.isDefined(options.onBeforeHide) && angular.isFunction(options.onBeforeHide)) {
            options.onBeforeHide($tooltip);
          }
          _blur = blur;
          _tipToHide = tipElement;
          if (tipElement !== null) {
            if (angular.version.minor <= 2) {
              $animate.leave(tipElement, leaveAnimateCallback);
            } else {
              $animate.leave(tipElement).then(leaveAnimateCallback);
            }
          }
          $tooltip.$isShown = scope.$isShown = false;
          safeDigest(scope);
          if (options.keyboard && tipElement !== null) {
            unbindKeyboardEvents();
          }
          if (options.autoClose && tipElement !== null) {
            unbindAutoCloseEvents();
          }
        };
        function leaveAnimateCallback() {
          scope.$emit(options.prefixEvent + '.hide', $tooltip);
          if (angular.isDefined(options.onHide) && angular.isFunction(options.onHide)) {
            options.onHide($tooltip);
          }
          if (tipElement === _tipToHide) {
            if (_blur && options.trigger === 'focus') {
              return element[0].blur();
            }
            destroyTipElement();
          }
        }
        $tooltip.toggle = function(evt) {
          if (evt) {
            evt.preventDefault();
          }
          if ($tooltip.$isShown) {
            $tooltip.leave();
          } else {
            $tooltip.enter();
          }
        };
        $tooltip.focus = function() {
          tipElement[0].focus();
        };
        $tooltip.setEnabled = function(isEnabled) {
          options.bsEnabled = isEnabled;
        };
        $tooltip.setViewport = function(viewport) {
          options.viewport = viewport;
        };
        $tooltip.$applyPlacement = function() {
          if (!tipElement) return;
          var placement = options.placement;
          var autoToken = /\s?auto?\s?/i;
          var autoPlace = autoToken.test(placement);
          if (autoPlace) {
            placement = placement.replace(autoToken, '') || defaults.placement;
          }
          tipElement.addClass(options.placement);
          var elementPosition = getPosition();
          var tipWidth = tipElement.prop('offsetWidth');
          var tipHeight = tipElement.prop('offsetHeight');
          $tooltip.$viewport = options.viewport && findElement(options.viewport.selector || options.viewport);
          if (autoPlace) {
            var originalPlacement = placement;
            var viewportPosition = getPosition($tooltip.$viewport);
            if (/bottom/.test(originalPlacement) && elementPosition.bottom + tipHeight > viewportPosition.bottom) {
              placement = originalPlacement.replace('bottom', 'top');
            } else if (/top/.test(originalPlacement) && elementPosition.top - tipHeight < viewportPosition.top) {
              placement = originalPlacement.replace('top', 'bottom');
            }
            if (/left/.test(originalPlacement) && elementPosition.left - tipWidth < viewportPosition.left) {
              placement = placement.replace('left', 'right');
            } else if (/right/.test(originalPlacement) && elementPosition.right + tipWidth > viewportPosition.width) {
              placement = placement.replace('right', 'left');
            }
            tipElement.removeClass(originalPlacement).addClass(placement);
          }
          var tipPosition = getCalculatedOffset(placement, elementPosition, tipWidth, tipHeight);
          applyPlacement(tipPosition, placement);
        };
        $tooltip.$onKeyUp = function(evt) {
          if (evt.which === 27 && $tooltip.$isShown) {
            $tooltip.hide();
            evt.stopPropagation();
          }
        };
        $tooltip.$onFocusKeyUp = function(evt) {
          if (evt.which === 27) {
            element[0].blur();
            evt.stopPropagation();
          }
        };
        $tooltip.$onFocusElementMouseDown = function(evt) {
          if (options.mouseDownPreventDefault) {
            evt.preventDefault();
          }
          if (options.mouseDownStopPropagation) {
            evt.stopPropagation();
          }
          if ($tooltip.$isShown) {
            element[0].blur();
          } else {
            element[0].focus();
          }
        };
        function bindTriggerEvents() {
          var triggers = options.trigger.split(' ');
          angular.forEach(triggers, function(trigger) {
            if (trigger === 'click' || trigger === 'contextmenu') {
              element.on(trigger, $tooltip.toggle);
            } else if (trigger !== 'manual') {
              element.on(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
              element.on(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
              if (nodeName === 'button' && trigger !== 'hover') {
                element.on(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
              }
            }
          });
        }
        function unbindTriggerEvents() {
          var triggers = options.trigger.split(' ');
          for (var i = triggers.length; i--; ) {
            var trigger = triggers[i];
            if (trigger === 'click' || trigger === 'contextmenu') {
              element.off(trigger, $tooltip.toggle);
            } else if (trigger !== 'manual') {
              element.off(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
              element.off(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
              if (nodeName === 'button' && trigger !== 'hover') {
                element.off(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
              }
            }
          }
        }
        function bindKeyboardEvents() {
          if (options.trigger !== 'focus') {
            tipElement.on('keyup', $tooltip.$onKeyUp);
          } else {
            element.on('keyup', $tooltip.$onFocusKeyUp);
          }
        }
        function unbindKeyboardEvents() {
          if (options.trigger !== 'focus') {
            tipElement.off('keyup', $tooltip.$onKeyUp);
          } else {
            element.off('keyup', $tooltip.$onFocusKeyUp);
          }
        }
        var _autoCloseEventsBinded = false;
        function bindAutoCloseEvents() {
          $timeout(function() {
            tipElement.on('click', stopEventPropagation);
            $body.on('click', $tooltip.hide);
            _autoCloseEventsBinded = true;
          }, 0, false);
        }
        function unbindAutoCloseEvents() {
          if (_autoCloseEventsBinded) {
            tipElement.off('click', stopEventPropagation);
            $body.off('click', $tooltip.hide);
            _autoCloseEventsBinded = false;
          }
        }
        function stopEventPropagation(event) {
          event.stopPropagation();
        }
        function getPosition($element) {
          $element = $element || (options.target || element);
          var el = $element[0];
          var isBody = el.tagName === 'BODY';
          var elRect = el.getBoundingClientRect();
          var rect = {};
          for (var p in elRect) {
            rect[p] = elRect[p];
          }
          if (rect.width === null) {
            rect = angular.extend({}, rect, {
              width: elRect.right - elRect.left,
              height: elRect.bottom - elRect.top
            });
          }
          var elOffset = isBody ? {
            top: 0,
            left: 0
          } : dimensions.offset(el);
          var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.prop('scrollTop') || 0
          };
          var outerDims = isBody ? {
            width: document.documentElement.clientWidth,
            height: $window.innerHeight
          } : null;
          return angular.extend({}, rect, scroll, outerDims, elOffset);
        }
        function getCalculatedOffset(placement, position, actualWidth, actualHeight) {
          var offset;
          var split = placement.split('-');
          switch (split[0]) {
           case 'right':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left + position.width
            };
            break;

           case 'bottom':
            offset = {
              top: position.top + position.height,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;

           case 'left':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left - actualWidth
            };
            break;

           default:
            offset = {
              top: position.top - actualHeight,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;
          }
          if (!split[1]) {
            return offset;
          }
          if (split[0] === 'top' || split[0] === 'bottom') {
            switch (split[1]) {
             case 'left':
              offset.left = position.left;
              break;

             case 'right':
              offset.left = position.left + position.width - actualWidth;
              break;

             default:
              break;
            }
          } else if (split[0] === 'left' || split[0] === 'right') {
            switch (split[1]) {
             case 'top':
              offset.top = position.top - actualHeight + position.height;
              break;

             case 'bottom':
              offset.top = position.top;
              break;

             default:
              break;
            }
          }
          return offset;
        }
        function applyPlacement(offset, placement) {
          var tip = tipElement[0];
          var width = tip.offsetWidth;
          var height = tip.offsetHeight;
          var marginTop = parseInt(dimensions.css(tip, 'margin-top'), 10);
          var marginLeft = parseInt(dimensions.css(tip, 'margin-left'), 10);
          if (isNaN(marginTop)) marginTop = 0;
          if (isNaN(marginLeft)) marginLeft = 0;
          offset.top = offset.top + marginTop;
          offset.left = offset.left + marginLeft;
          dimensions.setOffset(tip, angular.extend({
            using: function(props) {
              tipElement.css({
                top: Math.round(props.top) + 'px',
                left: Math.round(props.left) + 'px',
                right: ''
              });
            }
          }, offset), 0);
          var actualWidth = tip.offsetWidth;
          var actualHeight = tip.offsetHeight;
          if (placement === 'top' && actualHeight !== height) {
            offset.top = offset.top + height - actualHeight;
          }
          if (/top-left|top-right|bottom-left|bottom-right/.test(placement)) return;
          var delta = getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
          if (delta.left) {
            offset.left += delta.left;
          } else {
            offset.top += delta.top;
          }
          dimensions.setOffset(tip, offset);
          if (/top|right|bottom|left/.test(placement)) {
            var isVertical = /top|bottom/.test(placement);
            var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
            var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';
            replaceArrow(arrowDelta, tip[arrowOffsetPosition], isVertical);
          }
        }
        function getViewportAdjustedDelta(placement, position, actualWidth, actualHeight) {
          var delta = {
            top: 0,
            left: 0
          };
          if (!$tooltip.$viewport) return delta;
          var viewportPadding = options.viewport && options.viewport.padding || 0;
          var viewportDimensions = getPosition($tooltip.$viewport);
          if (/right|left/.test(placement)) {
            var topEdgeOffset = position.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = position.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) {
              delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
              delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
          } else {
            var leftEdgeOffset = position.left - viewportPadding;
            var rightEdgeOffset = position.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) {
              delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.right) {
              delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
          }
          return delta;
        }
        function replaceArrow(delta, dimension, isHorizontal) {
          var $arrow = findElement('.tooltip-arrow, .arrow', tipElement[0]);
          $arrow.css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isHorizontal ? 'top' : 'left', '');
        }
        function destroyTipElement() {
          clearTimeout(timeout);
          if ($tooltip.$isShown && tipElement !== null) {
            if (options.autoClose) {
              unbindAutoCloseEvents();
            }
            if (options.keyboard) {
              unbindKeyboardEvents();
            }
          }
          if (tipScope) {
            tipScope.$destroy();
            tipScope = null;
          }
          if (tipElement) {
            tipElement.remove();
            tipElement = $tooltip.$element = null;
          }
        }
        return $tooltip;
      }
      function safeDigest(scope) {
        scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
      }
      function findElement(query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }
      return TooltipFactory;
    } ];
  }).directive('bsTooltip', [ '$window', '$location', '$sce', '$parse', '$tooltip', '$$rAF', function($window, $location, $sce, $parse, $tooltip, $$rAF) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        var tooltip;
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'titleTemplate', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'backdropAnimation', 'type', 'customClass', 'id' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        var dataTarget = element.attr('data-target');
        if (angular.isDefined(dataTarget)) {
          if (falseValueRegExp.test(dataTarget)) {
            options.target = false;
          } else {
            options.target = dataTarget;
          }
        }
        if (!scope.hasOwnProperty('title')) {
          scope.title = '';
        }
        attr.$observe('title', function(newValue) {
          if (angular.isDefined(newValue) || !scope.hasOwnProperty('title')) {
            var oldValue = scope.title;
            scope.title = $sce.trustAsHtml(newValue);
            if (angular.isDefined(oldValue)) {
              $$rAF(function() {
                if (tooltip) tooltip.$applyPlacement();
              });
            }
          }
        });
        attr.$observe('disabled', function(newValue) {
          if (newValue && tooltip.$isShown) {
            tooltip.hide();
          }
        });
        if (attr.bsTooltip) {
          scope.$watch(attr.bsTooltip, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.title = newValue;
            }
            if (angular.isDefined(oldValue)) {
              $$rAF(function() {
                if (tooltip) tooltip.$applyPlacement();
              });
            }
          }, true);
        }
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!tooltip || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(tooltip),?/i);
            if (newValue === true) {
              tooltip.show();
            } else {
              tooltip.hide();
            }
          });
        }
        if (attr.bsEnabled) {
          scope.$watch(attr.bsEnabled, function(newValue, oldValue) {
            if (!tooltip || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|1|,?(tooltip),?/i);
            if (newValue === false) {
              tooltip.setEnabled(false);
            } else {
              tooltip.setEnabled(true);
            }
          });
        }
        if (attr.viewport) {
          scope.$watch(attr.viewport, function(newValue) {
            if (!tooltip || !angular.isDefined(newValue)) return;
            tooltip.setViewport(newValue);
          });
        }
        tooltip = $tooltip(element, options);
        scope.$on('$destroy', function() {
          if (tooltip) tooltip.destroy();
          options = null;
          tooltip = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.timepicker', [ 'mgcrea.ngStrap.helpers.dateParser', 'mgcrea.ngStrap.helpers.dateFormatter', 'mgcrea.ngStrap.tooltip' ]).provider('$timepicker', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      defaultDate: 'auto',
      prefixClass: 'timepicker',
      placement: 'bottom-left',
      templateUrl: 'timepicker/timepicker.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      useNative: true,
      timeType: 'date',
      timeFormat: 'shortTime',
      timezone: null,
      modelTimeFormat: null,
      autoclose: false,
      minTime: -Infinity,
      maxTime: +Infinity,
      length: 5,
      hourStep: 1,
      minuteStep: 5,
      secondStep: 5,
      roundDisplay: false,
      iconUp: 'glyphicon glyphicon-chevron-up',
      iconDown: 'glyphicon glyphicon-chevron-down',
      arrowBehavior: 'pager'
    };
    this.$get = [ '$window', '$document', '$rootScope', '$sce', '$dateFormatter', '$tooltip', '$timeout', function($window, $document, $rootScope, $sce, $dateFormatter, $tooltip, $timeout) {
      var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
      var isTouch = 'createTouch' in $window.document && isNative;
      if (!defaults.lang) {
        defaults.lang = $dateFormatter.getDefaultLocale();
      }
      function timepickerFactory(element, controller, config) {
        var $timepicker = $tooltip(element, angular.extend({}, defaults, config));
        var parentScope = config.scope;
        var options = $timepicker.$options;
        var scope = $timepicker.$scope;
        var lang = options.lang;
        var formatDate = function(date, format, timezone) {
          return $dateFormatter.formatDate(date, format, lang, timezone);
        };
        function floorMinutes(time) {
          var coeff = 1e3 * 60 * options.minuteStep;
          return new Date(Math.floor(time.getTime() / coeff) * coeff);
        }
        var selectedIndex = 0;
        var defaultDate = options.roundDisplay ? floorMinutes(new Date()) : new Date();
        var startDate = controller.$dateValue || defaultDate;
        var viewDate = {
          hour: startDate.getHours(),
          meridian: startDate.getHours() < 12,
          minute: startDate.getMinutes(),
          second: startDate.getSeconds(),
          millisecond: startDate.getMilliseconds()
        };
        var format = $dateFormatter.getDatetimeFormat(options.timeFormat, lang);
        var hoursFormat = $dateFormatter.hoursFormat(format);
        var timeSeparator = $dateFormatter.timeSeparator(format);
        var minutesFormat = $dateFormatter.minutesFormat(format);
        var secondsFormat = $dateFormatter.secondsFormat(format);
        var showSeconds = $dateFormatter.showSeconds(format);
        var showAM = $dateFormatter.showAM(format);
        scope.$iconUp = options.iconUp;
        scope.$iconDown = options.iconDown;
        scope.$select = function(date, index) {
          $timepicker.select(date, index);
        };
        scope.$moveIndex = function(value, index) {
          $timepicker.$moveIndex(value, index);
        };
        scope.$switchMeridian = function(date) {
          $timepicker.switchMeridian(date);
        };
        $timepicker.update = function(date) {
          if (angular.isDate(date) && !isNaN(date.getTime())) {
            $timepicker.$date = date;
            angular.extend(viewDate, {
              hour: date.getHours(),
              minute: date.getMinutes(),
              second: date.getSeconds(),
              millisecond: date.getMilliseconds()
            });
            $timepicker.$build();
          } else if (!$timepicker.$isBuilt) {
            $timepicker.$build();
          }
        };
        $timepicker.select = function(date, index, keep) {
          if (!controller.$dateValue || isNaN(controller.$dateValue.getTime())) {
            controller.$dateValue = options.defaultDate === 'today' ? new Date() : new Date(1970, 0, 1);
          }
          if (!angular.isDate(date)) date = new Date(date);
          if (index === 0) controller.$dateValue.setHours(date.getHours()); else if (index === 1) controller.$dateValue.setMinutes(date.getMinutes()); else if (index === 2) controller.$dateValue.setSeconds(date.getSeconds());
          controller.$setViewValue(angular.copy(controller.$dateValue));
          controller.$render();
          if (options.autoclose && !keep) {
            $timeout(function() {
              $timepicker.hide(true);
            });
          }
        };
        $timepicker.switchMeridian = function(date) {
          if (!controller.$dateValue || isNaN(controller.$dateValue.getTime())) {
            return;
          }
          var hours = (date || controller.$dateValue).getHours();
          controller.$dateValue.setHours(hours < 12 ? hours + 12 : hours - 12);
          controller.$setViewValue(angular.copy(controller.$dateValue));
          controller.$render();
        };
        $timepicker.$build = function() {
          var i;
          var midIndex = scope.midIndex = parseInt(options.length / 2, 10);
          var hours = [];
          var hour;
          for (i = 0; i < options.length; i++) {
            hour = new Date(1970, 0, 1, viewDate.hour - (midIndex - i) * options.hourStep);
            hours.push({
              date: hour,
              label: formatDate(hour, hoursFormat),
              selected: $timepicker.$date && $timepicker.$isSelected(hour, 0),
              disabled: $timepicker.$isDisabled(hour, 0)
            });
          }
          var minutes = [];
          var minute;
          for (i = 0; i < options.length; i++) {
            minute = new Date(1970, 0, 1, 0, viewDate.minute - (midIndex - i) * options.minuteStep);
            minutes.push({
              date: minute,
              label: formatDate(minute, minutesFormat),
              selected: $timepicker.$date && $timepicker.$isSelected(minute, 1),
              disabled: $timepicker.$isDisabled(minute, 1)
            });
          }
          var seconds = [];
          var second;
          for (i = 0; i < options.length; i++) {
            second = new Date(1970, 0, 1, 0, 0, viewDate.second - (midIndex - i) * options.secondStep);
            seconds.push({
              date: second,
              label: formatDate(second, secondsFormat),
              selected: $timepicker.$date && $timepicker.$isSelected(second, 2),
              disabled: $timepicker.$isDisabled(second, 2)
            });
          }
          var rows = [];
          for (i = 0; i < options.length; i++) {
            if (showSeconds) {
              rows.push([ hours[i], minutes[i], seconds[i] ]);
            } else {
              rows.push([ hours[i], minutes[i] ]);
            }
          }
          scope.rows = rows;
          scope.showSeconds = showSeconds;
          scope.showAM = showAM;
          scope.isAM = ($timepicker.$date || hours[midIndex].date).getHours() < 12;
          scope.timeSeparator = timeSeparator;
          $timepicker.$isBuilt = true;
        };
        $timepicker.$isSelected = function(date, index) {
          if (!$timepicker.$date) return false; else if (index === 0) {
            return date.getHours() === $timepicker.$date.getHours();
          } else if (index === 1) {
            return date.getMinutes() === $timepicker.$date.getMinutes();
          } else if (index === 2) {
            return date.getSeconds() === $timepicker.$date.getSeconds();
          }
        };
        $timepicker.$isDisabled = function(date, index) {
          var selectedTime;
          if (index === 0) {
            selectedTime = date.getTime() + viewDate.minute * 6e4 + viewDate.second * 1e3;
          } else if (index === 1) {
            selectedTime = date.getTime() + viewDate.hour * 36e5 + viewDate.second * 1e3;
          } else if (index === 2) {
            selectedTime = date.getTime() + viewDate.hour * 36e5 + viewDate.minute * 6e4;
          }
          return selectedTime < options.minTime * 1 || selectedTime > options.maxTime * 1;
        };
        scope.$arrowAction = function(value, index) {
          if (options.arrowBehavior === 'picker') {
            $timepicker.$setTimeByStep(value, index);
          } else {
            $timepicker.$moveIndex(value, index);
          }
        };
        $timepicker.$setTimeByStep = function(value, index) {
          var newDate = new Date($timepicker.$date || startDate);
          var hours = newDate.getHours();
          var minutes = newDate.getMinutes();
          var seconds = newDate.getSeconds();
          if (index === 0) {
            newDate.setHours(hours - parseInt(options.hourStep, 10) * value);
          } else if (index === 1) {
            newDate.setMinutes(minutes - parseInt(options.minuteStep, 10) * value);
          } else if (index === 2) {
            newDate.setSeconds(seconds - parseInt(options.secondStep, 10) * value);
          }
          $timepicker.select(newDate, index, true);
        };
        $timepicker.$moveIndex = function(value, index) {
          var targetDate;
          if (index === 0) {
            targetDate = new Date(1970, 0, 1, viewDate.hour + value * options.length, viewDate.minute, viewDate.second);
            angular.extend(viewDate, {
              hour: targetDate.getHours()
            });
          } else if (index === 1) {
            targetDate = new Date(1970, 0, 1, viewDate.hour, viewDate.minute + value * options.length * options.minuteStep, viewDate.second);
            angular.extend(viewDate, {
              minute: targetDate.getMinutes()
            });
          } else if (index === 2) {
            targetDate = new Date(1970, 0, 1, viewDate.hour, viewDate.minute, viewDate.second + value * options.length * options.secondStep);
            angular.extend(viewDate, {
              second: targetDate.getSeconds()
            });
          }
          $timepicker.$build();
        };
        $timepicker.$onMouseDown = function(evt) {
          if (evt.target.nodeName.toLowerCase() !== 'input') evt.preventDefault();
          evt.stopPropagation();
          if (isTouch) {
            var targetEl = angular.element(evt.target);
            if (targetEl[0].nodeName.toLowerCase() !== 'button') {
              targetEl = targetEl.parent();
            }
            targetEl.triggerHandler('click');
          }
        };
        $timepicker.$onKeyDown = function(evt) {
          if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
          evt.preventDefault();
          evt.stopPropagation();
          if (evt.keyCode === 13) {
            $timepicker.hide(true);
            return;
          }
          var newDate = new Date($timepicker.$date);
          var hours = newDate.getHours();
          var hoursLength = formatDate(newDate, hoursFormat).length;
          var minutes = newDate.getMinutes();
          var minutesLength = formatDate(newDate, minutesFormat).length;
          var seconds = newDate.getSeconds();
          var secondsLength = formatDate(newDate, secondsFormat).length;
          var sepLength = 1;
          var lateralMove = /(37|39)/.test(evt.keyCode);
          var count = 2 + showSeconds * 1 + showAM * 1;
          if (lateralMove) {
            if (evt.keyCode === 37) selectedIndex = selectedIndex < 1 ? count - 1 : selectedIndex - 1; else if (evt.keyCode === 39) selectedIndex = selectedIndex < count - 1 ? selectedIndex + 1 : 0;
          }
          var selectRange = [ 0, hoursLength ];
          var incr = 0;
          if (evt.keyCode === 38) incr = -1;
          if (evt.keyCode === 40) incr = +1;
          var isSeconds = selectedIndex === 2 && showSeconds;
          var isMeridian = selectedIndex === 2 && !showSeconds || selectedIndex === 3 && showSeconds;
          if (selectedIndex === 0) {
            newDate.setHours(hours + incr * parseInt(options.hourStep, 10));
            hoursLength = formatDate(newDate, hoursFormat).length;
            selectRange = [ 0, hoursLength ];
          } else if (selectedIndex === 1) {
            newDate.setMinutes(minutes + incr * parseInt(options.minuteStep, 10));
            minutesLength = formatDate(newDate, minutesFormat).length;
            selectRange = [ hoursLength + sepLength, minutesLength ];
          } else if (isSeconds) {
            newDate.setSeconds(seconds + incr * parseInt(options.secondStep, 10));
            secondsLength = formatDate(newDate, secondsFormat).length;
            selectRange = [ hoursLength + sepLength + minutesLength + sepLength, secondsLength ];
          } else if (isMeridian) {
            if (!lateralMove) $timepicker.switchMeridian();
            selectRange = [ hoursLength + sepLength + minutesLength + sepLength + (secondsLength + sepLength) * showSeconds, 2 ];
          }
          $timepicker.select(newDate, selectedIndex, true);
          createSelection(selectRange[0], selectRange[1]);
          parentScope.$digest();
        };
        function createSelection(start, length) {
          var end = start + length;
          if (element[0].createTextRange) {
            var selRange = element[0].createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end);
            selRange.select();
          } else if (element[0].setSelectionRange) {
            element[0].setSelectionRange(start, end);
          } else if (angular.isUndefined(element[0].selectionStart)) {
            element[0].selectionStart = start;
            element[0].selectionEnd = end;
          }
        }
        function focusElement() {
          element[0].focus();
        }
        var _init = $timepicker.init;
        $timepicker.init = function() {
          if (isNative && options.useNative) {
            element.prop('type', 'time');
            element.css('-webkit-appearance', 'textfield');
            return;
          } else if (isTouch) {
            element.prop('type', 'text');
            element.attr('readonly', 'true');
            element.on('click', focusElement);
          }
          _init();
        };
        var _destroy = $timepicker.destroy;
        $timepicker.destroy = function() {
          if (isNative && options.useNative) {
            element.off('click', focusElement);
          }
          _destroy();
        };
        var _show = $timepicker.show;
        $timepicker.show = function() {
          if (!isTouch && element.attr('readonly') || element.attr('disabled')) return;
          _show();
          $timeout(function() {
            if ($timepicker.$element) $timepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $timepicker.$onMouseDown);
            if (options.keyboard) {
              if (element) element.on('keydown', $timepicker.$onKeyDown);
            }
          }, 0, false);
        };
        var _hide = $timepicker.hide;
        $timepicker.hide = function(blur) {
          if (!$timepicker.$isShown) return;
          if ($timepicker.$element) $timepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $timepicker.$onMouseDown);
          if (options.keyboard) {
            if (element) element.off('keydown', $timepicker.$onKeyDown);
          }
          _hide(blur);
        };
        return $timepicker;
      }
      timepickerFactory.defaults = defaults;
      return timepickerFactory;
    } ];
  }).directive('bsTimepicker', [ '$window', '$parse', '$q', '$dateFormatter', '$dateParser', '$timepicker', function($window, $parse, $q, $dateFormatter, $dateParser, $timepicker) {
    var defaults = $timepicker.defaults;
    var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'autoclose', 'timeType', 'timeFormat', 'timezone', 'modelTimeFormat', 'useNative', 'hourStep', 'minuteStep', 'secondStep', 'length', 'arrowBehavior', 'iconUp', 'iconDown', 'roundDisplay', 'id', 'prefixClass', 'prefixEvent', 'defaultDate' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'autoclose', 'useNative', 'roundDisplay' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        if (isNative && (options.useNative || defaults.useNative)) options.timeFormat = 'HH:mm';
        var timepicker = $timepicker(element, controller, options);
        options = timepicker.$options;
        var lang = options.lang;
        var formatDate = function(date, format, timezone) {
          return $dateFormatter.formatDate(date, format, lang, timezone);
        };
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!timepicker || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(timepicker),?/i);
            if (newValue === true) {
              timepicker.show();
            } else {
              timepicker.hide();
            }
          });
        }
        var dateParser = $dateParser({
          format: options.timeFormat,
          lang: lang
        });
        angular.forEach([ 'minTime', 'maxTime' ], function(key) {
          if (angular.isDefined(attr[key])) {
            attr.$observe(key, function(newValue) {
              timepicker.$options[key] = dateParser.getTimeForAttribute(key, newValue);
              if (!isNaN(timepicker.$options[key])) timepicker.$build();
              validateAgainstMinMaxTime(controller.$dateValue);
            });
          }
        });
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          timepicker.update(controller.$dateValue);
        }, true);
        function validateAgainstMinMaxTime(parsedTime) {
          if (!angular.isDate(parsedTime)) return;
          var isMinValid = isNaN(options.minTime) || new Date(parsedTime.getTime()).setFullYear(1970, 0, 1) >= options.minTime;
          var isMaxValid = isNaN(options.maxTime) || new Date(parsedTime.getTime()).setFullYear(1970, 0, 1) <= options.maxTime;
          var isValid = isMinValid && isMaxValid;
          controller.$setValidity('date', isValid);
          controller.$setValidity('min', isMinValid);
          controller.$setValidity('max', isMaxValid);
          if (!isValid) {
            return;
          }
          controller.$dateValue = parsedTime;
        }
        controller.$parsers.unshift(function(viewValue) {
          var date;
          if (!viewValue) {
            controller.$setValidity('date', true);
            return null;
          }
          var parsedTime = angular.isDate(viewValue) ? viewValue : dateParser.parse(viewValue, controller.$dateValue);
          if (!parsedTime || isNaN(parsedTime.getTime())) {
            controller.$setValidity('date', false);
            return undefined;
          }
          validateAgainstMinMaxTime(parsedTime);
          if (options.timeType === 'string') {
            date = dateParser.timezoneOffsetAdjust(parsedTime, options.timezone, true);
            return formatDate(date, options.modelTimeFormat || options.timeFormat);
          }
          date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
          if (options.timeType === 'number') {
            return date.getTime();
          } else if (options.timeType === 'unix') {
            return date.getTime() / 1e3;
          } else if (options.timeType === 'iso') {
            return date.toISOString();
          }
          return new Date(date);
        });
        controller.$formatters.push(function(modelValue) {
          var date;
          if (angular.isUndefined(modelValue) || modelValue === null) {
            date = NaN;
          } else if (angular.isDate(modelValue)) {
            date = modelValue;
          } else if (options.timeType === 'string') {
            date = dateParser.parse(modelValue, null, options.modelTimeFormat);
          } else if (options.timeType === 'unix') {
            date = new Date(modelValue * 1e3);
          } else {
            date = new Date(modelValue);
          }
          controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
          return getTimeFormattedString();
        });
        controller.$render = function() {
          element.val(getTimeFormattedString());
        };
        function getTimeFormattedString() {
          return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.timeFormat);
        }
        scope.$on('$destroy', function() {
          if (timepicker) timepicker.destroy();
          options = null;
          timepicker = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.tab', []).provider('$tab', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      template: 'tab/tab.tpl.html',
      navClass: 'nav-tabs',
      activeClass: 'active'
    };
    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;
      self.$options = angular.copy(defaults);
      angular.forEach([ 'animation', 'navClass', 'activeClass' ], function(key) {
        if (angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });
      $scope.$navClass = self.$options.navClass;
      $scope.$activeClass = self.$options.activeClass;
      self.$panes = $scope.$panes = [];
      self.$activePaneChangeListeners = self.$viewChangeListeners = [];
      self.$push = function(pane) {
        if (angular.isUndefined(self.$panes.$active)) {
          $scope.$setActive(pane.name || 0);
        }
        self.$panes.push(pane);
      };
      self.$remove = function(pane) {
        var index = self.$panes.indexOf(pane);
        var active = self.$panes.$active;
        var activeIndex;
        if (angular.isString(active)) {
          activeIndex = self.$panes.map(function(pane) {
            return pane.name;
          }).indexOf(active);
        } else {
          activeIndex = self.$panes.$active;
        }
        self.$panes.splice(index, 1);
        if (index < activeIndex) {
          activeIndex--;
        } else if (index === activeIndex && activeIndex === self.$panes.length) {
          activeIndex--;
        }
        if (activeIndex >= 0 && activeIndex < self.$panes.length) {
          self.$setActive(self.$panes[activeIndex].name || activeIndex);
        } else {
          self.$setActive();
        }
      };
      self.$setActive = $scope.$setActive = function(value) {
        self.$panes.$active = value;
        self.$activePaneChangeListeners.forEach(function(fn) {
          fn();
        });
      };
      self.$isActive = $scope.$isActive = function($pane, $index) {
        return self.$panes.$active === $pane.name || self.$panes.$active === $index;
      };
    };
    this.$get = function() {
      var $tab = {};
      $tab.defaults = defaults;
      $tab.controller = controller;
      return $tab;
    };
  }).directive('bsTabs', [ '$window', '$animate', '$tab', '$parse', function($window, $animate, $tab, $parse) {
    var defaults = $tab.defaults;
    return {
      require: [ '?ngModel', 'bsTabs' ],
      transclude: true,
      scope: true,
      controller: [ '$scope', '$element', '$attrs', $tab.controller ],
      templateUrl: function(element, attr) {
        return attr.template || defaults.template;
      },
      link: function postLink(scope, element, attrs, controllers) {
        var ngModelCtrl = controllers[0];
        var bsTabsCtrl = controllers[1];
        if (ngModelCtrl) {
          bsTabsCtrl.$activePaneChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(bsTabsCtrl.$panes.$active);
          });
          ngModelCtrl.$formatters.push(function(modelValue) {
            bsTabsCtrl.$setActive(modelValue);
            return modelValue;
          });
        }
        if (attrs.bsActivePane) {
          var parsedBsActivePane = $parse(attrs.bsActivePane);
          bsTabsCtrl.$activePaneChangeListeners.push(function() {
            parsedBsActivePane.assign(scope, bsTabsCtrl.$panes.$active);
          });
          scope.$watch(attrs.bsActivePane, function(newValue, oldValue) {
            bsTabsCtrl.$setActive(newValue);
          }, true);
        }
      }
    };
  } ]).directive('bsPane', [ '$window', '$animate', '$sce', function($window, $animate, $sce) {
    return {
      require: [ '^?ngModel', '^bsTabs' ],
      scope: true,
      link: function postLink(scope, element, attrs, controllers) {
        var bsTabsCtrl = controllers[1];
        element.addClass('tab-pane');
        attrs.$observe('title', function(newValue, oldValue) {
          scope.title = $sce.trustAsHtml(newValue);
        });
        scope.name = attrs.name;
        if (bsTabsCtrl.$options.animation) {
          element.addClass(bsTabsCtrl.$options.animation);
        }
        attrs.$observe('disabled', function(newValue, oldValue) {
          scope.disabled = scope.$eval(newValue);
        });
        bsTabsCtrl.$push(scope);
        scope.$on('$destroy', function() {
          bsTabsCtrl.$remove(scope);
        });
        function render() {
          var index = bsTabsCtrl.$panes.indexOf(scope);
          $animate[bsTabsCtrl.$isActive(scope, index) ? 'addClass' : 'removeClass'](element, bsTabsCtrl.$options.activeClass);
        }
        bsTabsCtrl.$activePaneChangeListeners.push(function() {
          render();
        });
        render();
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.select', [ 'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions' ]).provider('$select', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'select',
      prefixEvent: '$select',
      placement: 'bottom-left',
      templateUrl: 'select/select.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      multiple: false,
      allNoneButtons: false,
      sort: true,
      caretHtml: '&nbsp;<span class="caret"></span>',
      placeholder: 'Choose among the following...',
      allText: 'All',
      noneText: 'None',
      maxLength: 3,
      maxLengthHtml: 'selected',
      iconCheckmark: 'glyphicon glyphicon-ok',
      toggle: false
    };
    this.$get = [ '$window', '$document', '$rootScope', '$tooltip', '$timeout', function($window, $document, $rootScope, $tooltip, $timeout) {
      var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
      var isTouch = 'createTouch' in $window.document && isNative;
      function SelectFactory(element, controller, config) {
        var $select = {};
        var options = angular.extend({}, defaults, config);
        $select = $tooltip(element, options);
        var scope = $select.$scope;
        scope.$matches = [];
        if (options.multiple) {
          scope.$activeIndex = [];
        } else {
          scope.$activeIndex = -1;
        }
        scope.$isMultiple = options.multiple;
        scope.$showAllNoneButtons = options.allNoneButtons && options.multiple;
        scope.$iconCheckmark = options.iconCheckmark;
        scope.$allText = options.allText;
        scope.$noneText = options.noneText;
        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $select.activate(index);
          });
        };
        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $select.select(index);
          });
        };
        scope.$isVisible = function() {
          return $select.$isVisible();
        };
        scope.$isActive = function(index) {
          return $select.$isActive(index);
        };
        scope.$selectAll = function() {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (!scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };
        scope.$selectNone = function() {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };
        $select.update = function(matches) {
          scope.$matches = matches;
          $select.$updateActiveIndex();
        };
        $select.activate = function(index) {
          if (options.multiple) {
            if ($select.$isActive(index)) {
              scope.$activeIndex.splice(scope.$activeIndex.indexOf(index), 1);
            } else {
              scope.$activeIndex.push(index);
            }
            if (options.sort) scope.$activeIndex.sort(function(a, b) {
              return a - b;
            });
          } else {
            scope.$activeIndex = index;
          }
          return scope.$activeIndex;
        };
        $select.select = function(index) {
          if (angular.isUndefined(index) || index < 0 || index >= scope.$matches.length) {
            return;
          }
          var value = scope.$matches[index].value;
          scope.$apply(function() {
            $select.activate(index);
            if (options.multiple) {
              controller.$setViewValue(scope.$activeIndex.map(function(index) {
                if (angular.isUndefined(scope.$matches[index])) {
                  return null;
                }
                return scope.$matches[index].value;
              }));
            } else {
              if (options.toggle) {
                controller.$setViewValue(value === controller.$modelValue ? undefined : value);
              } else {
                controller.$setViewValue(value);
              }
              $select.hide();
            }
          });
          scope.$emit(options.prefixEvent + '.select', value, index, $select);
          if (angular.isDefined(options.onSelect) && angular.isFunction(options.onSelect)) {
            options.onSelect(value, index, $select);
          }
        };
        $select.$updateActiveIndex = function() {
          if (options.multiple) {
            if (angular.isArray(controller.$modelValue)) {
              scope.$activeIndex = controller.$modelValue.map(function(value) {
                return $select.$getIndex(value);
              });
            } else {
              scope.$activeIndex = [];
            }
          } else {
            if (angular.isDefined(controller.$modelValue) && scope.$matches.length) {
              scope.$activeIndex = $select.$getIndex(controller.$modelValue);
            } else {
              scope.$activeIndex = -1;
            }
          }
        };
        $select.$isVisible = function() {
          if (!options.minLength || !controller) {
            return scope.$matches.length;
          }
          return scope.$matches.length && controller.$viewValue.length >= options.minLength;
        };
        $select.$isActive = function(index) {
          if (options.multiple) {
            return scope.$activeIndex.indexOf(index) !== -1;
          }
          return scope.$activeIndex === index;
        };
        $select.$getIndex = function(value) {
          var index;
          for (index = scope.$matches.length; index--; ) {
            if (angular.equals(scope.$matches[index].value, value)) break;
          }
          return index;
        };
        $select.$onMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          if (isTouch) {
            var targetEl = angular.element(evt.target);
            var anchor;
            if (evt.target.nodeName !== 'A') {
              var anchorCandidate = targetEl.parent();
              while (!anchor && anchorCandidate.length > 0) {
                if (anchorCandidate[0].nodeName === 'A') {
                  anchor = anchorCandidate;
                }
                anchorCandidate = anchorCandidate.parent();
              }
            }
            if (anchor) {
              angular.element(anchor).triggerHandler('click');
            } else {
              targetEl.triggerHandler('click');
            }
          }
        };
        $select.$onKeyDown = function(evt) {
          if (!/(9|13|38|40)/.test(evt.keyCode)) return;
          if (evt.keyCode !== 9) {
            evt.preventDefault();
            evt.stopPropagation();
          }
          if (options.multiple && evt.keyCode === 9) {
            return $select.hide();
          }
          if (!options.multiple && (evt.keyCode === 13 || evt.keyCode === 9)) {
            return $select.select(scope.$activeIndex);
          }
          if (!options.multiple) {
            if (evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--; else if (evt.keyCode === 38 && scope.$activeIndex < 0) scope.$activeIndex = scope.$matches.length - 1; else if (evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++; else if (angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
            scope.$digest();
          }
        };
        $select.$isIE = function() {
          var ua = $window.navigator.userAgent;
          return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0;
        };
        $select.$selectScrollFix = function(e) {
          if ($document[0].activeElement.tagName === 'UL') {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.target.focus();
          }
        };
        var _show = $select.show;
        $select.show = function() {
          _show();
          if (options.multiple) {
            $select.$element.addClass('select-multiple');
          }
          $timeout(function() {
            $select.$element.on(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
            if (options.keyboard) {
              element.on('keydown', $select.$onKeyDown);
            }
          }, 0, false);
        };
        var _hide = $select.hide;
        $select.hide = function() {
          if (!options.multiple && angular.isUndefined(controller.$modelValue)) {
            scope.$activeIndex = -1;
          }
          $select.$element.off(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
          if (options.keyboard) {
            element.off('keydown', $select.$onKeyDown);
          }
          _hide(true);
        };
        return $select;
      }
      SelectFactory.defaults = defaults;
      return SelectFactory;
    } ];
  }).directive('bsSelect', [ '$window', '$parse', '$q', '$select', '$parseOptions', function($window, $parse, $q, $select, $parseOptions) {
    var defaults = $select.defaults;
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = {
          scope: scope,
          placeholder: defaults.placeholder
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'placeholder', 'allNoneButtons', 'maxLength', 'maxLengthHtml', 'allText', 'noneText', 'iconCheckmark', 'autoClose', 'id', 'sort', 'caretHtml', 'prefixClass', 'prefixEvent', 'toggle' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'allNoneButtons', 'sort' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide', 'onSelect' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        var dataMultiple = element.attr('data-multiple');
        if (angular.isDefined(dataMultiple)) {
          if (falseValueRegExp.test(dataMultiple)) {
            options.multiple = false;
          } else {
            options.multiple = dataMultiple;
          }
        }
        if (element[0].nodeName.toLowerCase() === 'select') {
          var inputEl = element;
          inputEl.css('display', 'none');
          element = angular.element('<button type="button" class="btn btn-default"></button>');
          inputEl.after(element);
        }
        var parsedOptions = $parseOptions(attr.bsOptions);
        var select = $select(element, controller, options);
        if (select.$isIE()) {
          element[0].addEventListener('blur', select.$selectScrollFix);
        }
        var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').trim();
        scope.$watch(watchedOptions, function(newValue, oldValue) {
          parsedOptions.valuesFn(scope, controller).then(function(values) {
            select.update(values);
            controller.$render();
          });
        }, true);
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          select.$updateActiveIndex();
          controller.$render();
        }, true);
        controller.$render = function() {
          var selected;
          var index;
          if (options.multiple && angular.isArray(controller.$modelValue)) {
            selected = controller.$modelValue.map(function(value) {
              index = select.$getIndex(value);
              return index !== -1 ? select.$scope.$matches[index].label : false;
            }).filter(angular.isDefined);
            if (selected.length > (options.maxLength || defaults.maxLength)) {
              selected = selected.length + ' ' + (options.maxLengthHtml || defaults.maxLengthHtml);
            } else {
              selected = selected.join(', ');
            }
          } else {
            index = select.$getIndex(controller.$modelValue);
            selected = index !== -1 ? select.$scope.$matches[index].label : false;
          }
          element.html((selected || options.placeholder) + (options.caretHtml || defaults.caretHtml));
        };
        if (options.multiple) {
          controller.$isEmpty = function(value) {
            return !value || value.length === 0;
          };
        }
        scope.$on('$destroy', function() {
          if (select) select.destroy();
          options = null;
          select = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.scrollspy', [ 'mgcrea.ngStrap.helpers.debounce', 'mgcrea.ngStrap.helpers.dimensions' ]).provider('$scrollspy', function() {
    var spies = this.$$spies = {};
    var defaults = this.defaults = {
      debounce: 150,
      throttle: 100,
      offset: 100
    };
    this.$get = [ '$window', '$document', '$rootScope', 'dimensions', 'debounce', 'throttle', function($window, $document, $rootScope, dimensions, debounce, throttle) {
      var windowEl = angular.element($window);
      var docEl = angular.element($document.prop('documentElement'));
      var bodyEl = angular.element($window.document.body);
      function nodeName(element, name) {
        return element[0].nodeName && element[0].nodeName.toLowerCase() === name.toLowerCase();
      }
      function ScrollSpyFactory(config) {
        var options = angular.extend({}, defaults, config);
        if (!options.element) options.element = bodyEl;
        var isWindowSpy = nodeName(options.element, 'body');
        var scrollEl = isWindowSpy ? windowEl : options.element;
        var scrollId = isWindowSpy ? 'window' : options.id;
        if (spies[scrollId]) {
          spies[scrollId].$$count++;
          return spies[scrollId];
        }
        var $scrollspy = {};
        var unbindViewContentLoaded;
        var unbindIncludeContentLoaded;
        var trackedElements = $scrollspy.$trackedElements = [];
        var sortedElements = [];
        var activeTarget;
        var debouncedCheckPosition;
        var throttledCheckPosition;
        var debouncedCheckOffsets;
        var viewportHeight;
        var scrollTop;
        $scrollspy.init = function() {
          this.$$count = 1;
          debouncedCheckPosition = debounce(this.checkPosition, options.debounce);
          throttledCheckPosition = throttle(this.checkPosition, options.throttle);
          scrollEl.on('click', this.checkPositionWithEventLoop);
          windowEl.on('resize', debouncedCheckPosition);
          scrollEl.on('scroll', throttledCheckPosition);
          debouncedCheckOffsets = debounce(this.checkOffsets, options.debounce);
          unbindViewContentLoaded = $rootScope.$on('$viewContentLoaded', debouncedCheckOffsets);
          unbindIncludeContentLoaded = $rootScope.$on('$includeContentLoaded', debouncedCheckOffsets);
          debouncedCheckOffsets();
          if (scrollId) {
            spies[scrollId] = $scrollspy;
          }
        };
        $scrollspy.destroy = function() {
          this.$$count--;
          if (this.$$count > 0) {
            return;
          }
          scrollEl.off('click', this.checkPositionWithEventLoop);
          windowEl.off('resize', debouncedCheckPosition);
          scrollEl.off('scroll', throttledCheckPosition);
          unbindViewContentLoaded();
          unbindIncludeContentLoaded();
          if (scrollId) {
            delete spies[scrollId];
          }
        };
        $scrollspy.checkPosition = function() {
          if (!sortedElements.length) return;
          scrollTop = (isWindowSpy ? $window.pageYOffset : scrollEl.prop('scrollTop')) || 0;
          viewportHeight = Math.max($window.innerHeight, docEl.prop('clientHeight'));
          if (scrollTop < sortedElements[0].offsetTop && activeTarget !== sortedElements[0].target) {
            return $scrollspy.$activateElement(sortedElements[0]);
          }
          for (var i = sortedElements.length; i--; ) {
            if (angular.isUndefined(sortedElements[i].offsetTop) || sortedElements[i].offsetTop === null) continue;
            if (activeTarget === sortedElements[i].target) continue;
            if (scrollTop < sortedElements[i].offsetTop) continue;
            if (sortedElements[i + 1] && scrollTop > sortedElements[i + 1].offsetTop) continue;
            return $scrollspy.$activateElement(sortedElements[i]);
          }
        };
        $scrollspy.checkPositionWithEventLoop = function() {
          setTimeout($scrollspy.checkPosition, 1);
        };
        $scrollspy.$activateElement = function(element) {
          if (activeTarget) {
            var activeElement = $scrollspy.$getTrackedElement(activeTarget);
            if (activeElement) {
              activeElement.source.removeClass('active');
              if (nodeName(activeElement.source, 'li') && nodeName(activeElement.source.parent().parent(), 'li')) {
                activeElement.source.parent().parent().removeClass('active');
              }
            }
          }
          activeTarget = element.target;
          element.source.addClass('active');
          if (nodeName(element.source, 'li') && nodeName(element.source.parent().parent(), 'li')) {
            element.source.parent().parent().addClass('active');
          }
        };
        $scrollspy.$getTrackedElement = function(target) {
          return trackedElements.filter(function(obj) {
            return obj.target === target;
          })[0];
        };
        $scrollspy.checkOffsets = function() {
          angular.forEach(trackedElements, function(trackedElement) {
            var targetElement = document.querySelector(trackedElement.target);
            trackedElement.offsetTop = targetElement ? dimensions.offset(targetElement).top : null;
            if (options.offset && trackedElement.offsetTop !== null) trackedElement.offsetTop -= options.offset * 1;
          });
          sortedElements = trackedElements.filter(function(el) {
            return el.offsetTop !== null;
          }).sort(function(a, b) {
            return a.offsetTop - b.offsetTop;
          });
          debouncedCheckPosition();
        };
        $scrollspy.trackElement = function(target, source) {
          trackedElements.push({
            target: target,
            source: source
          });
        };
        $scrollspy.untrackElement = function(target, source) {
          var toDelete;
          for (var i = trackedElements.length; i--; ) {
            if (trackedElements[i].target === target && trackedElements[i].source === source) {
              toDelete = i;
              break;
            }
          }
          trackedElements.splice(toDelete, 1);
        };
        $scrollspy.activate = function(i) {
          trackedElements[i].addClass('active');
        };
        $scrollspy.init();
        return $scrollspy;
      }
      return ScrollSpyFactory;
    } ];
  }).directive('bsScrollspy', [ '$rootScope', 'debounce', 'dimensions', '$scrollspy', function($rootScope, debounce, dimensions, $scrollspy) {
    return {
      restrict: 'EAC',
      link: function postLink(scope, element, attr) {
        var options = {
          scope: scope
        };
        angular.forEach([ 'offset', 'target' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var scrollspy = $scrollspy(options);
        scrollspy.trackElement(options.target, element);
        scope.$on('$destroy', function() {
          if (scrollspy) {
            scrollspy.untrackElement(options.target, element);
            scrollspy.destroy();
          }
          options = null;
          scrollspy = null;
        });
      }
    };
  } ]).directive('bsScrollspyList', [ '$rootScope', 'debounce', 'dimensions', '$scrollspy', function($rootScope, debounce, dimensions, $scrollspy) {
    return {
      restrict: 'A',
      compile: function postLink(element, attr) {
        var children = element[0].querySelectorAll('li > a[href]');
        angular.forEach(children, function(child) {
          var childEl = angular.element(child);
          childEl.parent().attr('bs-scrollspy', '').attr('data-target', childEl.attr('href'));
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.popover', [ 'mgcrea.ngStrap.tooltip' ]).provider('$popover', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      customClass: '',
      container: false,
      target: false,
      placement: 'right',
      templateUrl: 'popover/popover.tpl.html',
      contentTemplate: false,
      trigger: 'click',
      keyboard: true,
      html: false,
      title: '',
      content: '',
      delay: 0,
      autoClose: false
    };
    this.$get = [ '$tooltip', function($tooltip) {
      function PopoverFactory(element, config) {
        var options = angular.extend({}, defaults, config);
        var $popover = $tooltip(element, options);
        if (options.content) {
          $popover.$scope.content = options.content;
        }
        return $popover;
      }
      return PopoverFactory;
    } ];
  }).directive('bsPopover', [ '$window', '$sce', '$popover', function($window, $sce, $popover) {
    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr) {
        var popover;
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'customClass', 'autoClose', 'id', 'prefixClass', 'prefixEvent', 'bsEnabled' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'autoClose' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        var dataTarget = element.attr('data-target');
        if (angular.isDefined(dataTarget)) {
          if (falseValueRegExp.test(dataTarget)) {
            options.target = false;
          } else {
            options.target = dataTarget;
          }
        }
        angular.forEach([ 'title', 'content' ], function(key) {
          if (attr[key]) {
            attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
              if (angular.isDefined(oldValue)) {
                requestAnimationFrame(function() {
                  if (popover) popover.$applyPlacement();
                });
              }
            });
          }
        });
        if (attr.bsPopover) {
          scope.$watch(attr.bsPopover, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
            if (angular.isDefined(oldValue)) {
              requestAnimationFrame(function() {
                if (popover) popover.$applyPlacement();
              });
            }
          }, true);
        }
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!popover || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(popover),?/i);
            if (newValue === true) {
              popover.show();
            } else {
              popover.hide();
            }
          });
        }
        if (attr.bsEnabled) {
          scope.$watch(attr.bsEnabled, function(newValue) {
            if (!popover || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|1|,?(popover),?/i);
            if (newValue === false) {
              popover.setEnabled(false);
            } else {
              popover.setEnabled(true);
            }
          });
        }
        if (attr.viewport) {
          scope.$watch(attr.viewport, function(newValue) {
            if (!popover || !angular.isDefined(newValue)) return;
            popover.setViewport(newValue);
          });
        }
        popover = $popover(element, options);
        scope.$on('$destroy', function() {
          if (popover) popover.destroy();
          options = null;
          popover = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.navbar', []).provider('$navbar', function() {
    var defaults = this.defaults = {
      activeClass: 'active',
      routeAttr: 'data-match-route',
      strict: false
    };
    this.$get = function() {
      return {
        defaults: defaults
      };
    };
  }).directive('bsNavbar', [ '$window', '$location', '$navbar', function($window, $location, $navbar) {
    var defaults = $navbar.defaults;
    return {
      restrict: 'A',
      link: function postLink(scope, element, attr, controller) {
        var options = angular.copy(defaults);
        angular.forEach(Object.keys(defaults), function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        scope.$watch(function() {
          return $location.path();
        }, function(newValue, oldValue) {
          var liElements = element[0].querySelectorAll('li[' + options.routeAttr + ']');
          angular.forEach(liElements, function(li) {
            var liElement = angular.element(li);
            var pattern = liElement.attr(options.routeAttr).replace('/', '\\/');
            if (options.strict) {
              pattern = '^' + pattern + '$';
            }
            var regexp = new RegExp(pattern, 'i');
            if (regexp.test(newValue)) {
              liElement.addClass(options.activeClass);
            } else {
              liElement.removeClass(options.activeClass);
            }
          });
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.modal', [ 'mgcrea.ngStrap.core', 'mgcrea.ngStrap.helpers.dimensions' ]).provider('$modal', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      backdropAnimation: 'am-fade',
      customClass: '',
      prefixClass: 'modal',
      prefixEvent: 'modal',
      placement: 'top',
      templateUrl: 'modal/modal.tpl.html',
      template: '',
      contentTemplate: false,
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true,
      size: null,
      zIndex: null
    };
    this.$get = [ '$window', '$rootScope', '$bsCompiler', '$animate', '$timeout', '$sce', 'dimensions', function($window, $rootScope, $bsCompiler, $animate, $timeout, $sce, dimensions) {
      var forEach = angular.forEach;
      var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
      var bodyElement = angular.element($window.document.body);
      var backdropCount = 0;
      var dialogBaseZindex = 1050;
      var backdropBaseZindex = 1040;
      var validSizes = {
        lg: 'modal-lg',
        sm: 'modal-sm'
      };
      function ModalFactory(config) {
        var $modal = {};
        var options = $modal.$options = angular.extend({}, defaults, config);
        var promise = $modal.$promise = $bsCompiler.compile(options);
        var scope = $modal.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        if (!options.element && !options.container) {
          options.container = 'body';
        }
        if (options.zIndex) {
          dialogBaseZindex = parseInt(options.zIndex, 10);
          backdropBaseZindex = dialogBaseZindex - 10;
        }
        $modal.$id = options.id || options.element && options.element.attr('id') || '';
        forEach([ 'title', 'content' ], function(key) {
          if (options[key]) scope[key] = $sce.trustAsHtml(options[key]);
        });
        scope.$hide = function() {
          scope.$$postDigest(function() {
            $modal.hide();
          });
        };
        scope.$show = function() {
          scope.$$postDigest(function() {
            $modal.show();
          });
        };
        scope.$toggle = function() {
          scope.$$postDigest(function() {
            $modal.toggle();
          });
        };
        $modal.$isShown = scope.$isShown = false;
        var compileData;
        var modalElement;
        var modalScope;
        var backdropElement = angular.element('<div class="' + options.prefixClass + '-backdrop"/>');
        backdropElement.css({
          position: 'fixed',
          top: '0px',
          left: '0px',
          bottom: '0px',
          right: '0px'
        });
        promise.then(function(data) {
          compileData = data;
          $modal.init();
        });
        $modal.init = function() {
          if (options.show) {
            scope.$$postDigest(function() {
              $modal.show();
            });
          }
        };
        $modal.destroy = function() {
          destroyModalElement();
          if (backdropElement) {
            backdropElement.remove();
            backdropElement = null;
          }
          scope.$destroy();
        };
        $modal.show = function() {
          if ($modal.$isShown) return;
          var parent;
          var after;
          if (angular.isElement(options.container)) {
            parent = options.container;
            after = options.container[0].lastChild ? angular.element(options.container[0].lastChild) : null;
          } else {
            if (options.container) {
              parent = findElement(options.container);
              after = parent[0] && parent[0].lastChild ? angular.element(parent[0].lastChild) : null;
            } else {
              parent = null;
              after = options.element;
            }
          }
          if (modalElement) destroyModalElement();
          modalScope = $modal.$scope.$new();
          modalElement = $modal.$element = compileData.link(modalScope, function(clonedElement, scope) {});
          if (options.backdrop) {
            modalElement.css({
              'z-index': dialogBaseZindex + backdropCount * 20
            });
            backdropElement.css({
              'z-index': backdropBaseZindex + backdropCount * 20
            });
            backdropCount++;
          }
          if (scope.$emit(options.prefixEvent + '.show.before', $modal).defaultPrevented) {
            return;
          }
          if (angular.isDefined(options.onBeforeShow) && angular.isFunction(options.onBeforeShow)) {
            options.onBeforeShow($modal);
          }
          modalElement.css({
            display: 'block'
          }).addClass(options.placement);
          if (options.customClass) {
            modalElement.addClass(options.customClass);
          }
          if (options.size && validSizes[options.size]) {
            angular.element(findElement('.modal-dialog', modalElement[0])).addClass(validSizes[options.size]);
          }
          if (options.animation) {
            if (options.backdrop) {
              backdropElement.addClass(options.backdropAnimation);
            }
            modalElement.addClass(options.animation);
          }
          if (options.backdrop) {
            $animate.enter(backdropElement, bodyElement, null);
          }
          if (angular.version.minor <= 2) {
            $animate.enter(modalElement, parent, after, enterAnimateCallback);
          } else {
            $animate.enter(modalElement, parent, after).then(enterAnimateCallback);
          }
          $modal.$isShown = scope.$isShown = true;
          safeDigest(scope);
          var el = modalElement[0];
          requestAnimationFrame(function() {
            el.focus();
          });
          bodyElement.addClass(options.prefixClass + '-open');
          if (options.animation) {
            bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
          }
          bindBackdropEvents();
          bindKeyboardEvents();
        };
        function enterAnimateCallback() {
          scope.$emit(options.prefixEvent + '.show', $modal);
          if (angular.isDefined(options.onShow) && angular.isFunction(options.onShow)) {
            options.onShow($modal);
          }
        }
        $modal.hide = function() {
          if (!$modal.$isShown) return;
          if (scope.$emit(options.prefixEvent + '.hide.before', $modal).defaultPrevented) {
            return;
          }
          if (angular.isDefined(options.onBeforeHide) && angular.isFunction(options.onBeforeHide)) {
            options.onBeforeHide($modal);
          }
          if (angular.version.minor <= 2) {
            $animate.leave(modalElement, leaveAnimateCallback);
          } else {
            $animate.leave(modalElement).then(leaveAnimateCallback);
          }
          if (options.backdrop) {
            backdropCount--;
            $animate.leave(backdropElement);
          }
          $modal.$isShown = scope.$isShown = false;
          safeDigest(scope);
          unbindBackdropEvents();
          unbindKeyboardEvents();
        };
        function leaveAnimateCallback() {
          scope.$emit(options.prefixEvent + '.hide', $modal);
          if (angular.isDefined(options.onHide) && angular.isFunction(options.onHide)) {
            options.onHide($modal);
          }
          if (findElement('.modal').length <= 0) {
            bodyElement.removeClass(options.prefixClass + '-open');
          }
          if (options.animation) {
            bodyElement.removeClass(options.prefixClass + '-with-' + options.animation);
          }
        }
        $modal.toggle = function() {
          if ($modal.$isShown) {
            $modal.hide();
          } else {
            $modal.show();
          }
        };
        $modal.focus = function() {
          modalElement[0].focus();
        };
        $modal.$onKeyUp = function(evt) {
          if (evt.which === 27 && $modal.$isShown) {
            $modal.hide();
            evt.stopPropagation();
          }
        };
        function bindBackdropEvents() {
          if (options.backdrop) {
            modalElement.on('click', hideOnBackdropClick);
            backdropElement.on('click', hideOnBackdropClick);
            backdropElement.on('wheel', preventEventDefault);
          }
        }
        function unbindBackdropEvents() {
          if (options.backdrop) {
            modalElement.off('click', hideOnBackdropClick);
            backdropElement.off('click', hideOnBackdropClick);
            backdropElement.off('wheel', preventEventDefault);
          }
        }
        function bindKeyboardEvents() {
          if (options.keyboard) {
            modalElement.on('keyup', $modal.$onKeyUp);
          }
        }
        function unbindKeyboardEvents() {
          if (options.keyboard) {
            modalElement.off('keyup', $modal.$onKeyUp);
          }
        }
        function hideOnBackdropClick(evt) {
          if (evt.target !== evt.currentTarget) return;
          if (options.backdrop === 'static') {
            $modal.focus();
          } else {
            $modal.hide();
          }
        }
        function preventEventDefault(evt) {
          evt.preventDefault();
        }
        function destroyModalElement() {
          if ($modal.$isShown && modalElement !== null) {
            unbindBackdropEvents();
            unbindKeyboardEvents();
          }
          if (modalScope) {
            modalScope.$destroy();
            modalScope = null;
          }
          if (modalElement) {
            modalElement.remove();
            modalElement = $modal.$element = null;
          }
        }
        return $modal;
      }
      function safeDigest(scope) {
        scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
      }
      function findElement(query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }
      return ModalFactory;
    } ];
  }).directive('bsModal', [ '$window', '$sce', '$parse', '$modal', function($window, $sce, $parse, $modal) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        var options = {
          scope: scope,
          element: element,
          show: false
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation', 'backdropAnimation', 'id', 'prefixEvent', 'prefixClass', 'customClass', 'modalClass', 'size', 'zIndex' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        if (options.modalClass) {
          options.customClass = options.modalClass;
        }
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'backdrop', 'keyboard', 'html', 'container' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        angular.forEach([ 'title', 'content' ], function(key) {
          if (attr[key]) {
            attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          }
        });
        if (attr.bsModal) {
          scope.$watch(attr.bsModal, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);
        }
        var modal = $modal(options);
        element.on(attr.trigger || 'click', modal.toggle);
        scope.$on('$destroy', function() {
          if (modal) modal.destroy();
          options = null;
          modal = null;
        });
      }
    };
  } ]);
  if (angular.version.minor < 3 && angular.version.dot < 14) {
    angular.module('ng').factory('$$rAF', [ '$window', '$timeout', function($window, $timeout) {
      var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;
      var cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.mozCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame;
      var rafSupported = !!requestAnimationFrame;
      var raf = rafSupported ? function(fn) {
        var id = requestAnimationFrame(fn);
        return function() {
          cancelAnimationFrame(id);
        };
      } : function(fn) {
        var timer = $timeout(fn, 16.66, false);
        return function() {
          $timeout.cancel(timer);
        };
      };
      raf.supported = rafSupported;
      return raf;
    } ]);
  }
  angular.module('mgcrea.ngStrap.helpers.parseOptions', []).provider('$parseOptions', function() {
    var defaults = this.defaults = {
      regexp: /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/
    };
    this.$get = [ '$parse', '$q', function($parse, $q) {
      function ParseOptionsFactory(attr, config) {
        var $parseOptions = {};
        var options = angular.extend({}, defaults, config);
        $parseOptions.$values = [];
        var match;
        var displayFn;
        var valueName;
        var keyName;
        var groupByFn;
        var valueFn;
        var valuesFn;
        $parseOptions.init = function() {
          $parseOptions.$match = match = attr.match(options.regexp);
          displayFn = $parse(match[2] || match[1]);
          valueName = match[4] || match[6];
          keyName = match[5];
          groupByFn = $parse(match[3] || '');
          valueFn = $parse(match[2] ? match[1] : valueName);
          valuesFn = $parse(match[7]);
        };
        $parseOptions.valuesFn = function(scope, controller) {
          return $q.when(valuesFn(scope, controller)).then(function(values) {
            if (!angular.isArray(values)) {
              values = [];
            }
            $parseOptions.$values = values.length ? parseValues(values, scope) : [];
            return $parseOptions.$values;
          });
        };
        $parseOptions.displayValue = function(modelValue) {
          var scope = {};
          scope[valueName] = modelValue;
          return displayFn(scope);
        };
        function parseValues(values, scope) {
          return values.map(function(match, index) {
            var locals = {};
            var label;
            var value;
            locals[valueName] = match;
            label = displayFn(scope, locals);
            value = valueFn(scope, locals);
            return {
              label: label,
              value: value,
              index: index
            };
          });
        }
        $parseOptions.init();
        return $parseOptions;
      }
      return ParseOptionsFactory;
    } ];
  });
  angular.module('mgcrea.ngStrap.helpers.dimensions', []).factory('dimensions', function() {
    var fn = {};
    var nodeName = fn.nodeName = function(element, name) {
      return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
    };
    fn.css = function(element, prop, extra) {
      var value;
      if (element.currentStyle) {
        value = element.currentStyle[prop];
      } else if (window.getComputedStyle) {
        value = window.getComputedStyle(element)[prop];
      } else {
        value = element.style[prop];
      }
      return extra === true ? parseFloat(value) || 0 : value;
    };
    fn.offset = function(element) {
      var boxRect = element.getBoundingClientRect();
      var docElement = element.ownerDocument;
      return {
        width: boxRect.width || element.offsetWidth,
        height: boxRect.height || element.offsetHeight,
        top: boxRect.top + (window.pageYOffset || docElement.documentElement.scrollTop) - (docElement.documentElement.clientTop || 0),
        left: boxRect.left + (window.pageXOffset || docElement.documentElement.scrollLeft) - (docElement.documentElement.clientLeft || 0)
      };
    };
    fn.setOffset = function(element, options, i) {
      var curPosition;
      var curLeft;
      var curCSSTop;
      var curTop;
      var curOffset;
      var curCSSLeft;
      var calculatePosition;
      var position = fn.css(element, 'position');
      var curElem = angular.element(element);
      var props = {};
      if (position === 'static') {
        element.style.position = 'relative';
      }
      curOffset = fn.offset(element);
      curCSSTop = fn.css(element, 'top');
      curCSSLeft = fn.css(element, 'left');
      calculatePosition = (position === 'absolute' || position === 'fixed') && (curCSSTop + curCSSLeft).indexOf('auto') > -1;
      if (calculatePosition) {
        curPosition = fn.position(element);
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (angular.isFunction(options)) {
        options = options.call(element, i, curOffset);
      }
      if (options.top !== null) {
        props.top = options.top - curOffset.top + curTop;
      }
      if (options.left !== null) {
        props.left = options.left - curOffset.left + curLeft;
      }
      if ('using' in options) {
        options.using.call(curElem, props);
      } else {
        curElem.css({
          top: props.top + 'px',
          left: props.left + 'px'
        });
      }
    };
    fn.position = function(element) {
      var offsetParentRect = {
        top: 0,
        left: 0
      };
      var offsetParentEl;
      var offset;
      if (fn.css(element, 'position') === 'fixed') {
        offset = element.getBoundingClientRect();
      } else {
        offsetParentEl = offsetParentElement(element);
        offset = fn.offset(element);
        if (!nodeName(offsetParentEl, 'html')) {
          offsetParentRect = fn.offset(offsetParentEl);
        }
        offsetParentRect.top += fn.css(offsetParentEl, 'borderTopWidth', true);
        offsetParentRect.left += fn.css(offsetParentEl, 'borderLeftWidth', true);
      }
      return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        top: offset.top - offsetParentRect.top - fn.css(element, 'marginTop', true),
        left: offset.left - offsetParentRect.left - fn.css(element, 'marginLeft', true)
      };
    };
    function offsetParentElement(element) {
      var docElement = element.ownerDocument;
      var offsetParent = element.offsetParent || docElement;
      if (nodeName(offsetParent, '#document')) return docElement.documentElement;
      while (offsetParent && !nodeName(offsetParent, 'html') && fn.css(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docElement.documentElement;
    }
    fn.height = function(element, outer) {
      var value = element.offsetHeight;
      if (outer) {
        value += fn.css(element, 'marginTop', true) + fn.css(element, 'marginBottom', true);
      } else {
        value -= fn.css(element, 'paddingTop', true) + fn.css(element, 'paddingBottom', true) + fn.css(element, 'borderTopWidth', true) + fn.css(element, 'borderBottomWidth', true);
      }
      return value;
    };
    fn.width = function(element, outer) {
      var value = element.offsetWidth;
      if (outer) {
        value += fn.css(element, 'marginLeft', true) + fn.css(element, 'marginRight', true);
      } else {
        value -= fn.css(element, 'paddingLeft', true) + fn.css(element, 'paddingRight', true) + fn.css(element, 'borderLeftWidth', true) + fn.css(element, 'borderRightWidth', true);
      }
      return value;
    };
    return fn;
  });
  angular.module('mgcrea.ngStrap.helpers.debounce', []).factory('debounce', [ '$timeout', function($timeout) {
    return function(func, wait, immediate) {
      var timeout = null;
      return function() {
        var context = this;
        var args = arguments;
        var callNow = immediate && !timeout;
        if (timeout) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(function later() {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        }, wait, false);
        if (callNow) {
          func.apply(context, args);
        }
        return timeout;
      };
    };
  } ]).factory('throttle', [ '$timeout', function($timeout) {
    return function(func, wait, options) {
      var timeout = null;
      if (!options) options = {};
      return function() {
        var context = this;
        var args = arguments;
        if (!timeout) {
          if (options.leading !== false) {
            func.apply(context, args);
          }
          timeout = $timeout(function later() {
            timeout = null;
            if (options.trailing !== false) {
              func.apply(context, args);
            }
          }, wait, false);
        }
      };
    };
  } ]);
  angular.module('mgcrea.ngStrap.helpers.dateParser', []).provider('$dateParser', [ '$localeProvider', function($localeProvider) {
    function ParseDate() {
      this.year = 1970;
      this.month = 0;
      this.day = 1;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.milliseconds = 0;
    }
    ParseDate.prototype.setMilliseconds = function(value) {
      this.milliseconds = value;
    };
    ParseDate.prototype.setSeconds = function(value) {
      this.seconds = value;
    };
    ParseDate.prototype.setMinutes = function(value) {
      this.minutes = value;
    };
    ParseDate.prototype.setHours = function(value) {
      this.hours = value;
    };
    ParseDate.prototype.getHours = function() {
      return this.hours;
    };
    ParseDate.prototype.setDate = function(value) {
      this.day = value;
    };
    ParseDate.prototype.setMonth = function(value) {
      this.month = value;
    };
    ParseDate.prototype.setFullYear = function(value) {
      this.year = value;
    };
    ParseDate.prototype.fromDate = function(value) {
      this.year = value.getFullYear();
      this.month = value.getMonth();
      this.day = value.getDate();
      this.hours = value.getHours();
      this.minutes = value.getMinutes();
      this.seconds = value.getSeconds();
      this.milliseconds = value.getMilliseconds();
      return this;
    };
    ParseDate.prototype.toDate = function() {
      return new Date(this.year, this.month, this.day, this.hours, this.minutes, this.seconds, this.milliseconds);
    };
    var proto = ParseDate.prototype;
    function noop() {}
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function indexOfCaseInsensitive(array, value) {
      var len = array.length;
      var str = value.toString().toLowerCase();
      for (var i = 0; i < len; i++) {
        if (array[i].toLowerCase() === str) {
          return i;
        }
      }
      return -1;
    }
    var defaults = this.defaults = {
      format: 'shortDate',
      strict: false
    };
    this.$get = [ '$locale', 'dateFilter', function($locale, dateFilter) {
      var DateParserFactory = function(config) {
        var options = angular.extend({}, defaults, config);
        var $dateParser = {};
        var regExpMap = {
          sss: '[0-9]{3}',
          ss: '[0-5][0-9]',
          s: options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
          mm: '[0-5][0-9]',
          m: options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
          HH: '[01][0-9]|2[0-3]',
          H: options.strict ? '1?[0-9]|2[0-3]' : '[01]?[0-9]|2[0-3]',
          hh: '[0][1-9]|[1][012]',
          h: options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
          a: 'AM|PM',
          EEEE: $locale.DATETIME_FORMATS.DAY.join('|'),
          EEE: $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
          dd: '0[1-9]|[12][0-9]|3[01]',
          d: options.strict ? '[1-9]|[1-2][0-9]|3[01]' : '0?[1-9]|[1-2][0-9]|3[01]',
          MMMM: $locale.DATETIME_FORMATS.MONTH.join('|'),
          MMM: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
          MM: '0[1-9]|1[012]',
          M: options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
          yyyy: '[1]{1}[0-9]{3}|[2]{1}[0-9]{3}',
          yy: '[0-9]{2}',
          y: options.strict ? '-?(0|[1-9][0-9]{0,3})' : '-?0*[0-9]{1,4}'
        };
        var setFnMap = {
          sss: proto.setMilliseconds,
          ss: proto.setSeconds,
          s: proto.setSeconds,
          mm: proto.setMinutes,
          m: proto.setMinutes,
          HH: proto.setHours,
          H: proto.setHours,
          hh: proto.setHours,
          h: proto.setHours,
          EEEE: noop,
          EEE: noop,
          dd: proto.setDate,
          d: proto.setDate,
          a: function(value) {
            var hours = this.getHours() % 12;
            return this.setHours(value.match(/pm/i) ? hours + 12 : hours);
          },
          MMMM: function(value) {
            return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.MONTH, value));
          },
          MMM: function(value) {
            return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.SHORTMONTH, value));
          },
          MM: function(value) {
            return this.setMonth(1 * value - 1);
          },
          M: function(value) {
            return this.setMonth(1 * value - 1);
          },
          yyyy: proto.setFullYear,
          yy: function(value) {
            return this.setFullYear(2e3 + 1 * value);
          },
          y: function(value) {
            return 1 * value <= 50 && value.length === 2 ? this.setFullYear(2e3 + 1 * value) : this.setFullYear(1 * value);
          }
        };
        var regex;
        var setMap;
        $dateParser.init = function() {
          $dateParser.$format = $locale.DATETIME_FORMATS[options.format] || options.format;
          regex = regExpForFormat($dateParser.$format);
          setMap = setMapForFormat($dateParser.$format);
        };
        $dateParser.isValid = function(date) {
          if (angular.isDate(date)) return !isNaN(date.getTime());
          return regex.test(date);
        };
        $dateParser.parse = function(value, baseDate, format, timezone) {
          if (format) format = $locale.DATETIME_FORMATS[format] || format;
          if (angular.isDate(value)) value = dateFilter(value, format || $dateParser.$format, timezone);
          var formatRegex = format ? regExpForFormat(format) : regex;
          var formatSetMap = format ? setMapForFormat(format) : setMap;
          var matches = formatRegex.exec(value);
          if (!matches) return false;
          var date = baseDate && !isNaN(baseDate.getTime()) ? new ParseDate().fromDate(baseDate) : new ParseDate().fromDate(new Date(1970, 0, 1, 0));
          for (var i = 0; i < matches.length - 1; i++) {
            if (formatSetMap[i]) formatSetMap[i].call(date, matches[i + 1]);
          }
          var newDate = date.toDate();
          if (parseInt(date.day, 10) !== newDate.getDate()) {
            return false;
          }
          return newDate;
        };
        $dateParser.getDateForAttribute = function(key, value) {
          var date;
          if (value === 'today') {
            var today = new Date();
            date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (key === 'maxDate' ? 1 : 0), 0, 0, 0, key === 'minDate' ? 0 : -1);
          } else if (angular.isString(value) && value.match(/^".+"$/)) {
            date = new Date(value.substr(1, value.length - 2));
          } else if (isNumeric(value)) {
            date = new Date(parseInt(value, 10));
          } else if (angular.isString(value) && value.length === 0) {
            date = key === 'minDate' ? -Infinity : +Infinity;
          } else {
            date = new Date(value);
          }
          return date;
        };
        $dateParser.getTimeForAttribute = function(key, value) {
          var time;
          if (value === 'now') {
            time = new Date().setFullYear(1970, 0, 1);
          } else if (angular.isString(value) && value.match(/^".+"$/)) {
            time = new Date(value.substr(1, value.length - 2)).setFullYear(1970, 0, 1);
          } else if (isNumeric(value)) {
            time = new Date(parseInt(value, 10)).setFullYear(1970, 0, 1);
          } else if (angular.isString(value) && value.length === 0) {
            time = key === 'minTime' ? -Infinity : +Infinity;
          } else {
            time = $dateParser.parse(value, new Date(1970, 0, 1, 0));
          }
          return time;
        };
        $dateParser.daylightSavingAdjust = function(date) {
          if (!date) {
            return null;
          }
          date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
          return date;
        };
        $dateParser.timezoneOffsetAdjust = function(date, timezone, undo) {
          if (!date) {
            return null;
          }
          if (timezone && timezone === 'UTC') {
            date = new Date(date.getTime());
            date.setMinutes(date.getMinutes() + (undo ? -1 : 1) * date.getTimezoneOffset());
          }
          return date;
        };
        function regExpForFormat(format) {
          var re = buildDateAbstractRegex(format);
          return buildDateParseRegex(re);
        }
        function buildDateAbstractRegex(format) {
          var escapedFormat = escapeReservedSymbols(format);
          var escapedLiteralFormat = escapedFormat.replace(/''/g, '\\\'');
          var literalRegex = /('(?:\\'|.)*?')/;
          var formatParts = escapedLiteralFormat.split(literalRegex);
          var dateElements = Object.keys(regExpMap);
          var dateRegexParts = [];
          angular.forEach(formatParts, function(part) {
            if (isFormatStringLiteral(part)) {
              part = trimLiteralEscapeChars(part);
            } else {
              for (var i = 0; i < dateElements.length; i++) {
                part = part.split(dateElements[i]).join('${' + i + '}');
              }
            }
            dateRegexParts.push(part);
          });
          return dateRegexParts.join('');
        }
        function escapeReservedSymbols(text) {
          return text.replace(/\\/g, '[\\\\]').replace(/-/g, '[-]').replace(/\./g, '[.]').replace(/\*/g, '[*]').replace(/\+/g, '[+]').replace(/\?/g, '[?]').replace(/\$/g, '[$]').replace(/\^/g, '[^]').replace(/\//g, '[/]').replace(/\\s/g, '[\\s]');
        }
        function isFormatStringLiteral(text) {
          return /^'.*'$/.test(text);
        }
        function trimLiteralEscapeChars(text) {
          return text.replace(/^'(.*)'$/, '$1');
        }
        function buildDateParseRegex(abstractRegex) {
          var dateElements = Object.keys(regExpMap);
          var re = abstractRegex;
          for (var i = 0; i < dateElements.length; i++) {
            re = re.split('${' + i + '}').join('(' + regExpMap[dateElements[i]] + ')');
          }
          return new RegExp('^' + re + '$', [ 'i' ]);
        }
        function setMapForFormat(format) {
          var re = buildDateAbstractRegex(format);
          return buildDateParseValuesMap(re);
        }
        function buildDateParseValuesMap(abstractRegex) {
          var dateElements = Object.keys(regExpMap);
          var valuesRegex = new RegExp('\\${(\\d+)}', 'g');
          var valuesMatch;
          var keyIndex;
          var valueKey;
          var valueFunction;
          var valuesFunctionMap = [];
          while ((valuesMatch = valuesRegex.exec(abstractRegex)) !== null) {
            keyIndex = valuesMatch[1];
            valueKey = dateElements[keyIndex];
            valueFunction = setFnMap[valueKey];
            valuesFunctionMap.push(valueFunction);
          }
          return valuesFunctionMap;
        }
        $dateParser.init();
        return $dateParser;
      };
      return DateParserFactory;
    } ];
  } ]);
  angular.module('mgcrea.ngStrap.helpers.dateFormatter', []).service('$dateFormatter', [ '$locale', 'dateFilter', function($locale, dateFilter) {
    this.getDefaultLocale = function() {
      return $locale.id;
    };
    this.getDatetimeFormat = function(format, lang) {
      return $locale.DATETIME_FORMATS[format] || format;
    };
    this.weekdaysShort = function(lang) {
      return $locale.DATETIME_FORMATS.SHORTDAY;
    };
    function splitTimeFormat(format) {
      return /(h+)([:\.])?(m+)([:\.])?(s*)[ ]?(a?)/i.exec(format).slice(1);
    }
    this.hoursFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[0];
    };
    this.minutesFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[2];
    };
    this.secondsFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[4];
    };
    this.timeSeparator = function(timeFormat) {
      return splitTimeFormat(timeFormat)[1];
    };
    this.showSeconds = function(timeFormat) {
      return !!splitTimeFormat(timeFormat)[4];
    };
    this.showAM = function(timeFormat) {
      return !!splitTimeFormat(timeFormat)[5];
    };
    this.formatDate = function(date, format, lang, timezone) {
      return dateFilter(date, format, timezone);
    };
  } ]);
  angular.module('mgcrea.ngStrap.core', []).service('$bsCompiler', bsCompilerService);
  function bsCompilerService($q, $http, $injector, $compile, $controller, $templateCache) {
    this.compile = function(options) {
      if (options.template && /\.html$/.test(options.template)) {
        console.warn('Deprecated use of `template` option to pass a file. Please use the `templateUrl` option instead.');
        options.templateUrl = options.template;
        options.template = '';
      }
      var templateUrl = options.templateUrl;
      var template = options.template || '';
      var controller = options.controller;
      var controllerAs = options.controllerAs;
      var resolve = options.resolve || {};
      var locals = options.locals || {};
      var transformTemplate = options.transformTemplate || angular.identity;
      var bindToController = options.bindToController;
      angular.forEach(resolve, function(value, key) {
        if (angular.isString(value)) {
          resolve[key] = $injector.get(value);
        } else {
          resolve[key] = $injector.invoke(value);
        }
      });
      angular.extend(resolve, locals);
      if (template) {
        resolve.$template = $q.when(template);
      } else if (templateUrl) {
        resolve.$template = fetchTemplate(templateUrl);
      } else {
        throw new Error('Missing `template` / `templateUrl` option.');
      }
      if (options.titleTemplate) {
        resolve.$template = $q.all([ resolve.$template, fetchTemplate(options.titleTemplate) ]).then(function(templates) {
          var templateEl = angular.element(templates[0]);
          findElement('[ng-bind="title"]', templateEl[0]).removeAttr('ng-bind').html(templates[1]);
          return templateEl[0].outerHTML;
        });
      }
      if (options.contentTemplate) {
        resolve.$template = $q.all([ resolve.$template, fetchTemplate(options.contentTemplate) ]).then(function(templates) {
          var templateEl = angular.element(templates[0]);
          var contentEl = findElement('[ng-bind="content"]', templateEl[0]).removeAttr('ng-bind').html(templates[1]);
          if (!options.templateUrl) contentEl.next().remove();
          return templateEl[0].outerHTML;
        });
      }
      return $q.all(resolve).then(function(locals) {
        var template = transformTemplate(locals.$template);
        if (options.html) {
          template = template.replace(/ng-bind="/gi, 'ng-bind-html="');
        }
        var element = angular.element('<div>').html(template.trim()).contents();
        var linkFn = $compile(element);
        return {
          locals: locals,
          element: element,
          link: function link(scope) {
            locals.$scope = scope;
            if (controller) {
              var invokeCtrl = $controller(controller, locals, true);
              if (bindToController) {
                angular.extend(invokeCtrl.instance, locals);
              }
              var ctrl = angular.isObject(invokeCtrl) ? invokeCtrl : invokeCtrl();
              element.data('$ngControllerController', ctrl);
              element.children().data('$ngControllerController', ctrl);
              if (controllerAs) {
                scope[controllerAs] = ctrl;
              }
            }
            return linkFn.apply(null, arguments);
          }
        };
      });
    };
    function findElement(query, element) {
      return angular.element((element || document).querySelectorAll(query));
    }
    var fetchPromises = {};
    function fetchTemplate(template) {
      if (fetchPromises[template]) return fetchPromises[template];
      return fetchPromises[template] = $http.get(template, {
        cache: $templateCache
      }).then(function(res) {
        return res.data;
      });
    }
  }
  angular.module('mgcrea.ngStrap.dropdown', [ 'mgcrea.ngStrap.tooltip' ]).provider('$dropdown', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'dropdown',
      prefixEvent: 'dropdown',
      placement: 'bottom-left',
      templateUrl: 'dropdown/dropdown.tpl.html',
      trigger: 'click',
      container: false,
      keyboard: true,
      html: false,
      delay: 0
    };
    this.$get = [ '$window', '$rootScope', '$tooltip', '$timeout', function($window, $rootScope, $tooltip, $timeout) {
      var bodyEl = angular.element($window.document.body);
      var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;
      function DropdownFactory(element, config) {
        var $dropdown = {};
        var options = angular.extend({}, defaults, config);
        $dropdown.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        $dropdown = $tooltip(element, options);
        var parentEl = element.parent();
        $dropdown.$onKeyDown = function(evt) {
          if (!/(38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();
          var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
          if (!items.length) return;
          var index;
          angular.forEach(items, function(el, i) {
            if (matchesSelector && matchesSelector.call(el, ':focus')) index = i;
          });
          if (evt.keyCode === 38 && index > 0) index--; else if (evt.keyCode === 40 && index < items.length - 1) index++; else if (angular.isUndefined(index)) index = 0;
          items.eq(index)[0].focus();
        };
        var show = $dropdown.show;
        $dropdown.show = function() {
          show();
          $timeout(function() {
            if (options.keyboard && $dropdown.$element) $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
            bodyEl.on('click', onBodyClick);
          }, 0, false);
          if (parentEl.hasClass('dropdown')) parentEl.addClass('open');
        };
        var hide = $dropdown.hide;
        $dropdown.hide = function() {
          if (!$dropdown.$isShown) return;
          if (options.keyboard && $dropdown.$element) $dropdown.$element.off('keydown', $dropdown.$onKeyDown);
          bodyEl.off('click', onBodyClick);
          if (parentEl.hasClass('dropdown')) parentEl.removeClass('open');
          hide();
        };
        var destroy = $dropdown.destroy;
        $dropdown.destroy = function() {
          bodyEl.off('click', onBodyClick);
          destroy();
        };
        function onBodyClick(evt) {
          if (evt.target === element[0]) return;
          return evt.target !== element[0] && $dropdown.hide();
        }
        return $dropdown;
      }
      return DropdownFactory;
    } ];
  }).directive('bsDropdown', [ '$window', '$sce', '$dropdown', function($window, $sce, $dropdown) {
    return {
      restrict: 'EAC',
      scope: true,
      compile: function(tElement, tAttrs) {
        if (!tAttrs.bsDropdown) {
          var nextSibling = tElement[0].nextSibling;
          while (nextSibling && nextSibling.nodeType !== 1) {
            nextSibling = nextSibling.nextSibling;
          }
          if (nextSibling && nextSibling.className.split(' ').indexOf('dropdown-menu') >= 0) {
            tAttrs.template = nextSibling.outerHTML;
            tAttrs.templateUrl = undefined;
            nextSibling.parentNode.removeChild(nextSibling);
          }
        }
        return function postLink(scope, element, attr) {
          var options = {
            scope: scope
          };
          angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'id', 'autoClose' ], function(key) {
            if (angular.isDefined(tAttrs[key])) options[key] = tAttrs[key];
          });
          var falseValueRegExp = /^(false|0|)$/i;
          angular.forEach([ 'html', 'container' ], function(key) {
            if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
          });
          angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
            var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
            if (angular.isDefined(attr[bsKey])) {
              options[key] = scope.$eval(attr[bsKey]);
            }
          });
          if (attr.bsDropdown) {
            scope.$watch(attr.bsDropdown, function(newValue, oldValue) {
              scope.content = newValue;
            }, true);
          }
          var dropdown = $dropdown(element, options);
          if (attr.bsShow) {
            scope.$watch(attr.bsShow, function(newValue, oldValue) {
              if (!dropdown || !angular.isDefined(newValue)) return;
              if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(dropdown),?/i);
              if (newValue === true) {
                dropdown.show();
              } else {
                dropdown.hide();
              }
            });
          }
          scope.$on('$destroy', function() {
            if (dropdown) dropdown.destroy();
            options = null;
            dropdown = null;
          });
        };
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.button', []).provider('$button', function() {
    var defaults = this.defaults = {
      activeClass: 'active',
      toggleEvent: 'click'
    };
    this.$get = function() {
      return {
        defaults: defaults
      };
    };
  }).directive('bsCheckboxGroup', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function postLink(element, attr) {
        element.attr('data-toggle', 'buttons');
        element.removeAttr('ng-model');
        var children = element[0].querySelectorAll('input[type="checkbox"]');
        angular.forEach(children, function(child) {
          var childEl = angular.element(child);
          childEl.attr('bs-checkbox', '');
          childEl.attr('ng-model', attr.ngModel + '.' + childEl.attr('value'));
        });
      }
    };
  }).directive('bsCheckbox', [ '$button', '$$rAF', function($button, $$rAF) {
    var defaults = $button.defaults;
    var constantValueRegExp = /^(true|false|\d+)$/;
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = defaults;
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;
        var trueValue = angular.isDefined(attr.trueValue) ? attr.trueValue : true;
        if (constantValueRegExp.test(attr.trueValue)) {
          trueValue = scope.$eval(attr.trueValue);
        }
        var falseValue = angular.isDefined(attr.falseValue) ? attr.falseValue : false;
        if (constantValueRegExp.test(attr.falseValue)) {
          falseValue = scope.$eval(attr.falseValue);
        }
        var hasExoticValues = typeof trueValue !== 'boolean' || typeof falseValue !== 'boolean';
        if (hasExoticValues) {
          controller.$parsers.push(function(viewValue) {
            return viewValue ? trueValue : falseValue;
          });
          controller.$formatters.push(function(modelValue) {
            return angular.equals(modelValue, trueValue);
          });
        }
        controller.$render = function() {
          var isActive = !!controller.$viewValue;
          $$rAF(function() {
            if (isInput) element[0].checked = isActive;
            activeElement.toggleClass(options.activeClass, isActive);
          });
        };
        element.bind(options.toggleEvent, function() {
          scope.$apply(function() {
            if (!isInput) {
              controller.$setViewValue(!activeElement.hasClass('active'));
            }
            controller.$render();
          });
        });
      }
    };
  } ]).directive('bsRadioGroup', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function postLink(element, attr) {
        element.attr('data-toggle', 'buttons');
        element.removeAttr('ng-model');
        var children = element[0].querySelectorAll('input[type="radio"]');
        angular.forEach(children, function(child) {
          angular.element(child).attr('bs-radio', '');
          angular.element(child).attr('ng-model', attr.ngModel);
        });
      }
    };
  }).directive('bsRadio', [ '$button', '$$rAF', function($button, $$rAF) {
    var defaults = $button.defaults;
    var constantValueRegExp = /^(true|false|\d+)$/;
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = defaults;
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;
        var value;
        attr.$observe('value', function(v) {
          if (typeof v !== 'boolean' && constantValueRegExp.test(v)) {
            value = scope.$eval(v);
          } else {
            value = v;
          }
          controller.$render();
        });
        controller.$render = function() {
          var isActive = angular.equals(controller.$viewValue, value);
          $$rAF(function() {
            if (isInput) element[0].checked = isActive;
            activeElement.toggleClass(options.activeClass, isActive);
          });
        };
        element.bind(options.toggleEvent, function() {
          scope.$apply(function() {
            controller.$setViewValue(value);
            controller.$render();
          });
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.datepicker', [ 'mgcrea.ngStrap.helpers.dateParser', 'mgcrea.ngStrap.helpers.dateFormatter', 'mgcrea.ngStrap.tooltip' ]).provider('$datepicker', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'datepicker',
      placement: 'bottom-left',
      templateUrl: 'datepicker/datepicker.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      useNative: false,
      dateType: 'date',
      dateFormat: 'shortDate',
      timezone: null,
      modelDateFormat: null,
      dayFormat: 'dd',
      monthFormat: 'MMM',
      yearFormat: 'yyyy',
      monthTitleFormat: 'MMMM yyyy',
      yearTitleFormat: 'yyyy',
      strictFormat: false,
      autoclose: false,
      minDate: -Infinity,
      maxDate: +Infinity,
      startView: 0,
      minView: 0,
      startWeek: 0,
      daysOfWeekDisabled: '',
      hasToday: false,
      hasClear: false,
      iconLeft: 'glyphicon glyphicon-chevron-left',
      iconRight: 'glyphicon glyphicon-chevron-right'
    };
    this.$get = [ '$window', '$document', '$rootScope', '$sce', '$dateFormatter', 'datepickerViews', '$tooltip', '$timeout', function($window, $document, $rootScope, $sce, $dateFormatter, datepickerViews, $tooltip, $timeout) {
      var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
      var isTouch = 'createTouch' in $window.document && isNative;
      if (!defaults.lang) defaults.lang = $dateFormatter.getDefaultLocale();
      function DatepickerFactory(element, controller, config) {
        var $datepicker = $tooltip(element, angular.extend({}, defaults, config));
        var parentScope = config.scope;
        var options = $datepicker.$options;
        var scope = $datepicker.$scope;
        if (options.startView) options.startView -= options.minView;
        var pickerViews = datepickerViews($datepicker);
        $datepicker.$views = pickerViews.views;
        var viewDate = pickerViews.viewDate;
        scope.$mode = options.startView;
        scope.$iconLeft = options.iconLeft;
        scope.$iconRight = options.iconRight;
        scope.$hasToday = options.hasToday;
        scope.$hasClear = options.hasClear;
        var $picker = $datepicker.$views[scope.$mode];
        scope.$select = function(date, disabled) {
          if (disabled) return;
          $datepicker.select(date);
        };
        scope.$selectPane = function(value) {
          $datepicker.$selectPane(value);
        };
        scope.$toggleMode = function() {
          $datepicker.setMode((scope.$mode + 1) % $datepicker.$views.length);
        };
        scope.$setToday = function() {
          if (options.autoclose) {
            $datepicker.setMode(0);
            $datepicker.select(new Date());
          } else {
            $datepicker.select(new Date(), true);
          }
        };
        scope.$clear = function() {
          if (options.autoclose) {
            $datepicker.setMode(0);
            $datepicker.select(null);
          } else {
            $datepicker.select(null, true);
          }
        };
        $datepicker.update = function(date) {
          if (angular.isDate(date) && !isNaN(date.getTime())) {
            $datepicker.$date = date;
            $picker.update.call($picker, date);
          }
          $datepicker.$build(true);
        };
        $datepicker.updateDisabledDates = function(dateRanges) {
          options.disabledDateRanges = dateRanges;
          for (var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], $datepicker.$setDisabledEl);
          }
        };
        $datepicker.select = function(date, keep) {
          if (angular.isDate(date)) {
            if (!angular.isDate(controller.$dateValue) || isNaN(controller.$dateValue.getTime())) {
              controller.$dateValue = new Date(date);
            }
          } else {
            controller.$dateValue = null;
          }
          if (!scope.$mode || keep) {
            controller.$setViewValue(angular.copy(date));
            controller.$render();
            if (options.autoclose && !keep) {
              $timeout(function() {
                $datepicker.hide(true);
              });
            }
          } else {
            angular.extend(viewDate, {
              year: date.getFullYear(),
              month: date.getMonth(),
              date: date.getDate()
            });
            $datepicker.setMode(scope.$mode - 1);
            $datepicker.$build();
          }
        };
        $datepicker.setMode = function(mode) {
          scope.$mode = mode;
          $picker = $datepicker.$views[scope.$mode];
          $datepicker.$build();
        };
        $datepicker.$build = function(pristine) {
          if (pristine === true && $picker.built) return;
          if (pristine === false && !$picker.built) return;
          $picker.build.call($picker);
        };
        $datepicker.$updateSelected = function() {
          for (var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], updateSelected);
          }
        };
        $datepicker.$isSelected = function(date) {
          return $picker.isSelected(date);
        };
        $datepicker.$setDisabledEl = function(el) {
          el.disabled = $picker.isDisabled(el.date);
        };
        $datepicker.$selectPane = function(value) {
          var steps = $picker.steps;
          var targetDate = new Date(Date.UTC(viewDate.year + (steps.year || 0) * value, viewDate.month + (steps.month || 0) * value, 1));
          angular.extend(viewDate, {
            year: targetDate.getUTCFullYear(),
            month: targetDate.getUTCMonth(),
            date: targetDate.getUTCDate()
          });
          $datepicker.$build();
        };
        $datepicker.$onMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          if (isTouch) {
            var targetEl = angular.element(evt.target);
            if (targetEl[0].nodeName.toLowerCase() !== 'button') {
              targetEl = targetEl.parent();
            }
            targetEl.triggerHandler('click');
          }
        };
        $datepicker.$onKeyDown = function(evt) {
          if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
          evt.preventDefault();
          evt.stopPropagation();
          if (evt.keyCode === 13) {
            if (!scope.$mode) {
              $datepicker.hide(true);
            } else {
              scope.$apply(function() {
                $datepicker.setMode(scope.$mode - 1);
              });
            }
            return;
          }
          $picker.onKeyDown(evt);
          parentScope.$digest();
        };
        function updateSelected(el) {
          el.selected = $datepicker.$isSelected(el.date);
        }
        function focusElement() {
          element[0].focus();
        }
        var _init = $datepicker.init;
        $datepicker.init = function() {
          if (isNative && options.useNative) {
            element.prop('type', 'date');
            element.css('-webkit-appearance', 'textfield');
            return;
          } else if (isTouch) {
            element.prop('type', 'text');
            element.attr('readonly', 'true');
            element.on('click', focusElement);
          }
          _init();
        };
        var _destroy = $datepicker.destroy;
        $datepicker.destroy = function() {
          if (isNative && options.useNative) {
            element.off('click', focusElement);
          }
          _destroy();
        };
        var _show = $datepicker.show;
        $datepicker.show = function() {
          if (!isTouch && element.attr('readonly') || element.attr('disabled')) return;
          _show();
          $timeout(function() {
            if (!$datepicker.$isShown) return;
            $datepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
            if (options.keyboard) {
              element.on('keydown', $datepicker.$onKeyDown);
            }
          }, 0, false);
        };
        var _hide = $datepicker.hide;
        $datepicker.hide = function(blur) {
          if (!$datepicker.$isShown) return;
          $datepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
          if (options.keyboard) {
            element.off('keydown', $datepicker.$onKeyDown);
          }
          _hide(blur);
        };
        return $datepicker;
      }
      DatepickerFactory.defaults = defaults;
      return DatepickerFactory;
    } ];
  }).directive('bsDatepicker', [ '$window', '$parse', '$q', '$dateFormatter', '$dateParser', '$datepicker', function($window, $parse, $q, $dateFormatter, $dateParser, $datepicker) {
    var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'autoclose', 'dateType', 'dateFormat', 'timezone', 'modelDateFormat', 'dayFormat', 'strictFormat', 'startWeek', 'startDate', 'useNative', 'lang', 'startView', 'minView', 'iconLeft', 'iconRight', 'daysOfWeekDisabled', 'id', 'prefixClass', 'prefixEvent', 'hasToday', 'hasClear' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'autoclose', 'useNative', 'hasToday', 'hasClear' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        var datepicker = $datepicker(element, controller, options);
        options = datepicker.$options;
        if (isNative && options.useNative) options.dateFormat = 'yyyy-MM-dd';
        var lang = options.lang;
        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };
        var dateParser = $dateParser({
          format: options.dateFormat,
          lang: lang,
          strict: options.strictFormat
        });
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!datepicker || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(datepicker),?/i);
            if (newValue === true) {
              datepicker.show();
            } else {
              datepicker.hide();
            }
          });
        }
        angular.forEach([ 'minDate', 'maxDate' ], function(key) {
          if (angular.isDefined(attr[key])) {
            attr.$observe(key, function(newValue) {
              datepicker.$options[key] = dateParser.getDateForAttribute(key, newValue);
              if (!isNaN(datepicker.$options[key])) datepicker.$build(false);
              validateAgainstMinMaxDate(controller.$dateValue);
            });
          }
        });
        if (angular.isDefined(attr.dateFormat)) {
          attr.$observe('dateFormat', function(newValue) {
            datepicker.$options.dateFormat = newValue;
          });
        }
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          datepicker.update(controller.$dateValue);
        }, true);
        function normalizeDateRanges(ranges) {
          if (!ranges || !ranges.length) return null;
          return ranges;
        }
        if (angular.isDefined(attr.disabledDates)) {
          scope.$watch(attr.disabledDates, function(disabledRanges, previousValue) {
            disabledRanges = normalizeDateRanges(disabledRanges);
            previousValue = normalizeDateRanges(previousValue);
            if (disabledRanges) {
              datepicker.updateDisabledDates(disabledRanges);
            }
          });
        }
        function validateAgainstMinMaxDate(parsedDate) {
          if (!angular.isDate(parsedDate)) return;
          var isMinValid = isNaN(datepicker.$options.minDate) || parsedDate.getTime() >= datepicker.$options.minDate;
          var isMaxValid = isNaN(datepicker.$options.maxDate) || parsedDate.getTime() <= datepicker.$options.maxDate;
          var isValid = isMinValid && isMaxValid;
          controller.$setValidity('date', isValid);
          controller.$setValidity('min', isMinValid);
          controller.$setValidity('max', isMaxValid);
          if (isValid) controller.$dateValue = parsedDate;
        }
        controller.$parsers.unshift(function(viewValue) {
          var date;
          if (!viewValue) {
            controller.$setValidity('date', true);
            return null;
          }
          var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
          if (!parsedDate || isNaN(parsedDate.getTime())) {
            controller.$setValidity('date', false);
            return;
          }
          validateAgainstMinMaxDate(parsedDate);
          if (options.dateType === 'string') {
            date = dateParser.timezoneOffsetAdjust(parsedDate, options.timezone, true);
            return formatDate(date, options.modelDateFormat || options.dateFormat);
          }
          date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
          if (options.dateType === 'number') {
            return date.getTime();
          } else if (options.dateType === 'unix') {
            return date.getTime() / 1e3;
          } else if (options.dateType === 'iso') {
            return date.toISOString();
          }
          return new Date(date);
        });
        controller.$formatters.push(function(modelValue) {
          var date;
          if (angular.isUndefined(modelValue) || modelValue === null) {
            date = NaN;
          } else if (angular.isDate(modelValue)) {
            date = modelValue;
          } else if (options.dateType === 'string') {
            date = dateParser.parse(modelValue, null, options.modelDateFormat);
          } else if (options.dateType === 'unix') {
            date = new Date(modelValue * 1e3);
          } else {
            date = new Date(modelValue);
          }
          controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
          return getDateFormattedString();
        });
        controller.$render = function() {
          element.val(getDateFormattedString());
        };
        function getDateFormattedString() {
          return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.dateFormat);
        }
        scope.$on('$destroy', function() {
          if (datepicker) datepicker.destroy();
          options = null;
          datepicker = null;
        });
      }
    };
  } ]).provider('datepickerViews', function() {
    function split(arr, size) {
      var arrays = [];
      while (arr.length > 0) {
        arrays.push(arr.splice(0, size));
      }
      return arrays;
    }
    function mod(n, m) {
      return (n % m + m) % m;
    }
    this.$get = [ '$dateFormatter', '$dateParser', '$sce', function($dateFormatter, $dateParser, $sce) {
      return function(picker) {
        var scope = picker.$scope;
        var options = picker.$options;
        var lang = options.lang;
        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };
        var dateParser = $dateParser({
          format: options.dateFormat,
          lang: lang,
          strict: options.strictFormat
        });
        var weekDaysMin = $dateFormatter.weekdaysShort(lang);
        var weekDaysLabels = weekDaysMin.slice(options.startWeek).concat(weekDaysMin.slice(0, options.startWeek));
        var weekDaysLabelsHtml = $sce.trustAsHtml('<th class="dow text-center">' + weekDaysLabels.join('</th><th class="dow text-center">') + '</th>');
        var startDate = picker.$date || (options.startDate ? dateParser.getDateForAttribute('startDate', options.startDate) : new Date());
        var viewDate = {
          year: startDate.getFullYear(),
          month: startDate.getMonth(),
          date: startDate.getDate()
        };
        var views = [ {
          format: options.dayFormat,
          split: 7,
          steps: {
            month: 1
          },
          update: function(date, force) {
            if (!this.built || force || date.getFullYear() !== viewDate.year || date.getMonth() !== viewDate.month) {
              angular.extend(viewDate, {
                year: picker.$date.getFullYear(),
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$build();
            } else if (date.getDate() !== viewDate.date || date.getDate() === 1) {
              viewDate.date = picker.$date.getDate();
              picker.$updateSelected();
            }
          },
          build: function() {
            var firstDayOfMonth = new Date(viewDate.year, viewDate.month, 1);
            var firstDayOfMonthOffset = firstDayOfMonth.getTimezoneOffset();
            var firstDate = new Date(+firstDayOfMonth - mod(firstDayOfMonth.getDay() - options.startWeek, 7) * 864e5);
            var firstDateOffset = firstDate.getTimezoneOffset();
            var today = dateParser.timezoneOffsetAdjust(new Date(), options.timezone).toDateString();
            if (firstDateOffset !== firstDayOfMonthOffset) firstDate = new Date(+firstDate + (firstDateOffset - firstDayOfMonthOffset) * 6e4);
            var days = [];
            var day;
            for (var i = 0; i < 42; i++) {
              day = dateParser.daylightSavingAdjust(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i));
              days.push({
                date: day,
                isToday: day.toDateString() === today,
                label: formatDate(day, this.format),
                selected: picker.$date && this.isSelected(day),
                muted: day.getMonth() !== viewDate.month,
                disabled: this.isDisabled(day)
              });
            }
            scope.title = formatDate(firstDayOfMonth, options.monthTitleFormat);
            scope.showLabels = true;
            scope.labels = weekDaysLabelsHtml;
            scope.rows = split(days, this.split);
            scope.isTodayDisabled = this.isDisabled(new Date());
            this.built = true;
          },
          isSelected: function(date) {
            return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth() && date.getDate() === picker.$date.getDate();
          },
          isDisabled: function(date) {
            var time = date.getTime();
            if (time < options.minDate || time > options.maxDate) return true;
            if (options.daysOfWeekDisabled.indexOf(date.getDay()) !== -1) return true;
            if (options.disabledDateRanges) {
              for (var i = 0; i < options.disabledDateRanges.length; i++) {
                if (time >= options.disabledDateRanges[i].start && time <= options.disabledDateRanges[i].end) {
                  return true;
                }
              }
            }
            return false;
          },
          onKeyDown: function(evt) {
            if (!picker.$date) {
              return;
            }
            var actualTime = picker.$date.getTime();
            var newDate;
            if (evt.keyCode === 37) newDate = new Date(actualTime - 1 * 864e5); else if (evt.keyCode === 38) newDate = new Date(actualTime - 7 * 864e5); else if (evt.keyCode === 39) newDate = new Date(actualTime + 1 * 864e5); else if (evt.keyCode === 40) newDate = new Date(actualTime + 7 * 864e5);
            if (!this.isDisabled(newDate)) picker.select(newDate, true);
          }
        }, {
          name: 'month',
          format: options.monthFormat,
          split: 4,
          steps: {
            year: 1
          },
          update: function(date, force) {
            if (!this.built || date.getFullYear() !== viewDate.year) {
              angular.extend(viewDate, {
                year: picker.$date.getFullYear(),
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$build();
            } else if (date.getMonth() !== viewDate.month) {
              angular.extend(viewDate, {
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$updateSelected();
            }
          },
          build: function() {
            var months = [];
            var month;
            for (var i = 0; i < 12; i++) {
              month = new Date(viewDate.year, i, 1);
              months.push({
                date: month,
                label: formatDate(month, this.format),
                selected: picker.$isSelected(month),
                disabled: this.isDisabled(month)
              });
            }
            scope.title = formatDate(month, options.yearTitleFormat);
            scope.showLabels = false;
            scope.rows = split(months, this.split);
            this.built = true;
          },
          isSelected: function(date) {
            return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth();
          },
          isDisabled: function(date) {
            var lastDate = +new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return lastDate < options.minDate || date.getTime() > options.maxDate;
          },
          onKeyDown: function(evt) {
            if (!picker.$date) {
              return;
            }
            var actualMonth = picker.$date.getMonth();
            var newDate = new Date(picker.$date);
            if (evt.keyCode === 37) newDate.setMonth(actualMonth - 1); else if (evt.keyCode === 38) newDate.setMonth(actualMonth - 4); else if (evt.keyCode === 39) newDate.setMonth(actualMonth + 1); else if (evt.keyCode === 40) newDate.setMonth(actualMonth + 4);
            if (!this.isDisabled(newDate)) picker.select(newDate, true);
          }
        }, {
          name: 'year',
          format: options.yearFormat,
          split: 4,
          steps: {
            year: 12
          },
          update: function(date, force) {
            if (!this.built || force || parseInt(date.getFullYear() / 20, 10) !== parseInt(viewDate.year / 20, 10)) {
              angular.extend(viewDate, {
                year: picker.$date.getFullYear(),
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$build();
            } else if (date.getFullYear() !== viewDate.year) {
              angular.extend(viewDate, {
                year: picker.$date.getFullYear(),
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$updateSelected();
            }
          },
          build: function() {
            var firstYear = viewDate.year - viewDate.year % (this.split * 3);
            var years = [];
            var year;
            for (var i = 0; i < 12; i++) {
              year = new Date(firstYear + i, 0, 1);
              years.push({
                date: year,
                label: formatDate(year, this.format),
                selected: picker.$isSelected(year),
                disabled: this.isDisabled(year)
              });
            }
            scope.title = years[0].label + '-' + years[years.length - 1].label;
            scope.showLabels = false;
            scope.rows = split(years, this.split);
            this.built = true;
          },
          isSelected: function(date) {
            return picker.$date && date.getFullYear() === picker.$date.getFullYear();
          },
          isDisabled: function(date) {
            var lastDate = +new Date(date.getFullYear() + 1, 0, 0);
            return lastDate < options.minDate || date.getTime() > options.maxDate;
          },
          onKeyDown: function(evt) {
            if (!picker.$date) {
              return;
            }
            var actualYear = picker.$date.getFullYear();
            var newDate = new Date(picker.$date);
            if (evt.keyCode === 37) newDate.setYear(actualYear - 1); else if (evt.keyCode === 38) newDate.setYear(actualYear - 4); else if (evt.keyCode === 39) newDate.setYear(actualYear + 1); else if (evt.keyCode === 40) newDate.setYear(actualYear + 4);
            if (!this.isDisabled(newDate)) picker.select(newDate, true);
          }
        } ];
        return {
          views: options.minView ? Array.prototype.slice.call(views, options.minView) : views,
          viewDate: viewDate
        };
      };
    } ];
  });
  angular.module('mgcrea.ngStrap.collapse', []).provider('$collapse', function() {
    var defaults = this.defaults = {
      animation: 'am-collapse',
      disallowToggle: false,
      activeClass: 'in',
      startCollapsed: false,
      allowMultiple: false
    };
    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;
      self.$options = angular.copy(defaults);
      angular.forEach([ 'animation', 'disallowToggle', 'activeClass', 'startCollapsed', 'allowMultiple' ], function(key) {
        if (angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });
      var falseValueRegExp = /^(false|0|)$/i;
      angular.forEach([ 'disallowToggle', 'startCollapsed', 'allowMultiple' ], function(key) {
        if (angular.isDefined($attrs[key]) && falseValueRegExp.test($attrs[key])) {
          self.$options[key] = false;
        }
      });
      self.$toggles = [];
      self.$targets = [];
      self.$viewChangeListeners = [];
      self.$registerToggle = function(element) {
        self.$toggles.push(element);
      };
      self.$registerTarget = function(element) {
        self.$targets.push(element);
      };
      self.$unregisterToggle = function(element) {
        var index = self.$toggles.indexOf(element);
        self.$toggles.splice(index, 1);
      };
      self.$unregisterTarget = function(element) {
        var index = self.$targets.indexOf(element);
        self.$targets.splice(index, 1);
        if (self.$options.allowMultiple) {
          deactivateItem(element);
        }
        fixActiveItemIndexes(index);
        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };
      self.$targets.$active = !self.$options.startCollapsed ? [ 0 ] : [];
      self.$setActive = $scope.$setActive = function(value) {
        if (angular.isArray(value)) {
          self.$targets.$active = value;
        } else if (!self.$options.disallowToggle && isActive(value)) {
          deactivateItem(value);
        } else {
          activateItem(value);
        }
        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };
      self.$activeIndexes = function() {
        if (self.$options.allowMultiple) {
          return self.$targets.$active;
        }
        return self.$targets.$active.length === 1 ? self.$targets.$active[0] : -1;
      };
      function fixActiveItemIndexes(index) {
        var activeIndexes = self.$targets.$active;
        for (var i = 0; i < activeIndexes.length; i++) {
          if (index < activeIndexes[i]) {
            activeIndexes[i] = activeIndexes[i] - 1;
          }
          if (activeIndexes[i] === self.$targets.length) {
            activeIndexes[i] = self.$targets.length - 1;
          }
        }
      }
      function isActive(value) {
        var activeItems = self.$targets.$active;
        return activeItems.indexOf(value) !== -1;
      }
      function deactivateItem(value) {
        var index = self.$targets.$active.indexOf(value);
        if (index !== -1) {
          self.$targets.$active.splice(index, 1);
        }
      }
      function activateItem(value) {
        if (!self.$options.allowMultiple) {
          self.$targets.$active.splice(0, 1);
        }
        if (self.$targets.$active.indexOf(value) === -1) {
          self.$targets.$active.push(value);
        }
      }
    };
    this.$get = function() {
      var $collapse = {};
      $collapse.defaults = defaults;
      $collapse.controller = controller;
      return $collapse;
    };
  }).directive('bsCollapse', [ '$window', '$animate', '$collapse', function($window, $animate, $collapse) {
    return {
      require: [ '?ngModel', 'bsCollapse' ],
      controller: [ '$scope', '$element', '$attrs', $collapse.controller ],
      link: function postLink(scope, element, attrs, controllers) {
        var ngModelCtrl = controllers[0];
        var bsCollapseCtrl = controllers[1];
        if (ngModelCtrl) {
          bsCollapseCtrl.$viewChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(bsCollapseCtrl.$activeIndexes());
          });
          ngModelCtrl.$formatters.push(function(modelValue) {
            if (angular.isArray(modelValue)) {
              bsCollapseCtrl.$setActive(modelValue);
            } else {
              var activeIndexes = bsCollapseCtrl.$activeIndexes();
              if (angular.isArray(activeIndexes)) {
                if (activeIndexes.indexOf(modelValue * 1) === -1) {
                  bsCollapseCtrl.$setActive(modelValue * 1);
                }
              } else if (activeIndexes !== modelValue * 1) {
                bsCollapseCtrl.$setActive(modelValue * 1);
              }
            }
            return modelValue;
          });
        }
      }
    };
  } ]).directive('bsCollapseToggle', function() {
    return {
      require: [ '^?ngModel', '^bsCollapse' ],
      link: function postLink(scope, element, attrs, controllers) {
        var bsCollapseCtrl = controllers[1];
        element.attr('data-toggle', 'collapse');
        bsCollapseCtrl.$registerToggle(element);
        scope.$on('$destroy', function() {
          bsCollapseCtrl.$unregisterToggle(element);
        });
        element.on('click', function() {
          if (!attrs.disabled) {
            var index = attrs.bsCollapseToggle && attrs.bsCollapseToggle !== 'bs-collapse-toggle' ? attrs.bsCollapseToggle : bsCollapseCtrl.$toggles.indexOf(element);
            bsCollapseCtrl.$setActive(index * 1);
            scope.$apply();
          }
        });
      }
    };
  }).directive('bsCollapseTarget', [ '$animate', function($animate) {
    return {
      require: [ '^?ngModel', '^bsCollapse' ],
      link: function postLink(scope, element, attrs, controllers) {
        var bsCollapseCtrl = controllers[1];
        element.addClass('collapse');
        if (bsCollapseCtrl.$options.animation) {
          element.addClass(bsCollapseCtrl.$options.animation);
        }
        bsCollapseCtrl.$registerTarget(element);
        scope.$on('$destroy', function() {
          bsCollapseCtrl.$unregisterTarget(element);
        });
        function render() {
          var index = bsCollapseCtrl.$targets.indexOf(element);
          var active = bsCollapseCtrl.$activeIndexes();
          var action = 'removeClass';
          if (angular.isArray(active)) {
            if (active.indexOf(index) !== -1) {
              action = 'addClass';
            }
          } else if (index === active) {
            action = 'addClass';
          }
          $animate[action](element, bsCollapseCtrl.$options.activeClass);
        }
        bsCollapseCtrl.$viewChangeListeners.push(function() {
          render();
        });
        render();
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.aside', [ 'mgcrea.ngStrap.modal' ]).provider('$aside', function() {
    var defaults = this.defaults = {
      animation: 'am-fade-and-slide-right',
      prefixClass: 'aside',
      prefixEvent: 'aside',
      placement: 'right',
      templateUrl: 'aside/aside.tpl.html',
      contentTemplate: false,
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true
    };
    this.$get = [ '$modal', function($modal) {
      function AsideFactory(config) {
        var $aside = {};
        var options = angular.extend({}, defaults, config);
        $aside = $modal(options);
        return $aside;
      }
      return AsideFactory;
    } ];
  }).directive('bsAside', [ '$window', '$sce', '$aside', function($window, $sce, $aside) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        var options = {
          scope: scope,
          element: element,
          show: false
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'backdrop', 'keyboard', 'html', 'container' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        angular.forEach([ 'title', 'content' ], function(key) {
          if (attr[key]) {
            attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          }
        });
        if (attr.bsAside) {
          scope.$watch(attr.bsAside, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);
        }
        var aside = $aside(options);
        element.on(attr.trigger || 'click', aside.toggle);
        scope.$on('$destroy', function() {
          if (aside) aside.destroy();
          options = null;
          aside = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.alert', [ 'mgcrea.ngStrap.modal' ]).provider('$alert', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'alert',
      prefixEvent: 'alert',
      placement: null,
      templateUrl: 'alert/alert.tpl.html',
      container: false,
      element: null,
      backdrop: false,
      keyboard: true,
      show: true,
      duration: false,
      type: false,
      dismissable: true
    };
    this.$get = [ '$modal', '$timeout', function($modal, $timeout) {
      function AlertFactory(config) {
        var $alert = {};
        var options = angular.extend({}, defaults, config);
        $alert = $modal(options);
        $alert.$scope.dismissable = !!options.dismissable;
        if (options.type) {
          $alert.$scope.type = options.type;
        }
        var show = $alert.show;
        if (options.duration) {
          $alert.show = function() {
            show();
            $timeout(function() {
              $alert.hide();
            }, options.duration * 1e3);
          };
        }
        return $alert;
      }
      return AlertFactory;
    } ];
  }).directive('bsAlert', [ '$window', '$sce', '$alert', function($window, $sce, $alert) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        var options = {
          scope: scope,
          element: element,
          show: false
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'keyboard', 'html', 'container', 'animation', 'duration', 'dismissable' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'keyboard', 'html', 'container', 'dismissable' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        if (!scope.hasOwnProperty('title')) {
          scope.title = '';
        }
        angular.forEach([ 'title', 'content', 'type' ], function(key) {
          if (attr[key]) {
            attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          }
        });
        if (attr.bsAlert) {
          scope.$watch(attr.bsAlert, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);
        }
        var alert = $alert(options);
        element.on(attr.trigger || 'click', alert.toggle);
        scope.$on('$destroy', function() {
          if (alert) alert.destroy();
          options = null;
          alert = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.affix', [ 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.helpers.debounce' ]).provider('$affix', function() {
    var defaults = this.defaults = {
      offsetTop: 'auto',
      inlineStyles: true,
      setWidth: true
    };
    this.$get = [ '$window', 'debounce', 'dimensions', function($window, debounce, dimensions) {
      var bodyEl = angular.element($window.document.body);
      var windowEl = angular.element($window);
      function AffixFactory(element, config) {
        var $affix = {};
        var options = angular.extend({}, defaults, config);
        var targetEl = options.target;
        var reset = 'affix affix-top affix-bottom';
        var setWidth = false;
        var initialAffixTop = 0;
        var initialOffsetTop = 0;
        var offsetTop = 0;
        var offsetBottom = 0;
        var affixed = null;
        var unpin = null;
        var parent = element.parent();
        if (options.offsetParent) {
          if (options.offsetParent.match(/^\d+$/)) {
            for (var i = 0; i < options.offsetParent * 1 - 1; i++) {
              parent = parent.parent();
            }
          } else {
            parent = angular.element(options.offsetParent);
          }
        }
        $affix.init = function() {
          this.$parseOffsets();
          initialOffsetTop = dimensions.offset(element[0]).top + initialAffixTop;
          setWidth = options.setWidth && !element[0].style.width;
          targetEl.on('scroll', this.checkPosition);
          targetEl.on('click', this.checkPositionWithEventLoop);
          windowEl.on('resize', this.$debouncedOnResize);
          this.checkPosition();
          this.checkPositionWithEventLoop();
        };
        $affix.destroy = function() {
          targetEl.off('scroll', this.checkPosition);
          targetEl.off('click', this.checkPositionWithEventLoop);
          windowEl.off('resize', this.$debouncedOnResize);
        };
        $affix.checkPositionWithEventLoop = function() {
          setTimeout($affix.checkPosition, 1);
        };
        $affix.checkPosition = function() {
          var scrollTop = getScrollTop();
          var position = dimensions.offset(element[0]);
          var elementHeight = dimensions.height(element[0]);
          var affix = getRequiredAffixClass(unpin, position, elementHeight);
          if (affixed === affix) return;
          affixed = affix;
          if (affix === 'top') {
            unpin = null;
            if (setWidth) {
              element.css('width', '');
            }
            if (options.inlineStyles) {
              element.css('position', options.offsetParent ? '' : 'relative');
              element.css('top', '');
            }
          } else if (affix === 'bottom') {
            if (options.offsetUnpin) {
              unpin = -(options.offsetUnpin * 1);
            } else {
              unpin = position.top - scrollTop;
            }
            if (setWidth) {
              element.css('width', '');
            }
            if (options.inlineStyles) {
              element.css('position', options.offsetParent ? '' : 'relative');
              element.css('top', options.offsetParent ? '' : bodyEl[0].offsetHeight - offsetBottom - elementHeight - initialOffsetTop + 'px');
            }
          } else {
            unpin = null;
            if (setWidth) {
              element.css('width', element[0].offsetWidth + 'px');
            }
            if (options.inlineStyles) {
              element.css('position', 'fixed');
              element.css('top', initialAffixTop + 'px');
            }
          }
          element.removeClass(reset).addClass('affix' + (affix !== 'middle' ? '-' + affix : ''));
        };
        $affix.$onResize = function() {
          $affix.$parseOffsets();
          $affix.checkPosition();
        };
        $affix.$debouncedOnResize = debounce($affix.$onResize, 50);
        $affix.$parseOffsets = function() {
          var initialPosition = element[0].style.position;
          var initialTop = element[0].style.top;
          if (options.inlineStyles) {
            element.css('position', options.offsetParent ? '' : 'relative');
            element.css('top', '');
          }
          if (options.offsetTop) {
            if (options.offsetTop === 'auto') {
              options.offsetTop = '+0';
            }
            if (options.offsetTop.match(/^[-+]\d+$/)) {
              initialAffixTop = -options.offsetTop * 1;
              if (options.offsetParent) {
                offsetTop = dimensions.offset(parent[0]).top + options.offsetTop * 1;
              } else {
                offsetTop = dimensions.offset(element[0]).top - dimensions.css(element[0], 'marginTop', true) + options.offsetTop * 1;
              }
            } else {
              offsetTop = options.offsetTop * 1;
            }
          }
          if (options.offsetBottom) {
            if (options.offsetParent && options.offsetBottom.match(/^[-+]\d+$/)) {
              offsetBottom = getScrollHeight() - (dimensions.offset(parent[0]).top + dimensions.height(parent[0])) + options.offsetBottom * 1 + 1;
            } else {
              offsetBottom = options.offsetBottom * 1;
            }
          }
          if (options.inlineStyles) {
            element.css('position', initialPosition);
            element.css('top', initialTop);
          }
        };
        function getRequiredAffixClass(_unpin, position, elementHeight) {
          var scrollTop = getScrollTop();
          var scrollHeight = getScrollHeight();
          if (scrollTop <= offsetTop) {
            return 'top';
          } else if (_unpin !== null) {
            return scrollTop + _unpin <= position.top ? 'middle' : 'bottom';
          } else if (offsetBottom !== null && position.top + elementHeight + initialAffixTop >= scrollHeight - offsetBottom) {
            return 'bottom';
          }
          return 'middle';
        }
        function getScrollTop() {
          return targetEl[0] === $window ? $window.pageYOffset : targetEl[0].scrollTop;
        }
        function getScrollHeight() {
          return targetEl[0] === $window ? $window.document.body.scrollHeight : targetEl[0].scrollHeight;
        }
        $affix.init();
        return $affix;
      }
      return AffixFactory;
    } ];
  }).directive('bsAffix', [ '$affix', '$window', '$timeout', function($affix, $window, $timeout) {
    return {
      restrict: 'EAC',
      require: '^?bsAffixTarget',
      link: function postLink(scope, element, attr, affixTarget) {
        var options = {
          scope: scope,
          target: affixTarget ? affixTarget.$element : angular.element($window)
        };
        angular.forEach([ 'offsetTop', 'offsetBottom', 'offsetParent', 'offsetUnpin', 'inlineStyles', 'setWidth' ], function(key) {
          if (angular.isDefined(attr[key])) {
            var option = attr[key];
            if (/true/i.test(option)) option = true;
            if (/false/i.test(option)) option = false;
            options[key] = option;
          }
        });
        var affix;
        $timeout(function() {
          affix = $affix(element, options);
        });
        scope.$on('$destroy', function() {
          if (affix) affix.destroy();
          options = null;
          affix = null;
        });
      }
    };
  } ]).directive('bsAffixTarget', function() {
    return {
      controller: [ '$element', function($element) {
        this.$element = $element;
      } ]
    };
  });
  angular.module('mgcrea.ngStrap', [ 'mgcrea.ngStrap.modal', 'mgcrea.ngStrap.aside', 'mgcrea.ngStrap.alert', 'mgcrea.ngStrap.button', 'mgcrea.ngStrap.select', 'mgcrea.ngStrap.datepicker', 'mgcrea.ngStrap.timepicker', 'mgcrea.ngStrap.navbar', 'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.popover', 'mgcrea.ngStrap.dropdown', 'mgcrea.ngStrap.typeahead', 'mgcrea.ngStrap.scrollspy', 'mgcrea.ngStrap.affix', 'mgcrea.ngStrap.tab', 'mgcrea.ngStrap.collapse' ]);
})(window, document);

//  Source: node_modules\angular-strap\dist\angular-strap.tpl.js
/**
 * angular-strap
 * @version v2.3.12 - 2017-01-26
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
  'use strict';
  angular.module('mgcrea.ngStrap.alert').run([ '$templateCache', function($templateCache) {
    $templateCache.put('alert/alert.tpl.html', '<div class="alert" ng-class="[type ? \'alert-\' + type : null]"><button type="button" class="close" ng-if="dismissable" ng-click="$hide()">&times;</button> <span ng-if="title"><strong ng-bind="title"></strong>&nbsp;<span ng-bind-html="content"></span> </span><span ng-if="!title" ng-bind-html="content"></span></div>');
  } ]);
  angular.module('mgcrea.ngStrap.aside').run([ '$templateCache', function($templateCache) {
    $templateCache.put('aside/aside.tpl.html', '<div class="aside" tabindex="-1" role="dialog"><div class="aside-dialog"><div class="aside-content"><div class="aside-header" ng-show="title"><button type="button" class="close" ng-click="$hide()">&times;</button><h4 class="aside-title" ng-bind="title"></h4></div><div class="aside-body" ng-bind="content"></div><div class="aside-footer"><button type="button" class="btn btn-default" ng-click="$hide()">Close</button></div></div></div></div>');
  } ]);
  angular.module('mgcrea.ngStrap.datepicker').run([ '$templateCache', function($templateCache) {
    $templateCache.put('datepicker/datepicker.tpl.html', '<div class="dropdown-menu datepicker" ng-class="\'datepicker-mode-\' + $mode" style="max-width: 320px"><table style="table-layout: fixed; height: 100%; width: 100%"><thead><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$selectPane(-1)"><i class="{{$iconLeft}}"></i></button></th><th colspan="{{ rows[0].length - 2 }}"><button tabindex="-1" type="button" class="btn btn-default btn-block text-strong" ng-click="$toggleMode()"><strong style="text-transform: capitalize" ng-bind="title"></strong></button></th><th><button tabindex="-1" type="button" class="btn btn-default pull-right" ng-click="$selectPane(+1)"><i class="{{$iconRight}}"></i></button></th></tr><tr ng-if="showLabels" ng-bind-html="labels"></tr></thead><tbody><tr ng-repeat="(i, row) in rows" height="{{ 100 / rows.length }}%"><td class="text-center" ng-repeat="(j, el) in row"><button tabindex="-1" type="button" class="btn btn-default" style="width: 100%" ng-class="{\'btn-primary\': el.selected, \'btn-info btn-today\': el.isToday && !el.selected}" ng-click="$select(el.date, el.disabled)" ng-disabled="el.disabled"><span ng-class="{\'text-muted\': el.muted}" ng-bind="el.label"></span></button></td></tr></tbody><tfoot><tr><td colspan="{{ rows[0].length }}"><div class="btn-group btn-group-justified" role="group"><div class="btn-group" role="group" ng-if="$hasToday"><button type="button" class="btn btn-default today" ng-click="$setToday()" ng-disabled="isTodayDisabled"><strong style="text-transform: capitalize">Today</strong></button></div><div class="btn-group" role="group" ng-if="$hasClear"><button type="button" class="btn btn-default clear" ng-click="$clear()"><strong style="text-transform: capitalize">Clear</strong></button></div></div></td></tr></tfoot></table></div>');
  } ]);
  angular.module('mgcrea.ngStrap.dropdown').run([ '$templateCache', function($templateCache) {
    $templateCache.put('dropdown/dropdown.tpl.html', '<ul tabindex="-1" class="dropdown-menu" role="menu" ng-show="content && content.length"><li role="presentation" ng-class="{divider: item.divider, active: item.active}" ng-repeat="item in content"><a role="menuitem" tabindex="-1" ng-href="{{item.href}}" ng-if="!item.divider && item.href" target="{{item.target || \'\'}}" ng-bind="item.text"></a> <a role="menuitem" tabindex="-1" href="javascript:void(0)" ng-if="!item.divider && item.click" ng-click="$eval(item.click);$hide()" ng-bind="item.text"></a></li></ul>');
  } ]);
  angular.module('mgcrea.ngStrap.modal').run([ '$templateCache', function($templateCache) {
    $templateCache.put('modal/modal.tpl.html', '<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" ng-show="title"><button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" ng-bind="title"></h4></div><div class="modal-body" ng-bind="content"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="$hide()">Close</button></div></div></div></div>');
  } ]);
  angular.module('mgcrea.ngStrap.popover').run([ '$templateCache', function($templateCache) {
    $templateCache.put('popover/popover.tpl.html', '<div class="popover" tabindex="-1"><div class="arrow"></div><h3 class="popover-title" ng-bind="title" ng-show="title"></h3><div class="popover-content" ng-bind="content"></div></div>');
  } ]);
  angular.module('mgcrea.ngStrap.select').run([ '$templateCache', function($templateCache) {
    $templateCache.put('select/select.tpl.html', '<ul tabindex="-1" class="select dropdown-menu" ng-show="$isVisible()" role="select"><li ng-if="$showAllNoneButtons"><div class="btn-group" style="margin-bottom: 5px; margin-left: 5px"><button type="button" class="btn btn-default btn-xs" ng-click="$selectAll()">{{$allText}}</button> <button type="button" class="btn btn-default btn-xs" ng-click="$selectNone()">{{$noneText}}</button></div></li><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $isActive($index)}"><a style="cursor: default" role="menuitem" tabindex="-1" ng-click="$select($index, $event)"><i class="{{$iconCheckmark}} pull-right" ng-if="$isMultiple && $isActive($index)"></i> <span ng-bind="match.label"></span></a></li></ul>');
  } ]);
  angular.module('mgcrea.ngStrap.tab').run([ '$templateCache', function($templateCache) {
    $templateCache.put('tab/tab.tpl.html', '<ul class="nav" ng-class="$navClass" role="tablist"><li role="presentation" ng-repeat="$pane in $panes track by $index" ng-class="[ $isActive($pane, $index) ? $activeClass : \'\', $pane.disabled ? \'disabled\' : \'\' ]"><a role="tab" data-toggle="tab" ng-click="!$pane.disabled && $setActive($pane.name || $index)" data-index="{{ $index }}" ng-bind-html="$pane.title" aria-controls="$pane.title" href=""></a></li></ul><div ng-transclude class="tab-content"></div>');
  } ]);
  angular.module('mgcrea.ngStrap.timepicker').run([ '$templateCache', function($templateCache) {
    $templateCache.put('timepicker/timepicker.tpl.html', '<div class="dropdown-menu timepicker" style="min-width: 0px;width: auto"><table height="100%"><thead><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 0)"><i class="{{ $iconUp }}"></i></button></th><th>&nbsp;</th><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 1)"><i class="{{ $iconUp }}"></i></button></th><th ng-if="showSeconds">&nbsp;</th><th ng-if="showSeconds"><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 2)"><i class="{{ $iconUp }}"></i></button></th></tr></thead><tbody><tr ng-repeat="(i, row) in rows"><td class="text-center"><button tabindex="-1" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[0].selected}" ng-click="$select(row[0].date, 0)" ng-disabled="row[0].disabled"><span ng-class="{\'text-muted\': row[0].muted}" ng-bind="row[0].label"></span></button></td><td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td><td class="text-center"><button tabindex="-1" ng-if="row[1].date" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[1].selected}" ng-click="$select(row[1].date, 1)" ng-disabled="row[1].disabled"><span ng-class="{\'text-muted\': row[1].muted}" ng-bind="row[1].label"></span></button></td><td ng-if="showSeconds"><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td><td ng-if="showSeconds" class="text-center"><button tabindex="-1" ng-if="row[2].date" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[2].selected}" ng-click="$select(row[2].date, 2)" ng-disabled="row[2].disabled"><span ng-class="{\'text-muted\': row[2].muted}" ng-bind="row[2].label"></span></button></td><td ng-if="showAM">&nbsp;</td><td ng-if="showAM"><button tabindex="-1" ng-show="i == midIndex - !isAM * 1" style="width: 100%" type="button" ng-class="{\'btn-primary\': !!isAM}" class="btn btn-default" ng-click="$switchMeridian()" ng-disabled="el.disabled">AM</button> <button tabindex="-1" ng-show="i == midIndex + 1 - !isAM * 1" style="width: 100%" type="button" ng-class="{\'btn-primary\': !isAM}" class="btn btn-default" ng-click="$switchMeridian()" ng-disabled="el.disabled">PM</button></td></tr></tbody><tfoot><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 0)"><i class="{{ $iconDown }}"></i></button></th><th>&nbsp;</th><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 1)"><i class="{{ $iconDown }}"></i></button></th><th ng-if="showSeconds">&nbsp;</th><th ng-if="showSeconds"><button ng-if="showSeconds" tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 2)"><i class="{{ $iconDown }}"></i></button></th></tr></tfoot></table></div>');
  } ]);
  angular.module('mgcrea.ngStrap.tooltip').run([ '$templateCache', function($templateCache) {
    $templateCache.put('tooltip/tooltip.tpl.html', '<div class="tooltip in" ng-show="title"><div class="tooltip-arrow"></div><div class="tooltip-inner" ng-bind="title"></div></div>');
  } ]);
  angular.module('mgcrea.ngStrap.typeahead').run([ '$templateCache', function($templateCache) {
    $templateCache.put('typeahead/typeahead.tpl.html', '<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="$isVisible()" role="select"><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $index == $activeIndex}"><a role="menuitem" tabindex="-1" ng-click="$select($index, $event)" ng-bind="match.label"></a></li></ul>');
  } ]);
})(window, document);

//  Source: ui\lib\jquery\pnotify\js\scripts.js
//  Source: node_modules\pnotify\src\pnotify.js
/*
PNotify 3.2.0 sciactive.com/pnotify/
(C) 2015 Hunter Perrin; Google, Inc.
license Apache-2.0
*/
/*
 * ====== PNotify ======
 *
 * http://sciactive.com/pnotify/
 *
 * Copyright 2009-2015 Hunter Perrin
 * Copyright 2015 Google, Inc.
 *
 * Licensed under Apache License, Version 2.0.
 * 	http://www.apache.org/licenses/LICENSE-2.0
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as a module.
    define('pnotify', ['jquery'], function($){
      return factory($, root);
    });
  } else if (typeof exports === 'object' && typeof module !== 'undefined') {
    // CommonJS
    module.exports = factory(require('jquery'), global || root);
  } else {
    // Browser globals
    root.PNotify = factory(root.jQuery, root);
  }
}(typeof window !== "undefined" ? window : this, function($, root){
var init = function(root){
  var default_stack = {
    dir1: "down",
    dir2: "left",
    push: "bottom",
    spacing1: 36,
    spacing2: 36,
    context: $("body"),
    modal: false
  };
  var posTimer, // Position all timer.
    body,
    jwindow = $(root);
  // Set global variables.
  var do_when_ready = function(){
    body = $("body");
    PNotify.prototype.options.stack.context = body;
    jwindow = $(root);
    // Reposition the notices when the window resizes.
    jwindow.bind('resize', function(){
      if (posTimer) {
        clearTimeout(posTimer);
      }
      posTimer = setTimeout(function(){
        PNotify.positionAll(true);
      }, 10);
    });
  };
  var createStackOverlay = function(stack) {
    var overlay = $("<div />", {"class": "ui-pnotify-modal-overlay"});
    overlay.prependTo(stack.context);
    if (stack.overlay_close) {
      // Close the notices on overlay click.
      overlay.click(function(){
        PNotify.removeStack(stack);
      });
    }
    return overlay;
  };
  var PNotify = function(options){
    // === Class Variables ===
    this.state = "initializing"; // The state can be "initializing", "opening", "open", "closing", and "closed".
    this.timer = null; // Auto close timer.
    this.animTimer = null; // Animation timer.
    this.styles = null;
    this.elem = null;
    this.container = null;
    this.title_container = null;
    this.text_container = null;
    this.animating = false; // Stores what is currently being animated (in or out).
    this.timerHide = false; // Stores whether the notice was hidden by a timer.

    this.parseOptions(options);
    this.init();
  };
  $.extend(PNotify.prototype, {
    // The current version of PNotify.
    version: "3.2.0",

    // === Options ===

    // Options defaults.
    options: {
      // The notice's title.
      title: false,
      // Whether to escape the content of the title. (Not allow HTML.)
      title_escape: false,
      // The notice's text.
      text: false,
      // Whether to escape the content of the text. (Not allow HTML.)
      text_escape: false,
      // What styling classes to use. (Can be either "brighttheme", "bootstrap3", or "fontawesome".)
      styling: "brighttheme",
      // Additional classes to be added to the notice. (For custom styling.)
      addclass: "",
      // Class to be added to the notice for corner styling.
      cornerclass: "",
      // Display the notice when it is created.
      auto_display: true,
      // Width of the notice.
      width: "300px",
      // Minimum height of the notice. It will expand to fit content.
      min_height: "16px",
      // Type of the notice. "notice", "info", "success", or "error".
      type: "notice",
      // Set icon to true to use the default icon for the selected
      // style/type, false for no icon, or a string for your own icon class.
      icon: true,
      // The animation to use when displaying and hiding the notice. "none"
      // and "fade" are supported through CSS. Others are supported
      // through the Animate module and Animate.css.
      animation: "fade",
      // Speed at which the notice animates in and out. "slow", "normal",
      // or "fast". Respectively, 400ms, 250ms, 100ms.
      animate_speed: "normal",
      // Display a drop shadow.
      shadow: true,
      // After a delay, remove the notice.
      hide: true,
      // Delay in milliseconds before the notice is removed.
      delay: 8000,
      // Reset the hide timer if the mouse moves over the notice.
      mouse_reset: true,
      // Remove the notice's elements from the DOM after it is removed.
      remove: true,
      // Change new lines to br tags.
      insert_brs: true,
      // Whether to remove the notice from the global array when it is closed.
      destroy: true,
      // The stack on which the notices will be placed. Also controls the
      // direction the notices stack.
      stack: default_stack
    },

    // === Modules ===

    // This object holds all the PNotify modules. They are used to provide
    // additional functionality.
    modules: {},
    // This runs an event on all the modules.
    runModules: function(event, arg){
      var curArg;
      for (var module in this.modules) {
        curArg = ((typeof arg === "object" && module in arg) ? arg[module] : arg);
        if (typeof this.modules[module][event] === 'function') {
          this.modules[module].notice = this;
          this.modules[module].options = typeof this.options[module] === 'object' ? this.options[module] : {};
          this.modules[module][event](this, typeof this.options[module] === 'object' ? this.options[module] : {}, curArg);
        }
      }
    },

    // === Events ===

    init: function(){
      var that = this;

      // First and foremost, we don't want our module objects all referencing the prototype.
      this.modules = {};
      $.extend(true, this.modules, PNotify.prototype.modules);

      // Get our styling object.
      if (typeof this.options.styling === "object") {
        this.styles = this.options.styling;
      } else {
        this.styles = PNotify.styling[this.options.styling];
      }

      // Create our widget.
      // Stop animation, reset the removal timer when the user mouses over.
      this.elem = $("<div />", {
        "class": "ui-pnotify "+this.options.addclass,
        "css": {"display": "none"},
        "aria-live": "assertive",
        "aria-role": "alertdialog",
        "mouseenter": function(e){
          if (that.options.mouse_reset && that.animating === "out") {
            if (!that.timerHide) {
              return;
            }
            that.cancelRemove();
          }
          // Stop the close timer.
          if (that.options.hide && that.options.mouse_reset) {
            that.cancelRemove();
          }
        },
        "mouseleave": function(e){
          // Start the close timer.
          if (that.options.hide && that.options.mouse_reset && that.animating !== "out") {
            that.queueRemove();
          }
          PNotify.positionAll();
        }
      });
      // Maybe we need to fade in/out.
      if (this.options.animation === "fade") {
        this.elem.addClass("ui-pnotify-fade-"+this.options.animate_speed);
      }
      // Create a container for the notice contents.
      this.container = $("<div />", {
        "class": this.styles.container+" ui-pnotify-container "+(this.options.type === "error" ? this.styles.error : (this.options.type === "info" ? this.styles.info : (this.options.type === "success" ? this.styles.success : this.styles.notice))),
        "role": "alert"
      }).appendTo(this.elem);
      if (this.options.cornerclass !== "") {
        this.container.removeClass("ui-corner-all").addClass(this.options.cornerclass);
      }
      // Create a drop shadow.
      if (this.options.shadow) {
        this.container.addClass("ui-pnotify-shadow");
      }


      // Add the appropriate icon.
      if (this.options.icon !== false) {
        $("<div />", {"class": "ui-pnotify-icon"})
        .append($("<span />", {"class": this.options.icon === true ? (this.options.type === "error" ? this.styles.error_icon : (this.options.type === "info" ? this.styles.info_icon : (this.options.type === "success" ? this.styles.success_icon : this.styles.notice_icon))) : this.options.icon}))
        .prependTo(this.container);
      }

      // Add a title.
      this.title_container = $("<h4 />", {
        "class": "ui-pnotify-title"
      })
      .appendTo(this.container);
      if (this.options.title === false) {
        this.title_container.hide();
      } else if (this.options.title_escape) {
        this.title_container.text(this.options.title);
      } else {
        this.title_container.html(this.options.title);
      }

      // Add text.
      this.text_container = $("<div />", {
        "class": "ui-pnotify-text",
        "aria-role": "alert"
      })
      .appendTo(this.container);
      if (this.options.text === false) {
        this.text_container.hide();
      } else if (this.options.text_escape) {
        this.text_container.text(this.options.text);
      } else {
        this.text_container.html(this.options.insert_brs ? String(this.options.text).replace(/\n/g, "<br />") : this.options.text);
      }

      // Set width and min height.
      if (typeof this.options.width === "string") {
        this.elem.css("width", this.options.width);
      }
      if (typeof this.options.min_height === "string") {
        this.container.css("min-height", this.options.min_height);
      }


      // Add the notice to the notice array.
      if (this.options.stack.push === "top") {
        PNotify.notices = $.merge([this], PNotify.notices);
      } else {
        PNotify.notices = $.merge(PNotify.notices, [this]);
      }
      // Now position all the notices if they are to push to the top.
      if (this.options.stack.push === "top") {
        this.queuePosition(false, 1);
      }


      // Mark the stack so it won't animate the new notice.
      this.options.stack.animation = false;

      // Run the modules.
      this.runModules('init');

      // We're now initialized, but haven't been opened yet.
      this.state = "closed";

      // Display the notice.
      if (this.options.auto_display) {
        this.open();
      }
      return this;
    },

    // This function is for updating the notice.
    update: function(options){
      // Save old options.
      var oldOpts = this.options;
      // Then update to the new options.
      this.parseOptions(oldOpts, options);
      // Maybe we need to fade in/out.
      this.elem.removeClass("ui-pnotify-fade-slow ui-pnotify-fade-normal ui-pnotify-fade-fast");
      if (this.options.animation === "fade") {
        this.elem.addClass("ui-pnotify-fade-"+this.options.animate_speed);
      }
      // Update the corner class.
      if (this.options.cornerclass !== oldOpts.cornerclass) {
        this.container.removeClass("ui-corner-all "+oldOpts.cornerclass).addClass(this.options.cornerclass);
      }
      // Update the shadow.
      if (this.options.shadow !== oldOpts.shadow) {
        if (this.options.shadow) {
          this.container.addClass("ui-pnotify-shadow");
        } else {
          this.container.removeClass("ui-pnotify-shadow");
        }
      }
      // Update the additional classes.
      if (this.options.addclass === false) {
        this.elem.removeClass(oldOpts.addclass);
      } else if (this.options.addclass !== oldOpts.addclass) {
        this.elem.removeClass(oldOpts.addclass).addClass(this.options.addclass);
      }
      // Update the title.
      if (this.options.title === false) {
        this.title_container.slideUp("fast");
      } else if (this.options.title !== oldOpts.title) {
        if (this.options.title_escape) {
          this.title_container.text(this.options.title);
        } else {
          this.title_container.html(this.options.title);
        }
        if (oldOpts.title === false) {
          this.title_container.slideDown(200);
        }
      }
      // Update the text.
      if (this.options.text === false) {
        this.text_container.slideUp("fast");
      } else if (this.options.text !== oldOpts.text) {
        if (this.options.text_escape) {
          this.text_container.text(this.options.text);
        } else {
          this.text_container.html(this.options.insert_brs ? String(this.options.text).replace(/\n/g, "<br />") : this.options.text);
        }
        if (oldOpts.text === false) {
          this.text_container.slideDown(200);
        }
      }
      // Change the notice type.
      if (this.options.type !== oldOpts.type) {
        this.container.removeClass(
          this.styles.error+" "+this.styles.notice+" "+this.styles.success+" "+this.styles.info
        ).addClass(this.options.type === "error" ?
          this.styles.error :
          (this.options.type === "info" ?
            this.styles.info :
            (this.options.type === "success" ?
              this.styles.success :
              this.styles.notice
            )
          )
        );
      }
      if (this.options.icon !== oldOpts.icon || (this.options.icon === true && this.options.type !== oldOpts.type)) {
        // Remove any old icon.
        this.container.find("div.ui-pnotify-icon").remove();
        if (this.options.icon !== false) {
          // Build the new icon.
          $("<div />", {"class": "ui-pnotify-icon"})
          .append($("<span />", {"class": this.options.icon === true ? (this.options.type === "error" ? this.styles.error_icon : (this.options.type === "info" ? this.styles.info_icon : (this.options.type === "success" ? this.styles.success_icon : this.styles.notice_icon))) : this.options.icon}))
          .prependTo(this.container);
        }
      }
      // Update the width.
      if (this.options.width !== oldOpts.width) {
        this.elem.animate({width: this.options.width});
      }
      // Update the minimum height.
      if (this.options.min_height !== oldOpts.min_height) {
        this.container.animate({minHeight: this.options.min_height});
      }
      // Update the timed hiding.
      if (!this.options.hide) {
        this.cancelRemove();
      } else if (!oldOpts.hide) {
        this.queueRemove();
      }
      this.queuePosition(true);

      // Run the modules.
      this.runModules('update', oldOpts);
      return this;
    },

    // Display the notice.
    open: function(){
      this.state = "opening";
      // Run the modules.
      this.runModules('beforeOpen');

      var that = this;
      // If the notice is not in the DOM, append it.
      if (!this.elem.parent().length) {
        this.elem.appendTo(this.options.stack.context ? this.options.stack.context : body);
      }
      // Try to put it in the right position.
      if (this.options.stack.push !== "top") {
        this.position(true);
      }
      this.animateIn(function(){
        that.queuePosition(true);

        // Now set it to hide.
        if (that.options.hide) {
          that.queueRemove();
        }

        that.state = "open";

        // Run the modules.
        that.runModules('afterOpen');
      });

      return this;
    },

    // Remove the notice.
    remove: function(timer_hide) {
      this.state = "closing";
      this.timerHide = !!timer_hide; // Make sure it's a boolean.
      // Run the modules.
      this.runModules('beforeClose');

      var that = this;
      if (this.timer) {
        root.clearTimeout(this.timer);
        this.timer = null;
      }
      this.animateOut(function(){
        that.state = "closed";
        // Run the modules.
        that.runModules('afterClose');
        that.queuePosition(true);
        // If we're supposed to remove the notice from the DOM, do it.
        if (that.options.remove) {
          that.elem.detach();
        }
        // Run the modules.
        that.runModules('beforeDestroy');
        // Remove object from PNotify.notices to prevent memory leak (issue #49)
        // unless destroy is off
        if (that.options.destroy) {
          if (PNotify.notices !== null) {
            var idx = $.inArray(that, PNotify.notices);
            if (idx !== -1) {
              PNotify.notices.splice(idx,1);
            }
          }
        }
        // Run the modules.
        that.runModules('afterDestroy');
      });

      return this;
    },

    // === Class Methods ===

    // Get the DOM element.
    get: function(){
      return this.elem;
    },

    // Put all the options in the right places.
    parseOptions: function(options, moreOptions){
      this.options = $.extend(true, {}, PNotify.prototype.options);
      // This is the only thing that *should* be copied by reference.
      this.options.stack = PNotify.prototype.options.stack;
      var optArray = [options, moreOptions], curOpts;
      for (var curIndex=0; curIndex < optArray.length; curIndex++) {
        curOpts = optArray[curIndex];
        if (typeof curOpts === "undefined") {
          break;
        }
        if (typeof curOpts !== 'object') {
          this.options.text = curOpts;
        } else {
          for (var option in curOpts) {
            if (this.modules[option]) {
              // Avoid overwriting module defaults.
              $.extend(true, this.options[option], curOpts[option]);
            } else {
              this.options[option] = curOpts[option];
            }
          }
        }
      }
    },

    // Animate the notice in.
    animateIn: function(callback){
      // Declare that the notice is animating in.
      this.animating = "in";
      var that = this;
      var finished = function(){
        if (that.animTimer) {
          clearTimeout(that.animTimer);
        }
        if (that.animating !== "in") {
          return;
        }
        if (that.elem.is(":visible")) {
          if (callback) {
            callback.call();
          }
          // Declare that the notice has completed animating.
          that.animating = false;
        } else {
          that.animTimer = setTimeout(finished, 40);
        }
      };

      if (this.options.animation === "fade") {
        this.elem.one('webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend', finished).addClass("ui-pnotify-in");
        this.elem.css("opacity"); // This line is necessary for some reason. Some notices don't fade without it.
        this.elem.addClass("ui-pnotify-fade-in");
        // Just in case the event doesn't fire, call it after 650 ms.
        this.animTimer = setTimeout(finished, 650);
      } else {
        this.elem.addClass("ui-pnotify-in");
        finished();
      }
    },

    // Animate the notice out.
    animateOut: function(callback){
      // Declare that the notice is animating out.
      this.animating = "out";
      var that = this;
      var finished = function(){
        if (that.animTimer) {
          clearTimeout(that.animTimer);
        }
        if (that.animating !== "out") {
          return;
        }
        if (that.elem.css("opacity") == "0" || !that.elem.is(":visible")) {
          that.elem.removeClass("ui-pnotify-in");
          if (that.options.stack.overlay) {
            // Go through the modal stack to see if any are left open.
            // TODO: Rewrite this cause it sucks.
            var stillOpen = false;
            $.each(PNotify.notices, function(i, notice){
              if (notice != that && notice.options.stack === that.options.stack && notice.state != "closed") {
                stillOpen = true;
              }
            });
            if (!stillOpen) {
              that.options.stack.overlay.hide();
            }
          }
          if (callback) {
            callback.call();
          }
          // Declare that the notice has completed animating.
          that.animating = false;
        } else {
          // In case this was called before the notice finished animating.
          that.animTimer = setTimeout(finished, 40);
        }
      };

      if (this.options.animation === "fade") {
        this.elem.one('webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend', finished).removeClass("ui-pnotify-fade-in");
        // Just in case the event doesn't fire, call it after 650 ms.
        this.animTimer = setTimeout(finished, 650);
      } else {
        this.elem.removeClass("ui-pnotify-in");
        finished();
      }
    },

    // Position the notice. dont_skip_hidden causes the notice to
    // position even if it's not visible.
    position: function(dontSkipHidden){
      // Get the notice's stack.
      var stack = this.options.stack,
        elem = this.elem;
      if (typeof stack.context === "undefined") {
        stack.context = body;
      }
      if (!stack) {
        return;
      }
      if (typeof stack.nextpos1 !== "number") {
        stack.nextpos1 = stack.firstpos1;
      }
      if (typeof stack.nextpos2 !== "number") {
        stack.nextpos2 = stack.firstpos2;
      }
      if (typeof stack.addpos2 !== "number") {
        stack.addpos2 = 0;
      }
      var hidden = !elem.hasClass("ui-pnotify-in");
      // Skip this notice if it's not shown.
      if (!hidden || dontSkipHidden) {
        if (stack.modal) {
          if (stack.overlay) {
            stack.overlay.show();
          } else {
            stack.overlay = createStackOverlay(stack);
          }
        }
        // Add animate class by default.
        elem.addClass("ui-pnotify-move");
        var curpos1, curpos2;
        // Calculate the current pos1 value.
        var csspos1;
        switch (stack.dir1) {
          case "down":
            csspos1 = "top";
            break;
          case "up":
            csspos1 = "bottom";
            break;
          case "left":
            csspos1 = "right";
            break;
          case "right":
            csspos1 = "left";
            break;
        }
        curpos1 = parseInt(elem.css(csspos1).replace(/(?:\..*|[^0-9.])/g, ''));
        if (isNaN(curpos1)) {
          curpos1 = 0;
        }
        // Remember the first pos1, so the first visible notice goes there.
        if (typeof stack.firstpos1 === "undefined" && !hidden) {
          stack.firstpos1 = curpos1;
          stack.nextpos1 = stack.firstpos1;
        }
        // Calculate the current pos2 value.
        var csspos2;
        switch (stack.dir2) {
          case "down":
            csspos2 = "top";
            break;
          case "up":
            csspos2 = "bottom";
            break;
          case "left":
            csspos2 = "right";
            break;
          case "right":
            csspos2 = "left";
            break;
        }
        curpos2 = parseInt(elem.css(csspos2).replace(/(?:\..*|[^0-9.])/g, ''));
        if (isNaN(curpos2)) {
          curpos2 = 0;
        }
        // Remember the first pos2, so the first visible notice goes there.
        if (typeof stack.firstpos2 === "undefined" && !hidden) {
          stack.firstpos2 = curpos2;
          stack.nextpos2 = stack.firstpos2;
        }
        // Check that it's not beyond the viewport edge.
        if (
            (stack.dir1 === "down" && stack.nextpos1 + elem.height() > (stack.context.is(body) ? jwindow.height() : stack.context.prop('scrollHeight')) ) ||
            (stack.dir1 === "up" && stack.nextpos1 + elem.height() > (stack.context.is(body) ? jwindow.height() : stack.context.prop('scrollHeight')) ) ||
            (stack.dir1 === "left" && stack.nextpos1 + elem.width() > (stack.context.is(body) ? jwindow.width() : stack.context.prop('scrollWidth')) ) ||
            (stack.dir1 === "right" && stack.nextpos1 + elem.width() > (stack.context.is(body) ? jwindow.width() : stack.context.prop('scrollWidth')) )
          ) {
          // If it is, it needs to go back to the first pos1, and over on pos2.
          stack.nextpos1 = stack.firstpos1;
          stack.nextpos2 += stack.addpos2 + (typeof stack.spacing2 === "undefined" ? 25 : stack.spacing2);
          stack.addpos2 = 0;
        }
        if (typeof stack.nextpos2 === "number") {
          if (!stack.animation) {
            elem.removeClass("ui-pnotify-move");
            elem.css(csspos2, stack.nextpos2+"px");
            elem.css(csspos2);
            elem.addClass("ui-pnotify-move");
          } else {
            elem.css(csspos2, stack.nextpos2+"px");
          }
        }
        // Keep track of the widest/tallest notice in the column/row, so we can push the next column/row.
        switch (stack.dir2) {
          case "down":
          case "up":
            if (elem.outerHeight(true) > stack.addpos2) {
              stack.addpos2 = elem.height();
            }
            break;
          case "left":
          case "right":
            if (elem.outerWidth(true) > stack.addpos2) {
              stack.addpos2 = elem.width();
            }
            break;
        }
        // Move the notice on dir1.
        if (typeof stack.nextpos1 === "number") {
          if (!stack.animation) {
            elem.removeClass("ui-pnotify-move");
            elem.css(csspos1, stack.nextpos1+"px");
            elem.css(csspos1);
            elem.addClass("ui-pnotify-move");
          } else {
            elem.css(csspos1, stack.nextpos1+"px");
          }
        }
        // Calculate the next dir1 position.
        switch (stack.dir1) {
          case "down":
          case "up":
            stack.nextpos1 += elem.height() + (typeof stack.spacing1 === "undefined" ? 25 : stack.spacing1);
            break;
          case "left":
          case "right":
            stack.nextpos1 += elem.width() + (typeof stack.spacing1 === "undefined" ? 25 : stack.spacing1);
            break;
        }
      }
      return this;
    },
    // Queue the position all function so it doesn't run repeatedly and
    // use up resources.
    queuePosition: function(animate, milliseconds){
      if (posTimer) {
        clearTimeout(posTimer);
      }
      if (!milliseconds) {
        milliseconds = 10;
      }
      posTimer = setTimeout(function(){
        PNotify.positionAll(animate);
      }, milliseconds);
      return this;
    },


    // Cancel any pending removal timer.
    cancelRemove: function(){
      if (this.timer) {
        root.clearTimeout(this.timer);
      }
      if (this.animTimer) {
        root.clearTimeout(this.animTimer);
      }
      if (this.state === "closing") {
        // If it's animating out, stop it.
        this.state = "open";
        this.animating = false;
        this.elem.addClass("ui-pnotify-in");
        if (this.options.animation === "fade") {
          this.elem.addClass("ui-pnotify-fade-in");
        }
      }
      return this;
    },
    // Queue a removal timer.
    queueRemove: function(){
      var that = this;
      // Cancel any current removal timer.
      this.cancelRemove();
      this.timer = root.setTimeout(function(){
        that.remove(true);
      }, (isNaN(this.options.delay) ? 0 : this.options.delay));
      return this;
    }
  });
  // These functions affect all notices.
  $.extend(PNotify, {
    // This holds all the notices.
    notices: [],
    reload: init,
    removeAll: function(){
      $.each(PNotify.notices, function(i, notice){
        if (notice.remove) {
          notice.remove(false);
        }
      });
    },
    removeStack: function(stack){
      $.each(PNotify.notices, function(i, notice){
        if (notice.remove && notice.options.stack === stack) {
          notice.remove(false);
        }
      });
    },
    positionAll: function(animate){
      // This timer is used for queueing this function so it doesn't run
      // repeatedly.
      if (posTimer) {
        clearTimeout(posTimer);
      }
      posTimer = null;
      // Reset the next position data.
      if (PNotify.notices && PNotify.notices.length) {
        $.each(PNotify.notices, function(i, notice){
          var s = notice.options.stack;
          if (!s) {
            return;
          }
          if (s.overlay) {
            s.overlay.hide();
          }
          s.nextpos1 = s.firstpos1;
          s.nextpos2 = s.firstpos2;
          s.addpos2 = 0;
          s.animation = animate;
        });
        $.each(PNotify.notices, function(i, notice){
          notice.position();
        });
      } else {
        var s = PNotify.prototype.options.stack;
        if (s) {
          delete s.nextpos1;
          delete s.nextpos2;
        }
      }
    },
    styling: {
      brighttheme: {
        // Bright Theme doesn't require any UI libraries.
        container: "brighttheme",
        notice: "brighttheme-notice",
        notice_icon: "brighttheme-icon-notice",
        info: "brighttheme-info",
        info_icon: "brighttheme-icon-info",
        success: "brighttheme-success",
        success_icon: "brighttheme-icon-success",
        error: "brighttheme-error",
        error_icon: "brighttheme-icon-error"
      },
      bootstrap3: {
        container: "alert",
        notice: "alert-warning",
        notice_icon: "glyphicon glyphicon-exclamation-sign",
        info: "alert-info",
        info_icon: "glyphicon glyphicon-info-sign",
        success: "alert-success",
        success_icon: "glyphicon glyphicon-ok-sign",
        error: "alert-danger",
        error_icon: "glyphicon glyphicon-warning-sign"
      }
    }
  });
  /*
   * uses icons from http://fontawesome.io/
   * version 4.0.3
   */
  PNotify.styling.fontawesome = $.extend({}, PNotify.styling.bootstrap3);
  $.extend(PNotify.styling.fontawesome, {
    notice_icon: "fa fa-exclamation-circle",
    info_icon: "fa fa-info",
    success_icon: "fa fa-check",
    error_icon: "fa fa-warning"
  });

  if (root.document.body) {
    do_when_ready();
  } else {
    $(do_when_ready);
  }
  return PNotify;
};
return init(root);
}));

//  Source: node_modules\pnotify\src\pnotify.buttons.js
// Buttons
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as a module.
    define('pnotify.buttons', ['jquery', 'pnotify'], factory);
  } else if (typeof exports === 'object' && typeof module !== 'undefined') {
    // CommonJS
    module.exports = factory(require('jquery'), require('./pnotify'));
  } else {
    // Browser globals
    factory(root.jQuery, root.PNotify);
  }
}(typeof window !== "undefined" ? window : this, function($, PNotify){
  PNotify.prototype.options.buttons = {
    // Provide a button for the user to manually close the notice.
    closer: true,
    // Only show the closer button on hover.
    closer_hover: true,
    // Provide a button for the user to manually stick the notice.
    sticker: true,
    // Only show the sticker button on hover.
    sticker_hover: true,
    // Show the buttons even when the nonblock module is in use.
    show_on_nonblock: false,
    // The various displayed text, helps facilitating internationalization.
    labels: {
      close: "Close",
      stick: "Stick",
      unstick: "Unstick"
    },
    // The classes to use for button icons. Leave them null to use the classes from the styling you're using.
    classes: {
      closer: null,
      pin_up: null,
      pin_down: null
    }
  };
  PNotify.prototype.modules.buttons = {
    init: function(notice, options){
      var that = this;
      notice.elem.on({
        "mouseenter": function(e){
          // Show the buttons.
          if (that.options.sticker && (!(notice.options.nonblock && notice.options.nonblock.nonblock) || that.options.show_on_nonblock)) {
            that.sticker.trigger("pnotify:buttons:toggleStick").css("visibility", "visible");
          }
          if (that.options.closer && (!(notice.options.nonblock && notice.options.nonblock.nonblock) || that.options.show_on_nonblock)) {
            that.closer.css("visibility", "visible");
          }
        },
        "mouseleave": function(e){
          // Hide the buttons.
          if (that.options.sticker_hover) {
            that.sticker.css("visibility", "hidden");
          }
          if (that.options.closer_hover) {
            that.closer.css("visibility", "hidden");
          }
        }
      });

      // Provide a button to stick the notice.
      this.sticker = $("<div />", {
        "class": "ui-pnotify-sticker",
        "aria-role": "button",
        "aria-pressed": notice.options.hide ? "false" : "true",
        "tabindex": "0",
        "title": notice.options.hide ? options.labels.stick : options.labels.unstick,
        "css": {
          "cursor": "pointer",
          "visibility": options.sticker_hover ? "hidden" : "visible"
        },
        "click": function(){
          notice.options.hide = !notice.options.hide;
          if (notice.options.hide) {
            notice.queueRemove();
          } else {
            notice.cancelRemove();
          }
          $(this).trigger("pnotify:buttons:toggleStick");
        }
      })
      .bind("pnotify:buttons:toggleStick", function(){
        var pin_up = that.options.classes.pin_up === null ? notice.styles.pin_up : that.options.classes.pin_up;
        var pin_down = that.options.classes.pin_down === null ? notice.styles.pin_down : that.options.classes.pin_down;
        $(this)
        .attr("title", notice.options.hide ? that.options.labels.stick : that.options.labels.unstick)
        .children()
        .attr("class", "")
        .addClass(notice.options.hide ? pin_up : pin_down)
        .attr("aria-pressed", notice.options.hide ? "false" : "true");
      })
      .append("<span />")
      .trigger("pnotify:buttons:toggleStick")
      .prependTo(notice.container);
      if (!options.sticker || (notice.options.nonblock && notice.options.nonblock.nonblock && !options.show_on_nonblock)) {
        this.sticker.css("display", "none");
      }

      // Provide a button to close the notice.
      this.closer = $("<div />", {
        "class": "ui-pnotify-closer",
        "aria-role": "button",
        "tabindex": "0",
        "title": options.labels.close,
        "css": {"cursor": "pointer", "visibility": options.closer_hover ? "hidden" : "visible"},
        "click": function(){
          notice.remove(false);
          that.sticker.css("visibility", "hidden");
          that.closer.css("visibility", "hidden");
        }
      })
      .append($("<span />", {"class": options.classes.closer === null ? notice.styles.closer : options.classes.closer}))
      .prependTo(notice.container);
      if (!options.closer || (notice.options.nonblock && notice.options.nonblock.nonblock && !options.show_on_nonblock)) {
        this.closer.css("display", "none");
      }
    },
    update: function(notice, options){
      // Update the sticker and closer buttons.
      if (!options.closer || (notice.options.nonblock && notice.options.nonblock.nonblock && !options.show_on_nonblock)) {
        this.closer.css("display", "none");
      } else if (options.closer) {
        this.closer.css("display", "block");
      }
      if (!options.sticker || (notice.options.nonblock && notice.options.nonblock.nonblock && !options.show_on_nonblock)) {
        this.sticker.css("display", "none");
      } else if (options.sticker) {
        this.sticker.css("display", "block");
      }
      // Update the sticker icon.
      this.sticker.trigger("pnotify:buttons:toggleStick");
      // Update the close icon.
      this.closer.find("span").attr("class", "").addClass(options.classes.closer === null ? notice.styles.closer : options.classes.closer);
      // Update the hover status of the buttons.
      if (options.sticker_hover) {
        this.sticker.css("visibility", "hidden");
      } else if (!(notice.options.nonblock && notice.options.nonblock.nonblock && !options.show_on_nonblock)) {
        this.sticker.css("visibility", "visible");
      }
      if (options.closer_hover) {
        this.closer.css("visibility", "hidden");
      } else if (!(notice.options.nonblock && notice.options.nonblock.nonblock && !options.show_on_nonblock)) {
        this.closer.css("visibility", "visible");
      }
    }
  };
  $.extend(PNotify.styling.brighttheme, {
    closer: "brighttheme-icon-closer",
    pin_up: "brighttheme-icon-sticker",
    pin_down: "brighttheme-icon-sticker brighttheme-icon-stuck"
  });
  $.extend(PNotify.styling.bootstrap3, {
    closer: "glyphicon glyphicon-remove",
    pin_up: "glyphicon glyphicon-pause",
    pin_down: "glyphicon glyphicon-play"
  });
  $.extend(PNotify.styling.fontawesome, {
    closer: "fa fa-times",
    pin_up: "fa fa-pause",
    pin_down: "fa fa-play"
  });
  return PNotify;
}));

//  Source: node_modules\pnotify\src\pnotify.confirm.js
// Confirm
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as a module.
    define('pnotify.confirm', ['jquery', 'pnotify'], factory);
  } else if (typeof exports === 'object' && typeof module !== 'undefined') {
    // CommonJS
    module.exports = factory(require('jquery'), require('./pnotify'));
  } else {
    // Browser globals
    factory(root.jQuery, root.PNotify);
  }
}(typeof window !== "undefined" ? window : this, function($, PNotify){
  PNotify.prototype.options.confirm = {
    // Make a confirmation box.
    confirm: false,
    // Make a prompt.
    prompt: false,
    // Classes to add to the input element of the prompt.
    prompt_class: "",
    // The default value of the prompt.
    prompt_default: "",
    // Whether the prompt should accept multiple lines of text.
    prompt_multi_line: false,
    // Where to align the buttons. (right, center, left, justify)
    align: "right",
    // The buttons to display, and their callbacks.
    buttons: [
      {
        text: "Ok",
        addClass: "",
        // Whether to trigger this button when the user hits enter in a single line prompt.
        promptTrigger: true,
        click: function(notice, value){
          notice.remove();
          notice.get().trigger("pnotify.confirm", [notice, value]);
        }
      },
      {
        text: "Cancel",
        addClass: "",
        click: function(notice){
          notice.remove();
          notice.get().trigger("pnotify.cancel", notice);
        }
      }
    ]
  };
  PNotify.prototype.modules.confirm = {
    init: function(notice, options){
      // The div that contains the buttons.
      this.container = $('<div class="ui-pnotify-action-bar" style="margin-top:5px;clear:both;" />').css('text-align', options.align).appendTo(notice.container);

      if (options.confirm || options.prompt)
        this.makeDialog(notice, options);
      else
        this.container.hide();
    },

    update: function(notice, options){
      if (options.confirm) {
        this.makeDialog(notice, options);
        this.container.show();
      } else {
        this.container.hide().empty();
      }
    },

    afterOpen: function(notice, options){
      if (options.prompt) {
        this.prompt.focus();
      }
    },

    makeDialog: function(notice, options) {
      var already = false, that = this, btn, elem;
      this.container.empty();
      if (options.prompt) {
        // The input element of a prompt.
        this.prompt = $('<'+(options.prompt_multi_line ? 'textarea rows="5"' : 'input type="text"')+' style="margin-bottom:5px;clear:both;" />')
        .addClass((typeof notice.styles.input === "undefined" ? "" : notice.styles.input)+" "+(typeof options.prompt_class === "undefined" ? "" : options.prompt_class))
        .val(options.prompt_default)
        .appendTo(this.container);
      }
      var customButtons = (options.buttons[0] && options.buttons[0] !== PNotify.prototype.options.confirm.buttons[0]);
      for (var i = 0; i < options.buttons.length; i++) {
        if (options.buttons[i] === null || (customButtons && PNotify.prototype.options.confirm.buttons[i] && PNotify.prototype.options.confirm.buttons[i] === options.buttons[i])) {
          continue;
        }
        btn = options.buttons[i];
        if (already) {
          this.container.append(' ');
        } else {
          already = true;
        }
        elem = $('<button type="button" class="ui-pnotify-action-button" />')
        .addClass((typeof notice.styles.btn === "undefined" ? "" : notice.styles.btn)+" "+(typeof btn.addClass === "undefined" ? "" : btn.addClass))
        .text(btn.text)
        .appendTo(this.container)
        .on("click", (function(btn){ return function(){
          if (typeof btn.click == "function") {
            btn.click(notice, options.prompt ? that.prompt.val() : null);
          }
        }})(btn));
        if (options.prompt && !options.prompt_multi_line && btn.promptTrigger)
          this.prompt.keypress((function(elem){ return function(e){
            if (e.keyCode == 13)
              elem.click();
          }})(elem));
        if (notice.styles.text) {
          elem.wrapInner('<span class="'+notice.styles.text+'"></span>');
        }
        if (notice.styles.btnhover) {
          elem.hover((function(elem){ return function(){
            elem.addClass(notice.styles.btnhover);
          }})(elem), (function(elem){ return function(){
            elem.removeClass(notice.styles.btnhover);
          }})(elem));
        }
        if (notice.styles.btnactive) {
          elem.on("mousedown", (function(elem){ return function(){
            elem.addClass(notice.styles.btnactive);
          }})(elem)).on("mouseup", (function(elem){ return function(){
            elem.removeClass(notice.styles.btnactive);
          }})(elem));
        }
        if (notice.styles.btnfocus) {
          elem.on("focus", (function(elem){ return function(){
            elem.addClass(notice.styles.btnfocus);
          }})(elem)).on("blur", (function(elem){ return function(){
            elem.removeClass(notice.styles.btnfocus);
          }})(elem));
        }
      }
    }
  };
  $.extend(PNotify.styling.bootstrap3, {
    btn: "btn btn-default",
    input: "form-control"
  });
  $.extend(PNotify.styling.fontawesome, {
    btn: "btn btn-default",
    input: "form-control"
  });
  return PNotify;
}));

//  Source: ui\lib\angular\pnotify\js\scripts.js
//  Source: node_modules\angular-pnotify\src\angular-pnotify.js
(function(){

	'use strict';

	angular.module('jlareau.pnotify', [])

		.provider('notificationService', [ function() {

			var settings = {
				styling: 'bootstrap3'
			};

			var stacks = {};
			var defaultStack = false;

			var initHash = function(stackName) {

				var hash = angular.copy(settings);

				if ((stackName || (stackName = defaultStack)) && stackName in stacks) {

					hash.stack = stacks[stackName].stack;

					if (stacks[stackName].addclass) {

						hash.addclass = 'addclass' in hash
                            ? hash.addclass + ' ' + stacks[stackName].addclass
                            : stacks[stackName].addclass;

					}
				}

				return hash;

			};

			this.setDefaults = function(defaults) {

				settings = defaults;
				return this;

			};

			this.setStack = function(name, addclass, stack) {

				if (angular.isObject(addclass)) {
					stack = addclass;
					addclass = false;
				}

				stacks[name] = {
					stack: stack,
					addclass: addclass
				};

				return this;

			};

			this.setDefaultStack = function(name) {

				defaultStack = name;

				return this;

			};

			this.$get = [ function() {

				return {

					/* ========== SETTINGS RELATED METHODS =============*/

					getSettings: function() {

						return settings;

					},

					/* ============== NOTIFICATION METHODS ==============*/

					notice: function(content, stack) {

						var hash = initHash(stack);
						hash.type = 'notice';
						hash.text = content;
						return this.notify(hash);

					},

					info: function(content, stack) {

						var hash = initHash(stack);
						hash.type = 'info';
						hash.text = content;
						return this.notify(hash);

					},

					success: function(content, stack) {

						var hash = initHash(stack);
						hash.type = 'success';
						hash.text = content;
						return this.notify(hash);

					},

					error: function(content, stack) {

						var hash = initHash(stack);
						hash.type = 'error';
						hash.text = content;
						return this.notify(hash);

					},

					notifyWithDefaults: function(options, stack) {

						var defaults = initHash(stack);
						var combined = angular.extend(defaults, options);
						return this.notify(combined);

					},

					notify: function(hash) {

						return new PNotify(hash);

					},

                    removeNotifications: function() {

                        return PNotify.removeAll();
                        
                    }

				};

			}];

		}])

	;

})();


// RealPage Common

//  Source: ui\lib\realpage\common\js\scripts.js
//  Source: _lib\realpage\common\js\directives\_bundle.inc
//  Source: _lib\realpage\common\js\directives\fade.js
//  Fade Directive

(function (angular) {
    "use strict";

    function rpFade() {
        function link(scope, elem, attr) {
            var model;

            function fade(isVisible) {
                elem[isVisible ? 'fadeIn' : 'fadeOut'](model.duration || 200);
            }

            function init() {
                elem.hide();
                model = scope.$eval(attr.rpFade);
                model.isVisible.watch(fade);
            }

            init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpCommon")
        .directive('rpFade', [rpFade]);
})(angular);

//  Source: _lib\realpage\common\js\directives\file-drop.js
//  File Drop Directive

(function (angular) {
    "use strict";

    function rpFileDrop(fileAttachments) {
        function link(scope, elem, attr) {
            var dir = {},
                onFileLoad;

            function init() {
                dir.setOnLoad();
                elem.on('drop', dir.onDrop);
                elem.on('dragover', dir.disableEvent);
                elem.on('dragleave', dir.disableEvent);
                elem.on('dragleave', dir.disableEvent);
            }

            dir.disableEvent = function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            };

            dir.setOnLoad = function () {
                var fn = scope.$eval(attr.onFileLoad);
                onFileLoad = typeof fn == 'function' ? fn : angular.noop;
            };

            dir.onDrop = function (ev) {
                var files = ev.originalEvent.dataTransfer.files;
                dir.disableEvent(ev);
                dir.loadFiles(files);
            };

            dir.loadFiles = function (files) {
                fileAttachments(files).then(onFileLoad);
            };

            init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpCommon")
        .directive('rpFileDrop', ['rpFileAttachments', rpFileDrop]);
})(angular);

//  Source: _lib\realpage\common\js\directives\file-select.js
//  File Select Directive

(function (angular) {
    "use strict";

    function rpFileSelect(fileAttachments) {
        function link(scope, elem, attr) {
            var dir = {},
                onFileLoad;

            function init() {
                dir.setOnLoad();
                elem.on('change', dir.onChange);
            }

            dir.disableEvent = function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            };

            dir.setOnLoad = function () {
                var fn = scope.$eval(attr.onFileLoad);
                onFileLoad = typeof fn == 'function' ? fn : angular.noop;
            };

            dir.onChange = function (ev) {
                var files = ev.target.files;
                dir.disableEvent(ev);
                dir.loadFiles(files);
            };

            dir.loadFiles = function (files) {
                fileAttachments(files).then(onFileLoad);
            };

            init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpCommon")
        .directive('rpFileSelect', ['rpFileAttachments', rpFileSelect]);
})(angular);

//  Source: _lib\realpage\common\js\directives\highlight-term.js
//  Highlight Term Directive

(function (angular) {
    "use strict";

    function rpHighlightTerm(timeout) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.text = elem.text();
                dir.terms = attr.rpHighlightTerm.split(' ');

                dir.terms.forEach(dir.highlight);

                dir.insertTags().updateText();
            };

            dir.highlight = function (term) {
                var out = '',
                    exp = new RegExp(term, 'ig'),
                    pieces = dir.text.split(exp),
                    matches = dir.text.match(exp);

                if (!matches) {
                    return;
                }

                pieces.forEach(function (piece, key) {
                    var bool = key < matches.length,
                        part = bool ? '<>' + matches[key] + '</>' : '';

                    out += piece + part;
                });

                dir.text = out;
            };

            dir.insertTags = function () {
                var open = new RegExp('<>', 'ig'),
                    close = new RegExp('</>', 'ig'),
                    openTag = '<span class="highlight">',
                    closeTag = '</span>';

                dir.text = dir.text.replace(open, openTag).replace(close, closeTag);

                return dir;
            };

            dir.updateText = function () {
                elem.html(dir.text);
            };

            timeout(dir.init);
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpCommon")
        .directive('rpHighlightTerm', ['timeout', rpHighlightTerm]);
})(angular);

//  Source: _lib\realpage\common\js\directives\html.js
//  Html Directive

(function (angular) {
    "use strict";

    function html(deviceInfo) {
        function link(scope, elem, attr) {
            var isMobile = deviceInfo.isMobile(),
                method = isMobile ? 'removeClass' : 'addClass';
            elem[method]('no-touch');
        }

        return {
            link: link,
            restrict: 'E'
        };
    }

    angular
        .module("rpCommon")
        .directive('html', ['deviceInfoSvc', html]);
})(angular);

//  Source: _lib\realpage\common\js\directives\kill-event.js
//  Kill Event Directive

(function (angular) {
    "use strict";

    function rpKillEvent() {
        function link(scope, elem, attr) {
            var eventNames = attr.rpKillEvent.split(',');

            function killEvent(e) {
                var bool = !e.originalEvent ||
                    (e.originalEvent && !e.originalEvent.allowEvent);

                if (bool) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

            eventNames.forEach(function (eventName) {
                elem.on(eventName.trim(), killEvent);
            });
        }

        return {
            link: link,
            restrict: 'A',
            priority: 100
        };
    }

    angular
        .module("rpCommon")
        .directive('rpKillEvent', [rpKillEvent]);
})(angular);

//  Source: _lib\realpage\common\js\directives\publish-scroll.js
//  Publish Scroll Directive

(function (angular, undefined) {
    "use strict";

    function rpPublishScroll() {
        function link(scope, elem, attr) {
            var stream,
                dir = {};

            dir.init = function () {
                stream = scope.$eval(attr.rpPublishScroll);
                dir.destWatch = scope.$on("$destroy", dir.destroy);

                if (stream) {
                    elem.on("scroll.rpPublishScroll", dir.onScroll);
                }
            };

            dir.onScroll = function () {
                stream.publish();
            };

            dir.destroy = function () {
                elem.off("scroll.rpPublishScroll");
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
                stream = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpCommon")
        .directive("rpPublishScroll", [rpPublishScroll]);
})(angular);

//  Source: _lib\realpage\common\js\directives\register-form.js
//  Register Form Directive

(function (angular, undefined) {
    "use strict";

    function rpRegisterForm(agent, formManager) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                var keys = scope.$eval(attr.rpRegisterForm),
                    form = formManager().setForm(scope[attr.name]);

                form.setKeys(keys);
                agent.register(attr.name, form);
                dir.watch = scope.$on('$destroy', dir.destroy);
            };

            dir.destroy = function () {
                dir.watch();
                agent.erase(attr.name);
                dir = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpCommon")
        .directive('rpRegisterForm', ['rpFormAgent', 'rpFormManager', rpRegisterForm]);
})(angular);

//  Source: _lib\realpage\common\js\directives\scroll.js
//  Scroll Directive

(function (angular) {
    "use strict";

    function rpScroll($parse) {
        function link(scope, elem, attr) {
            var handler = $parse(attr.rpScroll);

            elem.on('scroll.rpScroll', function () {
                scope.$apply(function () {
                    handler(scope, {
                        $event: event,
                        scroll: {
                            top: elem.prop('scrollTop'),
                            left: elem.prop('scrollLeft')
                        }
                    });
                });
            });
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpCommon")
        .directive('rpScroll', ['$parse', rpScroll]);
})(angular);

//  Source: _lib\realpage\common\js\directives\stop-event.js
//  Stop Event Directive

(function (angular) {
    "use strict";

    function rpStopEvent() {
        function link(scope, elem, attr) {
            var eventNames = attr.rpStopEvent.split(',');

            function stopEvent(e) {
                var bool = !e.originalEvent ||
                    (e.originalEvent && !e.originalEvent.allowEvent);

                if (bool) {
                    e.stopPropagation();
                }
            }

            eventNames.forEach(function (eventName) {
                elem.on(eventName.trim(), stopEvent);
            });
        }

        return {
            link: link,
            restrict: 'A',
            priority: 100
        };
    }

    angular
        .module("rpCommon")
        .directive('rpStopEvent', [rpStopEvent]);
})(angular);

//  Source: _lib\realpage\common\js\directives\touchend.js
//  Touchend Directive

(function (angular) {
    "use strict";

    function rpTouchend($parse) {
        function link(scope, elem, attr) {
            var eventHandler = $parse(attr.rpTouchend);

            elem.on('touchend.rp', function (event) {
                scope.$apply(function () {
                    eventHandler(scope, {
                        $event: event
                    });
                });
            });
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpCommon")
        .directive('rpTouchend', ['$parse', rpTouchend]);
})(angular);

//  Source: _lib\realpage\common\js\directives\touchstart.js
//  Touchstart Directive

(function (angular) {
    "use strict";

    function rpTouchstart($parse) {
        function link(scope, elem, attr) {
            var eventHandler = $parse(attr.rpTouchstart);

            elem.on('touchstart.rp', function (event) {
                scope.$apply(function () {
                    eventHandler(scope, {
                        $event: event
                    });
                });
            });
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpCommon")
        .directive('rpTouchstart', ['$parse', rpTouchstart]);
})(angular);

//  Source: _lib\realpage\common\js\filters\_bundle.inc
//  Source: _lib\realpage\common\js\filters\html-unsafe.js
//  Html Unsafe Filter

(function (angular) {
    "use strict";

    function filter($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }

    angular
        .module("rpCommon")
        .filter('htmlUnsafe', ['$sce', filter]);
})(angular);

//  Source: _lib\realpage\common\js\filters\natural-sort.js
//  Sort Filter

/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams, guillermo
 * See: http://js-naturalsort.googlecode.com/svn/trunk/naturalSort.js
 */

(function (angular) {
    "use strict";

    function naturalSort(a, b) {
        var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
            sre = /(^[ ]*|[ ]*$)/g,
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            i = function (s) {
                return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s;
            },

            // convert all to strings strip whitespace
            x = i(a).replace(sre, '') || '',
            y = i(b).replace(sre, '') || '',

            // chunk/tokenize
            xN = x.replace(re, '\u0000$1\u0000').replace(/\u0000$/, '').replace(/^\u0000/, '').split('\u0000'),
            yN = y.replace(re, '\u0000$1\u0000').replace(/\u0000$/, '').replace(/^\u0000/, '').split('\u0000'),

            // numeric, hex or date detection
            xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
            yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
            oFxNcL, oFyNcL;

        // first try and sort Hex codes or Dates
        if (yD) {
            if (xD < yD) {
                return -1;
            }
            else if (xD > yD) {
                return 1;
            }
        }

        // natural sorting through split numeric strings and default strings
        for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;

            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
                return (isNaN(oFxNcL)) ? 1 : -1;
            }

            // rely on string comparison if different types
            // - i.e. '02' < 2 != '02' < '2'
            else if (typeof oFxNcL !== typeof oFyNcL) {
                oFxNcL += '';
                oFyNcL += '';
            }
            if (oFxNcL < oFyNcL) {
                return -1;
            }
            if (oFxNcL > oFyNcL) {
                return 1;
            }
        }
        return 0;
    }

    function Filter(items, field, reverse) {
        var filtered = [];

        if (!field) {
            return items;
        }

        naturalSort.insensitive = true;

        angular.forEach(items, function (item) {
            filtered.push(item);
        });

        filtered.sort(function (a, b) {
            return naturalSort(a[field], b[field]);
        });

        if (reverse) {
            filtered.reverse();
        }

        return filtered;
    }

    angular
        .module("rpCommon")
        .filter('naturalSort', function () {
            return Filter;
        });
})(angular);

//  Source: _lib\realpage\common\js\models\_bundle.inc
//  Source: _lib\realpage\common\js\models\colors.js
//  RealPage Colors Model

(function (angular) {
    "use strict";

    function factory() {
        return {
            accent:         "#ff6437",
            accent04:       "#cc4f2d",

            blue:           "#2196f3",

            info:           "#6887ff",

            neut04:         "#cbcbcb",

            prim:           "#42A5F5",
            prim02:         "#ABD9FF",
            prim04:         "#2D71A8",

            red400:         "#ef5350",

            sec:            "#37474f",
            sec03:          "#495e69",
            sec04:          "#28343b",

            white:          "#fff",

            unk1:           "#40a4f5",
            unk2:           "#a3afb5",
            unk3:           "#a8cef9"
        };
    }

    angular
        .module("rpCommon")
        .factory("rpColors", [factory]);
})(angular);

//  Source: _lib\realpage\common\js\models\form-config.js
//  Form Config Model

(function (angular) {
    "use strict";

    function factory(methodsRepo) {
        return function () {
            var model = {};

            model.methods = methodsRepo();

            model.setMethodsSrc = function () {
                model.methods.setSrc.apply(model.methods, arguments);
                return model;
            };

            model.getMethod = function (methodName) {
                return model.methods.get(methodName);
            };

            return model;
        };
    }

    angular
        .module("rpCommon")
        .factory("baseFormConfig", ["rpMethodsRepo", factory]);
})(angular);

//  Source: _lib\realpage\common\js\models\form.js
//  Base Form Model

(function (angular) {
    "use strict";

    function factory() {
        return function () {
            var model = {
                form: {},
                defaultForm: {}
            };

            model.setData = function (data) {
                model.form = data;
                model.defaultForm = angular.extend({}, model.form);
            };

            model.reset = function () {
                angular.extend(model.form, model.defaultForm);
            };

            model.commit = function () {
                angular.extend(model.defaultForm, model.form);
            };

            return model;
        };
    }

    angular
        .module("rpCommon")
        .factory("baseForm", [factory]);
})(angular);

//  Source: _lib\realpage\common\js\models\layout.js
//  Base Layout Model

(function (angular) {
    "use strict";

    function factory() {
        return function (data) {
            var model = {
                data: data
            };

            Object.keys(data).forEach(function (key) {
                ["show", "hide"].forEach(function (method) {
                    model[method + key.ucfirst()] = function () {
                        data[key] = method == "show";
                        return model;
                    };
                });
            });

            model.getLayout = function () {
                return data;
            };

            model.setLayout = function (newData) {
                angular.extend(model.data, newData);
            };

            return model;
        };
    }

    angular
        .module("rpCommon")
        .factory("baseLayoutModel", [factory]);
})(angular);

//  Source: _lib\realpage\common\js\models\list.js
//  List Model

(function (angular) {
    "use strict";

    function factory(collection) {
        return function () {
            var model = collection();

            model.state = {
                isActive: false
            };

            model.update = function (data) {
                if (data && data.forEach) {
                    data.forEach(model.add);
                }
                return model;
            };

            model.activate = function () {
                model.state.isActive = true;
                return model;
            };

            model.deactivate = function () {
                model.state.isActive = false;
                return model;
            };

            return model;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpListModel', ['rpCollection', factory]);
})(angular);

//  Source: _lib\realpage\common\js\models\app-layout.js
//  App Layout Model

(function (angular) {
    "use strict";

    function factory(layoutModel, cookie) {
        var model = layoutModel({
            "appNav": true,
            "appHeader": true,
            "appFooter": true
        });

        model.init = function () {
            if (cookie.read("crossover") === "True") {
                model.setLayout({
                    "appNav": false,
                    "appHeader": false,
                    "appFooter": false
                });
            }

            return true;
        };

        return model;
    }

    angular
        .module("rpCommon")
        .factory("appLayout", [
            "baseLayoutModel",
            "rpCookie",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\common\js\models\regex.js
//  Regular Expressions

(function (angular) {
    "use strict";

    function factory() {
        var regex = {
            email: /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/i
        };

        Object.freeze(regex);

        return regex;
    }

    angular
        .module("rpCommon")
        .factory("regex", [factory]);
})(angular);

//  Source: _lib\realpage\common\js\models\data-share.js
//  Data Share Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function DataShare() {
            var s = this;
            s.init();
        }

        var p = DataShare.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
        };

        p.set = function (data) {
            var s = this;
            s.data = data || {};
            return s;
        };

        p.get = function (key) {
            var s = this;
            return key !== undefined ? s.data[key] : s.data;
        };

        p.extend = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function (data) {
            return (new DataShare()).set(data);
        };
    }

    angular
        .module("rpCommon")
        .factory("rpDataShareModel", [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\_bundle.inc
//  Source: _lib\realpage\common\js\services\body.js
//  Body Service

(function (angular) {
    "use strict";

    function BodySvc(windowSize, watchable, deviceInfoSvc, eventStream) {
        var svc = {},
            hasTouch = deviceInfoSvc.hasTouch(),
            eventNames = ['click', 'mouseDown', 'mouseMove', 'mouseUp', 'mouseLeave'];

        if (hasTouch) {
            eventNames = ['touchStart', 'touchMove', 'touchEnd'];
        }

        eventNames.forEach(function (name) {
            svc[name] = watchable();
        });

        svc.isLocked = watchable();
        svc.minHeight = watchable();
        svc.minHeightVersion = watchable();

        svc.animation = watchable();

        svc.updateMinHeight = function () {
            svc.minHeightVersion.set(Date.now());
        };

        windowSize.subscribe(svc.updateMinHeight);

        return svc;
    }

    angular
        .module("rpCommon")
        .factory('BodySvc', [
            'windowSize',
            'watchable',
            'deviceInfoSvc',
            'eventStream',
            BodySvc
        ]);
})(angular);

//  Source: _lib\realpage\common\js\services\collection.js
//  Collection Service

(function (angular) {
    "use strict";

    function factory() {
        var index = 1;

        return function () {
            var model = {};

            model.list = [];

            model.add = function (obj) {
                obj.__id = index++;
                model.list.push(obj);
                return model;
            };

            model.remove = function (obj) {
                model.list = model.list.filter(function (listItem) {
                    return listItem.__id !== obj.__id;
                });
                return model;
            };

            model.each = function (fn) {
                model.list.forEach(fn);
                return model;
            };

            model.filter = function (fn) {
                model.list.filter(fn);
                return model;
            };

            model.flush = function () {
                model.list.flush();
                return model;
            };

            model.destroy = function () {
                model.list = null;
                model = null;
            };

            model.isEmpty = function () {
                return model.list.length === 0;
            };

            return model;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpCollection', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\computed-style.js
//  Computed Style Service

(function (angular) {
    "use strict";

    function factory($window) {
        return function (elem) {
            var el = elem.get(0),
                style = $window.getComputedStyle(el);

            var svc = {
                el: el,
                style: style
            };

            svc.toFloat = function (data) {
                return parseFloat(data.replace(/px/, ''));
            };

            svc.ceil = function (data) {
                return Math.ceil(data);
            };

            svc.width = function () {
                if (style.width == 'auto') {
                    return 0;
                }
                var width = svc.toFloat(style.width);
                return svc.ceil(width);
            };

            svc.outerWidth = function (bool) {
                var ow = 0;

                if (style.width == 'auto') {
                    return ow;
                }

                var keys = [
                    'width',
                    'paddingLeft',
                    'paddingRight',
                    'borderLeftWidth',
                    'borderRightWidth'
                ];

                if (bool) {
                    keys = keys.concat(['marginLeft', 'marginRight']);
                }

                keys.forEach(function (key) {
                    ow += svc.toFloat(style[key]);
                });

                return svc.ceil(ow);
            };

            return svc;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpComputedStyle', ['$window', factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\countries-list.js
//  Countries List Model

(function (angular) {
    "use strict";

    function factory() {
        return function () {
            return [
                {"value":"","name":"All"},
                {"value":"US","name":"US"},
                {"value":"CA","name":"Canada"},
                {"value":"ZZ","name":"Other"}
            ];
        };
    }

    angular
        .module("rpCommon")
        .factory('rpCountriesList', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\date-parser.js
//  Date Parse Service

(function (angular) {
    "use strict";

    function factory(moment) {
        return function () {
            var svc = {};

            svc.outputFormat = 'MM/DD/YYYY';

            svc.parse = function (dateString) {
                if (dateString === undefined) {
                    return '';
                }

                var regexp = [],
                    format = '',
                    newDateString = '',
                    ln = dateString.length,
                    max = moment().add(16, 'years'),
                    min = moment('01/01/1900', 'MM/DD/YYYY'),
                    currentYear = parseInt(moment().format('YY'), 10);

                if (ln < 4 || ln > 10) {
                    return '';
                }

                switch (ln) {
                case (4):
                    format = ['M/D/YY'];
                    regexp = [/(\d{1})(\d{1})(\d{2})$/];
                    break;

                case (5):
                    format = ['MM/D/YY', 'M/DD/YY'];
                    regexp = [/(\d{2})(\d)(\d{2})$/, /(\d)(\d{2})(\d{2})$/];
                    break;

                case (6):
                    format = ['MM/DD/YY', 'M/D/YYYY', 'M/D/YYYY'];
                    regexp = [/(\d{2})(\d{2})(\d{2})$/,
                        /(\d)(\d)(\d{4})$/,
                        /(\d)\/(\d)\/(\d{2})$/
                    ];
                    break;

                case (7):
                    format = ['MM/D/YYYY', 'M/DD/YYYY', 'M/DD/YY', 'MM/D/YY'];
                    regexp = [/(\d{2})(\d)(\d{4})$/,
                        /(\d)(\d{2})(\d{4})$/,
                        /(\d)\/(\d{2})\/(\d{2})$/,
                        /(\d{2})\/(\d)\/(\d{2})$/
                    ];
                    break;

                case (8):
                    format = ['M/D/YYYY', 'MM/DD/YYYY', 'MM/DD/YY'];
                    regexp = [/(\d)\/(\d)\/(\d{4})$/,
                        /(\d{2})(\d{2})(\d{4})$/,
                        /(\d{2})\/(\d{2})\/(\d{2})$/
                    ];
                    break;

                case (9):
                    format = ['M/DD/YYYY', 'MM/D/YYYY'];
                    regexp = [/(\d)\/(\d{2})\/(\d{4})$/, /(\d{2})\/(\d)\/(\d{4})$/];
                    break;

                case (10):
                    format = ['MM/DD/YYYY'];
                    regexp = [/(\d{2})\/(\d{2})\/(\d{4})$/];
                    break;
                }

                var found = false;

                regexp.forEach(function (exp, index) {
                    var valid = true,
                        stringFormat = format[index],
                        matches = dateString.match(exp);

                    if (!matches || found) {
                        return;
                    }

                    matches.remove(0);

                    var year = parseInt(matches[2], 10);

                    if (year < 100) {
                        stringFormat += 'YY';
                        year += year > currentYear + 16 ? 1900 : 2000;
                        matches[2] = year;
                    }

                    var mom = moment(matches.join('/'), stringFormat);

                    if (mom.isValid() && mom.isAfter(min) && mom.isBefore(max)) {
                        found = true;
                        newDateString = mom.format(svc.outputFormat);
                    }
                });

                return newDateString;
            };

            return svc;
        };
    }

    angular
        .module("rpCommon")
        .factory('dateParser', ['moment', factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\date.js
//  Day Model

(function (angular, und) {
    "use strict";

    function factory(moment) {
        return function (data) {
            var model = {},
                fmt = 'MM/DD/YYYY';

            model.is = function (day) {
                return data.format(fmt) === day.format(fmt);
            };

            model.isToday = function () {
                return data.format(fmt) === moment().format(fmt);
            };

            model.startDay = function () {
                return data.clone().date(1).day(0);
            };

            model.endDay = function () {
                return data.clone().add(1, 'month').date(0).day(6).add(1, 'day');
            };

            model.isCurrentMonth = function (day) {
                var fmt = 'MM';
                return data.format(fmt) === day.format(fmt);
            };

            model.isBefore = function (day) {
                return data.isBefore(day);
            };

            model.isAfter = function (day) {
                return data.isAfter(day);
            };

            return model;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpDate', ['moment', factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\device-info.js
//  Device Info Service

(function (angular) {
    "use strict";

    function factory($window) {
        var ua = $window.navigator.userAgent,
            isAndroid = /Android/i.test(ua),
            isBlackBerry = /BlackBerry/i.test(ua),
            isIOS = /iPhone|iPad|iPod/i.test(ua),
            isOperaMini = /Opera Mini/i.test(ua),
            isIEMobile = /IEMobile/i.test(ua),
            isMobile = isAndroid || isBlackBerry || isIOS || isOperaMini || isIEMobile;

        var svc = {};

        svc.isMobile = function () {
            return isMobile;
        };

        svc.hasTouch = function () {
            return isMobile;
        };

        svc.clickEvent = function (ns) {
            return (isMobile ? 'tap' : 'click') + (ns ? ('.' + ns) : '');
        };

        return svc;
    }

    angular
        .module("rpCommon")
        .factory('deviceInfoSvc', ['$window', factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\event-stream.js
//  Event Stream Service

(function (angular) {
    "use strict";

    function factory() {
        var count = 1;

        return function () {
            var svc = {},
                list = [];

            svc.subscribe = function (fn) {
                if (typeof fn === 'function') {
                    var id = 'evt' + count++;

                    list.push({
                        id: id,
                        callback: fn
                    });

                    return function () {
                        if (svc) {
                            svc.unsubscribe(id);
                        }
                    };
                }
                else {
                    logc('EventStream: callback should be a function, got =>', typeof fn);
                }
            };

            svc.unsubscribe = function (id) {
                list = list.filter(function (listItem) {
                    return listItem.id !== id;
                });
            };

            svc.publish = function (data) {
                if (list && list.forEach) {
                    list.forEach(function (listItem) {
                        listItem.callback(data);
                    });
                }
                return svc;
            };

            svc.reset = function () {
                list.flush();
                return svc;
            };

            svc.destroy = function () {
                if (list) {
                    list.flush();
                }
                svc.destroy = angular.noop;
                svc = undefined;
            };

            return svc;
        };
    }

    angular
        .module("rpCommon")
        .factory('eventStream', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\events-manager.js
//  Event Manager Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream) {
        return function () {
            var model = {
                events: {}
            };

            model.setEvents = function (list) {
                list.forEach(function (eventName) {
                    model.events[eventName] = eventStream();
                });
                return model;
            };

            model.setEvent = function (eventName, stream) {
                model.events[eventName] = stream;
                return model;
            };

            model.getEvent = function (eventName) {
                return model.events[eventName];
            };

            model.subscribe = function (eventName, callback) {
                if (!model.events[eventName]) {
                    logw('EventsManager: ' + eventName + ' is not a valid event name!');
                }
                else if (typeof callback != "function") {
                    logw('EventsManager: ' + callback + ' is not a function!');
                }
                else {
                    return model.events[eventName].subscribe(callback);
                }
            };

            model.publish = function (eventName, eventData) {
                if (model) {
                    if (!model.events[eventName]) {
                        logw('EventsManager: ' + eventName + ' is not a valid event name!');
                    }
                    else {
                        model.events[eventName].publish(eventData);
                    }
                }
            };

            model.destroy = function () {
                for (var name in model.events) {
                    model.events[name].destroy();
                }
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpCommon")
        .factory('eventsManager', ['eventStream', factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\exception-handler.js
//  Exception Handler Model

(function (angular) {
    "use strict";

    function factory() {
        return function (ex, cause) {
            logw(ex, cause);
        };
    }

    angular
        .module("rpCommon")
        .factory("$exceptionHandler", [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\file-attachments.js
//  File Attachments Service

(function (angular) {
    "use strict";

    function factory($q, $window) {
        return function (files) {
            var fileIndex = 0,
                attachments = [],
                deferred = $q.defer(),
                reader = new $window.FileReader();

            function loadFile(file) {
                reader.readAsDataURL(files[fileIndex]);
            }

            reader.onloadend = function (e) {
                var file = files[fileIndex],
                    fileData = e.target.result;

                attachments.push({
                    fileName: file.name,
                    fileSize: file.size,
                    base64: fileData.substr(fileData.indexOf(',') + 1),
                    type: file.type
                });

                if (files.length > fileIndex + 1) {
                    fileIndex++;
                    loadFile();
                }
                else {
                    deferred.resolve(attachments);
                }
            };

            loadFile();

            return deferred.promise;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpFileAttachments', ['$q', '$window', factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\form-agent.js
//  Form Agent Service

(function (angular) {
    "use strict";

    function factory() {
        var svc = {};

        svc._forms = {};

        svc.register = function (name, form) {
            if (!svc._forms[name]) {
                svc._forms[name] = form;
                return;
            }

            logc('rpFormAgent: Form name ' + name + ' is taken!');
        };

        svc.erase = function (name) {
            if (svc._forms[name]) {
                svc._forms[name].destroy();
                delete svc._forms[name];
            }
        };

        svc.form = function (name) {
            if (svc._forms[name]) {
                return svc._forms[name];
            }

            logc('rpFormAgent: ' + name + ' is not a valid form name!');
        };

        return svc;
    }

    angular
        .module("rpCommon")
        .factory('rpFormAgent', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\form-manager.js
//  Form Manager Service

(function (angular) {
    "use strict";

    function factory() {
        return function () {
            var svc = {};

            svc.keys = [];

            svc.setForm = function (form) {
                svc.form = form;
                return svc;
            };

            svc.setKeys = function (keys) {
                svc.keys = keys;
                return svc;
            };

            svc.setPristine = function () {
                svc.form.$setPristine();
                return svc;
            };

            svc.setUntouched = function () {
                svc.form.$setUntouched();
                return svc;
            };

            svc.isValid = function () {
                return svc.form.$valid;
            };

            svc.validate = function () {
                svc.keys.forEach(function (key) {
                    svc.form[key].$validate();
                });
                return svc;
            };

            svc.setTouched = function () {
                svc.keys.forEach(function (key) {
                    if (svc.form[key]) {
                        svc.form[key].$setTouched();
                    }
                    else {
                        logc('rpFormManager: ' + key + ' is not a valid form key');
                    }
                });
                return svc;
            };

            svc.destroy = function () {
                svc.keys.flush();
                svc.form = undefined;
                svc = undefined;
            };

            return svc;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpFormManager', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\guid.js
//  Guid Service

(function (angular) {
    "use strict";

    function Guid() {
        var s = this;
        s.init();
    }

    var p = Guid.prototype;

    p.init = function () {
        var s = this;
        s.str = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
        return s;
    };

    p.getNew = function () {
        var s = this;
        return s.str.replace(/[xy]/g, s.getRep);
    };

    p.getRep = function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
    };

    angular
        .module("rpCommon")
        .service("guid", [Guid]);
})(angular);

//  Source: _lib\realpage\common\js\services\homepage.js
//  Homepage Service

(function (angular) {
    "use strict";

    function factory(storage) {
        var svc = {},
            rp = storage.has('rp') ? storage.get('rp') : {};

        svc.set = function (url) {
            rp.homepage = url;
            svc.save();
        };

        svc.get = function () {
            return rp.homepage ? rp.homepage : false;
        };

        svc.save = function () {
            storage.set('rp', rp);
        };

        return svc;
    }

    angular
        .module("rpCommon")
        .factory('rpHomepage', ['rpSessionStorage', factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\invoke-link.js
//  Invoke Link Service

(function (angular, undefined) {
    "use strict";

    function InvokeLink($window, $state, pubsub) {
        var svc = this;

        svc.invoke = function (data) {
            if (data.url) {
                svc.invokeLink(data);
            }
            else if (data.sref) {
                svc.invokeState(data);
            }
            else if (data.method) {
                svc.invokeMethod(data);
            }
            else if (data.event) {
                svc.invokeEvent(data);
            }
        };

        svc.invokeLink = function (data) {
            if (data.newWin) {
                var win = $window.open(data.url, "_blank");
                win.focus();
            }
            else {
                $window.location.href = data.url;
            }
        };

        svc.invokeState = function (data) {
            $state.go(data.sref, data.stateParams || {});
        };

        svc.invokeMethod = function (data) {
            data.method(data.args);
        };

        svc.invokeEvent = function (data) {
            pubsub.publish(data.event, data.eventData || {});
        };
    }

    angular
        .module("rpCommon")
        .service("rpInvokeLink", [
            "$window",
            "$state",
            "pubsub",
            InvokeLink
        ]);
})(angular);

//  Source: _lib\realpage\common\js\services\keycode.js
//  Keycode Service

(function (angular) {
    "use strict";

    function factory() {
        var kc, svc = {};

        svc.isNav = function (event) {
            kc = event.keyCode;
            return (kc >= 35 && kc <= 40) || kc === 9 ||
                kc === 8 || kc === 45 || kc === 46;
        };

        svc.isAlpha = function (event) {
            kc = event.keyCode;
            return kc >= 65 && kc <= 90;
        };

        svc.isNumeric = function (event) {
            kc = event.keyCode;
            return (kc >= 48 && kc <= 57) ||
                (kc >= 96 && kc <= 105);
        };

        svc.isShift = function (event) {
            return event.shiftKey;
        };

        svc.isSlash = function (event) {
            return event.keyCode === 191;
        };

        svc.test = function (event) {
            var results = {},
                tests = ['nav', 'alpha', 'numeric', 'shift', 'slash'];

            tests.forEach(function (name) {
                var testName = 'is' + name.ucfirst();
                results[name] = svc[testName](event);
            });

            return results;
        };

        return svc;
    }

    angular
        .module("rpCommon")
        .factory('keycode', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\list-selection.js
//  List Selection Model

(function (angular, ud) {
    "use strict";

    function factory() {
        var pool = {};

        return function (id) {
            if (pool[id]) {
                return pool[id];
            }

            var data,
                model = {};

            model.updates = data = {
                selected: [],
                deselected: []
            };

            model.add = function (id, selected) {
                if (data.selected.contains(id) || data.deselected.contains(id)) {
                    return;
                }

                if (selected) {
                    data.selected.push(id);
                }
                else {
                    data.deselected.push(id);
                }
            };

            model.remove = function (id, selected) {
                if (selected) {
                    data.deselected = data.deselected.filter(function (item) {
                        return id != item;
                    });
                }
                else {
                    data.selected = data.selected.filter(function (item) {
                        return id != item;
                    });
                }
            };

            model.hasChanges = function () {
                return !data.selected.empty() || !data.deselected.empty();
            };

            model.destroy = function () {
                data = ud;
                model = ud;
                delete pool[id];
            };

            pool[id] = model;

            return pool[id];
        };
    }

    angular
        .module("rpCommon")
        .factory('rpListSelection', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\local-storage.js
//  Local Storage Service

(function (angular) {
    "use strict";

    function factory($window) {
        var svc = {},
            ls = $window.localStorage;

        svc.set = function (name, value) {
            ls[name] = JSON.stringify(value);
            return svc;
        };

        svc.get = function (name) {
            return JSON.parse(ls[name]);
        };

        svc.del = function (name) {
            delete ls[name];
            return svc;
        };

        svc.has = function (name) {
            return ls[name] !== undefined;
        };

        return svc;
    }

    angular
        .module("rpCommon")
        .factory('rpLocalStorage', ['$window', factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\location.js
// Location Service
// extends angular $location service

(function (angular) {
    "use strict";

    function factory($location) {
        var svc = {};

        svc.url = function (url) {
            if (url) {
                $location.url(url);
            }
            else {
                return $location.url();
            }
        };

        svc.path = function () {
            return $location.path();
        };

        svc.absUrl = function () {
            return $location.absUrl();
        };

        svc.appUrl = function () {
            return svc.absUrl().replace(/.*\/{2}[^\/]+(\/.*#\/).*/, "$1");
        };

        svc.fullUrl = function () {
            return svc.absUrl().replace(/.*\/{2}[^\/]+(\/.*)/, "$1");
        };

        return svc;
    }

    angular
        .module("rpCommon")
        .factory("location", ["$location", factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\log.js
//  Log Service

(function (angular) {
    "use strict";

    function log($window, $cookieStore) {
        var svc = {},
            fn = function () {},
            con = $window.console,
            hasLog = con && con.log,
            hasInfo = con && con.info,
            hasWarn = con && con.warn,
            hasError = con && con.error,
            debugMode = $cookieStore.get('debugMode') === true;

        svc.log = hasLog && debugMode ? con.log.bind(con) : fn;

        svc.info = hasInfo && debugMode ? con.info.bind(con) : fn;

        svc.warn = hasWarn && debugMode ? con.warn.bind(con) : fn;

        svc.error = hasError && debugMode ? con.error.bind(con) : fn;

        return svc;
    }

    angular
        .module("rpCommon")
        .factory('log', ['$window', '$cookieStore', log]);
})(angular);

//  Source: _lib\realpage\common\js\services\methods-repo.js
//  Actions Repo Model

(function (angular) {
    "use strict";

    function factory() {
        function MethodsRepo() {
            var s = this;
            s.init();
        }

        var p = MethodsRepo.prototype;

        p.init = function () {
            var s = this;
            s.src = {};
            return s;
        };

        p.setSrc = function (src) {
            var s = this;
            s.src = src;
            return s;
        };

        p.get = function (methodName) {
            var s = this;
            return function () {
                if (!s.src[methodName]) {
                    logc("MethodsRepo.getMethod: Method " + methodName + " is undefined!");
                }
                else if (typeof s.src[methodName] != "function") {
                    logc("MethodsRepo.getMethod: Method " + methodName + " is not a function!");
                }
                else {
                    var method = s.src[methodName];
                    return method.apply(s.src, arguments);
                }
            };
        };

        p.destroy = function () {
            var s = this;
            s.src = undefined;
            return s;
        };

        return function () {
            return new MethodsRepo();
        };
    }

    angular
        .module("rpCommon")
        .factory("rpMethodsRepo", [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\module-state.js
//  Module State Service

(function (angular) {
    "use strict";

    function factory() {
        var pool = {};

        function state(id) {
            pool[id] = pool[id] || {
                active: false
            };

            return pool[id];
        }

        state.destroy = function (id) {
            delete pool[id];
        };

        return state;
    }

    angular
        .module("rpCommon")
        .factory('moduleState', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\point.js
//  Point Service

(function (angular) {
    "use strict";

    function Point(x, y) {
        var s = this;
        s.x = x;
        s.y = y;
    }

    var p = Point.prototype;

    p.setX = function (x) {
        var s = this;
        s.x = x;
        return s;
    };

    p.setY = function (y) {
        var s = this;
        s.y = y;
        return s;
    };

    p.shiftX = function (shift) {
        var s = this;
        s.x += shift;
        return s;
    };

    p.shiftY = function (shift) {
        var s = this;
        s.y += shift;
        return s;
    };

    p.fromEvent = function (e) {
        var s = this;
        s.x = e.pageX;
        s.y = e.pageY;
        return s;
    };

    p.fromTouchEvent = function (e) {
        var s = this;
        s.x = e.originalEvent.touches[0].pageX;
        s.y = e.originalEvent.touches[0].pageY;
        return s;
    };

    p.clone = function () {
        var s = this;
        return new Point(s.x, s.y);
    };

    p.isSame = function (newPoint) {
        var s = this;
        return s.x == newPoint.x && s.y == newPoint.y;
    };

    p.xDistanceFrom = function (point) {
        var s = this,
            dist = point.x - s.x;
        return dist > 0 ? dist : dist * -1;
    };

    p.yDistanceFrom = function (point) {
        var s = this,
            dist = point.y - s.y;
        return dist > 0 ? dist : dist * -1;
    };

    function Service() {
        return function (x, y) {
            return new Point(x, y);
        };
    }

    angular
        .module("rpCommon")
        .service('point', Service);
})(angular);

//  Source: _lib\realpage\common\js\services\pool.js
//  Pool Service

(function (angular) {
    "use strict";

    function factory() {
        return function () {
            var pool = {};

            function svc(id, inst) {
                if (inst) {
                    pool[id] = inst;
                }
                else {
                    return pool[id];
                }
            }

            svc.del = function (id) {
                delete pool[id];
            };

            return svc;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpPoolSvc', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\pubsub.js
//  Pubsub Service

(function (angular) {
    "use strict";

    function factory() {
        var id = 1,
            svc = {},
            events = {};

        function getID() {
            return 'cb' + id++;
        }

        function unsub(eventName, callbackID) {
            if (events[eventName]) {
                events[eventName] = events[eventName].filter(function (obj) {
                    return obj.id !== callbackID;
                });
            }
        }

        svc.log = function () {
            logc(events);
        };

        svc.subscribe = function (eventName, callback) {
            var id = getID(),
                list = events[eventName] || [];

            events[eventName] = list;

            list.push({
                id: id,
                callback: callback
            });

            return function () {
                unsub(eventName, id);
            };
        };

        svc.publish = function (eventName, data) {
            var list = events[eventName] || [];

            list.forEach(function (obj) {
                obj.callback(data);
            });
        };

        svc.reset = function (eventName) {
            if (eventName === undefined) {
                events = {};
            }
            else if (eventName && events[eventName]) {
                delete events[eventName];
            }

            return svc;
        };

        return svc;
    }

    angular
        .module("rpCommon")
        .factory('pubsub', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\random.js
//  Random Service

(function (angular) {
    "use strict";

    function factory() {
        return function (length) {
            var num = '1';
            for (var i = 0; i < length - 1; i++) {
                num += '0';
            }
            num = parseInt(num);
            return Math.round((Math.random() + 1) * num);
        };
    }

    angular
        .module("rpCommon")
        .factory('random', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\rectangle.js
//  Rectangle Service

(function (angular) {
    "use strict";

    var pointService;

    function Rectangle(origin, width, height) {
        var s = this;
        s.width = width;
        s.height = height;
        s.origin = origin;
    }

    var p = Rectangle.prototype;

    p.setOrigin = function (origin) {
        var s = this;
        s.origin = origin;
        return s;
    };

    p.shiftX = function (x) {
        var s = this;
        s.origin.shiftX(x);
        return s;
    };

    p.shiftY = function (y) {
        var s = this;
        s.origin.shiftY(y);
        return s;
    };

    p.setWidth = function (width) {
        var s = this;
        s.width = width;
        return s;
    };

    p.setHeight = function (height) {
        var s = this;
        s.height = height;
        return s;
    };

    p.shiftWidth = function (shift) {
        var s = this;
        s.width += shift;
        return s;
    };

    p.shiftHeight = function (shift) {
        var s = this;
        s.height += shift;
        return s;
    };

    p.contains = function (point) {
        var s = this;

        return point.x > s.origin.x && point.x < s.origin.x + s.width &&
            point.y > s.origin.y && point.y < s.origin.y + s.height;
    };

    p.fromElement = function (el) {
        var s = this;
        s.width = el.outerWidth();
        s.height = el.outerHeight();
        s.origin = pointService(el.offset().left, el.offset().top);
        return s;
    };

    p.hasSameOrigin = function (newRectangle) {
        var s = this;
        return s.origin.isSame(newRectangle.origin);
    };

    p.isSame = function (newRectangle) {
        var s = this,
            n = newRectangle;
        return s.hasSameOrigin(n) && s.width == n.width && s.height == n.height;
    };

    p.clone = function () {
        var s = this;
        return new Rectangle(s.origin.clone(), s.width, s.height);
    };

    p.area = function () {
        var s = this;
        return s.width * s.height;
    };

    function Service(point) {
        pointService = point;
        return function (origin, width, height) {
            return new Rectangle(origin, width, height);
        };
    }

    angular
        .module("rpCommon")
        .service('rectangle', ['point', Service]);
})(angular);

//  Source: _lib\realpage\common\js\services\scrollbar.js
//  Scrollbar Width Service

(function (angular) {
    "use strict";

    function Scrollbar($window) {
        var svc = this;

        svc.getWidthNoScroll = function () {
            svc.outer = $window.document.createElement("div");
            svc.outer.style.visibility = "hidden";
            svc.outer.style.width = "100px";
            svc.outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
            $window.document.body.appendChild(svc.outer);
            return svc.outer.offsetWidth;
        };

        svc.getWidthWithScroll = function () {
            svc.inner = $window.document.createElement("div");
            svc.inner.style.width = "100%";
            svc.outer.style.overflow = "scroll";
            svc.outer.appendChild(svc.inner);
            return svc.inner.offsetWidth;
        };

        svc.genWidth = function () {
            svc._width = svc.getWidthNoScroll() - svc.getWidthWithScroll();
            return svc.cleanup()._width;
        };

        svc.cleanup = function () {
            svc.outer.parentNode.removeChild(svc.outer);
            svc.inner = undefined;
            svc.outer = undefined;
            return svc;
        };

        svc.getWidth = function () {
            return svc._width ? svc._width : svc.genWidth();
        };
    }

    angular
        .module("rpCommon")
        .service("scrollbar", [
            "$window",
            Scrollbar
        ]);
})(angular);

//  Source: _lib\realpage\common\js\services\selection-manager.js
//  Selection Manager Service

(function (angular) {
    "use strict";

    function factory() {
        var pool = {};

        return function () {
            var model = {};

            model.selected = [];

            model.deselected = [];

            model.reset = function () {
                model.selected.flush();
                model.deselected.flush();
                return model;
            };

            model.addSelected = function (id) {
                model.selected.push(id);
            };

            model.removeSelected = function (id) {
                model.selected = model.selected.filter(function (item) {
                    return item != id;
                });
            };

            model.addDeselected = function (id) {
                model.deselected.push(id);
            };

            model.removeDeselected = function (id) {
                model.deselected = model.deselected.filter(function (item) {
                    return item != id;
                });
            };

            model.hasChanges = function () {
                return !model.selected.empty() || !model.deselected.empty();
            };

            model.getChanges = function () {
                return {
                    selected: model.selected,
                    deselected: model.deselected
                };
            };

            model.destroy = function () {
                model.selected = undefined;
                model.deselected = undefined;
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpSelectionManager', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\serialize.js
//  Serialize Service

(function (angular) {
    "use strict";

    function serialize() {
        return function (data) {
            var val,
                buffer = [];

            for (var key in data) {
                val = data[key];
                key = encodeURIComponent(key);
                val = encodeURIComponent(val ? val : "");
                buffer.push(key + "=" + val);
            }

            return buffer.join("&").replace(/%20/g, "+");
        };
    }

    angular
        .module("rpCommon")
        .factory("serialize", [serialize]);
})(angular);

//  Source: _lib\realpage\common\js\services\session-storage.js
//  Session Storage Service

(function (angular) {
    "use strict";

    function factory($window) {
        var svc = {},
            ss = $window.sessionStorage;

        svc.set = function (name, value) {
            ss[name] = JSON.stringify(value);
            return svc;
        };

        svc.get = function (name) {
            return JSON.parse(ss[name]);
        };

        svc.del = function (name) {
            delete ss[name];
            return svc;
        };

        svc.has = function (name) {
            return ss[name] !== undefined;
        };

        return svc;
    }

    angular
        .module("rpCommon")
        .factory("rpSessionStorage", ["$window", factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\timeout.js
//  Timeout Service

(function (angular) {
    "use strict";

    function service($rootScope) {
        var list = [],
            timeouts = [];

        function timeout(fn, time) {
            list.push(fn);

            var tout = setTimeout(function () {
                $rootScope.$apply(fn);
            }, time);

            timeouts.push(tout);

            return tout;
        }

        timeout.cancel = function (timer) {
            clearTimeout(timer);
        };

        timeout.flush = function () {
            timeouts.forEach(function (tout) {
                clearTimeout(tout);
            });

            list.forEach(function (fn) {
                $rootScope.$apply(fn);
            });
        };

        return timeout;
    }

    angular
        .module("rpCommon")
        .factory('timeout', ['$rootScope', service]);
})(angular);

//  Source: _lib\realpage\common\js\services\us-states-list.js
//  US States Model

(function (angular) {
    "use strict";

    function factory() {
        return function () {
            return [
                {"value":"","name":"All"},
                {"value":"AL","name":"AL"},
                {"value":"AK","name":"AK"},
                {"value":"AZ","name":"AZ"},
                {"value":"AR","name":"AR"},
                {"value":"CA","name":"CA"},
                {"value":"CO","name":"CO"},
                {"value":"CT","name":"CT"},
                {"value":"DE","name":"DE"},
                {"value":"FL","name":"FL"},
                {"value":"GA","name":"GA"},
                {"value":"HI","name":"HI"},
                {"value":"ID","name":"ID"},
                {"value":"IL","name":"IL"},
                {"value":"IN","name":"IN"},
                {"value":"IA","name":"IA"},
                {"value":"KS","name":"KS"},
                {"value":"KY","name":"KY"},
                {"value":"LA","name":"LA"},
                {"value":"ME","name":"ME"},
                {"value":"MD","name":"MD"},
                {"value":"MA","name":"MA"},
                {"value":"MI","name":"MI"},
                {"value":"MN","name":"MN"},
                {"value":"MS","name":"MS"},
                {"value":"MO","name":"MO"},
                {"value":"MT","name":"MT"},
                {"value":"NE","name":"NE"},
                {"value":"NV","name":"NV"},
                {"value":"NH","name":"NH"},
                {"value":"NJ","name":"NJ"},
                {"value":"NM","name":"NM"},
                {"value":"NY","name":"NY"},
                {"value":"NC","name":"NC"},
                {"value":"ND","name":"ND"},
                {"value":"OH","name":"OH"},
                {"value":"OK","name":"OK"},
                {"value":"OR","name":"OR"},
                {"value":"PA","name":"PA"},
                {"value":"RI","name":"RI"},
                {"value":"SC","name":"SC"},
                {"value":"SD","name":"SD"},
                {"value":"TN","name":"TN"},
                {"value":"TX","name":"TX"},
                {"value":"UT","name":"UT"},
                {"value":"VT","name":"VT"},
                {"value":"VA","name":"VA"},
                {"value":"WA","name":"WA"},
                {"value":"DC","name":"DC"},
                {"value":"WV","name":"WV"},
                {"value":"WI","name":"WI"},
                {"value":"WY","name":"WY"}
            ];
        };
    }

    angular
        .module("rpCommon")
        .factory('rpUSStatesList', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\watch-list.js
//  Watch List Service

(function (angular) {
    "use strict";

    function factory() {
        return function () {
            var svc = {};

            svc.list = [];

            svc.add = function (watch) {
                svc.list.push(watch);
                return svc;
            };

            svc.destroy = function () {
                svc.list.forEach(function (watch) {
                    watch();
                });

                svc.list.flush();

                svc = undefined;
            };

            return svc;
        };
    }

    angular
        .module("rpCommon")
        .factory('rpWatchList', [factory]);
})(angular);

//  Source: _lib\realpage\common\js\services\watchable.js
//  watchable Service

(function (angular) {
    "use strict";

    function Service(eventStream) {
        var index = 0;

        function Watchable(val) {
            var s = this;
            s.val = val;
            s.stream = eventStream();
        }

        var p = Watchable.prototype;

        p.set = function (val) {
            var s = this,
                isSame = val !== undefined &&
                s.val !== undefined &&
                s.methodName !== undefined &&
                typeof val[s.methodName] == 'function' &&
                typeof s.val[s.methodName] == 'function' &&
                s.val[s.methodName]() === val[s.methodName]();

            if (isSame || s.val === val) {
                return s;
            }

            s.val = val;
            s.stream.publish(val);
            return s;
        };

        p.get = function () {
            var s = this;
            return s.val;
        };

        p.watch = function (callback) {
            var s = this;
            return s.stream.subscribe(callback);
        };

        p.destroy = function () {
            var s = this;
            s.stream.destroy();
            return s;
        };

        p.setCompareMethod = function (methodName) {
            var s = this;
            s.methodName = methodName;
            return s;
        };

        return function (val) {
            return new Watchable(val);
        };
    }

    angular
        .module("rpCommon")
        .factory('watchable', ['eventStream', Service]);
})(angular);

//  Source: _lib\realpage\common\js\services\window-scroll.js
//  Window Scroll Service

(function (angular) {
    "use strict";

    function windowScroll($window, eventStream) {
        var svc = {};

        svc.oldScrollTop = 0;

        svc.scrollEvent = eventStream();

        svc.win = angular.element($window);

        svc.init = function () {
            svc.win.on('scroll.windowScroll', svc.onScroll);
            return svc;
        };

        svc.onScroll = function () {
            var scrollTop = svc.getScrollTop(),
                dir = scrollTop >= svc.oldScrollTop ? 'down' : 'up';

            svc.publish({
                dir: dir,
                scrollTop: scrollTop
            });

            svc.oldScrollTop = scrollTop;
        };

        svc.getScrollTop = function () {
            return svc.win.scrollTop();
        };

        svc.publish = function (data) {
            var obj = svc.scrollEvent,
                fn = svc.scrollEvent.publish;

            return fn.apply(obj, arguments);
        };

        svc.subscribe = function () {
            var obj = svc.scrollEvent,
                fn = svc.scrollEvent.subscribe;

            return fn.apply(obj, arguments);
        };

        return svc.init();
    }

    angular
        .module("rpCommon")
        .factory('windowScroll', ['$window', 'eventStream', windowScroll]);
})(angular);

//  Source: _lib\realpage\common\js\services\window-size.js
//  Window Size Service

(function (angular) {
    "use strict";

    function windowSize($window, eventStream) {
        var svc = {};

        svc.win = angular.element($window);

        svc.resizeEvent = eventStream();

        svc.init = function () {
            svc.win.on('resize.windowSize', svc.onResize);
            return svc;
        };

        svc.onResize = function () {
            svc.publish(svc.getSize());
        };

        svc.getSize = function () {
            return {
                width: $window.innerWidth,
                height: $window.innerHeight
            };
        };

        svc.publish = function () {
            var obj = svc.resizeEvent,
                fn = svc.resizeEvent.publish;
            return fn.apply(obj, arguments);
        };

        svc.subscribe = function () {
            var obj = svc.resizeEvent,
                fn = svc.resizeEvent.subscribe;
            return fn.apply(obj, arguments);
        };

        return svc.init();
    }

    angular
        .module("rpCommon")
        .factory('windowSize', ['$window', 'eventStream', windowSize]);
})(angular);



// RealPage Modules

//  Source: ui\lib\realpage\actions-menu\js\scripts.js
//  Source: _lib\realpage\actions-menu\js\_bundle.inc
angular.module("rpActionsMenu", []);

//  Source: _lib\realpage\actions-menu\js\directives\actions-menu-panel.js
//  Actions Menu Panel Directive

(function (angular) {
    "use strict";

    function rpActionsMenuPanel() {
        function link(scope, elem, attr) {}

        return {
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/actions-menu/templates/actions-menu-panel.html"
        };
    }

    angular
        .module("rpActionsMenu")
        .directive("rpActionsMenuPanel", [rpActionsMenuPanel]);
})(angular);

//  Source: _lib\realpage\actions-menu\js\directives\actions-menu.js
//  Actions Menu Directive

(function (angular, undefined) {
    "use strict";

    function rpActionsMenu($rootScope, $compile, $timeout) {
        var body,
            index = 1;

        function link(scope, elem, attr) {
            var panel,
                dir = {},
                model = scope.$eval(attr.model),
                click = "click.actionsMenu" + index++,
                panelHtml = "<rp-actions-menu-panel model='actionsMenuModel' />";

            dir.init = function () {
                if (model) {
                    $timeout(dir.initBody);
                    scope.rpActionsMenu = dir;
                    dir.initElem().loadContext().initPanel();
                }
                else {
                    logc("rpActionsMenu.init: Model is undefined!");
                }

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.initBody = function () {
                body = body || angular.element("body");
            };

            dir.initElem = function () {
                elem.on(click, dir.togglePanelHandler);
                elem.html(model.getToggleText()).addClass(model.getToggleClassNames());
                return dir;
            };

            dir.initPanel = function () {
                var newScope = $rootScope.$new();
                newScope.model = model;
                panel = $compile(panelHtml)(newScope);
                $timeout(dir.appendPanel);
            };

            dir.appendPanel = function () {
                body.append(panel);
            };

            dir.loadContext = function () {
                model.forEachAction(function (action) {
                    action.loadContext(scope);
                });

                return dir;
            };

            dir.togglePanel = function (ev) {
                model.togglePanel().setPanelPosition({
                    top: elem.offset().top + model.getOffsetTop(),
                    left: elem.offset().left + model.getOffsetLeft()
                });

                if (model.panelIsVisible()) {
                    $timeout(dir.bindHide, 10);
                }
                else {
                    body.off(click);
                }
            };

            dir.togglePanelHandler = function (ev) {
                scope.$apply(function () {
                    dir.togglePanel(ev);
                });
            };

            dir.hidePanel = function () {
                scope.$apply(model.hidePanel.bind(model));
            };

            dir.bindHide = function () {
                body.one(click, dir.hidePanel);
            };

            dir.destroy = function () {
                body.off(click);
                model.hidePanel();
                elem.off();
                panel.remove();
                dir.destWatch();
                dir = undefined;
                elem = undefined;
                panel = undefined;
                model = undefined;
                click = undefined;
                scope = undefined;
                panelHtml = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpActionsMenu")
        .directive("rpActionsMenu", [
            "$rootScope",
            "$compile",
            "$timeout",
            rpActionsMenu
        ]);
})(angular);


//  Source: _lib\realpage\actions-menu\js\models\action.js
//  Actions Menu Action Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function MenuAction() {
            var s = this;
            s.init();
        }

        var p = MenuAction.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
            return s;
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            s.data = data || {};
            return s;
        };

        // Actions

        p.loadContext = function (dataSrc) {
            var s = this;
            s.data.context = s.data.context || {};

            if (s.data.contextKeys) {
                s.data.contextKeys.forEach(function (key) {
                    s.data.context[key] = dataSrc[key];
                });
            }
            return s;
        };

        p.activate = function () {
            var s = this;

            if (!s.data.method) {
                logc("MenuAction.activate: method is undefined!");
            }
            else if (typeof s.data.method != "function") {
                logc("MenuAction.activate: method is not a function!");
            }
            else {
                s.data.method(s.data.context);
            }
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
            return s;
        };

        return function (data) {
            return (new MenuAction()).setData(data);
        };
    }

    angular
        .module("rpActionsMenu")
        .factory("rpActionsMenuAction", [factory]);
})(angular);

//  Source: _lib\realpage\actions-menu\js\models\actions-menu.js
//  Actions Menu Model

(function (angular, undefined) {
    "use strict";

    function factory(menuAction) {
        var id = 1;

        function ActionsMenuModel() {
            var s = this;
            s.init();
        }

        var p = ActionsMenuModel.prototype;

        p.init = function () {
            var s = this;

            s.id = id++;

            s.data = {
                actions: [],
                toggleText: "",
                menuOffsetTop: 20,
                menuOffsetLeft: 5,
                menuClassNames: "",
                toggleClassNames: "rp-icon-more"
            };

            s.panel = {
                show: false,
                position: {}
            };

            return s;
        };

        // Getters

        p.getOffsetLeft = function () {
            var s = this;
            return s.data.menuOffsetLeft;
        };

        p.getOffsetTop = function () {
            var s = this;
            return s.data.menuOffsetTop;
        };

        p.getToggleClassNames = function () {
            var s = this;
            return s.data.toggleClassNames;
        };

        p.getToggleText = function () {
            var s = this;
            return s.data.toggleText;
        };

        // Setters

        p.setActions = function (actions) {
            var s = this;
            s.actions = [];
            s.addActions(actions);
            return s;
        };

        p.setData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            s.setActions(s.data.actions);
            return s;
        };

        p.setPanelPosition = function (position) {
            var s = this;
            angular.extend(s.panel.position, position);
            return s;
        };

        // Assertions

        p.panelIsVisible = function () {
            var s = this;
            return s.panel.show;
        };

        // Actions

        p.addActions = function (actions) {
            var s = this;
            s.fixActions(actions);
            actions.forEach(function (actionData) {
                s.actions.push(menuAction(actionData));
            });
            return s;
        };

        p.fixActions = function (actions) {
            actions.forEach(function (action) {
                if (action.data) {
                    action.context = action.data;
                    delete action.data;
                }
            });
        };

        p.forEachAction = function (callback) {
            var s = this;
            s.actions.forEach(callback);
            return s;
        };

        p.hidePanel = function () {
            var s = this;
            s.panel.show = false;
            return s;
        };

        p.togglePanel = function () {
            var s = this;
            s.panel.show = !s.panel.show;
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.actions.forEach(function (action) {
                action.destroy();
            });
            s.actions = undefined;
            return s;
        };

        return function (data) {
            return (new ActionsMenuModel()).setData(data);
        };
    }

    angular
        .module("rpActionsMenu")
        .factory("rpActionsMenuModel", ["rpActionsMenuAction", factory]);
})(angular);


//  Source: _lib\realpage\actions-menu\js\templates\templates.inc.js
angular.module("rpActionsMenu").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/actions-menu/templates/actions-menu-panel.html",
"<div ng-if=\"model.panel.show\" ng-style=\"model.panel.position\" ng-class=\"{open: model.panel.show}\" class=\"{{::model.data.menuClassNames}} rp-actions-menu-panel dropdown\"><ul class=\"rp-actions-menu-list dropdown-menu dropdown-menu-scale dropdown-menu-width\"><li ng-hide=\"action.data.disabled\" ng-repeat=\"action in model.actions\" class=\"rp-actions-menu-item {{::action.data.classNames}}\"><a ng-if=\"action.data.href\" href=\"{{::action.data.href}}\" class=\"rp-actions-menu-item-text {{::action.data.iconClassNames}}\">{{::action.data.text}} </a><span ng-if=\"!action.data.href\" ng-click=\"action.activate()\" class=\"rp-actions-menu-item-text {{::action.data.iconClassNames}}\">{{::action.data.text}}</span></li></ul></div>");
$templateCache.put("realpage/actions-menu/templates/actions-menu.html",
"<span ng-click=\"rpActionsMenu.togglePanel($event)\" class=\"rp-actions-menu {{::model.data.toggleClassNames}}\">{{::model.data.toggleText}}</span>");
}]);

//  Source: ui\lib\realpage\busy-indicator\js\scripts.js
//  Source: _lib\realpage\busy-indicator\js\_bundle.inc
angular.module("rpBusyIndicator", []);

//  Source: _lib\realpage\busy-indicator\js\templates\busy-indicator.js
//  Busy Indicator Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/busy-indicator/busy-indicator.html";

    templateHtml = "" +
        "<div class='rp-busy-indicator {{model.className}} {{model.themeName}}' " +
            "ng-style='model.style' >" +
            "<p class='message-1'>" +
                "Still loading, just a moment" +
                "<dotter model='dotterModel'></dotter>" +
            "</p>" +
            "<p class='message-2'>" +
                "Sorry, we couldn’t complete your request<br/>" +
                "at this time. Please try again later.<br/>" +
                "<span class='message-2-btn btn btn-primary small' ng-click='model.retry()'>" +
                    "Try again" +
                "</span>" +
            "</p>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpBusyIndicator")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\busy-indicator\js\services\busy-indicator-model.js
//  Busy Indicator Model Service

(function (angular, undefined) {
    "use strict";

    var fn = angular.noop;

    function service(eventStream) {
        return function () {
            var model,
                events = eventStream();

            model = {
                retry: fn,

                cancel: fn,

                style: {},

                isBusy: false,

                events: events,

                setThemeName: function (themeName) {
                    model.themeName = themeName;
                },

                busy: function () {
                    model.isBusy = true;
                    events.publish('busy');
                },

                error: function () {
                    events.publish('error');
                },

                off: function () {
                    model.isBusy = false;
                    events.publish('off');
                },

                destroy: function () {
                    events.destroy();
                }
            };

            model.destroy = function () {
                events.destroy();
                model.events = undefined;
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpBusyIndicator")
        .factory('rpBusyIndicatorModel', ['eventStream', service]);
})(angular);

//  Source: _lib\realpage\busy-indicator\js\directives\busy-indicator.js
//  Busy Indicator Directive

(function (angular, undefined) {
    "use strict";

    function rpBusyIndicator(cdnVer, timeout, eventStream) {
        function link(scope, elem, attr) {
            var model,
                dir = {},
                dotterModel = {
                    events: eventStream()
                };

            dir.init = function () {
                if (!scope.model) {
                    logc("rpBusyIndicator: model is undefined!");
                    return;
                }

                model = scope.model;
                scope.dotterModel = dotterModel;

                dir.setStyles();

                if (model.isBusy) {
                    dir.setState("busy");
                }

                scope.dir = dir;

                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.setStateWatch = model.events.subscribe(dir.setState);
            };

            dir.setStyles = function () {
                var ht = elem.outerHeight();
                model.style.lineHeight = ht + "px";
                return dir;
            };

            dir.setState = function (state) {
                var states = ["busy", "error", "off"];

                if (states.contains(state)) {
                    dir[state]();
                }
            };

            dir.setBg = function () {
                var bgi = "../" + cdnVer + "/lib/realpage/busy-indicator/images/default.gif";
                model.style.backgroundImage = "url('" + bgi + "')";
                return dir;
            };

            dir.removeBg = function () {
                model.style.backgroundImage = "";
                return dir;
            };

            dir.busy = function () {
                dir.setBg();
                model.className = "busy";
                timeout.cancel(dir.timer1);
                dir.timer1 = timeout(dir.showMsg, 10000);
            };

            dir.showMsg = function () {
                model.className = "busy msg";
                dotterModel.events.publish("start");
                dir.removeBg().timer2 = timeout(model.error, 50000);
            };

            dir.error = function () {
                model.cancel();
                model.className = "error";
                timeout.cancel(dir.timer1);
                timeout.cancel(dir.timer2);
                dotterModel.events.publish("stop");
            };

            dir.off = function () {
                dir.removeBg();
                model.className = "";
                timeout.cancel(dir.timer1);
                timeout.cancel(dir.timer2);
                dotterModel.events.publish("stop");
                return dir;
            };

            dir.destroy = function () {
                dir.destWatch();
                dir.setStateWatch();
                timeout.cancel(dir.timer1);
                timeout.cancel(dir.timer2);
                dotterModel.events.destroy();

                dir = undefined;
                elem = undefined;
                attr = undefined;
                model = undefined;
                dotterModel = undefined;
                scope.model = undefined;
                scope.dotterModel = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "templates/realpage/busy-indicator/busy-indicator.html"
        };
    }

    angular
        .module("rpBusyIndicator")
        .directive("rpBusyIndicator", [
            "cdnVer",
            "timeout",
            "eventStream",
            rpBusyIndicator
        ]);
})(angular);

//  Source: ui\lib\realpage\date-range\js\scripts.js
//  Source: _lib\realpage\date-range\js\_bundle.inc
angular.module("rpDateRange", []);

//  Source: _lib\realpage\date-range\js\directives\date-range.js
//  Date Range Directive

(function (angular) {
    "use strict";

    function rpDateRange() {
        function link(scope, elem, attr) {
            var endOptions,
                startOptions,
                defaultOptions;

            defaultOptions = {
                maxLength: 10,
                anchorRight: false,
                displayFormat: 'MM/DD/YY'
            };

            endOptions = {
                min: scope.range.startDate
            };

            startOptions = {
                max: scope.range.endDate
            };

            scope.endOptions = angular.extend({}, defaultOptions, scope.options, endOptions);
            scope.startOptions = angular.extend({}, defaultOptions, scope.options, startOptions);

            scope.$watchGroup(['range.startDate', 'range.endDate'], function (newVal) {
                scope.endOptions.min = newVal[0];
                scope.startOptions.max = newVal[1];
            });
        }

        return {
            scope: {
                range: '=',
                options: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/form/date-range/date-range.html"
        };
    }

    angular
        .module("rpDateRange")
        .directive('rpDateRange', [rpDateRange]);
})(angular);

//  Source: _lib\realpage\date-range\js\templates\date-range.js
//  Date Range Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/form/date-range/date-range.html";

    templateHtml = "" +
        "<div class='rp-date-range'>" +
            "<rp-input-date " +
                "model='range.startDate' " +
                "options='startOptions'>" +
            "</rp-input-date>" +

            "<span class='to'>-</span>" +

            "<rp-input-date " +
                "model='range.endDate' " +
                "options='endOptions'>" +
            "</rp-input-date>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpDateRange")
        .run(['$templateCache', installTemplate]);
})(angular);


//  Source: ui\lib\realpage\datetimepicker-v1\js\scripts.js
//  Source: _lib\realpage\datetimepicker-v1\js\plugins\bootstrap-datetimepicker.js
/*! version : 4.17.47 [Modified]
 =========================================================
 bootstrap-datetimejs
 https://github.com/Eonasdan/bootstrap-datetimepicker
 Copyright (c) 2015 Jonathan Peterson
 =========================================================
 */
/*
 The MIT License (MIT)

 Copyright (c) 2015 Jonathan Peterson

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
/*global define:false */
/*global exports:false */
/*global require:false */
/*global jQuery:false */
/*global moment:false */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD is used - Register as an anonymous module.
        define(['jquery', 'moment'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'), require('moment'));
    } else {
        // Neither AMD nor CommonJS used. Use global variables.
        if (typeof jQuery === 'undefined') {
            throw 'bootstrap-datetimepicker requires jQuery to be loaded first';
        }
        if (typeof moment === 'undefined') {
            throw 'bootstrap-datetimepicker requires Moment.js to be loaded first';
        }
        factory(jQuery, moment);
    }
}(function ($, moment) {
    'use strict';
    if (!moment) {
        throw new Error('bootstrap-datetimepicker requires Moment.js to be loaded first');
    }

    var dateTimePicker = function (element, options) {
        var picker = {},
            date,
            viewDate,
            unset = true,
            input,
            component = false,
            widget = false,
            use24Hours,
            minViewModeNumber = 0,
            actualFormat,
            parseFormats,
            currentViewMode,
            datePickerModes = [
                {
                    clsName: 'days',
                    navFnc: 'M',
                    navStep: 1
                },
                {
                    clsName: 'months',
                    navFnc: 'y',
                    navStep: 1
                },
                {
                    clsName: 'years',
                    navFnc: 'y',
                    navStep: 10
                },
                {
                    clsName: 'decades',
                    navFnc: 'y',
                    navStep: 100
                }
            ],
            viewModes = ['days', 'months', 'years', 'decades'],
            verticalModes = ['top', 'bottom', 'auto'],
            horizontalModes = ['left', 'right', 'auto'],
            toolbarPlacements = ['default', 'top', 'bottom'],
            keyMap = {
                'up': 38,
                38: 'up',
                'down': 40,
                40: 'down',
                'left': 37,
                37: 'left',
                'right': 39,
                39: 'right',
                'tab': 9,
                9: 'tab',
                'escape': 27,
                27: 'escape',
                'enter': 13,
                13: 'enter',
                'pageUp': 33,
                33: 'pageUp',
                'pageDown': 34,
                34: 'pageDown',
                'shift': 16,
                16: 'shift',
                'control': 17,
                17: 'control',
                'space': 32,
                32: 'space',
                't': 84,
                84: 't',
                'delete': 46,
                46: 'delete'
            },
            keyState = {},

            /********************************************************************************
             *
             * Private functions
             *
             ********************************************************************************/

            hasTimeZone = function () {
                return moment.tz !== undefined && options.timeZone !== undefined && options.timeZone !== null && options.timeZone !== '';
            },

            getMoment = function (d) {
                var returnMoment;

                if (d === undefined || d === null) {
                    returnMoment = moment(); //TODO should this use format? and locale?
                } else if (moment.isDate(d) || moment.isMoment(d)) {
                    // If the date that is passed in is already a Date() or moment() object,
                    // pass it directly to moment.
                    returnMoment = moment(d);
                } else if (hasTimeZone()) { // There is a string to parse and a default time zone
                    // parse with the tz function which takes a default time zone if it is not in the format string
                    returnMoment = moment.tz(d, parseFormats, options.useStrict, options.timeZone);
                } else {
                    returnMoment = moment(d, parseFormats, options.useStrict);
                }

                if (hasTimeZone()) {
                    returnMoment.tz(options.timeZone);
                }

                return returnMoment;
            },

            isEnabled = function (granularity) {
                if (typeof granularity !== 'string' || granularity.length > 1) {
                    throw new TypeError('isEnabled expects a single character string parameter');
                }
                switch (granularity) {
                    case 'y':
                        return actualFormat.indexOf('Y') !== -1;
                    case 'M':
                        return actualFormat.indexOf('M') !== -1;
                    case 'd':
                        return actualFormat.toLowerCase().indexOf('d') !== -1;
                    case 'h':
                    case 'H':
                        return actualFormat.toLowerCase().indexOf('h') !== -1;
                    case 'm':
                        return actualFormat.indexOf('m') !== -1;
                    case 's':
                        return actualFormat.indexOf('s') !== -1;
                    default:
                        return false;
                }
            },

            hasTime = function () {
                return (isEnabled('h') || isEnabled('m') || isEnabled('s'));
            },

            hasDate = function () {
                return (isEnabled('y') || isEnabled('M') || isEnabled('d'));
            },

            getDatePickerTemplate = function () {
                var headTemplate = $('<thead>')
                        .append($('<tr>')
                            .append($('<th>').addClass('prev').attr('data-action', 'previous')
                                .append($('<span>').addClass(options.icons.previous))
                                )
                            .append($('<th>').addClass('picker-switch').attr('data-action', 'pickerSwitch').attr('colspan', (options.calendarWeeks ? '6' : '5')))
                            .append($('<th>').addClass('next').attr('data-action', 'next')
                                .append($('<span>').addClass(options.icons.next))
                                )
                            ),
                    contTemplate = $('<tbody>')
                        .append($('<tr>')
                            .append($('<td>').attr('colspan', (options.calendarWeeks ? '8' : '7')))
                            );

                return [
                    $('<div>').addClass('datepicker-days')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate)
                            .append($('<tbody>'))
                            ),
                    $('<div>').addClass('datepicker-months')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                            ),
                    $('<div>').addClass('datepicker-years')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                            ),
                    $('<div>').addClass('datepicker-decades')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                            )
                ];
            },

            getTimePickerMainTemplate = function () {
                var topRow = $('<tr>'),
                    middleRow = $('<tr>'),
                    bottomRow = $('<tr>');

                if (isEnabled('h')) {
                    topRow.append($('<td>')
                        .append($('<a>').attr({ href: '#', tabindex: '-1', 'title': options.tooltips.incrementHour }).addClass('btn').attr('data-action', 'incrementHours').append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-hour').attr({ 'data-time-component': 'hours', 'title': options.tooltips.pickHour }).attr('data-action', 'showHours')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({ href: '#', tabindex: '-1', 'title': options.tooltips.decrementHour }).addClass('btn').attr('data-action', 'decrementHours').append($('<span>').addClass(options.icons.down))));
                }
                if (isEnabled('m')) {
                    if (isEnabled('h')) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>')
                        .append($('<a>').attr({ href: '#', tabindex: '-1', 'title': options.tooltips.incrementMinute }).addClass('btn').attr('data-action', 'incrementMinutes')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-minute').attr({ 'data-time-component': 'minutes', 'title': options.tooltips.pickMinute }).attr('data-action', 'showMinutes')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({ href: '#', tabindex: '-1', 'title': options.tooltips.decrementMinute }).addClass('btn').attr('data-action', 'decrementMinutes')
                            .append($('<span>').addClass(options.icons.down))));
                }
                if (isEnabled('s')) {
                    if (isEnabled('m')) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>')
                        .append($('<a>').attr({ href: '#', tabindex: '-1', 'title': options.tooltips.incrementSecond }).addClass('btn').attr('data-action', 'incrementSeconds')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-second').attr({ 'data-time-component': 'seconds', 'title': options.tooltips.pickSecond }).attr('data-action', 'showSeconds')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({ href: '#', tabindex: '-1', 'title': options.tooltips.decrementSecond }).addClass('btn').attr('data-action', 'decrementSeconds')
                            .append($('<span>').addClass(options.icons.down))));
                }

                if (!use24Hours) {
                    topRow.append($('<td>').addClass('separator'));
                    middleRow.append($('<td>')
                        .append($('<button>').addClass('btn btn-primary').attr({ 'data-action': 'togglePeriod', tabindex: '-1', 'title': options.tooltips.togglePeriod })));
                    bottomRow.append($('<td>').addClass('separator'));
                }

                return $('<div>').addClass('timepicker-picker')
                    .append($('<table>').addClass('table-condensed')
                        .append([topRow, middleRow, bottomRow]));
            },

            getTimePickerTemplate = function () {
                var hoursView = $('<div>').addClass('timepicker-hours')
                        .append($('<table>').addClass('table-condensed')),
                    minutesView = $('<div>').addClass('timepicker-minutes')
                        .append($('<table>').addClass('table-condensed')),
                    secondsView = $('<div>').addClass('timepicker-seconds')
                        .append($('<table>').addClass('table-condensed')),
                    ret = [getTimePickerMainTemplate()];

                if (isEnabled('h')) {
                    ret.push(hoursView);
                }
                if (isEnabled('m')) {
                    ret.push(minutesView);
                }
                if (isEnabled('s')) {
                    ret.push(secondsView);
                }

                return ret;
            },

            getToolbar = function () {
                var row = [];
                if (options.showTodayButton) {
                    row.push($('<td>').append($('<a>').attr({ 'data-action': 'today', 'title': options.tooltips.today }).append($('<span>').addClass(options.icons.today))));
                }
                if (!options.sideBySide && hasDate() && hasTime()) {
                    row.push($('<td>').append($('<a>').attr({ 'data-action': 'togglePicker', 'title': options.tooltips.selectTime }).append($('<span>').addClass(options.icons.time))));
                }
                if (options.showClear) {
                    row.push($('<td>').append($('<a>').attr({ 'data-action': 'clear', 'title': options.tooltips.clear }).append($('<span>').addClass(options.icons.clear))));
                }
                if (options.showClose) {
                    row.push($('<td>').append($('<a>').attr({ 'data-action': 'close', 'title': options.tooltips.close }).append($('<span>').addClass(options.icons.close))));
                }
                return $('<table>').addClass('table-condensed').append($('<tbody>').append($('<tr>').append(row)));
            },

            getTemplate = function () {
                var template = $('<div>').addClass('bootstrap-datetimepicker-widget dropdown-menu'),
                    dateView = $('<div>').addClass('datepicker').append(getDatePickerTemplate()),
                    timeView = $('<div>').addClass('timepicker').append(getTimePickerTemplate()),
                    content = $('<ul>').addClass('list-unstyled'),
                    toolbar = $('<li>').addClass('picker-switch' + (options.collapse ? ' accordion-toggle' : '')).append(getToolbar());

                if (options.inline) {
                    template.removeClass('dropdown-menu');
                }

                if (use24Hours) {
                    template.addClass('usetwentyfour');
                }

                if (isEnabled('s') && !use24Hours) {
                    template.addClass('wider');
                }

                if (options.sideBySide && hasDate() && hasTime()) {
                    template.addClass('timepicker-sbs');
                    if (options.toolbarPlacement === 'top') {
                        template.append(toolbar);
                    }
                    template.append(
                        $('<div>').addClass('row')
                            .append(dateView.addClass('col-md-6'))
                            .append(timeView.addClass('col-md-6'))
                    );
                    if (options.toolbarPlacement === 'bottom') {
                        template.append(toolbar);
                    }
                    return template;
                }

                if (options.toolbarPlacement === 'top') {
                    content.append(toolbar);
                }
                if (hasDate()) {
                    content.append($('<li>').addClass((options.collapse && hasTime() ? 'collapse in' : '')).append(dateView));
                }
                if (options.toolbarPlacement === 'default') {
                    content.append(toolbar);
                }
                if (hasTime()) {
                    content.append($('<li>').addClass((options.collapse && hasDate() ? 'collapse' : '')).append(timeView));
                }
                if (options.toolbarPlacement === 'bottom') {
                    content.append(toolbar);
                }
                return template.append(content);
            },

            dataToOptions = function () {
                var eData,
                    dataOptions = {};

                if (element.is('input') || options.inline) {
                    eData = element.data();
                } else {
                    eData = element.find('input').data();
                }

                if (eData.dateOptions && eData.dateOptions instanceof Object) {
                    dataOptions = $.extend(true, dataOptions, eData.dateOptions);
                }

                $.each(options, function (key) {
                    var attributeName = 'date' + key.charAt(0).toUpperCase() + key.slice(1);
                    if (eData[attributeName] !== undefined) {
                        dataOptions[key] = eData[attributeName];
                    }
                });
                return dataOptions;
            },

            place = function () {
                var position = (component || element).position(),
                    offset = (component || element).offset(),
                    vertical = options.widgetPositioning.vertical,
                    horizontal = options.widgetPositioning.horizontal,
                    parent;

                if (options.widgetParent) {
                    parent = options.widgetParent.append(widget);
                } else if (element.is('input')) {
                    parent = element.after(widget).parent();
                } else if (options.inline) {
                    parent = element.append(widget);
                    return;
                } else {
                    parent = element;
                    element.children().first().after(widget);
                }

                // Top and bottom logic
                if (vertical === 'auto') {
                    if (offset.top + widget.height() * 1.5 >= $(window).height() + $(window).scrollTop() &&
                        widget.height() + element.outerHeight() < offset.top) {
                        vertical = 'top';
                    } else {
                        vertical = 'bottom';
                    }
                }

                // Left and right logic
                if (horizontal === 'auto') {
                    if (parent.width() < offset.left + widget.outerWidth() / 2 &&
                        offset.left + widget.outerWidth() > $(window).width()) {
                        horizontal = 'right';
                    } else {
                        horizontal = 'left';
                    }
                }

                if (vertical === 'top') {
                    widget.addClass('top').removeClass('bottom');
                } else {
                    widget.addClass('bottom').removeClass('top');
                }

                if (horizontal === 'right') {
                    widget.addClass('pull-right');
                } else {
                    widget.removeClass('pull-right');
                }

                // find the first parent element that has a non-static css positioning
                if (parent.css('position') === 'static') {
                    parent = parent.parents().filter(function () {
                        return $(this).css('position') !== 'static';
                    }).first();
                }

                if (parent.length === 0) {
                    throw new Error('datetimepicker component should be placed within a non-static positioned container');
                }

                widget.css({
                    top: vertical === 'top' ? 'auto' : position.top + element.outerHeight(),
                    bottom: vertical === 'top' ? parent.outerHeight() - (parent === element ? 0 : position.top) : 'auto',
                    left: horizontal === 'left' ? (parent === element ? 0 : position.left) : 'auto',
                    right: horizontal === 'left' ? 'auto' : parent.outerWidth() - element.outerWidth() - (parent === element ? 0 : position.left)
                });
            },

            notifyEvent = function (e) {
                if (e.type === 'dp.change' && ((e.date && e.date.isSame(e.oldDate)) || (!e.date && !e.oldDate))) {
                    return;
                }
                element.trigger(e);
            },

            viewUpdate = function (e) {
                if (e === 'y') {
                    e = 'YYYY';
                }
                notifyEvent({
                    type: 'dp.update',
                    change: e,
                    viewDate: viewDate.clone()
                });
            },

            showMode = function (dir) {
                if (!widget) {
                    return;
                }
                if (dir) {
                    currentViewMode = Math.max(minViewModeNumber, Math.min(3, currentViewMode + dir));
                }
                widget.find('.datepicker > div').hide().filter('.datepicker-' + datePickerModes[currentViewMode].clsName).show();
            },

            fillDow = function () {
                var row = $('<tr>'),
                    currentDate = viewDate.clone().startOf('w').startOf('d');

                if (options.calendarWeeks === true) {
                    row.append($('<th>').addClass('cw').text('#'));
                }

                while (currentDate.isBefore(viewDate.clone().endOf('w'))) {
                    row.append($('<th>').addClass('dow').text(currentDate.format('dd')));
                    currentDate.add(1, 'd');
                }
                widget.find('.datepicker-days thead').append(row);
            },

            isInDisabledDates = function (testDate) {
                return options.disabledDates[testDate.format('YYYY-MM-DD')] === true;
            },

            isInEnabledDates = function (testDate) {
                return options.enabledDates[testDate.format('YYYY-MM-DD')] === true;
            },

            isInDisabledHours = function (testDate) {
                return options.disabledHours[testDate.format('H')] === true;
            },

            isInEnabledHours = function (testDate) {
                return options.enabledHours[testDate.format('H')] === true;
            },

            isValid = function (targetMoment, granularity) {
                if (!targetMoment.isValid()) {
                    return false;
                }
                if (options.disabledDates && granularity === 'd' && isInDisabledDates(targetMoment)) {
                    return false;
                }
                if (options.enabledDates && granularity === 'd' && !isInEnabledDates(targetMoment)) {
                    return false;
                }
                if (options.minDate && targetMoment.isBefore(options.minDate, granularity)) {
                    return false;
                }
                if (options.maxDate && targetMoment.isAfter(options.maxDate, granularity)) {
                    return false;
                }
                if (options.daysOfWeekDisabled && granularity === 'd' && options.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
                    return false;
                }
                if (options.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && isInDisabledHours(targetMoment)) {
                    return false;
                }
                if (options.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && !isInEnabledHours(targetMoment)) {
                    return false;
                }
                if (options.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's')) {
                    var found = false;
                    $.each(options.disabledTimeIntervals, function () {
                        if (targetMoment.isBetween(this[0], this[1])) {
                            found = true;
                            return false;
                        }
                    });
                    if (found) {
                        return false;
                    }
                }
                return true;
            },

            fillMonths = function () {
                var spans = [],
                    monthsShort = viewDate.clone().startOf('y').startOf('d');
                while (monthsShort.isSame(viewDate, 'y')) {
                    spans.push($('<span>').attr('data-action', 'selectMonth').addClass('month').text(monthsShort.format('MMM')));
                    monthsShort.add(1, 'M');
                }
                widget.find('.datepicker-months td').empty().append(spans);
            },

            updateMonths = function () {
                var monthsView = widget.find('.datepicker-months'),
                    monthsViewHeader = monthsView.find('th'),
                    months = monthsView.find('tbody').find('span');

                monthsViewHeader.eq(0).find('span').attr('title', options.tooltips.prevYear);
                monthsViewHeader.eq(1).attr('title', options.tooltips.selectYear);
                monthsViewHeader.eq(2).find('span').attr('title', options.tooltips.nextYear);

                monthsView.find('.disabled').removeClass('disabled');

                if (!isValid(viewDate.clone().subtract(1, 'y'), 'y')) {
                    monthsViewHeader.eq(0).addClass('disabled');
                }

                monthsViewHeader.eq(1).text(viewDate.year());

                if (!isValid(viewDate.clone().add(1, 'y'), 'y')) {
                    monthsViewHeader.eq(2).addClass('disabled');
                }

                months.removeClass('active');
                if (date.isSame(viewDate, 'y') && !unset) {
                    months.eq(date.month()).addClass('active');
                }

                months.each(function (index) {
                    if (!isValid(viewDate.clone().month(index), 'M')) {
                        $(this).addClass('disabled');
                    }
                });
            },

            updateYears = function () {
                var yearsView = widget.find('.datepicker-years'),
                    yearsViewHeader = yearsView.find('th'),
                    startYear = viewDate.clone().subtract(5, 'y'),
                    endYear = viewDate.clone().add(6, 'y'),
                    html = '';

                yearsViewHeader.eq(0).find('span').attr('title', options.tooltips.prevDecade);
                yearsViewHeader.eq(1).attr('title', options.tooltips.selectDecade);
                yearsViewHeader.eq(2).find('span').attr('title', options.tooltips.nextDecade);

                yearsView.find('.disabled').removeClass('disabled');

                if (options.minDate && options.minDate.isAfter(startYear, 'y')) {
                    yearsViewHeader.eq(0).addClass('disabled');
                }

                yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());

                if (options.maxDate && options.maxDate.isBefore(endYear, 'y')) {
                    yearsViewHeader.eq(2).addClass('disabled');
                }

                while (!startYear.isAfter(endYear, 'y')) {
                    html += '<span data-action="selectYear" class="year' + (startYear.isSame(date, 'y') && !unset ? ' active' : '') + (!isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';
                    startYear.add(1, 'y');
                }

                yearsView.find('td').html(html);
            },

            updateDecades = function () {
                var decadesView = widget.find('.datepicker-decades'),
                    decadesViewHeader = decadesView.find('th'),
                    startDecade = moment({ y: viewDate.year() - (viewDate.year() % 100) - 1 }),
                    endDecade = startDecade.clone().add(100, 'y'),
                    startedAt = startDecade.clone(),
                    minDateDecade = false,
                    maxDateDecade = false,
                    endDecadeYear,
                    html = '';

                decadesViewHeader.eq(0).find('span').attr('title', options.tooltips.prevCentury);
                decadesViewHeader.eq(2).find('span').attr('title', options.tooltips.nextCentury);

                decadesView.find('.disabled').removeClass('disabled');

                if (startDecade.isSame(moment({ y: 1900 })) || (options.minDate && options.minDate.isAfter(startDecade, 'y'))) {
                    decadesViewHeader.eq(0).addClass('disabled');
                }

                decadesViewHeader.eq(1).text(startDecade.year() + '-' + endDecade.year());

                if (startDecade.isSame(moment({ y: 2000 })) || (options.maxDate && options.maxDate.isBefore(endDecade, 'y'))) {
                    decadesViewHeader.eq(2).addClass('disabled');
                }

                while (!startDecade.isAfter(endDecade, 'y')) {
                    endDecadeYear = startDecade.year() + 12;
                    minDateDecade = options.minDate && options.minDate.isAfter(startDecade, 'y') && options.minDate.year() <= endDecadeYear;
                    maxDateDecade = options.maxDate && options.maxDate.isAfter(startDecade, 'y') && options.maxDate.year() <= endDecadeYear;
                    html += '<span data-action="selectDecade" class="decade' + (date.isAfter(startDecade) && date.year() <= endDecadeYear ? ' active' : '') +
                        (!isValid(startDecade, 'y') && !minDateDecade && !maxDateDecade ? ' disabled' : '') + '" data-selection="' + (startDecade.year() + 6) + '">' + (startDecade.year() + 1) + ' - ' + (startDecade.year() + 12) + '</span>';
                    startDecade.add(12, 'y');
                }
                html += '<span></span><span></span><span></span>'; //push the dangling block over, at least this way it's even

                decadesView.find('td').html(html);
                decadesViewHeader.eq(1).text((startedAt.year() + 1) + '-' + (startDecade.year()));
            },

            fillDate = function () {
                var daysView = widget.find('.datepicker-days'),
                    daysViewHeader = daysView.find('th'),
                    currentDate,
                    html = [],
                    row,
                    clsNames = [],
                    i;

                if (!hasDate()) {
                    return;
                }

                daysViewHeader.eq(0).find('span').attr('title', options.tooltips.prevMonth);
                daysViewHeader.eq(1).attr('title', options.tooltips.selectMonth);
                daysViewHeader.eq(2).find('span').attr('title', options.tooltips.nextMonth);

                daysView.find('.disabled').removeClass('disabled');
                daysViewHeader.eq(1).text(viewDate.format(options.dayViewHeaderFormat));

                if (!isValid(viewDate.clone().subtract(1, 'M'), 'M')) {
                    daysViewHeader.eq(0).addClass('disabled');
                }
                if (!isValid(viewDate.clone().add(1, 'M'), 'M')) {
                    daysViewHeader.eq(2).addClass('disabled');
                }

                currentDate = viewDate.clone().startOf('M').startOf('w').startOf('d');

                for (i = 0; i < 42; i++) { //always display 42 days (should show 6 weeks)
                    if (currentDate.weekday() === 0) {
                        row = $('<tr>');
                        if (options.calendarWeeks) {
                            row.append('<td class="cw">' + currentDate.week() + '</td>');
                        }
                        html.push(row);
                    }
                    clsNames = ['day'];
                    if (currentDate.isBefore(viewDate, 'M')) {
                        clsNames.push('old');
                    }
                    if (currentDate.isAfter(viewDate, 'M')) {
                        clsNames.push('new');
                    }
                    if (currentDate.isSame(date, 'd') && !unset) {
                        clsNames.push('active');
                    }
                    if (!isValid(currentDate, 'd')) {
                        clsNames.push('disabled');
                    }
                    if (currentDate.isSame(getMoment(), 'd')) {
                        clsNames.push('today');
                    }
                    if (currentDate.day() === 0 || currentDate.day() === 6) {
                        clsNames.push('weekend');
                    }
                    notifyEvent({
                        type: 'dp.classify',
                        date: currentDate,
                        classNames: clsNames
                    });
                    row.append('<td data-action="selectDay" data-day="' + currentDate.format('L') + '" class="' + clsNames.join(' ') + '">' + currentDate.date() + '</td>');
                    currentDate.add(1, 'd');
                }

                daysView.find('tbody').empty().append(html);

                updateMonths();

                updateYears();

                updateDecades();
            },

            fillHours = function () {
                var table = widget.find('.timepicker-hours table'),
                    currentHour = viewDate.clone().startOf('d'),
                    html = [],
                    row = $('<tr>');

                if (viewDate.hour() > 11 && !use24Hours) {
                    currentHour.hour(12);
                }
                while (currentHour.isSame(viewDate, 'd') && (use24Hours || (viewDate.hour() < 12 && currentHour.hour() < 12) || viewDate.hour() > 11)) {
                    if (currentHour.hour() % 4 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectHour" class="hour' + (!isValid(currentHour, 'h') ? ' disabled' : '') + '">' + currentHour.format(use24Hours ? 'HH' : 'hh') + '</td>');
                    currentHour.add(1, 'h');
                }
                table.empty().append(html);
            },

            fillMinutes = function () {
                var table = widget.find('.timepicker-minutes table'),
                    currentMinute = viewDate.clone().startOf('h'),
                    html = [],
                    row = $('<tr>'),
                    step = options.stepping === 1 ? 5 : options.stepping;

                while (viewDate.isSame(currentMinute, 'h')) {
                    if (currentMinute.minute() % (step * 4) === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectMinute" class="minute' + (!isValid(currentMinute, 'm') ? ' disabled' : '') + '">' + currentMinute.format('mm') + '</td>');
                    currentMinute.add(step, 'm');
                }
                table.empty().append(html);
            },

            fillSeconds = function () {
                var table = widget.find('.timepicker-seconds table'),
                    currentSecond = viewDate.clone().startOf('m'),
                    html = [],
                    row = $('<tr>');

                while (viewDate.isSame(currentSecond, 'm')) {
                    if (currentSecond.second() % 20 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectSecond" class="second' + (!isValid(currentSecond, 's') ? ' disabled' : '') + '">' + currentSecond.format('ss') + '</td>');
                    currentSecond.add(5, 's');
                }

                table.empty().append(html);
            },

            fillTime = function () {
                var toggle, newDate, timeComponents = widget.find('.timepicker span[data-time-component]');

                if (!use24Hours) {
                    toggle = widget.find('.timepicker [data-action=togglePeriod]');
                    newDate = date.clone().add((date.hours() >= 12) ? -12 : 12, 'h');

                    toggle.text(date.format('A'));

                    if (isValid(newDate, 'h')) {
                        toggle.removeClass('disabled');
                    } else {
                        toggle.addClass('disabled');
                    }
                }
                timeComponents.filter('[data-time-component=hours]').text(date.format(use24Hours ? 'HH' : 'hh'));
                timeComponents.filter('[data-time-component=minutes]').text(date.format('mm'));
                timeComponents.filter('[data-time-component=seconds]').text(date.format('ss'));

                fillHours();
                fillMinutes();
                fillSeconds();
            },

            update = function () {
                if (!widget) {
                    return;
                }
                fillDate();
                fillTime();
            },

            setValue = function (targetMoment) {
                var oldDate = unset ? null : date;

                // case of calling setValue(null or false)
                if (!targetMoment) {
                    unset = true;
                    input.val('');
                    element.data('date', '');
                    notifyEvent({
                        type: 'dp.change',
                        date: false,
                        oldDate: oldDate
                    });
                    update();
                    return;
                }

                targetMoment = targetMoment.clone().locale(options.locale).add(1, "seconds");

                if (hasTimeZone()) {
                    targetMoment.tz(options.timeZone);
                }

                if (options.stepping !== 1) {
                    targetMoment.minutes((Math.round(targetMoment.minutes() / options.stepping) * options.stepping)).seconds(0);

                    while (options.minDate && targetMoment.isBefore(options.minDate)) {
                        targetMoment.add(options.stepping, 'minutes');
                    }
                }

                if (isValid(targetMoment)) {
                    date = targetMoment;
                    viewDate = date.clone();
                    input.val(date.format(actualFormat));
                    element.data('date', date.format(actualFormat));
                    unset = false;
                    update();
                    notifyEvent({
                        type: 'dp.change',
                        date: date.clone(),
                        oldDate: oldDate
                    });
                } else {
                    if (!options.keepInvalid) {
                        input.val(unset ? '' : date.format(actualFormat));
                    } else {
                        notifyEvent({
                            type: 'dp.change',
                            date: targetMoment,
                            oldDate: oldDate
                        });
                    }
                    notifyEvent({
                        type: 'dp.error',
                        date: targetMoment,
                        oldDate: oldDate
                    });
                }
            },

            /**
             * Hides the widget. Possibly will emit dp.hide
             */
            hide = function () {
                var transitioning = false;
                if (!widget) {
                    return picker;
                }
                // Ignore event if in the middle of a picker transition
                widget.find('.collapse').each(function () {
                    var collapseData = $(this).data('collapse');
                    if (collapseData && collapseData.transitioning) {
                        transitioning = true;
                        return false;
                    }
                    return true;
                });
                if (transitioning) {
                    return picker;
                }
                if (component && component.hasClass('btn')) {
                    component.toggleClass('active');
                }
                widget.hide();

                $(window).off('resize', place);
                widget.off('click', '[data-action]');
                widget.off('mousedown', false);

                widget.remove();
                widget = false;

                notifyEvent({
                    type: 'dp.hide',
                    date: date.clone()
                });

                input.blur();

                viewDate = date.clone();

                return picker;
            },

            clear = function () {
                setValue(null);
            },

            parseInputDate = function (inputDate) {
                if (options.parseInputDate === undefined) {
                    if (!moment.isMoment(inputDate) || inputDate instanceof Date) {
                        inputDate = getMoment(inputDate);
                    }
                } else {
                    inputDate = options.parseInputDate(inputDate);
                }
                //inputDate.locale(options.locale);
                return inputDate;
            },

            /********************************************************************************
             *
             * Widget UI interaction functions
             *
             ********************************************************************************/
            actions = {
                next: function () {
                    var navFnc = datePickerModes[currentViewMode].navFnc;
                    viewDate.add(datePickerModes[currentViewMode].navStep, navFnc);
                    fillDate();
                    viewUpdate(navFnc);
                },

                previous: function () {
                    var navFnc = datePickerModes[currentViewMode].navFnc;
                    viewDate.subtract(datePickerModes[currentViewMode].navStep, navFnc);
                    fillDate();
                    viewUpdate(navFnc);
                },

                pickerSwitch: function () {
                    showMode(1);
                },

                selectMonth: function (e) {
                    var month = $(e.target).closest('tbody').find('span').index($(e.target));
                    viewDate.month(month);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()).month(viewDate.month()));
                        if (!options.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('M');
                },

                selectYear: function (e) {
                    var year = parseInt($(e.target).text(), 10) || 0;
                    viewDate.year(year);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()));
                        if (!options.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('YYYY');
                },

                selectDecade: function (e) {
                    var year = parseInt($(e.target).data('selection'), 10) || 0;
                    viewDate.year(year);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()));
                        if (!options.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('YYYY');
                },

                selectDay: function (e) {
                    var day = viewDate.clone();
                    if ($(e.target).is('.old')) {
                        day.subtract(1, 'M');
                    }
                    if ($(e.target).is('.new')) {
                        day.add(1, 'M');
                    }
                    setValue(day.date(parseInt($(e.target).text(), 10)));
                    if (!hasTime() && !options.keepOpen && !options.inline) {
                        hide();
                    }
                },

                incrementHours: function () {
                    var newDate = date.clone().add(1, 'h');
                    if (isValid(newDate, 'h')) {
                        setValue(newDate);
                    }
                },

                incrementMinutes: function () {
                    var newDate = date.clone().add(options.stepping, 'm');
                    if (isValid(newDate, 'm')) {
                        setValue(newDate);
                    }
                },

                incrementSeconds: function () {
                    var newDate = date.clone().add(1, 's');
                    if (isValid(newDate, 's')) {
                        setValue(newDate);
                    }
                },

                decrementHours: function () {
                    var newDate = date.clone().subtract(1, 'h');
                    if (isValid(newDate, 'h')) {
                        setValue(newDate);
                    }
                },

                decrementMinutes: function () {
                    var newDate = date.clone().subtract(options.stepping, 'm');
                    if (isValid(newDate, 'm')) {
                        setValue(newDate);
                    }
                },

                decrementSeconds: function () {
                    var newDate = date.clone().subtract(1, 's');
                    if (isValid(newDate, 's')) {
                        setValue(newDate);
                    }
                },

                togglePeriod: function () {
                    setValue(date.clone().add((date.hours() >= 12) ? -12 : 12, 'h'));
                },

                togglePicker: function (e) {
                    var $this = $(e.target),
                        $parent = $this.closest('ul'),
                        expanded = $parent.find('.in'),
                        closed = $parent.find('.collapse:not(.in)'),
                        collapseData;

                    if (expanded && expanded.length) {
                        collapseData = expanded.data('collapse');
                        if (collapseData && collapseData.transitioning) {
                            return;
                        }
                        if (expanded.collapse) { // if collapse plugin is available through bootstrap.js then use it
                            expanded.collapse('hide');
                            closed.collapse('show');
                        } else { // otherwise just toggle in class on the two views
                            expanded.removeClass('in');
                            closed.addClass('in');
                        }
                        if ($this.is('span')) {
                            $this.toggleClass(options.icons.time + ' ' + options.icons.date);
                        } else {
                            $this.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        }

                        // NOTE: uncomment if toggled state will be restored in show()
                        //if (component) {
                        //    component.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        //}
                    }
                },

                showPicker: function () {
                    widget.find('.timepicker > div:not(.timepicker-picker)').hide();
                    widget.find('.timepicker .timepicker-picker').show();
                },

                showHours: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-hours').show();
                },

                showMinutes: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-minutes').show();
                },

                showSeconds: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-seconds').show();
                },

                selectHour: function (e) {
                    var hour = parseInt($(e.target).text(), 10);

                    if (!use24Hours) {
                        if (date.hours() >= 12) {
                            if (hour !== 12) {
                                hour += 12;
                            }
                        } else {
                            if (hour === 12) {
                                hour = 0;
                            }
                        }
                    }
                    setValue(date.clone().hours(hour));
                    actions.showPicker.call(picker);
                },

                selectMinute: function (e) {
                    setValue(date.clone().minutes(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },

                selectSecond: function (e) {
                    setValue(date.clone().seconds(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },

                clear: clear,

                today: function () {
                    var todaysDate = getMoment();
                    if (isValid(todaysDate, 'd')) {
                        setValue(todaysDate);
                    }
                },

                close: hide
            },

            doAction = function (e) {
                if ($(e.currentTarget).is('.disabled')) {
                    return false;
                }
                actions[$(e.currentTarget).data('action')].apply(picker, arguments);
                return false;
            },

            /**
             * Shows the widget. Possibly will emit dp.show and dp.change
             */
            show = function () {
                var currentMoment,
                    useCurrentGranularity = {
                        'year': function (m) {
                            return m.month(0).date(1).hours(0).seconds(0).minutes(0);
                        },
                        'month': function (m) {
                            return m.date(1).hours(0).seconds(0).minutes(0);
                        },
                        'day': function (m) {
                            return m.hours(0).seconds(0).minutes(0);
                        },
                        'hour': function (m) {
                            return m.seconds(0).minutes(0);
                        },
                        'minute': function (m) {
                            return m.seconds(0);
                        }
                    };

                if (input.prop('disabled') || (!options.ignoreReadonly && input.prop('readonly')) || widget) {
                    return picker;
                }
                if (input.val() !== undefined && input.val().trim().length !== 0) {
                    setValue(parseInputDate(input.val().trim()));
                } else if (unset && options.useCurrent && (options.inline || (input.is('input') && input.val().trim().length === 0))) {
                    currentMoment = getMoment();
                    if (typeof options.useCurrent === 'string') {
                        currentMoment = useCurrentGranularity[options.useCurrent](currentMoment);
                    }
                    setValue(currentMoment);
                }
                widget = getTemplate();

                fillDow();
                fillMonths();

                widget.find('.timepicker-hours').hide();
                widget.find('.timepicker-minutes').hide();
                widget.find('.timepicker-seconds').hide();

                update();
                showMode();

                $(window).on('resize', place);
                widget.on('click', '[data-action]', doAction); // this handles clicks on the widget
                widget.on('mousedown', false);

                if (component && component.hasClass('btn')) {
                    component.toggleClass('active');
                }
                place();
                widget.show();
                if (options.focusOnShow && !input.is(':focus')) {
                    input.focus();
                }

                notifyEvent({
                    type: 'dp.show'
                });
                return picker;
            },

            /**
             * Shows or hides the widget
             */
            toggle = function () {
                return (widget ? hide() : show());
            },

            keydown = function (e) {
                var handler = null,
                    index,
                    index2,
                    pressedKeys = [],
                    pressedModifiers = {},
                    currentKey = e.which,
                    keyBindKeys,
                    allModifiersPressed,
                    pressed = 'p';

                keyState[currentKey] = pressed;

                for (index in keyState) {
                    if (keyState.hasOwnProperty(index) && keyState[index] === pressed) {
                        pressedKeys.push(index);
                        if (parseInt(index, 10) !== currentKey) {
                            pressedModifiers[index] = true;
                        }
                    }
                }

                for (index in options.keyBinds) {
                    if (options.keyBinds.hasOwnProperty(index) && typeof (options.keyBinds[index]) === 'function') {
                        keyBindKeys = index.split(' ');
                        if (keyBindKeys.length === pressedKeys.length && keyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]) {
                            allModifiersPressed = true;
                            for (index2 = keyBindKeys.length - 2; index2 >= 0; index2--) {
                                if (!(keyMap[keyBindKeys[index2]] in pressedModifiers)) {
                                    allModifiersPressed = false;
                                    break;
                                }
                            }
                            if (allModifiersPressed) {
                                handler = options.keyBinds[index];
                                break;
                            }
                        }
                    }
                }

                if (handler) {
                    handler.call(picker, widget);
                    e.stopPropagation();
                    e.preventDefault();
                }
            },

            keyup = function (e) {
                keyState[e.which] = 'r';
                e.stopPropagation();
                e.preventDefault();
            },

            change = function (e) {
                var val = $(e.target).val().trim(),
                    parsedDate = val ? parseInputDate(val) : null;
                setValue(parsedDate);
                e.stopImmediatePropagation();
                return false;
            },

            attachDatePickerElementEvents = function () {
                input.on({
                    'change': change,
                    'blur': options.debug ? '' : hide,
                    'keydown': keydown,
                    'keyup': keyup,
                    'focus': options.allowInputToggle ? show : ''
                });

                if (element.is('input')) {
                    input.on({
                        'focus': show
                    });
                } else if (component) {
                    component.on('click', toggle);
                    component.on('mousedown', false);
                }
            },

            detachDatePickerElementEvents = function () {
                input.off({
                    'change': change,
                    'blur': blur,
                    'keydown': keydown,
                    'keyup': keyup,
                    'focus': options.allowInputToggle ? hide : ''
                });

                if (element.is('input')) {
                    input.off({
                        'focus': show
                    });
                } else if (component) {
                    component.off('click', toggle);
                    component.off('mousedown', false);
                }
            },

            indexGivenDates = function (givenDatesArray) {
                // Store given enabledDates and disabledDates as keys.
                // This way we can check their existence in O(1) time instead of looping through whole array.
                // (for example: options.enabledDates['2014-02-27'] === true)
                var givenDatesIndexed = {};
                $.each(givenDatesArray, function () {
                    var dDate = parseInputDate(this);
                    if (dDate.isValid()) {
                        givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
                    }
                });
                return (Object.keys(givenDatesIndexed).length) ? givenDatesIndexed : false;
            },

            indexGivenHours = function (givenHoursArray) {
                // Store given enabledHours and disabledHours as keys.
                // This way we can check their existence in O(1) time instead of looping through whole array.
                // (for example: options.enabledHours['2014-02-27'] === true)
                var givenHoursIndexed = {};
                $.each(givenHoursArray, function () {
                    givenHoursIndexed[this] = true;
                });
                return (Object.keys(givenHoursIndexed).length) ? givenHoursIndexed : false;
            },

            initFormatting = function () {
                var format = options.format || 'L LT';

                actualFormat = format.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput) {
                    var newinput = date.localeData().longDateFormat(formatInput) || formatInput;
                    return newinput.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput2) { //temp fix for #740
                        return date.localeData().longDateFormat(formatInput2) || formatInput2;
                    });
                });


                parseFormats = options.extraFormats ? options.extraFormats.slice() : [];
                if (parseFormats.indexOf(format) < 0 && parseFormats.indexOf(actualFormat) < 0) {
                    parseFormats.push(actualFormat);
                }

                use24Hours = (actualFormat.toLowerCase().indexOf('a') < 1 && actualFormat.replace(/\[.*?\]/g, '').indexOf('h') < 1);

                if (isEnabled('y')) {
                    minViewModeNumber = 2;
                }
                if (isEnabled('M')) {
                    minViewModeNumber = 1;
                }
                if (isEnabled('d')) {
                    minViewModeNumber = 0;
                }

                currentViewMode = Math.max(minViewModeNumber, currentViewMode);

                if (!unset) {
                    setValue(date);
                }
            };

        /********************************************************************************
         *
         * Public API functions
         * =====================
         *
         * Important: Do not expose direct references to private objects or the options
         * object to the outer world. Always return a clone when returning values or make
         * a clone when setting a private variable.
         *
         ********************************************************************************/
        picker.destroy = function () {
            ///<summary>Destroys the widget and removes all attached event listeners</summary>
            hide();
            detachDatePickerElementEvents();
            element.removeData('DateTimePicker');
            element.removeData('date');
        };

        picker.toggle = toggle;

        picker.show = show;

        picker.hide = hide;

        picker.disable = function () {
            ///<summary>Disables the input element, the component is attached to, by adding a disabled="true" attribute to it.
            ///If the widget was visible before that call it is hidden. Possibly emits dp.hide</summary>
            hide();
            if (component && component.hasClass('btn')) {
                component.addClass('disabled');
            }
            input.prop('disabled', true);
            return picker;
        };

        picker.enable = function () {
            ///<summary>Enables the input element, the component is attached to, by removing disabled attribute from it.</summary>
            if (component && component.hasClass('btn')) {
                component.removeClass('disabled');
            }
            input.prop('disabled', false);
            return picker;
        };

        picker.ignoreReadonly = function (ignoreReadonly) {
            if (arguments.length === 0) {
                return options.ignoreReadonly;
            }
            if (typeof ignoreReadonly !== 'boolean') {
                throw new TypeError('ignoreReadonly () expects a boolean parameter');
            }
            options.ignoreReadonly = ignoreReadonly;
            return picker;
        };

        picker.options = function (newOptions) {
            if (arguments.length === 0) {
                return $.extend(true, {}, options);
            }

            if (!(newOptions instanceof Object)) {
                throw new TypeError('options() options parameter should be an object');
            }
            $.extend(true, options, newOptions);
            $.each(options, function (key, value) {
                if (picker[key] !== undefined) {
                    picker[key](value);
                } else {
                    throw new TypeError('option ' + key + ' is not recognized!');
                }
            });
            return picker;
        };

        picker.date = function (newDate) {
            ///<signature helpKeyword="$.fn.datetimepicker.date">
            ///<summary>Returns the component's model current date, a moment object or null if not set.</summary>
            ///<returns type="Moment">date.clone()</returns>
            ///</signature>
            ///<signature>
            ///<summary>Sets the components model current moment to it. Passing a null value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the options.format and options.useStrict components configuration.</summary>
            ///<param name="newDate" locid="$.fn.datetimepicker.date_p:newDate">Takes string, Date, moment, null parameter.</param>
            ///</signature>
            if (arguments.length === 0) {
                if (unset) {
                    return null;
                }
                return date.clone();
            }

            if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
                throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
            }

            setValue(newDate === null ? null : parseInputDate(newDate));
            return picker;
        };

        picker.format = function (newFormat) {
            ///<summary>test su</summary>
            ///<param name="newFormat">info about para</param>
            ///<returns type="string|boolean">returns foo</returns>
            if (arguments.length === 0) {
                return options.format;
            }

            if ((typeof newFormat !== 'string') && ((typeof newFormat !== 'boolean') || (newFormat !== false))) {
                throw new TypeError('format() expects a string or boolean:false parameter ' + newFormat);
            }

            options.format = newFormat;
            if (actualFormat) {
                initFormatting(); // reinit formatting
            }
            return picker;
        };

        picker.timeZone = function (newZone) {
            if (arguments.length === 0) {
                return options.timeZone;
            }

            if (typeof newZone !== 'string') {
                throw new TypeError('newZone() expects a string parameter');
            }

            options.timeZone = newZone;

            return picker;
        };

        picker.dayViewHeaderFormat = function (newFormat) {
            if (arguments.length === 0) {
                return options.dayViewHeaderFormat;
            }

            if (typeof newFormat !== 'string') {
                throw new TypeError('dayViewHeaderFormat() expects a string parameter');
            }

            options.dayViewHeaderFormat = newFormat;
            return picker;
        };

        picker.extraFormats = function (formats) {
            if (arguments.length === 0) {
                return options.extraFormats;
            }

            if (formats !== false && !(formats instanceof Array)) {
                throw new TypeError('extraFormats() expects an array or false parameter');
            }

            options.extraFormats = formats;
            if (parseFormats) {
                initFormatting(); // reinit formatting
            }
            return picker;
        };

        picker.disabledDates = function (dates) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledDates">
            ///<summary>Returns an array with the currently set disabled dates on the component.</summary>
            ///<returns type="array">options.disabledDates</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.disabledDates_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.disabledDates ? $.extend({}, options.disabledDates) : options.disabledDates);
            }

            if (!dates) {
                options.disabledDates = false;
                update();
                return picker;
            }
            if (!(dates instanceof Array)) {
                throw new TypeError('disabledDates() expects an array parameter');
            }
            options.disabledDates = indexGivenDates(dates);
            options.enabledDates = false;
            update();
            return picker;
        };

        picker.enabledDates = function (dates) {
            ///<signature helpKeyword="$.fn.datetimepicker.enabledDates">
            ///<summary>Returns an array with the currently set enabled dates on the component.</summary>
            ///<returns type="array">options.enabledDates</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of options.disabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.enabledDates_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.enabledDates ? $.extend({}, options.enabledDates) : options.enabledDates);
            }

            if (!dates) {
                options.enabledDates = false;
                update();
                return picker;
            }
            if (!(dates instanceof Array)) {
                throw new TypeError('enabledDates() expects an array parameter');
            }
            options.enabledDates = indexGivenDates(dates);
            options.disabledDates = false;
            update();
            return picker;
        };

        picker.daysOfWeekDisabled = function (daysOfWeekDisabled) {
            if (arguments.length === 0) {
                return options.daysOfWeekDisabled.splice(0);
            }

            if ((typeof daysOfWeekDisabled === 'boolean') && !daysOfWeekDisabled) {
                options.daysOfWeekDisabled = false;
                update();
                return picker;
            }

            if (!(daysOfWeekDisabled instanceof Array)) {
                throw new TypeError('daysOfWeekDisabled() expects an array parameter');
            }
            options.daysOfWeekDisabled = daysOfWeekDisabled.reduce(function (previousValue, currentValue) {
                currentValue = parseInt(currentValue, 10);
                if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
                    return previousValue;
                }
                if (previousValue.indexOf(currentValue) === -1) {
                    previousValue.push(currentValue);
                }
                return previousValue;
            }, []).sort();
            if (options.useCurrent && !options.keepInvalid) {
                var tries = 0;
                while (!isValid(date, 'd')) {
                    date.add(1, 'd');
                    if (tries === 31) {
                        throw 'Tried 31 times to find a valid date';
                    }
                    tries++;
                }
                setValue(date);
            }
            update();
            return picker;
        };

        picker.maxDate = function (maxDate) {
            if (arguments.length === 0) {
                return options.maxDate ? options.maxDate.clone() : options.maxDate;
            }

            if ((typeof maxDate === 'boolean') && maxDate === false) {
                options.maxDate = false;
                update();
                return picker;
            }

            if (typeof maxDate === 'string') {
                if (maxDate === 'now' || maxDate === 'moment') {
                    maxDate = getMoment();
                }
            }

            var parsedDate = parseInputDate(maxDate);

            if (!parsedDate.isValid()) {
                throw new TypeError('maxDate() Could not parse date parameter: ' + maxDate);
            }
            if (options.minDate && parsedDate.isBefore(options.minDate)) {
                throw new TypeError('maxDate() date parameter is before options.minDate: ' + parsedDate.format(actualFormat));
            }
            options.maxDate = parsedDate;
            if (options.useCurrent && !options.keepInvalid && date.isAfter(maxDate)) {
                setValue(options.maxDate);
            }
            if (viewDate.isAfter(parsedDate)) {
                viewDate = parsedDate.clone().subtract(options.stepping, 'm');
            }
            update();
            return picker;
        };

        picker.minDate = function (minDate) {
            if (arguments.length === 0) {
                return options.minDate ? options.minDate.clone() : options.minDate;
            }

            if ((typeof minDate === 'boolean') && minDate === false) {
                options.minDate = false;
                update();
                return picker;
            }

            if (typeof minDate === 'string') {
                if (minDate === 'now' || minDate === 'moment') {
                    minDate = getMoment();
                }
            }

            var parsedDate = parseInputDate(minDate);

            if (!parsedDate.isValid()) {
                throw new TypeError('minDate() Could not parse date parameter: ' + minDate);
            }
            if (options.maxDate && parsedDate.isAfter(options.maxDate)) {
                throw new TypeError('minDate() date parameter is after options.maxDate: ' + parsedDate.format(actualFormat));
            }
            options.minDate = parsedDate;
            if (options.useCurrent && !options.keepInvalid && date.isBefore(minDate)) {
                setValue(options.minDate);
            }
            if (viewDate.isBefore(parsedDate)) {
                viewDate = parsedDate.clone().add(options.stepping, 'm');
            }
            update();
            return picker;
        };

        picker.defaultDate = function (defaultDate) {
            ///<signature helpKeyword="$.fn.datetimepicker.defaultDate">
            ///<summary>Returns a moment with the options.defaultDate option configuration or false if not set</summary>
            ///<returns type="Moment">date.clone()</returns>
            ///</signature>
            ///<signature>
            ///<summary>Will set the picker's inital date. If a boolean:false value is passed the options.defaultDate parameter is cleared.</summary>
            ///<param name="defaultDate" locid="$.fn.datetimepicker.defaultDate_p:defaultDate">Takes a string, Date, moment, boolean:false</param>
            ///</signature>
            if (arguments.length === 0) {
                return options.defaultDate ? options.defaultDate.clone() : options.defaultDate;
            }
            if (!defaultDate) {
                options.defaultDate = false;
                return picker;
            }

            if (typeof defaultDate === 'string') {
                if (defaultDate === 'now' || defaultDate === 'moment') {
                    defaultDate = getMoment();
                } else {
                    defaultDate = getMoment(defaultDate);
                }
            }

            var parsedDate = parseInputDate(defaultDate);
            if (!parsedDate.isValid()) {
                throw new TypeError('defaultDate() Could not parse date parameter: ' + defaultDate);
            }
            if (!isValid(parsedDate)) {
                throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
            }

            options.defaultDate = parsedDate;

            if ((options.defaultDate && options.inline) || input.val().trim() === '') {
                setValue(options.defaultDate);
            }
            return picker;
        };

        picker.locale = function (locale) {
            if (arguments.length === 0) {
                return options.locale;
            }

            if (!moment.localeData(locale)) {
                throw new TypeError('locale() locale ' + locale + ' is not loaded from moment locales!');
            }

            options.locale = locale;
            date.locale(options.locale);
            viewDate.locale(options.locale);

            if (actualFormat) {
                initFormatting(); // reinit formatting
            }
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.stepping = function (stepping) {
            if (arguments.length === 0) {
                return options.stepping;
            }

            stepping = parseInt(stepping, 10);
            if (isNaN(stepping) || stepping < 1) {
                stepping = 1;
            }
            options.stepping = stepping;
            return picker;
        };

        picker.useCurrent = function (useCurrent) {
            var useCurrentOptions = ['year', 'month', 'day', 'hour', 'minute'];
            if (arguments.length === 0) {
                return options.useCurrent;
            }

            if ((typeof useCurrent !== 'boolean') && (typeof useCurrent !== 'string')) {
                throw new TypeError('useCurrent() expects a boolean or string parameter');
            }
            if (typeof useCurrent === 'string' && useCurrentOptions.indexOf(useCurrent.toLowerCase()) === -1) {
                throw new TypeError('useCurrent() expects a string parameter of ' + useCurrentOptions.join(', '));
            }
            options.useCurrent = useCurrent;
            return picker;
        };

        picker.collapse = function (collapse) {
            if (arguments.length === 0) {
                return options.collapse;
            }

            if (typeof collapse !== 'boolean') {
                throw new TypeError('collapse() expects a boolean parameter');
            }
            if (options.collapse === collapse) {
                return picker;
            }
            options.collapse = collapse;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.icons = function (icons) {
            if (arguments.length === 0) {
                return $.extend({}, options.icons);
            }

            if (!(icons instanceof Object)) {
                throw new TypeError('icons() expects parameter to be an Object');
            }
            $.extend(options.icons, icons);
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.tooltips = function (tooltips) {
            if (arguments.length === 0) {
                return $.extend({}, options.tooltips);
            }

            if (!(tooltips instanceof Object)) {
                throw new TypeError('tooltips() expects parameter to be an Object');
            }
            $.extend(options.tooltips, tooltips);
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.useStrict = function (useStrict) {
            if (arguments.length === 0) {
                return options.useStrict;
            }

            if (typeof useStrict !== 'boolean') {
                throw new TypeError('useStrict() expects a boolean parameter');
            }
            options.useStrict = useStrict;
            return picker;
        };

        picker.sideBySide = function (sideBySide) {
            if (arguments.length === 0) {
                return options.sideBySide;
            }

            if (typeof sideBySide !== 'boolean') {
                throw new TypeError('sideBySide() expects a boolean parameter');
            }
            options.sideBySide = sideBySide;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.viewMode = function (viewMode) {
            if (arguments.length === 0) {
                return options.viewMode;
            }

            if (typeof viewMode !== 'string') {
                throw new TypeError('viewMode() expects a string parameter');
            }

            if (viewModes.indexOf(viewMode) === -1) {
                throw new TypeError('viewMode() parameter must be one of (' + viewModes.join(', ') + ') value');
            }

            options.viewMode = viewMode;
            currentViewMode = Math.max(viewModes.indexOf(viewMode), minViewModeNumber);

            showMode();
            return picker;
        };

        picker.toolbarPlacement = function (toolbarPlacement) {
            if (arguments.length === 0) {
                return options.toolbarPlacement;
            }

            if (typeof toolbarPlacement !== 'string') {
                throw new TypeError('toolbarPlacement() expects a string parameter');
            }
            if (toolbarPlacements.indexOf(toolbarPlacement) === -1) {
                throw new TypeError('toolbarPlacement() parameter must be one of (' + toolbarPlacements.join(', ') + ') value');
            }
            options.toolbarPlacement = toolbarPlacement;

            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.widgetPositioning = function (widgetPositioning) {
            if (arguments.length === 0) {
                return $.extend({}, options.widgetPositioning);
            }

            if (({}).toString.call(widgetPositioning) !== '[object Object]') {
                throw new TypeError('widgetPositioning() expects an object variable');
            }
            if (widgetPositioning.horizontal) {
                if (typeof widgetPositioning.horizontal !== 'string') {
                    throw new TypeError('widgetPositioning() horizontal variable must be a string');
                }
                widgetPositioning.horizontal = widgetPositioning.horizontal.toLowerCase();
                if (horizontalModes.indexOf(widgetPositioning.horizontal) === -1) {
                    throw new TypeError('widgetPositioning() expects horizontal parameter to be one of (' + horizontalModes.join(', ') + ')');
                }
                options.widgetPositioning.horizontal = widgetPositioning.horizontal;
            }
            if (widgetPositioning.vertical) {
                if (typeof widgetPositioning.vertical !== 'string') {
                    throw new TypeError('widgetPositioning() vertical variable must be a string');
                }
                widgetPositioning.vertical = widgetPositioning.vertical.toLowerCase();
                if (verticalModes.indexOf(widgetPositioning.vertical) === -1) {
                    throw new TypeError('widgetPositioning() expects vertical parameter to be one of (' + verticalModes.join(', ') + ')');
                }
                options.widgetPositioning.vertical = widgetPositioning.vertical;
            }
            update();
            return picker;
        };

        picker.calendarWeeks = function (calendarWeeks) {
            if (arguments.length === 0) {
                return options.calendarWeeks;
            }

            if (typeof calendarWeeks !== 'boolean') {
                throw new TypeError('calendarWeeks() expects parameter to be a boolean value');
            }

            options.calendarWeeks = calendarWeeks;
            update();
            return picker;
        };

        picker.showTodayButton = function (showTodayButton) {
            if (arguments.length === 0) {
                return options.showTodayButton;
            }

            if (typeof showTodayButton !== 'boolean') {
                throw new TypeError('showTodayButton() expects a boolean parameter');
            }

            options.showTodayButton = showTodayButton;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.showClear = function (showClear) {
            if (arguments.length === 0) {
                return options.showClear;
            }

            if (typeof showClear !== 'boolean') {
                throw new TypeError('showClear() expects a boolean parameter');
            }

            options.showClear = showClear;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.widgetParent = function (widgetParent) {
            if (arguments.length === 0) {
                return options.widgetParent;
            }

            if (typeof widgetParent === 'string') {
                widgetParent = $(widgetParent);
            }

            if (widgetParent !== null && (typeof widgetParent !== 'string' && !(widgetParent instanceof $))) {
                throw new TypeError('widgetParent() expects a string or a jQuery object parameter');
            }

            options.widgetParent = widgetParent;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.keepOpen = function (keepOpen) {
            if (arguments.length === 0) {
                return options.keepOpen;
            }

            if (typeof keepOpen !== 'boolean') {
                throw new TypeError('keepOpen() expects a boolean parameter');
            }

            options.keepOpen = keepOpen;
            return picker;
        };

        picker.focusOnShow = function (focusOnShow) {
            if (arguments.length === 0) {
                return options.focusOnShow;
            }

            if (typeof focusOnShow !== 'boolean') {
                throw new TypeError('focusOnShow() expects a boolean parameter');
            }

            options.focusOnShow = focusOnShow;
            return picker;
        };

        picker.inline = function (inline) {
            if (arguments.length === 0) {
                return options.inline;
            }

            if (typeof inline !== 'boolean') {
                throw new TypeError('inline() expects a boolean parameter');
            }

            options.inline = inline;
            return picker;
        };

        picker.clear = function () {
            clear();
            return picker;
        };

        picker.keyBinds = function (keyBinds) {
            if (arguments.length === 0) {
                return options.keyBinds;
            }

            options.keyBinds = keyBinds;
            return picker;
        };

        picker.getMoment = function (d) {
            return getMoment(d);
        };

        picker.debug = function (debug) {
            if (typeof debug !== 'boolean') {
                throw new TypeError('debug() expects a boolean parameter');
            }

            options.debug = debug;
            return picker;
        };

        picker.allowInputToggle = function (allowInputToggle) {
            if (arguments.length === 0) {
                return options.allowInputToggle;
            }

            if (typeof allowInputToggle !== 'boolean') {
                throw new TypeError('allowInputToggle() expects a boolean parameter');
            }

            options.allowInputToggle = allowInputToggle;
            return picker;
        };

        picker.showClose = function (showClose) {
            if (arguments.length === 0) {
                return options.showClose;
            }

            if (typeof showClose !== 'boolean') {
                throw new TypeError('showClose() expects a boolean parameter');
            }

            options.showClose = showClose;
            return picker;
        };

        picker.keepInvalid = function (keepInvalid) {
            if (arguments.length === 0) {
                return options.keepInvalid;
            }

            if (typeof keepInvalid !== 'boolean') {
                throw new TypeError('keepInvalid() expects a boolean parameter');
            }
            options.keepInvalid = keepInvalid;
            return picker;
        };

        picker.datepickerInput = function (datepickerInput) {
            if (arguments.length === 0) {
                return options.datepickerInput;
            }

            if (typeof datepickerInput !== 'string') {
                throw new TypeError('datepickerInput() expects a string parameter');
            }

            options.datepickerInput = datepickerInput;
            return picker;
        };

        picker.parseInputDate = function (parseInputDate) {
            if (arguments.length === 0) {
                return options.parseInputDate;
            }

            if (typeof parseInputDate !== 'function') {
                throw new TypeError('parseInputDate() sholud be as function');
            }

            options.parseInputDate = parseInputDate;

            return picker;
        };

        picker.disabledTimeIntervals = function (disabledTimeIntervals) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledTimeIntervals">
            ///<summary>Returns an array with the currently set disabled dates on the component.</summary>
            ///<returns type="array">options.disabledTimeIntervals</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.disabledTimeIntervals_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.disabledTimeIntervals ? $.extend({}, options.disabledTimeIntervals) : options.disabledTimeIntervals);
            }

            if (!disabledTimeIntervals) {
                options.disabledTimeIntervals = false;
                update();
                return picker;
            }
            if (!(disabledTimeIntervals instanceof Array)) {
                throw new TypeError('disabledTimeIntervals() expects an array parameter');
            }
            options.disabledTimeIntervals = disabledTimeIntervals;
            update();
            return picker;
        };

        picker.disabledHours = function (hours) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledHours">
            ///<summary>Returns an array with the currently set disabled hours on the component.</summary>
            ///<returns type="array">options.disabledHours</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledHours if such exist.</summary>
            ///<param name="hours" locid="$.fn.datetimepicker.disabledHours_p:hours">Takes an [ int ] of values and disallows the user to select only from those hours.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.disabledHours ? $.extend({}, options.disabledHours) : options.disabledHours);
            }

            if (!hours) {
                options.disabledHours = false;
                update();
                return picker;
            }
            if (!(hours instanceof Array)) {
                throw new TypeError('disabledHours() expects an array parameter');
            }
            options.disabledHours = indexGivenHours(hours);
            options.enabledHours = false;
            if (options.useCurrent && !options.keepInvalid) {
                var tries = 0;
                while (!isValid(date, 'h')) {
                    date.add(1, 'h');
                    if (tries === 24) {
                        throw 'Tried 24 times to find a valid date';
                    }
                    tries++;
                }
                setValue(date);
            }
            update();
            return picker;
        };

        picker.enabledHours = function (hours) {
            ///<signature helpKeyword="$.fn.datetimepicker.enabledHours">
            ///<summary>Returns an array with the currently set enabled hours on the component.</summary>
            ///<returns type="array">options.enabledHours</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of options.disabledHours if such exist.</summary>
            ///<param name="hours" locid="$.fn.datetimepicker.enabledHours_p:hours">Takes an [ int ] of values and allows the user to select only from those hours.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.enabledHours ? $.extend({}, options.enabledHours) : options.enabledHours);
            }

            if (!hours) {
                options.enabledHours = false;
                update();
                return picker;
            }
            if (!(hours instanceof Array)) {
                throw new TypeError('enabledHours() expects an array parameter');
            }
            options.enabledHours = indexGivenHours(hours);
            options.disabledHours = false;
            if (options.useCurrent && !options.keepInvalid) {
                var tries = 0;
                while (!isValid(date, 'h')) {
                    date.add(1, 'h');
                    if (tries === 24) {
                        throw 'Tried 24 times to find a valid date';
                    }
                    tries++;
                }
                setValue(date);
            }
            update();
            return picker;
        };
        /**
         * Returns the component's model current viewDate, a moment object or null if not set. Passing a null value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the options.format and options.useStrict components configuration.
         * @param {Takes string, viewDate, moment, null parameter.} newDate
         * @returns {viewDate.clone()}
         */
        picker.viewDate = function (newDate) {
            if (arguments.length === 0) {
                return viewDate.clone();
            }

            if (!newDate) {
                viewDate = date.clone();
                return picker;
            }

            if (typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
                throw new TypeError('viewDate() parameter must be one of [string, moment or Date]');
            }

            viewDate = parseInputDate(newDate);
            viewUpdate();
            return picker;
        };

        // initializing element and component attributes
        if (element.is('input')) {
            input = element;
        } else {
            input = element.find(options.datepickerInput);
            if (input.length === 0) {
                input = element.find('input');
            } else if (!input.is('input')) {
                throw new Error('CSS class "' + options.datepickerInput + '" cannot be applied to non input element');
            }
        }

        if (element.hasClass('input-group')) {
            // in case there is more then one 'input-group-addon' Issue #48
            if (element.find('.datepickerbutton').length === 0) {
                component = element.find('.input-group-addon');
            } else {
                component = element.find('.datepickerbutton');
            }
        }

        if (!options.inline && !input.is('input')) {
            throw new Error('Could not initialize DateTimePicker without an input element');
        }

        // Set defaults for date here now instead of in var declaration
        date = getMoment();
        viewDate = date.clone();

        $.extend(true, options, dataToOptions());

        picker.options(options);

        initFormatting();

        attachDatePickerElementEvents();

        if (input.prop('disabled')) {
            picker.disable();
        }
        if (input.is('input') && input.val().trim().length !== 0) {
            setValue(parseInputDate(input.val().trim()));
        }
        else if (options.defaultDate && input.attr('placeholder') === undefined) {
            setValue(options.defaultDate);
        }
        if (options.inline) {
            show();
        }
        return picker;
    };

    /********************************************************************************
     *
     * jQuery plugin constructor and defaults object
     *
     ********************************************************************************/

    /**
    * See (http://jquery.com/).
    * @name jQuery
    * @class
    * See the jQuery Library  (http://jquery.com/) for full details.  This just
    * documents the function and classes that are added to jQuery by this plug-in.
    */
    /**
     * See (http://jquery.com/)
     * @name fn
     * @class
     * See the jQuery Library  (http://jquery.com/) for full details.  This just
     * documents the function and classes that are added to jQuery by this plug-in.
     * @memberOf jQuery
     */
    /**
     * Show comments
     * @class datetimepicker
     * @memberOf jQuery.fn
     */
    $.fn.datetimepicker = function (options) {
        options = options || {};

        var args = Array.prototype.slice.call(arguments, 1),
            isInstance = true,
            thisMethods = ['destroy', 'hide', 'show', 'toggle'],
            returnValue;

        if (typeof options === 'object') {
            return this.each(function () {
                var $this = $(this),
                    _options;
                if (!$this.data('DateTimePicker')) {
                    // create a private copy of the defaults object
                    _options = $.extend(true, {}, $.fn.datetimepicker.defaults, options);
                    $this.data('DateTimePicker', dateTimePicker($this, _options));
                }
            });
        } else if (typeof options === 'string') {
            this.each(function () {
                var $this = $(this),
                    instance = $this.data('DateTimePicker');
                if (!instance) {
                    throw new Error('bootstrap-datetimepicker("' + options + '") method was called on an element that is not using DateTimePicker');
                }

                returnValue = instance[options].apply(instance, args);
                isInstance = returnValue === instance;
            });

            if (isInstance || $.inArray(options, thisMethods) > -1) {
                return this;
            }

            return returnValue;
        }

        throw new TypeError('Invalid arguments for DateTimePicker: ' + options);
    };

    $.fn.datetimepicker.defaults = {
        timeZone: '',
        format: false,
        dayViewHeaderFormat: 'MMMM YYYY',
        extraFormats: false,
        stepping: 1,
        minDate: false,
        maxDate: false,
        useCurrent: true,
        collapse: true,
        locale: moment.locale(),
        defaultDate: false,
        disabledDates: false,
        enabledDates: false,
        icons: {
            time: 'glyphicon glyphicon-time',
            date: 'glyphicon glyphicon-calendar',
            up: 'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down',
            previous: 'glyphicon glyphicon-chevron-left',
            next: 'glyphicon glyphicon-chevron-right',
            today: 'glyphicon glyphicon-screenshot',
            clear: 'glyphicon glyphicon-trash',
            close: 'glyphicon glyphicon-remove'
        },
        tooltips: {
            today: 'Go to today',
            clear: 'Clear selection',
            close: 'Close the picker',
            selectMonth: 'Select Month',
            prevMonth: 'Previous Month',
            nextMonth: 'Next Month',
            selectYear: 'Select Year',
            prevYear: 'Previous Year',
            nextYear: 'Next Year',
            selectDecade: 'Select Decade',
            prevDecade: 'Previous Decade',
            nextDecade: 'Next Decade',
            prevCentury: 'Previous Century',
            nextCentury: 'Next Century',
            pickHour: 'Pick Hour',
            incrementHour: 'Increment Hour',
            decrementHour: 'Decrement Hour',
            pickMinute: 'Pick Minute',
            incrementMinute: 'Increment Minute',
            decrementMinute: 'Decrement Minute',
            pickSecond: 'Pick Second',
            incrementSecond: 'Increment Second',
            decrementSecond: 'Decrement Second',
            togglePeriod: 'Toggle Period',
            selectTime: 'Select Time'
        },
        useStrict: false,
        sideBySide: false,
        daysOfWeekDisabled: false,
        calendarWeeks: false,
        viewMode: 'days',
        toolbarPlacement: 'default',
        showTodayButton: false,
        showClear: false,
        showClose: false,
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'auto'
        },
        widgetParent: null,
        ignoreReadonly: false,
        keepOpen: false,
        focusOnShow: true,
        inline: false,
        keepInvalid: false,
        datepickerInput: '.datepickerinput',
        keyBinds: {
            up: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().subtract(7, 'd'));
                } else {
                    this.date(d.clone().add(this.stepping(), 'm'));
                }
            },
            down: function (widget) {
                if (!widget) {
                    this.show();
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().add(7, 'd'));
                } else {
                    this.date(d.clone().subtract(this.stepping(), 'm'));
                }
            },
            'control up': function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'y'));
                } else {
                    this.date(d.clone().add(1, 'h'));
                }
            },
            'control down': function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'y'));
                } else {
                    this.date(d.clone().subtract(1, 'h'));
                }
            },
            left: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'd'));
                }
            },
            right: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'd'));
                }
            },
            pageUp: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'M'));
                }
            },
            pageDown: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'M'));
                }
            },
            enter: function () {
                this.hide();
            },
            escape: function () {
                this.hide();
            },
            //tab: function (widget) { //this break the flow of the form. disabling for now
            //    var toggle = widget.find('.picker-switch a[data-action="togglePicker"]');
            //    if(toggle.length > 0) toggle.click();
            //},
            'control space': function (widget) {
                if (!widget) {
                    return;
                }
                if (widget.find('.timepicker').is(':visible')) {
                    widget.find('.btn[data-action="togglePeriod"]').click();
                }
            },
            t: function () {
                this.date(this.getMoment());
            },
            'delete': function () {
                this.clear();
            }
        },
        debug: false,
        allowInputToggle: false,
        disabledTimeIntervals: false,
        disabledHours: false,
        enabledHours: false,
        viewDate: false
    };

    return $.fn.datetimepicker;
}));


angular.module("rpDatetimepicker", []);

//  Source: _lib\realpage\datetimepicker-v1\js\templates\templates.inc.js
angular.module("rpDatetimepicker").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/datetimepicker-v1/templates/datepicker.html",
"<div class=\"rp-datetimepicker form-group\" ng-class=\"datetimepicker.getState()\"><div ng-model=\"rpModel\" rp-datetimepicker-link id=\"{{config.fieldID}}\" options=\"config.options\" name=\"{{config.fieldName}}\" ng-required=\"config.required\" on-change=\"config.onChange(rpModel)\" class=\"input-group rp-datetimepicker-text-wrap\"><input type=\"text\" class=\"rp-datetimepicker-text form-control\"> <span class=\"rp-datetimepicker-icon-wrap input-group-addon\"><span class=\"rp-datetimepicker-icon {{::config.iconClass}}\"></span></span></div><p ng-if=\"config.required\" class=\"rp-datetimepicker-error-msg rp-form-error-msg\">{{config.errorMsgs.required}}</p></div>");
}]);

//  Source: _lib\realpage\datetimepicker-v1\js\directives\datetimepicker.js
//  Datepicker Directive

(function (angular) {
    "use strict";

    function rpDatetimepicker() {
        function link(scope, elem, attr) {}

        return {
            scope: {
                config: "=",
                rpModel: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/datetimepicker-v1/templates/datepicker.html"
        };
    }

    angular
        .module("rpDatetimepicker")
        .directive("rpDatetimepicker", [rpDatetimepicker]);
})(angular);

//  Source: _lib\realpage\datetimepicker-v1\js\directives\datetimepicker-link.js
//  Datetimepicker Directive

(function (angular, undefined) {
    "use strict";

    function rpDatetimepickerLink($timeout, moment) {
        function link(scope, elem, attr, ctrl) {
            var events,
                picker,
                dir = {},
                inpEvents,
                config = scope.config,
                options = config.options,
                inp = elem.children("input");

            events = [
                "hide",
                "show",
                "error",
                "change",
                "update"
            ];

            inpEvents = [
                "blur",
                "keydown"
            ];

            dir.init = function () {
                scope.datetimepicker = dir;

                ctrl.$render = dir.$render;
                ctrl.$isEmpty = dir.$isEmpty;
                ctrl.$parsers.prepend(dir.$parser);
                ctrl.$formatters.push(dir.$formatter);
                ctrl.$validators.dateTime = dir.$validator;

                dir.bindEvents();
                elem.datetimepicker(options);
                config.updateOptions = dir.updateOptions;
                dir.picker = picker = elem.data("DateTimePicker");
                config.setPicker(picker);

                dir.delaySetOldValue();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.$formatter = function (data) {
                if (!data || !data.format) {
                    return "";
                }
                else {
                    return data.format(options.format);
                }
            };

            dir.$isEmpty = function (data) {
                return !(angular.isString(data) && data.length > 0);
            };

            dir.$parser = function (raw) {
                return moment(raw, options.format);
            };

            dir.$render = function () {
                var vVal = ctrl.$viewValue,
                    invalid = vVal.toLowerCase().match("invalid date"),
                    valid = vVal && !invalid;

                dir.oldValue = vVal;

                dir.timer1 = $timeout(function () {
                    if (!valid) {
                        dir.picker.clear();
                    }
                    else {
                        dir.picker.date(vVal);
                    }
                });
            };

            dir.$validator = function (mVal, vVal) {
                if (!config.required && vVal === "") {
                    return true;
                }
                else {
                    return vVal && !vVal.toLowerCase().match("invalid date");
                }
            };

            dir.applyChange = function (data) {
                scope.rpModel = data.date;
                config.onChange(data.date);
            };

            dir.bindEvents = function () {
                events.forEach(function (eventName) {
                    var methodName = "on" + eventName.ucfirst();
                    elem.on("dp." + eventName, dir[methodName]);
                });

                inpEvents.forEach(function (eventName) {
                    inp.on(eventName, dir["onInp" + eventName.ucfirst()]);
                });
            };

            dir.delayApplyChange = function (data) {
                dir.timer2 = $timeout(function () {
                    dir.applyChange(data);
                });
            };

            dir.delaySetOldValue = function () {
                dir.timer3 = $timeout(dir.setOldValue, 100);
                return dir;
            };

            dir.getState = function () {
                var state = {
                    required: false
                };

                if (config.size) {
                    state[config.size] = true;
                }

                return angular.extend(state, ctrl.$error);
            };

            dir.onChange = function (data) {
                var newValue = data.date ? data.date.format(options.format) : data.date;

                if (dir.oldValue != newValue) {
                    dir.setOldValue(newValue);

                    scope.$apply(function () {
                        ctrl.$setDirty();
                        dir.delayApplyChange(data);
                    });
                }
            };

            dir.onError = function (data) {
                scope.$apply(scope.config.onError);
            };

            dir.onHide = function (data) {
                scope.$apply(scope.config.onHide);
            };

            dir.onInpBlur = function () {
                scope.$apply(function () {
                    ctrl.$setTouched();
                });
            };

            dir.onInpKeydown = function () {
                scope.$apply(function () {
                    ctrl.$setDirty();
                });
            };

            dir.onShow = function (data) {
                scope.$apply(scope.config.onShow);
            };

            dir.onUpdate = function (data) {
                scope.$apply(scope.config.onUpdate);
            };

            dir.setOldValue = function (data) {
                dir.oldValue = data !== undefined ? data : (ctrl.$viewValue ? ctrl.$viewValue : false);
            };

            dir.updateOptions = function (options) {
                angular.extend(picker, options);
            };

            dir.destroy = function () {
                inp.off();
                elem.off();
                dir.destWatch();
                $timeout.cancel(dir.timer1);
                $timeout.cancel(dir.timer2);
                $timeout.cancel(dir.timer3);
                dir = undefined;
                inp = undefined;
                events = undefined;
                picker = undefined;
                config = undefined;
                options = undefined;
                inpEvents = undefined;
                scope.config = undefined;
                scope.rpModel = undefined;
                scope.datetimepicker = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A",
            require: "ngModel"
        };
    }

    angular
        .module("rpDatetimepicker")
        .directive("rpDatetimepickerLink", ["$timeout", "moment", rpDatetimepickerLink]);
})(angular);

//  Source: _lib\realpage\datetimepicker-v1\js\models\datetimepicker-config.js
//  Datepicker Config Model

(function (angular, undefined) {
    "use strict";

    function factory(moment) {
        var index = 0;

        return function (config) {
            index++;

            var model,
                picker,
                options,
                fieldID = "datetimepicker" + index,
                fieldName = "datetimepicker" + index;

            config = config || {};

            options = {
                format: "MM/DD/YYYY",

                dayViewHeaderFormat: "MMMM YYYY",

                extraFormats: false,

                stepping: 1,

                minDate: false, // Accepts date, moment, string

                maxDate: false, // Accepts date, moment, string

                useCurrent: false,

                collapse: true,

                locale: moment.locale(),

                defaultDate: false, // Accepts date, moment, string

                disabledDates: false, // Accepts array of date, moment, string

                enabledDates: false, // Accepts array of date, moment, string

                icons: {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    up: 'fa fa-chevron-up',
                    down: 'fa fa-chevron-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-screenshot',
                    clear: 'fa fa-trash',
                    close: 'fa fa-remove'
                },

                useStrict: false,

                sideBySide: false,

                daysOfWeekDisabled: [], // Accepts array of numbers from 0-6

                calendarWeeks: false,

                viewMode: "days", // Accepts "decades", "years", "months", "days"

                toolbarPlacement: "default", // Accepts "default", "top", "bottom"

                showTodayButton: false,

                showClear: false,

                showClose: false,

                widgetPositioning: {
                    "vertical": "auto", // Accepts "auto", "left", "right"
                    "horrizontal": "auto" // Accepts "auto", "top", "bottom"
                },

                widgetParent: null, // Accepts string or jQuery object

                keepOpen: false,

                inline: false,

                keepInvalid: false,

                debug: false,

                ignoreReadonly: false,

                disabledTimeIntervals: false,

                allowInputToggle: false,

                focusOnShow: true,

                enabledHours: false,

                disabledHours: false,

                viewDate: false,

                tooltips: {
                    today: 'Go to today',
                    clear: 'Clear selection',
                    close: 'Close the picker',
                    selectMonth: 'Select Month',
                    prevMonth: 'Previous Month',
                    nextMonth: 'Next Month',
                    selectYear: 'Select Year',
                    prevYear: 'Previous Year',
                    nextYear: 'Next Year',
                    selectDecade: 'Select Decade',
                    prevDecade: 'Previous Decade',
                    nextDecade: 'Next Decade',
                    prevCentury: 'Previous Century',
                    nextCentury: 'Next Century'
                },

                keyBinds: {
                    up: function (widget) {
                        if (model.isEmpty()) {
                            return;
                        }

                        var picker = model.picker;

                        if (widget.find('.datepicker').is(':visible')) {
                            picker.date(picker.date().clone().subtract(7, 'd'));
                        }
                        else {
                            picker.date(picker.date().clone().add(1, 'm'));
                        }
                    },

                    down: function (widget) {
                        if (model.isEmpty()) {
                            return;
                        }

                        var picker = model.picker;

                        if (!widget) {
                            this.show();
                        }
                        else if (widget.find('.datepicker').is(':visible')) {
                            picker.date(picker.date().clone().add(7, 'd'));
                        }
                        else {
                            picker.date(picker.date().clone().subtract(1, 'm'));
                        }
                    },

                    'control up': function (widget) {
                        if (model.isEmpty()) {
                            return;
                        }

                        var picker = model.picker;

                        if (widget.find('.datepicker').is(':visible')) {
                            picker.date(picker.date().clone().subtract(1, 'y'));
                        }
                        else {
                            picker.date(picker.date().clone().add(1, 'h'));
                        }
                    },

                    'control down': function (widget) {
                        if (model.isEmpty()) {
                            return;
                        }

                        var picker = model.picker;

                        if (widget.find('.datepicker').is(':visible')) {
                            picker.date(picker.date().clone().add(1, 'y'));
                        }
                        else {
                            picker.date(picker.date().clone().subtract(1, 'h'));
                        }
                    },

                    left: null,

                    right: null,

                    pageUp: function (widget) {
                        if (model.isEmpty()) {
                            return;
                        }

                        var picker = model.picker;

                        if (widget.find('.datepicker').is(':visible')) {
                            picker.date(picker.date().clone().subtract(1, 'M'));
                        }
                    },

                    pageDown: function (widget) {
                        if (model.isEmpty()) {
                            return;
                        }

                        var picker = model.picker;

                        if (widget.find('.datepicker').is(':visible')) {
                            picker.date(picker.date().clone().add(1, 'M'));
                        }
                    },

                    enter: function () {
                        model.picker.hide();
                    },

                    escape: function () {
                        model.picker.hide();
                    },

                    'control space': function (widget) {
                        if (widget.find('.timepicker').is(':visible')) {
                            widget.find('.btn[data-action="togglePeriod"]').click();
                        }
                    },

                    t: function () {
                        model.picker.date(moment());
                    },

                    'delete': function () {
                        model.picker.clear();
                    },

                    onHide: angular.noop,

                    onShow: angular.noop,

                    onError: angular.noop,

                    onChange: angular.noop,

                    onUpdate: angular.noop,

                    setPicker: function (picker) {
                        this.picker = picker;
                    }
                }
            };

            var optionKeys = Object.keys(options).concat(["keyBinds"]);

            optionKeys.forEach(function (key) {
                if (config[key] !== undefined) {
                    options[key] = config[key];
                    delete config[key];
                }
            });

            picker = {
                minDate: angular.noop,
                maxDate: angular.noop
            };

            model = {
                size: "",
                picker: picker,
                required: false,
                fieldID: fieldID,
                fieldName: fieldName,
                onHide: angular.noop,
                onShow: angular.noop,
                onError: angular.noop,
                onUpdate: angular.noop,
                onChange: angular.noop,
                minDate: angular.noop,
                maxDate: angular.noop,
                iconClass: "fa fa-calendar"
            };

            var configKeys = Object.keys(model);

            angular.extend(model, config);

            model.options = options;

            model.setPicker = function (picker) {
                model.picker = picker;
            };

            model.isEmpty = function () {
                return !model.picker.date();
            };

            model.setOption = function (key, val) {
                if (optionKeys.contains(key)) {
                    model.options[key] = val;
                }
                else {
                    logc("rpDatetimepickerConfig.setOption: Invalid option key!");
                }
            };

            model.setConfig = function (key, val) {
                if (configKeys.contains(key)) {
                    model[key] = val;
                }
                else {
                    logc("rpDatetimepickerConfig.setConfig: Invalid config key!");
                }
            };

            model.getConfig = function (key) {
                if (configKeys.contains(key)) {
                    return model[key];
                }
                else {
                    logc("rpDatetimepickerConfig.getConfig: Invalid config key!");
                }
            };

            model.minDate = function (data) {
                if (data !== undefined) {
                    model.picker.minDate(data);
                }
                else {
                    return model.picker.minDate();
                }
            };

            model.maxDate = function (data) {
                if (data !== undefined) {
                    model.picker.maxDate(data);
                }
                else {
                    return model.picker.maxDate();
                }
            };

            model.setCurrentDate = function (bool) {
                model.picker.useCurrent(bool);
            };

            model.destroy = function () {
                model = undefined;
                picker = undefined;
                config = undefined;
                options = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpDatetimepicker")
        .factory("rpDatetimepickerConfig", ["moment", factory]);
})(angular);

//  Source: ui\lib\realpage\float-scroll\js\scripts.js
//  Source: _lib\realpage\float-scroll\js\_bundle.inc
angular.module("rpFloatScroll", []);

//  Source: _lib\realpage\float-scroll\js\directives\float-scroll.js
//  Floating Scrollbar Directive

(function (angular, undefined) {
    "use strict";

    function rpFloatScroll(timeout, winScroll, winSize) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.floatScroll = dir;
                dir.setSizeBusy = false;
                dir.append().setupBar().setVis();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.sizeWatch = winSize.subscribe(dir.delaySetSize);
                dir.scrollWatch = winScroll.subscribe(dir.delaySetSize);
            };

            dir.append = function () {
                var html = "<div class='rp-float-scrollbar'><div /></div>";

                dir.bar = angular.element(html);
                dir.barCon = dir.bar.children();

                elem.append(dir.bar);
                return dir;
            };

            dir.setupBar = function () {
                dir.bar.on("scroll", dir.onScroll);
                dir.setSize();
                return dir;
            };

            dir.show = function () {
                dir.bar.show();
                return dir;
            };

            dir.hide = function () {
                dir.bar.hide();
                return dir;
            };

            dir.onScroll = function () {
                var sl = dir.bar.scrollLeft();
                elem.scrollLeft(sl);
            };

            dir.delaySetSize = function () {
                if (!dir.setSizeBusy) {
                    dir.setSizeBusy = true;
                    dir.sizeTimer = timeout(dir.setSize, 150);
                }
            };

            dir.setVis = function () {
                var sl = elem.scrollLeft(),
                    winHt = winSize.getSize().height,
                    scrollTop = winScroll.getScrollTop(),
                    rect = elem.get(0).getBoundingClientRect(),
                    current = winHt + scrollTop,
                    elemTop = scrollTop + rect.top,
                    elemBottom = elemTop + elem.outerHeight(),
                    show = current > elemTop && current < elemBottom;

                dir[show ? "show" : "hide"]().bar.scrollLeft(show ? sl : 0);

                return dir;
            };

            dir.setSize = function () {
                var barStyle = {
                    left: elem.offset().left,
                    width: elem.outerWidth()
                };

                dir.bar.css(barStyle);
                dir.setSizeBusy = false;
                dir.barCon.width(elem.get(0).scrollWidth);

                dir.setVis();
            };

            dir.destroy = function () {
                dir.sizeWatch();
                dir.destWatch();
                dir.bar.remove();
                dir.scrollWatch();
                timeout.cancel(dir.sizeTimer);

                scope.floatScroll = undefined;
                dir = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpFloatScroll")
        .directive("rpFloatScroll", [
            "timeout",
            "windowScroll",
            "windowSize",
            rpFloatScroll
        ]);
})(angular);

//  Source: ui\lib\realpage\form-input-date\js\scripts.js
//  Source: _lib\realpage\form-input-date\js\_bundle.inc
angular.module("rpFormInputDate", []);

//  Source: _lib\realpage\form-input-date\js\templates\input-date.js
//  Input Date Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/form/input-date/input-date.html";

    templateHtml = "" +

    "<div class='rp-input-date {{dateModel.options.displaySize}}' " +
        "ng-class='dateModel.state()'>" +
        "<span ng-show='!dateModel.display' " +
            "class='input-placeholder'>" +
            "{{dateModel.options.displayFormat}}" +
        "</span>" +
        "<input type='text' " +
            "ng-blur='dateModel.blur()' " +
            "class='input-type-date' " +
            "ng-model='dateModel.display' " +
            "ng-focus='dateModel.focus()' " +
            "ng-change='dir.updateModel()' " +
            "ng-model-options='{\"updateOn\": \"blur\"}' " +
            "maxlength='{{dateModel.options.maxLength}}' >" +
        "<span class='rp-icon-calendar' " +
            "rp-stop-event='click' " +
            "ng-click='dir.showDatepicker($event)'>" +

        "</span>" +
    "</div>";
    

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module('rpFormInputDate')
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\form-input-date\js\models\input-date.js
//  Input Date Model

(function (angular, und) {
    "use strict";

    function factory(moment, dateSvc, dateParser) {
        var index = 1;

        return function () {
            var model = {},
                parser = dateParser();

            model.id = 'inputDateModel' + index++;

            model.display = und;

            model.options = {
                maxLength: 10,
                anchorRight: false,
                displayFormat: 'MM/DD/YY'
            };

            model._state = {
                focus: false
            };

            model.state = function () {
                return angular.extend(model._state, {
                    empty: !model.display,
                });
            };

            model.updateOptions = function (options) {
                angular.extend(model.options, options || {});
            };

            model.focus = function () {
                model._state.focus = true;
                model._state.touched = true;
            };

            model.blur = function () {
                model._state.focus = false;
            };

            model.dirty = function () {
                model._state.dirty = true;
            };

            model.invalid = function () {
                model._state.invalid = true;
            };

            model.valid = function () {
                model._state.invalid = false;
            };

            model.getValue = function () {
                var data = parser.parse(model.display),
                    valid = model.display && data,
                    val = moment(data, model.options.displayFormat);

                valid = valid && val != 'Invalid date';

                if (val && model.options.min) {
                    var min = moment(model.options.min, 'x');
                    valid = valid && !dateSvc(val).isBefore(min);
                }
                if (val && model.options.max) {
                    var max = moment(model.options.max, 'x');
                    valid = valid && !dateSvc(val).isAfter(max);
                }

                return valid ? val.format('x') : 'Invalid date';
            };

            model.updateDisplay = function (val) {
                model._state.invalid = false;
                model.display = moment(val, 'x').format(model.options.displayFormat);
            };

            return model;
        };
    }

    angular
        .module('rpFormInputDate')
        .factory('rpInputDateModel', ['moment', 'rpDate', 'dateParser', factory]);
})(angular);

//  Source: _lib\realpage\form-input-date\js\directives\input-date.js
//  Input Date Directive

(function (angular, und) {
    "use strict";

    function rpInputDate(moment, dateModelSvc, datepicker) {
        var index = 1;

        function link(scope, elem, attr) {
            var dir,
                modelWatch,
                dateModel = dateModelSvc();

            dir = {
                datepickerLink: und,
                datepickerOptions: {},
                id: 'rpInputDate' + index++
            };

            dir.init = function () {
                scope.dir = dir;
                scope.dateModel = dateModel;
                dateModel.updateOptions(scope.options);
                dir.watchModel();
            };

            dir.watchModel = function () {
                modelWatch = scope.$watch('model', dir.updateDisplay);
                return dir;
            };

            dir.updateModel = function () {
                dateModel.dirty();
                var val = dateModel.getValue();
                if (val == 'Invalid date') {
                    dateModel.invalid();
                }
                else {
                    dateModel.valid();
                    scope.model = val;
                }
            };

            dir.updateDisplay = function (val) {
                if (val && val != 'Invalid date') {
                    dateModel.updateDisplay(val);
                }
            };

            dir.datepickerData = function () {
                var min = '',
                    max = '',
                    selDate = scope.model ? moment(scope.model, 'x') : '',
                    refDate = scope.model ? moment(scope.model, 'x') : moment();

                if (scope.options) {
                    min = scope.options.min ? moment(scope.options.min, 'x') : '';
                    max = scope.options.max ? moment(scope.options.max, 'x') : '';
                }

                return {
                    min: min,
                    max: max,
                    callerID: dir.id,
                    refDate: refDate,
                    selDate: selDate
                };
            };

            dir.showDatepicker = function () {
                var styles = elem.offset(),
                    data = dir.datepickerData();

                if (datepicker.isHidden()) {
                    datepicker.show();
                }
                else if (dir.id == datepicker.prevCaller()) {
                    datepicker.hide();
                    return;
                }

                if (scope.options && scope.options.anchorRight) {
                    styles.left = styles.left + elem.outerWidth() - datepicker.size.width;
                }

                styles.top += elem.height() + 5;

                datepicker.update(data).updateStyles(styles);

                dir.datepickerLink = datepicker.events.subscribe(dir.unlinkDatepicker);
            };

            dir.unlinkDatepicker = function (ev) {
                if (['update', 'hide'].contains(ev.name)) {
                    dir.datepickerLink();
                }
                else if (ev.name == 'select') {
                    scope.model = ev.data;
                }
            };

            dir.init();
        }

        return {
            scope: {
                model: '=',
                options: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/form/input-date/input-date.html"
        };
    }

    angular
        .module('rpFormInputDate')
        .directive('rpInputDate', [
            'moment',
            'rpInputDateModel',
            'rpDatepickerModel',
            rpInputDate
        ]);
})(angular);

//  Source: _lib\realpage\form-input-date\js\directives\input-type-date.js
//  Input Type Date Directive

(function (angular) {
    "use strict";

    function inputTypeDate(keycode) {
        function link(scope, elem, attr) {
            function onKeyDown(event) {
                var result = keycode.test(event);
                return result.nav || ((result.numeric || result.slash) && !result.shift);
            }

            elem.on('keydown.inputTypeDate', onKeyDown);
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module('rpFormInputDate')
        .directive('inputTypeDate', ['keycode', inputTypeDate]);
})(angular);

//  Source: ui\lib\realpage\form-input-text-v1\js\scripts.js
//  Source: _lib\realpage\form-input-text-v1\js\_bundle.inc
angular.module("rpFormInputText", []);

//  Source: _lib\realpage\form-input-text-v1\js\directives\form-input-text-field.js
//  Form Input Text Field Directive

(function (angular, undefined) {
    "use strict";

    function rpFormInputTextField() {
        function link(scope, elem, attr, ctrl) {
            var config = scope.config;

            if (!config) {
                return;
            }

            var dir = {
                state: {
                    hover: false,
                    focus: false
                }
            };

            dir.init = function () {
                dir.errorState = {};
                scope.inputText = dir;

                if (config.size) {
                    dir.state[config.size] = true;
                }

                if (dir.hasValidators()) {
                    angular.extend(ctrl.$validators, config.validators);
                }

                if (dir.hasAsyncValidators()) {
                    angular.extend(ctrl.$asyncValidators, config.asyncValidators);
                }

                Object.keys(ctrl.$validators).forEach(function (key) {
                    dir.errorState[key] = false;
                });

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.hasValidators = function () {
                return config.validators &&
                    Object.keys(config.validators).length !== 0;
            };

            dir.hasAsyncValidators = function () {
                return config.asyncValidators &&
                    Object.keys(config.asyncValidators).length !== 0;
            };

            dir.getState = function (data) {
                var found = false;

                angular.extend(dir.state, {
                    dirty: ctrl.$dirty,
                    error: ctrl.$invalid,
                    touched: ctrl.$touched,
                    readonly: config.readonly,
                    disabled: config.disabled
                }, dir.errorState, ctrl.$error);

                config.errorMsgs.forEach(function (msg) {
                    msg.active = false;

                    if (!found && ctrl.$error[msg.name]) {
                        found = true;
                        msg.active = true;
                    }
                });

                return dir.state;
            };

            dir.onFocus = function () {
                var onFocus = config.onFocus;
                dir.state.focus = true;

                if (onFocus) {
                    if (typeof onFocus == "function") {
                        onFocus();
                    }
                    else {
                        logw("rpFormInputText: onFocus callback is not a function!");
                    }
                }
            };

            dir.onBlur = function () {
                var onBlur = config.onBlur;
                dir.state.focus = false;

                if (onBlur) {
                    if (typeof onBlur == "function") {
                        onBlur();
                    }
                    else {
                        logw("rpFormInputText: onBlur callback is not a function!");
                    }
                }
            };

            dir.onMouseover = function () {
                dir.state.hover = true;
            };

            dir.onMouseout = function () {
                dir.state.hover = false;
            };

            dir.onChange = function (data) {
                var onChange = config.onChange;

                if (onChange) {
                    if (typeof onChange == "function") {
                        onChange(data);
                    }
                    else {
                        logw("rpFormInputText: onChange callback is not a function!");
                    }
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                ctrl = undefined;
                config = undefined;
                scope.config = undefined;
                scope.inputText = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C",
            require: "ngModel"
        };
    }

    angular
        .module("rpFormInputText")
        .directive("rpFormInputTextField", [rpFormInputTextField]);
})(angular);

//  Source: _lib\realpage\form-input-text-v1\js\directives\form-input-text.js
//  Form Input Text Directive

(function (angular, undefined) {
    "use strict";

    function rpFormInputText(baseConfig) {
        function pre(scope, elem, attr) {
            scope.config = scope.config || baseConfig({
                modelOptions: {
                    updateOn: "blur"
                }
            });

            if (scope.config.errorMsgs && !scope.config.errorMsgs.empty()) {
                elem.addClass("has-error-msgs");
            }
        }

        function compile(elem, attr, trans) {
            return {
                pre: pre,
                post: angular.noop
            };
        }

        return {
            scope: {
                config: "=?",
                rpModel: "="
            },
            restrict: "E",
            replace: true,
            compile: compile,
            templateUrl: "realpage/form-input-text-v1/templates/input-text.html"
        };
    }

    angular
        .module("rpFormInputText")
        .directive("rpFormInputText", ["rpFormInputTextConfig", rpFormInputText]);
})(angular);

//  Source: _lib\realpage\form-input-text-v1\js\directives\filter-input.js
//  Filter Input Directive

(function (angular, undefined) {
    "use strict";

    function rpFilterInput(inputFilter, filter) {
        function link(scope, elem, attr) {
            var dir = {},
                filterKey;

            dir.init = function () {
                filterKey = scope.$eval(attr.rpFilterInput);

                if (filterKey) {
                    if (filter.exists(filterKey)) {
                        elem.on("keydown.rpFilterInput", dir.onKeyDown);
                    }
                    else {
                        logc("rpFilterInput.init: " + filterKey + " is not a valid input filter");
                    }
                }

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onKeyDown = function (event) {
                return inputFilter[filterKey](event);
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.off("keydown.rpFilterInput");

                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
                filterKey = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpFormInputText")
        .directive("rpFilterInput", ["rpInputFilter", "rpInputFilter", rpFilterInput]);
})(angular);


//  Source: _lib\realpage\form-input-text-v1\js\models\filter-types.js
//  Form Input Filter Types

(function (angular, undefined) {
    "use strict";

    function factory() {
        return {
            numeric: "isNumeric"
        };
    }

    angular
        .module("rpFormInputText")
        .factory("rpInputFilterType", [factory]);
})(angular);

//  Source: _lib\realpage\form-input-text-v1\js\models\form-input-text-config.js
//  Form Input Text Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var index = 0;

        return function (cfg) {
            index++;
            cfg = cfg || {};

            var fieldId = "input" + index;

            var defCfg =  {
                prefix: "",
                suffix: "",
                id: fieldId,
                iconClass: "",
                minlength: "",
                maxlength: "",
                disabled: false,
                readonly: false,
                required: false,
                dataType: "text",
                fieldName: fieldId,
                size: "",
                // pattern: /^[0-9a-z]+$/i,
                placeholder: "",
                errorMsgs: [],
                validators: {
                    // sample: function (modelValue, viewValue) {
                    //     return true/false;
                    // }
                },
                asyncValidators: {

                },
                modelOptions: {
                    updateOn: "default"
                },
                trimInput: true,
                onBlur: angular.noop,
                onFocus: angular.noop,
                onChange: angular.noop,
                autocomplete: "off"
            };

            return angular.extend(defCfg, cfg);
        };
    }

    angular
        .module("rpFormInputText")
        .factory("rpFormInputTextConfig", [factory]);
})(angular);


//  Source: _lib\realpage\form-input-text-v1\js\services\input-filter.js
//  Form Input Filter Service

(function (angular, undefined) {
    "use strict";

    function FormInputFilter(keycode) {
        var svc = this;

        svc.isNumeric = function () {
            return keycode.isNumeric(event) || keycode.isNav(event);
        };

        svc.exists = function (key) {
            return !!svc[key];
        };
    }

    angular
        .module("rpFormInputText")
        .service("rpInputFilter", [
            "keycode",
            FormInputFilter
        ]);
})(angular);


//  Source: _lib\realpage\form-input-text-v1\js\templates\templates.inc.js
angular.module("rpFormInputText").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/form-input-text-v1/templates/input-text.html",
"<div class=\"rp-form-input-text\" ng-class=\"inputText.getState()\"><div class=\"rp-form-input-text-table\"><div class=\"rp-form-input-text-row\"><div ng-if=\"config.prefix\" class=\"rp-form-input-text-cell rp-form-input-text-prefix\"><span class=\"rp-form-input-text-prefix-text\">{{::config.prefix}}</span></div><div class=\"rp-form-input-text-cell rp-form-input-text-field-wrap\"><input class=\"rp-form-input-text-field\" id=\"{{::config.id}}\" maxlength=\"{{config.maxlength}}\" minlength=\"{{config.minlength}}\" name=\"{{::config.fieldName}}\" ng-blur=\"inputText.onBlur()\" ng-change=\"inputText.onChange(rpModel)\" ng-disabled=\"config.disabled\" ng-focus=\"inputText.onFocus()\" ng-model-options=\"config.modelOptions\" ng-model=\"rpModel\" ng-mouseout=\"inputText.onMouseout()\" ng-mouseover=\"inputText.onMouseover()\" ng-pattern=\"config.pattern\" ng-readonly=\"config.readonly\" ng-required=\"config.required\" ng-trim=\"{{::config.trimInput}}\" placeholder=\"{{config.placeholder}}\" rp-filter-input=\"config.inputFilter\" type=\"{{::config.dataType}}\" autocomplete=\"{{::config.autocomplete}}\"></div><div ng-if=\"config.suffix\" class=\"rp-form-input-text-cell rp-form-input-text-suffix\"><span ng-if=\"config.suffix\" class=\"rp-form-input-text-suffix-text\">{{::config.suffix}}</span></div><div ng-if=\"config.iconClass\" class=\"rp-form-input-text-cell rp-form-input-text-icon-wrap\"><span class=\"rp-form-input-text-icon {{config.iconClass}}\"></span></div></div></div><ul class=\"rp-form-error-msgs\"><li ng-if=\"msg.active\" class=\"rp-form-error-msg\" ng-repeat=\"msg in config.errorMsgs\">{{msg.text}}</li></ul></div>");
}]);

//  Source: ui\lib\realpage\form-select-menu-v1\js\scripts.js
//  Source: _lib\realpage\form-select-menu-v1\js\_bundle.inc
angular.module("rpFormSelectMenu", []);

//  Source: _lib\realpage\form-select-menu-v1\js\templates\templates.inc.js
angular.module("rpFormSelectMenu").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/form-select-menu-v1/templates/form-select-menu.html",
"<div class=\"rp-select-menu\" ng-class=\"menu.getState()\"><span ng-if=\"configData.readonly\" class=\"rp-select-menu-readonly\" title=\"{{menu.getDisplayText()}}\"></span><select class=\"rp-form-select-field\" id=\"{{::configData.id}}\" name=\"{{::configData.fieldName}}\" ng-blur=\"menu.onBlur()\" ng-change=\"menu.onChange(rpModel)\" ng-disabled=\"configData.disabled\" ng-focus=\"menu.onFocus()\" ng-model-options=\"configData.modelOptions\" ng-model=\"rpModel\" ng-mouseout=\"menu.onMouseout()\" ng-mouseover=\"menu.onMouseover()\" ng-options=\"option.value as option.name group by option.group for option in configData.options | rpFormSelectMenuFilter: configData\" ng-readonly=\"configData.readonly\" ng-required=\"configData.required\" title=\"{{menu.getDisplayText()}}\"></select><div class=\"rp-select-menu-inner\"><span title=\"{{menu.getDisplayText()}}\" class=\"rp-select-menu-value\">{{menu.getDisplayText()}} {{config.getType(menu)}}</span></div><ul class=\"rp-form-error-msgs\"><li ng-if=\"msg.active\" class=\"rp-form-error-msg\" ng-repeat=\"msg in configData.errorMsgs\">{{msg.text}}</li></ul></div>");
}]);

//  Source: _lib\realpage\form-select-menu-v1\js\models\form-select-menu.js
//  Select Menu Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var inst = 1;

        function SelectMenuConfig() {
            var s = this;
            s.init();
        }

        var p = SelectMenuConfig.prototype;

        p.init = function () {
            var s = this;
            s._id = inst++;
            s._name = "SelectMenuConfig";

            s.keys = [];
            s.fieldId = "select-menu-" + inst;

            s.data = {
                size: "",
                options: [],
                disabled: false,
                displayText: "",
                dynamicDisplayText: true,
                errorMsgs: [
                    // {
                    //     name: "sample",
                    //     text: "Sample validation error message"
                    // }
                ],
                fieldName: s.fieldId,
                id: s.fieldId,
                modelOptions: {
                    allowInvalid: true,
                    updateOn: "default"
                },
                nameKey: "name",
                onChange: angular.noop,
                readonly: false,
                required: false,
                valueKey: "value",
                groupKey: "group",
                asyncValidators: {

                },
                validators: {
                    // sample: function (modelValue, viewValue) {
                    //     return true/false;
                    // }
                },
                optionsFilter: {}
            };

            return s;
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        p.getOptionName = function (optionValue) {
            var name,
                s = this;

            s.data.options.forEach(function (option) {
                if (option.value === optionValue) {
                    name = option.name;
                }
            });

            return name;
        };

        p.getOptionValue = function (optionName) {
            var value,
                s = this;

            s.data.options.forEach(function (option) {
                if (option.value === optionName) {
                    value = option.value;
                }
            });

            return value;
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        p.setOptions = function (options) {
            var s = this;
            s.flushOptions().addOptions(options);
            return s;
        };

        p.setOptionsFilter = function (filter) {
            var s = this;
            s.data.optionsFilter = filter;
            return s;
        };

        // Assertions

        p.isValidOption = function (option) {
            var s = this;
            return option &&
                option[s.data.nameKey] !== undefined &&
                option[s.data.valueKey] !== undefined &&
                s.keys.indexOf(option[s.data.nameKey]) == -1;
        };

        p.hasErrorMsgs = function () {
            var s = this;
            return s.data.errorMsgs && !s.data.errorMsgs.empty();
        };

        p.hasGroupKey = function (option) {
            var s = this;
            return s.data.groupKey !== undefined &&
                option[s.data.groupKey] !== undefined;
        };

        // Actions

        p.addOptions = function (options) {
            var s = this;

            if (options && options.push) {
                options.forEach(s.addOption.bind(s));
            }
            else {
                logc("rpFormSelectMenuConfig.addOptions: options should be an array!");
            }

            return s;
        };

        p.addOption = function (option) {
            var s = this;

            if (s.isValidOption(option)) {
                s.keys.push(option[s.data.nameKey]);

                var newOption = {
                    name: option[s.data.nameKey],
                    value: option[s.data.valueKey]
                };

                if (s.hasGroupKey(option)) {
                    newOption.group = option[s.data.groupKey];
                }

                s.data.options.push(newOption);
            }

            return s;
        };

        p.flushOptions = function () {
            var s = this;
            s.keys.flush();
            s.data.options.flush();
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.flushOptions();
            s.data = undefined;
            return s;
        };

        return function (data) {
            return (new SelectMenuConfig()).setData(data);
        };
    }

    angular
        .module("rpFormSelectMenu")
        .factory("rpFormSelectMenuConfig", [factory]);
})(angular);

//  Source: _lib\realpage\form-select-menu-v1\js\directives\form-select-menu.js
//  Select Menu Directive

(function (angular, undefined) {
    "use strict";

    function rpFormSelectMenu(timeout) {
        function pre(scope, elem, attr) {
            scope.configData = scope.config.getData();

            if (scope.config.hasErrorMsgs()) {
                elem.addClass("has-error-msgs");
            }
        }

        function compile(elem, attr, trans) {
            return {
                pre: pre,
                post: angular.noop
            };
        }

        return {
            scope: {
                config: "=",
                rpModel: "="
            },
            restrict: "E",
            replace: true,
            compile: compile,
            templateUrl: "realpage/form-select-menu-v1/templates/form-select-menu.html"
        };
    }

    angular
        .module("rpFormSelectMenu")
        .directive("rpFormSelectMenu", ["timeout", rpFormSelectMenu]);
})(angular);

//  Source: _lib\realpage\form-select-menu-v1\js\directives\form-select-field.js
//  Select Field Directive

(function (angular, undefined) {
    "use strict";

    function rpFormSelectField(timeout) {
        function link(scope, elem, attr, ctrl) {
            var dir = {},
                config = scope.config,
                configData = scope.configData;

            dir.init = function () {
                dir.state = {
                    hover: false,
                    focus: false
                };

                dir.errorState = {};

                if (configData.size) {
                    dir.state[configData.size] = true;
                }

                if (dir.hasValidators()) {
                    angular.extend(ctrl.$validators, configData.validators);
                }

                if (dir.hasAsyncValidators()) {
                    angular.extend(ctrl.$asyncValidators, configData.asyncValidators);
                }

                Object.keys(ctrl.$validators).forEach(function (key) {
                    dir.errorState[key] = false;
                });

                dir.destWatch = scope.$on("$destroy", dir.destroy);

                scope.menu = dir;
            };

            dir.hasAsyncValidators = function () {
                return configData.asyncValidators &&
                    Object.keys(configData.asyncValidators).length !== 0;
            };

            dir.hasValidators = function () {
                return configData.validators &&
                    Object.keys(configData.validators).length !== 0;
            };

            dir.getState = function () {
                angular.extend(dir.state, {
                    dirty: ctrl.$dirty,
                    error: ctrl.$invalid,
                    touched: ctrl.$touched,
                    readonly: configData.readonly,
                    disabled: configData.disabled
                }, dir.errorState, ctrl.$error);

                configData.errorMsgs.forEach(function (msg) {
                    msg.active = ctrl.$error[msg.name];
                });

                return dir.state;
            };

            dir.onFocus = function () {
                dir.state.focus = true;
            };

            dir.onBlur = function () {
                dir.state.focus = false;
            };

            dir.onMouseover = function () {
                dir.state.hover = true;
            };

            dir.onMouseout = function () {
                dir.state.hover = false;
            };

            dir.onChange = function (data) {
                var onChange = configData.onChange;

                if (onChange) {
                    if (typeof onChange == "function") {
                        dir.timer = timeout(function () {
                            onChange(data);
                        });
                    }
                    else {
                        logw("rpFormSelectMenu: onChange callback is not a function!");
                    }
                }
            };

            dir.getDisplayText = function () {
                if (configData.dynamicDisplayText) {
                    return config.getOptionName(scope.rpModel);
                }
                else {
                    return configData.displayText;
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                timeout.cancel(dir.timer);
                dir = undefined;
                ctrl = undefined;
                config = undefined;
                configData = undefined;
                scope.menu = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C",
            require: "ngModel"
        };
    }

    angular
        .module("rpFormSelectMenu")
        .directive("rpFormSelectField", ["timeout", rpFormSelectField]);
})(angular);

//  Source: _lib\realpage\form-select-menu-v1\js\filters\form-select-menu.js
// Select Menu Filter

(function (angular) {
    "use strict";

    function filter($filter) {
        return function filter(options, config) {
            var filtered,
                newOptions = [];

            options = options.filter(function (option) {
                if (option.value === "") {
                    newOptions = [option];
                }
                return option.value !== "";
            });

            if (angular.isFunction(config.optionsFilter)) {
                filtered = config.optionsFilter(options);
            }
            else {
                filtered = $filter("filter")(options, config.optionsFilter);
            }

            return newOptions.concat(filtered);
        };
    }

    angular
        .module("rpFormSelectMenu")
        .filter("rpFormSelectMenuFilter", ["$filter", filter]);
})(angular);

//  Source: ui\lib\realpage\form-textarea-v1\js\scripts.js
//  Source: _lib\realpage\form-textarea-v1\js\_bundle.inc
angular.module("rpFormTextarea", []);

//  Source: _lib\realpage\form-textarea-v1\js\templates\templates.inc.js
angular.module("rpFormTextarea").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/form-textarea-v1/templates/textarea.html",
"<div class=\"rp-form-textarea\" ng-class=\"textarea.getState()\"><div class=\"rp-form-textarea-field-wrap\"><span class=\"rp-form-textarea-disabled\" ng-if=\"config.disabled\"></span><textarea class=\"rp-form-textarea-field\" id=\"{{::config.id}}\" maxlength=\"{{config.maxlength}}\" minlength=\"{{config.minlength}}\" name=\"{{::config.fieldName}}\" ng-blur=\"textarea.onBlur()\" ng-change=\"textarea.onChange(rpModel)\" ng-disabled=\"config.disabled\" ng-focus=\"textarea.onFocus()\" ng-model-options=\"config.modelOptions\" ng-model=\"rpModel\" ng-mouseout=\"textarea.onMouseout()\" ng-mouseover=\"textarea.onMouseover()\" ng-pattern=\"config.pattern\" ng-readonly=\"config.readonly\" ng-required=\"config.required\" placeholder=\"{{config.placeholder}}\">\n" +
"        </textarea></div><ul class=\"rp-form-error-msgs\"><li ng-if=\"msg.active\" class=\"rp-form-error-msg\" ng-repeat=\"msg in config.errorMsgs\">{{msg.text}}</li></ul></div>");
}]);

//  Source: _lib\realpage\form-textarea-v1\js\models\form-textarea-config.js
//  Form Textarea Model

(function (angular) {
    "use strict";

    function factory() {
        var index = 0;

        return function (cfg) {
            index++;

            cfg = cfg || {};

            var fieldId = "textarea" + index;

            var defCfg = {
                id: fieldId,
                minlength: "",
                maxlength: "",
                disabled: false,
                readonly: false,
                required: false,
                fieldName: fieldId,
                // pattern: /^[0-9a-z]+$/i,
                placeholder: "",
                errorMsgs: [],
                validators: {
                    // sample: function (modelValue, viewValue) {
                    //     return true/false;
                    // }
                },
                modelOptions: {
                    // updateOn: "blur"
                },
                onChange: angular.noop
            };

            return angular.extend(defCfg, cfg);
        };
    }

    angular
        .module("rpFormTextarea")
        .factory("rpFormTextareaConfig", [factory]);
})(angular);

//  Source: _lib\realpage\form-textarea-v1\js\directives\form-textarea.js
//  Form Textarea Directive

(function (angular) {
    "use strict";

    function rpFormTextarea(baseConfig) {
        function link(scope, elem, attr) {
            scope.config = scope.config || {};
            var config = angular.extend({}, scope.config);
            angular.extend(scope.config || {}, baseConfig(), config);
        }

        return {
            scope: {
                config: "=",
                rpModel: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/form-textarea-v1/templates/textarea.html"
        };
    }

    angular
        .module("rpFormTextarea")
        .directive("rpFormTextarea", ["rpFormTextareaConfig", rpFormTextarea]);
})(angular);

//  Source: _lib\realpage\form-textarea-v1\js\directives\form-textarea-field.js
//  Form Textarea Directive

(function (angular) {
    "use strict";

    function rpFormTextareaField() {
        function link(scope, elem, attr, ctrl) {
            var config = scope.config;

            if (!config) {
                return;
            }

            var dir = {
                state: {
                    hover: false,
                    focus: false
                }
            };

            dir.init = function () {
                dir.timer = "";
                dir.errorState = {};
                scope.textarea = dir;

                if (dir.hasValidators()) {
                    angular.extend(ctrl.$validators, config.validators);
                }

                Object.keys(ctrl.$validators).forEach(function (key) {
                    dir.errorState[key] = false;
                });
            };

            dir.hasValidators = function () {
                return config.validators &&
                    Object.keys(config.validators).length !== 0;
            };

            dir.getState = function () {
                angular.extend(dir.state, {
                    dirty: ctrl.$dirty,
                    error: ctrl.$invalid,
                    touched: ctrl.$touched,
                    readonly: config.readonly,
                    disabled: config.disabled
                }, dir.errorState, ctrl.$error);

                config.errorMsgs.forEach(function (msg) {
                    msg.active = ctrl.$error[msg.name];
                });

                return dir.state;
            };

            dir.onFocus = function () {
                dir.state.focus = true;
            };

            dir.onBlur = function () {
                dir.state.focus = false;
            };

            dir.onMouseover = function () {
                dir.state.hover = true;
            };

            dir.onMouseout = function () {
                dir.state.hover = false;
            };

            dir.onChange = function (data) {
                var onChange = config.onChange;

                if (onChange) {
                    if (typeof onChange == "function") {
                        onChange(data);
                    }
                    else {
                        logw("rpFormTextarea: onChange callback is not a function!");
                    }
                }
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C",
            require: "ngModel"
        };
    }

    angular
        .module("rpFormTextarea")
        .directive("rpFormTextareaField", [rpFormTextareaField]);
})(angular);


//  Source: ui\lib\realpage\page-title\js\scripts.js
//  Source: _lib\realpage\page-title\js\_bundle.inc
angular.module("rpPageTitle", []);

//  Source: _lib\realpage\page-title\js\providers\page-title.js
//  Resource Paths Provider

(function (angular) {
    "use strict";

    function Provider() {
        var prodName,
            prov = this,
            metaData = [],
            companyName = "OneSite";

        prov.setData = function (data) {
            metaData = data;
            return prov;
        };

        prov.setProdName = function (name) {
            prodName = name;
            return prov;
        };

        prov.setCompanyName = function (name) {
            companyName = name;
            return prov;
        };

        function provide($rootScope, location, eventStream) {
            var model = {};

            model.events = {};
            model.isReady = false;
            model.prodName = prodName;
            model.companyName = companyName;

            model.init = function () {
                model.events.update = eventStream();
                $rootScope.$on('$locationChangeSuccess', model.setDataModel);
                return model;
            };

            model.setDataModel = function () {
                var found = false,
                    url = location.url();

                metaData.forEach(function (listItem) {
                    if (url.match(listItem.url)) {
                        found = true;
                        var pageTitle = model.getPageTitle(listItem.data);
                        model.events.update.publish(pageTitle);
                    }
                });

                if (!found) {
                    model.events.update.publish("");
                }
            };

            model.getPageTitle = function (data) {
                var parts = [data.pageTitle, prodName, model.companyName];
                return parts.join(" - ");
            };

            model.subscribe = function (eventName, callback) {
                var valid = eventName && callback &&
                    typeof eventName == "string" &&
                    typeof callback == "function" &&
                    model.events[eventName] !== undefined;

                if (valid) {
                    model.events[eventName].subscribe(callback);
                }
                else {
                    logc("rpPageTitleModel-subscribe: Invalid input params!");
                }
            };

            return model.init();
        }

        prov.$get = ['$rootScope', 'location', 'eventStream', provide];
    }

    angular
        .module("rpPageTitle")
        .provider('rpPageTitleModel', [Provider]);
})(angular);

//  Source: _lib\realpage\page-title\js\directives\page-title.js
//  Page Title Directive

(function (angular) {
    "use strict";

    function title(model) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                model.subscribe("update", dir.setPageTitle);
            };

            dir.setPageTitle = function (title) {
                elem.text(title);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'E'
        };
    }

    angular
        .module("rpPageTitle")
        .directive('title', ['rpPageTitleModel', title]);
})(angular);

//  Source: ui\lib\realpage\global-header\js\scripts.js
angular.module("rpGlobalHeader", []);

//  Source: _lib\realpage\global-header\js\controllers\app-switcher-menu.js
//  App Switcher Controller

(function (angular, undefined) {
    "use strict";

    function RpGhAppSwitcherMenuCtrl($scope, model, tabsMenuData) {
        var vm = this;

        vm.init = function () {
            $scope.model = model;
            $scope.tabsData = tabsMenuData.getData();
            $scope.tabsMenu = tabsMenuData.getTabsMenu();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();

            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("rpGlobalHeader")
        .controller("RpGhAppSwitcherMenuCtrl", [
            "$scope",
            "rpGhAppSwitcherMenuModel",
            "rpGhAppSwitcherTabsData",
            RpGhAppSwitcherMenuCtrl
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\controllers\global-header.js
//  Global Header Controller

(function (angular, undefined) {
    "use strict";

    function RpGlobalHeaderCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            $scope.model = model;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("rpGlobalHeader")
        .controller("rpGlobalHeaderCtrl", [
            "$scope",
            "rpGlobalHeaderModel",
            RpGlobalHeaderCtrl
        ]);
})(angular);


//  Source: _lib\realpage\global-header\js\directives\app-switcher.js
//  App Switcher Directive

(function (angular, undefined) {
    "use strict";

    function rpGhAppSwitcher() {
        function link(scope, elem, attr) {}

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/global-header/templates/app-switcher.html"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGhAppSwitcher", [rpGhAppSwitcher]);
})(angular);

//  Source: _lib\realpage\global-header\js\directives\app-switcher-menu.js
//  Global Header App Switcher Directive

(function (angular) {
    "use strict";

    function rpGhAppSwitcherMenu() {
        function link(scope, elem, attr) {}

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            controller: "RpGhAppSwitcherMenuCtrl as appSwitcherMenu",
            templateUrl: "realpage/global-header/templates/app-switcher-menu.html"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGhAppSwitcherMenu", [rpGhAppSwitcherMenu]);
})(angular);

//  Source: _lib\realpage\global-header\js\directives\global-header.js
// Global Header Directive

(function (angular, undefined) {
    "use strict";

    function globalHeader(model) {
        function link(scope, elem, attr) {}

        return {
            link: link,
            restrict: "E",
            replace: true,
            controller: "rpGlobalHeaderCtrl as header",
            templateUrl: "realpage/global-header/templates/header.html"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGlobalHeader", [
            "rpGlobalHeaderModel",
            globalHeader
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\directives\user-links-toggle.js
//  User Links Menu Toggle Directive

(function (angular, undefined) {
    "use strict";

    function rpGhUserLinksToggle(timeout) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.userLinks = dir;
                dir.on = false;
                dir.click = "click.headerUserLinksMenu";
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.toggleMenu = function () {
                if (!dir.on) {
                    timeout(dir.bindHide, 10);
                }

                dir.on = !dir.on;
            };

            dir.bindHide = function () {
                dir.body = dir.body || angular.element("body");
                dir.body.one(dir.click, dir.onBodyClick);
            };

            dir.hideMenu = function () {
                dir.on = false;
            };

            dir.onBodyClick = function () {
                scope.$apply(dir.hideMenu);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGhUserLinksToggle", ["timeout", rpGhUserLinksToggle]);
})(angular);

//  Source: _lib\realpage\global-header\js\directives\nav-pref.js
//  Nav Prefs Directive

(function (angular, undefined) {
    "use strict";

    function rpGhNavPrefs(timeout, pubsub) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.pref = {
                    dark: false
                };

                scope.ghNav = dir;
                timeout(dir.onChange, 300);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onChange = function () {
                pubsub.publish("gn.themeUpdate", dir.pref);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGhNavPrefs", ["timeout", "pubsub", rpGhNavPrefs]);
})(angular);


//  Source: _lib\realpage\global-header\js\filters\icon-path.js
// Global Header Icon Filter

(function (angular) {
    "use strict";

    function filter(cdnVer) {
        var icons = {
            "82F7C646-599D-4AA5-A4D1-D951CCE21280": "building-1",
            "0C9DA909-71FA-4807-BA36-7CCDE6E580EC": "building-2",
            "0c9da909-71fa-4807-ba36-7ccde6e580ec": "cart-1",
            "F80209A2-EFF4-4DBF-8A3D-785BCDF031A3": "cart-1",
            "07B352BA-1001-41FB-99CD-DBA778C70914": "user-hierarchy",
            "7E298848-4A6D-4042-BE9C-29FF2A73186C": "calculator-1",
            "C9D127AA-E694-4394-8D6D-AADB2A37B50B": "user-1",
            "2F29D8F5-3E6F-428A-A89C-D808C2ADFC86": "credit-card-1",
            "6BA23040-6B36-402A-86D9-60C3594A5712": "house-2",
            "514469EE-C813-483B-9A3A-C778209BC0A1": "user-with-phone",
            "A6239C5A-8B0F-415E-BD7F-83D48C47388E": "bulb-1",
            "EED3BAF4-46B3-48AC-A576-43659B233BA1": "scroll-with-house",
            "D174779E-9DD6-4D7D-A57F-21B3FAEF611F": "webpage-1",
            "A3EB1EAF-D7A8-41DA-9CF1-596B188BA616": "magnifying-glass-1",
            "0AE2B7C9-6492-4F8F-BC1B-6C0B1D8663C1": "scroll-with-house",
            "D2E30084-1F8F-46D2-A7F2-B668C423E61E": "user-with-headset",
            "702AFBCB-0BDB-4360-B120-C852FB593512": "card-with-dots-1",
            "CCFE2F2B-BE0B-4075-B673-110F683E51C4": "bar-chart-1",
            "1B6A6DDF-4476-4C02-93D1-A7CEB345F39A": "pie-chart-1",
            "955F9930-0753-43A1-9304-EAEC9F4B5626": "folder-1",
            "696E482C-D4BA-4ECB-ADF1-7E7A7C6D606D": "line-chart-1",
            "EA018F00-F2CE-41BF-8E87-38C84F4B40F4": "pie-chart-1",
            "EA66353F-338E-444E-8775-06FDC6B4D020": "briefcase-1"
        };

        return function (guid) {
            guid = guid.toUpperCase();

            if (!icons[guid]) {
                logc("Icon for guid " + guid + " is undefined!");
                return "";
            }

            return "/" + cdnVer + "/lib/realpage/svg-icons/images/" + icons[guid] + ".svg";
        };
    }

    angular
        .module("rpGlobalHeader")
        .filter("rpGhIconPath", ["cdnVer", filter]);
})(angular);


//  Source: _lib\realpage\global-header\js\models\app-switcher-tabs-data.js
//  Global Header App Switcher Tabs Data

(function (angular) {
    "use strict";

    function AppSwitcherTabsData(scrollingTabsMenu) {
        var data,
            svc = this;

        data = {
            families: {
                id: "01",
                isActive: false
            },

            favorites: {
                id: "02",
                isActive: true
            }
        };

        svc.setText = function (textData) {
            angular.forEach(textData, function (val, key) {
                data[key]["text"] = val;
            });
        };

        // Getters

        svc.getData = function () {
            return data;
        };

        svc.getTabsMenu = function () {
            return scrollingTabsMenu([
                data.families,
                data.favorites
            ]);
        };

        // Actions

        svc.activateTab = function (tabKey) {
            angular.forEach(data, function (val, key) {
                val.isActive = key == tabKey;
            });
        };
    }

    angular
        .module("rpGlobalHeader")
        .service("rpGhAppSwitcherTabsData", [
            "rpScrollingTabsMenuModel",
            AppSwitcherTabsData
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\app-switcher-menu.js
//  App Switcher Model

(function (angular, undefined) {
    "use strict";

    function factory(tabsData) {
        function RpGhAppSwitcherMenuModel() {
            var s = this;
            s.init();
        }

        var p = RpGhAppSwitcherMenuModel.prototype;

        p.init = function () {
            var s = this;
            s.families = [];
            s.solutions = [];
            s.manageLink = {
                url: "",
                text: ""
            };
        };

        // Setters

        p.setData = function (data) {
            var s = this,
                favCount = 0;

            s.families = data.families;
            s.solutions = data.solutions;
            s.manageLinkText = data.manageLinkText;

            s.solutions.forEach(function (soln) {
                if (soln.isFavorite()) {
                    favCount++;
                }
            });

            tabsData.activateTab(favCount === 0 ? "families" : "favorites");

            return s;
        };

        p.setTabsText = function (data) {
            var s = this;
            tabsData.setText(data);
            return s;
        };

        p.setManageLink = function (data) {
            var s = this;
            angular.extend(s.manageLink, data);
            return s;
        };

        return new RpGhAppSwitcherMenuModel();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhAppSwitcherMenuModel", [
            "rpGhAppSwitcherTabsData",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\global-header.js
//  Global Header Model

(function (angular, undefined) {
    "use strict";

    function factory(cdnVer, toolbarIcons, appSwitcher, userLinks) {
        function GlobalHeaderModel() {
            var s = this;
            s.init();
        }

        var p = GlobalHeaderModel.prototype;

        p.init = function () {
            var s = this;

            s.data = {
                showNavToggle: true,

                showLogo: true,
                logoLink: "",
                logoImg1Src: "../" + cdnVer + "/lib/realpage/global-header/images/rp-logo-24x22.svg",
                logoImg2Src: "../" + cdnVer + "/lib/realpage/global-header/images/rp-logo-180x40.svg",

                showCompanyName: false,
                companyNameLink: "",
                companyNameText: "Company Name",

                showUserName: true,
                username: "",

                showInitials: true,
                initials: "",

                showUserAvatarImg: false,
                userAvatarUrl: "../" + cdnVer + "/lib/realpage/global-header/images/user-avatar.jpg"
            };

            s.userLinks = userLinks;
            s.toolbarIcons = toolbarIcons;
        };

        // Setters

        p.setToolbarIcons = function (data) {
            var s = this;
            s.toolbarIcons.setData(data);
            return s;
        };

        p.setUserLinks = function (data) {
            var s = this;
            s.userLinks.setData(data);
            return s;
        };

        // Actions

        p.extendData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        return new GlobalHeaderModel();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGlobalHeaderModel", [
            "cdnVer",
            "rpGhToolbarIcons",
            "rpGhAppSwitcherMenuModel",
            "rpGhUserLinksModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\toolbar-icons.js
//  Global Header Toolbar Icons

(function (angular, undefined) {
    "use strict";

    function factory(linkSvc) {
        function ToolbarIcons() {
            var s = this;
            s.init();
        }

        var p = ToolbarIcons.prototype;

        p.init = function () {
            var s = this;

            s.list = [];

            s.data = {
                homeIcon: {
                    active: false,
                    className: "home"
                },

                appSwitcher: {
                    active: false,
                    isAppSwitcher: true
                },

                helpIcon: {
                    active: false,
                    className: "help",
                    method: s.showHelp.bind(s)
                },

                settingsIcon: {
                    active: false,
                    className: "settings"
                },

                shoppingCartIcon: {
                    active: false,
                    className: "shopping-cart"
                },

                notificationsIcon: {
                    active: false,
                    className: "notifications"
                }
            };

            s.setList(s.data);
        };

        p.setList = function (data) {
            var s = this;

            angular.forEach(s.data, function (val) {
                s.list.push(val);
            });

            return s;
        };

        p.setData = function (data) {
            var s = this;

            angular.forEach(data, function (val, key) {
                angular.extend(s.data[key], val);
            });

            return s;
        };

        p.showHelp = function () {
            var s = this;
            logc("show help!", arguments);
            return s;
        };

        p.invoke = function (link) {
            var s = this;
            linkSvc.invoke(link);
            return s;
        };

        return new ToolbarIcons();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhToolbarIcons", ["rpGhLinkSvc", factory]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\user-links.js
//  User Links Model

(function (angular, undefined) {
    "use strict";

    function factory(linkSvc) {
        function UserLinksModel() {
            var s = this;
            s.init();
        }

        var p = UserLinksModel.prototype;

        p.init = function () {
            var s = this;
            s.links = [];
            s.visible = false;

            // s.links = [
            //     {
            //         "newWin": true,
            //         "text": "Client Portal",
            //         "url": "/product/clientportal"
            //     },
            //     {
            //         "text": "Manage Profile",
            //         "event": "manageProfile.rpGlobalHeader"
            //     },
            //     {
            //         "text": "Sign out",
            //         "event": "signout.rpGlobalHeader"
            //     }
            // ];
        };

        p.setData = function (links) {
            var s = this;
            s.links = links || [];
            return s;
        };

        p.invoke = function (link) {
            var s = this;
            linkSvc.invoke(link);
            return s;
        };

        p.toggleMenu = function () {
            var s = this;
            s.visible = !s.visible;
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.links.flush();
        };

        return new UserLinksModel();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhUserLinksModel", [
            "rpGhLinkSvc",
            factory
        ]);
})(angular);


//  Source: _lib\realpage\global-header\js\services\link.js
//  Global Header Link Service

(function (angular, undefined) {
    "use strict";

    function RpGhLinkSvc($window, $state, pubsub) {
        var svc = this;

        svc.invoke = function (data) {
            if (data.url) {
                svc.invokeLink(data);
            }
            else if (data.sref) {
                svc.invokeState(data);
            }
            else if (data.method) {
                svc.invokeMethod(data);
            }
            else if (data.event) {
                svc.invokeEvent(data);
            }
        };

        svc.invokeLink = function (data) {
            if (data.newWin) {
                var win = $window.open(data.url, "_blank");
                win.focus();
            }
            else {
                $window.location.href = data.url;
            }
        };

        svc.invokeState = function (data) {
            $state.go(data.sref, data.stateParams || {});
        };

        svc.invokeMethod = function (data) {
            data.method(data.args);
        };

        svc.invokeEvent = function (data) {
            pubsub.publish(data.event, data.eventData || {});
        };
    }

    angular
        .module("rpGlobalHeader")
        .service("rpGhLinkSvc", [
            "$window",
            "$state",
            "pubsub",
            RpGhLinkSvc
        ]);
})(angular);


//  Source: _lib\realpage\global-header\js\templates\templates.inc.js
angular.module("rpGlobalHeader").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/global-header/templates/app-switcher-menu.html",
"<div class=\"rp-gh-app-switcher-menu\"><div rp-stop-event=\"click\" class=\"rp-gh-app-switcher-menu-tabs\"><rp-scrolling-tabs-menu model=\"tabsMenu\"></rp-scrolling-tabs-menu></div><div class=\"rp-gh-app-switcher-menu-content\"><div ng-show=\"tabsData.families.isActive\" class=\"rp-gh-app-switcher-services\"><div class=\"rp-gh-app-switcher-service\" ng-repeat=\"family in model.families\"><div class=\"rp-gh-app-switcher-service-title\"><span svg-src=\"{{family.getIconId() | productIconPath}}\" class=\"rp-gh-app-switcher-service-icon rp-svg-icon\"></span> {{::family.data.familyName}}</div><div class=\"rp-gh-app-switcher-product\" ng-repeat=\"soln in family.solutions\"><span svg-src=\"{{soln.getIconId() | productIconPath}}\" class=\"rp-gh-app-switcher-product-icon rp-svg-icon\"></span> <span class=\"rp-gh-app-switcher-product-title-wrap\"><span class=\"rp-gh-app-switcher-product-title\" ng-bind-html=\"soln.data.solutionName\"></span> </span><a ng-href=\"{{soln.data.productUrl}}\" ng-attr-target=\"{{soln.getWinId()}}\" class=\"rp-gh-app-switcher-product-link\"></a><div class=\"rp-gh-app-switcher-product-disabled\" ng-if=\"soln.isProductDisabled()\"></div></div></div></div><div ng-show=\"tabsData.favorites.isActive\" class=\"rp-gh-app-switcher-favorites\"><div ng-if=\"soln.isFavorite()\" class=\"rp-gh-app-switcher-product\" ng-repeat=\"soln in model.solutions\"><span svg-src=\"{{soln.getIconId() | productIconPath}}\" class=\"rp-gh-app-switcher-product-icon rp-svg-icon\"></span> <span class=\"rp-gh-app-switcher-product-title-wrap\"><span class=\"rp-gh-app-switcher-product-title\" ng-bind-html=\"soln.data.solutionName\"></span> </span><a ng-href=\"{{soln.data.productUrl}}\" ng-attr-target=\"{{soln.getWinId()}}\" class=\"rp-gh-app-switcher-product-link\"></a><div class=\"rp-gh-app-switcher-product-disabled\" ng-if=\"soln.isProductDisabled()\"></div></div></div></div><a ng-href=\"{{model.manageLink.url}}\" class=\"rp-gh-app-switcher-manage\">{{model.manageLink.text}}</a></div>");
$templateCache.put("realpage/global-header/templates/app-switcher.html",
"<div class=\"rp-gh-app-switcher\"><rp-toggle model=\"showAppSwitcherMenu\" options=\"{bodyToggle: true}\" class=\"rp-gh-toolbar-icon apps toggle\"></rp-toggle><rp-gh-app-switcher-menu ng-show=\"showAppSwitcherMenu\"><rp-gh-app-switcher-menu></rp-gh-app-switcher-menu></rp-gh-app-switcher-menu></div>");
$templateCache.put("realpage/global-header/templates/header.html",
"<div class=\"rp-gh\"><rp-global-nav-toggle ng-if=\"model.data.showNavToggle\"></rp-global-nav-toggle><div class=\"rp-gh-logo\"><a href=\"{{model.data.logoLink}}\"><img class=\"rp-gh-logo-img-1\" ng-src=\"{{model.data.logoImg1Src}}\" alt=\"logo\"><!--\n" +
"            <img class=\"rp-gh-logo-img-2\" ng-src=\"{{model.data.logoImg2Src}}\" alt=\"logo\" />\n" +
"            --></a></div><div class=\"rp-gh-names\"><span class=\"rp-gh-name-rp\">RealPage</span><h1 class=\"rp-gh-name-company\" ng-if=\"model.data.showCompanyName\"><a href=\"{{model.data.companyNameLink}}\">{{model.data.companyNameText}}</a></h1></div><div class=\"rp-gh-user-links\"><div class=\"rp-gh-user-links-toggle\" ng-click=\"userLinks.toggleMenu()\"><div class=\"rp-gh-user-avatar\"><p class=\"rp-gh-user-initials\" ng-if=\"model.data.showInitials\">{{model.data.userInitials}}</p></div><div class=\"rp-gh-user-info\"><p class=\"rp-gh-user-name\">{{model.data.username}}</p><p class=\"rp-gh-user-role\">{{model.data.userRole}}</p></div></div><div ng-show=\"userLinks.on\" class=\"rp-gh-user-links-menu\"><ul class=\"rp-gh-user-links-list\"><li class=\"rp-gh-user-links-menu-item\" ng-click=\"model.userLinks.invoke(link)\" ng-repeat=\"link in model.userLinks.links\">{{link.text}}</li></ul><div rp-stop-event=\"click\" class=\"rp-gh-nav-prefs\"><div class=\"rp-gh-nav-pref\"><rp-switch class=\"label-1 theme-1\" rp-model=\"ghNav.pref.dark\" rp-on-change=\"ghNav.onChange()\" rp-label-text=\"'Dark Navigation'\"></rp-switch></div></div></div></div><div class=\"rp-gh-toolbar\"><div ng-if=\"icon.active\" class=\"rp-gh-toolbar-icon-wrap\" ng-repeat=\"icon in model.toolbarIcons.list\"><span data-badge=\"{{icon.count}}\" ng-if=\"icon.active && !icon.isAppSwitcher\" ng-click=\"model.toolbarIcons.invoke(icon)\" class=\"rp-gh-toolbar-icon {{icon.className}}\"></span><rp-gh-app-switcher ng-if=\"icon.active && icon.isAppSwitcher\"></rp-gh-app-switcher></div></div></div>");
}]);

//  Source: ui\lib\realpage\global-nav\js\scripts.js
//  Source: _lib\realpage\global-nav\js\_bundle.inc
//  Source: _lib\realpage\global-nav\js\plugin\init.js
// Global Nav Containers

var RealPage = RealPage || {};

(function (RealPage) {
    "use strict";

    RealPage.GlobalNav = {};
})(RealPage);

//  Source: _lib\realpage\global-nav\js\plugin\gn-html-submenu.js
// Global Nav Submenu Html

(function (_, gn) {
    "use strict";

    var menuStr = "" +

    "<% if (links && links.length > 0) { %>" +
        "<ul class='rp-global-nav-submenu <%- className %>'>" +
            "<% _.forEach(links, function(item, index, list) { %>" +
                "<li class='rp-global-nav-submenu-item <%- item.className %>'>" +
                    "<a href='<%- item.labelLink %>' " +
                        "class='rp-global-nav-submenu-item-label <%- item.labelClassName %>'>" +
                        "<%- item.labelText %>" +
                    "</a>" +
                "</li>" +
            "<% }); %>" +
        "</ul>" +
    "<% } %>";

    var menuTpl = _.template(menuStr);

    function getSubmenu(data) {
        return menuTpl(data).trim();
    }

    gn.getSubmenuHtml = getSubmenu;
})(window._, RealPage.GlobalNav);

//  Source: _lib\realpage\global-nav\js\plugin\gn-html-menu.js
// Global Nav Menu Html

(function (_, gn) {
    "use strict";

    var labelStr = "" +

    "<% if (labelLink) { %>" +
        "<a href='<%- labelLink %>' " +
            "class='rp-global-nav-menu-item-label <%- labelClassName %>'>" +
            "<span class='rp-global-nav-menu-item-label-icon <%- iconClassName %>'>" +
            "</span>" +
            "<span class='rp-global-nav-menu-item-label-text'>" +
                "<%- labelText %>" +
            "</span>" +
            "<% if (submenu.links && submenu.links.length !== 0) { %>" +
                "<span class='rp-global-nav-menu-item-label-toggle'></span>" +
            "<% } %>" +
        "</a>" +
    "<% } else { %>" +
        "<span class='rp-global-nav-menu-item-label <%- labelClassName %>'>" +
            "<span class='rp-global-nav-menu-item-label-icon <%- iconClassName %>'>" +
            "</span>" +
            "<span class='rp-global-nav-menu-item-label-text'>" +
                "<%- labelText %>" +
            "</span>" +
            "<% if (submenu.links && submenu.links.length !== 0) { %>" +
                "<span class='rp-global-nav-menu-item-label-toggle'></span>" +
            "<% } %>" +
        "</span>" +
    "<% } %>";

    var labelTpl = _.template(labelStr);

    var getLabel = function(data) {
        data = _.extend({
            labelLink: "",
            labelClassName: ""
        }, data);

        return labelTpl(data);
    };

    var menuItemStr = "" +

    "<li class='rp-global-nav-menu-item <%- className %>'>" +
        "<%= label %>" +
        "<%= submenu %>" +
    "</li>";

    var menuItemTpl = _.template(menuItemStr);

    function getMenuItem(data) {
        data = _.extend({
            submenu: {
                links: [],
                className: ""
            },
            className: "",
            labelText: "",
            iconClassName: "",
            labelClassName: ""
        }, data);

        return menuItemTpl({
            label: getLabel(data),
            className: data.className,
            submenu: gn.getSubmenuHtml(data.submenu)
        });
    }

    var menuStr = "" +

    "<% if (html) { %>" +
        "<div class='rp-global-nav-menu-wrap'>" +
            "<ul class='rp-global-nav-menu'>" +
                "<%= html %>" +
            "</ul>" +
        "</div>" +
    "<% } %>";

    var menuTpl = _.template(menuStr);

    function getMenu(data) {
        var html = "";
        data = data || [];

        data.forEach(function (menuItem) {
            html += getMenuItem(menuItem);
        });

        return menuTpl({
            html: html
        });
    }

    gn.getMenuHtml = getMenu;
})(window._, RealPage.GlobalNav);

//  Source: _lib\realpage\global-nav\js\plugin\gn-class-link.js
// Global Nav Link

(function (window, $) {
    "use strict";

    var id = 0,
        gn = window.RealPage.GlobalNav;

    function MenuLink(elem) {
        id++;
        var s = this;
        s.init(elem);
    }

    var p = MenuLink.prototype;

    p.init = function (elem) {
        var s = this;
        s.id = id;
        s.elem = elem;
        s.onClickCallback = function () {};
        elem.on("click", s.clickHandler.bind(s));
        return s;
    };

    p.activate = function (url) {
        var s = this,
            href = s.elem.attr("href"),
            hash = url.replace(/^.*(\#.*)$/, "$1");
        s.setActive(href == url || href == hash);
        return s;
    };

    p.setActive = function (bool) {
        var s = this;
        s.elem[bool ? "addClass" : "removeClass"]("active");
        return s;
    };

    p.onClick = function (callback) {
        var s = this;
        s.onClickCallback = callback;
        return s;
    };

    p.clickHandler = function () {
        var s = this;
        s.onClickCallback(s);
        return s;
    };

    p.is = function (link) {
        var s = this;
        return link.hasID(s.id);
    };

    p.hasID = function (id) {
        var s = this;
        return s.id == id;
    };

    p.hasUrl = function (url) {
        var s = this;
        return s.elem.attr("href") == url;
    };

    gn.menuLink = function (elem) {
        elem = $(elem);
        var menuLink = elem.data("menuLink");
        if (!menuLink) {
            menuLink = new MenuLink(elem);
            elem.data("menuLink", menuLink);
        }
        return menuLink;
    };
})(window, jQuery);

//  Source: _lib\realpage\global-nav\js\plugin\gn-class-menu-item.js
// Global Nav MenuItem

(function ($, gn) {
    "use strict";

    var id = 0;

    function MenuItem(elem) {
        id++;
        var s = this;
        s.init(elem);
    }

    var p = MenuItem.prototype;

    p.init = function (elem) {
        var s = this;

        s.id = id;
        s.open = false;
        s.menuItem = elem;
        s.openHeight = elem.prop("scrollHeight");
        s.label = elem.children(".rp-global-nav-menu-item-label");
        s.closedHeight = s.label.outerHeight();
        s.label.on("click", s.toggle.bind(s));
        s.menuItem.height(s.closedHeight);
        return s;
    };

    p.hasID = function (id) {
        var s = this;
        return s.id === id;
    };

    p.expand = function () {
        var s = this;
        s.open = true;
        s.menuItem.addClass("open");
        s.menuItem.height(s.openHeight);
        return s;
    };

    p.collapse = function () {
        var s = this;
        s.open = false;
        s.menuItem.removeClass("open");
        s.menuItem.height(s.closedHeight);
        return s;
    };

    p.isOpen = function () {
        var s = this;
        return s.open;
    };

    p.hasSubmenu = function () {
        var s = this;
        return !!s.menuItem.children(".rp-global-nav-submenu").length;
    };

    p.onActivate = function (callback) {
        var s = this;
        s.activateCallback = callback;
        return s;
    };

    p.is = function (item) {
        var s = this;
        return item.hasID(s.id);
    };

    p.toggle = function (event) {
        var s = this;
        s.activateCallback(s);
        event.stopPropagation();
        return s;
    };

    gn.menuItem = function (elem) {
        elem = $(elem);
        var menuItem = elem.data("menuItem");
        if (!menuItem) {
            menuItem = new MenuItem(elem);
            elem.data("menuItem", menuItem);
        }
        return menuItem;
    };
})(jQuery, RealPage.GlobalNav);

//  Source: _lib\realpage\global-nav\js\plugin\gn-class-menu.js
// Global Nav Menu

(function (window, $) {
    "use strict";

    var gn = window.RealPage.GlobalNav;

    function Menu(elem) {
        var s = this;
        s.init(elem);
    }

    var p = Menu.prototype;

    p.init = function (elem) {
        var s = this,
            url = window.location.href;
        s.menu = elem;
        s.onLinkActivateCallback = function () {};
        s.genMenuItems().genLinks().bindEvents().initActiveLink(url);
        return s;
    };

    p.genMenuItems = function () {
        var s = this,
            menuItemElems = s.menu.children(".rp-global-nav-menu-item");

        s.menuItems = [];

        menuItemElems.each(function (index, menuItemElem) {
            var menuItem = gn.menuItem(menuItemElem);
            menuItem.onActivate(s.toggleMenuItem.bind(s));
            s.menuItems.push(menuItem);
        });

        return s;
    };

    p.genLinks = function () {
        var s = this,
            menuLinkElems = s.menu.find("a");

        s.menuLinks = [];

        menuLinkElems.each(function (index, menuLinkElem) {
            var menuLink = gn.menuLink(menuLinkElem);
            menuLink.onClick(s.activateLink.bind(s));
            s.menuLinks.push(menuLink);
        });

        return s;
    };

    p.activateLink = function (item) {
        var s = this;
        s.menuLinks.forEach(function (menuLink) {
            menuLink.setActive(menuLink.is(item));
        });
        s.onLinkActivateCallback();
        return s;
    };

    p.bindEvents = function () {
        var s = this;
        $(window).on("hashchange", s.hashchangeHandler.bind(s));
        return s;
    };

    p.hashchangeHandler = function () {
        var s = this;
        s.menuLinks.forEach(function (menuLink) {
            menuLink.activate(window.location.hash);
        });
        s.menuItems.forEach(function (menuItem) {
            menuItem.collapse();
        });
        return s;
    };

    p.initActiveLink = function (url) {
        var s = this;
        s.menuLinks.forEach(function (menuLink) {
            menuLink.activate(url);
        });
        return s;
    };

    p.toggleMenuItem = function (item) {
        var s = this;
        if (item.isOpen()) {
            item.collapse();
        }
        else {
            item.expand();
            s.menuItems.forEach(function (menuItem) {
                if (!menuItem.is(item) && menuItem.isOpen()) {
                    menuItem.collapse();
                }
            });
        }
        return s;
    };

    p.onLinkActivate = function (callback) {
        var s = this;
        s.onLinkActivateCallback = callback;
        return s;
    };

    gn.menu = function (elem) {
        var menu = elem.data("menu");
        if (!menu) {
            menu = new Menu(elem);
            elem.data("menu", menu);
        }
        return menu;
    };
})(window, jQuery);

//  Source: _lib\realpage\global-nav\js\plugin\gn-plugin.js
// Global Nav Plugin

(function ($, gn) {
    "use strict";

    function GlobalNav(elem, data) {
        var s = this;
        s.init(elem, data);
    }

    var p = GlobalNav.prototype;

    p.init = function (elem, data) {
        var s = this,
            elemHtml = gn.getMenuHtml(data);

        gn.inst = s;
        s.elem = elem;
        elem.html(elemHtml);

        setTimeout(function () {
            s.width = elem.outerWidth();
            s.menu = gn.menu(elem.children().children().eq(0));
            s.menu.onLinkActivate(s.hide.bind(s));
        }, 100);
    };

    p.show = function () {
        var s = this;
        s.visible = true;
        s.elem.css("left", 0);
        return s;
    };

    p.hide = function () {
        var s = this;
        s.visible = false;
        s.elem.css("left", -s.width);
        return s;
    };

    p.toggle = function () {
        var s = this;
        s[s.visible ? "hide" : "show"]();
        return s;
    };

    p.isVisible = function () {
        var s = this;
        return s.visible;
    };

    p.stopClickProp = function (event) {
        event.stopPropagation();
    };

    $.fn.rpGlobalNav = function (navData) {
        return this.each(function () {
            var elem = $(this);
            if (!elem.data("globalNav")) {
                elem.data("globalNav", new GlobalNav(elem, navData));
            }
        });
    };
})(jQuery, RealPage.GlobalNav);

//  Source: _lib\realpage\global-nav\js\plugin\gn-toggle-plugin.js
// Global Nav Toggle Plugin

(function ($, gn) {
    "use strict";

    function GlobalNavToggle(elem) {
        var s = this;
        s.init(elem);
    }

    var p = GlobalNavToggle.prototype;

    p.init = function (elem) {
        var s = this;
        s.body = $("body");
        elem.on("click", s.toggleNav.bind(s));
        return s;
    };

    p.toggleNav = function (event) {
        var s = this;
        gn.inst.toggle();
        setTimeout(s.bindFollowup.bind(s), 10);
        return s;
    };

    p.bindFollowup = function () {
        var s = this;
        if (gn.inst.isVisible()) {
            s.body.one("click.globalNav", s.bodyClickHandler.bind(s));
        }
        else {
            s.body.off("click.globalNav");
        }
        return s;
    };

    p.bodyClickHandler = function () {
        var s = this;
        gn.inst.hide();
        return s;
    };

    $.fn.rpGlobalNavToggle = function () {
        return this.each(function () {
            var elem = $(this);
            if (!elem.data("globalNavToggle")) {
                elem.data("globalNavToggle", new GlobalNavToggle(elem));
            }
        });
    };
})(jQuery, RealPage.GlobalNav);


angular.module("rpGlobalNav", []);

//  Source: _lib\realpage\global-nav\js\directives\global-nav-toggle.js
//  Global Nav Toggle Directive

(function (angular) {
    "use strict";

    function rpGlobalNavToggle() {
        function link(scope, elem, attr) {
            elem.rpGlobalNavToggle();
        }

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            template: "<div class='rp-global-nav-toggle'></div>"
        };
    }

    angular
        .module("rpGlobalNav")
        .directive("rpGlobalNavToggle", [rpGlobalNavToggle]);
})(angular);

//  Source: _lib\realpage\global-nav\js\directives\global-nav.js
//  Global Nav Directive

(function (angular) {
    "use strict";

    function rpGlobalNav(pubsub, model) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                if (model.isReady()) {
                    dir.initNav();
                }
                else {
                    model.subscribe(dir.initNav);
                }

                dir.prefWatch = pubsub.subscribe("gn.themeUpdate", dir.updatePref);
            };

            dir.initNav = function () {
                elem.rpGlobalNav(model.getData());
            };

            dir.updatePref = function (data) {
                elem[!data.dark ? "addClass" : "removeClass"]("theme-1");
            };

            dir.init();
        }

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            template: "<div class='rp-global-nav'></div>"
        };
    }

    angular
        .module("rpGlobalNav")
        .directive("rpGlobalNav", ["pubsub", "rpGlobalNavModel", rpGlobalNav]);
})(angular);

//  Source: _lib\realpage\global-nav\js\models\global-nav.js
//  Global Nav Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream) {
        function GlobalNavModel() {
            var s = this;
            s.init();
        }

        var p = GlobalNavModel.prototype;

        p.init = function () {
            var s = this;
            s.data = [];
            s.ready = false;
            s.update = eventStream();
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            s.data = data;
            s.ready = true;
            s.publish(data);
            return s;
        };

        // Actions

        p.publish = function (data) {
            var s = this;
            s.update.publish(data);
            return s;
        };

        p.subscribe = function () {
            var s = this;
            return s.update.subscribe.apply(s.update, arguments);
        };

        // Assertions

        p.isReady = function () {
            var s = this;
            return s.ready;
        };

        p.reset = function () {
            var s = this;
            s.data = [];
        };

        return new GlobalNavModel();
    }

    angular
        .module("rpGlobalNav")
        .factory("rpGlobalNavModel", ["eventStream", factory]);
})(angular);

//  Source: ui\lib\realpage\grid-controls\js\scripts.js
//  Source: _lib\realpage\grid-controls\js\models\grid-select.js
//  Grid Select Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        return function () {
            var model = {};

            model.selected = false;

            model.setEvents = function (events) {
                model.events = events;
                return model;
            };

            model.publishState = function () {
                model.events.publish("select", model.selected);
                return model;
            };

            model.updateSelected = function (bool) {
                model.selected = bool;
            };

            model.destroy = function () {
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridSelectModel", [factory]);
})(angular);

//  Source: _lib\realpage\grid-controls\js\directives\grid-select.js
//  Grid Select All Directive

(function (angular, undefined) {
    "use strict";

    function rpGridSelect(gridSelectModel) {
        function link(scope, elem, attr) {
            var dir = {},
                model = gridSelectModel(),
                grid = scope.$eval(attr.rpGridModel);

            dir.init = function () {
                dir.model = model;
                scope.gridSelect = dir;
                grid.setGridSelectModel(model);
                model.setEvents(grid.getEvents());
                scope.$on("$destroy", dir.destroy);
            };

            dir.destroy = function () {
                model.destroy();
                dir = undefined;
                grid = undefined;
                model = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridSelect", ["rpGridSelectModel", rpGridSelect]);
})(angular);

//  Source: ui\lib\realpage\grid-pagination\js\scripts.js
//  Source: _lib\realpage\grid-pagination\js\templates\templates.inc.js
angular.module("rpGrid").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/grid-pagination/templates/grid-pagination.html",
"<div class=\"rp-grid-pagination\" ng-class=\"{active: model.isActive}\"><div class=\"rp-grid-pagination-inner\"><p class=\"rp-grid-pagination-displaying\">Displaying {{model.rangeStart}}-{{model.rangeEnd}} of {{model.dataCount}}</p><p class=\"rp-grid-pagination-controls prev\"><span ng-class=\"{active: model.allowFirst}\" ng-click=\"gridPagination.goToFirstPage()\" class=\"rp-grid-pagination-control rp-grid-pagination-control-first\"></span> <span ng-class=\"{active: model.allowPrev}\" ng-click=\"gridPagination.goToPrevPageSet()\" class=\"rp-grid-pagination-control rp-grid-pagination-control-prev\"></span></p><ul class=\"rp-grid-pagination-pages\"><li class=\"rp-grid-pagination-page\" ng-repeat=\"page in model.pages\" ng-class=\"{active: page.active}\" ng-click=\"gridPagination.goToPage(page)\">{{page.number + 1}}</li></ul><p class=\"rp-grid-pagination-controls\"><span ng-class=\"{active: model.allowNext}\" ng-click=\"gridPagination.goToNextPageSet()\" class=\"rp-grid-pagination-control rp-grid-pagination-control-next\"></span> <span ng-class=\"{active: model.allowLast}\" ng-click=\"gridPagination.goToLastPage()\" class=\"rp-grid-pagination-control rp-grid-pagination-control-last end\"></span></p></div></div>");
}]);


//  Source: _lib\realpage\grid-pagination\js\directives\grid-pagination.js
//  Grid Pagination Directive

(function (angular) {
    "use strict";

    function rpGridPagination() {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.model;

            dir.init = function () {
                scope.gridPagination = dir;
            };

            dir.goToPage = function (page) {
                if (!page.active) {
                    model.goToPage(page);
                }
            };

            dir.goToFirstPage = function () {
                model.goToFirstPage();
            };

            dir.goToPrevPageSet = function () {
                model.goToPrevPageSet();
            };

            dir.goToNextPageSet = function () {
                model.goToNextPageSet();
            };

            dir.goToLastPage = function () {
                model.goToLastPage();
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/grid-pagination/templates/grid-pagination.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridPagination", [rpGridPagination]);
})(angular);

//  Source: _lib\realpage\grid-pagination\js\models\grid-pagination.js
//  Grid Pagination Model

(function (angular, undefined) {
    "use strict";

    function factory($filter, gridPaginationSelection) {
        function GridPagination() {
            var s = this;
            s.init();
        }

        var p = GridPagination.prototype;

        p.init = function () {
            var s = this;

            s.config = {
                currentPage: 0,
                pagesPerGroup: 5,
                recordsPerPage: 2,
                currentPageGroup: 0
            };

            s.data = [];
            s.pages = [];
            s.pageGroups = [];
            s.isActive = false;
            s.allowPrev = false;
            s.allowNext = false;
            s.allowLast = false;
            s.allowFirst = false;
            s.trackingSelection = false;
            s.selectionTracker = gridPaginationSelection();

            return s;
        };

        // Setters

        p.setActivePage = function () {
            var s = this;
            s.pages.forEach(function (item) {
                item.active = item.number === s.config.currentPage;
            });
            return s;
        };

        p.setConfig = function (data) {
            var s = this;
            angular.extend(s.config, data);
            return s;
        };

        p.setControls = function () {
            var s = this;
            s.allowFirst = !(s.config.currentPageGroup === 0 && s.config.currentPage === 0);
            s.allowPrev = s.config.currentPageGroup !== 0;
            s.allowNext = s.config.currentPageGroup != s.pageGroups.length - 1;
            s.allowLast = !(s.config.currentPageGroup === s.pageGroups.length - 1 &&
                s.config.currentPage === s.pages.last().number);
            return s;
        };

        p.setData = function (data) {
            var s = this;

            if (!data || !data.push) {
                logw("GridPagination.setData: Invalid data!", data);
                return s;
            }

            var dataCount = data.length;

            if (s._data === undefined) {
                s._data = [].concat(data);
            }

            s.dataCount = dataCount;
            s.data = [].concat(data);

            s.config.currentPage = 0;
            s.config.currentPageGroup = 0;

            s.setPageGroups(dataCount);
            s.isActive = dataCount !== 0;
            s.totalPages = Math.ceil(dataCount / s.config.recordsPerPage);

            if (s.trackingSelection) {
                s.selectionTracker.genIndex(data);
            }

            return s;
        };

        p.setDataRange = function () {
            var s = this;
            s.rangeStart = s.config.currentPage * s.config.recordsPerPage + 1;
            s.rangeEnd = s.rangeStart + s.config.recordsPerPage - 1;

            if (s.rangeEnd > s.dataCount) {
                s.rangeEnd = s.dataCount;
            }

            return s;
        };

        p.setGrid = function (grid) {
            var s = this;
            s.grid = grid;
            grid.subscribe("sortBy", s.sort.bind(s));
            grid.subscribe("filterBy", s.filter.bind(s));
            grid.subscribe("selectChange", s.recordChanges.bind(s));
            return s;
        };

        p.setGridData = function () {
            var s = this,
                data = s.getDataSlice();

            s.grid.flushData().setData({
                records: data
            });

            return s;
        };

        p.setPageGroup = function () {
            var s = this;
            s.pages = s.pageGroups[s.config.currentPageGroup] || [];
            return s;
        };

        p.setPageGroups = function (dataCount) {
            var s = this,
                setIndex = 0,
                maxPages = s.getMaxPages(),
                setCount = Math.ceil(dataCount / (s.config.pagesPerGroup * s.config.recordsPerPage));

            s.pages = [];
            s.pageGroups = [];

            while (setIndex < setCount) {
                var pageStart = setIndex * s.config.pagesPerGroup,
                    pageEnd = (setIndex + 1) * s.config.pagesPerGroup;

                if (pageEnd > maxPages) {
                    pageEnd = maxPages;
                }

                var pages = [],
                    pageIndex = 0;

                for (var i = pageStart; i < pageEnd; i++) {
                    pages.push({
                        active: false,
                        number: setIndex * s.config.pagesPerGroup + pageIndex++
                    });
                }

                s.pageGroups.push(pages);

                setIndex++;
            }

            s.setPageGroup();

            return s;
        };

        // Getters

        p.getMaxPages = function () {
            var s = this;
            return Math.ceil(s.dataCount / s.config.recordsPerPage);
        };

        p.getSelectionChanges = function () {
            var s = this;
            return s.selectionTracker.getSelectionChanges();
        };

        // Actions

        p.filter = function (filterBy) {
            var s = this,
                data = s.filterData(filterBy);

            s.allowFirst = true;
            s.setData(data);

            if (s.sortBy) {
                s.sort(s.sortBy);
            }

            s.goToFirstPage();
        };

        p.sort = function (sortBy) {
            var s = this,
                data = s.sortData(sortBy);
            s.sortBy = sortBy;
            s.setData(data).setGridData();
        };

        p.sortData = function (sortBy) {
            var s = this,
                key = Object.keys(sortBy)[0],
                reverse = sortBy[key] !== "ASC";

            return $filter("naturalSort")(s.data, key, reverse);
        };

        p.filterData = function (filterBy) {
            var s = this,
                data = s._data,
                newFilterBy = {};

            angular.forEach(filterBy, function (val, key, obj) {
                if (!s.grid.filterExists(key)) {
                    return;
                }

                var filter = s.grid.getFilterByKey(key);

                if (filter.hasCustomFilter()) {
                    data = filter.getCustomFilter()(data, obj);
                }
                else {
                    newFilterBy[key] = val;
                }
            });

            if (Object.keys(newFilterBy).length === 0) {
                return data;
            }

            return $filter("filter")(data, newFilterBy);
        };

        p.getDataSlice = function () {
            var s = this,
                start = s.config.currentPage * s.config.recordsPerPage,
                end = start + s.config.recordsPerPage;

            if (end > s.dataCount) {
                end = s.dataCount;
            }

            return s.data.slice(start, end);
        };

        p.goToFirstPage = function () {
            var s = this;
            if (!s.allowFirst) {
                return;
            }
            s.config.currentPage = 0;
            s.config.currentPageGroup = 0;
            s.setPageGroup().setDataRange().setControls().setActivePage().setGridData();
        };

        p.goToLastPage = function () {
            var s = this;
            if (!s.allowLast) {
                return;
            }
            s.config.currentPageGroup = s.pageGroups.length - 1;
            s.setPageGroup();
            s.config.currentPage = s.pages.last().number;
            s.setDataRange().setControls().setActivePage().setGridData();
        };

        p.goToNextPageSet = function () {
            var s = this;
            if (!s.allowNext) {
                return;
            }

            var maxPage = s.getMaxPages() - 1;
            s.config.currentPageGroup++;
            s.config.currentPage += s.config.pagesPerGroup;

            if (s.config.currentPage > maxPage) {
                s.config.currentPage = maxPage;
            }

            s.setPageGroup().setDataRange().setControls().setActivePage().setGridData();
        };

        p.goToPage = function (page) {
            var s = this;
            s.config.currentPage = page.number;
            s.setPageGroup().setDataRange().setControls().setActivePage().setGridData();
        };

        p.goToPrevPageSet = function () {
            var s = this;
            if (!s.allowPrev) {
                return;
            }
            s.config.currentPageGroup--;
            s.config.currentPage -= s.config.pagesPerGroup;
            s.setPageGroup().setDataRange().setControls().setActivePage().setGridData();
        };

        p.recordChanges = function () {
            var s = this;
            if (s.trackingSelection) {
                s.selectionTracker.recordChanges(s.grid.getData().records);
            }
            return s;
        };

        p.trackSelection = function (config) {
            var s = this;
            s.trackingSelection = true;
            s.selectionTracker.setConfig(config);
        };

        p.destroy = function () {
            var s = this;

            s.selectionTracker.destroy();

            s.data = undefined;
            s.grid = undefined;
            s.pages = undefined;
            s.config = undefined;
            s.pageGroups = undefined;
            s.selectionTracker = undefined;
        };

        return function () {
            return new GridPagination();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridPaginationModel", [
            "$filter",
            "rpGridPaginationSelectionModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\grid-pagination\js\models\grid-pagination-selection.js
//  Grid Pagination Selection Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridPaginationSelection() {
            var s = this;
            s.init();
        }

        var p = GridPaginationSelection.prototype;

        p.init = function () {
            var s = this;

            s.states = {};
            s.config = {};

            s.changes = {
                selected: [],
                deselected: []
            };
        };

        // Setters

        p.setConfig = function (config) {
            var s = this;
            s.config = config;
            return s;
        };

        // Getters

        p.getItemID = function (item) {
            var s = this;
            return item[s.config.idKey];
        };

        p.getItemSelState = function (item) {
            var s = this;
            return item[s.config.selectKey];
        };

        p.getSelectionChanges = function () {
            var s = this;

            s.changes = {
                selected: [],
                deselected: []
            };

            Object.keys(s.states).forEach(function (key) {
                var state = s.states[key],
                    changeKey = state.defSelState ? "deselected" : "selected";

                if (state.hasChanged) {
                    s.changes[changeKey].push(state.id);
                }
            });

            return s.changes;
        };

        // Actions

        p.genIndex = function (data) {
            var s = this;

            data.forEach(function (item) {
                s.states["#" + s.getItemID(item)] = {
                    hasChanged: false,
                    id: s.getItemID(item),
                    defSelState: s.getItemSelState(item)
                };
            });

            return s;
        };

        p.recordChanges = function (data) {
            var s = this;

            data.forEach(function (item) {
                var stateData = s.states["#" + s.getItemID(item)];
                stateData.hasChanged = s.getItemSelState(item) !== stateData.defSelState;
            });

            return s;
        };

        p.destroy = function () {
            var s = this;
            s.config = undefined;
            s.states = undefined;
            s.changes = undefined;
        };

        return function () {
            return new GridPaginationSelection();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridPaginationSelectionModel", [factory]);
})(angular);

//  Source: ui\lib\realpage\grid\js\scripts.js
//  Source: _lib\realpage\grid\js\_bundle.inc
angular.module("rpGrid", []);

//  Source: _lib\realpage\grid\js\directives\grid-cell.js
//  Grid Cell Directive

(function (angular, undefined) {
    "use strict";

    function rpGridCell($templateCache, $compile) {
        function link(scope, elem, attr) {
            var child,
                column,
                dir = {},
                childHtml;

            dir.init = function () {
                var custom = scope.config &&
                    scope.config.type !== undefined &&
                    scope.config.type == 'custom';

                if (custom) {
                    childHtml = $templateCache.get(scope.config.templateUrl);
                    child = angular.element(childHtml);

                    child = $compile(child)(scope);
                    elem.html("").append(child);
                }

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.html("").remove();
                dir = undefined;
                elem = undefined;
                scope = undefined;
                child = undefined;
                childHtml = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpGrid")
        .directive('rpGridCell', ['$templateCache', '$compile', rpGridCell]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-datetimepicker-filter.js
//  Grid Date Time Picker Directive

(function (angular, undefined) {
    "use strict";

    function rpGridDatetimepickerFilter($timeout) {
        function link(scope, elem, attr) {
            var dir = {},
                filter = scope.model,
                config = filter.getConfig(),
                datetimepicker = config.datetimepicker;

            dir.init = function () {
                datetimepicker.setConfig("size", "small");
                datetimepicker.setConfig("onChange", dir.onChange);

                scope.filter = dir;
                dir.config = datetimepicker;

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onChange = function (data) {
                $timeout(filter.activate.bind(filter), 10);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                filter = undefined;
                config = undefined;
                scope.filter = undefined;
                scope = undefined;
                datetimepicker = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/grid/templates/grid-datetimepicker-filter.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridDatetimepickerFilter", [
            "$timeout",
            rpGridDatetimepickerFilter
        ]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-filters.js
//  Grid Filters Directive

(function (angular) {
    "use strict";

    function rpGridFilters() {
        function link(scope, elem, attr) {}

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "realpage/grid/templates/grid-filters.html"
        };
    }

    angular
        .module("rpGrid")
        .directive('rpGridFilters', [rpGridFilters]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-header-tooltip.js
//  Grid Header Tooltip Directive

(function (angular, undefined) {
    "use strict";

    function rpGridHeaderTooltip($cache, $compile, timeout) {
        var inst = 1;

        function link(scope, elem, attr) {
            var dir = {},
                tooltipHtml,
                tooltipElem,
                tooltipWrap,
                body = angular.element("body"),
                config = scope.header.getConfig(),
                click = "click.rpGridHeaderTooltip" + inst++;

            dir.init = function () {
                dir.getContent();
                dir.isVisible = false;
                scope.gridHeaderTooltip = dir;
                dir.destWatch = scope.$on("destroy", dir.destroy);
            };

            dir.toggleTooltip = function () {
                dir.isVisible = !dir.isVisible;

                body.off(click);

                if (dir.isVisible) {
                    dir.hideTimer = timeout(function () {
                        body.one(click, dir.hideTooltip);
                    }, 100);
                }
            };

            dir.hideTooltip = function () {
                scope.$apply(function () {
                    dir.isVisible = false;
                });
            };

            dir.getContent = function () {
                if (config.tooltipUrl) {
                    tooltipHtml = $cache.get(config.tooltipUrl);
                    tooltipElem = angular.element(tooltipHtml);
                    tooltipWrap = elem.find(".rp-grid-header-tooltip-content");

                    tooltipElem = $compile(tooltipElem)(scope);
                    tooltipWrap.html("").append(tooltipElem);
                }
            };

            dir.destroy = function () {
                body.off(click);
                dir.destWatch();
                tooltipWrap.html("");
                tooltipElem.remove();
                timeout.cancel(dir.hideTimer);

                dir = undefined;
                body = undefined;
                elem = undefined;
                click = undefined;
                config = undefined;
                tooltipElem = undefined;
                tooltipHtml = undefined;
                tooltipWrap = undefined;
                scope.gridHeaderTooltip = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridHeaderTooltip", [
            "$templateCache",
            "$compile",
            "timeout",
            rpGridHeaderTooltip
        ]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-header.js
//  Grid Header Directive

(function (angular, undefined) {
    "use strict";

    function rpGridHeader($cache, $compile) {
        function link(scope, elem, attr) {
            var dir = {},
                config = scope.header.config;

            dir.init = function () {
                if (config.type == "custom") {
                    dir.childHtml = $cache.get(config.templateUrl);
                    dir.child = angular.element(dir.childHtml);

                    dir.child = $compile(dir.child)(scope);
                    elem.html("").append(dir.child);
                }

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.html("").remove();
                dir = undefined;
                elem = undefined;
                scope = undefined;
                config = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridHeader", ["$templateCache", "$compile", rpGridHeader]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-headers.js
//  Grid Headers Directive

(function (angular) {
    "use strict";

    function rpGridHeaders() {
        function link(scope, elem, attr) {}

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "realpage/grid/templates/grid-headers.html"
        };
    }

    angular
        .module("rpGrid")
        .directive('rpGridHeaders', [rpGridHeaders]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-text-filter.js
//  Grid Date Time Picker Directive

(function (angular, undefined) {
    "use strict";

    function rpGridTextFilter(inputText) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.config = dir.getConfig();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.getConfig = function () {
                dir.configData = scope.model.getConfig();

                angular.extend(dir.configData, {
                    size: "small",
                    onChange: dir.onChange
                });

                return inputText(dir.configData);
            };

            dir.onChange = function (data) {
                scope.model.activate();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                scope.model = undefined;
                scope.config = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/grid/templates/grid-text-filter.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridTextFilter", ["rpFormInputTextConfig", rpGridTextFilter]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-menu-filter.js
//  Grid Date Time Picker Directive

(function (angular, undefined) {
    "use strict";

    function rpGridMenuFilter(selectMenu) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.config = dir.getConfig();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.getConfig = function () {
                dir.configData = scope.model.getConfig();

                angular.extend(dir.configData, {
                    size: "small",
                    onChange: dir.onChange
                });

                return selectMenu(dir.configData);
            };

            dir.onChange = function (data) {
                scope.model.activate();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                scope.model = undefined;
                scope.config = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/grid/templates/grid-menu-filter.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridMenuFilter", ["rpFormSelectMenuConfig", rpGridMenuFilter]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid.js
//  Grid Directive

(function (angular, undefined) {
    "use strict";

    function rpGrid(timeout) {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.model;

            dir.init = function () {
                if (dir.modelIsValid()) {
                    dir.destWatch = scope.$on("$destroy", dir.destroy);
                    dir.readyWatch = model.subscribe("ready", dir.onReady);
                }
                else {
                    logw("Directive.rpGrid.init: model is invalid! => ", model);
                }
            };

            dir.modelIsValid = function () {
                return model && model.hasName && model.hasName("GridModel");
            };

            dir.onReady = function () {
                dir.timer = timeout(dir.setVis);
            };

            dir.setVis = function () {
                if (scope.floatScroll) {
                    scope.floatScroll.setVis().setSize();
                }
                else {
                    logc("rpGrid.setVis: FloatScroll module is missing!");
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                dir.readyWatch();
                timeout.cancel(dir.timer);
                dir.destroy = angular.noop;
                dir = undefined;
                model = undefined;
                scope.model = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/grid/templates/grid.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGrid", ["timeout", rpGrid]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\track-selection.js
//  Track Selection Directive

(function (angular, undefined) {
    "use strict";

    function rpTrackSelection(watchList) {
        function link(scope, elem, attr) {
            var dir = {},
                firstPass = true;

            dir.init = function () {
                scope.trackSelection = dir;
                dir.watchList = watchList();
                dir.watchList.add(scope.$watch(dir.getValue, dir.onChange));
                dir.watchList.add(scope.$on('$destroy', dir.destroy));
            };

            dir.getId = function () {
                return scope.$eval(attr.rpTrackSelectionId);
            };

            dir.getManager = function () {
                return scope.$eval(attr.rpSelectionManager);
            };

            dir.getValue = function () {
                return scope.$eval(attr.rpTrackSelection);
            };

            dir.onChange = function (bool) {
                if (firstPass) {
                    firstPass = false;
                    dir.defVal = bool;
                }
                else {
                    dir.recordChange(bool);
                }
            };

            dir.recordChange = function (bool) {
                var method,
                    id = dir.getId();

                if (bool === dir.defVal) {
                    method = 'remove' + (bool ? 'Deselected' : 'Selected');
                    dir.getManager()[method](id);
                }
                else {
                    method = 'add' + (bool ? 'Selected' : 'Deselected');
                    dir.getManager()[method](id);
                }
            };

            dir.destroy = function () {
                dir.watchList.destroy();
                dir = undefined;
                attr = undefined;
                firstPass = undefined;
                scope.trackSelection = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpGrid")
        .directive('rpTrackSelection', ['rpWatchList', rpTrackSelection]);
})(angular);


//  Source: _lib\realpage\grid\js\models\grid-actions.js
//  Grid Actions Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridActions() {
            var s = this;
            s.init();
        }

        var p = GridActions.prototype;

        p.init = function () {
            var s = this;
            s.src = {};
            return s;
        };

        p.setSrc = function (src) {
            var s = this;
            s.src = src;
            return s;
        };

        p.getMethod = function (name) {
            var s = this;

            return function (record) {
                if (!s.src) {
                    logc("GridActions: Method source has not been defined!");
                    return angular.noop;
                }
                else if (!s.src[name]) {
                    logc("GridActions: Method " + name + " has not been defined!");
                    return angular.noop;
                }
                else {
                    return s.src[name](record);
                }
            };
        };

        p.destroy = function () {
            var s = this;
            s.src = undefined;
        };

        return function () {
            return new GridActions();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridActions", [factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-config.js
//  Grid Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var inst = 1;

        function GridConfig() {
            var s = this;
            s._id = inst++;
            s._name = "GridConfig";
            s.init();
        }

        var p = GridConfig.prototype;

        p.init = function () {
            var s = this;
            s.src = {};
            return s;
        };

        // Setters

        p.setSrc = function (src) {
            var s = this;
            s.src = src;
            return s;
        };

        // Getters

        p.get = function () {
            return [];
        };

        p.getFilters = function () {
            return [];
        };

        p.getGroupHeaders = function () {
            return [];
        };

        p.getHeaders = function () {
            return [];
        };

        p.getID = function () {
            var s = this;
            return s._id;
        };

        p.getMethod = function (name) {
            var s = this;

            return function () {
                if (!s.src) {
                    logc("GridConfig.getMethod: Method source has not been defined!");
                }
                else if (!s.src[name]) {
                    logc("GridConfig.getMethod: Method name " + name + " has not been defined!");
                }
                else {
                    var method = s.src[name];
                    return method.apply(s.src, arguments);
                }
            };
        };

        // Assertions

        p.hasName = function (name) {
            var s = this;
            return s._name == name;
        };

        p.destroy = function () {
            var s = this;
            s.src = undefined;
            s.get = undefined;
            s.getMethod = undefined;
            s.getHeaders = undefined;
            s.getFilters = undefined;
        };

        return function () {
            return new GridConfig();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridConfig", [factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-filter.js
//  Grid Filter Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream, timeout, formatter) {
        function GridFilterModel() {
            var s = this;
            s.init();
        }

        var p = GridFilterModel.prototype;

        p.init = function () {
            var s = this;
            s.events = {
                activate: eventStream()
            };
            return s;
        };

        // Setters

        p.setConfig = function (data) {
            var s = this;
            s.config = data;
            s.key = data.key;
            s._defaultValue = data.value || "";
            s.delayFiltering = data.type == "text";
            return s;
        };

        p.setValue = function (value) {
            var s = this;
            s.config.value = value;
            return s;
        };

        // Getters

        p.getConfig = function () {
            var s = this;
            return s.config;
        };

        p.getKey = function () {
            var s = this;
            return s.key;
        };

        p.getRawValue = function () {
            var s = this;
            return s.config.value;
        };

        p.getValue = function () {
            var s = this;

            if (!formatter[s.config.type]) {
                return s.config.value;
            }

            return formatter[s.config.type](s);
        };

        p.getCustomFilter = function () {
            var s = this;
            return s.config.customFilter;
        };

        // Assertions

        p.hasKey = function (key) {
            var s = this;
            return s.key == key;
        };

        p.isEmpty = function () {
            var s = this;
            return !s.config || s.config.value === "" || s.config.value === undefined;
        };

        p.hasCustomFilter = function () {
            var s = this;
            return s.config.customFilter !== undefined;
        };

        // Actions

        p.activate = function () {
            var s = this;
            if (s.delayFiltering) {
                timeout.cancel(s.timer);
                var delay = s.config.filterDelay,
                    dt = delay === undefined ? 400 : delay;
                s.timer = timeout(s.publish.bind(s), dt);
            }
            else {
                s.publish();
            }
            return s;
        };

        p.filterBy = function () {
            var s = this;
            return {
                key: s.key,
                value: s.config.value
            };
        };

        p.publish = function () {
            var s = this;
            s.events.activate.publish(s);
        };

        p.reset = function () {
            var s = this;
            s.config.value = s._defaultValue;
            return s;
        };

        p.subscribe = function (eventName, callback) {
            var s = this;
            return s.events[eventName].subscribe(callback);
        };

        p.destroy = function () {
            var s = this;
            timeout.cancel(s.timer);
            s.events.activate.destroy();
            s.config = undefined;
            s.events = undefined;
        };

        return function () {
            return new GridFilterModel();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridFilterModel", [
            "eventStream",
            "timeout",
            "rpGridFilterFormatter",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-filters.js
//  Grid Filters Model

(function (angular, undefined) {
    "use strict";

    function factory(gridFilter) {
        var inst = 1;

        function GridFiltersModel() {
            var s = this;
            s._id = inst++;
            s.init();
        }

        var p = GridFiltersModel.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.filters = {};
            s.filterData = {};
            s.state = {
                active: false
            };
            return s;
        };

        // Setters

        p.setClassNames = function (classNames) {
            var s = this;
            s.classNames = classNames;
            return s;
        };

        p.setConfig = function (config) {
            var s = this;

            s.list.flush();
            s.filterData = {};

            config.forEach(function (data) {
                var filter = gridFilter().setConfig(data);
                filter.subscribe("activate", s.activate.bind(s));
                s.list.push(filter);
                s.filters[data.key] = filter;
                filter = undefined;
            });

            return s;
        };

        p.setEvents = function (events) {
            var s = this;
            s.events = events;
            return s;
        };

        p.setFilterValue = function (key, value) {
            var s = this;

            s.list.forEach(function (filter) {
                if (filter.hasKey(key)) {
                    filter.setValue(value);
                }
            });

            return s;
        };

        p.setState = function (state) {
            var s = this;
            s.state = state;
            return s;
        };

        // Getters

        p.getFilterByKey = function (key) {
            var s = this;

            if (s.filters[key] === undefined) {
                logw("rpGridFiltersModel.getFilterByKey: Filter with key " + key + " does not exist!");
            }

            return s.filters[key];
        };

        p.getFilterData = function () {
            var s = this;

            s.list.forEach(function (filter) {
                var key = filter.getKey();

                if (filter.isEmpty()) {
                    delete s.filterData[key];
                }
                else {
                    s.filterData[key] = filter.getValue();
                }
            });

            return s.filterData;
        };

        p.getID = function () {
            var s = this;
            return s._id;
        };

        // Actions

        p.activate = function () {
            var s = this;
            s.events.publish("filterBy", s.getFilterData());
            return s;
        };

        p.reset = function () {
            var s = this;

            s.list.forEach(function (filter) {
                filter.reset();
            });

            s.list[0].activate();

            return s;
        };

        p.toggle = function () {
            var s = this;
            s.state.active = !s.state.active;
            return s;
        };

        // Assertions

        p.filterExists = function (filterKey) {
            var s = this,
                exists = !!s.filters[filterKey];

            if (!exists) {
                logw("GridFiltersModel: filter by key %s does not exist", filterKey);
            }

            return exists;
        };

        p.destroy = function () {
            var s = this;

            s.list.forEach(function (filter) {
                filter.destroy();
            });
            s.list.flush();

            s.list = undefined;
            s.state = undefined;
            s.events = undefined;
            s.filters = undefined;
            return s;
        };

        return function () {
            return new GridFiltersModel();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridFiltersModel", ["rpGridFilterModel", factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-group-header.js
//  Grid Group Header Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridGroupHeader() {
            var s = this;
            s.init();
        }

        var p = GridGroupHeader.prototype;

        p.init = function () {
            var s = this;
            s.classData = undefined;
            s.config = {
                colSpan: 1,
                classNames: "",
                lineThrough: false
            };
        };

        p.setConfig = function (config) {
            var s = this;
            angular.extend(s.config, config);
            return s;
        };

        p.getClass = function () {
            var s = this;

            if (s.classData === undefined) {
                s.classData = {
                    line: s.config.colSpan > 1
                };
            }

            return s.classData;
        };

        p.destroy = function () {
            var s = this;
            s.config = undefined;
            s.classData = undefined;
        };

        return function (config) {
            return (new GridGroupHeader()).setConfig(config);
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridGroupHeaderModel", [factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-header.js
//  Grid Header Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream) {
        function GridHeaderModel() {
            var s = this;
            s.init();
        }

        var p = GridHeaderModel.prototype;

        p.init = function () {
            var s = this;
            s.state = {};
            s.events = {
                activate: eventStream()
            };
            return s;
        };

        p.setConfig = function (data) {
            var s = this;
            s.config = data;
            s.key = data.key;
            s.state = {
                active: false,
                reverse: false,
                sortable: data && data.isSortable
            };

            s.hasTooltip = data.tooltipContent !== undefined;

            return s;
        };

        p.getConfig = function () {
            var s = this;
            return s.config;
        };

        p.activate = function () {
            var s = this;

            if (!s.state.sortable) {
                return;
            }
            else if (!s.state.active) {
                s.state.active = true;
            }
            else {
                s.state.reverse = !s.state.reverse;
            }

            s.events.activate.publish(s);

            return s;
        };

        p.hasKey = function (key) {
            var s = this;
            return s.key == key;
        };

        p.is = function (item) {
            var s = this;
            return item.hasKey(s.key);
        };

        p.deactivate = function () {
            var s = this;
            angular.extend(s.state, {
                active: false,
                reverse: false
            });
            return s;
        };

        p.subscribe = function (eventName, callback) {
            var s = this;
            return s.events[eventName].subscribe(callback);
        };

        p.sortBy = function () {
            var obj = {},
                s = this;
            obj[s.key] = s.state.reverse ? "DESC" : "ASC";
            return obj;
        };

        p.isActive = function () {
            var s = this;
            return s.state.active;
        };

        p.destroy = function () {
            var s = this;
            s.events.activate.destroy();
            s.state = undefined;
            s.events = undefined;
            s.config = undefined;
        };

        return function (config) {
            return (new GridHeaderModel()).setConfig(config);
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridHeaderModel", ["eventStream", factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-headers.js
//  Grid Headers Model

(function (angular, undefined) {
    "use strict";

    function factory(gridHeader, gridGroupHeader, gridSelectModel) {
        function GridHeadersModel() {
            var s = this;
            s.init();
        }

        var p = GridHeadersModel.prototype;

        p.init = function () {
            var s = this;
            s.sortBy = {};
            s.headerRows = [];
            s.groupHeaderRows = [];
            s.selectModel = gridSelectModel();
            return s;
        };

        // Setters

        p.setEvents = function (events) {
            var s = this;
            s.events = events;
            s.selectModel.setEvents(events);
            return s;
        };

        p.setClassNames = function (classNames) {
            var s = this;
            s.classNames = classNames;
            return s;
        };

        p.setHeaders = function (rows) {
            var s = this;

            s.sortBy = {};
            s.headerRows.flush();

            rows.forEach(function (row) {
                var headerRow = [];

                row.forEach(function (config) {
                    var header = gridHeader(config);
                    header.subscribe("activate", s.activate.bind(s));
                    headerRow.push(header);
                });

                s.headerRows.push(headerRow);
            });

            return s;
        };

        p.setGroupHeaders = function (rows) {
            var s = this;

            s.groupHeaderRows.flush();

            rows.forEach(function (row) {
                var groupHeaderRow = [];

                row.forEach(function (config) {
                    groupHeaderRow.push(gridGroupHeader(config));
                });

                s.groupHeaderRows.push(groupHeaderRow);
            });

            return s;
        };

        // Getters

        p.getSortData = function () {
            var s = this;
            return s.sortBy;
        };

        // Actions

        p.activate = function (header) {
            var s = this;

            s.headerRows.forEach(function (row) {
                row.forEach(function (item) {
                    if (!item.is(header)) {
                        item.deactivate();
                    }
                });
            });

            s.sortBy = header.sortBy();
            s.events.publish("sortBy", s.sortBy);

            return s;
        };

        p.publishState = function () {
            var s = this;
            s.selectModel.publishState();
            return s;
        };

        p.reset = function () {
            var s = this;

            s.headerRows.forEach(function (row) {
                row.forEach(function (header) {
                    header.deactivate();
                });
            });

            return s;
        };

        p.updateSelected = function (checked) {
            var s = this;
            s.selectModel.updateSelected(checked);
            return s;
        };

        p.destroy = function () {
            var s = this;

            s.headerRows.forEach(function (row) {
                row.forEach(function (header) {
                    header.destroy();
                });
                row.flush();
            });

            s.headerRows.flush();
            s.headerRows = undefined;

            s.groupHeaderRows.forEach(function (row) {
                row.forEach(function (header) {
                    header.destroy();
                });
                row.flush();
            });

            s.groupHeaderRows.flush();
            s.groupHeaderRows = undefined;

            s.sortBy = undefined;
            s.events = undefined;

            return s;
        };

        return function () {
            return new GridHeadersModel();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridHeadersModel", [
            "rpGridHeaderModel",
            "rpGridGroupHeaderModel",
            "rpGridSelectModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-transform.js
//  Grid Transform Service

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function GridTransform() {
            var s = this;
            s.init();
        }

        var p = GridTransform.prototype;

        p.init = function () {
            var s = this;
            return s;
        };

        p.watch = function (grid) {
            var s = this;
            s.grid = grid;
            grid.subscribe("sortBy", s.sort.bind(s));
            grid.subscribe("filterBy", s.filter.bind(s));
            return s;
        };

        p.filter = function (filterBy) {
            var s = this;

            if (s.gridData === undefined) {
                s.gridData = [].concat(s.grid.getData().records);
            }

            var records = $filter("filter")(s.gridData, filterBy);

            if (s.sortBy) {
                records = s.sortData(records, s.sortBy);
            }

            s.grid.flushData().setData({
                records: records
            });

            return s;
        };

        p.sort = function (sortBy) {
            var s = this,
                records = s.grid.getData().records;

            s.sortBy = sortBy;
            records = s.sortData(records, sortBy);

            s.grid.flushData().setData({
                records: records
            });
            return s;
        };

        p.sortData = function (records, sortBy) {
            var s = this,
                key = Object.keys(sortBy)[0],
                reverse = sortBy[key] != "ASC";

            return $filter("naturalSort")(records, key, reverse);
        };

        p.reset = function () {
            var s = this;
            s.sortBy = undefined;
            s.gridData = undefined;
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.reset();
            s.grid = undefined;
            s.gridData = undefined;
        };

        return function () {
            return new GridTransform();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridTransform", ["$filter", factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid.js
//  Grid Model

(function (angular, undefined) {
    "use strict";

    function factory(busyModel, paginationModel, headersModel, filtersModel, eventsManager, selectionManager) {
        var inst = 1;

        function GridModel() {
            var s = this;
            s._id = inst++;
            s._name = "GridModel";
            s.init();
        }

        var p = GridModel.prototype;

        p.init = function () {
            var s = this,
                eventNames = [
                    "ready",
                    "sortBy",
                    "select",
                    "filterBy",
                    "paginate",
                    "selectAll",
                    "selectChange"
                ];

            s.data = {
                records: []
            };

            s.state = {};
            s.emptyMsg = "";
            s.busyModel = busyModel();
            s.events = eventsManager();
            s.headersModel = headersModel();
            s.filtersModel = filtersModel();
            s.paginationModel = paginationModel();
            s.selectionManager = selectionManager();

            s.events.setEvents(eventNames);

            s.headersModel.setEvents(s.events);
            s.filtersModel.setEvents(s.events);

            s.paginationModel.setEvents({
                update: s.events.getEvent("paginate")
            });

            s.events.subscribe("sortBy", s.setSortBy.bind(s));
            s.events.subscribe("select", s.selectAll.bind(s));
            s.events.subscribe("filterBy", s.setFilterBy.bind(s));

            return s;
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        p.getEvents = function () {
            var s = this;
            return s.events;
        };

        p.getFilterByKey = function (key) {
            var s = this;
            return s.filtersModel.getFilterByKey(key);
        };

        p.getFilterData = function () {
            var s = this;
            return s.filtersModel.getFilterData();
        };

        p.getID = function () {
            var s = this;
            return s._id;
        };

        p.getQuery = function () {
            var s = this;
            return s.paginationModel.getQuery();
        };

        p.getSelectionChanges = function () {
            var s = this;
            return s.selectionManager.getChanges();
        };

        p.getSelectKey = function () {
            var key = "",
                s = this;

            s.config.forEach(function (item) {
                if (item.type == "select") {
                    key = item.key;
                }
            });

            return key;
        };

        // Setters

        p.setConfig = function (cfg) {
            var s = this;

            if (s.isValidConfig(cfg)) {
                s.config = cfg.get();
                s.filtersModel.setConfig(cfg.getFilters());
                s.headersModel
                    .setHeaders(cfg.getHeaders())
                    .setGroupHeaders(cfg.getGroupHeaders());
                var filterBy = s.filtersModel.getFilterData();
                s.paginationModel.setFilterBy(filterBy);
            }
            else {
                logc("Model.rpGridModel.setConfig: config is not valid! => ", cfg);
            }

            return s;
        };

        p.setData = function (data) {
            var s = this;
            data.records = data.records || [];
            s.data = data;
            s.updateSelected();
            s.paginationModel.reset().updateState(data.totalRecords);
            s.events.publish("ready");
            return s;
        };

        p.setEmptyMsg = function (msg) {
            var s = this;
            s.emptyMsg = msg;
            return s;
        };

        p.setFilterBy = function (filterBy) {
            var s = this;
            s.paginationModel.setFilterBy(filterBy);
            return s;
        };

        p.setFiltersClassNames = function (classNames) {
            var s = this;
            s.filtersModel.setClassNames(classNames);
            return s;
        };

        p.setFilterState = function (state) {
            var s = this;
            s.filtersModel.setState(state);
            return s;
        };

        p.setFilterValue = function (key, val) {
            var s = this;
            s.filtersModel.setFilterValue(key, val);
            s.paginationModel.setFilterValue(key, val);
            return s;
        };

        p.setGridSelectModel = function (gridSelectModel) {
            var s = this;
            s.gridSelectModel = gridSelectModel;
            return s;
        };

        p.setHeadersClassNames = function (classNames) {
            var s = this;
            s.headersModel.setClassNames(classNames);
            return s;
        };

        p.setResultsPerPage = function (count) {
            var s = this;
            s.paginationModel.setResultsPerPage(count);
            return s;
        };

        p.setSortBy = function (sortBy) {
            var s = this;
            s.paginationModel.setSortBy(sortBy);
            return s;
        };

        p.setSortValue = function (key, val) {
            var s = this;
            s.paginationModel.setSortValue(key, val);
            return s;
        };

        // Assertions

        p.filterExists = function (filterKey) {
            var s = this;
            return s.filtersModel.filterExists(filterKey);
        };

        p.hasName = function (name) {
            var s = this;
            return s._name == name;
        };

        p.hasSelectionChanges = function () {
            var s = this;
            return s.selectionManager.hasChanges();
        };

        p.isValidConfig = function (config) {
            var s = this;
            return config && config.hasName && config.hasName("GridConfig");
        };

        // Actions

        p.addData = function (data) {
            var s = this;
            data.records = data.records || [];
            s.data.records = s.data.records.concat(data.records);
            s.updateSelected();
            s.paginationModel.updateState(data.totalRecords);
            s.events.publish("ready");
            return s;
        };

        p.busy = function (bool) {
            var s = this;
            s.state.busy = bool;
            s.busyModel[bool ? 'busy' : 'off']();
            return s;
        };

        p.clearSortValue = function () {
            var s = this;
            s.paginationModel.clearSortValue();
            return s;
        };

        p.deleteRow = function (idKey, row) {
            var s = this;
            s.data.records = s.data.records.filter(function (item) {
                return item[idKey] != row[idKey];
            });

            s.paginationModel.setCurrent(s.paginationModel.getCurrent() - 1);

            return s;
        };

        p.flushData = function () {
            var s = this;
            s.selectionManager.reset();
            s.paginationModel.reset();
            s.data.records.flush();
            return s;
        };

        p.resetFilters = function () {
            var s = this;
            s.filtersModel.reset();
            return s;
        };

        p.selectAll = function (bool) {
            var s = this,
                key = s.getSelectKey();

            s.data.records.forEach(function (item) {
                if (item.disableSelection !== true) {
                    item[key] = bool;
                }
            });

            s.events.publish("selectAll", bool);
        };

        p.subscribe = function (eventName, callback) {
            var s = this;
            return s.events.subscribe(eventName, callback);
        };

        p.toggleFilters = function () {
            var s = this;
            s.filtersModel.toggle();
            return s;
        };

        p.updateSelected = function () {
            var s = this;

            if (s.events) {
                s.events.publish("selectChange");
            }

            var count = 0,
                selCount = 0,
                checked = false,
                list = s.data.records,
                key = s.getSelectKey();

            list.forEach(function (item) {
                if (item.disableSelection !== true) {
                    count++;
                    selCount += item[key] ? 1 : 0;
                }
            });

            checked = (count > 0) && (count === selCount);

            if (s.gridSelectModel) {
                s.gridSelectModel.updateSelected(checked);
            }

            s.headersModel.updateSelected(checked);
        };

        p.destroy = function () {
            var s = this;
            s.events.destroy();
            s.busyModel.destroy();
            s.headersModel.destroy();
            s.filtersModel.destroy();
            s.paginationModel.destroy();
            s.selectionManager.destroy();

            if (s.gridSelectModel) {
                s.gridSelectModel.destroy();
            }

            s.data = undefined;
            s.state = undefined;
            s.config = undefined;
            s.events = undefined;
            s.busyModel = undefined;
            s.headersModel = undefined;
            s.filtersModel = undefined;
            s.paginationModel = undefined;
            s.selectionManager = undefined;
        };

        return function () {
            return new GridModel();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridModel", [
            "rpBusyIndicatorModel",
            "rpPaginationModel",
            "rpGridHeadersModel",
            "rpGridFiltersModel",
            "eventsManager",
            "rpSelectionManager",
            factory
        ]);
})(angular);


//  Source: _lib\realpage\grid\js\services\filter-formatter.js
//  Grid Filter Formatter Service

(function (angular, undefined) {
    "use strict";

    function GridFilterFormatter() {
        var svc = this;

        svc.datetimepicker = function (filter) {
            var data = filter.getRawValue(),
                config = filter.getConfig();

            if (!data) {
                data = "%";
            }
            else if (config.publishFormat) {
                data = data.format(config.publishFormat);
            }

            if (config.formatter && typeof config.formatter == "function") {
                data = config.formatter(data);
            }

            return data;
        };
    }

    angular
        .module("rpGrid")
        .service("rpGridFilterFormatter", [
            GridFilterFormatter
        ]);
})(angular);


//  Source: _lib\realpage\grid\js\templates\templates.inc.js
angular.module("rpGrid").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/grid/templates/grid-datetimepicker-filter.html",
"<div class=\"rp-grid-datetimepicker-filter\"><rp-datetimepicker ng-if=\"filter.config\" config=\"filter.config\" rp-model=\"model.config.value\"></rp-datetimepicker></div>");
$templateCache.put("realpage/grid/templates/grid-filters.html",
"<table ng-class=\"model.state\" class=\"{{model.classNames || 'rp-grid-filters-1'}}\"><tr class=\"rp-grid-row\"><td ng-switch=\"filter.config.type\" ng-repeat=\"filter in model.list\" class=\"rp-grid-cell {{::filter.key.decamelize()}} {{::filter.config.classNames}}\"><rp-grid-menu-filter model=\"filter\" ng-switch-when=\"menu\"></rp-grid-menu-filter><rp-grid-text-filter model=\"filter\" ng-switch-when=\"text\"></rp-grid-text-filter><rp-grid-datetimepicker-filter model=\"filter\" ng-switch-when=\"datetimepicker\"></rp-grid-datetimepicker-filter></td></tr></table>");
$templateCache.put("realpage/grid/templates/grid-headers.html",
"<table class=\"{{model.classNames || 'rp-grid-headers-1'}} ft-form\"><tr class=\"rp-grid-row rp-grid-group-header-row\" ng-repeat=\"groupHeaders in model.groupHeaderRows\"><td ng-class=\"groupHeader.getClass()\" ng-repeat=\"groupHeader in groupHeaders\" colspan=\"{{::groupHeader.config.colSpan}}\" class=\"rp-grid-cell rp-grid-group-header-cell {{groupheader.config.classNames}}\"><div class=\"rp-grid-group-header-cell-content\"><span class=\"rp-grid-group-header-cell-text\">{{::groupHeader.config.text}}</span></div></td></tr><tr class=\"rp-grid-row\" ng-repeat=\"row in model.headerRows\"><td ng-repeat=\"header in row\" ng-switch=\"header.config.type\" class=\"rp-grid-cell rp-grid-header {{::header.key.decamelize()}} {{::header.config.classNames}}\"><label ng-switch-when=\"select\" ng-class=\"{active: header.config.enabled}\" class=\"md-check dark-bluebox rp-grid-header-checkbox\"><input type=\"checkbox\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"rp-form-checkbox\" ng-model=\"model.selectModel.selected\" ng-change=\"model.selectModel.publishState()\"> <i class=\"primary\"></i></label><span ng-switch-default class=\"rp-grid-text\" ng-class=\"header.state\" ng-click=\"header.activate()\">{{::header.config.text}} </span><i ng-switch-default ng-class=\"header.state\" class=\"rp-grid-header-icon\" ng-click=\"header.activate()\"></i><div ng-if=\"header.hasTooltip\" class=\"rp-grid-header-tooltip {{::header.config.tooltipClass}}\"><span ng-click=\"gridHeaderTooltip.toggleTooltip()\" class=\"rp-grid-header-tooltip-icon {{::header.config.tooltipIcon}}\"></span><div ng-show=\"gridHeaderTooltip.isVisible\" class=\"fdn-arrow box-color text-color rp-grid-header-tooltip-content-wrap\"><span class=\"arrow left white rp-grid-header-tooltip-content-arrow\"></span><div class=\"box-body rp-grid-header-tooltip-content\">{{::header.config.tooltipContent}}</div></div></div></td></tr></table>");
$templateCache.put("realpage/grid/templates/grid-menu-filter.html",
"<div class=\"rp-grid-menu-filter\"><rp-form-select-menu ng-if=\"config\" config=\"config\" rp-model=\"model.config.value\"></rp-form-select-menu></div>");
$templateCache.put("realpage/grid/templates/grid-text-filter.html",
"<div class=\"rp-grid-text-filter\"><rp-form-input-text ng-if=\"config\" config=\"config\" rp-model=\"model.config.value\"></rp-form-input-text></div>");
$templateCache.put("realpage/grid/templates/grid.html",
"<div class=\"rp-grid-wrap rp-float-scroll\" ng-class=\"model.state\"><div class=\"rp-grid\"><rp-grid-headers model=\"model.headersModel\"></rp-grid-headers><rp-grid-filters model=\"model.filtersModel\"></rp-grid-filters><div class=\"rp-grid-body-wrap\"><rp-busy-indicator model=\"model.busyModel\"></rp-busy-indicator><table class=\"rp-grid-body-1 ft-form\" ng-class=\"{init: model.state.busy}\"><tr class=\"rp-grid-row\" ng-repeat=\"record in model.data.records\" ng-class=\"{active: record[model.getSelectKey()]}\"><td ng-switch=\"config.type\" ng-repeat=\"config in model.config\" class=\"rp-grid-cell {{::config.key.decamelize()}} {{::config.classNames}}\"><div ng-switch-when=\"actionsMenu\" class=\"rp-actions-menu\" model=\"config.getActions(record)\"></div><label ng-switch-when=\"select\" class=\"md-check dark-bluebox\"><input type=\"checkbox\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"md-check dark-bluebox\" ng-model=\"record[config.key]\" ng-change=\"model.updateSelected()\" ng-disabled=\"record.disableSelection\" rp-track-selection=\"record[config.key]\" rp-track-selection-id=\"record[config.idKey]\" rp-selection-manager=\"model.selectionManager\"> <i class=\"primary\"></i></label><span ng-switch-when=\"button\" class=\"button {{config.getButtonClassNames(record)}}\" ng-click=\"config.method(record)\">{{config.getButtonText(record)}} </span><a ng-switch-when=\"link\" href=\"{{config.getLink(record)}}\" class=\"rp-grid-text rp-grid-link\">{{record[config.key]}} </a><span ng-switch-when=\"actionLink\" ng-click=\"config.method(record)\" class=\"rp-grid-text rp-grid-link\">{{record[config.key]}} </span><span ng-switch-when=\"date\" class=\"rp-grid-text\">{{record[config.key] | date: config.dateFormat || 'MM/dd/yyyy'}} </span><span ng-switch-when=\"currency\" class=\"rp-grid-text\">{{record[config.key] | currency : config.currencySymbol || '$' : config.decimalLength === undefined ? 2 : config.decimalLength}} </span><span ng-switch-default class=\"rp-grid-text\">{{record[config.key]}}</span></td></tr><tr class=\"rp-grid-empty\" ng-if=\"!model.data.records.length\"><td class=\"empty-msg\">{{model.emptyMsg || 'No results were found.'}}</td></tr></table></div></div><rp-pagination model=\"model.paginationModel\"></rp-pagination></div>");
}]);

//  Source: ui\lib\realpage\language\js\scripts.js
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

//  Source: ui\lib\realpage\page-title\js\scripts.js
//  Source: _lib\realpage\page-title\js\_bundle.inc
angular.module("rpPageTitle", []);

//  Source: _lib\realpage\page-title\js\providers\page-title.js
//  Resource Paths Provider

(function (angular) {
    "use strict";

    function Provider() {
        var prodName,
            prov = this,
            metaData = [],
            companyName = "OneSite";

        prov.setData = function (data) {
            metaData = data;
            return prov;
        };

        prov.setProdName = function (name) {
            prodName = name;
            return prov;
        };

        prov.setCompanyName = function (name) {
            companyName = name;
            return prov;
        };

        function provide($rootScope, location, eventStream) {
            var model = {};

            model.events = {};
            model.isReady = false;
            model.prodName = prodName;
            model.companyName = companyName;

            model.init = function () {
                model.events.update = eventStream();
                $rootScope.$on('$locationChangeSuccess', model.setDataModel);
                return model;
            };

            model.setDataModel = function () {
                var found = false,
                    url = location.url();

                metaData.forEach(function (listItem) {
                    if (url.match(listItem.url)) {
                        found = true;
                        var pageTitle = model.getPageTitle(listItem.data);
                        model.events.update.publish(pageTitle);
                    }
                });

                if (!found) {
                    model.events.update.publish("");
                }
            };

            model.getPageTitle = function (data) {
                var parts = [data.pageTitle, prodName, model.companyName];
                return parts.join(" - ");
            };

            model.subscribe = function (eventName, callback) {
                var valid = eventName && callback &&
                    typeof eventName == "string" &&
                    typeof callback == "function" &&
                    model.events[eventName] !== undefined;

                if (valid) {
                    model.events[eventName].subscribe(callback);
                }
                else {
                    logc("rpPageTitleModel-subscribe: Invalid input params!");
                }
            };

            return model.init();
        }

        prov.$get = ['$rootScope', 'location', 'eventStream', provide];
    }

    angular
        .module("rpPageTitle")
        .provider('rpPageTitleModel', [Provider]);
})(angular);

//  Source: _lib\realpage\page-title\js\directives\page-title.js
//  Page Title Directive

(function (angular) {
    "use strict";

    function title(model) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                model.subscribe("update", dir.setPageTitle);
            };

            dir.setPageTitle = function (title) {
                elem.text(title);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'E'
        };
    }

    angular
        .module("rpPageTitle")
        .directive('title', ['rpPageTitleModel', title]);
})(angular);

//  Source: ui\lib\realpage\pagination\js\scripts.js
//  Source: _lib\realpage\pagination\js\_bundle.inc
angular.module("rpPagination", []);

//  Source: _lib\realpage\pagination\js\templates\pagination.js
//  Pagination Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/common/pagination/pagination.html";

    templateHtml = "" +
        "<div class='rp-pagination' ng-class='model.state' ng-style='model.style'>" +
        	"<p class='info'>" +
        		"<span>Improve your results by using filters to narrow your search</span>" +
    		"</p>" +

        	"<p class='button-wrap'>" +
	        	"<span class='button btn rounded btn-outline b-primary text-primary' ng-click='model.paginate()'>" +
	        		"{{model.btnText}}" +
	        	"</span>" +
        	"</p>" +

        	"<p class='showing'>" +
        		"Showing {{model.current}} of {{model.max}} results" +
    		"</p>" +

        	"<p class='loading'>Loading more results...</p>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpPagination")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\pagination\js\models\pagination.js
//  Pagination Model

(function(angular) {
    "use strict";

    function factory($window, eventStream) {
        return function() {
            var model = {};

            model.events = {
                update: eventStream()
            };

            model.data = {
                sortBy: {},

                filterBy: {},

                pages: {
                    startRow: 0,
                    resultsPerPage: 100
                }
            };

            model.state = {
                busy: false,
                enabled: false,
                suggestion: false
            };

            model.init = function() {
                model.max = 0;
                model.style = {};
                model.current = 0;
                model.btnText = 'Show More';
                return model;
            };

            model.setEvents = function(events) {
                model.events = events;
                return model;
            };

            model.setSortBy = function(sortBy) {
                model.data.sortBy = sortBy;
                return model;
            };

            model.setFilterBy = function(filterBy) {
                model.data.filterBy = filterBy;
                return model;
            };

            model.setFilterValue = function(key, value) {
                model.data.filterBy[key] = value;
                return model;
            };

            model.clearSortValue = function() {
                model.data.sortBy = {};
            };

            model.setSortValue = function(key, value) {
                model.data.sortBy[key] = value;
                return model;
            };

            model.setPages = function(pages) {
                model.data.pages = pages;
                return model;
            };

            model.extendSortBy = function(sortBy) {
                angular.extend(model.data.sortBy, sortBy);
                return model;
            };

            model.extendFilterBy = function(filterBy) {
                angular.extend(model.data.filterBy, filterBy);
                return model;
            };

            model.extendPages = function(pages) {
                angular.extend(model.data.pages, pages);
                return model;
            };

            model.paginate = function() {
                model.state.busy = true;
                model.data.pages.startRow += model.data.pages.resultsPerPage;
                model.events.update.publish(model.data);
            };

            model.updateState = function(max) {
                var current,
                    state = model.state;
                model.max = max;
                state.busy = false;
                current = model.current + model.data.pages.resultsPerPage;
                model.current = current > max ? max : current;
                state.enabled = model.current < max;
                state.suggestion = model.current > 400;
            };

            model.reset = function() {
                model.max = 0;
                model.current = 0;
                model.data.pages.startRow = 0;
                model.state.enabled = false;
                return model;
            };

            model.getCurrent = function() {
                return model.current;
            };

            model.setCurrent = function(current) {
                model.current = current;
                return model;
            };

            model.getQuery = function() {
                var str = $window.JSON.stringify(model.data);
                return '?datafilter=' + $window.btoa(str);
            };

            model.setResultsPerPage = function(count) {
                model.data.pages.resultsPerPage = count;
                return model;
            };

            model.destroy = function() {
                model.events.update.destroy();
                model = undefined;
            };

            return model.init();
        };
    }

    angular
        .module("rpPagination")
        .factory('rpPaginationModel', ['$window', 'eventStream', factory]);
})(angular);

//  Source: _lib\realpage\pagination\js\directives\pagination.js
//  Pagination Directive

(function (angular) {
    "use strict";

    function rpPagination() {
        function link(scope, elem, attr) {}

        return {
            scope: {
            	model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/common/pagination/pagination.html"
        };
    }

    angular
        .module("rpPagination")
        .directive('rpPagination', [rpPagination]);
})(angular);

//  Source: ui\lib\realpage\scrolling-tabs-menu\js\scripts.js
//  Source: _lib\realpage\scrolling-tabs-menu\js\_bundle.inc
angular.module("rpScrollingTabsMenu", []);

//  Source: _lib\realpage\scrolling-tabs-menu\js\templates\templates.inc.js
angular.module("rpScrollingTabsMenu").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/scrolling-tabs-menu/templates/scrolling-tabs-menu.html",
"<div class=\"rp-scrolling-tabs-wrap\"><div class=\"rp-scrolling-tabs-menu\"><span ng-show=\"$ctrl.scrollEnabled()\" ng-click=\"scrollScreen.scrollLeft()\" ng-class=\"{disabled: !$ctrl.canScrollLeft()}\" class=\"scroll-left rp-icon-angle-right text-neutral-05\"></span> <span ng-show=\"$ctrl.scrollEnabled()\" ng-click=\"scrollScreen.scrollRight()\" ng-class=\"{disabled: !$ctrl.canScrollRight()}\" class=\"scroll-right rp-icon-angle-left text-neutral-05\"></span><div class=\"rp-scrolling-tabs-screen\" rp-scrolling-tabs-screen=\"$ctrl.scrollScreenModel\"><ul class=\"rp-scrolling-tabs-slider\" rp-scrolling-tabs-slider=\"$ctrl.scrollScreenModel\"><li class=\"rp-scrolling-tab\" ng-repeat=\"tab in $ctrl.model.data\" rp-scrolling-tab=\"$ctrl.scrollScreenModel\"><a ng-if=\"tab.sref\" ui-sref=\"{{tab.sref}}\" ui-sref-active=\"active\" class=\"rp-scrolling-tab-link\" ng-click=\"$ctrl.activateTab(tab)\">{{tab.text}} </a><a ng-if=\"tab.href\" href=\"{{tab.href}}\" class=\"rp-scrolling-tab-link\" ng-click=\"$ctrl.activateTab(tab)\" ng-class=\"{active: tab.isActive}\">{{tab.text}} </a><span ng-if=\"!tab.href && !tab.sref\" ng-click=\"$ctrl.activateTab(tab)\" ng-class=\"{active: tab.isActive}\" class=\"rp-scrolling-tab-link rp-scrolling-tab-text\">{{tab.text}}</span></li></ul></div></div></div>");
}]);


//  Source: _lib\realpage\scrolling-tabs-menu\js\components\scrolling-tabs-menu.js
// Scrolling Tabs Menu Component

(function (angular, undefined) {
    "use strict";

    var id = 1;

    function Controller($timeout, $rootScope, winSize, scrollScreenModel) {
        var events,
            vm = this,
            scrollScreen = scrollScreenModel(),
            triggerID = "scrollingTabsMenu" + id++;

        vm.$onInit = function () {
            events = vm.model.getEvents();
            scrollScreen.setEvents(events);
            vm.scrollScreenModel = scrollScreen;
            vm.appStateChangeWatch = angular.noop;
            vm.winWatch = winSize.subscribe(vm.reset);
            vm.timer = $timeout(vm.bindEvent, 100);
        };

        vm.activateTab = function (tab) {
            if (!vm.model.checkUnsavedChanges()) {
                vm.onActivateTab(tab);
                return;
            }

            $rootScope.$emit("rpAppStateChange", {
                triggerID: triggerID,
                onContinue: function () {
                    vm.onActivateTab(tab);
                }
            });
        };

        vm.bindEvent = function () {
            vm.appStateChangeWatch = $rootScope.$on("rpAppStateChange", vm.appStateChangeHandler);
        };

        vm.appStateChangeHandler = function (event, eventData) {
            if (!event.defaultPrevented && eventData.triggerID == triggerID) {
                eventData.onContinue();
            }
        };

        vm.onActivateTab = function (tab) {
            vm.model.activate(tab);
        };

        vm.scrollEnabled = function () {
            return scrollScreen.scrollEnabled();
        };

        vm.canScrollLeft = function () {
            return scrollScreen.canScrollLeft();
        };

        vm.canScrollRight = function () {
            return scrollScreen.canScrollRight();
        };

        vm.reset = function () {
            scrollScreen.flushStops().resetSliderWidth();
        };

        vm.$onDestroy = function () {
            vm.winWatch();
            scrollScreen.destroy();
            vm.appStateChangeWatch();
            $timeout.cancel(vm.timer);
            vm = undefined;
            events = undefined;
            triggerID = undefined;
            scrollScreen = undefined;
        };
    }

    var component = {
        bindings: {
            model: "="
        },
        controller: [
            "$timeout",
            "$rootScope",
            "windowSize",
            "rpScrollScreenModel",
            Controller
        ],
        templateUrl: "realpage/scrolling-tabs-menu/templates/scrolling-tabs-menu.html"
    };

    angular
        .module("rpScrollingTabsMenu")
        .component("rpScrollingTabsMenu", component);
})(angular);


//  Source: _lib\realpage\scrolling-tabs-menu\js\models\scrolling-tabs-menu.js
//  Scrolling Tabs Menu Model

(function (angular, undefined) {
    "use strict";

    function factory(eventsManager) {
        function ScrollingTabsMenu() {
            var s = this;
            s.init();
        }

        var p = ScrollingTabsMenu.prototype;

        p.init = function () {
            var s = this;
            s.events = eventsManager();
            s.unsavedChangesCheck = true;
            s.events.setEvents(["change", "beforeScroll", "afterScroll"]);
            return s;
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        p.getEvents = function () {
            var s = this;
            return s.events;
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            s.data = data;
            return s;
        };

        // Actions

        p.activate = function (tab) {
            var s = this;
            if (!tab.isActive) {
                s.data.forEach(function (item) {
                    item.isActive = item.id == tab.id;
                });
                s.events.publish("change", tab);
            }
            return s;
        };

        p.addData = function (data) {
            var s = this;
            s.data = s.data.concat(data);
            return s;
        };

        p.checkUnsavedChanges = function () {
            var s = this;
            return s.unsavedChangesCheck;
        };

        p.disableUnsavedChangesCheck = function () {
            var s = this;
            s.unsavedChangesCheck = false;
            return s;
        };

        p.subscribe = function () {
            var s = this;
            return s.events.subscribe.apply(s.events, arguments);
        };

        // Destroy / Reset

        p.destroy = function () {
            var s = this;
            s.events.destroy();
            s.events = undefined;
        };

        return function (data) {
            return (new ScrollingTabsMenu()).setData(data || []);
        };
    }

    angular
        .module("rpScrollingTabsMenu")
        .factory("rpScrollingTabsMenuModel", [
            "eventsManager",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\scrolling-tabs-menu\js\models\scroll-screen.js
//  Scroll Screen Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        return function () {
            var model = {
                stops: [0],
                stopIndex: 0,
                screenWidth: 0,
                sliderWidth: 0,
                allowScrollLeft: true,
                allowScrollRight: false
            };

            model.setEvents = function (events) {
                model.events = events;
                return model;
            };

            model.publish = function (eventName, eventData) {
                model.events.publish(eventName, eventData);
                return model;
            };

            model.subscribe = function (eventName, callback) {
                return model.events.subscribe(eventName, callback);
            };

            model.setScreenWidth = function (screenWidth) {
                model.stops.push(-screenWidth);
                model.screenWidth = screenWidth;
                return model;
            };

            model.setScrollWidth = function (scrollWidth) {
                model.scrollWidth = scrollWidth;
                return model;
            };

            model.getSliderWidth = function () {
                return model.sliderWidth;
            };

            model.canScrollLeft = function () {
                return model.allowScrollLeft;
            };

            model.canScrollRight = function () {
                return model.allowScrollRight;
            };

            model.addStop = function (stop) {
                var prevStop = model.stops[model.stops.length - 1];
                model.sliderWidth += stop;
                if (model.stops[1] < 60) {
                    model.stops[1] += stop;
                }
                else {
                    model.stops.push(prevStop + stop);
                }
            };

            model.flushStops = function () {
                model.stops = [0];
                return model;
            };

            model.resetSliderWidth = function () {
                model.sliderWidth = 0;
                return model;
            };

            model.resetScroll = function () {
                model.stopIndex = 0;
                model.allowScrollLeft = true;
                model.allowScrollRight = false;
                return model;
            };

            model.scrollEnabled = function () {
                return model.sliderWidth > model.screenWidth;
            };

            model.scrollLeft = function () {
                model.stopIndex++;
                model.updateScrollCtrls();
                return model.stops[model.stopIndex];
            };

            model.scrollRight = function () {
                model.stopIndex--;
                model.updateScrollCtrls();
                return model.stops[model.stopIndex];
            };

            model.updateScrollCtrls = function () {
                var stop = model.stops[model.stopIndex],
                    lastStop = model.stops[model.stops.length - 1];
                model.allowScrollRight = stop !== 0;
                model.allowScrollLeft = stop != lastStop;
            };

            model.updateStopIndex = function (scrollPos) {
                model.stops.forEach(function (stop, index) {
                    if (scrollPos >= stop) {
                        model.stopIndex = index;
                    }
                });
                model.updateScrollCtrls();
            };

            model.destroy = function () {
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpScrollingTabsMenu")
        .factory("rpScrollScreenModel", [factory]);
})(angular);


//  Source: _lib\realpage\scrolling-tabs-menu\js\directives\scrolling-tab.js
//  Scrolling Tab Directive

(function (angular, undefined) {
    "use strict";

    function rpScrollingTab($timeout, winSize, computedStyle) {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.$eval(attr.rpScrollingTab);

            dir.init = function () {
                dir.visWatch = scope.$watch(dir.isVisible, function () {
                    dir.readyTimer = $timeout(dir.onReady, 20);
                });
            };

            dir.onReady = function (isVisible) {
                if (isVisible) {
                    dir.visWatch();
                    dir.recordStop();
                    dir.winWatch = winSize.subscribe(dir.recordStop);
                    dir.destWatch = scope.$on("$destroy", dir.destroy);
                }
            };

            dir.recordStop = function () {
                $timeout.cancel(dir.timer);
                dir.timer = $timeout(dir.addStop, 100);
            };

            dir.addStop = function () {
                model.addStop(computedStyle(elem).outerWidth(true));
            };

            dir.isVisible = function () {
                return elem.is(":visible");
            };

            dir.destroy = function () {
                dir.winWatch();
                dir.visWatch();
                dir.destWatch();
                $timeout.cancel(dir.timer);
                $timeout.cancel(dir.visWatch);
                $timeout.cancel(dir.readyTimer);
                dir = undefined;
                elem = undefined;
                attr = undefined;
                model = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpScrollingTabsMenu")
        .directive("rpScrollingTab", [
            "$timeout",
            "windowSize",
            "rpComputedStyle",
            rpScrollingTab
        ]);
})(angular);

//  Source: _lib\realpage\scrolling-tabs-menu\js\directives\scrolling-tabs-screen.js
//  Scrolling Tabs Screen Directive

(function (angular, undefined) {
    "use strict";

    function rpScrollingTabsScreen($timeout, winSize) {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.$eval(attr.rpScrollingTabsScreen);

            dir.init = function () {
                dir.visWatch = scope.$watch(dir.isVisible, function () {
                    dir.readyTimer = $timeout(dir.onReady, 20);
                });
            };

            dir.onReady = function (isVisible) {
                if (isVisible) {
                    dir.visWatch();
                    dir.recordWidth();
                    scope.scrollScreen = dir;
                    dir.winWatch = winSize.subscribe(dir.recordWidth);
                    dir.destWatch = scope.$on("$destroy", dir.destroy);
                }
            };

            dir.isVisible = function () {
                return elem.is(":visible");
            };

            dir.recordWidth = function () {
                $timeout.cancel(dir.setWidthTimer);
                dir.setWidthTimer = $timeout(dir.setWidth, 100);
            };

            dir.setWidth = function () {
                dir.scrollTo(0, 0);
                model.resetScroll().setScreenWidth(elem.width());
            };

            dir.scrollLeft = function () {
                model.publish("beforeScroll");
                dir.scrollTo(model.scrollLeft());
                model.publish("afterScroll");
            };

            dir.scrollRight = function () {
                model.publish("beforeScroll");
                dir.scrollTo(model.scrollRight());
                model.publish("afterScroll");
            };

            dir.scrollTo = function (newStop, duration) {
                dir.unbindScroll();
                duration = duration === undefined ? 200 : duration;

                if (duration === 0) {
                    elem.prop("scrollLeft", newStop);
                }
                else {
                    elem.animate({
                        scrollLeft: newStop
                    }, duration);
                }

                dir.bindScrollTimer = $timeout(dir.bindScroll, duration + 100);
            };

            dir.bindScroll = function () {
                if (elem) {
                    elem.on("scroll.scrollingTabs", dir.onScroll);
                }
            };

            dir.unbindScroll = function () {
                elem.off("scroll.scrollingTabs");
            };

            dir.onScroll = function (e) {
                $timeout.cancel(dir.scrollTimer);
                dir.scrollTimer = $timeout(dir.updateStopIndex, 50);
            };

            dir.updateStopIndex = function () {
                model.publish("beforeScroll");
                var scrollPos = elem.get(0).scrollLeft;
                model.updateStopIndex(scrollPos);
                model.publish("afterScroll");
            };

            dir.destroy = function () {
                dir.visWatch();
                dir.winWatch();
                dir.destWatch();
                $timeout.cancel(dir.visWatch);
                $timeout.cancel(dir.readyTimer);
                $timeout.cancel(dir.scrollTimer);
                $timeout.cancel(dir.setWidthTimer);
                $timeout.cancel(dir.bindScrollTimer);
                dir = undefined;
                attr = undefined;
                elem = undefined;
                model = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpScrollingTabsMenu")
        .directive("rpScrollingTabsScreen", [
            "$timeout",
            "windowSize",
            rpScrollingTabsScreen
        ]);
})(angular);

//  Source: _lib\realpage\scrolling-tabs-menu\js\directives\scrolling-tabs-slider.js
//  Scrolling Tabs Slider Directive

(function (angular, undefined) {
    "use strict";

    function rpScrollingTabsSlider($timeout, winSize) {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.$eval(attr.rpScrollingTabsSlider);

            dir.init = function () {
                dir.visWatch = scope.$watch(dir.isVisible, function() {
                    dir.readyTimer = $timeout(dir.onReady, 20);
                });
            };

            dir.onReady = function (isVisible) {
                if (isVisible) {
                    dir.visWatch();
                    dir.recordWidth();
                    dir.winWatch = winSize.subscribe(dir.recordWidth);
                    dir.destWatch = scope.$on("$destroy", dir.destroy);
                }
            };

            dir.isVisible = function () {
                return elem.is(":visible");
            };

            dir.recordWidth = function () {
                $timeout.cancel(dir.timer);
                dir.timer = $timeout(dir.setWidth, 500);
            };

            dir.setWidth = function () {
                elem.width(model.getSliderWidth());
            };

            dir.destroy = function () {
                dir.visWatch();
                dir.winWatch();
                dir.destWatch();
                $timeout.cancel(dir.timer);
                $timeout.cancel(dir.visWatch);
                $timeout.cancel(dir.readyTimer);
                dir = undefined;
                attr = undefined;
                elem = undefined;
                model = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpScrollingTabsMenu")
        .directive("rpScrollingTabsSlider", [
            "$timeout",
            "windowSize",
            rpScrollingTabsSlider
        ]);
})(angular);

//  Source: ui\lib\realpage\svg-icons\js\scripts.js
angular.module("rpSvgIcon", []);
//  Source: _lib\realpage\svg-icons\js\directives\svg-icon.js
//  SVG Icon Directive

(function (angular) {
    "use strict";

    function rpSvgIcon(cache) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.getIcon();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.getIcon = function () {
                if (attr.svgSrc) {
                    cache.get(attr.svgSrc, dir.insertIcon);
                }
                else {
                    logc("rpSvgIcon.getIcon: svg src is invalid! => ", elem);
                }
            };

            dir.insertIcon = function (iconData) {
                elem.html(iconData);
            };

            dir.destroy = function () {
                elem.html("");
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpSvgIcon")
        .directive("rpSvgIcon", ["rpSvgIconCache", rpSvgIcon]);
})(angular);

//  Source: _lib\realpage\svg-icons\js\services\svg-icon-cache.js
//  Svg Icon Cache Service

(function (angular) {
    "use strict";

    function RpSvgIconCache($http, eventStream) {
        var svc = this,
            iconCache = {},
            inProgress = {},
            eventStreams = {};

        // Getters

        svc.get = function (url, callback) {
            var iconData = iconCache[url];

            if (iconData) {
                callback(iconData);
            }
            else {
                if (!inProgress[url]) {
                    inProgress[url] = true;
                    svc.getData(url, callback);
                }

                svc.queueReq(url, callback);
            }
        };

        svc.getData = function (url, callback) {
            eventStreams[url] = eventStream();
            eventStreams[url].subscribe(callback);
            $http.get(url).then(svc.onGetData);
        };

        // Actions

        svc.onGetData = function (resp) {
            var url = resp.config.url;
            svc.storeData(url, resp.data).publishData(url, resp.data);
        };

        svc.publishData = function (url, data) {
            delete inProgress[url];
            eventStreams[url].publish(data).destroy();
            delete eventStreams[url];
        };

        svc.queueReq = function (url, callback) {
            eventStreams[url].subscribe(callback);
        };

        svc.storeData = function (url, data) {
            iconCache[url] = data;
            return svc;
        };
    }

    angular
        .module("rpSvgIcon")
        .service("rpSvgIconCache", [
            "$http",
            "eventStream",
            RpSvgIconCache
        ]);
})(angular);

//  Source: ui\lib\realpage\tabs-menu\js\scripts.js
//  Source: _lib\realpage\tabs-menu\js\_bundle.inc
angular.module("rpTabsMenu", []);

//  Source: _lib\realpage\tabs-menu\js\templates\tabs-menu.js
//  Tabs Menu Template

(function(angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/tabs-menu/tabs-menu.html";

    templateHtml = "" +
        "<div class='rp-tabs-menu btn-group btn-group-rounded btn-group-outline b-primary rounded'>" +
        "<button ng-repeat='menuItem in model.list' ng-click='model.activate(menuItem)' ng-class='{active: menuItem.isActive}' type='button' class='btn white b-primary text-primary rounded btn-min-width'>" +
        "{{menuItem.text}}" +
        "</button>" +
        "</div>";


    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpTabsMenu")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\tabs-menu\js\models\tabs-menu.js
//  Tabs Menu Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream) {
        return function () {
            var model = {};

            model.list = [];

            model.events = {
                change: eventStream()
            };

            model.setOptions = function (options) {
                if (options && options.forEach) {
                    options.forEach(model.addOption);
                }
                return model;
            };

            model.addOption = function (option) {
               // option.isActive = model.list.length === 0;
                model.list.push(option);
                if (option.isActive) {
                    model.selected = option;
                }
                return model;
            };

            model.activate = function (option) {
                if (option.isActive) {
                    return;
                }
                model.list.forEach(function (listItem) {
                    listItem.isActive = listItem.text == option.text;
                });
                model.selected = option;
                model.events.change.publish(option);
                return model;
            };

            model.subscribe = function (eventName, callback) {
                if (typeof callback != "function") {
                    logc("TabsMenu.subscribe: callback is not a function! =>", callback);
                }
                else if (!model.events[eventName]) {
                    logc("TabsMenu.subscribe: " + eventName + " is not a valid event name!");
                }
                else {
                    return model.events[eventName].subscribe(callback);
                }
            };

            model.destroy = function () {
                model.events.change.destroy();
                model.events = undefined;
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpTabsMenu")
        .factory("rpTabsMenuModel", ["eventStream", factory]);
})(angular);

//  Source: _lib\realpage\tabs-menu\js\directives\tabs-menu.js
//  Tabs Menu Directive

(function (angular) {
    "use strict";

    function rpTabsMenu() {
        function link(scope, elem, attr) {
            if (!scope.model) {
                elem.remove();
                logc('rpTabsMenu: model is undefined!');
            }
        }

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/tabs-menu/tabs-menu.html"
        };
    }

    angular
        .module("rpTabsMenu")
        .directive('rpTabsMenu', [rpTabsMenu]);
})(angular);

//  Source: ui\lib\realpage\toggle\js\scripts.js
angular.module("rpToggle", []);

//  Source: _lib\realpage\toggle\js\templates\templates.inc.js
angular.module("rpToggle").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/toggle/templates/toggle.html",
"<span ng-click=\"dir.toggle($event)\" ng-class=\"dir.getState()\" class=\"rp-toggle\"><i class=\"icon\" ng-class=\"dir.getIconState()\"></i> <span class=\"text active\">{{options.activeText}} </span><span class=\"text inactive\">{{options.defaultText}}</span></span>");
}]);

//  Source: _lib\realpage\toggle\js\directives\toggle.js
//  Toggle Directive

(function (angular, undefined) {
    "use strict";

    function rpToggle(timeout) {
        var body,
            index = 1;

        function link(scope, elem, attr) {
            index++;

            var dir = {},
                options = scope.options || {},
                click = "click.rpToggle" + index;

            dir.init = function () {
                scope.dir = dir;
                body = body || angular.element("body");
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.toggle = function (ev) {
                if (options && options.preventDefault) {
                    ev.preventDefault();
                }

                if (options && options.bodyToggle && !scope.model) {
                    scope.model = true;

                    timeout(function () {
                        body.off(click).on(click, dir.hide);
                    });
                }
                else {
                    scope.model = !scope.model;
                }
            };

            dir.getState = function () {
                var state = {
                    on: scope.model
                };

                if (options.defaultClass) {
                    state[options.defaultClass] = scope.model;
                }

                if (options.activeClass) {
                    state[options.activeClass] = !scope.model;
                }

                return state;
            };

            dir.getIconState = function () {
                var state = {};

                if (options.defaultIconClass) {
                    state[options.defaultIconClass] = scope.model;
                }

                if (options.activeIconClass) {
                    state[options.activeIconClass] = !scope.model;
                }

                return state;
            };

            dir.hide = function () {
                body.off(click);
                scope.$apply(function () {
                    scope.model = false;
                });
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
                options = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "=",
                options: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/toggle/templates/toggle.html"
        };
    }

    angular
        .module("rpToggle")
        .directive("rpToggle", ["timeout", rpToggle]);
})(angular);


// Unified Amenities Modules

//  Source: ui\_app\js\base\_bundle.inc
//  Note: Please do not alter the order
//  in which files are being included

//  Source: ui\_app\js\base\app-init.js
//  Initialize Angular App Modules

(function() {
    "use strict";

    angular
        .module("ui", ["rpApp"]);
})();

//  Source: ui\_app\js\config\_bundle.inc
//  Note: Please do not alter the order
//  in which files are being included

//  Source: ui\_app\js\config\core-lazy-load.js
//  Core Lazy Load Config

(function (angular) {
    "use strict";

    function config(cdnVer, coreLibLazyloadConfig) {
        coreLibLazyloadConfig.init({
            basePath: cdnVer
        });
    }

    angular
        .module("ui")
        .config(["cdnVer", "coreLibLazyloadConfigProvider", config]);
})(angular);

//  Source: ui\_app\js\config\global-header.js
//  Global Header Config

(function (angular) {
    "use strict";

    function config(cdnVer, headerModel) {
        headerModel.extendData({
            logoLink: "",
            logoImgSrc: "../" + cdnVer + "/lib/realpage/global-header/images/rp-logo-white.png",

            productLink: "",
            productName: "My RealPage",

            "homeUrl": "/#/",
            "manageUrl": "/#/products",

            "userAvatarUrl": "../" + cdnVer + "/lib/realpage/global-header/images/user-avatar.jpg"
        });

        headerModel.setUserLinks([
            {
                "type": "link",
                "newWindow": false,
                "text": "Settings",
                "url": "/#/profile-settings",
            },
            {
                "type": "event",
                "text": "Sign out",
                "eventName": "signout"
            }
        ]);
    }

    angular
        .module("ui")
        .run(["cdnVer", "rpGlobalHeaderModel", config]);
})(angular);

//  Source: ui\_app\js\config\lazy-load.js
//  Lazy Load Config

(function(angular) {
    "use strict";

    function config(resolveModule) {
        var modules, appConfig,
            appName = "ui";

        modules = {
            "home.base": ["css", "js"],
            "home.dashbaord": ["css", "js"],
            "home.account-payments": ["css", "js", "lang"],
            "home.view-statements": ["css", "js"],
            "home.invoice": ["css", "js", "lang"],
            "home.error": ["css", "js", "lang"],
            "login": ["css", "js", "lang"],
            "home.common-area": ["css", "js"],
            "home.activity": ["css", "js"],
            "home.floorplan-unit.bundle": ["css", "js"],
            "home.profile-settings.bundle": ["css", "js"],
            "Common.primary-nav": ["css", "js"]
        };

        appConfig = {
            appName: appName,
            modules: modules,
            basePath: "/ui"
        };

        resolveModule
            .setLazyLoad(appName, appConfig);
    }

    angular
        .module("ui")
        .config(["rpResolveModuleProvider", config]);
})(angular);

//  Source: ui\_app\js\config\oc-lazyload.js
//  Configure ocLazyLoad

(function (angular) {
    "use strict";

    function config($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // events: true,
            // debug: true,
            // cache: true
        });
    }

    angular
        .module("ui")
        .config(["$ocLazyLoadProvider", config]);
})(angular);

//  Source: ui\_app\js\config\location.js
// Location Service Config

(function (angular) {
    "use strict";

    function config($locationProvider) {
        $locationProvider.hashPrefix("");
    }

    angular
        .module("ui")
        .config(["$locationProvider", config]);
})(angular);

//  Source: ui\_app\js\config\scope-annotations.js
//  Scope Annotation Config

(function (angular) {
    "use strict";

    function config($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }

    angular
        .module("ui")
        .config(["$compileProvider", config]);
})(angular);

//  Source: ui\_app\js\config\breadcrumbs.js
//  Configure Meta Data

(function(angular) {
    "use strict";

    function config(prov) {
        prov.setProduct({
            name: "commercial"
        });

        prov.setHome({
            icon: "rp-icon-statistics-5",
            text: "Home"
        });

        var links = {
            'home.dashbaord': {
                href: '#/dashbaord',
                text: 'Overview'
            },

            'home.invoice': {},

            'home.statements': {},

            'home.account-payments': {}


        };

        var breadcrumbs = [{
            name: 'home.dashbaord',
            url: '/dashbaord',
            text: "Overview"
        }, {
            name: 'home.invoice',
            url: '/invoice/lease/:id',
            text: 'Invoice'
        }, {
            name: 'home.statements',
            url: '/statements/lease/:id',
            text: 'View Statements',
            backLink: 'home.dashbaord',
            links: ['home.dashbaord']
        }, {
            name: 'home.account-payments',
            url: '/accounts',
            text: 'Account Statements'
        }];

        prov.setLinks(links).setBreadcrumbs(breadcrumbs);
    }

    angular
        .module("ui")
        .config(['rpBdgtBreadcrumbsModelProvider', config]);
})(angular);


//  Source: ui\_app\js\config\resolve-modules.js
//  Config Resolve Module

(function (angular) {
    "use strict";

    function config(resolveModule) {
        var resolve = {};

        resolveModule.setResolve(resolve);
    }

    angular
        .module("ui")
        .config(["rpResolveModuleProvider", config]);
})(angular);

//  Source: ui\_app\js\config\routes.js
//  Configure Routes

(function(angular) {
    "use strict";

    function config(RoutesProvider) {
        var routes = {};
        routes["login"] = {
            url: "/",
            rerun: true,
            controller: "loginCtrl as page",
            lazyLoad: [{
                files: [
                    "ui.home.base",
                    "ui.login",
                    "lib.realpage.form-input-radio"
                ]
            }]
        };
        routes["home"] = {
            url: "",
            abstract: true,
            controller: "HomeCtrl as page",
            lazyLoad: [{
                files: [
                    "lib.realpage.global-header-lang",
                    "ui.home.base"
                ]
            }]
        };
        routes["home.dashbaord"] = {
            url: "/dashbaord",
            controller: "dashboardCtrl as page",
            lazyLoad: [{
                files: [
                    "ui.home.dashbaord",
                    "ui.home.account-payments",
                    "lib.realpage.accordion"
                ]
            }]
        };
        routes["home.account-payments"] = {
            url: "/accounts",
            controller: "accountsCtrl as page",
            lazyLoad: [{
                files: [
                    "ui.home.dashbaord",
                    "ui.home.invoice",
                    "ui.home.account-payments",
                    "lib.realpage.form-select-menu-v1",
                    "lib.realpage.common",
                    "lib.realpage.float-scroll",
                    "lib.realpage.form-common",
                    "lib.realpage.datetimepicker-v1",
                    "lib.realpage.form-select-menu-v1",
                    "lib.realpage.scrolling-tabs-menu",
                    "lib.realpage.pagination",
                    "lib.realpage.busy-indicator",
                    "lib.realpage.grid",
                    "lib.realpage.grid-controls",
                    "lib.realpage.grid-pagination"
                ]
            }]
        };
        routes["home.view-statements"] = {
            url: "/statements/lease/:id",
            controller: "statementsCtrl as page",
            lazyLoad: [{
                files: [
                    "ui.home.dashbaord",
                    "ui.home.view-statements",
                    "lib.realpage.form-select-menu-v1"

                ]
            }]
        };
        routes["home.invoice"] = {
            url: "/invoice/lease/:id",
            controller: "invoiceCtrl as page",
            rerun: true,
            lazyLoad: [{
                files: [
                    "ui.home.dashbaord",
                    "ui.home.invoice",
                    "lib.realpage.form-select-menu-v1",
                    "lib.realpage.form-input-text-v1"
                ]
            }]
        };
        routes["home.error"] = {
            url: "/error/:errorCode",
            controller: "ErrorCtrl as page",
            params: {
                errorCode: '404',
                templateUrl: undefined,
                model: undefined
            },
            lazyLoad: [{
                serie: true,
                rerun: true,
                files: [
                    "ui.home.error"
                ]
            }]
        };
        routes["home.floorplan-unit"] = {
            url: "/floorplan-unit",
            controller: "FloorPlanUnitCtrl as floorPlanUnit",
            lazyLoad: [{
                rerun: true,
                files: [
                    "lib.angular.motion",
                    "lib.bootstrap.additions",
                    "lib.angular.strap",
                    "ui.home.floorplan-unit.bundle"
                ]
            }]
        };

        routes["home.common-area"] = {
            url: "/common-area",
            controller: "CommonAreaCtrl as commonArea",
            lazyLoad: [{
                files: [
                    "ui.home.common-area"
                ]
            }]
        };

        routes["home.activity"] = {
            url: "/activity",
            controller: "ActivityCtrl as activity",
            lazyLoad: [{
                files: [
                    "ui.home.activity"
                ]
            }]
        };

        routes["home.profile-settings"] = {
            url: "/profile-settings",
            controller: "ProfileSettingsCtrl as page",
            lazyLoad: [{
                rerun: true,
                files: [
                    "lib.angular.motion",
                    "lib.bootstrap.additions",
                    "lib.angular.strap",
                    "ui.home.profile-settings.bundle"
                ]
            }]
        };

        RoutesProvider
            .setTemplateUrlPrefix("ui/")
            .setRoutes(routes)
            .setDefault("/");
    }

    angular
        .module("ui")
        .config(["rpRoutesProvider", config]);
})(angular);


//  Source: ui\_app\js\config\global-nav.js
(function(angular) {
    'use strict';

    function config(prov) {
        var navData = [{
            labelText: 'Overview',
            labelLink: '#/dashbaord',
            iconClassName: 'rp-icon-home'
        }, {
            labelText: 'Account & Payments',
            labelLink: '#/accounts',
            iconClassName: 'rp-icon-card'
        }, {
            labelText: 'Invoices',
            labelLink: '#/invoice/lease/:id',
            iconClassName: 'rp-icon-file-document'
        }, {
            labelText: 'Maitenance Request',
            labelLink: '/ui/coming-soon/',
            iconClassName: 'rp-icon-tools'
        }, {
            labelText: 'Management Staff',
            labelLink: '/ui/budgeting/',
            iconClassName: 'rp-icon-user-profile'
        }, {
            labelText: 'Documents',
            labelLink: '/ui/coming-soon/',
            iconClassName: 'rp-icon-file-document'
        }, {
            labelText: 'Contact Us',
            labelLink: '/ui/coming-soon/',
            iconClassName: 'rp-icon-photo-classic'
        }];

        prov.setData(navData);
    }
    angular
        .module("ui")
        .run(["rpGlobalNavModel", config]);
})(angular);

//  Source: ui\_app\js\config\interceptor.js
(function(app) {
    'use strict';
    angular.module('ui').factory('errorInterceptor', ['$rootScope', '$q', function($rootScope, $q) {
        return {
            request: function(config) {
                //writeit ardam kaley o

                config.headers = config.headers || {};
                if (config.url != "/api/login" && config.url != "/api/forgotPwd") {
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

//  Source: ui\_app\js\controllers\_bundle.inc
//  Source: ui\_app\js\controllers\app.js
//  App Controller

(function (angular) {
    "use strict";

    function AppCtrl() {
        var vm = this;

        vm.init = function () {

        };

        vm.destroy = function () {

        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("AppCtrl", [AppCtrl]);
})(angular);

//  Source: ui\_app\js\models\_bundle.inc
//  Source: ui\_app\js\models\right-aside.js
//  Right Aside Model

(function (angular, undefined) {
    "use strict";

    function factory($aside) {
        function RightAsideModal() {
            var s = this;
            s.init();
        }

        var p = RightAsideModal.prototype;

        p.init = function () {
            var s = this;

            s.isReady = false;

            s.asideData = {
                show: false,
                backdrop: true,
                placement: "right",
                animation: "am-fade-and-slide-right"
            };
        };

        p.setAsideUrl = function (url) {
            var s = this;
            s.asideData.templateUrl = url;
            return s;
        };

        p.load = function () {
            var s = this;
            s.aside = $aside(s.asideData);
            return s.aside.$promise;
        };

        p.show = function () {
            var s = this;
            if (s.isReady) {
                s.aside.show();
            }
            else {
                s.load().then(s.showOnLoad.bind(s));
            }
            return s;
        };

        p.showOnLoad = function () {
            var s = this;
            s.isReady = true;
            s.show();
            return s;
        };

        p.hide = function () {
            var s = this;
            s.aside.hide();
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.aside.destroy();
            s.aside = undefined;
            s.isReady = undefined;
            s.asideData = undefined;
        };

        return function (url) {
            return (new RightAsideModal()).setAsideUrl(url);
        };
    }

    angular
        .module("ui")
        .factory("rightAsideModal", ["$aside", factory]);
})(angular);

//  Source: ui\_app\js\models\amenity-context.js
//  Modal Context

(function (angular, undefined) {
    "use strict";

    function factory() {
        function AmenityContext() {
            var s = this;
            s.init();
        }

        var p = AmenityContext.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
        };

        p.set = function (obj) {
            var s = this;
            s.data.obj = obj;
            return s;
        };

        p.get = function () {
            var s = this;
            return s.data.obj;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function () {
            return new AmenityContext();
        };
    }

    angular
        .module("ui")
        .factory("modalContext", [factory]);
})(angular);

//  Source: ui\_app\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("app/templates/breadcrumbs.html",
"<div class=\"rp-breadcrumbs\" ng-show=\"$ctrl.model.isVisible\"><a class=\"home-icon {{::$ctrl.model.home.icon}}\" href=\"{{::$ctrl.model.home.url}}\"></a><div class=\"pull-left ft-b-r\"><div class=\"product-name\">{{$ctrl.model.product.name}}</div><div class=\"rp-breadcrumbs-links\" ng-if=\"$ctrl.model.hasBreadCrumb\"><div class=\"rp-breadcrumb home-link\"><a href=\"#/dashbaord\" class=\"rp-breadcrumb-text\">{{$ctrl.model.home.text}}</a></div><ul class=\"rp-breadcrumbs-list\"><li ng-repeat=\"link in $ctrl.model.links\" class=\"rp-breadcrumb p-a-0\"><a href=\"{{link.href}}\" class=\"rp-breadcrumb-text\">{{link.text}}</a></li></ul><div class=\"active-page rp-breadcrumb\"><span class=\"active-page-text rp-breadcrumb-text\">{{$ctrl.model.activePage.text}}</span></div></div><div class=\"rp-breadcrumb home-link\" ng-if=\"!$ctrl.model.hasBreadCrumb\"><a href=\"{{$ctrl.model.backLink.href}}\" class=\"rp-breadcrumb-text\"><i class=\"rp-icon-angle-left ft-s-10 p-r-xs\"></i>{{$ctrl.model.backLink.text}}</a></div></div></div>");
$templateCache.put("app/templates/fileSymbols.html",
"<span class=\"glyphicon glyphicon-file\"></span> <span class=\"glyphicon glyphicon-cloud m-l-1\"></span>");
$templateCache.put("app/templates/history-navigation.html",
"<div class=\"rp-breadcrumbs\" ng-show=\"model.isVisible\"><a class=\"home-icon {{::model.home.icon}}\" href=\"{{::model.home.url}}\"></a><div class=\"pull-left ft-b-r\"><div class=\"product-name\">{{model.product.name}}</div><div class=\"rp-breadcrumbs-links\"><div class=\"home-link\"><a href=\"{{model.url}}\" class=\"rp-breadcrumb-text\"><i class=\"rp-icon-angle-left\"></i>{{model.home.text}}</a></div><div class=\"rp-breadcrumb home-link\"><a href=\"{{model.home.url}}\" class=\"rp-breadcrumb-text\">{{model.home.text}}</a></div><ul class=\"rp-breadcrumbs-list\"><li ng-repeat=\"link in model.links\" class=\"rp-breadcrumb p-a-0\"><a href=\"{{link.href}}\" class=\"rp-breadcrumb-text\">{{link.text}}</a></li></ul><div class=\"active-page rp-breadcrumb\"><span class=\"active-page-text rp-breadcrumb-text\">{{model.activePage.text}}</span></div></div></div></div>");
$templateCache.put("app/templates/label.html",
"<div class=\"grid-edit-title\"><span style=\"color:red\" ng-bind=\"record[config.key]\"></span></div>");
$templateCache.put("app/templates/nav.html",
"<div class=\"leftNavWrapper\"><!--Toggle Wrapper--><div class=\"toggleWrapper\"><a href=\"javascript:void(0);\" class=\"toggleButton\"><i class=\"fa fa-bars\" aria-hidden=\"true\"></i></a></div><!--End Toggle Wrapper--><div class=\"scrollWrapper\"><!-- Left Nav Item Wrapper--><div class=\"topNavWrapper\" ng-repeat=\"navItem in model.navData\"><a ng-href=\"../{{ navItem.link }}\" class=\"topNavHeaderClick\"><div class=\"topNavHeader\"><i class=\"icon\" ng-class=\"navItem.icon\" aria-hidden=\"true\"></i> <span class=\"topNavHeaderText\">{{ navItem.text }}</span> <i ng-show=\"navItem.subNav\" class=\"fa fa-chevron-down endPoint\" aria-hidden=\"true\"></i></div></a><!-- <div class=\"subNavMouseOver\">\n" +
"              <div class=\"subNavWrapper\" ng-repeat=\"navSubItem in navItem.subNav\">\n" +
"                <div class=\"subNavItemWrapper\">\n" +
"                  <a ng-href=\"../{{ navSubItem.link }}\" class=\"subNavClick\">\n" +
"                    <span class=\"subNavTextWrapper\">{{ navSubItem.text }}</span>\n" +
"                  </a>\n" +
"                </div>\n" +
"              </div>\n" +
"            </div> --></div><!--End Left Nav Item Wrapper--></div></div>");
$templateCache.put("app/templates/textbox.html",
"<!-- <div class=\"grid-edit-title\">\n" +
"    <rp-form-input-text config=\"model.formConfig.payAmount\" rp-model=\"record[config.key]\">\n" +
"    </rp-form-input-text>\n" +
"</div> --><!-- ng-class=\"inputText.getState()\" config=\"model.formConfig.payAmount\" rp-model=\"record[config.key]\" style=\"\" --> {{config}}<div class=\"rp-form-input-text ng-isolate-scope touched\"><div class=\"rp-form-input-text-table\"><div class=\"rp-form-input-text-row\"><div class=\"rp-form-input-text-cell rp-form-input-text-field-wrap\"><input class=\"rp-form-input-text-field\" id=\"Pay Amount\" maxlength=\"\" minlength=\"\" name=\"Pay Amount\" ng-blur=\"config.method(record)\" ng-change=\"inputText.onChange(rpModel)\" ng-model=\"record[config.key]\" ng-trim=\"true\" placeholder=\"\" type=\"text\" autocomplete=\"off\"></div></div></div></div>");
}]);



//  Source: ui\_common\breadcrumbs\js\components\breadcrumbs.js
(function(angular) {
    "use strict";

    function Controller(rpBdgtBreadcrumbs) {
        var events,
            vm = this;

        vm.$onInit = function() {
            vm.model = rpBdgtBreadcrumbs;
        };

        vm.$onDestroy = function() {

        };
    }

    var component = {
        controller: [
            'rpBdgtBreadcrumbsModel',
            Controller
        ],
        templateUrl: "app/templates/breadcrumbs.html"
    };

    angular
        .module("ui")
        .component("rpBdgtBreadcrumbs", component);
})(angular);

//  Source: ui\_common\breadcrumbs\js\providers\breadcrumbs.js
(function(angular) {
    "use strict";

    function Provider() {
        var prov = this;

        prov.links = {};
        prov.breadcrumbs = [];

        prov.setProduct = function(product) {
            prov.product = product;
            return prov;
        };

        prov.setHome = function(home) {
            prov.home = home;
            return prov;
        };

        prov.setLinks = function(links) {
            prov.links = links;
            return prov;
        };

        prov.setBreadcrumbs = function(breadcrumbs) {
            prov.breadcrumbs = breadcrumbs;
            return prov;
        };

        function provide($rootScope, $state, $location, $urlMatcherFactory, storage) {
            var model = {},
                ev = '$locationChangeSuccess',
                dataKey = "bdgtBreadcrumbsLinks";

            model.init = function() {
                model.home = prov.home;
                model.updateFromStorage();
                model.product = prov.product;
                $rootScope.$on('$locationChangeSuccess', model.setLinks);
                return model;
            };

            model.storageAvailable = function() {
                return storage.has(dataKey);
            };

            model.updateFromStorage = function() {
                if (model.storageAvailable()) {
                    var links = storage.get(dataKey);
                    Object.keys(links).forEach(function(key) {
                        angular.extend(prov.links[key], links[key]);
                    });
                }
            };

            model.setLinks = function(event, newUrl, oldUrl) {
                newUrl = newUrl.split('#')[1];
                oldUrl = oldUrl.split('#')[1];
                //model.backUrl = oldUrl;
                //model.currentUrl = newUrl;
                model.isVisible = false;
                for (var i = 0; i < prov.breadcrumbs.length; i++) {
                    var item = prov.breadcrumbs[i],
                        itemParams = item.params || {},
                        urlMatcher = $urlMatcherFactory.compile(item.url, { params: itemParams }),
                        params = urlMatcher.exec(newUrl);
                    if (params) {
                        if (!model.storageAvailable()) {
                            (item.links || []).forEach(function(key) {
                                var link = prov.links[key];
                                if (link.hasOwnProperty('replace')) {
                                    key = link.replace;
                                }
                                var breadcrumb = model.getBreadcrumbByName(key);
                                if (breadcrumb) {
                                    prov.links[key].href = $state.href(key, params);
                                    prov.links[key].text = breadcrumb.text;
                                }
                            });
                        }
                        model.isVisible = true;
                        model.updateLink(item.name, params, item.text);
                        model.hasBreadCrumb = item.backLink === undefined;
                        if (model.hasBreadCrumb) {
                            model.links = [];
                            (item.links || []).forEach(function(linkKey) {
                                var link = prov.links[linkKey];
                                if (link.hasOwnProperty('replace')) {
                                    model.links.push(prov.links[link.replace]);
                                } else {
                                    model.links.push(link);
                                }
                            });
                            model.setActivePage(item.text);
                        } else {
                            var backLink = prov.links[item.backLink];
                            for (var j = 0; item.links && j < item.links.length; j++) {
                                var link = prov.links[item.links[j]];
                                if (link.hasOwnProperty('href') && link.href.replace('#', '').toLowerCase() === oldUrl) {
                                    item.backLink = item.links[j];
                                    if (link.hasOwnProperty('replace')) {
                                        backLink = prov.links[link.replace];
                                    } else {
                                        backLink = link;
                                    }
                                    break;
                                }
                            }
                            model.backLink = backLink;
                        }
                        break;
                    }
                }

            };

            model.setActivePage = function(text) {
                model.activePage = {
                    text: text
                };
                return model;
            };

            model.goBack = function() {
                var url = "/";
                if (model.backLink) {
                    url = model.backLink.href.replace('#', '');
                } else if (model.links) {
                    url = model.links.last().href.replace('#', '');
                } else {
                    logc("rpBdgtBreadcrumbsModel: Cannot go back");
                }
                $location.path(url);
                return model;
            };

            model.getBreadcrumbByName = function(routeName) {
                var item;
                for (var i = 0; i < prov.breadcrumbs.length; i++) {
                    if (prov.breadcrumbs[i].name === routeName) {
                        item = prov.breadcrumbs[i];
                        break;
                    }
                }
                return item;
            };

            model.updateBackLink = function(ofRouteName, toRouteName) {
                var breadcrumb = model.getBreadcrumbByName(ofRouteName);
                if (breadcrumb && breadcrumb.backLink) {
                    breadcrumb.backLink = prov.links[toRouteName];
                }
                return model;
            };

            model.updateLink = function(routeName, params, text) {
                var link = prov.links[routeName];
                if (link) {
                    link.href = $state.href(routeName, params);
                    link.text = text || link.text;
                    storage.set("bdgtBreadcrumbsLinks", prov.links);
                } else {
                    logc("rpBdgtBreadcrumbsModel: Invalid link route name: " + routeName);
                }
                return model;
            };

            model.updateLinkText = function(text) {
                var link = prov.links[$state.current.name];
                if (link) {
                    link.text = text || link.text;
                    model.setActivePage(link.text);
                    storage.set("bdgtBreadcrumbsLinks", prov.links);
                } else {
                    logc("rpBdgtBreadcrumbsModel: Invalid link route name: " + $state.current.name);
                }
                return model;
            };

            return model.init();
        }

        prov.$get = [
            '$rootScope',
            '$state',
            '$location',
            '$urlMatcherFactory',
            'rpSessionStorage',
            provide
        ];
    }

    angular
        .module("ui")
        .provider("rpBdgtBreadcrumbsModel", [Provider]);
})(angular);

//  Source: ui\_common\global-header\js\_bundle.inc
//  Source: ui\_common\global-header\js\config\global-header.js
//  Global Header Config

(function(angular) {
    "use strict";

    function config(cdnVer, headerModel, state) {
        headerModel.extendData({
            productLink: "#/dashbaord",
            // showProductName: true,
            // productNameText: "Commerical"
        });

        headerModel.setUserLinks([{
            "text": "Sign out",
            "event": "signout.rpGlobalHeader"
        }]);

        headerModel.setToolbarIcons({
            homeIcon: {
                // url: "#/",
                active: true
            }
        });
        headerModel.setToolbarIcons({
            homeIcon: {
                url: "#/dashboard",
                active: true
            },

            helpIcon: {
                active: true
            }
        });
        headerModel.userLinks.invoke = function(link) {
            sessionStorage.removeItem('sessionID');
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('companyName');
            state.go('login');
        };
        headerModel.toolbarIcons.invoke = function(icon) {
            state.go('home.dashbaord');
        };
    }

    angular
        .module("ui")
        .run(["cdnVer", "rpGlobalHeaderModel", '$state', config]);
})(angular);

//  Source: ui\_common\global-header\js\config\username.js
//  Init Username

(function(angular) {
    "use strict";

    function config(headerUsername) {}

    angular
        .module("ui")
        .run(["globalHeaderUsername", config]);
})(angular);

//  Source: ui\_common\global-header\js\services\username.js
//  Header Username

(function(angular, undefined) {
    "use strict";

    function GlobalHeaderUsername(headerModel) {
        var svc = this;

        svc.nameWatch = angular.noop;
        svc.setUsername = function(name) {
            headerModel.extendData({
                username: name
            });
        };
    }

    angular
        .module("ui")
        .service("globalHeaderUsername", [
            "rpGlobalHeaderModel",
            GlobalHeaderUsername
        ]);
})(angular);
