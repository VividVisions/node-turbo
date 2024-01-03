
/**
 * Base class with common functionality for Turbo Stream elements and Turbo Frames. 
 * Not to be used directly.
 * 
 * @private
 * @since 1.0.0
 */
export class TurboElement {
	
	/**
	 * The attribute object.
	 * @type {Object<String, String>}
	 */
	attributes = {};
	

	/**
	 * The HTML content.
	 * @type {String}
	 */
	content = '';


	/**
	 * Automatically calls validate().
	 *
	 * @param {Object} attributes - The attributes of this element.
	 * @param {String} content - The HTML content of this element.
	 */
	constructor(attributes, content) {
		this.attributes = attributes;
		this.content = content;

		this.validate();
	}


	/**
	 * Converts the attributes object to a string in the form
	 * of HTML attributes ({ name: value } -> 'name="value"').
	 * 
	 * @returns {String} The HTML attribute string. 
	 */
	renderAttributesAsHtml() {
		return Object.entries(this.attributes)
			.map(([name, value]) => `${name}="${value}"`)
			.join(' ');
	}


	/* c8 ignore next 17 */

	/**
	 * Validation function to implement.
	 * @abstract
	 */
	validate() {
		throw new Error('validate() not implemented.');
	}

	
	/**
	 * Render function to implement.
	 * @abstract
	 */
	render() {
		throw new Error('render() not implemented.');
	}

}