'use strict';

const compressionMiddleware = require('./express-compression');
const withCompression = require('./next-webpack-compression');

module.exports = { withCompression, compressionMiddleware };
