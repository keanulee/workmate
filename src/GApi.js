var Settings = require('settings');
var ajax = require('ajax');

var GApi = {
  getAccessToken: function(callback) {
    var googleOauth = Settings.option('google_oauth');
    var now = new Date();
    var expiry = (googleOauth['created'] + googleOauth['expires_in']) * 1000;
    
    if (now.valueOf() < expiry) {
      callback(googleOauth['access_token']);
    } else {
      var refreshToken = googleOauth['refresh_token'];
      var url = 'https://keanulee.com/g/configure/google_oauth.php?refresh_token=' +
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
          console.log('Error while refreshing google tokens');
        }
      }, function(error) {
        console.log('The ajax request failed: ' + error);
      }); 
    }
  }
};

module.exports = GApi;
