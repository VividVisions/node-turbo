
import { TurboStream, TurboFrame, isTurboStreamRequest, isTurboFrameRequest, getTurboFrameId } from '#core';
import { ExpressTurboStream } from '#express';
import { SseTurboStream } from '#sse';


/**
 * Default options.
 * 
 * @type {Object}
 * @property {boolean} autoRender - Should the Turbo Frame be automatically sent as HTTP response? Default: true 
 */
const defaultOptions = {
	autoSend: true
};


/**
 * Adds the following functions to Express' request object:
 *
 * - `isTurboStreamRequest()`  
 *   Checks if the request is a Turbo Stream request by looking for the MIME type in the `accept` headers.  
 *   Returns `true`/`false`.
 * - `isTurboFrameRequest()`  
 *   Checks if the request is a Turbo Frame request by looking for the `turbo-frame` header.  
 *   Returns `true`/`false`.
 * - `getTurboFrameId()`
 *   Returns the contents of the `turbo-frame` header.
 * 
 * Also adds the following functions to Express' `response` object:
 * 
 * - `turboStream()`  
 *   Returns a chainable Turbo Stream instance which introduces the function `send()` which sends the rendered Turbo Stream message as HTTP response with the correct MIME type.
 * - `turboFrame(id, content)`
 *   Returns a Turbo Frame instance which directly sends the rendered Turbo Frame message as HTTP response.
 * - `turboFrame(content)`
 *   If you omit the `id` attribute, it is automatically added by using the ID from the `turbo-frame` header.
 * - `sseTurboStream()`  
 *   *Experimental*. Configures Express to keep the connection open and use a stream to pipe to `res`.
 * 
 * @param {Object} expressApp - The Express application object.
 * @param {Object} opts - The options to override.
 * @since 1.0.0
 */
export function turbochargeExpress(expressApp, opts) {

	opts = Object.assign({}, defaultOptions, opts);

	expressApp.request.isTurboStreamRequest = function() {
		return isTurboStreamRequest(this);
	}

	expressApp.request.isTurboFrameRequest = function() {
		return isTurboFrameRequest(this);
	}

	expressApp.request.getTurboFrameId = function() {
		return getTurboFrameId(this);
	}

	expressApp.response.turboFrame = function(...args) {
		let 
			idOrAttributes,
			content;

		// Just the content.
		if (args.length === 1 && typeof args[0] === 'string') {
			idOrAttributes = this.req.getTurboFrameId();
			content = args[0];
		}
		else if (args.length === 2) {
			idOrAttributes = args[0];
			content = args[1];
		}

		const tf = new TurboFrame(idOrAttributes, content);

		if (opts.autoSend === true) {
			this.send(tf.render());
			return tf;
		}
		else {
			return tf.render();
		}			
	}

	expressApp.response.turboStream = function(attributes, content) {
		return new ExpressTurboStream(this, ...arguments);
	}

	expressApp.response.sseTurboStream = function() {

		this.set({
			'Content-Type': SseTurboStream.MIME_TYPE,
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		});

		this.flushHeaders();

		const ssets = new SseTurboStream(); 
		const stream = ssets.createReadableStream();
		stream.pipe(this);

		return ssets;
	}

}
