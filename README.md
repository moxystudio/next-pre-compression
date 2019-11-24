# next-pre-compression

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/@moxy/next-pre-compression
[downloads-image]:https://img.shields.io/npm/dm/@moxy/next-pre-compression.svg
[npm-image]:https://img.shields.io/npm/v/@moxy/next-pre-compression.svg
[travis-url]:https://travis-ci.org/moxystudio/next-pre-compression
[travis-image]:https://img.shields.io/travis/moxystudio/next-pre-compression/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/next-pre-compression
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/next-pre-compression/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/next-pre-compression
[david-dm-image]:https://img.shields.io/david/moxystudio/next-pre-compression.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/next-pre-compression?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/next-pre-compression.svg

Next.js plugin to compress static assets at build time and serve them instead of having to compress on-the-fly.

> ℹ️ While compressing ahead of time has benefits, it's preferrable to delegate compression to an upstream server, such as a reverse-proxy CDN. Modern CDNs apply compression with the best algorithms and settings, while storing the compressed responses on edge servers. Next.js already does `gzip` by default which is sufficient for efficient transfer of data to the upstream servers. In conclusion, you should only use this package if there's no upstream server or if it doesn't apply compression.

## Installation

```sh
$ npm i --save @moxy/next-pre-compression
```

## Usage

### next.config.js

Setup the plugin in the `next.config.js` file:

```js
const withPreCompression = require('@moxy/next-pre-compression');

module.exports = withPreCompression({ ...nextConfig });
```

This plugin will automatically disable itself if you disable [`compress`](https://nextjs.org/docs#compression) in your `next.config.js`.

> ℹ️ The plugin has no effect in development.

### Express

Express middleware used to serve the previously compressed files, by leveraging [express-static-gzip](https://www.npmjs.com/package/express-static-gzip).

First, you need to setup a [custom express server]( https://github.com/zeit/next.js/tree/master/examples/custom-server-express). Then, simply add the middleware like so:

```js
// server.js

const express = require('express');
const next = require('next');
const preCompression = require('@moxy/next-pre-compression/express-middleware');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(preCompression(app, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }));

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, host, (err) => {
        if (err) { throw err; }

        console.log(`> Ready on http://localhost:${port}`);
    });
})
.catch((err) => {
    setImmediate(() => { throw err; });
});
```

> ℹ️ The middleware has no effect in development.

> ⚠️ A custom `assetPrefix` that references an absolute URI is not yet supported (e.g.: https://cdn.my-site.com), see [moxystudio/next-pre-compression#8](https://github.com/moxystudio/next-pre-compression/issues/8).

All options from [serve-static](https://www.npmjs.com/package/serve-static) are also available.

> ⚠️ You can't enable the `index` option as it's always set to false, due to a strange behavior of `express-static-gzip` that modifies the request path without restoring it, see: https://github.com/tkoenig89/express-static-gzip/blob/94767f79e861a3901e8ebba31b084abc4986817f/index.js#L28

##### Default options

```js
{
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    immutable: true,
    etag: false,
    index: false // Can't be changed
}
```

## Tests

Any parameter passed to the `test` command, is passed down to Jest.

```sh
$ npm test
$ npm test -- --watch # during development
```

After running the tests, a **coverage** folder will be created containing the test coverage info.

## License

Released under the [MIT License](https://www.opensource.org/licenses/mit-license.php).
