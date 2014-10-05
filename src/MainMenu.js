var UI = require('ui');
var MailLabelsList = require('MailLabelsList');
var CalendarsList = require('CalendarsList');
var TasksTasklistsList = require('TasksTasklistsList');

var MainMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Mail',
        icon: 'images/menu_icon.png'
      }, {
        title: 'Calendar',
        icon: 'images/menu_icon.png'
      }, {
        title: 'Tasks',
        icon: 'images/menu_icon.png'
      }]
    }]
  });
  this.menu.on('select', function(e) {
    switch (e.itemIndex) {
      case 0:
        new MailLabelsList();
        break;
      case 1:
        new CalendarsList();
        break;
      case 2:
        new TasksTasklistsList();
        break;
    }
  });
  this.menu.show();
};

module.exports = MainMenu;
