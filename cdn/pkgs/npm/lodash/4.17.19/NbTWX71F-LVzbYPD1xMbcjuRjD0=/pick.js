import { default as basePickBy } from "./dist/12.js";
import { default as hasIn } from "./hasIn.js";
import { default as flatRest } from "./dist/50.js";
function basePick(object, paths) {
  return basePickBy(object, paths, function (value, path) {
    return hasIn(object, path);
  });
}
var pick = flatRest(function (object, paths) {
  return object == null ? {} : basePick(object, paths);
});
export { pick as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMTIuanMDwsCVwqouL2hhc0luLmpzB8LAlcKsLi9kaXN0LzUwLmpzC8LAgadkZWZhdWx0laFspHBpY2sawMDcAByXoW8AAAPAkRTAmaFkCQACBJECwMKZoWmqYmFzZVBpY2tCeZICEMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaVoYXNJbpIGEcABp2RlZmF1bHTAwMCYoXILBcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgMwMCQwMKZoWQJAAoMkQrAwpmhaahmbGF0UmVzdJIKF8ACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgOwMCQwMKXoW8BAA4SkMCZoWQAFw/AkxARD8DCmaFsqGJhc2VQaWNrkg8YwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVBpY2suanOYoXIJCMAQkQ7AwpihchsKwBGRAcDCmKFyNAXAwJEFwMKXoW8BABMZkMCYoWcAARTAkMDCmaFkBAAVwJMVExbAwpmhbKRwaWNrkhUbwMDAE5DZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9waWNrLmpzmKFyAATAFpEUwMKYoWcDExfAkhcYwMKYoXIACMAYkQnAwpihcjsIwMCRDsDCmKFnAQMawJDAwpihZwkLG8CRG8DCmKFyAATAwJEUwMI=
====catalogjs annotation end====*/