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

**Qretry(action: (() => Promise[R]), options) => Promise[R]**

`options` is an object with optional parameters:

* `maxRetry` **(Number)** *optional*: set the maximum retry (default is 5)
* `interval` **(Number)** *optional*: set the initial interval in milliseconds between the first and the second call. (default is 500)
* `intervalMultiplicator` **(Number >= 1)** *optional*: set the multiplicator which increase the interval through tries. (default is 1.5)

### Simple example:

```javascript
var promise = Qretry(function () {
  return eventuallyResult();
});
```

### Example with Qajax:

```javascript
Qretry(function () {
    return Qajax.getJSON("/item.json");
}, { maxRetry: 3 })
.then(function (item) {
  console.log(item);
});
```



