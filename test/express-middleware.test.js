'use strict';

const zlib = require('zlib');
const path = require('path');
const express = require('express');
const request = require('supertest');
const preCompressionMiddleware = require('../express-middleware');

const NEXT_STATIC_PATH = '/_next/static/';

const NEXT_APP = {
    nextConfig: {
        distDir: path.join(__dirname, 'fixtures'),
        assetPrefix: '',
    },
    renderOpts: {
        dev: false,
    },
};

it('should respond success if requested from static resources (gzip)', async () => {
    const server = express();

    server.use(preCompressionMiddleware(NEXT_APP));

    await request(server)
    .get(`${NEXT_STATIC_PATH}test.txt`)
    .set('Accept-Encoding', 'gzip')
    .expect(200, 'hello world\n')
    .expect('Content-Encoding', 'gzip');
});

it('should respond success if requested from static resources (brotli)', async () => {
    const server = express();

    server.use(preCompressionMiddleware(NEXT_APP));

    await request(server)
    .get(`${NEXT_STATIC_PATH}test.txt`)
    .set('Accept-Encoding', 'br')
    .expect(200)
    .expect('Content-Encoding', 'br')
    .expect((res) => {
        // We're decompressing manually since SuperAgent doesn't support Brotli at the moment
        const decompressedPayload = zlib.brotliDecompressSync(Buffer.from(res.text));

        return decompressedPayload === 'hello world\n';
    });
});

it('should call response with 404 if request file doesn\'t exist', async () => {
    const server = express();

    server.use(preCompressionMiddleware(NEXT_APP));

    await request(server)
    .get(`${NEXT_STATIC_PATH}somefilethatwillneverexist.txt`)
    .expect(404);
});

it('should work correctly with a custom assetPrefix', async () => {
    const server = express();

    server.use(preCompressionMiddleware({
        ...NEXT_APP,
        nextConfig: {
            ...NEXT_APP.nextConfig,
            assetPrefix: '/foo',
        },
    }));

    await request(server)
    .get(`/foo${NEXT_STATIC_PATH}/test.txt`)
    .set('Accept-Encoding', 'gzip')
    .expect(200, 'hello world\n');
});

it('should throw if a custom assetPrefix is an absolute URI', () => {
    const server = express();

    expect(() => {
        server.use(preCompressionMiddleware({
            ...NEXT_APP,
            nextConfig: {
                ...NEXT_APP.nextConfig,
                assetPrefix: 'https://cdn.my-site.com',
            },
        }));
    }).toThrow(/doesn't support absolute URI/);
});

it('should do nothing in dev', async () => {
    const server = express();

    server.use(preCompressionMiddleware({
        ...NEXT_APP,
        renderOpts: {
            ...NEXT_APP.renderOpts,
            dev: true,
        },
    }));

    server.get('*', (req, res) => res.send('foo'));

    await request(server)
    .get(`${NEXT_STATIC_PATH}test.txt`)
    .set('Accept-Encoding', 'gzip')
    .expect(200, 'foo');
});

it('should respond with the correct default headers', async () => {
    const server = express();

    server.use(preCompressionMiddleware(NEXT_APP));

    await request(server)
    .get(`${NEXT_STATIC_PATH}/test.txt`)
    .expect('Cache-Control', 'public, max-age=31536000, immutable')
    .expect((res) => {
        expect(res.headers.etag).toBe(undefined);
    });
});

it('should forward options to serve-static', async () => {
    const server = express();

    server.use(preCompressionMiddleware(NEXT_APP, {
        maxAge: 60 * 60 * 1000,
        immutable: false,
    }));

    await request(server)
    .get(`${NEXT_STATIC_PATH}/test.txt`)
    .expect('Cache-Control', 'public, max-age=3600');
});
