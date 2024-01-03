
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ExpressTurboStream } from '#express';
import { TurboStream } from '#core';

chai.use(spies);
const sandbox = chai.spy.sandbox();


describe('ExpressTurboStream', function() {

	beforeEach(function() {
		this.response = {};
		sandbox.on(this.response, ['send', 'type']);
	});


	afterEach(function() {
		sandbox.restore();
	});


	it('send() sets correct Content-Type', function() {
		const kts = new ExpressTurboStream(this.response);
		kts.send();

		expect(this.response.type).to.have.been.called.with(TurboStream.MIME_TYPE);
	});


	it('send() calls res.send()', function() {
		const kts = new ExpressTurboStream(this.response);
		
		kts.send();
		expect(this.response.send).to.have.been.called();
	});

});
