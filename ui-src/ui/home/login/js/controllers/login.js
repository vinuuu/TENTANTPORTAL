(function() {
    'use strict';


    function controller(loginMdl, loginFormConfig) {
        /* jshint validthis:true */
        var vm = this,
            model;
        vm.init = function() {
            vm.model = model = loginMdl;
            model.showHideFlag = "login";
            model.rdnEmailCode = 'email';
            model.rdnmobCode = false;
            vm.formConfig = loginFormConfig;

            model.pizzas = [{
                    id: "pizza1",
                    name: "Cheese"
                },

                {
                    id: "pizza2",
                    name: "Pepperoni"
                },

                {
                    id: "pizza3",
                    name: "Sausage"
                }
            ];

            loginFormConfig.setMethodsSrc(vm);
            loginFormConfig.genRadio("pizza", model.pizzas);
        };

        vm.init();
    }

    angular
        .module('uam')
        .controller('loginCtrl', controller);
    controller.$inject = ['loginMdl', 'loginFormConfig'];

})();








(function() {
    'use strict';
    var directiveId = 'ngMatch';

    function directive($parse) {

        function link(scope, elem, attrs, ctrl) {
            // if ngModel is not defined, we don't need to do anything
            if (!ctrl) {
                return;
            }
            if (!attrs[directiveId]) {
                return;
            }

            var firstPassword = $parse(attrs[directiveId]);

            var validator = function(value) {
                var temp = firstPassword(scope),
                    v = value === temp;
                ctrl.$setValidity('match', v);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe(directiveId, function() {
                validator(ctrl.$viewValue);
            });



        }


        var directive = {
            link: link,
            restrict: 'A',
            require: '?ngModel'
        };
        return directive;


    }


    angular
        .module('uam').directive(directiveId, directive);

    directive.$inject = ['$parse'];

})();