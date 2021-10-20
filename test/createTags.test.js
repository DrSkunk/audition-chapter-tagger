const fs = require("fs/promises");
const path = require("path");
const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");
const { createTags } = require("../lib/createTags");

// Example MP3 file from https://file-examples.com/index.php/sample-audio-files/sample-mp3-download/

test("ffmpeg tagging", async () => {
  const testFile = path.resolve("test/file_example_MP3_700KB.mp3");
  const testMarkersFile = path.resolve("test/example_markers.csv");
  const mp3Buffer = await fs.readFile(testFile);
  const markersText = await fs.readFile(testMarkersFile, "utf-8");
  const info = await ffprobe(testFile, { path: ffprobeStatic.path });
  console.log(info.streams[0].tags);
  const tags = await createTags({
    mp3Buffer,
    overwrite: false,
    markersText,
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    cover: undefined,
  });
  console.log(tags);
  expect(tags.chapter.length).toBe(3);
  expect(tags.chapter[0].tags.title).toEqual("Intro");
  expect(tags.chapter[0].tags.title).toEqual("Intro");
});
