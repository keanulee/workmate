var Settings = require('settings');
var ajax = require('ajax');

var GApi = {
  getAccessToken: function(callback) {
    var googleOauth = Settings.option('google_oauth');
    var now = new Date();
    var expiryDate = googleOauth['expiry_date'];
    
    if (expiryDate && now.valueOf() < expiryDate) {
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
          googleOauth['access_token'] = data['google_oauth']['access_token'];
          googleOauth['expiry_date'] = now.valueOf() + (data['google_oauth']['expires_in'] * 1000);
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
