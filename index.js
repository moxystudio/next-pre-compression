'use strict';

const compressionPlugin = require('./express-compression');
const withCompression = require('./next-webpack-compression');

module.exports = { withCompression, compressionPlugin };
