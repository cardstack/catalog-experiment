import { default as createCompounder } from "./dist/19.js";
import { default as upperFirst } from "./upperFirst.js";
var startCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + upperFirst(word);
});
export { startCase as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMTkuanMDwsCVwq8uL3VwcGVyRmlyc3QuanMGwsCBp2RlZmF1bHSVoWypc3RhcnRDYXNlD8DA3AARl6FvAAADwJEJwJmhZAkAAsCRAsDCmaFpsGNyZWF0ZUNvbXBvdW5kZXKSAgzAAKdkZWZhdWx0wMDAmKFyCxDAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqnVwcGVyRmlyc3SSBQ3AAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBGgQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmaFsqXN0YXJ0Q2FzZZIKEMDAwAiQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc3RhcnRDYXNlLmpzmKFyAAnAC5EJwMKYoWcDCgzAkgwNwMKYoXIAEMANkQHAwpihckkKwMCRBMDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAnAwJEJwMI=
====catalogjs annotation end====*/