var ajax = require('ajax');
var GApi = require('GApi');
var ErrorCard = require('ErrorCard');

var Calendar = {
  CalendarList: {
    listCache_: null,

    list: function(callback, errorCallback) {
      if (this.listCache_) {
        callback(this.listCache_);
        return;
      }

      GApi.getAccessToken(function(accessToken) {
        var url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=' +
          encodeURIComponent(accessToken);
        
        ajax({
          url: url,
          type: 'json'
        }, function(data) {
          this.listCache_ = data;
          callback(data);
        }.bind(this), function(error) {
          new ErrorCard('Could not get calendars list');
          if (errorCallback) errorCallback();
        }); 
      }.bind(this), errorCallback);
    }
  },
  
  Calendars: {
    list: function(calendarId, callback, errorCallback) {
      GApi.getAccessToken(function(accessToken) {
        var now = new Date();
        var url = 'https://www.googleapis.com/calendar/v3/calendars/' +
            encodeURIComponent(calendarId) +
            '/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=' +
            encodeURIComponent(now.toISOString()) + '&access_token=' +
            encodeURIComponent(accessToken);
      
        ajax({
          url: url,
          type: 'json'
        }, callback, function(error) {
          new ErrorCard('Could not get calendar events');
          if (errorCallback) errorCallback();
        });
      }, errorCallback);
    }
  }
};

module.exports = Calendar;
