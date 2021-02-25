import { default as baseCreate } from "./106.js";
import { default as getPrototype } from "./137.js";
import { default as isPrototype } from "./133.js";
function initCloneObject(object) {
  return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
export { initCloneObject as default };
/*====catalogjs annotation start====
k5OVwqguLzEwNi5qcwPCwJXCqC4vMTM3LmpzB8LAlcKoLi8xMzMuanMLwsCBp2RlZmF1bHSVoWyvaW5pdENsb25lT2JqZWN0FMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmqYmFzZUNyZWF0ZZICEcAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgKwMCQwMKZoWQJAAYIkQbAwpmhaaxnZXRQcm90b3R5cGWSBhLAAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcICsDAkMDCmaFkCQAKDJEKwMKZoWmraXNQcm90b3R5cGWSChDAAqdkZWZhdWx0wMDAmKFyCwvAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcICsDAkMDCl6FvAQAOE5DAmaFkABEPwJQQERIPwMKZoWyvaW5pdENsb25lT2JqZWN0kg8VwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faW5pdENsb25lT2JqZWN0LmpzmKFyCQ/AEJEOwMKYoXJAC8ARkQnAwpihcgsKwBKRAcDCmKFyAQzAwJEFwMKYoWcBAxTAkMDCmKFnCQsVwJEVwMKYoXIAD8DAkQ7Awg==
====catalogjs annotation end====*/