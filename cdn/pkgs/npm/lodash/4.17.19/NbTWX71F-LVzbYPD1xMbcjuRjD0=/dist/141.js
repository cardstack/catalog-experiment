import { default as baseSlice } from "./142.js";
function baseWhile(array, predicate, isDrop, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}

  return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
}
export { baseWhile as default };
/*====catalogjs annotation start====
k5GVwqguLzE0Mi5qcwPCwIGnZGVmYXVsdJWhbKliYXNlV2hpbGUKwMCcl6FvAAADwJDAmaFkCQACwJECwMKZoWmpYmFzZVNsaWNlkwIHCMAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQATAQSQwMIAwsDAl6FvAQAFCZDAmaFkAEEGwJMHCAbAwpmhbKliYXNlV2hpbGWSBgvAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlV2hpbGUuanOYoXIJCcAHkQXAwpihcszfCcAIkQHAwpihckEJwMCRAcDCmKFnAQMKwJDAwpihZwkLC8CRC8DCmKFyAAnAwJEFwMI=
====catalogjs annotation end====*/