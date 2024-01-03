
import { TurboStream } from '#core';


/**
 * This class represents a Turbo Stream message with added functionality 
 * for Koa. Renders directly to Koa's `ctx.body` whenever a Turbo Stream
 * element gets added.
 * 
 * @extends {TurboStream}
 * @since 1.0.0
 */
export class KoaTurboStream extends TurboStream {

	/**
	 * Koa's context object.
	 * 
	 * @type {Object}
	 * @see https://koajs.com/#context 
	 */
	koaCtx;


	/**
	 * @param {Object} koaCtx - Koa's context object.
	 */
	constructor(koaCtx) {
		super();
		this.updateConfig({ buffer: false });

		this.koaCtx = koaCtx;
		this.koaCtx.type = TurboStream.MIME_TYPE;
		this.koaCtx.status = 200;

		if (typeof this.koaCtx.body !== 'string') {
			this.koaCtx.body = '';	
		}

		this.on('element', el => {
			this.koaCtx.body += el.render() + '\n';
		});
	}

}
