import { default as baseIsMatch } from "./42.js";
import { default as getMatchData } from "./72.js";
import { default as matchesStrictComparable } from "./155.js";
function baseMatches(source) {
  var matchData = getMatchData(source);

  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }

  return function (object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}
export { baseMatches as default };
/*====catalogjs annotation start====
k5OVwqcuLzQyLmpzA8LAlcKnLi83Mi5qcwfCwJXCqC4vMTU1LmpzC8LAgadkZWZhdWx0laFsq2Jhc2VNYXRjaGVzFMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYmFzZUlzTWF0Y2iSAhLAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmsZ2V0TWF0Y2hEYXRhkgYQwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCAnAwJDAwpmhZAkACgyRCsDCmaFpt21hdGNoZXNTdHJpY3RDb21wYXJhYmxlkgoRwAKnZGVmYXVsdMDAwJihcgsXwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCArAwJDAwpehbwEADhOQwJmhZAAjD8CUEBESD8DCmaFsq2Jhc2VNYXRjaGVzkg8VwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZU1hdGNoZXMuanOYoXIJC8AQkQ7Awpihch0MwBGRBcDCmKFySBfAEpEJwMKYoXJmC8DAkQHAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgALwMCRDsDC
====catalogjs annotation end====*/