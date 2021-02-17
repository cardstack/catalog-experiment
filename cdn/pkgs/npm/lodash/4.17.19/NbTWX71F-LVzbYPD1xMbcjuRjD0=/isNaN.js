import { default as isNumber } from "./isNumber.js";
function isNaN0(value) {
  return isNumber(value) && value != +value;
}
export { isNaN0 as default };
/*====catalogjs annotation start====
k5GVwq0uL2lzTnVtYmVyLmpzA8LAgadkZWZhdWx0laFspmlzTmFOMArAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaahpc051bWJlcpICCMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgPwMCQwMKXoW8BAAYJkMCZoWQAHQfAkggHwMKZoWymaXNOYU4wkgcLwMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc05hTi5qc5ihcgkGwAiRBsDCmKFyEwjAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIABsDAkQbAwg==
====catalogjs annotation end====*/