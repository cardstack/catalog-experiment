import { default as createAggregator } from "./dist/2.js";
var partition = createAggregator(function (result, value, key) {
  result[key ? 0 : 1].push(value);
}, function () {
  return [[], []];
});
export { partition as default };
/*====catalogjs annotation start====
k5GVwqsuL2Rpc3QvMi5qcwPCwIGnZGVmYXVsdJWhbKlwYXJ0aXRpb24MwMCel6FvAAADwJEHwJmhZAkAAgSRAsDCmaFpsGNyZWF0ZUFnZ3JlZ2F0b3KSAgrAAKdkZWZhdWx0wMDAmKFyCxDAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIDcDAkMDCl6FvAQAGC5DAmKFnAAEHwJDAwpmhZAQACMCTCAYJwMKZoWypcGFydGl0aW9ukggNwMDABpDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYXJ0aXRpb24uanOYoXIACcAJkQfAwpihZwNqCsCRCsDCmKFyABDAwJEBwMKYoWcBAwzAkMDCmKFnCQsNwJENwMKYoXIACcDAkQfAwg==
====catalogjs annotation end====*/