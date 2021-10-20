const fs = require("fs/promises");
const path = require("path");
const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");
const { createTags } = require("../lib/createTags");

// Example MP3 file from https://file-examples.com/index.php/sample-audio-files/sample-mp3-download/

test("ffmpeg tagging", async () => {
  const mp3File = path.resolve("test/file_example_MP3_700KB.mp3");
  const testMarkersFile = path.resolve("test/example_markers.csv");
  const markersText = await fs.readFile(testMarkersFile, "utf-8");
  const info = await ffprobe(mp3File, { path: ffprobeStatic.path });
  console.log(info.streams[0].tags);
  const tags = await createTags({
    mp3File,
    overwrite: false,
    markersText,
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    cover: undefined,
  });
  expect(tags.title).toBe("Never Gonna Give You Up");
  expect(tags.artist).toBe("Rick Astley");
  expect(tags.chapter.length).toBe(3);
  expect(tags.chapter[0].tags.title).toBe("Intro");
  expect(tags.chapter[1].tags.title).toBe("First chapter in the list");
  expect(tags.chapter[2].tags.title).toBe(
    "Second and last chapter in the list"
  );
});

test("language tag", async () => {
  const mp3File = path.resolve("test/file_example_MP3_700KB.mp3");
  const markersText = await fs.readFile(
    path.resolve("test/example_markers.csv"),
    "utf-8"
  );

  const dutchTags = await createTags({
    mp3File,
    overwrite: false,
    markersText,
    cover: undefined,
  });

  expect(dutchTags.comment.language).toBe("nld");
  expect(dutchTags.unsynchronisedLyrics.language).toBe("nld");

  const englishTags = await createTags({
    mp3File,
    overwrite: false,
    markersText,
    cover: undefined,
    language: "eng",
  });

  expect(englishTags.comment.language).toBe("eng");
  expect(englishTags.unsynchronisedLyrics.language).toBe("eng");
});
