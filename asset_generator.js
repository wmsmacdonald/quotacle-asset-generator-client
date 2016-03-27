var assetGeneratorSocket = require('./conf/asset_generator_socket');

module.exports.connect = function connect(apiKey, callback) {
  assetGeneratorSocket.connect(apiKey, function(err, client) {
    if (err) return callback(err);

    assetGeneratorConnection = {
      createThumbnail: function createThumbnail(file, timeOffset, callback) {
        client.sendAsync(JSON.stringify({
          action: 'createThumbnail',
          file: file,
          timeOffset: timeOffset
        }), callback);
      },
      createVideoClip: function createVideoClip(file, startTime, endTime, callback) {
        endTime = endTime || endTime + 10;
        client.sendAsync(JSON.stringify({
          action: 'createThumbnail',
          file: file,
          startTime: startTime,
          endTime: endTime
        }), callback);
      }
    };

    callback(false, assetGeneratorConnection);
  });
};
