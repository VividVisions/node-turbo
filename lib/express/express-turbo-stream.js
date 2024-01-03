
import { TurboStream } from '#core';


/**
 * This class represents a Turbo Stream message for Express.
 * Introduces the function `send()` to send the rendered message
 * as HTTP response with the correct MIME type.
 * 
 * @extends {TurboStream}
 * @since 1.0.0
 */
export class ExpressTurboStream extends TurboStream {
	
	/**
	 * Express' response object to send to.
	 * 
	 * @type {Object}
	 */
	res;

	/**
	 * Stores Express' response object and creates a `TurboStream` instance.
	 * 
	 * @param {Object} res - Express' response object to send to.
	 * @param {Object} [attributes] - Attributes of the added element.
	 * @param {String} [content] - The HTML content of the added element.
	 */
	constructor(res, ...args) {
		super(...args);
		this.res = res;
	}

	/**
	 * Sends the rendered message as HTTP response with the correct MIME type.
	 */
	send() {
		this.res.type(TurboStream.MIME_TYPE);
		this.res.send(this.render());
	}
}
