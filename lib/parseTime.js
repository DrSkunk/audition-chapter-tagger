const timeError = new Error("Invalid time format");
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
    throw timeError;
  }
  const [s, ms] = times[times.length - 1].split(".");
  const seconds = parseInt(s);
  const milliseconds = parseInt(ms);

  const result = { hours, minutes, seconds, milliseconds };
  Object.values(result).forEach((value) => {
    if (isNaN(value)) {
      throw timeError;
    }
  });

  return { hours, minutes, seconds, milliseconds };
}
exports.parseTime = parseTime;
