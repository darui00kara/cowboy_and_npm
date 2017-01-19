var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , expect = chai.expect;

chai.use(sinonChai);

var ElmCompiler = require('../index');

describe('ElmCompiler', function (){
  var elmCompiler, baseConfig = {
        paths: {
          public: 'test/public/folder'
        },
        plugins: {
          elmBrunch: {}
        }
      };

  describe('compiling Elm', function () {
    var childProcess = require('child_process')
      , exec
      , config
      , file
      , expectedCommand;

    beforeEach(function () {
      exec = sinon.stub(childProcess, 'exec');

      config = JSON.parse(JSON.stringify(baseConfig));
      config.plugins.elmBrunch.mainModules = ['Main.elm'];
      config.plugins.elmBrunch.elmFolder   = 'test/elm/folder';

      expectedCommand = 'elm make --yes --output test/public/folder/main.js Main.elm';
    });

    afterEach(function () {
      exec.restore();
    });

    describe('working directory', function () {
      describe('when the elmFolder config option has not been set', function () {
        beforeEach(function () {
          delete config.plugins.elmBrunch['elmFolder'];
          elmCompiler = new ElmCompiler(config);
        });

        it('uses the file dirname', function () {
          file = {path: 'path/to/Main.elm'};
          elmCompiler.compile(file);
          var expectedCwd     = 'path/to';
          expect(childProcess.exec).to.have.been.calledWith(expectedCommand, {cwd: expectedCwd});
        });
      });

      describe('when the elmFolder config option has been set', function () {
        beforeEach(function () {
          config.plugins.elmBrunch.elmFolder = 'test/elm/folder';
          elmCompiler = new ElmCompiler(config);
        });

        it('uses the specified elm folder if the file has no dirname', function () {
          file = {path: 'Main.elm'};
          elmCompiler.compile(file);
          expectedCwd     = 'test/elm/folder'
          expect(childProcess.exec).to.have.been.calledWith(expectedCommand, {cwd: expectedCwd});
        });

        it('prepends the specified elm folder if the file has a dirname', function () {
          file = {path: 'path/to/Main.elm'};
          elmCompiler.compile(file);
          expectedCwd     = 'test/elm/folder/path/to'
          expect(childProcess.exec).to.have.been.calledWith(expectedCommand, {cwd: expectedCwd});
        });

        it('does not prepend the specified folder if the file has a dirname that starts with the elmFolder', function () {
          file = {path: 'test/elm/folder/Main.elm'}
          elmCompiler.compile(file);
          expectedCwd     = 'test/elm/folder'
          expect(childProcess.exec).to.have.been.calledWith(expectedCommand, {cwd: expectedCwd});
        });
      });
    })

    describe('files to compile', function () {
      describe('when no mainModules are specified', function () {
        beforeEach(function () {
          config = JSON.parse(JSON.stringify(config));
          delete config.plugins.elmBrunch.mainModules;
          elmCompiler = new ElmCompiler(config);
          expectedCwd = 'test/elm/folder';
        });

        it('should compile the given file', function () {
          file = {path: 'Main.elm'}
          elmCompiler.compile(file);
          expect(childProcess.exec).to.have.been.calledWith(expectedCommand, {cwd: expectedCwd});
        });
      });

      describe('when one mainModule is specified', function () {
        beforeEach(function () {
          config.plugins.elmBrunch.mainModules = ['Main.elm'];
          elmCompiler = new ElmCompiler(config);
          file = {path: 'NotMain.elm'};
          elmCompiler.compile(file);
        });

        it('should not compile the given file if it is not in mainModules', function () {
          unexpectedCommand = 'elm make --yes --output test/public/folder/notmain.js NotMain.elm';
          expect(childProcess.exec).to.not.have.been.calledWith(unexpectedCommand, {cwd: expectedCwd});
        });

        it('it should compile the specified mainModule file', function () {
          expect(childProcess.exec).to.have.been.calledWith(expectedCommand, {cwd: expectedCwd});
        });
      });

      describe('when more than one mainModule is specified', function () {
        beforeEach(function () {
          config.plugins.elmBrunch.mainModules = ['Main.elm', 'OtherMain.elm'];
          elmCompiler = new ElmCompiler(config);
          file = {path: 'NotMain.elm'};
          elmCompiler.compile(file);
        });

        it('should not compile the given file if it is not in mainModules', function () {
          unexpectedCommand = 'elm make --yes --output test/public/folder/notmain.js NotMain.elm';
          expect(childProcess.exec).to.not.have.been.calledWith(unexpectedCommand, {cwd: expectedCwd});
        });

        it('it should compile all the specified mainModule files', function () {
          var expectedCommands = [
            'elm make --yes --output test/public/folder/main.js Main.elm',
            'elm make --yes --output test/public/folder/othermain.js OtherMain.elm'
          ];
          expect(childProcess.exec).to.have.been.calledWith(expectedCommands[0], {cwd: expectedCwd});
          expect(childProcess.exec).to.have.been.calledWith(expectedCommands[1], {cwd: expectedCwd});
        });
      });
    });

    describe('output folder', function () {
      describe('when an outputFolder is not specified', function () {
        beforeEach(function () {
          delete config.plugins.elmBrunch['outputFolder'];
          elmCompiler = new ElmCompiler(config);
          file = {path: 'Main.elm'};
          elmCompiler.compile(file);
        });

        it('defaults to the public js folder', function () {
          var expectedCwd = 'test/elm/folder';
          expect(childProcess.exec).to.have.been.calledWith(expectedCommand, {cwd: expectedCwd});
        });
      });

      describe('when an outputFolder is specified', function () {
        beforeEach(function () {
          config.plugins.elmBrunch.outputFolder = 'specified/public/folder';
          elmCompiler = new ElmCompiler(config);
          file = {path: 'Main.elm'};
          elmCompiler.compile(file);
        });

        it('uses the specified outputFolder', function () {
          expectedCommand = 'elm make --yes --output specified/public/folder/main.js Main.elm';
          var expectedCwd = 'test/elm/folder';
          expect(childProcess.exec).to.have.been.calledWith(expectedCommand, {cwd: expectedCwd});
        });
      });
    });
  });
});
