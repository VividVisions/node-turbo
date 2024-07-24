
import { expect } from '../../chai.js';
import { TurboElement } from '#core';


class NonThrowingTurboElement extends TurboElement {
	validate() {}
}

describe('TurboElement', function() {
	
	it('Constructor correctly assigns properties (and throws Error)', function() {
		expect(function() {
			const el = new TurboElement({ foo: 'bar' }, 'c');
			expect(el.content).to.equal('c');
			expect(el.attributes).to.deep.equal({ foo: 'bar' });
		}).to.throw();
	});
	

	describe('renderAttributesAsHtml()', function() {

		it('correctly renders attributes', function() {
			const te = new NonThrowingTurboElement({ 
					foo: 'bar',
					two: 2
				});

			expect(te.renderAttributesAsHtml()).to.equal('foo="bar" two="2"');
		});


		it('correctly renders booelan attributes', function() {
			const te = new NonThrowingTurboElement({ 
					foo: 'bar',
					bool: null
				});

			expect(te.renderAttributesAsHtml()).to.equal('foo="bar" bool');
		});	

	});

});
