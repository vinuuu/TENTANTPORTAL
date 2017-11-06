/*
 * grunt-include-replace-more
 * https://github.com/stowball/grunt-include-replace-more
 *
 * Copyright (c) 2014 Matt Stow
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

	'use strict';

	var _ = grunt.util._;
	var path = require('path');

	grunt.registerMultiTask('includereplacemore', 'Include files and replace variables', function() {

		var options = this.options({
			prefix: '{{ ',
			suffix: ' }}',
			prefixIf: 'if ',
			suffixIf: 'endif',
			globals: {},
			includesDir: '',
			docroot: '.'
		});
		
		if (options.prefix.length === 0) {
			options.prefix = '{{ ';
		}
		
		if (options.suffix.length === 0) {
			options.suffix = ' }}';
		}
		
		if (options.prefixIf.length === 0) {
			options.prefixIf = 'if ';
		}
		
		if (options.suffixIf.length === 0) {
			options.suffixIf = 'endif';
		}
		
		grunt.log.debug('Options', options);

		function customVars(contents) {
			var variables = contents
							.replace(/(\n|\r)/g, '')
							.match(new RegExp(options.prefix + 'var\\s+(\\$.*?):\\s*?["|\\\'](.*?)["|\\\']\\s*?' + options.suffix, 'g'));
			var varLength = 0;
			
			if (variables) {
				varLength += variables.length;
			}
			
			if (varLength > 0) {
				for (var i = 0; i < varLength; i++) {
					contents = contents.replace(new RegExp(options.prefix + 'var\\s+(\\$.*?):\\s*?["|\\\'](.*?)["|\\\']\\s*?' + options.suffix + '[\\s\\S]*', 'm'), function(str2, p1, p2) {
						var $var = p1.replace(/\$/g, '\\$');
						return str2.replace(new RegExp($var, 'g'), p2);
					});
				}
			}
			
			return contents;
		}
		
		// Variables available in ALL files
		var globalVars = options.globals;

		// Names of our variables
		var globalVarNames = Object.keys(globalVars);

		globalVarNames.forEach(function(globalVarName) {
			if (_.isString(globalVars[globalVarName])) {
				globalVars[globalVarName] = globalVars[globalVarName];
			} else {
				globalVars[globalVarName] = JSON.stringify(globalVars[globalVarName]);
			}
		});

		// Cached variable regular expressions
		var globalVarRegExps = {};

		function replace(contents, localVars, ifBlock) {

			localVars = localVars || {};

			var varNames = Object.keys(localVars);
			var varRegExps = {};

			// Replace local vars
			varNames.forEach(function(varName) {

				var replaceStr;

				// Process lo-dash templates (for strings) in global variables and JSON.stringify the rest
				if (_.isString(localVars[varName])) {
					localVars[varName] = grunt.template.process(localVars[varName]);
				} else {
					localVars[varName] = JSON.stringify(localVars[varName]);
				}

				if (!ifBlock) {
					varRegExps[varName] = new RegExp(options.prefix + varName + options.suffix, 'g');
					
					replaceStr = localVars[varName];
				}
				else {
					if (_.isEmpty(localVars[varName]) || localVars[varName] === false || localVars[varName] === 'false') {
						replaceStr = '';
					}
					else {
						replaceStr = '$1';
					}
					
					varRegExps[varName] = new RegExp(options.prefix + options.prefixIf + varName + options.suffix + '([\\s\\S]*?)' + options.prefix + options.suffixIf + options.suffix, 'g');
				}
				
				contents = contents.replace(varRegExps[varName], replaceStr);
			});

			// Replace global variables
			globalVarNames.forEach(function(globalVarName) {

				var replaceStr;
				
				if (!ifBlock) {
					globalVarRegExps[globalVarName] = new RegExp(options.prefix + globalVarName + options.suffix, 'g');
					
					replaceStr = globalVars[globalVarName];
				}
				else {
					if (_.isEmpty(globalVars[globalVarName]) || globalVars[globalVarName] === false || globalVars[globalVarName] === 'false') {
						replaceStr = '';
					}
					else {
						replaceStr = '$1';
					}
					
					globalVarRegExps[globalVarName] = new RegExp(options.prefix + options.prefixIf + globalVarName + options.suffix + '([\\s\\S]*?)' + options.prefix + options.suffixIf + options.suffix, 'g');
				}
				
				contents = contents.replace(globalVarRegExps[globalVarName], replaceStr);
			});

			return contents;
		}
		
		function unusedVars(contents) {
			contents = contents.replace(new RegExp(options.prefix + options.prefixIf + '.*?' + options.suffix + '[\\s\\S]*?' + options.prefix + options.suffixIf + options.suffix, 'g'), '');
			return contents.replace(new RegExp(options.prefix + '.*?' + options.suffix, 'g'), '');
		}

		var includeRegExp = new RegExp(options.prefix + 'include\\(\\s*["\'](.*?)["\'](,\\s*({[\\s\\S]*?})){0,1}\\s*\\)' + options.suffix);

		function include(contents, workingDir) {

			var matches = includeRegExp.exec(contents);

			// Create a function that can be passed to String.replace as the second arg
			function createReplaceFn (replacement) {
				return function () {
					return replacement;
				};
			}

			while (matches) {

				var match = matches[0];
				var includePath = matches[1];
				var localVars = matches[3] ? JSON.parse(matches[3]) : {};

				if (!grunt.file.isPathAbsolute(includePath)) {
					includePath = path.resolve(path.join((options.includesDir ? options.includesDir : workingDir), includePath));
				} else {
					if (options.includesDir) {
						grunt.log.error('includesDir works only with relative paths. Could not apply includesDir to ' + includePath);
					}
					includePath = path.resolve(includePath);
				}

				var docroot = path.relative(path.dirname(includePath), path.resolve(options.docroot)).replace(/\\/g, '/');

				// Set docroot as local var but don't overwrite if the user has specified
				if (localVars.docroot === undefined) {
					localVars.docroot = docroot ? docroot + '/' : '';
				}
				
				localVars.includePath = includePath;

				grunt.log.debug('Including', includePath);
				grunt.log.debug('Locals', localVars);

				var includeContents = grunt.file.read(includePath);

				// Set up and replace custom variables
				includeContents = customVars(includeContents);
				
				// Make replacements
				includeContents = replace(includeContents, localVars, false);

				// Make if block replacements
				includeContents = replace(includeContents, localVars, true);

				// Process includes
				includeContents = include(includeContents, path.dirname(includePath));
				if (options.processIncludeContents && typeof options.processIncludeContents === 'function') {
					includeContents = options.processIncludeContents(includeContents, localVars);
				}

				contents = contents.replace(match, createReplaceFn(includeContents));

				matches = includeRegExp.exec(contents);
			}

			return unusedVars(contents);
		}

		this.files.forEach(function(config) {

			config.src.forEach(function(src) {

				grunt.log.debug('Processing glob ' + src);

				if (!grunt.file.isFile(src)) {
					return;
				}

				grunt.log.debug('Processing ' + src);

				// Read file
				var contents = grunt.file.read(src);

				var docroot = path.relative(path.dirname(src), path.resolve(options.docroot)).replace(/\\/g, '/');
				var localVars = {docroot: docroot ? docroot + '/' : ''};

				grunt.log.debug('Locals', localVars);
				
				// Set up and replace custom variables
				contents = customVars(contents);
				
				// Make replacements
				contents = replace(contents, localVars, false);

				// Make if block replacements
				contents = replace(contents, localVars, true);

				// Process includes
				contents = include(contents, path.dirname(src));
				
				// Remove unused variables
				contents = unusedVars(contents);

				//grunt.log.debug(contents);

				var dest = config.dest;

				if (isDirectory(dest) && !config.orig.cwd) {
					dest = path.join(dest, src);
				}

				grunt.log.debug('Saving to', dest);

				grunt.file.write(dest, contents);

				grunt.log.ok('Processed ' + src);
			});
		});
	});

	// Detect if destination path is a directory
	function isDirectory (dest) {
		return grunt.util._.endsWith(dest, '/');
	}
};


