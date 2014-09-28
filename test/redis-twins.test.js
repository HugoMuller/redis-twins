'use strict';

require('should');
var redis  = require('../redis-twins')();
var redis2 = require('../redis-twins')();

describe('<Unit Test>', function(){
  describe('Module RedisTwins', function(){
    var channels = ['rediscom:test1', 'rediscom:test2'];
    before(function(ready){
      redis.subscriber.subscribe(channels[0]);
      redis.callbacks[channels[0]] = function(message){ console.log(channels[0], message); };
      ready();
    });

    describe('Pub/sub process', function(){
      it('should subscribe to a channel and publish a message on it', function(done){
        this.timeout(1000);
        redis.subscribe(channels[1], function(message){
          message.should.equal('this is a test');
          Object.keys(redis.callbacks).should.containDeep(channels);
          done();
        });
        setTimeout(function(){
          redis.regular.publish(channels[1], 'this is a test');
        }, 500);
      });
    });

    describe('Uniqueness', function(){
      it('should be a real Singleton', function(done){
        (redis === redis2).should.equal(true);
        Object.keys(redis.callbacks).should.containDeep(Object.keys(redis2.callbacks));
        done();
      });
    });

    describe('Unsubscription', function(){
      it('should unsubscribe from a channel and remove the associated callback', function(done){
        this.timeout(1000);
        redis.subscriber.unsubscribe(channels[0]);
        setTimeout(function(){
          Object.keys(redis.callbacks).should.not.containEql(channels[0]);
          done();
        }, 500);
      });
    });
  });
});
