var UI = require('ui');
var Util = require('Util');

/**
 * TODOs:
 * - Better start/end time display
 * - Show/modify Yes/Maybe/No responses
 */
var CalendarEventCard = function(event) {
  var body;
  
  if (event.start.date) {
    // All-day event
    body = event.start.date;
    if (event.end.date !== event.start.date) {
      body += ' to ' + event.end.date;
    }
  } else {
    var startTime = new Date(event.start.dateTime);
    var endTime = new Date(event.end.dateTime);
    
    body = startTime.toString() + ' to ' + endTime.toString();
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
