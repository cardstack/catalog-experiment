import { default as hasPath } from "./dist/15.js";
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}
export { hasIn as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTUuanMDwsCBp2RlZmF1bHSVoWylaGFzSW4NwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmnaGFzUGF0aJICCsAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFB5DAmaFkAEMGwJEGwMKZoWypYmFzZUhhc0lukgYLwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUhhc0luLmpzmKFyCQnAwJEFwMKXoW8BAAgMkMCZoWQABAnAkwoLCcDCmaFspWhhc0lukgkOwMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9oYXNJbi5qc5ihcgkFwAqRCMDCmKFyLAfAC5EBwMKYoXIPCcDAkQXAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAFwMCRCMDC
====catalogjs annotation end====*/