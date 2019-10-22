'use strict';

const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const { Router: createRouter } = require('express');

const NEXT_STATIC_FOLDER = '/_next/static/';

/**
 * Express middleware to serve pre-compressed files from filesystem.
 *
 * @param {Object} app - Next.js' application.
 * @param {Object} options - Options that will be passed to 'serve-static'.
 */
const preCompression = (app, options = {}) => {
    const { nextConfig: { distDir, assetPrefix }, renderOpts } = app;

    if (renderOpts.dev) {
        throw new Error('The @moxy/next-pre-compression\'s express middleware should only be called in production.');
    }

    options = {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        immutable: true,
        ...options,
        index: false,
    };

    const staticGzipMiddleware = expressStaticGzip(path.join(distDir, 'static'), {
        enableBrotli: true,
        orderPreference: ['br', 'gzip'],
        index: false,
        serveStatic: options,
    });

    if (/^[^:]+:\/\//.test(assetPrefix)) {
        throw new Error('The @moxy/next-pre-compression\'s express middleware doesn\'t support absolute URI as the assetPrefix yet (e.g.: https://cdn.my-site.com), see https://github.com/moxystudio/next-pre-compression/issues/8.');
    }

    const router = createRouter();

    return router.use(`${assetPrefix}${NEXT_STATIC_FOLDER}`, staticGzipMiddleware);
};

module.exports = preCompression;
