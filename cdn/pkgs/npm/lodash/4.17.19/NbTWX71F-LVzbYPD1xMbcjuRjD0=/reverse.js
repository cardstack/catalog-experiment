var arrayProto = Array.prototype;
var nativeReverse = arrayProto.reverse;
function reverse(array) {
  return array == null ? array : nativeReverse.call(array);
}
export { reverse as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyncmV2ZXJzZQ3AwJ+XoW8AAAHAkMCXoW8AAAIMkMCYoWcAAQMFkMDCmaFkBBIEwJIEAsDCmaFsqmFycmF5UHJvdG+SBAjAwMACkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3JldmVyc2UuanOYoXIACsDAkQPAwpihZwEBBgmQwMKZoWQECAfAlAgHBQPAwpmhbK1uYXRpdmVSZXZlcnNlkgcLwMDABZDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZXZlcnNlLmpzmKFyAA3ACJEGwMKYoXIDCsDAkQPAwpmhZAEPCsCTCwoGwMKZoWyncmV2ZXJzZZIKDsDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmV2ZXJzZS5qc5ihcgkHwAuRCcDCmKFyKw3AwJEGwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAB8DAkQnAwg==
====catalogjs annotation end====*/