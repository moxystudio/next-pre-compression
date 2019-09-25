/* eslint-disable prefer-import/prefer-import-over-require */
const compressionPlugin = require('./express-compression');
const withCompression = require('./next-webpack-compression');

module.exports = { withCompression, compressionPlugin };
