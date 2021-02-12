import { default as baseGet } from "./dist/14.js";
import { default as baseProperty } from "./dist/156.js";
import { default as isKey } from "./dist/26.js";
import { default as toKey } from "./dist/27.js";
function basePropertyDeep(path) {
  return function (object) {
    return baseGet(object, path);
  };
}
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
export { property as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMTQuanMDwsCVwq0uL2Rpc3QvMTU2LmpzBsLAlcKsLi9kaXN0LzI2LmpzCcLAlcKsLi9kaXN0LzI3LmpzDMLAgadkZWZhdWx0laFsqHByb3BlcnR5GcDA3AAbl6FvAAADwJDAmaFkCQACwJECwMKZoWmnYmFzZUdldJICEMAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmsYmFzZVByb3BlcnR5kgUVwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaVpc0tleZIIFMACp2RlZmF1bHTAwMCYoXILBcDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmldG9LZXmSCxbAA6dkZWZhdWx0wMDAmKFyCwXAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhGQwJmhZAAWD8CSEA/AwpmhbLBiYXNlUHJvcGVydHlEZWVwkg8XwMDAwJDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVByb3BlcnR5RGVlcC5qc5ihcgkQwBCRDsDCmKFyMQfAwJEBwMKXoW8BABIYkMCZoWQACRPAlRQVFhcTwMKZoWyocHJvcGVydHmSExrAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Byb3BlcnR5LmpzmKFyCQjAFJESwMKYoXISBcAVkQfAwpihcgkMwBaRBMDCmKFyAQXAF5EKwMKYoXIKEMDAkQ7AwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAIwMCREsDC
====catalogjs annotation end====*/