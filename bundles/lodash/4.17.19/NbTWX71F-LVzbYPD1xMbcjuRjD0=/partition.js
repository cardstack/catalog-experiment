import { default as createAggregator } from "./dist/2.js";
var partition = createAggregator(function (result, value, key) {
  result[key ? 0 : 1].push(value);
}, function () {
  return [[], []];
});
export { partition as default };
/*====catalogjs annotation start====
k5GVwqsuL2Rpc3QvMi5qcwPCwIGnZGVmYXVsdJShbKlwYXJ0aXRpb24LwJ2XoW8AAAPAkQbAmaFkCQACwJECwMKYoWmwY3JlYXRlQWdncmVnYXRvcpICCcAAp2RlZmF1bHTAwJihcgsQwMCRAcDCnKFpABYBBJDAwgDCwMCXoW8BAAUKkMCYoWcAAQbAkMDCmaFkBAAHwJMHBQjAwpihbKlwYXJ0aXRpb26SBwzAwMAF2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFydGl0aW9uLmpzmKFyAAnACJEGwMKYoWcDagnAkgkGwMKYoXIAEMDAkQHAwpihZwEDC8CQwMKYoWcJCwzAkQzAwpihcgAJwMCRBsDC
====catalogjs annotation end====*/