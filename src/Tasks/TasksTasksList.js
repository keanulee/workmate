var UI = require('ui');
var Util = require('Util');
var Tasks = require('Tasks');
var TasksTaskCard = require('TasksTaskCard');
var TasksActionsList = require('TasksActionsList');

var TasksTasksList = function(tasklist) {
  this.tasklist = tasklist;
  this.createMenu();
  Tasks.Tasks.list(tasklist.id, function(data) {
    this.tasks = data.items || [];
    this.updateMenu();
  }.bind(this), function() {
    this.menu.hide();
  }.bind(this));

  Util.sendGAEvent('tasks', 'tasks-list');
};

TasksTasksList.prototype.createMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      title: Util.trimLine(this.tasklist.title),
      items: [{
        title: 'Loading...',
        icon: 'images/refresh.png'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    var task = e.item.task;
    if (task) {
      this.menu.item(e.sectionIndex, e.itemIndex, {
        title: Util.trimLine(task.title),
        icon: 'images/refresh.png'
      });

      var newStatus = task.status === 'needsAction' ? 'completed' : 'needsAction';
      Tasks.Tasks.update({
        id: task.id,
        selfLink: task.selfLink,
        status: newStatus
      }, function(data) {
        task.status = newStatus;
        this.updateMenu();
      }.bind(this), function() {
        this.updateMenu();
      }.bind(this));
      
      Util.sendGAEvent('tasks', 'tasks-modify');
    }
  }.bind(this));

  this.menu.on('longSelect', function(e) {
    var task = e.item.task;
    if (task) new TasksTaskCard(task, this);
  }.bind(this));

  this.menu.show();
};

TasksTasksList.prototype.updateMenu = function() {
  var filteredTasks = this.tasks.filter(function(task) {
    return !!task.title;
  });
  
  if (filteredTasks.length) {
    this.menu.items(0, filteredTasks.map(function(task) {
      return {
        title: Util.trimLine(task.title),
        icon: task.status === 'completed' ? 'images/check.png' : 'images/uncheck.png',
        task: task
      };
    }));
  } else {
    this.menu.items(0, [{
      title: '(No Tasks)'
    }]);
  }
};

TasksTasksList.prototype.removeTask = function(task) {
  var index = this.tasks.indexOf(task);
  this.tasks.splice(index, 1);
  this.updateMenu();
};

module.exports = TasksTasksList;
