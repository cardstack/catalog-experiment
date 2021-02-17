import { default as arrayFilter } from "./150.js";
import { default as isFunction } from "../isFunction.js";
function baseFunctions(object, props) {
  return arrayFilter(props, function (key) {
    return isFunction(object[key]);
  });
}
export { baseFunctions as default };
/*====catalogjs annotation start====
k5KVwqguLzE1MC5qcwPCwJXCsC4uL2lzRnVuY3Rpb24uanMHwsCBp2RlZmF1bHSVoWytYmFzZUZ1bmN0aW9ucw/AwNwAEZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2FycmF5RmlsdGVykgIMwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCArAwJDAwpmhZAkABgiRBsDCmaFpqmlzRnVuY3Rpb26SBg3AAadkZWZhdWx0wMDAmKFyCwrAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIEsDAkMDCl6FvAQAKDpDAmaFkABYLwJMMDQvAwpmhbK1iYXNlRnVuY3Rpb25zkgsQwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUZ1bmN0aW9ucy5qc5ihcgkNwAyRCsDCmKFyGwvADZEBwMKYoXIkCsDAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgANwMCRCsDC
====catalogjs annotation end====*/