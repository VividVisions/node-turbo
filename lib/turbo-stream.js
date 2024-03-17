
import { EventEmitter } from 'node:events';
import { TurboStreamElement, TurboReadable } from '#core';
import { Writable, Readable } from 'node:stream';
import db from 'debug';
const debug = db('node-turbo:turbostream');


/**
 * A Turbo Stream message.
 * 
 * @extends {events~EventEmitter}
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
	 * List of all supported actions:
	 * 'append', 'prepend', 'replace', 'update', 'remove', 'before' and 'after'.
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
		'after'
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
	 * 
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
}


// Add convenience functions for all supported actions.
TurboStream.ACTIONS.forEach(action => {
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

// Dynamic functions:

/**
 * @name #append
 * @function
 * @description Adds a Turbo Stream element with the action 'append' to the message.
 * @param {String|Object<String, String>} targetOrAttributes - Either the target ID as string or all attributes as object.
 * @param {String} content - The HTML content of the element.
 */

/**
 * @name #prepend
 * @function
 * @description Adds a Turbo Stream element with the action 'prepend' to the message.
 * @param {(String|Object<String, String>)} targetOrAttributes - Either the target ID as string or all attributes as object.
 * @param {String} content - The HTML content of the element.
 */

/**
 * @name #replace
 * @function
 * @description Adds a Turbo Stream element with the action 'replace' to the message.
 * @param {(String|Object<String, String>)} targetOrAttributes - Either the target ID as string or all attributes as object.
 * @param {String} content - The HTML content of the element.
 */

/**
 * @name #update
 * @function
 * @description Adds a Turbo Stream element with the action 'update' to the message.
 * @param {String|Object<String, String>} targetOrAttributes - Either the target ID as string or all attributes as object.
 * @param {String} content - The HTML content of the element.
 */

/**
 * @name #remove
 * @function
 * @description Adds a Turbo Stream element with the action 'remove' to the message.
 * @param {String|Object<String, String>} targetOrAttributes - Either the target ID as string or all attributes as object.
 * @param {String} content - The HTML content of the element.
 */

/**
 * @name #before
 * @function
 * @description Adds a Turbo Stream element with the action 'before' to the message.
 * @param {String|Object<String, String>} targetOrAttributes - Either the target ID as string or all attributes as object.
 * @param {String} content - The HTML content of the element.
 */

/**
 * @name after
 * @function
 * @description Adds a Turbo Stream element with the action 'after' to the message.
 * @param {String|Object<String, String>} targetOrAttributes - Either the target ID as string or all attributes as object.
 * @param {String} content - The HTML content of the element.
 */

// Events:

/**
 * Event element.
 * Gets fired when a Turbo Stream element has been added to a message.
 *
 * @event element
 * @param {TurboStreamElement} - The added element.
 */

/**
 * Event render.
 * Gets fired when a Turbo Stream message has been rendered.
 *
 * @event render
 * @param {String} - The rendered HTML fragment.
 */

/**
 * Event config.
 * Gets fired when the config has been updated.
 *
 * @event config
 * @param {Object} - The updated config object.
 */

/**
 * Event clear.
 * Gets fired when the buffer is cleared.
 *
 * @event clear
 */
