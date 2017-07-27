var amqp = require('amqplib/callback_api');


function Order() {
	this.status = 'pending';
	this.number = "1234";
	this.item = {
	  'item_name': 'detergent',
	  'item_qty' : '23'
	};
	this.gui_id = 'iot_12345';
	this.createDate = new Date();
}
 
var instance = new Order();
console.log(JSON.stringify(instance));


amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    //var msg = 'Hello World!';
    var msg = JSON.stringify(instance);

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});