'use strict';

const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const { Router: createRouter } = require('express');

const NEXT_STATIC_PATH = '/_next/static/';

/**
 * Express middleware to serve pre-compressed files from filesystem.
 *
 * @param {object} app - Next.js' application.
 * @param {object} options - Options that will be passed to 'serve-static'.
 * @returns {Function} The middleware function.
 */
const preCompression = (app, options = {}) => {
    const { nextConfig: { distDir, assetPrefix }, renderOpts } = app;

    if (renderOpts.dev) {
        return (req, res, next) => next();
    }

    options = {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        immutable: true,
        etag: false,
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
    const routePath = `${assetPrefix}${NEXT_STATIC_PATH}`;

    return router.use(routePath, staticGzipMiddleware);
};

module.exports = preCompression;
