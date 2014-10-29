var UI = require('ui');

var ErrorCard = function(subtitle, body) {
  this.card = new UI.Card({
    title: 'Error',
    icon: 'images/warning.png',
    subtitle: subtitle,
    body: body,
    scrollable: true
  });
  
  this.card.on('click', 'select', function() {
    this.card.hide();
  }.bind(this));
  
  this.card.on('longClick', 'select', function() {
    this.card.hide();
  }.bind(this));
  
  this.card.show();
};

module.exports = ErrorCard;
