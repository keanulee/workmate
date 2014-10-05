var UI = require('ui');
var Util = require('Util');
var Gmail = require('Gmail');

var MailActionsList = function(message, threadsList, messagesList, messageCard) {
  this.message = message;
  this.threadsList = threadsList;
  this.messagesList = messagesList;
  this.messageCard = messageCard;
  
  this.createMenu();
  Gmail.Labels.list(function(data) {
    this.labels = data.labels;
    this.updateMenu();
  }.bind(this));
};

MailActionsList.prototype.createMenu = function() {
  var subject = Util.getMessageSubjectHeader(this.message);
  this.menu = new UI.Menu({
    sections: [{
      title: Util.trimLine(subject),
      items: [{
        title: 'Loading...'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    var label = e.item.label;
    if (label) {
      var hasLabel = this.message.labelIds.indexOf(label.id) !== -1;
  
      var options = {};
      if (hasLabel) {
        options.removeLabelIds = [label.id];
      } else {
        options.addLabelIds = [label.id];
      }
      
      this.menu.item(e.sectionIndex, e.itemIndex, {
        title: 'Loading...'
      });
  
      Gmail.Threads.modify(this.message.threadId, options, function(data) {
        if (this.messagesList) this.messagesList.menu.hide();
        if (this.messageCard) this.messageCard.card.hide();
  
        // Update the labelIds for all the messages in the thread.
        this.message.thread.messages.forEach(function(message) {
          for (var i = 0; i < data.messages.length; i++) {
            if (data.messages[i].id === message.id) {
              message.labelIds = data.messages[i].labelIds;
              break;
            }
          }
        });
        this.threadsList.updateThread(this.message.thread);
        this.menu.hide();
      }.bind(this));
    }
  }.bind(this));

  this.menu.show();
};

MailActionsList.prototype.updateMenu = function() {
  var systemItems = [];
  var categoryItems = [];
  var labelItems = [];
  this.labels.forEach(function(label) {
    var hasLabel = this.message.labelIds.indexOf(label.id) !== -1;
    if (label.type === 'system') {
      var match = /^CATEGORY_(.*)$/.exec(label.id);
      if (match) {
        categoryItems.push({
          title: Util.capitalize(Util.trimLine(match[1])),
          icon: hasLabel ? 'images/menu_icon.png' : null,
          label: label
        });
      } else if (this.canModifyLabel(label)) {
        systemItems.push({
          title: Util.capitalize(Util.trimLine(label.name)),
          icon: hasLabel ? 'images/menu_icon.png' : null,
          label: label
        });
      }
    } else if (label.type === 'user') {
      labelItems.push({
        title: Util.trimLine(label.name),
        icon: hasLabel ? 'images/menu_icon.png' : null,
        label: label
      });
    }
  }.bind(this));
  systemItems.sort(Util.systemLabelSortComparator);

  this.menu.items(0, systemItems);
  this.menu.section(1, {
    title: 'Categories',
    items: categoryItems
  });
  this.menu.section(2, {
    title: 'Labels',
    items: labelItems
  });
};

MailActionsList.prototype.canModifyLabel = function(label) {
  var unmodifiableLabels = {
    DRAFT: true,
    SENT: true
  };
  return !unmodifiableLabels[label.id];
};

module.exports = MailActionsList;
