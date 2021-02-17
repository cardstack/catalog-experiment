import { default as copyObject } from "./54.js";
import { default as keys } from "../keys.js";
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}
export { baseAssign as default };
/*====catalogjs annotation start====
k5KVwqcuLzU0LmpzA8LAlcKqLi4va2V5cy5qcwfCwIGnZGVmYXVsdJWhbKpiYXNlQXNzaWduD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmqY29weU9iamVjdJICDMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaaRrZXlzkgYNwAGnZGVmYXVsdMDAwJihcgsEwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCAzAwJDAwpehbwEACg6QwJmhZAAUC8CTDA0LwMKZoWyqYmFzZUFzc2lnbpILEMDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VBc3NpZ24uanOYoXIJCsAMkQrAwpihciYKwA2RAcDCmKFyCQTAwJEFwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIACsDAkQrAwg==
====catalogjs annotation end====*/