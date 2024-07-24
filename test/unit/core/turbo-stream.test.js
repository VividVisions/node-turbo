
import { expect } from '../../chai.js';
import { TurboStream, TurboElement, TurboStreamElement, TurboReadable } from '#core';
import { Readable } from 'node:stream';

const attr = {
	action: 'a',
	target: 't'
};

describe('TurboStream', function() {

	before(function() { 
		this.stream = new TurboStream(attr, 'c');
	});


	describe('new TurboStream()', function() {
		it('without arguments creates empty TurboStream instance', function() {
			const ts = new TurboStream();

			expect(ts).to.be.an.instanceof(TurboStream);
			expect(ts.elements).to.be.empty;
		});


		it('with arguments adds TurboElement', function() {
			expect(this.stream.elements[0]).to.be.an.instanceof(TurboElement);
		});
	});


	describe('addElement()', function() {
		it('addElement(obj, str) adds TurboElement', function() {
			this.stream.addElement({ action: 'a2', target: 't2' }, 'c2');

			expect(this.stream.elements[1]).to.be.an.instanceof(TurboElement);
			expect(this.stream).to.have.lengthOf(2);
		});


		it('addElement(obj, str) assigns correct properties', function() {
			const ts = new TurboStream().addElement({ action: 'a', target: 't' }, 'c');

			expect(ts.elements[0].attributes).to.be.deep.equal({ action: 'a', target: 't' });
			expect(ts.elements[0].content).to.be.equal('c');
		});


		it('addElement(element) adds element', function() {
			const tse = new TurboStreamElement({ action: 'a', target: 't' }, 'c');
			const ts = new TurboStream().addElement(tse);

			expect(ts.elements[0].attributes).to.be.deep.equal({ action: 'a', target: 't' });
			expect(ts.elements[0].content).to.be.equal('c');
		});

		it('emits event \'element\' with Turbo Stream element', function() {
			return new Promise(resolve => {
				const ts = new TurboStream();
				ts.on('element', (el) => {
					expect(el).to.be.an.instanceof(TurboStreamElement);
					resolve();
				});
				ts.addElement({ action: 'a', target: 't' }, 'c');
			});
		});


		it('is chainable', function() {
			const ts = new TurboStream().addElement(attr, 'c');
			
			expect(ts).to.be.an.instanceof(TurboStream);
		});
	});


	describe('updateConfig()', function() {
		it('updates config object', function() {
			const ts = new TurboStream().updateConfig({ foo: 'bar' });
			expect(ts.config).to.deep.equal({
				buffer: true,
				foo: 'bar'
			});
		});


		it('emits event \'config\' with config object', async function() {
			const ts = new TurboStream();

			const result = await new Promise(resolve => {
				ts.on('config', resolve)
				ts.updateConfig({ foo: 'bar' });
			});

			expect(result).to.deep.equal(ts.config);
		});


		it('is chainable', function() {
			const ts = new TurboStream().updateConfig({ foo: 'bar' });
			expect(ts).to.be.an.instanceof(TurboStream);
		});
	});


	describe('clear()', function() {
		it('removes all elements', function() {
			this.stream.clear();
			
			expect(this.stream.elements).to.be.empty;
		});

		it('emits event \'clear\'', function() {
			return new Promise(resolve => {
				const ts = new TurboStream({ action: 'a', target: 't' }, 'c');
				ts.on('clear', () => {
					expect(true).to.be.true;
					resolve();
				});
				ts.clear();
			});
		});

		it('is chainable', function() {
			const ts = new TurboStream(attr, 'c').clear();
			
			expect(ts).to.be.an.instanceof(TurboStream);
		});
	});


	describe('render()', function() {
		it('creates correct HTML (single element)', function() {
			const ts = new TurboStream(attr, 'c');
			
			expect(ts.render()).to.equal('<turbo-stream action="a" target="t"><template>c</template></turbo-stream>');
		});


		it('creates correct HTML (multiple elements)', function() {
			const ts = new TurboStream(attr, 'c')
				.addElement({ action: 'a2', target: 't2' }, 'c2');
			
			expect(ts.render()).to.equal('<turbo-stream action="a" target="t"><template>c</template></turbo-stream>\n<turbo-stream action="a2" target="t2"><template>c2</template></turbo-stream>');
		});


		it('creates correct HTML (additional parameters)', function() {
			const ts = new TurboStream({ action: 'a', target: 't', foo: 'bar' }, 'c');
			
			expect(ts.render()).to.equal('<turbo-stream action="a" target="t" foo="bar"><template>c</template></turbo-stream>');
		});


		it('returns null if there are no elements', function() {
			const ts = new TurboStream();
			
			expect(ts.render()).to.be.null;
		});

		it('emits event \'render\' with HTML string', async function() {
			const 
				ts = new TurboStream({ action: 'a', target: 't' }, 'c'),
				result = await new Promise(resolve => {
					ts.on('render', resolve);
					ts.render();
				});

			expect(result).to.be.equal('<turbo-stream action="a" target="t"><template>c</template></turbo-stream>');
		});
	});


	describe('flush()', function() {
		it('removes all elements', function() {
			const ts = new TurboStream().append('t', 'c');
			expect(ts.elements).to.not.be.empty;
			ts.flush();
			expect(ts.elements).to.be.empty;
		});


		it('returns HTML', function() {
			const 
				ts = new TurboStream().append('t', 'c'),
				html = ts.flush();
			
			expect(html).to.equal('<turbo-stream action="append" target="t"><template>c</template></turbo-stream>');
		});

		it('emits events \'render\' and \'clear\'', async function() {
			let flushHtml;

			const result = await new Promise(resolve => {
				const ts = new TurboStream({ action: 'a', target: 't' }, 'c');
				let resultHtml;

				ts.on('render', html => resultHtml = html);
				ts.on('clear', resolve(resultHtml));

				flushHtml = ts.flush();
			});

			expect(result).to.deep.equal(flushHtml);
		});
	});


	describe('Custom actions', function() {

		it('custom() adds TurboElement with custom action', function() {
			const ts = new TurboStream().custom('custom-name', 't', 'c');
			expect(ts.elements[0]).to.be.an.instanceof(TurboElement);
			expect(ts.elements[0].attributes.action).to.equal('custom-name');
		});


		it('customAll() adds TurboElement with custom action and targets attribute', function() {
			const ts = new TurboStream().customAll('custom-name', '.t', 'c');
			expect(ts.elements[0]).to.be.an.instanceof(TurboElement);
			expect(ts.elements[0].attributes.action).to.equal('custom-name');
			expect(ts.elements[0].attributes.targets).to.equal('.t');
		});

	});


	describe('Action convenience functions', function() {
		it ('[action]() with target string adds correct target attribute', function() {
			const ts = new TurboStream();
			ts.append('t', 'c');

			expect(ts.elements[0].attributes.target).to.equal('t');
		});


		it ('[action]() with attribute object adds correct target attribute', function() {
			const ts = new TurboStream();
			ts.append({ target: 't' }, 'c');

			expect(ts.elements[0].attributes.target).to.equal('t');
		});


		it ('[action]() with attribute object can handle additional attributes', function() {
			const ts = new TurboStream();
			ts.append({ target: 't', foo: 'bar' }, 'c');

			expect(ts.elements[0].attributes.foo).to.equal('bar');
		});

		it ('[action]() emits event \'element\'', function() {
			return new Promise(resolve => {
				const ts = new TurboStream();
				ts.on('element', resolve);
				ts.append({ target: 't', foo: 'bar' }, 'c');
			});
		});


		it ('[action]() is chainable', function() {
			const ts = new TurboStream();
			const res = ts.append('t', 'c');

			expect(res instanceof TurboStream).to.be.true;
		});


		it ('[action]All() is chainable', function() {
			const ts = new TurboStream();
			const res = ts.appendAll('t', 'c');

			expect(res instanceof TurboStream).to.be.true;
		});


		TurboStream.ACTIONS.forEach(action => {
			if (action === 'refresh') {
				it ('refresh() correctly omits <template> and content', function() {
					const ts = new TurboStream({ action: 'refresh' });
					
					expect(ts.render()).to.equal('<turbo-stream action="refresh"></turbo-stream>');
				});
				return;
			}

			it (`${action}() adds TurboElement with action \'${action}\'`, function() {
				const ts = new TurboStream();
				ts[action].call(ts, { target: 't' }, 'c');

				expect(ts.elements[0] instanceof TurboElement).to.be.true;
				expect(ts.elements[0].attributes.action).to.equal(action);
			});

			if (action === 'remove') {
				it ('remove() correctly omits <template> and content', function() {
					const ts = new TurboStream({ action: 'remove', target: 't' });
					
					expect(ts.render()).to.equal('<turbo-stream action="remove" target="t"></turbo-stream>');
				});
			}

			it (`${action}All() adds TurboElement with action \'${action}\' and targets attribute`, function() {
				const ts = new TurboStream();
				ts[action + 'All'].call(ts, '.t', 'c');

				expect(ts.elements[0]).to.be.an.instanceof(TurboElement);
				expect(ts.elements[0].attributes.action).to.equal(action);
				expect(ts.elements[0].attributes.targets).to.equal('.t');
			});	
		});


		it ('refresh() adds TurboElement with action \'refresh\'', function() {
			const ts = new TurboStream();
			ts.refresh();

			expect(ts.elements[0] instanceof TurboElement).to.be.true;
			expect(ts.elements[0].attributes.action).to.equal('refresh');
		});

		it ('refresh(<string>) adds attribute \'request-id\'', function() {
			const ts = new TurboStream();
			ts.refresh('id');
			expect(ts.elements[0].attributes).to.have.property('request-id');
			expect(ts.elements[0].attributes['request-id']).to.equal('id');
		});

		it ('refresh(<object>) adds attributes', function() {
			const ts = new TurboStream();
			ts.refresh({ foo: 'bar' });
			expect(ts.elements[0].attributes).to.have.property('foo');
			expect(ts.elements[0].attributes.foo).to.equal('bar');
		});

		// Test deprecated functions.
		describe('Deprecated actions', function() {

			it ('morph() warns about deprecation.', function() {
				return new Promise(resolve => {
					process.once('warning', err => {
						expect(err).to.be.an('error');
						expect(err.message).to.include('morph() is deprecated');
						resolve();
					});

					const ts = new TurboStream();
					ts.morph('t', 'c');
				});
			});

			it ('morph() adds TurboElement with action \'morph\'', function() {
				const ts = new TurboStream();
				ts.morph('t', 'c');

				expect(ts.elements[0] instanceof TurboElement).to.be.true;
				expect(ts.elements[0].attributes.action).to.equal('morph');
			});

			it ('morphAll() warns about deprecation.', function() {
				return new Promise(resolve => {
					process.once('warning', err => {
						expect(err).to.be.an('error');
						expect(err.message).to.include('morphAll() is deprecated');
						resolve();
					});

					const ts = new TurboStream();
					ts.morphAll('ts', 'c');
				});
			});

			it ('morphAll() adds TurboElement with action \'morph\'', function() {
				const ts = new TurboStream();
				ts.morphAll('ts', 'c');

				expect(ts.elements[0] instanceof TurboElement).to.be.true;
				expect(ts.elements[0].attributes.action).to.equal('morph');
			});

		});
	});

	
	describe('createReadableStream(opts)', function() {

		it('returns new TurboReadable() when opts.continuous = true', function() {
			const ts = new TurboStream();
			const readable = ts.createReadableStream();
			expect(readable).to.be.an.instanceof(TurboReadable);
		});

		it('returns new Readable() when opts.continuous = false', function() {
			const ts = new TurboStream().append('t', 'c');
			const readable = ts.createReadableStream({ continuous: false });
			expect(readable).not.to.be.an.instanceof(TurboReadable);
			expect(readable).to.be.an.instanceof(Readable);
		});

		it('returns new Readable() when opts.continuous = false even if empty', function() {
			const ts = new TurboStream();
			const readable = ts.createReadableStream({ continuous: false });
			expect(readable).not.to.be.an.instanceof(TurboReadable);
			expect(readable).to.be.an.instanceof(Readable);
		});

	});

});
