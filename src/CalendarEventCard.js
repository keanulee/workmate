var UI = require('ui');
var Util = require('Util');

var CalendarEventCard = function(event) {
  this.card = new UI.Card({
    title: event.summary,
    subtitle: event.location,
    // TODO: display in user friendly way
    body: JSON.stringify(event),
    scrollable: true
  });
  
  this.card.show();
};

module.exports = CalendarEventCard;
