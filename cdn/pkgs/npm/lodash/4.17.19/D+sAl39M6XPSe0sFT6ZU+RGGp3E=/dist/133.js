var objectProto = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
  return value === proto;
}
export { isPrototype as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyraXNQcm90b3R5cGUJwMCbl6FvAAABwJDAl6FvAAACCJDAmKFnAAEDBZDAwpmhZAQTBMCSBALAwpmhbKtvYmplY3RQcm90b5IEB8DAwAKQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2lzUHJvdG90eXBlLmpzmKFyAAvAwJEDwMKZoWQBHQbAkwcGA8DCmaFsq2lzUHJvdG90eXBlkgYKwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNQcm90b3R5cGUuanOYoXIJC8AHkQXAwpihcnALwMCRA8DCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAvAwJEFwMI=
====catalogjs annotation end====*/