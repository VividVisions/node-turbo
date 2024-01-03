
import { TurboStream, TurboFrame, isTurboStreamRequest, isTurboFrameRequest, getTurboFrameId } from '#core';
import { KoaTurboStream } from '#koa';
import { SseTurboStream } from '#sse';
import { PassThrough } from 'node:stream';

/**
 * Default options.
 * 
 * @type {Object} 
 * @property {Boolean} autoRender - Should elements directly render to ctx.body?  (Default: `true`)
 */
const defaultOptions = {
	autoRender: true
};


/**
 * Adds the following functions to Koa's context object:
 * 
 * - `turboStream()`  
 *   Returns a chainable Turbo Stream instance which directly writes to `ctx.body` whenever an element is added. Also sets the correct `Content-Type` header.
 * - `turboFrame()`  
 *   Returns a Turbo Frame instance which directly writes to `ctx.body`. 
 * - `isTurboStreamRequest()`  
 *   Checks if the request is a Turbo Stream request by looking for the MIME type in the `accept` headers.  
 *   Returns `true`/`false`.
 * - `isTurboFrameRequest()`  
 *   Checks if the request is a Turbo Frame request by looking for the `turbo-frame` header.  
 *   Returns `true`/`false`.
 * - `getTurboFrameId()`  
 *   Returns the contents of the `turbo-frame` header.
 * - `sseTurboStream()`  
 *   *Experimental*. Configures Koa to keep the connection open and use a stream to pipe to `ctx.res`.  
 * 
 * @param {Object} koaApp - The Koa application object.
 * @param {Object} opts - The options.
 * @param {Boolean} opts.autoRender - Should Turbo Stream elements automatically be rendered and sent? (Default: `true`)
 * @since 1.0.0
 */
export function turbochargeKoa(koaApp, opts = {}) {

	opts = Object.assign({}, defaultOptions, opts);

	koaApp.context = Object.assign(koaApp.context, {

		getTurboFrameId: function() {
			return getTurboFrameId(this.req);
		},


		isTurboFrameRequest: function() {
			return isTurboFrameRequest(this.req);
		},


		isTurboStreamRequest: function() {
			return isTurboStreamRequest(this.req);
		},


		turboFrame: function(idOrAttributes, content) {
			// Just the content.
			if (arguments.length === 1 && typeof idOrAttributes === 'string') {
				content = idOrAttributes;
				idOrAttributes = this.getTurboFrameId();
			}

			const tf = new TurboFrame(idOrAttributes, content);

			if (opts.autoRender === true) {
				this.status = 200;
				this.type = TurboFrame.MIME_TYPE;
				this.body = tf.render();
			}
			else {
				return tf.render();
			}			
		},

		turboStream: function(...args) {
			if (opts.autoRender === true) {
				const kts = new KoaTurboStream(this);
				return kts;
			}
			else {
				return new TurboStream(...args);
			}
		},


		/**
		 * @since 1.0
		 * @inner 
		 * @experimental
		 */
		sseTurboStream: function() {
			// Disable koa-compress.
			// @todo Adjust compression for SSE.
			this.compress = false;

			// Set connection to keep-alive.
			this.set({
				'Content-Type': SseTurboStream.MIME_TYPE,
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive'
			});

			// this.response.flushHeaders();

			const 
				ssets = new SseTurboStream(),
				readable = ssets.createReadableStream();

			this.status = 200;
			this.body = readable;

			return ssets;
		}

	});
}
