# DOMContentLoaded
An extremely useful global function that runs your JavaScript code as soon as the DOM (Document Object Model) is ready to be manipulated.

Can be placed in the `<head>` or the `<body>`, although for obvious reasons it should be placed in the `<head>` before other scripts are run, although everything will still work fine if the document has already loaded. 

Works similar to jQuery's `$(document).ready()` or `$(function(){})`, but with no third-party dependencies, boilerplate framework architectures, or external variables. This is undisputably better than the jQuery version, as jQuery tests for `onreadystatechange` in browsers that will not always report it correctly. jQuery also does not return an `event` object for when the DOM loads.

The returned `event` object has 3 properties:

* `readyTime`: The time in Unix Epoch milliseconds that the DOM was found ready. If the document is already loaded, `readyTime` will be `null` instead of a number.
* `funcExecuteTime`: The time at which your function was executed.
* `currentFunction`: A reference to the current function that is being run.

Supports multiple execution contexts and will preserve previous `onload` and `ready` event handlers.

Works in `IE6+`, Edge, Chrome 1+, Firefox 1+, Opera 4+, Safari 3.2+, Safari iOS, Samsung Internet, with a fallback to window.onload that works everywhere. And it likely works, although as yet it is impossible and impractical to test, in even earlier browsers. Tested via BrowserStack.

Usage:

```html
<script src = 'ready-1.2.8.js'></script>
```

```html
<script>
DOMContentLoaded(function(e) { 
  // console.log(e)
  // your code here  
}, function(e) {
  // separate execution context (optional)
});
</script>
```
