
import { IncomingMessage } from 'node:http';
import Negotiator from 'negotiator';
import { TurboStream, TurboFrame } from '#core';

/**
 * Checks if the request is a Turbo Stream request.
 * 
 * @param {Object} request - The request object. Expects an object like an {http.ClientRequest} instance.
 * @returns {Boolean} `true`, if the request has been identified as a Turbo Stream request. `false` otherwise.
 * @since 1.0.0
 */
export function isTurboStreamRequest(request) {
	if (request?.headers?.accept) {
		const negotiator = new Negotiator(request);
		return negotiator.mediaTypes().includes(TurboStream.MIME_TYPE);
	}

	return false;
}


/**
 * Checks if the request is a Turbo Frame request.
 * 
 * @param {Object} request - The request object. Expects an object like an {http.ClientRequest} instance.
 * @returns {Boolean} `true`, if the request has been identified as a Turbo Frame request. false otherwise.
 * @since 1.0.0
 */
export function isTurboFrameRequest(request) {
	if (request?.headers) {
		return (typeof request.headers[TurboFrame.HEADER_KEY] !== 'undefined');	
	}

	return false;	
}


/**
 * Returns the content of the 'turbo-frame' header, which is the ID of the requesting Turbo 
 * Frame.
 *
 * @param {Object} request - The request object. Expects an object like an {http.ClientRequest} instance.
 * @returns {String|null} The Turbo Frame ID or `null` if not found.
 * @since 1.0.0
 */
export function getTurboFrameId(request) {
	if (request?.headers) {
		return request.headers[TurboFrame.HEADER_KEY];
	}

	return null;
}
