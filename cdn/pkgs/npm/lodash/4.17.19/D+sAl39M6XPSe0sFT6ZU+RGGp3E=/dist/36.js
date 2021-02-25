import { default as LodashWrapper } from "./104.js";
import { default as flatRest } from "./50.js";
import { default as getData } from "./38.js";
import { default as getFuncName } from "./115.js";
import { default as isArray } from "../isArray.js";
import { default as isLaziable } from "./37.js";
var FUNC_ERROR_TEXT = 'Expected a function';
var WRAP_CURRY_FLAG = 8,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256;
function createFlow(fromRight) {
  return flatRest(function (funcs) {
    var length = funcs.length,
        index = length,
        prereq = LodashWrapper.prototype.thru;

    if (fromRight) {
      funcs.reverse();
    }

    while (index--) {
      var func = funcs[index];

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }

      if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
        var wrapper = new LodashWrapper([], true);
      }
    }

    index = wrapper ? index : length;

    while (++index < length) {
      func = funcs[index];
      var funcName = getFuncName(func),
          data = funcName == 'wrapper' ? getData(func) : undefined;

      if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
        wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
      } else {
        wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
      }
    }

    return function () {
      var args = arguments,
          value = args[0];

      if (wrapper && args.length == 1 && isArray(value)) {
        return wrapper.plant(value).value();
      }

      var index = 0,
          result = length ? funcs[index].apply(this, args) : value;

      while (++index < length) {
        result = funcs[index].call(this, result);
      }

      return result;
    };
  });
}
export { createFlow as default };
/*====catalogjs annotation start====
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
====catalogjs annotation end====*/