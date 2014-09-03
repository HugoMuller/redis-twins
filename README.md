redis-twins
===========

Simple redis pub/sub interface wrapped in a singleton.  
redis-twins brings together two redis clients: one in REGULAR mode, the second in SUBSCRIBER mode.  
The goal is to use two clients as one. This single client can send regular AND subscriber commands.

-------

Installation (redis-twins is not on npmjs.org yet...)
------------

    npm install redis-twins

Usage
-----
    
You can pass your conf arguments as if you were using the redis.createClient method:

    // default arguments
    var redis = require('redis-twins')(); // eq: var redis = require(6379, '127.0.0.1', {});
    // default port and host, custom options
    var redis = require(options); // eq: var redis = require(6379, '127.0.0.1', options);
    // unix socket with options
    var redis = require(unix_socket, options);
    // custom port, host and options
    var redis = require(port, host, options);
    
###Using regular commands

If you wish to use Redis regular commands, you have to use the REGULAR client.
Use it as if you were using the standard redis module:

    redis.regular.set(...);
    redis.regular.hget(...);
    redis.regular.smembers(...);
    // and so on

###Publlishing

publish is a regular command, so to publish content on a channel, use the REGULAR client:

    redis.regular.publish('Pub2Sub', 'Something'));

###Subscribing

Subscribing to a channel is done this way:

    redis.subscribe('Sub2Pub', function(message){
      console.log('Redis Subscriber has received: ' + message);
    });
    
It is a shorthand for:

    redis.subscriber.subscribe('Sub2Pub');
    redis.callbacks['Sub2Pub'] = function(message){
      console.log('Redis Subscriber has received: ' + message);
    };

Running tests
-------------

Unit Tests are run with [mocha](http://visionmedia.github.io/mocha/).
You need to install this framework in order to run the tests:
    
    npm install mocha -g

Then, to run the tests, simply do:

    npm test

TODO
----

Upload the module on npmjs.org

License
-------

[The MIT License](https://github.com/HugoMuller/redis-twins/blob/master/LICENSE)
