
import { TurboStream } from '#core';


/**
 * This class represents a Turbo Stream message with added functionality for WebSockets.
 * 
 * @extends {TurboStream}
 */
export class WsTurboStream extends TurboStream {
	
	/**
	 * The WebSocket instance to send to.
	 * 
	 * @type {WebSocket}
	 */
	ws;


	/**
	 * Ready-state `OPEN` of a WebSocket.
	 * 
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
	 * @type {Number}
	 * @static
	 */
	static OPEN = 1;


	/**
	 * Convenience function to create a non-buffering WsTurboStream 
	 * instance, which uses the passed WebSocket.
	 * 
	 * @static
	 * @param {WebSocket} ws - The WebSocket instance to send to.
	 * @returns {WsTurboStream} - A new WsTurboStream instance.
	 */
	static use(ws) {
		return new this(ws, { buffer: false });
	}


	/**
	 * Listens for the event `config` and calls `handleConfig(config)` if it has been emitted.
	 * 
	 * @param {WebSocket} ws - The WebSocket to send to.
	 * @param {Object} [config] - The config to override.
	 * @listens config
	 */
	constructor(ws, config) {
		super();
		this.ws = ws;

		this.on('config', this.handleConfig);

		if (typeof config !== 'undefined') {
			this.updateConfig(config);
		}
		else {
			this.handleConfig(this.config);
		}
	}


	/**
	 * Changes event listeners depending on `config.buffer`:  
	 * If `true`,  it will listen for the event `render` and call `handleRender()` when the event has been emitted.  
	 * If `false`, it will listen for the event `element` and call `handleElement()` when the event has been emitted.
	 *
	 * @param {Object} config - The changed config object.
	 * @listens element
	 * @listens render
	 */
	handleConfig(config) {
		if (config.buffer === true) {
			/* c8 ignore next 3 */
			if (this.listenerCount('element') > 0) {
				this.removeListener('element', this.handleElement); 	
			}

			this.on('render', this.handleRender);
		}
		else {
			/* c8 ignore next 3 */
			if (this.listenerCount('render') > 0) {
				this.removeListener('render', this.handleRender); 
			}
			this.on('element', this.handleElement);
		}
	}


	/**
	 * Sends the rendered HTML fragment to the WebSocket.
	 * 
	 * @param {String} html - The rendered HTML fragment.
	 */
	handleRender(html) {
		this.ws.send(html);	
	}


	/**
	 * Sends the Turbo Stream element to the WebSocket.
	 * 
	 * @param {TurboStreamElement} element - The Turbo Stream element to send.
	 */
	handleElement(element) {
		this.ws.send(element.render());	
	}

}
