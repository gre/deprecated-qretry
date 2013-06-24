
function checkNotSuccess (res) { console.log(res); throw "The result should never be successful!"; }
function checkSuccess (res) { ok(true, "Successful promise."); }
function checkNotFailure (err) { console.log(err); throw "Unexpected failure: "+err; }
function checkValue (value) { 
  return function (v) {
    deepEqual(value, v, "result is "+value);
  }
};

function failing (nbFail, call) {
  var i = 0;
  return function () {
    if (++i <= nbFail) {
      throw "FAIL-"+(i-1);
    }
    return call();
  };
}

asyncTest("test first-time Promise", 4, function() {
  Q.all([
    Qretry(function(){ return Q.delay(500); }).then(checkSuccess, checkNotFailure),
    Qretry(function(){ return Q.resolve(42); }).then(checkValue(42), checkNotFailure),
    Qretry(function(){ return 42; }).then(checkValue(42), checkNotFailure),
    Qretry(function(){ return 42; }, { maxRetry: 1 }).then(checkValue(42), checkNotFailure)
  ]).fin(start);
});

asyncTest("test second time Promise", 3, function() {
  Q.all([
    Qretry(failing(1, function(){ return Q.resolve(42); })).then(checkValue(42), checkNotFailure),
    Qretry(failing(1, function(){ return Q.resolve(42); }), { maxRetry: 1 }).then(checkValue(42), checkNotFailure),
    Qretry(failing(1, function(){ return Q.resolve(42); }), { maxRetry: 0 }).then(checkNotSuccess, checkValue("FAIL-0"))
  ]).fin(start);
});

asyncTest("test multiple time Promise", 3, function() {
  Q.all([
    Qretry(failing(2, function(){ return Q.resolve(42); }), { maxRetry: 10 }).then(checkValue(42), checkNotFailure),
    Qretry(failing(19, function(){ return Q.resolve(42); }), { maxRetry: 20, interval: 0 }).then(checkValue(42), checkNotFailure),
    Qretry(failing(20, function(){ return Q.resolve(42); }), { maxRetry: 9, interval: 100, intervalMultiplicator: 1 }).then(checkNotSuccess, checkValue("FAIL-9"))
  ]).fin(start);
});

