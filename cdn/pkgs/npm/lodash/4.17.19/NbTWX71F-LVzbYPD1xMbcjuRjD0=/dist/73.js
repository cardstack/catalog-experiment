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
k5GVwqcuLzc1LmpzA8LAgadkZWZhdWx0laFsqmJhc2VGaWx0ZXIJwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmoYmFzZUVhY2iSAgfAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAEgEEkMDCAMLAwJehbwEABQiQwJmhZADMmgbAkgcGwMKZoWyqYmFzZUZpbHRlcpIGCsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VGaWx0ZXIuanOYoXIJCsAHkQXAwpihci8IwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAArAwJEFwMI=
====catalogjs annotation end====*/