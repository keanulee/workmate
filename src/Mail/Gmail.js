var ajax = require('ajax');
var GApi = require('GApi');
var ErrorCard = require('ErrorCard');
var Util = require('Util');

var Gmail = {
  Labels: {
    listCache_: null,

    list: function(callback, errorCallback) {
      if (this.listCache_) {
        callback(this.listCache_);
        return;
      }

      GApi.getAccessToken(function(accessToken) {
        var url = 'https://www.googleapis.com/gmail/v1/users/me/labels?access_token=' +
          encodeURIComponent(accessToken);
        
        ajax({
          url: url,
          type: 'json'
        }, function(data) {
          this.listCache_ = data;
          callback(data);
        }.bind(this), function(error) {
          new ErrorCard('Could not get labels list');
          if (errorCallback) errorCallback();
        }); 
      }.bind(this), errorCallback);
    }
  },
  
  Threads: {
    list: function(labelId, callback, errorCallback) {
      GApi.getAccessToken(function(accessToken) {
        var url = 'https://www.googleapis.com/gmail/v1/users/me/threads?maxResults=20&access_token=' +
          encodeURIComponent(accessToken);
        if (labelId) url += '&labelIds=' + encodeURIComponent(labelId);
        
        // TODO: The normal threads.list request only returns IDs and not any user-visible strings,
        // so here we make a threads.get request for each of the returned threads, which is up to
        // 21 (1 + 20 maxResults) requests. In the future, use a backend that batches these requests
        // and only return the fields we need to minimize network traffic.
        ajax({
          url: url,
          type: 'json'
        }, function(data) {
          if (data.threads) {
            var numThreadsToCheck = data.threads.length;
      
            data.threads.forEach(function(thread) {
              var url = 'https://www.googleapis.com/gmail/v1/users/me/threads/' +
                thread.id + '?access_token=' +
                encodeURIComponent(accessToken);
              
              ajax({
                url: url,
                type: 'json'
              }, function(threadData) {
                for (var i = 0; i < data.threads.length; i++) {
                  if (data.threads[i].id === threadData.id) {
                    data.threads[i] = threadData;
                    
                    // Create a reference from each message back to the thread object.
                    data.threads[i].messages.forEach(function(message) {
                      message.thread = data.threads[i];
                    });

                    break;
                  }
                }
                
                numThreadsToCheck--;
                if (numThreadsToCheck <= 0) {
                  data.threads = data.threads.filter(function(thread) {
                    return !!thread.messages;
                  });
                  callback(data);
                }
              }, function(error) {
                numThreadsToCheck--;
                if (numThreadsToCheck <= 0) {
                  data.threads = data.threads.filter(function(thread) {
                    return !!thread.messages;
                  });
                  callback(data);
                }
              });
            });
          } else {
            callback(data);
          }
        }, function(error) {
          new ErrorCard('Could not get threads');
          if (errorCallback) errorCallback();
        }); 
      }, errorCallback);
    },

    modify: function(threadId, options, callback, errorCallback) {
      GApi.getAccessToken(function(accessToken) {
        var url = 'https://www.googleapis.com/gmail/v1/users/me/threads/' +
          threadId + '/modify?access_token=' +
          encodeURIComponent(accessToken);

        ajax({
          url: url,
          method: 'post',
          type: 'json',
          data: options
        }, callback, function(error) {
          new ErrorCard('Could not modify labels');
          if (errorCallback) errorCallback();
        }); 
      }, errorCallback);
    }
  },
  
  UNREAD_LABEL_ID: 'UNREAD'
};

module.exports = Gmail;
