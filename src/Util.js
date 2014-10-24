var Util = {
  // Properly converts YYYY-MM-DD to a Date object in the local timezone.
  // (Why? new Date('YYYY-MM-DD') treats it as UTC.)
  parseDate: function(input) {
    var parts = input.split('-');
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Note: month is 0-indexed
    var day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  },

  // '19:00'
  formatTime: function(date) {
    return date.toTimeString().substring(0, 5);
  },
  
  // 'Wed Jul 28'
  formatDate: function(date) {
    return date.toDateString().substring(0, 10);
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
  },
  
  getFriendlyLabelName: function(label) {
    if (label.type === 'system') {
      var match = /^CATEGORY_(.*)$/.exec(label.id);
      if (match) {
        return Util.capitalize(match[1]);
      } else {
        return Util.capitalize(label.name);
      }
    } 
    return label.name;
  },
  
  capitalize: function(str) {
    if (str) {
      return str[0].toUpperCase() + str.substring(1).toLowerCase();
    }
    return '';
  },
  
  systemLabelSortComparator: function(a, b) {
    var priorities = {
      UNREAD: 1,
      IMPORTANT: 2,
      INBOX: 3,
      STARRED: 4,
      DRAFT: 5,
      SENT: 6,
      SPAM: 7,
      TRASH: 8
    };
    return priorities[a.label.id] - priorities[b.label.id];
  },
  
  isAllDayEvent: function(event) {
    return !!event.start.date;
  },
  
  getNextDate: function(date) {
    var nextDate = new Date(date.toDateString());
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
  }
};

module.exports = Util
