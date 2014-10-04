var UI = require('ui');
var Util = require('Util');
var MailMessageCard = require('MailMessageCard');

var MailMessagesList = function(thread) {
  if (thread.messages.length === 1) {
    new MailMessageCard(thread.messages[0]);
  } else {
    var subject = Util.getMessageHeader(thread.messages[0], 'Subject');
  
    this.sections = [{
      title: Util.trimLine(subject),
      items: thread.messages.map(function(message) {
        var from = Util.getMessageFromHeader(message);
        
        return {
          title:  Util.trimLine(from),
          subtitle:  Util.trimLine(Util.decodeHTML(message.snippet)),
          message: message
        };
      })
    }];
  
    this.menu = new UI.Menu({
      sections: this.sections
    });
  
    this.menu.on('select', function(e) {
      var message = this.sections[e.sectionIndex].items[e.itemIndex].message;
      new MailMessageCard(message);
    }.bind(this));
  
    this.menu.show();
  }
};

module.exports = MailMessagesList;
