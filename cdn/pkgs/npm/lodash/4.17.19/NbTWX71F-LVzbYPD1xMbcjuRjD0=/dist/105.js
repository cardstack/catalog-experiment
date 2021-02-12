import { default as baseCreate } from "./106.js";
import { default as getPrototype } from "./137.js";
import { default as isPrototype } from "./133.js";
function initCloneObject(object) {
  return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
export { initCloneObject as default };
/*====catalogjs annotation start====
k5OVwqguLzEwNi5qcwPCwJXCqC4vMTM3LmpzBsLAlcKoLi8xMzMuanMJwsCBp2RlZmF1bHSVoWyvaW5pdENsb25lT2JqZWN0EcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmqYmFzZUNyZWF0ZZICDsAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQATAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmsZ2V0UHJvdG90eXBlkgUPwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARMECZDAwgHCwMCZoWQJAAjAkQjAwpmhaatpc1Byb3RvdHlwZZIIDcACp2RlZmF1bHTAwMCYoXILC8DAkQfAwpyhaQETBwqQwMICwsDAl6FvAQALEJDAmaFkABEMwJQNDg8MwMKZoWyvaW5pdENsb25lT2JqZWN0kgwSwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faW5pdENsb25lT2JqZWN0LmpzmKFyCQ/ADZELwMKYoXJAC8AOkQfAwpihcgsKwA+RAcDCmKFyAQzAwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAD8DAkQvAwg==
====catalogjs annotation end====*/