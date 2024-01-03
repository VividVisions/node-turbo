
import { expect } from 'chai';
import * as core from 'node-turbo';
import * as ws from 'node-turbo/ws';
import * as koa from 'node-turbo/koa';
import * as express from 'node-turbo/express';
import * as sse from 'node-turbo/sse';
import * as errors from 'node-turbo/errors';

const importedModules = { core, ws, koa, express, sse, errors };
const expectedModules = {
	core: [
		'TurboFrame',
		'TurboStream',
		'TurboStreamElement',
		'TurboElement',
		'TurboReadable',
		'isTurboFrameRequest',
		'isTurboStreamRequest',
		'getTurboFrameId'
	],
	ws: [
		'WsTurboStream'
	],
	koa: [
		'turbochargeKoa',
		'KoaTurboStream'
	],
	express: [
		'turbochargeExpress',
		'ExpressTurboStream'
	],
	sse: [
		'SseTurboStream'
	],
	errors: [
		'ValidationError',
		'AttributeMalformedError',
		'AttributeMissingError',
		'AttributeInvalidError'
	]
};

function sameMembers(arr1, arr2) {
	const set1 = new Set(arr1);
	const set2 = new Set(arr2);
	return arr1.every(item => set2.has(item)) &&
		arr2.every(item => set1.has(item))
}

describe('Package', function() {

	Object.keys(expectedModules).forEach(modName => {
		describe(modName, function() {
			expectedModules[modName].forEach(name => {
				it(`${name} should be exposed`, function() {
					expect(importedModules[modName][name]).to.be.a('function');
				});
			});

			it(`Nothing else should be exposed`, function() {
				expect(sameMembers(Object.keys(importedModules[modName]), expectedModules[modName])).to.be.true;
			});

		});
	});

});
