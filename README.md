# DOMContentLoaded
An extremely useful global function that runs your Javascript code as soon as the DOM (Document Object Model) is ready to be manipulated.

Equivalent to jQuery's `$(document).ready()`, but with no third-party dependencies, boilerplate framework architectures, or external variables.

Can be placed in the `<head>` or the `<body>`, although for obvious reasons it should be placed in the `<head>`, before other scripts are run.

Usage:

```html
<script src = 'ready-1.2.8.js'></script>
```

```html
<script>
DOMContentLoaded(function(e) {
  // your code here
});
</script>

```
