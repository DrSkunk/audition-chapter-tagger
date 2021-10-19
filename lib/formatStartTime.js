function formatStartTime({ hours, minutes, seconds, milliseconds }) {
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
}
exports.formatStartTime = formatStartTime;
