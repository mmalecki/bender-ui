var Registration = module.exports = function (data) {
  this.app = data.get('app');
  this.version = data.get('version');
  this.host = data.get('host');
  this.port = data.get('port');
};
