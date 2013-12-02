var ko = require('knockout');
var ws = require('websocket-stream');
var Doc = require('bender-crdt');
var crdtObservableArray = require('knockout-crdt-observable-array');
var Registration = require('./registration.js');
var Frontend = require('./frontend.js');
var Backend = require('./backend.js');
var version = require('../../package.json').version;

var AppViewModel = function () {
  var self = this;

  this.doc = new Doc({ ttl: false });
  this.ws = ws('ws://' + window.location.host + '/bender-crdt');
  this.ws.pipe(this.doc.createStream()).pipe(this.ws);

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

  this.backend = ko.observable(new Backend({}));
  this.editingBackend = ko.observable(false);
  this.editBackend = function (backend) {
    self.backend(backend);
    self.editingBackend(true);
  };
};

AppViewModel.prototype.saveBackend = function () {
  var backend = ko.toJS(this.backend());
  this.doc.set('backend/' + backend.name, backend);
};

var app = new AppViewModel();
ko.applyBindings(app);
