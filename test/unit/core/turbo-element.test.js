
import { expect } from 'chai';
import { TurboElement } from '#core';

describe('TurboElement', function() {
	
	it('Constructor correctly assigns properties (and throws Error)', function() {
		expect(function() {
			const el = new TurboElement({ foo: 'bar' }, 'c');
			expect(el.content).to.equal('c');
			expect(el.attributes).to.deep.equal({ foo: 'bar' });
		}).to.throw();
	});
	
});
