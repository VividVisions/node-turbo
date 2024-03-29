
import { TurboElement } from './turbo-element.js';
import { isPlainObject } from 'is-plain-object'; 
import { AttributeMissingError, AttributeMalformedError, AttributeInvalidError } from '#errors';

/**
 * A Turbo Stream element. A Turbo Stream message consists of one or several Turbo Stream
 * elements.
 *
 * @extends {TurboElement}
 * @since 1.0.0
 */
 export class TurboStreamElement extends TurboElement {

	/**
	 * Validates the attributes. `attributes.action` is mandatory. 
	 * `attributes.target` (or `attributes.targets`) is mandatory for any action but 'refresh'. 
	 * Gets called by the constructor.
	 * 
	 * @throws {AttributeMissingError} when mandatory attributes are missing.
	 * @throws {AttributeMalformedError} when mandatory attributes are malformed.
	 * @throws {AttributeInvalidError} when attributes are invalid.
	 * @since 1.0.0
	 */
	validate() {
		if (typeof this.attributes === 'undefined' || !isPlainObject(this.attributes)) {
			throw new AttributeMissingError('TurboStream: Attributes are missing.');
		}

		if (!('action' in this.attributes)) {
			throw new AttributeMissingError('TurboStream: Attribute "action" is missing.');
		}

		if (typeof this.attributes.action !== 'string' || this.attributes.action.length === 0) {
			throw new AttributeMalformedError('TurboStream: Attribute "action" must be a string with non-zero length.');
		}

		if (this.attributes.action !== 'refresh') {
			if (!('target' in this.attributes) && !('targets' in this.attributes)) {
				throw new AttributeMissingError('TurboStream: Attribute "target" or "targets" is missing.');
			}

			if ('target' in this.attributes && 'targets' in this.attributes) {
				throw new AttributeInvalidError('TurboStream: Attributes "target" and "targets" exclude each other.');
			}

			if ((typeof this.attributes.target !== 'string' || this.attributes.target.length === 0) && 
				(typeof this.attributes.targets !== 'string' || this.attributes.targets.length === 0)) {
				throw new AttributeMalformedError('TurboStream: Attribute "target"/"targets" must be a string with non-zero length.');
			}
		}
	}


	/**
	 * Renders this Turbo Stream element as HTML string. Omits `<template>[content]<template>` when the attribute 
	 * `action` is 'remove' or 'refresh'.
	 * 
	 * @returns {String} The rendered HTML fragment.
	 * @see https://turbo.hotwired.dev/handbook/streams#stream-messages-and-actions
	 * @since 1.0.0
	 */
	render() {
		switch (this.attributes.action) {
			case 'remove':
			case 'refresh':
				return `<turbo-stream ${this.renderAttributesAsHtml()}></turbo-stream>`;
			default:
				return `<turbo-stream ${this.renderAttributesAsHtml()}><template>${this.content}</template></turbo-stream>`;
		}
	}

}
