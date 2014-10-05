var UI = require('ui');
var Util = require('Util');
var Tasks = require('Tasks');
var TasksActionsList = require('TasksActionsList');

var TasksActionsList = function(task, tasksList, taskCard) {
  this.menu = new UI.Menu({
    sections: [{
      title: Util.trimLine(task.title),
      items: [{
        title: 'Complete',
        icon: task.status === 'completed' ? 'images/check.png' : null
      }, {
        title: 'Delete'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    switch (e.itemIndex) {
      case 0:
        task.status = task.status === 'needsAction' ? 'completed' : 'needsAction';
        Tasks.Tasks.update({
          id: task.id,
          selfLink: task.selfLink,
          status: task.status
        }, function(data) {
          if (taskCard) taskCard.card.hide();
          tasksList.updateMenu();
          this.menu.hide();
        }.bind(this));
        break;
      case 1:
        Tasks.Tasks.delete(task, function(data) {
          if (taskCard) taskCard.card.hide();
          tasksList.removeTask(task);
          this.menu.hide();
        }.bind(this));
        break;
    }
  }.bind(this));

  this.menu.show();
};

module.exports = TasksActionsList;
