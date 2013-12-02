var ko = require('knockout');
var shoe = require('shoe');
var Doc = require('bender-crdt');
var crdtObservableArray = require('knockout-crdt-observable-array');
var Registration = require('./registration.js');
var Frontend = require('./frontend.js');
var Backend = require('./backend.js');
var App = require('./app.js');
var version = require('../../package.json').version;

var AppViewModel = function () {
  var self = this;

  this.doc = new Doc({ ttl: false });
  this.shoe = shoe('/bender-crdt');
  this.shoe.pipe(this.doc.createStream()).pipe(this.shoe);

  this.backends = crdtObservableArray(this.doc.backends, Backend);
  this.frontends = crdtObservableArray(this.doc.frontends, Frontend);
  this.registrations = crdtObservableArray(this.doc.registrations, Registration);

  this.apps = ko.computed(function () {
    var apps = [];
    self.registrations().forEach(function (reg) {
      var id = reg.app + '@' + reg.version;
      if (apps.indexOf(id) === -1) {
        apps.push(reg.app + '@' + reg.version);
      }
    });
    return apps;
  });

  this.version = version;
  // So. Yeah. That was easy.
};

var app = new AppViewModel();
ko.applyBindings(app);
