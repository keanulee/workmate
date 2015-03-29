var UI = require('ui');
var Util = require('Util');
var MailLabelsList = require('Mail/MailLabelsList');
var CalendarsList = require('Calendar/CalendarsList');
var TasksTasklistsList = require('Tasks/TasksTasklistsList');

var MainMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Mail',
        icon: 'images/envelope.png'
      }, {
        title: 'Calendar',
        icon: 'images/calendar.png'
      }, {
        title: 'Tasks',
        icon: 'images/pushpin.png'
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

  Util.sendGAEvent('main-menu', 'app-launch');
};

module.exports = MainMenu;
