
import { expect } from 'chai';
import { KoaTurboStream } from '#koa';
import { TurboStream } from '#core';


describe('KoaTurboStream', function() {

	beforeEach(function() {
		this.ctx = {
			type: null,
			body: null,
			status: null
		};
	});


	// afterEach(function() {
	// });


	it('Turbo Stream adds element in constructor', function() {
		const kts = new KoaTurboStream(this.ctx, { action: 'a', target: 't' }, 'c');
		
		expect(this.ctx.body).to.not.be.null;
	});


	it('Turbo Stream element gets written to ctx.body', function() {
		const equalTs = new TurboStream().append('t', 'c');
		const kts = new KoaTurboStream(this.ctx).append('t', 'c');

		expect(this.ctx.body).to.not.be.null;
		expect(this.ctx.body.trim()).to.equal(equalTs.render().trim());
	});


	it('Turbo Stream elements don\'t get buffered', function() {
		const kts = new KoaTurboStream(this.ctx).append('t', 'c');
		
		expect(kts.elements).to.be.empty;
	});

	it('sets status', function() {
		const kts = new KoaTurboStream(this.ctx);
		
		expect(this.ctx.status).to.equal(200);
	});

	it('sets ctx.body to empty string when not set', function() {
		const kts = new KoaTurboStream(this.ctx);
		
		expect(this.ctx.body).to.equal('');
	});

});
