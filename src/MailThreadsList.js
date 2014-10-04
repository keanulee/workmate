var UI = require('ui');
var Util = require('Util');
var Gmail = require('Gmail');
var MailMessagesList = require('MailMessagesList');
var MailActionsList = require('MailActionsList');

var MailThreadsList = function(label) {
  this.label = label;
  this.threads = null;

  this.createMenu();

  var labelId = this.label ? this.label.id : null;
  Gmail.Threads.list(labelId, function(data) {
    this.threads = data.threads || [];
    this.updateMenu();
  }.bind(this));
};

MailThreadsList.prototype.createMenu = function() {
  var title = 'All Mail';
  if (this.label) {
    title = Util.getFriendlyLabelName(this.label);
  }

  this.menu = new UI.Menu({
    sections: [{
      title: Util.trimLine(title),
      items: [{
        title: 'Loading...'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    var thread = e.item.thread;
    if (thread) new MailMessagesList(thread, this);
  }.bind(this));

  this.menu.on('longSelect', function(e) {
    var thread = e.item.thread;
    if (thread) new MailActionsList(thread.messages[0], this);
  }.bind(this));

  this.menu.show();
};

MailThreadsList.prototype.updateMenu = function() {
  if (this.threads.length) {
    this.menu.items(0, this.threads.map(function(thread) {
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
    }));
  } else {
    this.menu.items(0, [{
      title: '(No Threads)'
    }]);
  }
};

MailThreadsList.prototype.updateThread = function(thread) {
  for (var i = 0; i < thread.messages.length; i++) {
    if (thread.messages[i].labelIds.indexOf(this.label.id) !== -1) {
      return;
    }
  }
  
  // Remove thread from the threads list if none of messages contain that label.
  var index = this.threads.indexOf(thread);
  this.threads.splice(index, 1);
  this.updateMenu();
};

module.exports = MailThreadsList;
