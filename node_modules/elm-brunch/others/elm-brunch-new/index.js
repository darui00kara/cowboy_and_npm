'use strict';

var path = require('path');

// Documentation for Brunch plugins:
// https://github.com/brunch/brunch/blob/master/docs/plugins.md

class ElmCompiler {
  constructor(config) {
    this.config = config && config.plugins && config.plugins.elmBrunch;
    this.defaultPublicFolder = config && config.paths && config.paths.public;
  }

  compile(file) {
    var childProcess = require('child_process')
      , elmFolder    = this._getElmFolder(file.path)
      , fileName     = path.basename(file.path)
      , mainModules  = this.config.mainModules || [fileName]
      , outputFolder = this._getOutputFolder();

    mainModules.forEach(function (moduleName) {
      var outputFile   = path.join(outputFolder, moduleName.toLowerCase().replace('elm', 'js'))
        , command      = 'elm make --yes --output ' + outputFile + ' ' + moduleName;

      childProcess.exec(command, {cwd: elmFolder}, function (error, stdout, stderr){
        console.log('Result:', error, stdout, stderr);
      });
    });

    return Promise.resolve(file);
  }

  _getElmFolder(filePath) {
    var elmFolder          = this.config.elmFolder || ''
      , normalisedFilePath = filePath.replace(new RegExp('^' + elmFolder + '[' + path.sep + ']?'), '');

    return path.join(elmFolder, path.dirname(normalisedFilePath));
  }

  _getOutputFolder() {
    var outputFolder = this.config.outputFolder;
    return outputFolder || this.defaultPublicFolder || ''
  }
}

ElmCompiler.prototype.brunchPlugin = true;
ElmCompiler.prototype.type = 'javascript';
ElmCompiler.prototype.extension = 'elm';

module.exports = ElmCompiler;
