import { default as baseForRight } from "./dist/159.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";
function forInRight(object, iteratee) {
  return object == null ? object : baseForRight(object, castFunction(iteratee), keysIn);
}
export { forInRight as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU5LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwfCwJXCqy4va2V5c0luLmpzC8LAgadkZWZhdWx0laFsqmZvckluUmlnaHQUwMDcABaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlRm9yUmlnaHSSAhDAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmsY2FzdEZ1bmN0aW9ukgYRwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFppmtleXNJbpIKEsACp2RlZmF1bHTAwMCYoXILBsDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgNwMCQwMKXoW8BAA4TkMCZoWQABA/AlBAREg/AwpmhbKpmb3JJblJpZ2h0kg8VwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mb3JJblJpZ2h0LmpzmKFyCQrAEJEOwMKYoXI4DMARkQHAwpihcgkMwBKRBcDCmKFyDAbAwJEJwMKYoWcBAxTAkMDCmKFnCQsVwJEVwMKYoXIACsDAkQ7Awg==
====catalogjs annotation end====*/