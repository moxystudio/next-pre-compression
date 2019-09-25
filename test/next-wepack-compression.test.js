'use strict';

const withCompression = require('../next-webpack-compression');
const zlib = require('zlib');

const zlibBrotliCompression = zlib.brotliCompress;

const nextConfig = {
    webpack: jest.fn(),
};

let config = {
    plugins: [],
};

beforeEach(() => {
    nextConfig.webpack.mockReset();

    config = {
        plugins: [],
    };
});

afterEach(() => {
    zlib.brotliCompress = zlibBrotliCompression;
});

it('should return the same config object that is passed', () => {
    const result = withCompression().webpack(config, {});

    expect(result).toBe(config);
});

it('should push compression settings to webpack config', () => {
    withCompression().webpack(config, {});

    expect(config).toMatchSnapshot();
});

it('should return a function if nextConfig is a function', () => {
    const result = withCompression(nextConfig).webpack(config, {});

    expect(nextConfig.webpack).toHaveBeenCalledTimes(1);
    expect(nextConfig.webpack).toHaveReturnedWith(result);
});

it('should push the passed object to the config and call next function', () => {
    const result = withCompression({ foo: 'bar' });

    expect(result).toMatchObject({ foo: 'bar' });
    expect(typeof result.webpack).toBe('function');
});

it('should not push brotli compression plugin if brotli compression is not available', () => {
    delete zlib.brotliCompress;

    withCompression().webpack(config, {});

    expect(config).toMatchSnapshot();
});

