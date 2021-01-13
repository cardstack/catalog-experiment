import { default as baseAssign } from "./dist/52.js";
import { default as baseCreate } from "./dist/106.js";
function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties == null ? result : baseAssign(result, properties);
}
export { create as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTIuanMDwsCVwq0uL2Rpc3QvMTA2LmpzBsLAgadkZWZhdWx0lKFspmNyZWF0ZQ3An5ehbwAAA8CRCMCZoWQJAALAkQLAwpihaapiYXNlQXNzaWdukgILwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmJhc2VDcmVhdGWSBQrAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIDJDAmaFkABcJwJMKCwnAwpihbKZjcmVhdGWSCQ7AwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY3JlYXRlLmpzmKFyCQbACpEIwMKYoXIpCsALkQTAwpihcjQKwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAbAwJEIwMI=
====catalogjs annotation end====*/