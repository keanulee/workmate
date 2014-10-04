var UI = require('ui');
var ajax = require('ajax');
var GApi = require('GApi');
var Util = require('Util');
var MailMessageCard = require('MailMessageCard');
var MailMessagesList = require('MailMessagesList');

var MailThreadsList = function(label) {
  this.labelName = label ? label.name : 'All Mail';
  GApi.getAccessToken(function(accessToken) {
    var url = 'https://www.googleapis.com/gmail/v1/users/me/threads?maxResults=20&access_token=' +
      encodeURIComponent(accessToken);
    if (label) url += '&labelIds=' + encodeURIComponent(label.id);
    
    ajax({
      url: url,
      type: 'json'
    }, function(data) {
      this.threads = data.threads;
      if (this.threads) {
        this.numThreadsToCheck = data.threads.length;
  
        data.threads.forEach(function(thread) {
          var url = 'https://www.googleapis.com/gmail/v1/users/me/threads/' +
            thread.id + '?access_token=' +
            encodeURIComponent(accessToken);
          
          ajax({
            url: url,
            type: 'json'
          }, function(data) {
            for (var i = 0; i < this.threads.length; i++) {
              if (this.threads[i].id === data.id) {
                this.threads[i] = data;
                break;
              }
            }
            this.markThreadResponse();
          }.bind(this), function(error) {
            console.log('The ajax request failed: ' + error);
            this.markThreadResponse();
          }.bind(this));
          
        }.bind(this));
      } else {
        this.createEmptyMenu();
      }
    }.bind(this), function(error) {
      console.log('The ajax request failed: ' + error);
    }); 
  }.bind(this));
};

MailThreadsList.prototype.markThreadResponse = function() {
  this.numThreadsToCheck--;
  if (this.numThreadsToCheck === 0) this.createMenu();
};

MailThreadsList.prototype.createMenu = function() {
  this.items = this.threads.map(function(thread) {
    // Reverse the messages so that the most recent messages appear on the top of the list.
    thread.messages.reverse();

    var people = thread.messages.map(function(message) {
      return Util.getMessageFromHeader(message);
    }).join(', ');
    var subject = Util.getMessageSubjectHeader(thread.messages[0]);
    return {
      title: Util.trimLine(people),
      subtitle: Util.trimLine(subject),
      thread: thread
    };
  });

  this.menu = new UI.Menu({
    sections: [{
      title: Util.trimLine(this.labelName),
      items: this.items
    }]
  });

  this.menu.on('select', function(e) {
    var item = this.items[e.itemIndex];

    if (item) {
      if (item.thread.messages.length === 1) {
        new MailMessageCard(item.thread.messages[0]);
      } else {
        new MailMessagesList(item.thread);
      }
    }
  }.bind(this));

  this.menu.show();
};

MailThreadsList.prototype.createEmptyMenu = function() {
  this.menu = new UI.Menu({
    sections: [{
      items: [{
        subtitle: '(No Messages)'
      }]
    }]
  });

  this.menu.show();
};

module.exports = MailThreadsList;
