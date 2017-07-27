var amqp = require('amqplib/callback_api');

const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://localhost:27017/nodejsdb', (err, database) => {
  if (err) return console.log(err)
  db = database
})

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      var order = JSON.parse(msg.content);
      //JSON.stringify(obj)
      console.log(order);
   	  //console.log(order.status);
   	  //console.log(order.number);

		db.collection('orders').save(order, (err, result) => {
		    if (err) return console.log(err)
		    console.log('saved to database')
	  	})
    }, {noAck: true});
  });
});