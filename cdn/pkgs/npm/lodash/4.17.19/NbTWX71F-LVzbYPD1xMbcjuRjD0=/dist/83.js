import { default as arrayFilter } from "./150.js";
import { default as isFunction } from "../isFunction.js";
function baseFunctions(object, props) {
  return arrayFilter(props, function (key) {
    return isFunction(object[key]);
  });
}
export { baseFunctions as default };
/*====catalogjs annotation start====
k5KVwqguLzE1MC5qcwPCwJXCsC4uL2lzRnVuY3Rpb24uanMGwsCBp2RlZmF1bHSVoWytYmFzZUZ1bmN0aW9ucw3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaathcnJheUZpbHRlcpICCsAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQATAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmqaXNGdW5jdGlvbpIFC8ABp2RlZmF1bHTAwMCYoXILCsDAkQTAwpyhaQEbBAeQwMIBwsDAl6FvAQAIDJDAmaFkABYJwJMKCwnAwpmhbK1iYXNlRnVuY3Rpb25zkgkOwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUZ1bmN0aW9ucy5qc5ihcgkNwAqRCMDCmKFyGwvAC5EBwMKYoXIkCsDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgANwMCRCMDC
====catalogjs annotation end====*/