var UI = require('ui');
var Util = require('Util');
var Calendar = require('Calendar');
var CalendarEventCard = require('CalendarEventCard');

var CalendarEventsList = function(calendar) {
  this.createMenu();

  Calendar.Calendars.list(calendar.id, function(data) {
    this.events = data.items || [];
    this.updateMenu();
  }.bind(this), function() {
    this.menu.hide();
  }.bind(this));

  Util.sendGAEvent('calendar', 'events-list');
};

CalendarEventsList.prototype.createMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      title: 'Today',
      items: [{
        title: 'Loading...',
        icon: 'images/refresh.png'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    var event = e.item.event;
    if (event) new CalendarEventCard(event);
  }.bind(this));

  this.menu.on('longSelect', function(e) {
    var event = e.item.event;
    if (event) new CalendarEventCard(event);
  }.bind(this));

  this.menu.show();
};

CalendarEventsList.prototype.updateMenu = function() {
  var now = new Date();
  var today = new Date(now.toDateString());
  var todayDateString = Util.formatDate(now);
  var tomorrowDateString = Util.formatDate(Util.getNextDate(now));

  var dateToEventsMap = {};
  dateToEventsMap[todayDateString] = [];

  function addEventToDate(event, date) {
    if (date >= today) {
      var dateString = Util.formatDate(date);
      dateToEventsMap[dateString] = dateToEventsMap[dateString] || [];
      dateToEventsMap[dateString].push(event);
    }
  }

  this.events.forEach(function(event) {
    var startDate, endDate;
    if (Util.isAllDayEvent(event)) {
      startDate = Util.parseDate(event.start.date);
      endDate = Util.parseDate(event.end.date);
    } else {
      startDate = new Date(event.start.dateTime);
      endDate = new Date(event.end.dateTime);
    }

    while (startDate < endDate) {
      addEventToDate(event, startDate);
      startDate = Util.getNextDate(startDate);
    }
  }.bind(this));
  
  var i = 0;
  for (var dateString in dateToEventsMap) {
    var dateEvents = dateToEventsMap[dateString];
    
    if (dateString === todayDateString) {
      dateString = 'Today';
    } else if (dateString === tomorrowDateString) {
      dateString = 'Tomorrow';
    }
    
    var items = dateEvents.map(function(event) {
      var item = {
        title: Util.trimLine(event.summary),
        event: event
      };

      if (!Util.isAllDayEvent(event)) {
        item.subtitle = Util.formatTime(new Date(event.start.dateTime)) +
          '-' + Util.formatTime(new Date(event.end.dateTime));
      }

      return item;
    });

    if (items.length === 0) {
      items.push({
        title: '(No events)'
      });
    }
    
    this.menu.section(i, {
      title: dateString,
      items: items
    });
    i++;
  }
};

module.exports = CalendarEventsList;
