var testing = require('testing');
var assetGenerator = require('./asset_generator');

var tests = [
  test_assetGeneratorConnection,
  test_assetGeneratorConnectionWrongKey
];
testing.run(tests, 10000, function(err, result) {
  console.log('Failures: %d', result.failures);
});

function test_assetGeneratorConnection(callback) {
  assetGenerator.connect(undefined, function(err) {
    if (err) {
      console.log(err);
      return testing.failure(callback);
    }

    testing.success(callback);
  });
}

function test_assetGeneratorConnectionWrongKey(callback) {
  assetGenerator.connect('wrongkey', function(err) {
    if (err === 'Socket authentication failed') {
      return testing.success(callback);
    }
    else {
      testing.failure(callback);
    }
  });
}


