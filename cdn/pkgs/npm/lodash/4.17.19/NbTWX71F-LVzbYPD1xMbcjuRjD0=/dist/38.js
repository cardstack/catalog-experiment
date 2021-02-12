import { default as metaMap } from "./39.js";
import { default as noop } from "../noop.js";
var getData = !metaMap ? noop : function (func) {
  return metaMap.get(func);
};
export { getData as default };
/*====catalogjs annotation start====
k5KVwqcuLzM5LmpzA8LAlcKqLi4vbm9vcC5qcwbCwIGnZGVmYXVsdJWhbKdnZXREYXRhD8DA3AARl6FvAAADwJDAmaFkCQACwJECwMKZoWmnbWV0YU1hcJMCCw3AAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFppG5vb3CSBQzAAadkZWZhdWx0wMDAmKFyCwTAwJEEwMKcoWkBFQQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEDQrAlQsMDQoIwMKZoWynZ2V0RGF0YZIKEMDAwAiQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldERhdGEuanOYoXIAB8ALkQnAwpihcgQHwAyRAcDCmKFyAwTADZEEwMKYoXIeB8DAkQHAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAHwMCRCcDC
====catalogjs annotation end====*/