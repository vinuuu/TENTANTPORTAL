//  Home Controller

(function(angular, undefined) {
    "use strict";

    function StatementsCtrl($scope, $http, notifSvc, statementsMdl, cdnVer, _, $timeout) {
        var vm = this,
            PrintID,
            model;

        vm.init = function() {
            vm.model = model = statementsMdl.init();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.loadData();
        };
        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };
        vm.printDiv = function() {
            var contents = '';
            var styles = ['http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', "/ui/" + cdnVer + "/lib/app/css/styles.css", '/ui/app/css/styles.css', '/ui/home/view-statements/css/styles.css'];
            $timeout(function() {
                contents = $('#PrintID').html();
                // if (PrintID.preContent) {
                //     contents = PrintID.preContent + contents;
                // }
                // if (PrintID.postContent) {
                //     contents = contents + PrintID.postContent;
                // }
                var frameData = $('<iframe/>');
                frameData[0].name = 'frameData';
                frameData.css({ 'position': 'absolute', 'top': '-1000000px' });
                $('body').append(frameData);
                var frameDoc = frameData[0].contentWindow ? frameData[0].contentWindow : frameData[0].contentDocument.document ? frameData[0].contentDocument.document : frameData[0].contentDocument;
                frameDoc.document.open();
                frameDoc.document.write('<html><head><title>Statements</title>');
                frameDoc.document.write('</head><body id=statements>');
                _.each(styles, function(item) {
                    frameDoc.document.write('<link href=' + item + ' rel="stylesheet"  type="text/css" />');
                });
                // frameDoc.document.write(Header);
                frameDoc.document.write(contents);
                frameDoc.document.write('<script>window.onload = function () { parent.document.title=statements; window.focus(); window.print(); parent.document.title=statement;};</script></body></html>');
                frameDoc.document.close();
            }, 1000);
        };


        vm.init();
    }

    angular
        .module("ui")
        .controller("statementsCtrl", ["$scope", '$http', 'notificationService', 'statementsdMdl',
            'cdnVer', 'underscore', '$timeout',
            StatementsCtrl
        ]);
})(angular);