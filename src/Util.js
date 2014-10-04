var Util = {
  // '19:00'
  formatTime: function(date) {
    return date.toTimeString().substring(0, 5);
  },
  
  // '1992-05-17'
  formatDate: function(date) {
    return date.toISOString().substring(0, 10);
  },
  
  trimLine: function(str) {
    return str.substring(0, 30);
  },
  
  getMessageHeader: function(message, headerName) {
    var headers = message.payload.headers;
    for (var i = 0; i < headers.length; i++) {
      if (headers[i].name === headerName) {
        return headers[i].value;
      }
    }
    return '';
  },
  
  getMessageFromHeader: function(message) {
    var from = this.getMessageHeader(message, 'From');
    var bracketIndex = from.indexOf('<');

    // If the only thing in the from header is '<email>', keep it.
    if (bracketIndex > 0) {
      return from.substring(0, bracketIndex).trim();
    } else {
      return from;
    }
  },
  
  getMessageSubjectHeader: function(message) {
    return this.getMessageHeader(message, 'Subject') || '(no subject)';
  },
  
  // Decodes html text from html entities and tags
  // Credit: https://gist.github.com/CatTail/4174511
  decodeHTML: function(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, "").replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
}
};

module.exports = Util
