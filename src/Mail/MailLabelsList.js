var UI = require('ui');
var Util = require('Util');
var Gmail = require('Gmail');
var MailThreadsList = require('MailThreadsList');

var MailLabelsList = function() {
  this.createMenu();

  Gmail.Labels.list(function(data) {
    this.labels = data.labels || [];
    this.updateMenu();
  }.bind(this), function() {
    this.menu.hide();
  }.bind(this));

  Util.sendGAEvent('mail', 'mail-labels-list');
};

MailLabelsList.prototype.createMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      title: 'Mail',
      items: [{
        title: 'Loading...',
        icon: 'images/refresh.png'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    var label = e.item.label;
    if (label) new MailThreadsList(label);
  }.bind(this));

  this.menu.show();
};

MailLabelsList.prototype.updateMenu = function() {
  var systemItems = [];
  var categoryItems = [];
  var labelItems = [];
  this.labels.forEach(function(label) {
    if (label.type === 'system') {
      var match = /^CATEGORY_(.*)$/.exec(label.id);
      if (match) {
        categoryItems.push({
          title: Util.capitalize(Util.trimLine(match[1])),
          label: label
        });
      } else {
        systemItems.push({
          title: Util.capitalize(Util.trimLine(label.name)),
          label: label
        });
      }
    } else if (label.type === 'user') {
      labelItems.push({
        title: Util.trimLine(label.name),
        label: label
      });
    }
  });
  systemItems.sort(Util.systemLabelSortComparator);
  systemItems.push({
    title: 'All Mail',
    label: {
      name: 'All Mail',
      id: null
    }
  });

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

module.exports = MailLabelsList;
