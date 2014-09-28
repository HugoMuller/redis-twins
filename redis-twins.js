'use strict';

var redis = require('redis');

var onError    = function(error){ console.log('Redis-twins Regular Client ERROR: ', error); };
var onSubError = function(error){ console.log('Redis-twins Subscriber Client ERROR: ', error); };
var onReady    = function(){ console.log('Redis-twins Regular Client ready'); };
var onSubReady = function(){ console.log('Redis-twins Subscriber Client ready'); };

var onSubscribe = function(channel, count){
  console.log('Redis-twins subscribing to channel', channel);
  console.log('Redis-twins has now', count, 'channel subscriptions');
};

var onUnsubscribe = function(channel, count){
  console.log('Redis-twins unsubscribing from channel', channel);
  console.log('Redis-twins has now', count, 'channel subscriptions');
  delete this.callbacks[channel];
};

var onMessage = function(channel, message){
  if(typeof this.callbacks[channel] === 'function') this.callbacks[channel](message);
  else console.log('Redis-twins has no action associated to channel', channel);
};

var RedisTwins = function(){
  if(RedisTwins.prototype.__instance) return RedisTwins.prototype.__instance;

  RedisTwins.prototype.__instance = this;
  // actions to perform when receiving a message
  this.callbacks = {};
  // redis client in REGULAR mode
  this.regular = redis.createClient.apply(this, arguments)
    .on('error', onError)
    .on('ready', onReady);
  // redis client in SUBSCRIBER mode
  this.subscriber = redis.createClient.apply(this, arguments)
    .on('error', onSubError)
    .on('ready', onSubReady)
    .on('subscribe', onSubscribe)
    .on('unsubscribe', onUnsubscribe.bind(this))
    .on('message', onMessage.bind(this));

  return this;
};
// shorthand for subscribing the subscriber client and adding the callback
RedisTwins.prototype.subscribe = function(channel, callback){
  this.subscriber.subscribe(channel);
  this.callbacks[channel] = callback;
};

module.exports = (function(){
  function _RedisTwins(args){ return RedisTwins.apply(this, args); }
  _RedisTwins.prototype = RedisTwins.prototype;
  return function(){ return new _RedisTwins(arguments); };
})();
