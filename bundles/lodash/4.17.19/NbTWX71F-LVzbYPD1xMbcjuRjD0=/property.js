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
k5SVwqwuL2Rpc3QvMTQuanMDwsCVwq0uL2Rpc3QvMTU2LmpzBsLAlcKsLi9kaXN0LzI2LmpzCcLAlcKsLi9kaXN0LzI3LmpzDMLAgadkZWZhdWx0lKFsqHByb3BlcnR5GcDcABuXoW8AAAPAkg4SwJmhZAkAAsCRAsDCmKFpp2Jhc2VHZXSSAhDAAKdkZWZhdWx0wMCYoXILB8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsYmFzZVByb3BlcnR5kgUVwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFppWlzS2V5kggUwAKnZGVmYXVsdMDAmKFyCwXAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFppXRvS2V5kgsWwAOnZGVmYXVsdMDAmKFyCwXAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhGQwJmhZAAWD8CSEA/AwpihbLBiYXNlUHJvcGVydHlEZWVwkg8XwMDAwNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUHJvcGVydHlEZWVwLmpzmKFyCRDAEJEOwMKYoXIxB8DAkQHAwpehbwEAEhiQwJmhZAAJE8CVFBUWFxPAwpihbKhwcm9wZXJ0eZITGsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wcm9wZXJ0eS5qc5ihcgkIwBSREsDCmKFyEgXAFZEHwMKYoXIJDMAWkQTAwpihcgEFwBeRCsDCmKFyChDAwJEOwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIACMDAkRLAwg==
====catalogjs annotation end====*/