var Worker = require('pigato').Worker;
var Client = require('pigato').Client;

var async = require('async');

function Proxy(endpoint, conf, cb) {

	if (!(this instanceof Proxy)) {
		return new Proxy(endpoint, conf, cb);
	}

	if (!conf.proxy || !conf.proxy.remote || !conf.proxy.service) {
		return cb('you should provide conf.proxy and conf.proxy.remote');
	}

	this._client = new Client(conf.proxy.remote, conf);
	this._worker = new Worker(endpoint, conf.proxy.service.in || conf.proxy.service,
		conf);


	this._client.on('stop', function() {
		this._worker.stop();
	}.bind(this));
	//create the worker and start it

	this._worker.on('request', function(data, reply) {
		var req = this._client.request(conf.proxy.service.out || conf.proxy.service,
			data, conf);
		var _end = reply.end.bind(reply);
		reply.end = function(err, data) {
			_end(0);
		};
		req.pipe(reply);
	}.bind(this));

	if (cb) {
		this.start(cb);
	}
}

module.exports = Proxy;

Proxy.prototype.start = function(cb) {
	var self = this;
	async.each(['_client', '_worker'], function(item, cb) {
		self[item].once('start', function() {
			cb();
		});
	}, cb);

	this._client.start();
	this._worker.start();

};

Proxy.prototype.stop = function(cb) {
	//stopping the client, should diconnect him, then stop the worker

	this._worker.once('disconnect', function() {
		cb();
	});

	this._client.stop();

};
