
import { expect } from 'chai';
import { TurboStreamElement } from '#core';

describe('TurboStreamElement', function() {
	
	it('Error is thrown when missing attributes object', function() {
		expect(function() {
			const tse = new TurboStreamElement();
		}).to.throw();
	});


	it(`Error is thrown when missing attribute "action"`, function() {		
		expect(function() {
			const tse = new TurboStreamElement({ target: 't' });	
		}).to.throw();

		expect(function() {
			const tse = new TurboStreamElement({ target: 't', action: null });	
		}).to.throw();
	});


	it(`Error is thrown when attribute "action" is malformed`, function() {
		expect(function() {
			const tse = new TurboStreamElement({ target: 't', action: 8 });	
		}).to.throw();

		expect(function() {
			const tse = new TurboStreamElement({ target: 't', action: '' });	
		}).to.throw();
	});


	it(`Error is thrown when missing attribute "target" or "targets"`, function() {		
		expect(function() {
			const tse = new TurboStreamElement({ action: 'a' });	
		}).to.throw();

		expect(function() {
			const tse = new TurboStreamElement({ action: 'a', target: null });	
		}).to.throw();
	});


	it(`Error is thrown when attribute "target" is malformed`, function() {
		expect(function() {
			const tse = new TurboStreamElement({ action: 'a', target: 8 });	
		}).to.throw();

		expect(function() {
			const tse = new TurboStreamElement({ action: 'a', target: '' });	
		}).to.throw();
	});


	it(`Error is thrown when attribute "targets" is malformed`, function() {
		expect(function() {
			const tse = new TurboStreamElement({ action: 'a', targets: 8 });	
		}).to.throw();

		expect(function() {
			const tse = new TurboStreamElement({ action: 'a', targets: '' });	
		}).to.throw();
	});


	it(`Error is thrown when attributes "target" and "targets" are present`, function() {		
		expect(function() {
			const tse = new TurboStreamElement({ action: 'a', target: 't', targets: 'ts' });	
		}).to.throw();

	});

	
	it(`No error is thrown when action is "refresh" with missing attribute "target" or "targets"`, function() {		
		expect(function() {
			const tse = new TurboStreamElement({ action: 'refresh' });	
		}).to.not.throw();
	});	

});
