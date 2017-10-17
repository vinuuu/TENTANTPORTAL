module.exports = function (grunt, env) {
    "use strict";

    var task,
        path = require("path"),
        extend = require("extend");

    task = {
        filters: env.prov.getSvc("filters"),
        dev: grunt.cli.tasks.indexOf("dev") != -1,
        watch: grunt.cli.tasks.indexOf("watch") != -1,
        testjs: grunt.cli.tasks.indexOf("testjs") != -1
    };

    task.buildFolder = function (appName) {
        return appName.replace(/_/g, "");
    };

    task.cleanPath = function (filePath) {
        var fileName = path.basename(filePath);
        filePath = path.dirname(filePath).replace(env.buildPath, "");
        return path.join(env.buildPath, filePath.replace(/_/g, "")) + env.ds + fileName;
    };

    task.cleanTestPath = function (path) {
        path = path.replace(env.testPath, "");
        return env.testPath + path.replace(/_/g, "");
    };

    task.dirExists = function (path) {
        return grunt.file.isDir(path);
    };

    task.expand = function (filePath) {
        return grunt.file.expand(filePath);
    };

    task.fileExists = function (filePath) {
        return grunt.file.exists(filePath);
    };

    task.getAppParams = function (appName, taskName) {
        return task.appConfig[taskName] || {};
    };

    task.getCdnVer = function () {
        var hasConfig = task.appConfig.cdn && task.appConfig.cdn.cdnVer;
        return hasConfig ? task.appConfig.cdn.cdnVer : env.defCdnVer;
    };

    task.getParams = function (appName, taskName) {
        var defParams = task.getDefParams(appName),
            appParams = task.getAppParams(appName, taskName);
        return extend(defParams, appParams);
    };

    task.getSrcList = function (getPath) {
        var src = [],
            targets = task.getTargets();

        targets.forEach(function (target) {
            src = src.concat(getPath(target));
        });

        return src;
    };

    task.getTargets = function () {
        var targets = task.gruntOption("targets");

        if (targets !== undefined) {
            targets = targets.split(",");
            targets.forEach(function (target, index) {
                targets[index] = "/" + target.trim() + "/**";
            });
        }
        else {
            targets = ["/**"];
        }

        return targets;
    };

    task.gruntOption = function (name) {
        return grunt.option(name);
    };

    task.log = function () {
        grunt.log.writeln.apply(grunt.log, arguments);
    };

    task.setAppConfig = function (config) {
        task.appConfig = config;
        return task;
    };

    return task;
};
