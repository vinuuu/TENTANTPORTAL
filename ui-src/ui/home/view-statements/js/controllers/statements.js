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
            var styles = ['http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', "ui/" + cdnVer + "/lib/app/css/styles.css", 'ui/app/css/styles.css', 'ui/home/view-statements/css/styles.css'];
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

        vm.downloadpdf=function(){
             /* jshint ignore:start */
            var pdf = new jsPDF('p', 'pt', 'letter');
            // source can be HTML-formatted string, or a reference
            // to an actual DOM element from which the text will be scraped.
            source = $('#PrintID')[0];
        
            // we support special element handlers. Register them with jQuery-style 
            // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
            // There is no support for any other type of selectors 
            // (class, of compound) at this time.
            specialElementHandlers = {
                // element with id of "bypass" - jQuery style selector
                '#bypassme': function (element, renderer) {
                    // true = "handled elsewhere, bypass text extraction"
                    return true
                }
            };
            margins = {
                top: 80,
                bottom: 60,
                left: 10,
                width: 700
            };
            // all coords and widths are in jsPDF instance's declared units
            // 'inches' in this case
            pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
            },
        
            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                pdf.save('Test.pdf');
            }, margins);

             /* jshint ignore:end */





            // var elem = $("#PrintID")[0].outerHTML;
            // var blob = new Blob([elem], {
            //     "type": "text/html"
            // });

            //     window.open('data:application/pdf,' + encodeURIComponent(elem));



            // var reader = new FileReader();
            // reader.onload = function (evt) {
            //     if (evt.target.readyState === 2) {
            //         console.log(evt.target.result, evt.target.result.slice(22, evt.target.result.length));
            //         vm.downloadpdfs(evt.target.result.split(',')[1]) ;
            //                     }
            // };
            // reader.readAsDataURL(blob);
        };
        
        vm.base64ToUint8Arrays=function(base64) {
            var raw =base64;// window.atob(base64); //This is a native function that decodes a base64-encoded string.
            var uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
            for(var i = 0; i < raw.length; i = i+1) {
              uint8Array[i] = raw.charCodeAt(i);
            }
            return uint8Array;
          }; 
        vm.downloadpdfs = function (base64) {                                          
            vm.saveData(base64, "PDF", "MG");                    
                };
        vm.saveData = function (content, contentType, fileName) {
            var test = vm.base64ToUint8Arrays(content);
            var blob = new Blob([test], { type: contentType });
              /* jshint ignore:start */
            saveAs(blob, fileName);
            /* jshint ignore:end */
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
