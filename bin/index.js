#!/usr/bin/env node

var myModule = require('..');
var myPackage = require('../package.json');

var debug = require('debug')(myPackage.name);

var program = require('commander');

program
	.version('0.0.1')
	.option('-s, --source [endpoint]', 'Source Endpoint', 'tcp://127.0.0.1:55000')
	.option('-ss, --sourceservice [service]', 'Source Service', '/foo')
	.option('-d, --destination [endpoint]', 'Destination Endpoint',
		'tcp://127.0.0.1:55000')
	.option('-ds, --destinationservice [service]',
		'Destination Service [sourceservice]')
	.parse(process.argv)

var conf = {
	heartbeat: 30,
	proxy: {
		remote: program.destination,
		service: { in : program.sourceservice,
				out: program.destinationservice || program.sourceservice
		}
	}
};

myModule(program.source, conf, function(err) {
	debug('did start, err is %s', err);
});
