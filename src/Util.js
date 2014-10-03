var Util = {
  // '19:00'
  formatTime: function(date) {
    return date.toTimeString().substring(0, 5);
  },
  
  // '1992-05-17'
  formatDate: function(date) {
    return date.toISOString().substring(0, 10);
  }
};

module.exports = Util
