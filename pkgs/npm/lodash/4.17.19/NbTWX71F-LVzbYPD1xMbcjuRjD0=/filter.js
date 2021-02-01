import { default as arrayFilter } from "./dist/150.js";
import { default as baseFilter } from "./dist/73.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}
export { filter as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzczLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCBp2RlZmF1bHSUoWymZmlsdGVyFcDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpihaathcnJheUZpbHRlcpICEcAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaapiYXNlRmlsdGVykgUSwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGJhc2VJdGVyYXRlZZIIE8ACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpihaadpc0FycmF5kgsQwAOnZGVmYXVsdMDAmKFyCwfAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhSQwJmhZAASD8CVEBESEw/AwpihbKZmaWx0ZXKSDxbAwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmlsdGVyLmpzmKFyCQbAEJEOwMKYoXInB8ARkQrAwpihcg8LwBKRAcDCmKFyAwrAE5EEwMKYoXIcDMDAkQfAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAGwMCRDsDC
====catalogjs annotation end====*/