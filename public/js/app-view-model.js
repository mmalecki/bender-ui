var ko = require('knockout');
var shoe = require('shoe');
var Doc = require('bender-crdt');
var crdtObservableArray = require('knockout-crdt-observable-array');
var Registration = require('./registration.js');
var Frontend = require('./frontend.js');
var Backend = require('./backend.js');

var AppViewModel = function () {
  this.doc = new Doc({ ttl: false });
  this.shoe = shoe('/bender-crdt');
  this.shoe.pipe(this.doc.createStream()).pipe(this.shoe);

  this.backends = crdtObservableArray(this.doc.backends, Backend);
  this.frontends = crdtObservableArray(this.doc.frontends, Frontend);
  this.registrations = crdtObservableArray(this.doc.registrations, Registration);
  // So. Yeah. That was easy.
};

var app = new AppViewModel();
ko.applyBindings(app);
