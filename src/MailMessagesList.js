var UI = require('ui');
var Util = require('Util');
var MailMessageCard = require('MailMessageCard');
var MailActionsList = require('MailActionsList');

var MailMessagesList = function(thread, threadsList) {
  if (thread.messages.length === 1) {
    new MailMessageCard(thread.messages[0], threadsList);
  } else {
    var subject = Util.getMessageSubjectHeader(thread.messages[0]);
  
    this.menu = new UI.Menu({
      sections: [{
        title: Util.trimLine(subject),
        items: thread.messages.map(function(message) {
          var from = Util.getMessageFromHeader(message);

          return {
            title:  Util.trimLine(from),
            subtitle:  Util.trimLine(Util.decodeHTML(message.snippet)),
            message: message
          };
        })
      }]
    });
  
    this.menu.on('select', function(e) {
      var message = e.item.message;
      if (message) new MailMessageCard(message, threadsList, this);
    }.bind(this));
      
    this.menu.on('longSelect', function(e) {
      var message = e.item.message;
      if (message) new MailActionsList(message, threadsList, this);
    }.bind(this));
  
    this.menu.show();
  }
};

module.exports = MailMessagesList;
