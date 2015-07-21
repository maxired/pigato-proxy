# pigato-proxy
A pigato proxy to foward a request from a broker to another

This can be used as a module or as a standalone binary

#Standalone Binary

##Installation
```npm i -g pigato-proxy```

##Usage
```
  Usage: pigato-proxy [options]

  Options:

    -h, --help                           output usage information
    -V, --version                        output the version number
    -s, --source [endpoint]              Source Endpoint
    -ss, --sourceservice [service]       Source Service
    -d, --destination [endpoint]         Destination Endpoint
    -ds, --destinationservice [service]  Destination Service [sourceservice]
```

#Node.JS module

```javascript
var PigatoProxy = require('pigato-proxy');

var endpoint = 'tcp://127.0.0.1:55000';

var proxy = new PigatoProxy( endpoint , { proxy : { remote : tcp://127.0.0.1:55001 , service : '/foo'});
proxy.start(function(){ console.log('started')});
```

###Autostart
If we give a callback to the constructor, then the proxy will be automatically started

```javascript
PigatoProxy( endpoint , { proxy : { remote : tcp://127.0.0.1:55001 , service : '/foo'}, function(){ console.log('started')});
```

###Service Forward
Moreover, we can also change the name of the service requested.
This can be usefull to dynamically linked two services even if servicename are hard coded

```javascript
PigatoProxy( endpoint , { proxy : { remote : tcp://127.0.0.1:55001 , service : { in :'/foo' , out : '/bar' }, function(){ console.log('started')});

```
