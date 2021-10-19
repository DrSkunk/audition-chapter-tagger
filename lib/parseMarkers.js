const parse = require("csv-parse/lib/sync");
const { formatTime } = require("./formatTime");
const { formatStartTime } = require("./formatStartTime");
const { parseTime } = require("./parseTime");

function parseMarkers(inputCsv, duration) {
  // remove all non-ascii characters, unfortunately including emojis 😢
  const cleanCsv = inputCsv.replace(/[^\x00-\x7F]/g, "");

  const chapters = parse(cleanCsv, {
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
    .map((record) => `${formatTime(parseTime(record.Start))}: ${record.Name}`)
    .join("\n");
  console.info("Writing the following chapter tags:");
  console.info(comment);

  const tableOfContentsElements = chapterTag.map(({ elementID }) => elementID);
  return { chapterTag, comment, tableOfContentsElements };
}
exports.parseMarkers = parseMarkers;
