(function (definition) {
    if (typeof exports === "object") {
        module.exports = definition(require("q"));
    } else {
        window.Qretry = definition(window.Q);
    }
})(function (Q) {

  // Qretry
  // =====
  // *Creates a Promise from the action function with a retry strategy.*
  //
  // Parameters
  // ---
  //
  // `action` **(Function)**: a function which try to perform an action (if asynchronous, your function must return a Promise).
  //
  // `options` **(Object)**: a few options to define the retry stategy.
  //
  // - `maxRetry` **(Number)** *optional*: set the maximum retry (default is 5)
  // - `interval` **(Number)** *optional*: set the initial interval in milliseconds between the first and the second action call. (default is 500)
  // - `intervalMultiplicator` **(Number >= 1)** *optional*: set the multiplicator which increase the interval through tries. (default is 1.5)
  //
  // Result
  // ---
  //
  // Returns a Promise resulting of a success action() or a maxRetry achieved (The rejected promise will contain the last action error).
  // 
  // ---
  var Qretry = function (action, options) {
    if (typeof action !== "function") {
      throw "Qretry: action must be a function";
    }
    if (!options) {
      options = Qretry.DEFAULT_OPTIONS;
    } else {
      for (var k in Qretry.DEFAULT_OPTIONS) {
        if (Qretry.DEFAULT_OPTIONS.hasOwnProperty(k) && !(k in options)) {
          options[k] = Qretry.DEFAULT_OPTIONS[k];
        }
      }
    }

    return resolver(options.maxRetry, options.interval);

    // Recursive resolver
    function resolver (remainingTry, interval) {
      var result = Q.fcall(action);
      if (remainingTry <= 0) {
        return result;
      }
      // In case of failure, wait the interval, retry the action
      return result.fail(function (e) {
        return Q.delay(interval).then(function () {
          return resolver(remainingTry-1, interval*options.intervalMultiplicator);
        });
      });
    }
  };

  // Default options
  Qretry.DEFAULT_OPTIONS = {
    maxRetry: 5,
    interval: 500,
    intervalMultiplicator: 1.5
  };

  return Qretry;
});

