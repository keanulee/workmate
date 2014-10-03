var UI = require('ui');
var CalendarsList = require('CalendarsList');

var MainMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Mail'
      }, {
        title: 'Calendar'
      }]
    }]
  });
  this.menu.on('select', function(e) {
    switch (e.itemIndex) {
      case 0:
        console.log('MailLabelsList not implemented yet!');
        break;
      case 1:
        new CalendarsList();
        break;
    }
  });
  this.menu.show();
};

module.exports = MainMenu;
