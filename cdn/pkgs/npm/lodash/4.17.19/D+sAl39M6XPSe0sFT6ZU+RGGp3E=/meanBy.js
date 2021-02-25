import { default as baseIteratee } from "./dist/6.js";
import { default as baseMean } from "./dist/167.js";
function meanBy(array, iteratee) {
  return baseMean(array, baseIteratee(iteratee, 2));
}
export { meanBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNjcuanMHwsCBp2RlZmF1bHSVoWymbWVhbkJ5D8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmsYmFzZUl0ZXJhdGVlkgINwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA3AwJDAwpmhZAkABgiRBsDCmaFpqGJhc2VNZWFukgYMwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEACg6QwJmhZAARC8CTDA0LwMKZoWymbWVhbkJ5kgsQwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tZWFuQnkuanOYoXIJBsAMkQrAwpihch0IwA2RBcDCmKFyCAzAwJEBwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIABsDAkQrAwg==
====catalogjs annotation end====*/