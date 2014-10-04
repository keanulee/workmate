var UI = require('ui');
var Util = require('Util');
// var MailMessageCard = require('MailMessageCard');

var MailMessageCard = function(message) {
  this.card = new UI.Card({
    title: Util.getMessageFromHeader(message),
    subtitle: Util.getMessageSubjectHeader(message),
    body: Util.decodeHTML(message.snippet),
    scrollable: true
  });
  
  this.card.show();
};

module.exports = MailMessageCard;
