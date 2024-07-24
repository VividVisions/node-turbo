
import { expect, spy } from '../../chai.js';
import { turbochargeExpress, ExpressTurboStream } from '#express';
import { TurboStream } from '#core';
import { SseTurboStream } from '#sse';

const sandbox = spy.sandbox();

describe('turbochargeExpress()', function() {

	beforeEach(function() {
		this.mockExpressApp = {
			request: {},
			response: {
				req: {
					headers: {
						'turbo-frame': 'id'
					}
				},
				send: function(content) {
					this.output = content;
				},
				output: ''
			}
		};

		sandbox.on(this.mockExpressApp.response, ['set', 'flushHeaders', 'on', 'once', 'emit']);
	});

	afterEach(function() {
		sandbox.restore();
	});


	it('adds helper functions to Express\'s request prototype', function() {
		turbochargeExpress(this.mockExpressApp);

		expect(this.mockExpressApp.request.getTurboFrameId).to.be.a('function');
		expect(this.mockExpressApp.request.isTurboFrameRequest).to.be.a('function');
		expect(this.mockExpressApp.request.isTurboStreamRequest).to.be.a('function');
	});


	it('adds turboFrame() to Express\' response prototype', function() {
		turbochargeExpress(this.mockExpressApp);

		expect(this.mockExpressApp.response.turboFrame).to.be.a('function');
	});


	it('adds turboStream() to Express\' response prototype', function() {
		turbochargeExpress(this.mockExpressApp);

		expect(this.mockExpressApp.response.turboStream).to.be.a('function');
	});

	it('turboStream() returns TurboStream when autoSend = false', function() {
		turbochargeExpress(this.mockExpressApp, { autoSend: false });
		const ts = this.mockExpressApp.response.turboStream();

		expect(ts).to.be.instanceof(ExpressTurboStream);
	});

	describe('turboFrame()', function() {
	
		it('turboFrame(str, str) correctly calls response.send()', function() {
			turbochargeExpress(this.mockExpressApp);
			this.mockExpressApp.response.turboFrame('id', 'c');

			expect(this.mockExpressApp.response.output).to.equal('<turbo-frame id="id">c</turbo-frame>');
		});

		it('turboFrame(str) correctly retrieves turbo-frame id and calls response.send()', function() {
			turbochargeExpress(this.mockExpressApp);
			// Update the mock Express app so response.req has all added 
			// helper functions of request. 
			Object.assign(this.mockExpressApp.response.req, this.mockExpressApp.request);

			this.mockExpressApp.response.turboFrame('c');
			expect(this.mockExpressApp.response.output).to.equal('<turbo-frame id="id">c</turbo-frame>');
		});

		it('correctly returns HTML when autoSend = false', function() {
			turbochargeExpress(this.mockExpressApp, { autoSend: false });
			const html = this.mockExpressApp.response.turboFrame('id', 'c');

			expect(html).to.equal('<turbo-frame id="id">c</turbo-frame>');
		});

	});

	describe('sseTurboStream()', function() {
		
		it('returns SseTurboStream', function() {
			turbochargeExpress(this.mockExpressApp);
			const ssets = this.mockExpressApp.response.sseTurboStream();

			expect(ssets).to.be.instanceof(SseTurboStream);
		});


		it('configures Express for an SSE connection', function() {
			turbochargeExpress(this.mockExpressApp);
			const ssets = this.mockExpressApp.response.sseTurboStream();

			expect(this.mockExpressApp.response.set).to.have.been.called.with({ 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Content-Type': SseTurboStream.MIME_TYPE });
			expect(this.mockExpressApp.response.flushHeaders).to.have.been.called();
		});

		it('pipes to response', function() {
			turbochargeExpress(this.mockExpressApp);
			const ssets = this.mockExpressApp.response.sseTurboStream();

			// Pipe
			expect(this.mockExpressApp.response.on).to.have.been.called();
		});



	});
});
