var UI = require('ui');
var Util = require('Util');
var Calendar = require('Calendar');
var CalendarEventCard = require('CalendarEventCard');

var CalendarEventsList = function(calendar) {
  Calendar.Calendars.list(calendar, function(data) {
    this.sections = [];
    var section = {
      title: 'Today',
      items: []
    };
    var sectionDate = Util.formatDate(new Date());
    data.items.forEach(function(event) {
      var item = {
        title: Util.trimLine(event.summary),
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

      // TODO: handle events that started before today (appear above the 'Today' section).
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
    }.bind(this));
    this.sections.push(section);

    this.menu = new UI.Menu({
      sections: this.sections
    });
    this.menu.on('select', function(e) {
      var event = this.sections[e.sectionIndex].items[e.itemIndex].event;
      new CalendarEventCard(event);
    }.bind(this));
    this.menu.show();
  }.bind(this));
};

module.exports = CalendarEventsList;
