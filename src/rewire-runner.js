require('./runner');
require.cache[require.resolve('testcafe/lib/runner')] = require.cache[require.resolve('./runner')];
