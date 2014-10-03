var UI = require('ui');
var ajax = require('ajax');
var GApi = require('GApi');
var Util = require('Util');
var CalendarEventCard = require('CalendarEventCard');

var CalendarEventsList = function(calendarId) {
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
    }, function(data) {
      this.sections = [];
      var section = {
        title: 'Today',
        items: []
      };
      var sectionDate = Util.formatDate(now);
      data.items.forEach(function(event) {
        var item = {
          title: event.summary,
          event: event
        };
        var itemDate;
        
        if (event.start.date) {
          // All-day event
          // TODO: put multiple all-day events into multiple date sections.
          itemDate = Util.formatDate(new Date(event.start.date));
        } else {
          var startTime = new Date(event.start.dateTime);
          var endTime = new Date(event.end.dateTime);
          itemDate = Util.formatDate(startTime);
          item.subtitle = Util.formatTime(startTime) + '-' + Util.formatTime(endTime);
        }
  
        // TODO: handle events that started before today (appears above the 'Today' section).
        if (itemDate === sectionDate) {
          section.items.push(item);
        } else {
          this.sections.push(section);
          sectionDate = itemDate;
          section = {
            title: sectionDate,
            items: [item]
          };
        }
      });
      this.sections.push(section);
  
      this.menu = new UI.Menu({
        sections: this.sections
      });
      this.menu.on('select', function(e) {
        new CalendarEventCard(this.sections[e.sectionIndex].items[e.itemIndex].event);
      }.bind(this));
      this.menu.show();
    }.bind(this), function(error) {
      console.log('The ajax request failed: ' + error);
    });
  });
};

module.exports = CalendarEventsList;
