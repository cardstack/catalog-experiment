import { default as toFinite } from "./toFinite.js";
import { default as toNumber } from "./toNumber.js";
var nativeMax = Math.max,
    nativeMin = Math.min;
function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}
function inRange(number, start, end) {
  start = toFinite(start);

  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toFinite(end);
  }

  number = toNumber(number);
  return baseInRange(number, start, end);
}
export { inRange as default };
/*====catalogjs annotation start====
k5KVwq0uL3RvRmluaXRlLmpzA8LAlcKtLi90b051bWJlci5qcwbCwIGnZGVmYXVsdJWhbKdpblJhbmdlGcDA3AAbl6FvAAADwJDAmaFkCQACwJECwMKZoWmodG9GaW5pdGWTAhQVwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaah0b051bWJlcpIFFsABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIEZDAmKFnAAEJDZDAwpmhZAQLCguSCgjAwpmhbKluYXRpdmVNYXiSChDAwMAIkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW5SYW5nZS5qc5ihcgAJwMCRCcDCmaFkBgsMwJIMCMDCmaFsqW5hdGl2ZU1pbpIMD8DAwAiQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJblJhbmdlLmpzmKFyAAnAwJELwMKZoWQBDw7AlQ8QDgsJwMKZoWyrYmFzZUluUmFuZ2WSDhfAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW5SYW5nZS5qc5ihcgkLwA+RDcDCmKFyKgnAEJELwMKYoXIZCcDAkQnAwpehbwEAEhiQwJmhZAAXE8CVFBUWFxPAwpmhbKdpblJhbmdlkhMawMDAwJDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pblJhbmdlLmpzmKFyCQfAFJESwMKYoXIhCMAVkQHAwpihcloIwBaRAcDCmKFyFwjAF5EEwMKYoXITC8DAkQ3AwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAHwMCREsDC
====catalogjs annotation end====*/