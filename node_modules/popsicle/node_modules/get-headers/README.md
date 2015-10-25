# Get Headers

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Retrieve all HTTP(s) headers as an object with original casing.

## Installation

```sh
npm install get-headers --save
```

## Usage

### Parse

Parse a headers string. Useful for `XMLHttpRequest` instances.

```js
import { parse } from 'get-headers'

parse(xhr.getAllResponseHeaders()) //=> {}
```

### HTTP

Parse headers from `http` responses. Works properly with node >= 0.12 (when the `rawHeaders` property was released) and falls back to normal headers on lower versions.

```js
import { get } from 'http'
import { http } from 'get-headers'

get('http://example.com', (res) => {
  http(res) //=> { 'Accept-Ranges': 'bytes', 'Cache-Control': 'max-age=604800', 'Content-Type': 'text/html', Date: 'Mon, 17 Aug 2015 19:53:03 GMT', Etag: '"359670651"', Expires: 'Mon, 24 Aug 2015 19:53:03 GMT', 'Last-Modified': 'Fri, 09 Aug 2013 23:54:35 GMT', Server: 'ECS (rhv/818F)', 'X-Cache': 'HIT', 'x-ec-custom-error': '1', 'Content-Length': '1270', Connection: 'close' }
})
```

### Array

Parse an array of headers (E.g. `rawHeaders`). Every odd must be the header name and evens the header value.

```js
import { array } from 'get-headers'

array(['Content-Type', 'application/json']) //=> { 'Content-Type': 'application/json' }
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/get-headers.svg?style=flat
[npm-url]: https://npmjs.org/package/get-headers
[downloads-image]: https://img.shields.io/npm/dm/get-headers.svg?style=flat
[downloads-url]: https://npmjs.org/package/get-headers
[travis-image]: https://img.shields.io/travis/blakeembrey/get-headers.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/get-headers
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/get-headers.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/get-headers?branch=master
