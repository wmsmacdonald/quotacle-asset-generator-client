var net = require('net');
var fs = require('fs');
var path = require('path');

var HOST = '127.0.0.1';
//var HOST = 'fgen.quotacle.com';
var PORT = 5340;

module.exports.connect = function(apiKey, callback) {
  if (!apiKey) {
    var apiKeyFile = fs.readFileSync(path.join(__dirname, 'secrets/asset_generator_api_key.conf'));
    apiKey = apiKeyFile.toString().split('\n')[0];
  }

  var client = new net.Socket();
  var open = false;

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
      if (data.authSuccess) {
        client.sendAsync = sendAsync;
        console.log('authenticated');

        return callback(false, client);
      }
      else {
        client.end();
        open = false;
        callback('Socket authentication failed');
        return;
      }
    }
  });

  client.on('close', function() {
    if (open) {
      open = false;
      callback('Socket disconnected');
    }
  });

};

// use ids to keep track of multiple requests at the same time
var ids = 0;

function sendAsync(message, client, callback) {
  var requestId = ids++;
  client.write(JSON.stringify({
    requestId: requestId,
    message: message
  }));
  client.on('data', function (data) {
    data = JSON.stringify(data);

    if (data.requestId === requestId) {
      if (data.err) return callback(data.err);

      callback(false, data.message);
    }
  });
}