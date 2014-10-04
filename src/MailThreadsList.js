var UI = require('ui');
var Util = require('Util');
var Gmail = require('Gmail');
var MailMessagesList = require('MailMessagesList');

var MailThreadsList = function(label) {
  Gmail.Threads.list(label, function(data) {
    if (data.threads) {
      this.sections = [{
        title: label ? Util.trimLine(label.name) : 'All Mail',
        items: data.threads.map(function(thread) {
          // Reverse the messages so that the most recent messages appear on the top of the list.
          thread.messages.reverse();
      
          var people = thread.messages.map(function(message) {
            return Util.getMessageFromHeader(message);
          }).join(', ');
          var subject = Util.getMessageSubjectHeader(thread.messages[0]);
          return {
            title: Util.trimLine(people),
            subtitle: Util.trimLine(subject),
            thread: thread
          };
        })
      }];
    
      this.menu = new UI.Menu({
        sections: this.sections
      });
    
      this.menu.on('select', function(e) {
        var thread = this.sections[e.sectionIndex].items[e.itemIndex].thread;
        new MailMessagesList(thread);
      }.bind(this));
    
      this.menu.show();
    } else {
      this.menu = new UI.Menu({
        sections: [{
          items: [{
            subtitle: '(No Messages)'
          }]
        }]
      });
    
      this.menu.show();
    }
  }.bind(this));
};

module.exports = MailThreadsList;
