(function(){

  // Qretry
  // =====
  // *Creates a Promise from the call function with a retry strategy.*
  //
  // Parameters
  // ---
  //
  // `call` **(Function)**: a function which try to perform an action (if asynchronous, your function must return a Promise).
  //
  // `options` **(Object)**: a few options to define the retry stategy.
  //
  // - `maxRetry` **(Number)** *optional*: set the maximum retry (default is 5)
  // - `interval` **(Number)** *optional*: set the initial interval in milliseconds between the first and the second call. (default is 500)
  // - `intervalMultiplicator` **(Number >= 1)** *optional*: set the multiplicator which increase the interval through tries. (default is 1.5)
  //
  // Result
  // ---
  //
  // Returns a Promise resulting of a success call() or a maxRetry achieved (The rejected promise will contain the last call error).
  // 
  // ---
  var Qretry = function (call, options) {
    if (typeof call !== "function") {
      throw "Qretry: call must be a function";
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

    // Recursive resolver
    function resolver (remainingTry, interval) {
      var result = Q.fcall(call);
      if (remainingTry <= 0) {
        return result;
      }
      // In case of failure, wait the interval, retry the call
      return result.fail(function (e) {
        return Q.delay(interval).then(function () {
          return resolver(remainingTry-1, interval*options.intervalMultiplicator);
        });
      });
    }

    return resolver(options.maxRetry, options.interval);
  };

  // Default options
  Qretry.DEFAULT_OPTIONS = {
    maxRetry: 5,
    interval: 500,
    intervalMultiplicator: 1.5
  };

  window.Qretry = Qretry;

}());
