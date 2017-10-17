module.exports = function (task, env) {
    "use strict";

    task.getOptions = function () {
        return {
            force: true
        };
    };

    task.getDefParams = function (appName) {
        return {};
    };

    task.getTaskConfig = function (appName) {
        var config = {},
            options = task.getOptions(),
            buFo = task.buildFolder(appName);

        config["cleanLib." + buFo] = {
            options: options,
            src: appName + env.ds + "lib" + env.ds + "**"
        };

        return config;
    };

    return task;
};
