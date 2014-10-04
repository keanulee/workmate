var UI = require('ui');
var ajax = require('ajax');
var GApi = require('GApi');
var Util = require('Util');
var CalendarEventsList = require('CalendarEventsList');

var CalendarsList = function() {
  GApi.getAccessToken(function(accessToken) {
    var url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=' +
      encodeURIComponent(accessToken);
    
    ajax({
      url: url,
      type: 'json'
    }, function(data) {
      this.calendars = data.items;
  
      var items = this.calendars.map(function(item) {
        return {
          title: Util.trimLine(item.summary)
        };
      });
  
      this.menu = new UI.Menu({
        sections: [{
          title: 'Calendars',
          items: items
        }]
      });
      this.menu.on('select', function(e) {
        var calendar = this.calendars[e.itemIndex];
        
        if (calendar) {
          new CalendarEventsList(calendar.id);
        }
      }.bind(this));
      this.menu.show();
    }.bind(this), function(error) {
      console.log('The ajax request failed: ' + error);
    }); 
  });
};

module.exports = CalendarsList;
