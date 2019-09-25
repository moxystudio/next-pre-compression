'use strict';

const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const { Router: createRouter } = require('express');

// https://github.com/tkoenig89/express-static-gzip/blob/94767f79e861a3901e8ebba31b084abc4986817f/index.js#L28
// expressStaticGzip has a function that changes the empty directory url to /index.html
// this behaviour is configurable through the expressStaticGzip option 'index'.
// maybeRestoreUrlFromIndexHtmlToEmpty restores the behaviour previously described
const maybeRestoreUrlFromIndexHtmlToEmpty = (req, options) => {
    if (options.index === false || !req.originalUrl.endsWith('/')) {
        return;
    }

    const indexStr = options.index == null ? 'index.html' : options.index;

    req.url = req.url.slice(0, -indexStr.length);
};

const compressionPlugin = (options) => {
    options = {
        fsPath: '.next/static/',
        requestPath: '/_next/static/',
        orderPreference: ['br', 'gzip'],
        enableBrotli: true,
        serveStatic: {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            immutable: true,
        },
        ...options,
    };

    const router = createRouter();
    const { fsPath, requestPath, ...staticGzipOptions } = options;
    const staticGzipMiddleware = expressStaticGzip(path.resolve(fsPath), staticGzipOptions);

    return router.use(requestPath, (req, res, next) => {
        staticGzipMiddleware(req, res, (err) => {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }

            maybeRestoreUrlFromIndexHtmlToEmpty(req, options);

            next();
        });
    });
};

module.exports = compressionPlugin;
