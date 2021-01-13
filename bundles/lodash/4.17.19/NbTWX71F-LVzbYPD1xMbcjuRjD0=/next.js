import { default as toArray } from "./toArray.js";
function wrapperNext() {
  if (this.__values__ === undefined) {
    this.__values__ = toArray(this.value());
  }

  var done = this.__index__ >= this.__values__.length,
      value = done ? undefined : this.__values__[this.__index__++];
  return {
    'done': done,
    'value': value
  };
}
export { wrapperNext as default };
/*====catalogjs annotation start====
k5GVwqwuL3RvQXJyYXkuanMDwsCBp2RlZmF1bHSUoWyrd3JhcHBlck5leHQJwJuXoW8AAAPAkQXAmaFkCQACwJECwMKYoWmndG9BcnJheZICB8AAp2RlZmF1bHTAwJihcgsHwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUIkMCZoWQAzMYGwJIHBsDCmKFsq3dyYXBwZXJOZXh0kgYKwMDAwNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL25leHQuanOYoXIJC8AHkQXAwpihckIHwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAvAwJEFwMI=
====catalogjs annotation end====*/