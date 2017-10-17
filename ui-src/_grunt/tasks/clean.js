module.exports = function (task, env) {
    "use strict";

    var done = false;

    task.getOptions = function () {
        return {
            force: true
        };
    };

    task.getDefParams = function (appName) {
        return {};
    };

    task.getTaskConfig = function (appName) {
        var src,
            config = {},
            options = task.getOptions();

        src = [
            env.buildPath + "v{1,2}*"
        ];

        if (!done) {
            done = true;

            src = src.concat([
                env.buildPath + "*.html",
                env.buildPath + appName + env.ds + "!(mocks)" + env.ds + "**"
            ]);

            config["cleanAll"] = {
                src: src,
                options: options
            };
        }

        return config;
    };

    return task;
};
