#!/usr/bin/env node
const fs = require("fs");
const NodeID3 = require("node-id3");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { createTags } = require("./lib/createTags");

// Source for chaptering info: https://auphonic.com/blog/2013/07/03/chapter-marks-and-enhanced-podcasts/

async function main() {
  const { markers, mp3, cover, title, artist, overwrite, language } = yargs(
    hideBin(process.argv)
  )
    .option("markers", {
      alias: ["m", "chapters"],
      type: "string",
      description: "Path to Adobe Audition Markers",
    })
    .option("mp3", {
      alias: ["i"],
      type: "string",
      description: "Path to mp3 file that needs chaptering",
    })
    .option("cover", {
      alias: ["c"],
      type: "string",
      description:
        "Path to an image file to be used as cover art, will be automatically resized to 600x600",
    })
    .option("overwrite", {
      type: "boolean",
      description: "Remove existing tags and overwrite them",
    })
    .option("title", {
      alias: ["t"],
      type: "string",
      description: "Add title",
    })
    .option("artist", {
      alias: ["a"],
      type: "string",
      description: "Add artist",
    })
    .option("language", {
      alias: ["l"],
      type: "string",
      description:
        "Language of the chapters. Defaults to nld. Must be iso639-2",
    })
    .demandOption(["markers", "mp3"])
    .parse();

  const markersText = fs.readFileSync(markers, "utf8");
  const outputName = `${mp3.replace(/\.mp3$/, "")}-chapters.mp3`;

  console.log(`Writing to ${outputName}`);
  fs.copyFileSync(mp3, outputName);

  const totalTags = await createTags({
    mp3File: mp3,
    overwrite,
    markersText,
    title,
    artist,
    cover,
    language,
  });

  let success;
  if (overwrite) {
    success = NodeID3.write(totalTags, outputName);
  } else {
    success = NodeID3.update(totalTags, outputName);
  }
  if (!success) {
    throw new Error("Failed to write ID3 tags");
  }
  console.info("Successfully wrote ID3 tags");
}
main().catch((err) => console.error(err));
