#!/usr/bin/env node
const fs = require("fs");
const NodeID3 = require("node-id3");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { createTags } = require("./lib/createTags");

// Source for chaptering info: https://auphonic.com/blog/2013/07/03/chapter-marks-and-enhanced-podcasts/

async function main() {
  const { markers, mp3, cover, title, artist, overwrite } = yargs(
    hideBin(process.argv)
  )
    .option("markers", {
      type: "string",
      description: "Path to Adobe Audition Markers",
    })
    .option("mp3", {
      type: "string",
      description: "Path to mp3 file that needs chaptering",
    })
    .option("cover", {
      type: "string",
      description:
        "Path to an image file to be used as cover art, will be automatically resized to 600x600",
    })
    .option("overwrite", {
      type: "boolean",
      description: "Remove existing tags and overwrite them",
    })
    .option("title", {
      type: "string",
      description: "Add title",
    })
    .option("artist", {
      type: "string",
      description: "Add artist",
    })
    .demandOption(["markers", "mp3"])
    .parse();

  const mp3Buffer = await fs.promises.readFile(mp3);
  const markersText = fs.readFileSync(markers, "utf8");

  const totalTags = await createTags({
    mp3Buffer,
    overwrite,
    markersText,
    title,
    artist,
    cover,
  });

  let success;
  if (overwrite) {
    success = NodeID3.write(totalTags, mp3Buffer);
  } else {
    success = NodeID3.update(totalTags, mp3Buffer);
  }
  const outputName = `${mp3.replace(/\.mp3$/, "")}-chapters.mp3`;
  console.log(`Writing to ${outputName}`);
  if (!success) {
    throw new Error("Failed to write ID3 tags");
  }
  await fs.promises.writeFile(outputName, mp3Buffer);
  console.info("Successfully wrote ID3 tags");
}
main().catch((err) => console.error(err));
