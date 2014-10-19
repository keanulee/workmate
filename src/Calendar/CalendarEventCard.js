var UI = require('ui');
var Util = require('Util');

/**
 * TODOs:
 * - Show/modify Yes/Maybe/No responses
 */
var CalendarEventCard = function(event) {
  var body;
  
  if (Util.isAllDayEvent(event)) {
    var startDateString = Util.formatDate(new Date(event.start.date));
    var endDateString = Util.formatDate(new Date(event.end.date));
    body = startDateString;
    if (startDateString !== endDateString) {
      body += ' to\n' + endDateString;
    }
  } else {
    var startDate = new Date(event.start.dateTime);
    var endDate = new Date(event.end.dateTime);
    var startDateString = Util.formatDate(startDate);
    var endDateString = Util.formatDate(endDate);

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
