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
k5OVwqcuLzQyLmpzA8LAlcKnLi83Mi5qcwbCwJXCqC4vMTU1LmpzCcLAgadkZWZhdWx0laFsq2Jhc2VNYXRjaGVzEcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYmFzZUlzTWF0Y2iSAg/AAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGdldE1hdGNoRGF0YZIFDcABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQESBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWm3bWF0Y2hlc1N0cmljdENvbXBhcmFibGWSCA7AAqdkZWZhdWx0wMDAmKFyCxfAwJEHwMKcoWkBEwcKkMDCAsLAwJehbwEACxCQwJmhZAAjDMCUDQ4PDMDCmaFsq2Jhc2VNYXRjaGVzkgwSwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZU1hdGNoZXMuanOYoXIJC8ANkQvAwpihch0MwA6RBMDCmKFySBfAD5EHwMKYoXJmC8DAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgALwMCRC8DC
====catalogjs annotation end====*/