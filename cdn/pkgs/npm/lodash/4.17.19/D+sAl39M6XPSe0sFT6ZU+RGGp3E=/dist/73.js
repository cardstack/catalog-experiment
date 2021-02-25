import { default as baseEach } from "./75.js";
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function (value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}
export { baseFilter as default };
/*====catalogjs annotation start====
k5GVwqcuLzc1LmpzA8LAgadkZWZhdWx0laFsqmJhc2VGaWx0ZXIKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmoYmFzZUVhY2iSAgjAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICcDAkMDCl6FvAQAGCZDAmaFkAMyaB8CSCAfAwpmhbKpiYXNlRmlsdGVykgcLwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUZpbHRlci5qc5ihcgkKwAiRBsDCmKFyLwjAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIACsDAkQbAwg==
====catalogjs annotation end====*/