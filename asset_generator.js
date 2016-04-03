var assetGeneratorSocket = require('./asset_generator_socket');

module.exports.connect = function connect(apiKey, callback) {
  assetGeneratorSocket.connect(apiKey, function(err, client) {
    if (err) return callback(err);

    var assetGeneratorConnection = {
      createThumbnail: function createThumbnail(file, timeOffset, callback) {
        client.sendAsync({
          action: 'createThumbnail',
          file: file,
          timeOffset: timeOffset
        }, function(err, message) {
          receivedMessage(err, message, callback);
        });
      },
      createVideoClip: function createVideoClip(file, startTime, endTime, callback) {
        endTime = endTime || endTime + 10;
        client.sendAsync({
          action: 'createVideoClip',
          file: file,
          startTime: startTime,
          endTime: endTime
        }, function(err, message) {
          receivedMessage(err, message, callback);
        });
      },
      close: function close() {
        client.end();
      }
    };

    callback(false, assetGeneratorConnection);
  });

};

function receivedMessage(err, message, callback) {
  if (message.err) return callback(message.err);

  callback(false, message.url);
}
