
import { EventEmitter } from 'node:events';
import { TurboStreamElement, TurboReadable } from '#core';
import { Writable, Readable } from 'node:stream';
import { deprecate } from 'node:util';
import db from 'debug';
const debug = db('node-turbo:turbostream');


/**
 * A Turbo Stream message.
 * 
 * @extends {node:events~EventEmitter}
 * @since 1.0.0
 */
export class TurboStream extends EventEmitter {

	/**
	 * Default configuration.
	 * 
	 * @type {Object<String, String>}
	 * @property {Boolean} buffer - Should elements be added to the buffer (default: true)?
	 * @since 1.0.0
	 */
	config = {
		buffer: true
	};


	/**
	 * Array of buffered elements. Gets filled if `config.buffer` is `true`.
	 * 
	 * @type {Array}
	 * @since 1.0.0
	 */
	elements = [];
	

	/**
	 * MIME type for Turbo Stream messages.
	 *
	 * @see https://turbo.hotwired.dev/handbook/streams#streaming-from-http-responses
	 * @type {String}
	 * @static
	 * @since 1.0.0
	 */
	static MIME_TYPE = 'text/vnd.turbo-stream.html';


	/**
	 * List of all supported official actions:
	 * `append`, `prepend`, `replace`, `update`, `remove`, `before`, `after` and `refresh`.
	 * 
	 * @see https://turbo.hotwired.dev/handbook/streams#stream-messages-and-actions
	 * @type {Array}
	 * @static
	 * @since 1.0.0
	 */
	static ACTIONS = [
		'append',
		'prepend',
		'replace',
		'update',
		'remove',
		'before',
		'after',
		'refresh'
	];


	/** 
	 * The number of buffered Turbo Stream elements.
	 *
	 * @type {Number}
	 * @since 1.0.0
	 */
	get length() {
		return this.elements.length;
	}


	/**
	 * Adds a Turbo Stream Element with the action 'morph' to the message.
	 * 
	 * @param {String|Object<String, String>} requestIdOrAttributes - Either the request ID as string or all attributes as an object.
	 * @returns {TurboStream} The instance for chaining.
	 * @deprecated since version 1.2.0.
	 */
	morph = deprecate((targetOrAttributes, content) => {
			if (typeof targetOrAttributes === 'string') {
				return this.addElement({ action: 'morph', target: targetOrAttributes }, content);	
			}
			/* c8 ignore next 3 */
			else {
				return this.addElement(Object.assign({ action: 'morph' }, targetOrAttributes), content);	
			}
		}, 'morph() is deprecated. Use refresh() or replace() with attribute { method: "morph" }.');


	/**
	 * Adds a Turbo Stream Element with the action 'morph' to the message.
	 * 
	 * @param {String} targets - The query string targeting multiple DOM elements.
	 * @param {String} content - The HTML content of the element. 
	 * @returns {TurboStream} The instance for chaining.
	 * @deprecated since version 1.2.0.
	 */
	morphAll = deprecate((targets, content) => {
			return this.addElement({ action: 'morph', targets }, content);	
		}, 'morphAll() is deprecated. Use refreshAll() or replaceAll() with attribute { method: "morph" }.');


	/**
	 * If `attributes` and `content` are available, a Turbo Stream element is added to the buffer,
	 * pending validation.
	 * 
	 * @param {Object<String, String>} [attributes] - The attributes of this element.
	 * @param {String} [content] - The HTML content of this element.
	 * @since 1.0.0
	 */
	constructor(attributes, content) {
		super();

		if (typeof attributes !== 'undefined') {
			return this.addElement(attributes, content);	
		}
	}


	/**
	 * Extends/Overwrites the configuration.
	 *
	 * @param {Object} config - New configuration.
	 * @emits config
	 * @returns {TurboStream} The instance for chaining.
	 * @since 1.0.0
	 */
	updateConfig(config) {
		if (config) {
			this.config = Object.assign(this.config, config);
			this.emit('config', this.config);
		}

		return this;
	}


	/**
	 * Adds a Turbo Stream element to the message. 
	 * Adds the element to the buffer, if config.buffer === true.
	 * Fires the event 'element' with the added element.
	 *
	 * @param {Object<String, String>|TurboFrameElement} attributesOrElement - 
	 * @param {String} content - The HTML content of the element.
	 * @emits element
	 * @returns {TurboStream} The instance for chaining.
	 * @since 1.0.0
	 */
	addElement(attributesOrElement, content) {
		let el;

		if (attributesOrElement instanceof TurboStreamElement) {
			el = attributesOrElement;
		}
		else {
			el = new TurboStreamElement(attributesOrElement, content);	
		}

		if (this?.config?.buffer === true) {
			this.elements.push(el);
		}

		this.emit('element', el);
		
		return this;
	}


	/**
	 * Clears the buffer.
	 * 
	 * @emits clear
	 * @returns {TurboStream} The instance for chaining.
	 * @since 1.0.0
	 */
	clear() {
		this.elements = [];
		this.emit('clear');

		return this;
	}


	/**
	 * Renders this Turbo Stream message if there are buffered elements.
	 * 
	 * @returns {String|null} The rendered Turbo Stream HTML fragment or null if there were no buffered elements.
	 * @emits render
	 * @since 1.0.0
	 */
	render() {
		const arr = this.renderElements();
		if (arr !== null) {
			const html = arr.join('\n');
			this.emit('render', html);

			return html;
		}

		return null;
	}


	/**
	 * If there are buffered elements, renders them and returns an array with the HTML fragments.
	 * 
	 * @returns {Array|null} The rendered Turbo Stream HTML fragments as array or null if there were no buffered elements.
	 * @since 1.0.0
	 */
	renderElements() {
		if (this.elements.length > 0) {
			return this.elements.map(el => el.render());
		}

		return null;
	}


	/**
	 * Renders this Turbo Stream message and clears the buffer.
	 * 
	 * @returns {String|null} The rendered Turbo Stream HTML fragment or null if there were no buffered elements.
	 * @emits {render}
	 * @emits {clear}
	 * @since 1.0.0
	 */
	flush() {
		const html = this.render();
		this.clear();

		return html;
	}


	/**
	 * Adds a Turbo Stream Element with a custom action.
	 * 
	 * @param {String} action - The name of the custom action.
	 * @param {String} target - The target ID.
	 * @param {String} content - The HTML content of the element. 
	 * @returns {TurboStream} The instance for chaining.
	 * @since 1.0.0
	 */
	custom(action, target, content) {
		return this.addElement({ action, target }, content);
	}


	/**
	 * Adds a Turbo Stream Element with a custom action, targeting multiple DOM elements.
	 * 
	 * @param {String} action - The name of the custom action.
	 * @param {String} targets - The query string targeting multiple DOM elements.
	 * @param {String} content - The HTML content of the element. 
	 * @returns {TurboStream} The instance for chaining.
	 * @since 1.0.0
	 */
	customAll(action, targets, content) {
		return this.addElement({ action, targets }, content);
	}


	/**
	 * Creates a readable stream.
	 * 
	 * @param {Object<String, String>} opts - The options for stream creation.
	 * @param {Boolean} opts.continuous - If true, a TurboReadable instance is returned. 
	 *  If false, a readable stream created from the buffered items is returned.
	 * @param {Object<String, String>} streamOptions - The options for the readable stream itself.
	 * @returns {stream.Readable|TurboReadable} Either a readable stream or a TurboReadable instance.
	 * @since 1.0.0
	 */
	createReadableStream(opts, streamOptions = {}) {
		opts = Object.assign({}, { continuous: true }, opts);
		debug('createReadableStream()', opts, streamOptions);

		if (opts.continuous === true) {
			debug(' returns new TurboStreamReadable()');
			return new TurboReadable(this, streamOptions);
		}
		else {
			debug(' returns Readable.from()');
			return Readable.from(this.length > 0 ? this.render().split('\n') : [], streamOptions);
		}
	}


	/**
	 * Adds a Turbo Stream Element with the action 'refresh' to the message.
	 * 
	 * @param {String|Object<String, String>} requestIdOrAttributes - Either the request ID as string or all attributes as an object.
	 * @returns {TurboStream} The instance for chaining.
	 * @since 1.1.0
	 */
	refresh(requestIdOrAttributes) {
		if (typeof requestIdOrAttributes === 'string') {
			return this.addElement({ action: 'refresh', 'request-id': requestIdOrAttributes });	
		}
		else {
			return this.addElement(Object.assign({ action: 'refresh' }, requestIdOrAttributes));	
		}
	}

}


// Add convenience functions for all supported actions.
TurboStream.ACTIONS.forEach(action => {
	// This action needs special treatment.
	if (action === 'refresh') {
		return;
	}

	TurboStream.prototype[action] = function(targetOrAttributes, content) {
		if (typeof targetOrAttributes === 'string') {
			return this.addElement({ action: action, target: targetOrAttributes }, content);	
		}
		else {
			return this.addElement(Object.assign({ action: action }, targetOrAttributes), content);	
		}
	};

	TurboStream.prototype[`${action}All`] = function(targets, content) {
		return this.addElement({ action: action, targets }, content);	
	};	
});
