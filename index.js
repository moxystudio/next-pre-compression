'use strict';

const compression = module.exports = require('./next-webpack-compression');

compression.compressionMiddleware = require('./express-compression');
