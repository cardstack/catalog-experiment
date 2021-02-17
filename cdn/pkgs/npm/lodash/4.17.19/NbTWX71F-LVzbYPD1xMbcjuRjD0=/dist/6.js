import { default as baseMatches } from "./41.js";
import { default as baseMatchesProperty } from "./7.js";
import { default as identity } from "../identity.js";
import { default as isArray } from "../isArray.js";
import { default as property } from "../property.js";
function baseIteratee(value) {
  if (typeof value == 'function') {
    return value;
  }

  if (value == null) {
    return identity;
  }

  if (typeof value == 'object') {
    return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }

  return property(value);
}
export { baseIteratee as default };
/*====catalogjs annotation start====
k5WVwqcuLzQxLmpzA8LAlcKmLi83LmpzB8LAlcKuLi4vaWRlbnRpdHkuanMLwsCVwq0uLi9pc0FycmF5LmpzD8LAlcKuLi4vcHJvcGVydHkuanMTwsCBp2RlZmF1bHSVoWysYmFzZUl0ZXJhdGVlHsDA3AAgl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYmFzZU1hdGNoZXOSAhvAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmzYmFzZU1hdGNoZXNQcm9wZXJ0eZIGGsABp2RlZmF1bHTAwMCYoXILE8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgIwMCQwMKZoWQJAAoMkQrAwpmhaahpZGVudGl0eZIKGMACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgQwMCQwMKZoWQJAA4QkQ7Awpmhaadpc0FycmF5kg4ZwAOnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA/AwJDAwpmhZAkAEhSREsDCmaFpqHByb3BlcnR5khIcwASnZGVmYXVsdMDAwJihcgsIwMCREcDCnKFpAQERFZEUwMIEwsDAmKFnCBDAwJDAwpehbwEAFh2QwJmhZAAKF8CWGBkaGxwXwMKZoWysYmFzZUl0ZXJhdGVlkhcfwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUl0ZXJhdGVlLmpzmKFyCQzAGJEWwMKYoXJnCMAZkQnAwpihcjQHwBqRDcDCmKFyChPAG5EFwMKYoXIXC8AckQHAwpihchcIwMCREcDCmKFnAQMewJDAwpihZwkLH8CRH8DCmKFyAAzAwJEWwMI=
====catalogjs annotation end====*/