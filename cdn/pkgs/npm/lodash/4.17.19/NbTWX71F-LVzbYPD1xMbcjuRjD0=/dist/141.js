import { default as baseSlice } from "./142.js";
function baseWhile(array, predicate, isDrop, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}

  return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
}
export { baseWhile as default };
/*====catalogjs annotation start====
k5GVwqguLzE0Mi5qcwPCwIGnZGVmYXVsdJWhbKliYXNlV2hpbGULwMCdl6FvAAADwJDAmaFkCQACBJECwMKZoWmpYmFzZVNsaWNlkwIICcAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgKwMCQwMKXoW8BAAYKkMCZoWQAQQfAkwgJB8DCmaFsqWJhc2VXaGlsZZIHDMDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VXaGlsZS5qc5ihcgkJwAiRBsDCmKFyzN8JwAmRAcDCmKFyQQnAwJEBwMKYoWcBAwvAkMDCmKFnCQsMwJEMwMKYoXIACcDAkQbAwg==
====catalogjs annotation end====*/