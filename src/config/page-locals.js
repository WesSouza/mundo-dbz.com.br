const { version } = require('../../package.json');

const pageLocals = {
  cdn: '/blobs',
  env: process.env.NODE_ENV || 'development',
  version: version,
};

module.exports = pageLocals;
