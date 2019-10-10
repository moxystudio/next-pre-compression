'use strict';

const express = require('express');
const request = require('supertest');
const { compressionMiddleware } = require('../express-compression');
let server = express();

beforeEach(() => {
    server = express();
});

it('should call next() if request path does not match', async () => {
    server.use(compressionMiddleware({
        requestPath: '/',
    }));

    server.get('/request/path', (req, res) => {
        res.status(200).send('foo');
    });

    await request(server)
    .get('/request/path')
    .expect(200, 'foo');
});

it('should call next() if request path matches and file does not exist', async () => {
    server.use(compressionMiddleware({
        requestPath: '/',
        fsPath: '/test_dir/nonexistent/directory',
    }));

    server.get('/', (req, res) => {
        res.status(200).send('foo');
    });

    await request(server)
    .get('/')
    .expect(200, 'foo');
});

it('should call next() with an error when staticGzipMiddleware fails', async () => {
    server.use(compressionMiddleware({
        requestPath: '/',
    }));

    server.get('/', (req, res) => {
        res.status(200).send('foo');
    });

    await request(server)
    .get('/')
    .expect(200, 'foo');
});

it('should set index path to index.html if none is set', async () => {
    server.use(compressionMiddleware({
        requestPath: '/',
    }));

    server.get('/', (req, res) => {
        res.status(200).send('foo');
    });

    await request(server)
    .get('/')
    .expect(200, 'foo');
});

it('should use index path string if none is set', async () => {
    server.use(compressionMiddleware({
        requestPath: '/',
        index: '/main.js',
    }));

    server.get('/', (req, res) => {
        res.status(200).send('foo');
    });

    await request(server)
    .get('/')
    .expect(200, 'foo');
});

it('should use index path string if index is false', async () => {
    server.use(compressionMiddleware({
        requestPath: '/',
        index: false,
    }));

    server.get('/', (req, res) => {
        res.status(200).send('foo');
    });

    await request(server)
    .get('/')
    .expect(200, 'foo');
});
