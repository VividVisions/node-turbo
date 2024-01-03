/** @module node-turbo/errors */

/**
 * Parent class for all validation errors.
 * 
 * @extends {node:Error}
 * @since 1.0.0
 */
export class ValidationError extends Error {}


/**
 * Gets thrown when mandatory attributes are missing.
 * 
 * @extends {ValidationError}
 * @since 1.0.0
 */
export class AttributeMissingError extends ValidationError {}


/**
 * Gets thrown when mandatory attributes are malformed.
 * 
 * @extends {ValidationError}
 * @since 1.0.0
 */
export class AttributeMalformedError extends ValidationError {}


/**
 * Gets thrown when invalid attributes are discovered.
 * 
 * @extends {ValidationError}
 * @since 1.0.0
 */
export class AttributeInvalidError extends ValidationError {}
