var UI = require('ui');
var Util = require('Util');

var CalendarEventCard = function(event) {
  var body, startDate, endDate, startDateString, endDateString;
  
  if (Util.isAllDayEvent(event)) {
    startDate = Util.parseDate(event.start.date);
    endDate = Util.parseDate(event.end.date);
    
    // The end date of all-day events is always the next date (when the event is no longer
    // taking place), so set it back one day.
    endDate.setDate(endDate.getDate() - 1);

    startDateString = Util.formatDate(startDate);
    endDateString = Util.formatDate(endDate);
    body = startDateString;
    if (startDateString !== endDateString) {
      body += ' to\n' + endDateString;
    }
  } else {
    startDate = new Date(event.start.dateTime);
    endDate = new Date(event.end.dateTime);
    startDateString = Util.formatDate(startDate);
    endDateString = Util.formatDate(endDate);

    body = startDateString;
    if (startDateString === endDateString) {
      body += '\n' + Util.formatTime(startDate) + ' to ' + Util.formatTime(endDate);
    } else {
      body += ' ' + Util.formatTime(startDate) + ' to\n' + endDateString + ' ' + Util.formatTime(endDate); 
    }
  }
  
  if (event.description) {
    body += '\n\n' + event.description;
  }

  this.card = new UI.Card({
    title: event.summary,
    subtitle: event.location,
    body: body,
    scrollable: true
  });
  
  this.card.show();
};

module.exports = CalendarEventCard;
