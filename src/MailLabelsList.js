var UI = require('ui');
var Util = require('Util');
var Gmail = require('Gmail');
var MailThreadsList = require('MailThreadsList');

var MailLabelsList = function() {
  Gmail.Labels.list(function(data) {
    this.sections = [{
      items: [{
        title: 'All Mail',
        label: null
      }]
    },{
      title: 'Labels',
      items: data.labels.map(function(label) {
        return {
          title: Util.trimLine(label.name),
          label: label
        };
      })
    }];

    this.menu = new UI.Menu({
      sections: this.sections
    });

    this.menu.on('select', function(e) {
      var label = this.sections[e.sectionIndex].items[e.itemIndex].label;
      new MailThreadsList(label);
    }.bind(this));

    this.menu.show();
  }.bind(this));
};

module.exports = MailLabelsList;
