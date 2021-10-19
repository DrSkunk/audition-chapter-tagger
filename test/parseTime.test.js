const { parseTime } = require("../lib/parseTime");

test("parse marker timestring", async () => {
  expect(parseTime("0:00.000")).toEqual({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  expect(parseTime("31:13.099")).toEqual({
    hours: 0,
    minutes: 31,
    seconds: 13,
    milliseconds: 99,
  });

  expect(parseTime("1:53:26.586")).toEqual({
    hours: 1,
    minutes: 53,
    seconds: 26,
    milliseconds: 586,
  });

  expect(() => parseTime("0.0")).toThrow("Invalid time format");
  expect(() => parseTime("one:two:three.four")).toThrow("Invalid time format");
});
