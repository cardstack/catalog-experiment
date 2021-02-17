import { default as baseFindIndex } from "./124.js";
import { default as baseIsNaN } from "./125.js";
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }

  return -1;
}
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
export { baseIndexOf as default };
/*====catalogjs annotation start====
k5KVwqguLzEyNC5qcwPCwJXCqC4vMTI1LmpzB8LAgadkZWZhdWx0laFsq2Jhc2VJbmRleE9mE8DA3AAVl6FvAAADwJDAmaFkCQACBJECwMKZoWmtYmFzZUZpbmRJbmRleJICEMAAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgKwMCQwMKZoWQJAAYIkQbAwpmhaaliYXNlSXNOYU6SBhHAAadkZWZhdWx0wMDAmKFyCwnAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcICsDAkMDCl6FvAQAKDJDAmaFkAMzDC8CRC8DCmaFsrXN0cmljdEluZGV4T2aSCw/AwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zdHJpY3RJbmRleE9mLmpzmKFyCQ3AwJEKwMKXoW8BAA0SkMCZoWQADw7AlA8QEQ7AwpmhbKtiYXNlSW5kZXhPZpIOFMDAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJbmRleE9mLmpzmKFyCQvAD5ENwMKYoXI3DcAQkQrAwpihchwNwBGRAcDCmKFyCAnAwJEFwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIAC8DAkQ3Awg==
====catalogjs annotation end====*/