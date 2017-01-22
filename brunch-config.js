exports.config = {

  files: {
    javascripts: {
      joinTo: 'js/app.js'
    },

    stylesheets: {
      joinTo: "css/app.css",
      order: {
        after: ["static/css/app.scss"] // concat app.css last
      }
    }
  },

  conventions: {
    assets: /^(static\/assets)/
  },

  paths: {
    watched: [
      "static",
      "elm/SeatServer.elm"
    ],

    public: "priv/static"
  },

  plugins: {
    babel: {
      // Do not use ES6 compiler in vendor code
      ignore: [/static\/vendor/]
    },
    sass: {
      options: {
        includePaths: ["node_modules/bootstrap-sass/assets/stylesheets"],
        precision: 8
      }
    },
    copycat: {
      "fonts": ["node_modules/bootstrap-sass/assets/fonts/bootstrap"]
    },
    elmBrunch: {
      elmFolder: "elm",
      mainModules: ["SeatServer.elm"],
      outputFolder: "../static/vendor"
    }
  },

  modules: {
    autoRequire: {
      "app.js": ["static/js"]
    }
  },

  npm: {
    enabled: true,
    globals: {
      $: 'jquery',
      jQuery: 'jquery',
      bootstrap: 'bootstrap-sass'
    }
  }
}; 
