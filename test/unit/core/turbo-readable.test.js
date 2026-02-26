
import { expect, spy } from '../../chai.js';
import { TurboStream, TurboStreamElement, TurboReadable } from '#core';

describe('TurboReadable (deprecated)', function() {

	before(function() { 
		this.ts = new TurboStream()
		this.readable = new TurboReadable(this.ts);
	});

	after(function() { 
		this.readable.destroy();
	});

	beforeEach(function() {
		spy.on(this.readable, 'push');
	});


	afterEach(function() {
		spy.restore(this.readable, 'push');
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


	it('_destroy() gets called when stream is destroyed', function() {
		const readable = new TurboReadable(new TurboStream());
			
		spy.on(readable, '_destroy');
		readable.destroy();
		expect(readable._destroy).to.have.been.called();
		spy.restore(readable, '_destroy');
	});


	it('done() calls push(null)', function() {
		this.readable.done();
		
		expect(this.readable.push).to.have.been.called.with(null);
	});

});
