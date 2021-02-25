var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
export { isLength as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyoaXNMZW5ndGgJwMCbl6FvAAABwJDAl6FvAAACCJDAmKFnAAEDBZDAwpmhZAQTBMCSBALAwpmhbLBNQVhfU0FGRV9JTlRFR0VSkgQHwMDAApDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0xlbmd0aC5qc5ihcgAQwMCRA8DCmaFkAQMGwJMHBgPAwpmhbKhpc0xlbmd0aJIGCsDAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNMZW5ndGguanOYoXIJCMAHkQXAwpihclgQwMCRA8DCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAjAwJEFwMI=
====catalogjs annotation end====*/