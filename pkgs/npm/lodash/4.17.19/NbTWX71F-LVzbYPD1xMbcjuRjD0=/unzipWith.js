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
k5OVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzk4LmpzBsLAlcKqLi91bnppcC5qcwnCwIGnZGVmYXVsdJShbKl1bnppcFdpdGgRwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFppWFwcGx5kgIPwACnZGVmYXVsdMDAmKFyCwXAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGFycmF5TWFwkgUOwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFppXVuemlwkggNwAKnZGVmYXVsdMDAmKFyCwXAwJEHwMKcoWkBFQcKkMDCAsLAwJehbwEACxCQwJmhZAAlDMCUDQ4PDMDCmKFsqXVuemlwV2l0aJIMEsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bnppcFdpdGguanOYoXIJCcANkQvAwpihclkFwA6RB8DCmKFyRQjAD5EEwMKYoXInBcDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAJwMCRC8DC
====catalogjs annotation end====*/