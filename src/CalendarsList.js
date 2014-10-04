var UI = require('ui');
var Util = require('Util');
var Calendar = require('Calendar');
var CalendarEventsList = require('CalendarEventsList');

var CalendarsList = function() {
  Calendar.CalendarList.list(function(data) {
    this.sections = [{
      title: 'Calendars',
      items: data.items.map(function(calendar) {
        return {
          title: Util.trimLine(calendar.summary),
          calendar: calendar
        };
      })
    }];

    this.menu = new UI.Menu({
      sections: this.sections
    });

    this.menu.on('select', function(e) {
      var calendar = this.sections[e.sectionIndex].items[e.itemIndex].calendar;
      new CalendarEventsList(calendar);
    }.bind(this));

    this.menu.show();
  }.bind(this));
};

module.exports = CalendarsList;
