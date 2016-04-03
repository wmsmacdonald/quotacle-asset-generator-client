var testing = require('testing');
var assetGeneratorClient = require('./');
var http = require('http');
var url = require('url');

var tests = [
  test_assetGeneratorConnection,
  test_assetGeneratorConnectionWrongKey,
  test_createThumbnail,
  test_createThumbnailWrongSource
];
testing.run(tests, 10000, function(err, result) {
  console.log('Failures: %d', result.failures);
});

function test_assetGeneratorConnection(callback) {
  assetGeneratorClient.connect(undefined, function(err, assetGeneratorConnection) {
    assetGeneratorConnection.close();

    if (err) {
      console.log(err);
      return testing.failure(callback);
    }

    testing.success(callback);
  });
}

function test_assetGeneratorConnectionWrongKey(callback) {
  assetGeneratorClient.connect('wrongkey', function(err) {

    if (err === 'Socket authentication failed') {
      return testing.success(callback);
    }
    else {
      testing.failure(callback);
    }
  });
}

function test_createThumbnail(callback) {
  assetGeneratorClient.connect(undefined, function(err, assetGeneratorConnection) {
    if (err) {
      console.log(err);
      return testing.failure(callback);
    }

    assetGeneratorConnection.createThumbnail('movies/100/full.mp4', 1000, function(err, thumbnailUrl) {
      assetGeneratorConnection.close();

      if (err || !thumbnailUrl) {
        console.log(err);
        return testing.failure(callback);
      }

      var options = url.parse(thumbnailUrl);
      options.method = 'HEAD';
      options.agent = false; // don't keep-alive

      var req = http.request(options, function(res) {
        if (res.statusCode === 200) {
          return testing.success(callback);
        }

        console.log('Thumbnail HTTP request failed: %d', res.statusCode);
        testing.failure(callback);
      });

      req.end();
    });
  });

}

function test_createThumbnailWrongSource(callback) {
  assetGeneratorClient.connect(undefined, function(err, assetGeneratorConnection) {
    if (err) {
      console.log(err);
      return testing.failure(callback);
    }

    assetGeneratorConnection.createThumbnail('movies/wrong_source.mp4', 1000, function(err, thumbnailUrl) {
      assetGeneratorConnection.close();

      if (err) {
        return testing.success(callback);
      }
      else {
        return testing.failure(callback);
      }

    });
  });
}
