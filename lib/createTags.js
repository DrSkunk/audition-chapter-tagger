const NodeID3 = require("node-id3");
const sharp = require("sharp");
const getMP3Duration = require("get-mp3-duration");
const { parseMarkers } = require("./parseMarkers");

async function createTags({
  mp3Buffer,
  overwrite,
  markersText,
  title,
  artist,
  cover,
}) {
  const currentTags = await NodeID3.read(mp3Buffer);
  const duration = getMP3Duration(mp3Buffer);

  if (!overwrite && (currentTags.chapter || currentTags.tableOfContents)) {
    throw new Error("File already has chapter markers");
  }
  const { chapterTag, comment, tableOfContentsElements } = parseMarkers(
    markersText,
    duration
  );

  const totalTags = {
    chapter: chapterTag,
    comment: {
      language: "nld",
      text: comment,
    },
    unsynchronisedLyrics: {
      language: "nld",
      text: comment,
    },
    tableOfContents: [
      {
        elementID: "toc1",
        isOrdered: true,
        elements: tableOfContentsElements,
      },
    ],
  };

  if (title) {
    totalTags.title = title;
  }
  if (artist) {
    totalTags.artist = artist;
  }

  console.info(`Writing ${chapterTag.length} chapters to mp3`);

  if (cover) {
    console.info("Adding cover image");
    totalTags.image = {
      mime: "image/png",
      type: {
        id: 3,
        name: "front cover",
      },
      imageBuffer: await sharp(cover).resize(600, 600).png().toBuffer(),
    };
  }
  return totalTags;
}
exports.createTags = createTags;
