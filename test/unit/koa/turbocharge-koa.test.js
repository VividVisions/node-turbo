
import { expect, spy } from '../../chai.js';
import { turbochargeKoa } from '#koa';
import { TurboStream, TurboReadable } from '#core';
import { SseTurboStream } from '#sse';
import { Transform } from 'node:stream';

describe('turbochargeKoa()', function() {

	beforeEach(function() {
		this.mockKoaApp = {
			context: {
				compress: null,
				body: null,
				req: {
					headers: {
						'turbo-frame': 'id'
					}
				}
			}
		};

		// sandbox.on(this.mockKoaApp.context.req.socket, ['setTimeout', 'setNoDelay', 'setKeepAlive']);
		spy.on(this.mockKoaApp.context, 'set');
	});


	afterEach(function() {
		// sandbox.restore();
		spy.restore(this.mockKoaApp.context, 'set');
	});


	it('adds helper functions to Koa\'s context prototype', function() {
		turbochargeKoa(this.mockKoaApp);

		expect(this.mockKoaApp.context.getTurboFrameId).to.be.a('function');
		expect(this.mockKoaApp.context.isTurboFrameRequest).to.be.a('function');
		expect(this.mockKoaApp.context.isTurboStreamRequest).to.be.a('function');
	});


	it('adds turboFrame() to Koa\'s context prototype', function() {
		turbochargeKoa(this.mockKoaApp);

		expect(this.mockKoaApp.context.turboFrame).to.be.a('function');
	});


	it('adds turboStream() to Koa\'s context prototype', function() {
		turbochargeKoa(this.mockKoaApp);

		expect(this.mockKoaApp.context.turboStream).to.be.a('function');
	});


	it('adds sseTurboStream() to Koa\'s context prototype', function() {
		turbochargeKoa(this.mockKoaApp);

		expect(this.mockKoaApp.context.sseTurboStream).to.be.a('function');
	});


	it('turboFrame(str, str) correctly writes to context.body', function() {
		turbochargeKoa(this.mockKoaApp);
		this.mockKoaApp.context.turboFrame('id', 'c');

		expect(this.mockKoaApp.context.body).to.equal('<turbo-frame id="id">c</turbo-frame>');
	});


	it('turboFrame(str) correctly retrieves turbo-frame id and writes to context.body', function() {
		turbochargeKoa(this.mockKoaApp);
		this.mockKoaApp.context.turboFrame('c');

		expect(this.mockKoaApp.context.body).to.equal('<turbo-frame id="id">c</turbo-frame>');
	});


	it('turboFrame() correctly returns HTML when autoRender = false', function() {
		turbochargeKoa(this.mockKoaApp, { autoRender: false });
		const html = this.mockKoaApp.context.turboFrame('id', 'c');

		expect(html).to.equal('<turbo-frame id="id">c</turbo-frame>');
	});


	it('turboStream() correctly writes to context.body', function() {
		turbochargeKoa(this.mockKoaApp);
		this.mockKoaApp.context.turboStream().append('t', 'c');

		expect(this.mockKoaApp.context.body.trim()).to.equal('<turbo-stream action="append" target="t"><template>c</template></turbo-stream>');
	});


	it('turboStream() returns TurboStream when autoRender = false', function() {
		turbochargeKoa(this.mockKoaApp, { autoRender: false });
		const ts = this.mockKoaApp.context.turboStream();

		expect(ts).to.be.instanceof(TurboStream);
	});


	describe('sseTurboStream()', function() {
		
		it('returns SseTurboStream', function() {
			turbochargeKoa(this.mockKoaApp);
			const ssets = this.mockKoaApp.context.sseTurboStream();//boundSseTurboStream();

			expect(ssets).to.be.instanceof(SseTurboStream);
		});


		it('configures Koa for an SSE connection', function() {
			turbochargeKoa(this.mockKoaApp);
			const ssets = this.mockKoaApp.context.sseTurboStream();//boundSseTurboStream();

			expect(this.mockKoaApp.context.compress).to.be.false;
			// expect(this.mockKoaApp.context.req.socket.setTimeout).to.have.been.called.with(0);
			// expect(this.mockKoaApp.context.req.socket.setNoDelay).to.have.been.called.with(true);
			// expect(this.mockKoaApp.context.req.socket.setKeepAlive).to.have.been.called.with(true);
			expect(this.mockKoaApp.context.set).to.have.been.called.with({ 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Content-Type': SseTurboStream.MIME_TYPE });
			expect(this.mockKoaApp.context.status).to.equal(200);
			// expect(this.mockKoaApp.context.type).to.equal(SseTurboStream.MIME_TYPE);
		});


		it('sets ctx.body to Transform stream', function() {
			turbochargeKoa(this.mockKoaApp);
			const ssets = this.mockKoaApp.context.sseTurboStream();//boundSseTurboStream();

			expect(this.mockKoaApp.context.body).to.be.an.instanceof(Transform);
		});

	});

});
