//import concatBlobs from "./module";

import concatBlobs from "./module";

describe("concatBlobs", () => {
  const type: string = 'audio/mp3'
  const blob1: string = "./fixtures/audio1.mp3"
  const blob2: string = "./fixtures/audio2.mp3"
  const blobs: string[] = [blob1, blob2]
  test("concat two blobs", async () => {
    const assertion = await concatBlobs(blobs, type)
      expect(assertion).toBe("true")
    // expect(concatBlobs([], "hello!")).toBe("( o ‿ ~ ✿) hello!");
  });
});
