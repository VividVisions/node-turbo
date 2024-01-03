
import { Readable } from 'node:stream';
import { TurboStream } from '#core';
import db from 'debug';
const debug = db('node-turbo:readable');


/**
 * This class represents a readable stream which reads
 * messages/elements from a Turbo Stream instance.
 * 
 * @extends {stream~Readable}
 * @since 1.0.0
 */
export class TurboReadable extends Readable {

	/**
	 * The Turbo Stream instance to create the readable stream for.
	 * 
	 * @type {TurboStream}
	 */
	_turboStream;


	/**
	 * Creates the readable stream instance. 
	 * Updates the Turbo Stream's configuration to not buffer elements 
	 * and adds an event listener for `element` events to it, which get handled
	 * by `_boundPush(el)`.
	 * 
	 * If there are already buffered elements, they get pushed into into the read 
	 * queue immediately and the buffer is cleared afterwards.
	 * 
	 * @param {TurboStream} turboStream - The Turbo Stream instance to create the readable stream for.
	 * @param {Object} [opts] - The options for the readable stream.
	 * @throws {Error} if `turboStream` is not a TurboStream instance
	 */
	constructor(turboStream, opts) {
		debug('new TurboReadable()', opts);

		if (!(turboStream instanceof TurboStream)) {
			throw new Error('TurboReadable(): Not a TurboStream instance.');
		}

		super(Object.assign({ encoding: 'utf8' }, opts));

		this._turboStream = turboStream;
		this._turboStream.updateConfig({ buffer: false });

		// If we have Turbo Stream elements, push them immediately.
		if (this._turboStream.length > 0) {
			this._turboStream.elements.forEach(el => this._pushElement(el));
			this._turboStream.clear();
		}

		this._turboStream.on('element', this._boundPush);
	}


	/**
	 * Pushes a Turbo Stream element into the read queue.
	 * 
	 * @param {TurboStreamElement} el - The Turbo Stream element.
	 */
	_pushElement(el) {
		debug('_pushElement()');
		this.push(el.render());
	}


	/**
	 * This is the bound variant of `_pushElement(el)`. This function serves
	 * as handler for the `element` event. 
	 * 
	 * @type {Function}
	 */
	_boundPush = this._pushElement.bind(this);


	/**
	 * Gets called when data is available for reading. 
	 * This implementation does nothing.
	 * (Normally, push data would be pushed into the read queue here.)
	 * 
	 * @todo Do we need backpressure handling?
	 */
	_read() {
		debug('_read()');
	}


	/**
	 * Gets called when the stream is being destroyed. The event listener 
	 * for the event `element` is removed and the configuration restored.
	 * 
	 * @param {Error} err - The error object, if thrown.
	 */
	_destroy(err) {
		debug('_destroy()', err);
		this._turboStream.removeListener('element', this._boundPush);
		this._turboStream.updateConfig({ buffer: true });

		// if (typeof callback === 'function') {
		// 	if (err) {
		// 		callback(err);	
		// 	}
		// 	else {
		// 		callback();
		// 	}
		// }
	}


	/**
	 * Pushes `null` to the readable buffer to signal the end of the input.
	 * 
	 * @todo Should we call this end() or is this confusing because normally  
	 * only writable streams have this function.
	 */
	done() {
		debug('done()');
		this.push(null);
	}

}
