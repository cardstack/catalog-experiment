var FUNC_ERROR_TEXT = 'Expected a function';
function baseDelay(func, wait, args) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  return setTimeout(function () {
    func.apply(undefined, args);
  }, wait);
}
export { baseDelay as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypYmFzZURlbGF5CcDAm5ehbwAAAcCQwJehbwAAAgiQwJihZwABAwWQwMKZoWQEGATAkgQCwMKZoWyvRlVOQ19FUlJPUl9URVhUkgQHwMDAApDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZURlbGF5LmpzmKFyAA/AwJEDwMKZoWQBWAbAkwcGA8DCmaFsqWJhc2VEZWxheZIGCsDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VEZWxheS5qc5ihcgkJwAeRBcDCmKFyUA/AwJEDwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIACcDAkQXAwg==
====catalogjs annotation end====*/