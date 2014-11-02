var UI = require('ui');
var Util = require('Util');
var Tasks = require('Tasks');
var TasksTasksList = require('TasksTasksList');

var TasksTasklistsList = function() {
  this.createMenu();
  Tasks.Tasklists.list(function(data) {
    this.tasklists = data.items || [];
    if (this.tasklists.length === 1) {
      new TasksTasksList(this.tasklists[0]);
      this.menu.hide();
    } else {
      this.updateMenu();
    }
  }.bind(this), function() {
    this.menu.hide();
  }.bind(this));

  Util.sendGAEvent('tasks', 'tasklists-list');
};

TasksTasklistsList.prototype.createMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      title: 'Task Lists',
      items: [{
        title: 'Loading...',
        icon: 'images/refresh.png'
      }]
    }]
  });

  this.menu.on('select', function(e) {
    var tasklist = e.item.tasklist;
    if (tasklist) new TasksTasksList(tasklist);
  }.bind(this));

  this.menu.show();
};

TasksTasklistsList.prototype.updateMenu = function() {
  this.menu.items(0, this.tasklists.map(function(tasklist) {
    return {
      title: Util.trimLine(tasklist.title),
      tasklist: tasklist
    };
  }));
};

module.exports = TasksTasklistsList;
