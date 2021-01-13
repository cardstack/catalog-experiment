import { default as arrayEach } from "./dist/119.js";
import { default as baseEach } from "./dist/75.js";
import { default as castFunction } from "./dist/108.js";
import { default as isArray } from "./isArray.js";
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}
export { forEach as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTE5LmpzA8LAlcKsLi9kaXN0Lzc1LmpzBsLAlcKtLi9kaXN0LzEwOC5qcwnCwJXCrC4vaXNBcnJheS5qcwzCwIGnZGVmYXVsdJShbKdmb3JFYWNoFcDcABeXoW8AAAPAkQ7AmaFkCQACwJECwMKYoWmpYXJyYXlFYWNokgIRwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGJhc2VFYWNokgUSwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGNhc3RGdW5jdGlvbpIIE8ACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpihaadpc0FycmF5kgsQwAOnZGVmYXVsdMDAmKFyCwfAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhSQwJmhZAAOD8CVEBESEw/AwpihbKdmb3JFYWNokg8WwMDAwNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZvckVhY2guanOYoXIJB8AQkQ7AwpihciYHwBGRCsDCmKFyDwnAEpEBwMKYoXIDCMATkQTAwpihchwMwMCRB8DCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAfAwJEOwMI=
====catalogjs annotation end====*/