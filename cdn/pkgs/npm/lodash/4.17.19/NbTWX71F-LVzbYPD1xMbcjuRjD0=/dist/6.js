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
k5WVwqcuLzQxLmpzA8LAlcKmLi83LmpzBsLAlcKuLi4vaWRlbnRpdHkuanMJwsCVwq0uLi9pc0FycmF5LmpzDMLAlcKuLi4vcHJvcGVydHkuanMPwsCBp2RlZmF1bHSVoWysYmFzZUl0ZXJhdGVlGcDA3AAbl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYmFzZU1hdGNoZXOSAhbAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFps2Jhc2VNYXRjaGVzUHJvcGVydHmSBRXAAadkZWZhdWx0wMDAmKFyCxPAwJEEwMKcoWkBEQQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqGlkZW50aXR5kggTwAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaadpc0FycmF5kgsUwAOnZGVmYXVsdMDAwJihcgsHwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaahwcm9wZXJ0eZIOF8AEp2RlZmF1bHTAwMCYoXILCMDAkQ3AwpyhaQEZDRCQwMIEwsDAl6FvAQARGJDAmaFkAAoSwJYTFBUWFxLAwpmhbKxiYXNlSXRlcmF0ZWWSEhrAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXRlcmF0ZWUuanOYoXIJDMATkRHAwpihcmcIwBSRB8DCmKFyNAfAFZEKwMKYoXIKE8AWkQTAwpihchcLwBeRAcDCmKFyFwjAwJENwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIADMDAkRHAwg==
====catalogjs annotation end====*/