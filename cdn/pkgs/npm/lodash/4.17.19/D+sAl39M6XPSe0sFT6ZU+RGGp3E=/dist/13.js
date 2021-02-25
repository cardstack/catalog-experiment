import { default as baseGet } from "./14.js";
import { default as baseSet } from "./16.js";
function baseUpdate(object, path, updater, customizer) {
  return baseSet(object, path, updater(baseGet(object, path)), customizer);
}
export { baseUpdate as default };
/*====catalogjs annotation start====
k5KVwqcuLzE0LmpzA8LAlcKnLi8xNi5qcwfCwIGnZGVmYXVsdJWhbKpiYXNlVXBkYXRlD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmnYmFzZUdldJICDcAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaadiYXNlU2V0kgYMwAGnZGVmYXVsdMDAwJihcgsHwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCAnAwJDAwpehbwEACg6QwJmhZAAfC8CTDA0LwMKZoWyqYmFzZVVwZGF0ZZILEMDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VVcGRhdGUuanOYoXIJCsAMkQrAwpihci8HwA2RBcDCmKFyFwfAwJEBwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIACsDAkQrAwg==
====catalogjs annotation end====*/