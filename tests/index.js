/*eslint-env node, mocha */

var Proxy = require('..');

var Router = require('zone522-router');
var Worker = require('pigato').Worker;
var Client = require('pigato').Client;

var assert = require('chai').assert;

describe('proxy test', function() {

  var inpoint = 'ipc:///tmp/in';
  var outpoint = 'ipc:///tmp/out';

  before(function(done) {
    Router(inpoint, {
      heartbeat: 30
    }, function() {
      Router(outpoint, {
        heartbeat: 30
      }, function() {
        done();
      });
    });
  });

  var proxy;
  it('start  and call cb', function(done) {

    proxy = new Proxy(inpoint, {
      heartbeat: 30,
      proxy: {
        remote: outpoint,
        service: '/foo'
      }
    }, function(err) {
      done();
    });

  });

  it('can be stopped  and call cb', function(done) {

    setTimeout(function() {
      proxy.stop(done);
    }, 250);

  });


  it('can be re started  and call cb', function(done) {
    setTimeout(function() {
      proxy.start(done);
    }, 250);
  });

  describe('forward a request', function() {
    var client, worker;

    before(function(done) {
      worker = new Worker(outpoint, '/foo', {
        heartbeat: 30
      });
      worker.once('start', function() {
        done();
      });
      worker.start();
    });

    before(function(done) {
      client = new Client(inpoint, {
        heartbeat: 30
      });
      client.once('start', function() {
        done();
      });
      client.start();
    });

    afterEach(function() {
      worker.removeAllListeners('request');
    });

    it('can  forward a request', function(done) {

      worker.on('request', function(data, reply) {
        reply.end('bar');
      });

      client.request('/foo', '', function(err, data) {
        assert.ok(!err);
        assert.equal('bar', data);

      }, function(err, data) {
        assert.equal(err, 0);
        assert.equal(data, 0);
        done();
      }, {
        heartbeat: 30
      });
    });


    it('correctly tranmit data to worker', function(done) {

      worker.on('request', function(data, reply) {
        assert.equal(data, 'baz');
        reply.end('bar');
      });

      client.request('/foo', 'baz', function(err, data) {
        assert.ok(!err);
        assert.equal('bar', data);

      }, function(err, data) {
        assert.equal(err, 0);
        assert.equal(data, 0);
        done();
      }, {
        heartbeat: 30
      });
    });

  });
});
