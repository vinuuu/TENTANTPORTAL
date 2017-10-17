module.exports = function (task, env) {
    "use strict";

    var registered = false;

    task.getOptions = function () {
        return {
            quoteCharacter: "\"",
            removeComments: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: false
        };
    };

    task.getDefParams = function () {
        return {
            src: [
                "index.html"
            ],

            rename: function (dest, src) {
                return env.buildPath + src;
            }
        };
    };

    task.getTaskConfig = function () {
        var config = {},
            params = task.getDefParams();

        if (!registered) {
            registered = true;
            config.options = task.getOptions();

            config["minhtml.app"] = {
                files: [{
                    expand: true,
                    src: params.src,
                    filter: "isFile",
                    rename: params.rename
                }]
            };
        }

        return config;
    };

    return task;
};
