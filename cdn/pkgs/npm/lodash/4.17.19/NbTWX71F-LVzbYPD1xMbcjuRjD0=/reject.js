import { default as arrayFilter } from "./dist/150.js";
import { default as baseFilter } from "./dist/73.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as negate } from "./negate.js";
function reject(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, negate(baseIteratee(predicate, 3)));
}
export { reject as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzczLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwqsuL25lZ2F0ZS5qcw/CwIGnZGVmYXVsdJWhbKZyZWplY3QZwMDcABuXoW8AAAPAkMCZoWQJAALAkQLAwpmhaathcnJheUZpbHRlcpICFMAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmqYmFzZUZpbHRlcpIFFcABp2RlZmF1bHTAwMCYoXILCsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmsYmFzZUl0ZXJhdGVlkggXwAKnZGVmYXVsdMDAwJihcgsMwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaadpc0FycmF5kgsTwAOnZGVmYXVsdMDAwJihcgsHwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7AwpmhaaZuZWdhdGWSDhbABKdkZWZhdWx0wMDAmKFyCwbAwJENwMKcoWkBFg0QkMDCBMLAwJehbwEAERiQwJmhZAATEsCWExQVFhcSwMKZoWymcmVqZWN0khIawMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZWplY3QuanOYoXIJBsATkRHAwpihcicHwBSRCsDCmKFyDwvAFZEBwMKYoXIDCsAWkQTAwpihchwGwBeRDcDCmKFyAQzAwJEHwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIABsDAkRHAwg==
====catalogjs annotation end====*/