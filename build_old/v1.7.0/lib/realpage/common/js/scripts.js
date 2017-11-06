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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
        .factory("regex", [factory]);
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
        .factory('rpHomepage', ['rpSessionStorage', factory]);
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
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
        .module("app")
        .factory('windowSize', ['$window', 'eventStream', windowSize]);
})(angular);

