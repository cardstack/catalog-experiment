import { default as isObject } from "../isObject.js";
var objectCreate = Object.create;
var baseCreate = function () {
  function object() {}

  return function (proto) {
    if (!isObject(proto)) {
      return {};
    }

    if (objectCreate) {
      return objectCreate(proto);
    }

    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();
export { baseCreate as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc09iamVjdC5qcwPCwIGnZGVmYXVsdJWhbKpiYXNlQ3JlYXRlEMDA3AASl6FvAAADwJEJwJmhZAkAAsCRAsDCmaFpqGlzT2JqZWN0kgIMwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABkBBJDAwgDCwMCXoW8BAAUPkMCYoWcAAQYIkMDCmaFkBBAHwJIHBcDCmaFsrG9iamVjdENyZWF0ZZMHDQ7AwMAFkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlQ3JlYXRlLmpzmKFyAAzAwJEGwMKYoWcBAQnAkMDCmaFkBAAKwJQKCAsGwMKZoWyqYmFzZUNyZWF0ZZIKEcDAwAiQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VDcmVhdGUuanOYoXIACsALkQnAwpihZwPMigzAkwwNDsDCmKFySwjADZEBwMKYoXIrDMAOkQbAwpihchEMwMCRBsDCmKFnAQMQwJDAwpihZwkLEcCREcDCmKFyAArAwJEJwMI=
====catalogjs annotation end====*/