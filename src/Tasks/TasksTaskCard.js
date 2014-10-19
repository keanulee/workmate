var UI = require('ui');
var Util = require('Util');
var TasksActionsList = require('TasksActionsList');

var TasksTaskCard = function(task, tasksList) {
  this.card = new UI.Card({
    title: task.title,
    body: task.notes,
    icon: task.status === 'completed' ? 'images/check.png' : 'images/uncheck.png',
    scrollable: true
  });
  
  this.card.on('click', 'select', function() {
    new TasksActionsList(task, tasksList, this);
  }.bind(this));
  
  this.card.on('longClick', 'select', function() {
    new TasksActionsList(task, tasksList, this);
  }.bind(this));
  
  this.card.show();
};

module.exports = TasksTaskCard;
