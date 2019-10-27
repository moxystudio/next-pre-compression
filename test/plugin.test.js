'use strict';

const zlib = require('zlib');
const withPreCompression = require('..');

const zlibBrotliCompression = zlib.brotliCompress;

const nextConfig = {
    compress: true,
};

let config = {
    plugins: [],
};

beforeEach(() => {
    config = {
        plugins: [],
    };
});

afterEach(() => {
    zlib.brotliCompress = zlibBrotliCompression;
});

it('should return the same config object that is passed', () => {
    const result = withPreCompression(nextConfig).webpack(config, {});

    expect(result).toBe(config);
});

it('should push compression settings to webpack config', () => {
    withPreCompression(nextConfig).webpack(config, {});

    expect(config).toMatchSnapshot();
});

it('should do nothing if compilation is associated to the server', () => {
    withPreCompression(nextConfig).webpack(config, { isServer: true });

    expect(config.plugins).toHaveLength(0);
});

it('should do nothing if compress is disable in the next config', () => {
    withPreCompression({ ...nextConfig, compress: false }).webpack(config, {});

    expect(config.plugins).toHaveLength(0);
});

it('should call nextConfig webpack if defined', () => {
    const nextConfig = {
        webpack: jest.fn(() => 'foo'),
    };

    const result = withPreCompression(nextConfig).webpack(config, {});

    expect(nextConfig.webpack).toHaveBeenCalledTimes(1);
    expect(nextConfig.webpack).toHaveReturnedWith(result);
});

it('should not push brotli compression plugin if brotli compression is not available', () => {
    delete zlib.brotliCompress;

    withPreCompression(nextConfig).webpack(config, {});

    expect(config).toMatchSnapshot();
});
