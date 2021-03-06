var ko = require('knockout');

var Backend = module.exports = function (data) {
  var self = this;

  this.name = ko.observable(data.name);
  this.app = ko.observable(data.app);
  this.version = ko.observable(data.version);
  this.resource = 'Backend';

  this.appVersion = ko.computed({
    read: function () {
      return self.app() + '@' + self.version();
    },
    write: function (value) {
      var split = value.split('@');
      self.app(split[0]);
      self.version(split[1]);
    },
    owner: self
  });
};
