import { default as get } from "../get.js";
function baseAt(object, paths) {
  var index = -1,
      length = paths.length,
      result = Array(length),
      skip = object == null;

  while (++index < length) {
    result[index] = skip ? undefined : get(object, paths[index]);
  }

  return result;
}
export { baseAt as default };
/*====catalogjs annotation start====
k5GVwqkuLi9nZXQuanMDwsCBp2RlZmF1bHSVoWymYmFzZUF0CsDAnJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpo2dldJICCMAAp2RlZmF1bHTAwMCYoXILA8DAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgLwMCQwMKXoW8BAAYJkMCZoWQALwfAkggHwMKZoWymYmFzZUF0kgcLwMDAwJDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUF0LmpzmKFyCQbACJEGwMKYoXLMwQPAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIABsDAkQbAwg==
====catalogjs annotation end====*/