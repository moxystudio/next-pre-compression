# next-compression

Next.js plugin to compress static assets at build time and serve them instead of having to compress them on-the-fly.

## Installation

```sh
$ npm i --save @moxy/next-compression
```

## Usage

### next.config.js

Setup the plugin in the `next.config.js` file.

```js
const { withCompression } = require('@moxy/next-compression');

module.exports = withCompression({ ...nextConfig });
```

### Express

Express middleware used to serve the previously compressed files. You need to setup a custom express server, please follow the official Next.js example: https://github.com/zeit/next.js/tree/master/examples/custom-server-express.

This package uses the [express-static-gzip](https://www.npmjs.com/package/express-static-gzip).

```js
// server.js

const { compressionPlugin } = require('@moxy/next-compression');

// ....

app.prepare().then(() => {
    const server = express();

    server.use(compressionPlugin({
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
    fsPath: '`/.next/static/`',
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

`$ npm test` will generate by default a **coverage** folder with test coverage info.

## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
