import { default as capitalize } from "./capitalize.js";
import { default as createCompounder } from "./dist/19.js";
var camelCase = createCompounder(function (result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});
export { camelCase as default };
/*====catalogjs annotation start====
k5KVwq8uL2NhcGl0YWxpemUuanMDwsCVwqwuL2Rpc3QvMTkuanMGwsCBp2RlZmF1bHSVoWypY2FtZWxDYXNlD8DA3AARl6FvAAADwJEJwJmhZAkAAsCRAsDCmaFpqmNhcGl0YWxpemWSAg3AAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAGgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpsGNyZWF0ZUNvbXBvdW5kZXKSBQzAAadkZWZhdWx0wMDAmKFyCxDAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmaFsqWNhbWVsQ2FzZZIKEMDAwAiQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY2FtZWxDYXNlLmpzmKFyAAnAC5EJwMKYoWcDEgzAkgwNwMKYoXIAEMANkQTAwpihcloKwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAnAwJEJwMI=
====catalogjs annotation end====*/