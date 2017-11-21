//  App Startup

(function() {
    "use strict";

    RealPage.startup.load({
        appName: "ui",

        files: [{
                js: "{{cdnVer}}/lib/app/js/scripts.min.js",
                css: "{{cdnVer}}/lib/app/css/styles.min.css"
            },
            {
                js: "ui/app/js/scripts.min.js",
                css: "ui/app/css/styles.min.css"
            }
        ]
    });
})();