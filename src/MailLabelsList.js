var UI = require('ui');
var ajax = require('ajax');
var GApi = require('GApi');
var Util = require('Util');
var MailThreadsList = require('MailThreadsList');

var MailLabelsList = function() {
  GApi.getAccessToken(function(accessToken) {
    var url = 'https://www.googleapis.com/gmail/v1/users/me/labels?access_token=' +
      encodeURIComponent(accessToken);
    
    ajax({
      url: url,
      type: 'json'
    }, function(data) {
      this.sections = [{
        items: [{
          title: 'All Mail',
          label: null
        }]
      },{
        title: 'Labels',
        items: data.labels.map(function(label) {
          return {
            title: Util.trimLine(label.name),
            label: label
          };
        })
      }];
  
      this.menu = new UI.Menu({
        sections: this.sections
      });
      this.menu.on('select', function(e) {
        var item = this.sections[e.sectionIndex].items[e.itemIndex];
        
        if (item) {
          new MailThreadsList(item.label);
        }
      }.bind(this));
      this.menu.show();
    }.bind(this), function(error) {
      console.log('The ajax request failed: ' + error);
    }); 
  });
};

module.exports = MailLabelsList;
