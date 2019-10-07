'use strict';

const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');
const mimeDb = require('mime-db');

module.exports = () => (nextConfig = {}) => ({
    ...nextConfig,
    webpack(config, options) {
        const compressibleRegExps = Object
        .values(mimeDb)
        .filter((mime) => mime.compressible && mime.extensions)
        .reduce((extensions, mime) => {
            mime.extensions.forEach((ext) => extensions.push(new RegExp(`\\.${ext}`)));

            return extensions;
        }, []);

        config.plugins.push(new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            include: compressibleRegExps,
        }));

        if (zlib.brotliCompress) {
            config.plugins.push(new CompressionPlugin({
                filename: '[path].br[query]',
                algorithm: 'brotliCompress',
                include: compressibleRegExps,
            }));
        }

        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }

        return config;
    },
});
