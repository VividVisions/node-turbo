
import { TurboElement } from './turbo-element.js';
import { AttributeMissingError, AttributeMalformedError } from '#errors';
import { isPlainObject } from 'is-plain-object'; 

/**
 * This class represents a Turbo Frame message.
 *
 * @extends {TurboElement}
 * @since 1.0.0
 */
export class TurboFrame extends TurboElement {
	
	/**
	 * The key which is added to the HTTP headers when the request
	 * is made by a Turbo Frame.
	 * 
	 * @type {String}
	 * @static
	 */
	static HEADER_KEY = 'turbo-frame';


	/**
	 * MIME type of a Turbo Frame HTTP response, which is just `text/html`.
	 * 
	 * @type {String}
	 * @static
	 */
	static MIME_TYPE = 'text/html';


	/**
	 * @param {String|Object} idOrAttributes - Either the ID as string or an object 
	 *  containing all attributes (including `id`).
	 * @param {String} content - The HTML content of this Turbo Frame message.
	 */
	constructor(idOrAttributes, content) {
		if (typeof idOrAttributes === 'string') {
			super({ id: idOrAttributes }, content);	
		}
		else {
			super(idOrAttributes, content);
		}
	}


	/**
	 * Validates the attributes. `attributes.id` is mandatory. 
	 * Gets called automatically by the constructor.
	 * 
	 * @throws {AttributeMissingError} when mandatory attributes are missing.
	 * @throws {AttributeMalformedError} when mandatory attributes are malformed.
	 */
	validate() {
		if (typeof this.attributes === 'undefined' || !isPlainObject(this.attributes) || !('id' in this.attributes)) {
			throw new AttributeMissingError('TurboFrame: Attribute "id" is missing.');
		}

		if (typeof this.attributes.id !== 'string') {
			throw new AttributeMalformedError('TurboFrame: Attribute "id" must be a string.');
		}

		if (this.attributes.id.length === 0) {
			throw new AttributeMalformedError('TurboFrame: Attribute "id" must be a string with non-zero length.');
		}
	}


	/**
	 * Renders the Turbo Frame message as HTML string and returns it.
	 * 
	 * @returns {String} The rendered HTML.
	 */
	render() {
		return `<turbo-frame ${this.renderAttributesAsHtml()}>${this.content}</turbo-frame>`;
	}

}
