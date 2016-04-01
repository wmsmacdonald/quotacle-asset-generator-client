var testing = require('testing');
var assetGeneratorClient = require('./');

var tests = [
  test_assetGeneratorConnection,
  test_assetGeneratorConnectionWrongKey,
  test_createThumbnail
];
testing.run(tests, 10000, function(err, result) {
  console.log('Failures: %d', result.failures);
});

function test_assetGeneratorConnection(callback) {
  assetGeneratorClient.connect(undefined, function(err) {
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

    assetGeneratorConnection.createThumbnail('test.mp4', 5, function() {
      assetGeneratorConnection.close();
      testing.success(callback);
    });
  });

}

