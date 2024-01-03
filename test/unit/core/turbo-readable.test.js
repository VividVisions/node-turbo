
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import eventemitter2 from 'chai-eventemitter2';
import { TurboStream, TurboElement, TurboStreamElement, TurboReadable } from '#core';
import { Readable } from 'node:stream';

chai.use(eventemitter2());
chai.use(spies);
// const sandbox = chai.spy.sandbox();

const attr = {
	action: 'a',
	target: 't'
};

describe('TurboReadable', function() {

	before(function() { 
		this.ts = new TurboStream()
		this.readable = new TurboReadable(this.ts);
	});


	beforeEach(function() {
		chai.spy.on(this.readable, 'push');
	});


	afterEach(function() {
		chai.spy.restore(this.readable, 'push');
	});


	it('new TurboReadable() pushes existing elements', function() {
		const ts = new TurboStream()
			.append('t', 'c')
			.append('t2', 'c2');
		const readable = new TurboReadable(ts);
		const data = [];

		return new Promise((resolve, reject) => {
			readable.on('data', chunk => {
				data.push(chunk);

				if (data.length == 2) {
					expect(data.length).to.equal(2);
					readable.done();
					resolve();
				}
			});

			readable.on('error', err => reject(err));
		});
		
	});


	it('new TurboReadable() throws error if argument not TurboStream', function() {
		expect(function() {
			const readable = new TurboReadable({ foo: 'bar' });
		}).to.throw();
	});


	it('_pushElement() calls push()', function() {
		this.readable._pushElement(new TurboStreamElement({ action: 'a', target: 't' }));
		expect(this.readable.push).to.have.been.called();
	});


	it('_boundPush() is bound to _pushElement', function() {
		expect(this.readable._boundPush.name).to.be.equal('bound _pushElement');
	});


	it('_destroy() gets called when steam is destroyed', function() {
		const readable = this.ts.createReadableStream();
		chai.spy.on(readable, '_destroy');
		readable.destroy();

		expect(readable._destroy).to.have.been.called();
		chai.spy.restore(readable, '_destroy');
	});


	it('done() calls push(null)', function() {
		this.readable.done();
		
		expect(this.readable.push).to.have.been.called.with(null);
	});

});
