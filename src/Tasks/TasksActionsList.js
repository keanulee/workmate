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
        icon: task.status === 'completed' ? 'images/check.png' : 'images/uncheck.png'
      }, {
        title: 'Delete',
        icon: 'images/remove.png'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    this.menu.item(e.sectionIndex, e.itemIndex, {
      title: 'Loading...',
      icon: 'images/refresh.png'
    });

    switch (e.itemIndex) {
      case 0:
        var newStatus = task.status === 'needsAction' ? 'completed' : 'needsAction';
        Tasks.Tasks.update({
          id: task.id,
          selfLink: task.selfLink,
          status: newStatus
        }, function(data) {
          task.status = newStatus;
          if (taskCard) taskCard.card.hide();
          tasksList.updateMenu();
          this.menu.hide();
        }.bind(this), function() {
          this.menu.hide();
        }.bind(this));
        break;
      case 1:
        Tasks.Tasks.delete(task, function(data) {
          if (taskCard) taskCard.card.hide();
          tasksList.removeTask(task);
          this.menu.hide();
        }.bind(this), function() {
          this.menu.hide();
        }.bind(this));
        break;

      Util.sendGAEvent('tasks', 'tasks-modify');
    }
  }.bind(this));

  this.menu.show();

  Util.sendGAEvent('tasks', 'tasks-actions-list');
};

module.exports = TasksActionsList;
