var ajax = require('ajax');
var GApi = require('GApi');
var ErrorCard = require('ErrorCard');

var Tasks = {
  Tasklists: {
    listCache_: null,

    list: function(callback, errorCallback) {
      if (this.listCache_) {
        callback(this.listCache_);
        return;
      }

      GApi.getAccessToken(function(accessToken) {
        var url = 'https://www.googleapis.com/tasks/v1/users/@me/lists?access_token=' +
          encodeURIComponent(accessToken);
        
        ajax({
          url: url,
          type: 'json'
        }, function(data) {
          this.listCache_ = data;
          callback(data);
        }.bind(this), function(error) {
          new ErrorCard('Could not get task lists');
          if (errorCallback) errorCallback();
        }); 
      }.bind(this), errorCallback);
    }
  },
  
  Tasks: {
    list: function(tasklistId, callback, errorCallback) {
      GApi.getAccessToken(function(accessToken) {
        var url = 'https://www.googleapis.com/tasks/v1/lists/' +
            encodeURIComponent(tasklistId) +
            '/tasks?maxResults=10&access_token=' +
            encodeURIComponent(accessToken);
      
        ajax({
          url: url,
          type: 'json'
        }, callback, function(error) {
          new ErrorCard('Could not get tasks');
          if (errorCallback) errorCallback();
        });
      }, errorCallback);
    },
    
    update: function(task, callback, errorCallback) {
      GApi.getAccessToken(function(accessToken) {
        var url = task.selfLink + '?access_token=' +
            encodeURIComponent(accessToken);
      
        ajax({
          url: url,
          type: 'json',
          method: 'put',
          data: task
        }, callback, function(error) {
          new ErrorCard('Could not update task');
          if (errorCallback) errorCallback();
        });
      }, errorCallback);
    },
    
    'delete': function(task, callback, errorCallback) {
      GApi.getAccessToken(function(accessToken) {
        var url = task.selfLink + '?access_token=' +
            encodeURIComponent(accessToken);
      
        ajax({
          url: url,
          method: 'delete'
        }, callback, function(error) {
          new ErrorCard('Could not delete task');
          if (errorCallback) errorCallback();
        });
      }, errorCallback);
    }
  }
};

module.exports = Tasks;
