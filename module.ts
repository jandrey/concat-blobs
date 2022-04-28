
async function concatBlobs(urls: string[], type: string, object?: boolean) {
  function readFileAsync(blob: Blob) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    }) as unknown as ArrayBuffer;
  }
  const urlBlob = urls.map((uri) =>
    fetch(uri).then((dataUri: Response) => dataUri.blob())
  );
  const urlBlobs: Blob[] = [];
  await Promise.all(urlBlob).then((blob) => {
    urlBlobs.push(...blob);
  });

  async function readAsArrayBuffer() {
    const buffers: ArrayBuffer[] = [];
    if (urlBlobs.length === 0) return;
    for (const blob of urlBlobs) {
      const arrayBuffer = await readFileAsync(blob);
      buffers.push(arrayBuffer);
    }
    return buffers;
  }

  const concatAudio = (buffers: AudioBuffer[]): AudioBuffer => {
    const output = audioContext.createBuffer(
      Math.max(...buffers.map((buffer) => buffer.numberOfChannels)),
      buffers.map((buffer) => buffer.length).reduce((a, b) => a + b, 0),
      audioContext.sampleRate
    );
    let offset = 0;

    buffers.forEach((buffer) => {
      for (
        let channelNumber = 0;
        channelNumber < buffer.numberOfChannels;
        channelNumber++
      ) {
        output
          .getChannelData(channelNumber)
          .set(buffer.getChannelData(channelNumber), offset);
      }

      offset += buffer.length;
    });

    return output;
  };

  function bufferToWave(abuffer: AudioBuffer, len: number, type: string) {
    var numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [],
      i,
      sample,
      offset = 0,
      pos = 0;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    //write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // write 16-bit sample
        pos += 2;
      }
      offset++; // next source sample
    }

    //Create Blob
    return new Blob([buffer], { type });

    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  const buffer = (await readAsArrayBuffer()) as ArrayBuffer[];

  if (buffer?.length === 0) return;

  //create audio context
  const audioContext = new AudioContext();

  // fill some audio
  const buffers = [];
  for (const arrayBuffer of buffer) {
    buffers.push(await audioContext.decodeAudioData(arrayBuffer));
  }

  const audioBuffer = await concatAudio(buffers);
  if (object)
    return {
      audioBufferConcat: audioBuffer,
      audioBuffers: buffers,
      arrayBuffers: await readAsArrayBuffer(),
      urlBlobs,
      audioBlobConcat: bufferToWave(audioBuffer, audioBuffer.length, type),
    };
  return bufferToWave(audioBuffer, audioBuffer.length, type);
}

export default concatBlobs;
