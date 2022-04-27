[action-image]: https://github.com/cezaraugusto/concat-blobs/workflows/CI/badge.svg
[action-url]: https://github.com/cezaraugusto/concat-blobs/actions
[npm-image]: https://img.shields.io/npm/v/concat-blobs.svg
[npm-url]: https://npmjs.org/package/concat-blobs


> Concatanate blobs into a single blobs

### Installation

```
# node_modules/concat-blobs will include this repo
npm install concat-blobs
```

## Usage

```js
import concatBlobs from "concat-blobs";

const resultBlobs = concatBlobs(array_of_urls, blob_type);
```

## API

### concatBlobs(array_of_urls, blob_type, object?)

#### array_of_urls -> string with url from audio. Example: ['fixtures/audio1.mp3', 'fixtures/audio2.mp3']

Type: `array`

#### blob_type -> type audio. Examples: 'audio/mpeg', 'audio/wav', 'audio/ogg'

Type: `string`

#### object? -> return { arrayBuffers, audioBlobConcat, audioBufferConcat, audioBuffers, urlBlobs }

Type: `boolean`

## License

MIT (c) Jandrey Oliveira.
