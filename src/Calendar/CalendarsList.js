var UI = require('ui');
var Util = require('Util');
var Calendar = require('Calendar');
var CalendarEventsList = require('CalendarEventsList');

var CalendarsList = function() {
  this.createMenu();
  Calendar.CalendarList.list(function(data) {
    this.calendars = data.items || [];
    this.updateMenu();
  }.bind(this), function() {
    this.menu.hide();
  }.bind(this));

  Util.sendGAEvent('calendar', 'calendars-list');
};

CalendarsList.prototype.createMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      title: 'Calendars',
      items: [{
        title: 'Loading...',
        icon: 'images/refresh.png'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    var calendar = e.item.calendar;
    if (calendar) new CalendarEventsList(calendar);
  }.bind(this));

  this.menu.show();
};

CalendarsList.prototype.updateMenu = function() {
  this.menu.items(0, this.calendars.map(function(calendar) {
    return {
      title: Util.trimLine(calendar.summary),
      calendar: calendar
    };
  }));
};

module.exports = CalendarsList;
