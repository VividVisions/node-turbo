
import { TurboStream } from '#core';
import { PassThrough } from 'node:stream';
import { deprecate } from 'node:util';
import db from 'debug';
const debug = db('node-turbo:sse');


/**
 * This class represents a Turbo Stream message for SSE.  
 * **Note**: This class is in __experimental__ stage.
 * 
 * @experimental
 * @extends {TurboStream}
 * @since 1.0.0
 */
export class SseTurboStream extends TurboStream {
	
	/**
	 * MIME type for an SSE message (`text/event-stream`).
	 *
	 * @type {String}
	 * @static
	 * @since 1.0.0
	 */
	static MIME_TYPE = 'text/event-stream';


	/** 
	 * The optional name to send the event under.
	 * 
	 * @type {String}
	 * @since 1.0.0
	 */
	eventName;


	/**
	 * Creates a Turbo Stream message instance which automatically writes to the
	 * SSE stream as soon as a Turbo Stream element is added.
	 * 
	 * @param {String} [eventname] - The SSE event name to send the message under.
	 * @since 1.0.0
	 */
	constructor(eventName) {
		debug('new SseTurboStream()', eventName);
		super();
		this.eventName = eventName;
	}


	/**
	 * Renders the Turbo Stream message and adds SSE specific syntax.
	 *
	 * @returns {String|null} The rendered SSE or null if there were no elements in the buffer.
	 * @since 1.0.0
	 */
	render() {
		const html = super.render();

		if (html === null) {
			debug('render() null');
			return null;
		}
		debug('render()');

		const event = this.renderSseEvent(html);

		return event;
	}


	/**
	 * Takes an HTML fragment string and converts it to an SSE event message.
	 * 
	 * @param {String} raw - The raw HTML string.
	 * @returns {String|null} The converted SSE event message or null if no string has been passed.
	 * @since 1.0.0
	 */
	renderSseEvent(raw) {
		if (typeof raw !== 'string') {
			return null;
		}

		debug('createSseEvent() raw:', raw);
		const lines = raw.split('\n');
		const data = lines.map(line => `data: ${line}`).join('\n');
		const event = `${this.eventName ? `event: ${this.eventName}\n` : ''}${data}\n\n`;
		debug('createSseEvent() event:', event);

		return event;
	}


	/**
	 * Creates a {node:stream.PassThrough} to which the the TurboStream elements
	 * are written as SSE event messages
	 *
	 * @returns {node:stream.Transform} The Transform stream instance.
	 * @since 1.3.0
	 */
	createNodeStream() {
		const stream = new PassThrough();
		
		// Don't buffer Turbo Stream elements.
		this.updateConfig({ buffer: false });
		
		// Instead, immediately write them to the stream.
		const elementListener = (el) => {
			stream.write(this.renderSseEvent(el.render()));
		};
		
		this.on('element', elementListener);
		
		stream.once('close', () => {
			this.removeListener('element', elementListener)
		});
		
		// If we have previously buffered Turbo Stream elements, 
		// write them immediately.
		if (this.length > 0) {
			this.elements.forEach((el) => this.emit('element', el));
			this.clear();
		}
		
		return stream;
	}
	
	
	/**
	 * Creates a {node:stream.PassThrough} to which the the TurboStream elements
	 * are written as SSE event messages
	 *
	 * @returns {node:stream.Transform} The Transform stream instance.
	 * @since 1.0.0
	 * @deprecated since 1.3.0
	 */
	createReadableStream = deprecate(() => {
		return this.createNodeStream();
	}, 'sseTurboStream.createReadableStream() is deprecated. Use sseTurboStream.createNodeStream() instead.');


	/**
	 * Set the event name for the SSE data.
	 * 
	 * @param {String} eventName - The event name to send the message under.
	 * @returns {SseTurboStream} The instance for chaining.
	 * @since 1.0.0
	 */
	event(eventName) {
		this.eventName = eventName;

		return this;
	}

}
