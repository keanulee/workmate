var UI = require('ui');
var Util = require('Util');
var Gmail = require('Gmail');
var MailMessagesList = require('MailMessagesList');
var MailActionsList = require('MailActionsList');

var MailThreadsList = function(label) {
  this.label = label;
  this.threads = null;

  this.createMenu();

  Gmail.Threads.list(this.label.id, function(data) {
    this.threads = data.threads || [];
    this.updateMenu();
  }.bind(this), function() {
    this.menu.hide();
  }.bind(this));

  Util.sendGAEvent('mail', 'mail-threads-list');
};

MailThreadsList.prototype.createMenu = function() {
  var title = Util.getFriendlyLabelName(this.label);

  this.menu = new UI.Menu({
    sections: [{
      title: Util.trimLine(title),
      items: [{
        title: 'Loading...',
        icon: 'images/refresh.png'
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
      title: '(No Messages)'
    }]);
  }
};

MailThreadsList.prototype.updateThread = function(thread) {
  if (this.label.id) {
    for (var i = 0; i < thread.messages.length; i++) {
      if (thread.messages[i].labelIds.indexOf(this.label.id) !== -1) {
        return;
      }
    }
  } else {
    // Do not remove from 'All Mail' if at least one message in the thread is not spam and not
    // in the trash.
    var inAllMail = thread.messages.some(function(message) {
      return (message.labelIds.indexOf('SPAM') === -1) && (message.labelIds.indexOf('TRASH') === -1);
    });
    if (inAllMail) return;
  }
    
  // Remove thread from the threads list if none of messages contain that label.
  var index = this.threads.indexOf(thread);
  this.threads.splice(index, 1);
  this.updateMenu();
};

module.exports = MailThreadsList;
