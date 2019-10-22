# next-compression

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/@moxy/next-compression
[downloads-image]:https://img.shields.io/npm/dm/@moxy/next-compression.svg
[npm-image]:https://img.shields.io/npm/v/@moxy/next-compression.svg
[travis-url]:https://travis-ci.org/moxystudio/next-compression
[travis-image]:http://img.shields.io/travis/moxystudio/next-compression/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/next-compression
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/next-compression/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/next-compression
[david-dm-image]:https://img.shields.io/david/moxystudio/next-compression.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/next-compression?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/next-compression.svg

Next.js plugin to compress static assets at build time and serve them instead of having to compress on-the-fly.

## Installation

```sh
$ npm i --save @moxy/next-compression
```

## Usage

### next.config.js

Setup the plugin in the `next.config.js` file:

```js
const withCompression = require('@moxy/next-compression');

module.exports = withCompression({ ...nextConfig });
```

This plugin will automatically disable itself if you disable [`compress`](https://nextjs.org/docs#compression) in your `next.config.js`.

### Express

Express middleware used to serve the previously compressed files, by leveraging [express-static-gzip](https://www.npmjs.com/package/express-static-gzip).

First, you need to setup a [custom express server]( https://github.com/zeit/next.js/tree/master/examples/custom-server-express). Then, simply add the middleware like so:

```js
// server.js

const { compressionMiddleware } = require('@moxy/next-compression');

// ....

app.prepare().then(() => {
    const server = express();

    server.use(compressionMiddleware({
        requestPath: '/',
        fsPath: '/directory/static'
        serveStatic: {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            immutable: true,
        }
    }));
});

```

#### Available options

| Option | Description | Type | Default |
|  ---   |     ---     | ---  |   ---   |
| requestPath   | Defines the request path that will activate the `express-static-gzip` middleware  | string  | `/_next/static/` |
| fsPath   | Defines the file system path from where the `express-static-gzip` middleware will serve the compressed files. | string  | `.next/static/` |

All options from [express-static-gzip options](https://www.npmjs.com/package/express-static-gzip#available-options) are also available.

##### Default options

```js
{
    fsPath: '/.next/static/',
    requestPath: '/_next/static/',
    orderPreference: ['br', 'gzip'],
    enableBrotli: true,
    serveStatic: {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        immutable: true,
    }
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

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
