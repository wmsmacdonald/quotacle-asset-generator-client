var net = require('net');
var fs = require('fs');
var path = require('path');

var HOST = '127.0.0.1';
//var HOST = 'fgen.quotacle.com';
var PORT = 5340;

module.exports.connect = function(apiKey, callback) {
  if (!apiKey) {
    apiKey = require('./secrets/api_key.json');
  }

  var client = new net.Socket();

  client.open = false;



  client.connect(PORT, HOST, function() {
    open = true;
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(apiKey);
  });

  var initialSetup = true;

  client.on('data', function(data) {
    data = JSON.parse(data);
    if (initialSetup) {
      initialSetup = false;
      if (data.authSuccess) {
        client.sendAsync = sendAsync;
        console.log('authenticated');

        return callback(false, client);
      }
      else {
        client.end();
        client.open = false;
        callback('Socket authentication failed');
        return;
      }
    }
  });

  client.on('close', function() {
    if (client.open) {
      client.open = false;
      callback('Socket disconnected');
    }
  });

};

// use ids to keep track of multiple requests at the same time
var ids = 0;

function sendAsync(message, callback) {
  var requestId = ids++;
  this.write(JSON.stringify({
    requestId: requestId,
    message: message
  }));

  this.on('data', function (data) {
    data = JSON.parse(data.toString());
    if (data.requestId == requestId) {
      if (data.err) return callback(data.err);

      callback(false, data.message);
    }
  });
}