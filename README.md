Qretry [![Build Status](https://travis-ci.org/gre/qretry.png?branch=master)](https://travis-ci.org/gre/qretry)
===

**Qretry** creates a **Promise** from the call function with a retry strategy.

[Checkout the Annotated Source Code](http://gre.github.io/qretry/docs/qretry.html)

Installation
---

```sh
bower install qretry
```

Also available on [NPM](https://npmjs.org/package/qretry).

Usage
---

`Qretry` takes an action *function* and returns a *Promise of result* where result is the first successful value resulting from the action call or a failure if the retry reached his limit (this failure Promise is the last failed Promise from call).

**`Qretry(action: (=> R or Promise[R]), options: Object) => Promise[R]`**

`options` is an object with optional parameters:

* `maxRetry` **(Number)** *optional*: set the maximum retry (default is 5)
* `interval` **(Number)** *optional*: set the initial interval in milliseconds between the first and the second call. (default is 500)
* `intervalMultiplicator` **(Number >= 1)** *optional*: set the multiplicator which increase the interval through tries. (default is 1.5)

### Simple example

```javascript
var promise = Qretry(function () {
  return eventuallyResult();
});
```

### Example with Qajax

```javascript
Qretry(function () {
    return Qajax.getJSON("/item.json");
}, { maxRetry: 3 })
.then(function (item) {
  console.log(item);
});
```

### Random example

```javascript
var startTime = new Date();
Qretry(function () {
  console.log("action at "+((new Date()-startTime)/1000)+"s");
  // this retry system also work with exceptions (Q unifies exceptions as rejected Promise)
  if (Math.random()<0.8) throw "failure";
  return "<success!>";
}, { maxRetry: 8, interval: 100, intervalMultiplicator: 2 })
.then(function (item) {
  console.log(item);
}, function (err) {
  console.error(err);
});
```

will eventually log:

```
action at 0s
action at 0.101s
action at 0.303s
action at 0.704s
action at 1.506s
action at 3.108s
action at 6.31s
<success!>
```

if action fail 6 times and succeed at the 7th time.
