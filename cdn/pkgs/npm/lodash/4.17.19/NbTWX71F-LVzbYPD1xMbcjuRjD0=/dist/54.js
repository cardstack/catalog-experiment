import { default as assignValue } from "./55.js";
import { default as baseAssignValue } from "./56.js";
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }

    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }

  return object;
}
export { copyObject as default };
/*====catalogjs annotation start====
k5KVwqcuLzU1LmpzA8LAlcKnLi81Ni5qcwbCwIGnZGVmYXVsdJWhbKpjb3B5T2JqZWN0DcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2Fzc2lnblZhbHVlkgILwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaa9iYXNlQXNzaWduVmFsdWWSBQrAAadkZWZhdWx0wMDAmKFyCw/AwJEEwMKcoWkBEgQHkMDCAcLAwJehbwEACAyQwJmhZAA2CcCTCgsJwMKZoWyqY29weU9iamVjdJIJDsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NvcHlPYmplY3QuanOYoXIJCsAKkQjAwpihcs0Bhw/AC5EEwMKYoXIsC8DAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAKwMCRCMDC
====catalogjs annotation end====*/