/* eslint-disable no-useless-escape */

'use strict';

const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');
const mimeDb = require('mime-db');

module.exports = (nextConfig = {}) => ({
    ...nextConfig,
    webpack(config, options) {
        const enabled = nextConfig.compress && !options.isServer;

        if (enabled) {
            const compressibleRegExps = Object
            .values(mimeDb)
            .filter((mime) => mime.compressible && mime.extensions)
            .reduce((extensions, mime) => {
                mime.extensions.forEach((ext) => extensions.push(new RegExp(`\\.${ext}`)));

                return extensions;
            }, []);

            const compressionOptions = {
                test: /^static[\\\/]/,
                include: compressibleRegExps,
                exclude: /^static[\\\/]webpack[\\\/]/,
            };

            config.plugins.push(new CompressionPlugin({
                ...compressionOptions,
                filename: '[path].gz[query]',
                algorithm: 'gzip',
            }));

            if (zlib.brotliCompress) {
                config.plugins.push(new CompressionPlugin({
                    ...compressionOptions,
                    filename: '[path].br[query]',
                    algorithm: 'brotliCompress',
                }));
            }
        }

        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }

        return config;
    },
});
