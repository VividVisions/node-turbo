
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
	 * @since 1.0.0
	 */
	attributes = {};
	

	/**
	 * The HTML content.
	 * @type {String}
	 * @since 1.0.0
	 */
	content = '';


	/**
	 * Automatically calls validate().
	 *
	 * @param {Object} attributes - The attributes of this element.
	 * @param {String} content - The HTML content of this element.
	 * @since 1.0.0
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
	 * @since 1.0.0
	 */
	renderAttributesAsHtml() {
		return Object.entries(this.attributes)
			.map(([name, value]) => (value !== null) ? `${name}="${value}"` : name)
			.join(' ');
	}


	/* c8 ignore next 19 */

	/**
	 * Validation function to implement.
	 * @abstract
	 * @since 1.0.0
	 */
	validate() {
		throw new Error('validate() not implemented.');
	}

	
	/**
	 * Render function to implement.
	 * @abstract
	 * @since 1.0.0
	 */
	render() {
		throw new Error('render() not implemented.');
	}

}
