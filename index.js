#!/usr/bin/env node
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const NodeID3 = require("node-id3");
const getMP3Duration = require("get-mp3-duration");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

// Source for chaptering info: https://auphonic.com/blog/2013/07/03/chapter-marks-and-enhanced-podcasts/

async function main() {
  console.info("");
  const { markers, mp3 } = yargs(hideBin(process.argv))
    .description("Generate a podcast from a CSV file")
    .option("markers", {
      type: "string",
      description: "Path to Adobe Audition Markers",
    })
    .option("mp3", {
      type: "string",
      description: "Path to mp3 file that needs chaptering",
    })
    .demandOption(["markers", "mp3"])
    .parse();

  const inputMp3 = mp3;
  const inputCsv = fs
    .readFileSync(markers, "utf8")
    .replace(/[^\x00-\x7F]/g, ""); // remove all non-ascii characters, unfortunately including emojis 😢

  console.info(`Read ${inputCsv.length} chapters from csv`);

  const currentTags = await NodeID3.read(inputMp3);
  const duration = getDuration(inputMp3);

  if (currentTags.chapter || currentTags.tableOfContents) {
    throw new Error("File already has chapter markers");
  }
  const chapterTag = parse(inputCsv, {
    columns: true,
    delimiter: "\t",
    skip_empty_lines: true,
  })
    .map((record, i) => ({
      elementID: `chap${i}`,
      startTimeMs: parseTime(record.Start),
      tags: {
        title: record.Name,
      },
    }))
    .map((record, i, records) => ({
      ...record,
      endTimeMs:
        i === records.length - 1 ? duration : records[i + 1].startTimeMs,
    }));

  const success = NodeID3.update(totalTags, inputMp3);
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
  if (times.length === 2) {
    minutes = parseInt(times[0]);
    // only minutes, seconds and milliseconds
  } else if (times.length === 3) {
    hours = parseInt(times[0]);
    minutes = parseInt(times[1]);
    // hours, minutes, seconds and milliseconds
  } else {
    throw new Error("Invalid time format");
  }
  const [s, ms] = times[times.length - 1].split(".");
  const seconds = parseInt(s);
  const milliseconds = parseInt(ms);

  return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
}

function getDuration(filePath) {
  const buffer = fs.readFileSync(filePath);
  return getMP3Duration(buffer);
}
