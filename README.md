Qretry
===
A Promise retry system for Q.

Simple example:
---

```javascript
var promise = Qretry(function () {
  return eventuallyResult();
});
```

Example with Qajax:
---

```javascript
Qretry(function () {
    return Qajax.getJSON("/item.json");
}, { maxRetry: 3 })
.then(function (item) {
  console.log(item);
});
```
