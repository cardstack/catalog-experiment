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