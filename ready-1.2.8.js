
/* A global function that runs your Javascript code as soon as the DOM is ready to be manipulated.
	Equivalent to and slightly better than jQuery's $(document).ready()
	Usage: DOMContentLoaded(function(e) { (your code here) });
 */

DOMContentLoaded.version = "1.2.8"; // hoisted

function DOMContentLoaded() {

    var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
    var alreadyRun, funcs = arguments; // for use in the idempotent function `ready()`, defined later.

	/* The vast majority of browsers currently in use now support both addEventListener
       and DOMContentLoaded. However, 2% is still a significant portion of the web, and
       graceful degradation is still the best design approach.

       `document.readyState === 'complete'` is functionally equivalent to `window.onload`.
       The events fire within a few tenths of a second, and reported correctly in every
       browser that was tested, including IE6. But IE6 to 10 did not correctly return the other
       readyState values as per the spec:
       In IE6-10, readyState was sometimes 'interactive', even when the DOM wasn't accessible,
       so it's safe to assume that listening to the `onreadystatechange` event
       in legacy browsers is unstable. Should readyState be undefined, accessing undefined properties
       otf a defined object (document) will not throw.

       The following statement checks for IE < 11 via conditional compilation.
       `@_jscript_version` is a special String variable defined only in IE conditional comments,
       which themselves only appear as regular comments to other browsers.
       Browsers not named IE interpret the following code as
       `Number( new Function("")() )` => `Number(undefined)` => `NaN`.
       `NaN` is neither >, <, nor = to any other value.
       Values: IE5: 5?, IE5.5: 5.5?, IE6/7: 5.6/5.7, IE8: 5.8, IE9: 9, IE10: 10,
       (IE11 older doc mode*): 11, IE11 / NOT IE: undefined
    */

	// addOnload: Allows us to preserve any original `window.onload` handlers,
	// in ancient (prehistoric?) browsers where this is even necessary, while providing the
	// option to chain onloads, and dequeue them later.

	function addOnload(fn) {

		var prev = window.onload; // old `window.onload`, which could be set by this function, or elsewhere.

		// Here we add a function queue list to allow for dequeueing.
		// Should we have to use window.onload, `addOnload.queue` is the queue of functions
		// that we will run when when the DOM is ready.

		if (typeof addOnload.queue !== 'object') { // allow loose typing of arrays
			addOnload.queue = [];
			if (typeof prev === 'function') {
				addOnload.queue.push( prev ); // add the previously defined event handler, if any.
			}
		}

		if (typeof fn === 'function') { addOnload.queue.push(fn) }

		window.onload = function() { // iterate through the queued functions
			for (var i=0; i < addOnload.queue.length; i++) { addOnload.queue[i]() }
		};
	}

	// dequeueOnload: remove a queued `addOnload` function from the chain.

	function dequeueOnload(fn, all) {

		// Sort backwards through the queued functions in `addOnload.queue` (if it's defined)
		// until we find `fn`, and then remove `fn` from its place in the array.

		if (typeof addOnload.queue === 'object') {
			for (var i = addOnload.queue.length-1; i >= 0; i--) {
				if (fn === addOnload.queue[i]) {
					addOnload.queue.splice(i,1); if (!all) {break}
				}
			}
		}
	}

	// ready: idempotent event handler function

	function ready(time) {
		if (alreadyRun) {return} alreadyRun = true;

		// This time is when the DOM has loaded, or, if all else fails,
		// when it was actually possible to inference that the DOM has loaded via a 'load' event.

		var readyTime = +new Date(); // cache the ready time

		detach(); // detach all our event handlers

		// run the functions (funcs is arguments of DOMContentLoaded)
		for (var i=0; i < funcs.length; i++) { var func = funcs[i];

			if (typeof func === 'function') {

				// force set `this` to `document`, for consistency.
				func.call(document, {
				  'readyTime': (time === null ? null : readyTime),
				  'funcExecuteTime': +new Date(),
				  'currentFunction': func
				});
			}
		}
	}

	// detach: detach all the currently registered events.

	function detach() {
		if (document[rel]) {
			document[rel]("DOMContentLoaded", ready); window[rel]("load", ready);
		} else
		if (dev in window) { window[dev]("onload", ready); }
		else {
			dequeueOnload(ready);
		}
	}

	// doIEScrollCheck: poll document.documentElement.doScroll until it no longer throws.

	function doIEScrollCheck() { // for use in IE < 9 only.
		if ( window.frameElement ) {
			/* We're in an `iframe` or similar.
			   The `document.documentElement.doScroll` technique does not work if we're not
			   at the top-level (parent document).
			   Attach to onload if we're in an <iframe> in IE as there's no way to tell otherwise
			*/
			try { window.attachEvent("onload", ready); } catch (e) { }
			return;
		}
		// if we get here, we're not in an `iframe`.
		try {
			// when this statement no longer throws, the DOM is accessible in old IE
			document.documentElement.doScroll('left');
		} catch(error) {
			setTimeout(function() {
				(document.readyState === 'complete') ? ready() : doIEScrollCheck();
			}, 50);
			return;
		}
		ready();
	}

    var jscript_version = Number( new Function("/*@cc_on return @_jscript_version; @*\/")() );

    // check if the DOM has already loaded
    // If it has, send null as the readyTime, since we don't know when the DOM became ready.

    if (document.readyState === 'complete') { ready(null); return; } // call ready() and exit.

    // For IE<9 poll document.documentElement.doScroll(), no further actions are needed.
    if (jscript_version < 9) { doIEScrollCheck(); return; }

    // ael: addEventListener, rel: removeEventListener, aev: attachEvent, dev: detachEvent

    if (document[ael]) {
        document[ael]("DOMContentLoaded", ready, false);
        window[ael]("load", ready, false); // fallback to the universal load event in case DOMContentLoaded isn't supported.
    } else
    if (aev in window) { window[aev]('onload', ready);
        // Old Opera has a default of window.attachEvent being falsy, so we use the in operator instead.
        // https://dev.opera.com/blog/window-event-attachevent-detachevent-script-onreadystatechange/
    } else {
        addOnload(ready); // fallback to window.onload that will always work.
    }
}

// Tested via BrowserStack.
