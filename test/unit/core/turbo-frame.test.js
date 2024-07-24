
import { expect } from '../../chai.js';
import { TurboFrame } from '#core';
import { AttributeMissingError, AttributeMalformedError } from '#errors';

describe('TurboFrame', function() {

	it('Constructor with id string correctly assigns attributes', function() {
		const tf = new TurboFrame('id', 'c');
		expect(tf.attributes).to.deep.equal({ id: 'id' });
		expect(tf.content).to.equal('c');
	});


	it('Constructor with attribute object correctly assigns attributes', function() {
		const tf = new TurboFrame({ id: 'id', foo: 'bar' }, 'c');
		expect(tf.attributes).to.deep.equal({ id: 'id', foo: 'bar' });
		expect(tf.content).to.equal('c');
	});


	it('Error is thrown when missing attribute "id"', function() {		
		expect(function() {
			const tf = new TurboFrame();	
		}).to.throw();

		expect(function() {
			const tf = new TurboFrame({});	
		}).to.throw();

		expect(function() {
			const tf = new TurboFrame({ id: null });	
		}).to.throw();
	});


	it('Error is thrown when attribute "id" is malformed', function() {
		expect(function() {
			const tf = new TurboFrame(8);	
		}).to.throw();

		expect(function() {
			const tf = new TurboFrame({ id: 12 });	
		}).to.throw();

		expect(function() {
			const tf = new TurboFrame('');	
		}).to.throw();
	});


	it('render() creates correct HTML', function() {
		const tf = new TurboFrame('id', 'c');
		expect(tf.render()).to.equal('<turbo-frame id="id">c</turbo-frame>');
	});


	it('render() creates correct HTML (additional attributes)', function() {
		const tf = new TurboFrame({ id: 'id', foo: 'bar' }, 'c', );
		expect(tf.render()).to.equal('<turbo-frame id="id" foo="bar">c</turbo-frame>');
	});

});
