#!/usr/bin/env node
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const NodeID3 = require("node-id3");
const getMP3Duration = require("get-mp3-duration");
const sharp = require("sharp");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

// Source for chaptering info: https://auphonic.com/blog/2013/07/03/chapter-marks-and-enhanced-podcasts/

async function main() {
  const { markers, mp3, cover, overwrite } = yargs(hideBin(process.argv))
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
    .demandOption(["markers", "mp3"])
    .parse();

  const inputMp3 = mp3;
  const inputCsv = fs
    .readFileSync(markers, "utf8")
    .replace(/[^\x00-\x7F]/g, ""); // remove all non-ascii characters, unfortunately including emojis 😢

  const currentTags = await NodeID3.read(inputMp3);
  const duration = getDuration(inputMp3);

  if (!overwrite && (currentTags.chapter || currentTags.tableOfContents)) {
    throw new Error("File already has chapter markers");
  }

  const chapters = parse(inputCsv, {
    columns: true,
    delimiter: "\t",
    skip_empty_lines: true,
  });
  console.info(`Read ${chapters.length} chapters from csv`);

  if (formatStartTime(parseTime(chapters[0].Start)) > 0) {
    console.info("Adding intro chapter");
    const intro = {
      Name: "Intro",
      Start: "0:00.000",
    };
    chapters.unshift(intro);
  }

  const chapterTag = chapters
    .map((record, i) => ({
      elementID: `chap${i}`,
      startTimeMs: formatStartTime(parseTime(record.Start)),
      tags: {
        title: record.Name,
      },
    }))
    .map((record, i, records) => ({
      ...record,
      endTimeMs:
        i === records.length - 1 ? duration : records[i + 1].startTimeMs,
    }));

  const comment = chapters
    .map(
      (record, i) => `${formatTime(parseTime(record.Start))}: ${record.Name}`
    )
    .join("\n");
  console.info("Writing the following chapter tags:");
  console.info(comment);

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
        elements: chapterTag.map(({ elementID }) => elementID),
      },
    ],
  };

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

  let success;
  if (overwrite) {
    success = NodeID3.write(totalTags, inputMp3);
  } else {
    success = NodeID3.update(totalTags, inputMp3);
  }

  if (!success) {
    throw new Error("Failed to write ID3 tags");
  }
  console.info("Successfully wrote ID3 tags");
}
main().catch((err) => console.error(err));

function parseTime(time) {
  const times = time.split(":");
  let hours = 0;
  let minutes = 0;
  // only minutes, seconds and milliseconds
  if (times.length === 2) {
    minutes = parseInt(times[0]);
  } else if (times.length === 3) {
    // hours, minutes, seconds and milliseconds
    hours = parseInt(times[0]);
    minutes = parseInt(times[1]);
  } else {
    throw new Error("Invalid time format");
  }
  const [s, ms] = times[times.length - 1].split(".");
  const seconds = parseInt(s);
  const milliseconds = parseInt(ms);

  return { hours, minutes, seconds, milliseconds };
}

function formatStartTime({ hours, minutes, seconds, milliseconds }) {
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
}

function formatTime({ hours, minutes, seconds }) {
  const h = hours.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");
  const s = seconds.toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function getDuration(filePath) {
  const buffer = fs.readFileSync(filePath);
  return getMP3Duration(buffer);
}
