import { default as apply } from "./dist/111.js";
import { default as arrayMap } from "./dist/98.js";
import { default as unzip } from "./unzip.js";
function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }

  var result = unzip(array);

  if (iteratee == null) {
    return result;
  }

  return arrayMap(result, function (group) {
    return apply(iteratee, undefined, group);
  });
}
export { unzipWith as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzk4LmpzBsLAlcKqLi91bnppcC5qcwnCwIGnZGVmYXVsdJShbKl1bnppcFdpdGgRwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaaVhcHBseZICD8AAp2RlZmF1bHTAwJihcgsFwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahhcnJheU1hcJIFDsABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaV1bnppcJIIDcACp2RlZmF1bHTAwJihcgsFwMCRB8DCnKFpARUHCpDAwgLCwMCXoW8BAAsQkMCZoWQAJQzAlA0ODwzAwpihbKl1bnppcFdpdGiSDBLAwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW56aXBXaXRoLmpzmKFyCQnADZELwMKYoXJZBcAOkQfAwpihckUIwA+RBMDCmKFyJwXAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACcDAkQvAwg==
====catalogjs annotation end====*/