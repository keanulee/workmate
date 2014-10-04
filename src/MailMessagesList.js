var UI = require('ui');
var Util = require('Util');
var MailMessageCard = require('MailMessageCard');

var MailMessagesList = function(thread) {
  var subject = Util.getMessageHeader(thread.messages[0], 'Subject');

  this.items = thread.messages.map(function(message) {
    var from = Util.getMessageFromHeader(message);
    
    return {
      title:  Util.trimLine(from),
      subtitle:  Util.trimLine(Util.decodeHTML(message.snippet)),
      message: message
    };
  });

  this.menu = new UI.Menu({
    sections: [{
      title: Util.trimLine(subject),
      items: this.items
    }]
  });

  this.menu.on('select', function(e) {
    var item = this.items[e.itemIndex];

    if (item) {
      new MailMessageCard(item.message);
    }
  }.bind(this));

  this.menu.show();
};

module.exports = MailMessagesList;
