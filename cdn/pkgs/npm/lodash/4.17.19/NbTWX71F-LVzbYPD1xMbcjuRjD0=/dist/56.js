import { default as defineProperty } from "./57.js";
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}
export { baseAssignValue as default };
/*====catalogjs annotation start====
k5GVwqcuLzU3LmpzA8LAgadkZWZhdWx0laFsr2Jhc2VBc3NpZ25WYWx1ZQrAwJyXoW8AAAPAkMCZoWQJAALAkQLAwpmhaa5kZWZpbmVQcm9wZXJ0eZMCBwjAAKdkZWZhdWx0wMDAmKFyCw7AwJEBwMKcoWkAEgEEkMDCAMLAwJehbwEABQmQwJmhZADMpAbAkwcIBsDCmaFsr2Jhc2VBc3NpZ25WYWx1ZZIGC8DAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VBc3NpZ25WYWx1ZS5qc5ihcgkPwAeRBcDCmKFyMw7ACJEBwMKYoXIIDsDAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAPwMCRBcDC
====catalogjs annotation end====*/