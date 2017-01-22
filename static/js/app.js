var App = {
  run: function run() {
    var elmDiv = document.getElementById('elm-main')
    var elmApp = Elm.SeatServer.embed(elmDiv)
  }
};

module.exports = {
  App: App
};

