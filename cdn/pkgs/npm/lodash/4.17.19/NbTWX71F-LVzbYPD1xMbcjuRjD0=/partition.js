import { default as createAggregator } from "./dist/2.js";
var partition = createAggregator(function (result, value, key) {
  result[key ? 0 : 1].push(value);
}, function () {
  return [[], []];
});
export { partition as default };
/*====catalogjs annotation start====
k5GVwqsuL2Rpc3QvMi5qcwPCwIGnZGVmYXVsdJWhbKlwYXJ0aXRpb24LwMCdl6FvAAADwJEGwJmhZAkAAsCRAsDCmaFpsGNyZWF0ZUFnZ3JlZ2F0b3KSAgnAAKdkZWZhdWx0wMDAmKFyCxDAwJEBwMKcoWkAFgEEkMDCAMLAwJehbwEABQqQwJihZwABBsCQwMKZoWQEAAfAkwcFCMDCmaFsqXBhcnRpdGlvbpIHDMDAwAWQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFydGl0aW9uLmpzmKFyAAnACJEGwMKYoWcDagnAkQnAwpihcgAQwMCRAcDCmKFnAQMLwJDAwpihZwkLDMCRDMDCmKFyAAnAwJEGwMI=
====catalogjs annotation end====*/