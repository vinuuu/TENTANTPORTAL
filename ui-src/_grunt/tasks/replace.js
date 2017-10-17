module.exports = function (task, env) {
    "use strict";

    var moment = require("moment"),
        appVer = task.gruntOption("appVer") || Date.now().toString(32);

    task.getSrc = function (appName) {
        return task.getSrcList(function (target) {
            return [
                env.buildPath + "/index.html",
                env.buildPath + "/**/startup/js/*.js"
            ];
        });
    };

    task.getDefParams = function (appName) {
        var params = {
            src: task.getSrc(appName),

            rename: function (dest, src) {
                return src;
            },

            replacements: [
                {
                    pattern: /{{appVer}}/g,
                    replacement: appVer
                },
                {
                    pattern: /{{compileTime}}/g,
                    replacement: moment().utc().local().format("MM/DD/YYYY hh:mm:ss a")
                },
                {
                    pattern: /{{cdnVer}}/g,
                    replacement: task.getCdnVer()
                }
            ]
        };

        if (task.dev) {
            params.replacements.push({
                pattern: ".min.js",
                replacement: ".js"
            });
        }

        return params;
    };

    task.getTaskConfig = function (appName) {
        var config = {},
            buFo = task.buildFolder(appName),
            params = task.getParams(appName, "replace");

        config["stringReplace." + buFo] = {
            options: {
                replacements: params.replacements
            },

            files: [{
                expand: true,
                src: params.src,
                filter: "isFile",
                rename: params.rename,
            }]
        };

        return config;
    };

    return task;
};
