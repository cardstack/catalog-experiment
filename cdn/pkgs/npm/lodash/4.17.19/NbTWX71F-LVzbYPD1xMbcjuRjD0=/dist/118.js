var HOT_COUNT = 800,
    HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0,
      lastCalled = 0;
  return function () {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;

    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }

    return func.apply(undefined, arguments);
  };
}
export { shortOut as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyoc2hvcnRPdXQQwMDcABKXoW8AAAHAkMCXoW8AAAIPkMCYoWcAAQMHkMDCmaFkBAYEBZIEAsDCmaFsqUhPVF9DT1VOVJIEDsDAwAKQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3Nob3J0T3V0LmpzmKFyAAnAwJEDwMKZoWQGBQbAkgYCwMKZoWyoSE9UX1NQQU6SBg3AwMACkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zaG9ydE91dC5qc5ihcgAIwMCRBcDCmKFnAQEICpDAwpmhZAQLCcCSCQfAwpmhbKluYXRpdmVOb3eSCQzAwMAHkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zaG9ydE91dC5qc5ihcgAJwMCRCMDCmaFkAcyBC8CXDA0OCwgFA8DCmaFsqHNob3J0T3V0kgsRwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc2hvcnRPdXQuanOYoXIJCMAMkQrAwpihclcJwA2RCMDCmKFyGAjADpEFwMKYoXJgCcDAkQPAwpihZwEDEMCQwMKYoWcJCxHAkRHAwpihcgAIwMCRCsDC
====catalogjs annotation end====*/