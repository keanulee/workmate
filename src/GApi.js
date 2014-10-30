var Settings = require('settings');
var ajax = require('ajax');
var ErrorCard = require('ErrorCard');

var GApi = {
  getAccessToken: function(callback, errorCallback) {
    var googleOauth = Settings.option('google_oauth');
    if (googleOauth) {
      var now = new Date();
      var expiry = (googleOauth['created'] + googleOauth['expires_in']) * 1000;
      
      if (now.valueOf() < expiry) {
        callback(googleOauth['access_token']);
      } else {
        var refreshToken = googleOauth['refresh_token'];
        var url = 'https://legacy.keanulee.com/workmate/configure/google_oauth.php?refresh_token=' +
            encodeURIComponent(refreshToken);
        
        ajax({
          url: url,
          type: 'json'
        }, function(data) {
          if (data['google_oauth']) {
            for (var key in data['google_oauth']) {
              googleOauth[key] = data['google_oauth'][key];
            }
            Settings.option('google_oauth', googleOauth);
            callback(googleOauth['access_token']);
          } else {
            new ErrorCard('Could not refresh Google access token');
            if (errorCallback) errorCallback();
          }
        }, function(error) {
          new ErrorCard('Could not refresh Google access token');
          if (errorCallback) errorCallback();
        }); 
      }
    } else {
      new ErrorCard('Not signed in', 'Sign in using this app\'s settings on the Pebble app');
      if (errorCallback) errorCallback();
    }
  }
};

module.exports = GApi;
