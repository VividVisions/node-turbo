
import { expect } from '../chai.js';
import Koa from 'koa';
import { EventSource } from 'eventsource';
import { SseTurboStream } from '#sse';

 
const port = 8888;


describe('SSE integration', function() {

	before(function() {
		this.readable = null;
		this.eventSource = null;
		this.server = null;
		this.app = new Koa();
		this.sseTurboStream = new SseTurboStream();
		
		this.app.on('error', (err, ctx) => {
			// ERR_STREAM_PREMATURE_CLOSE is expected when the SSE client disconnects.
			// Also @see: {@link https://github.com/koajs/koa/pull/612|Koa GitHub Issue 612}
			if (err?.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
				console.error(err);
			}
		});

		this.app.use(async (ctx, next) => {
			if (ctx.path !== '/sse') {
				return await next();
			}

			ctx.request.socket.setTimeout(0);
			ctx.req.socket.setNoDelay(true);
			ctx.req.socket.setKeepAlive(true);

			ctx.set({
				'Content-Type': SseTurboStream.MIME_TYPE,
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive'
			});

			this.readable = this.sseTurboStream.createNodeStream();
			ctx.req.on('close', () => this.readable.destroy());

			ctx.status = 200;
			ctx.body = this.readable;
		});
		
		this.server = this.app.listen(port);
	});


	after(function() {
		this.server.closeAllConnections();
		this.server.close();
	});


	it('Turbo Stream messages get sent to EventSource as SSE messages', function() {
		return new Promise((resolve, reject) => {
			const messages = [];
			
			this.eventSource = new EventSource(`http://localhost:${port}/sse`);
			
			this.eventSource.addEventListener('error', (e) => {
				expect.fail(e.message);
				reject(e);
			});
			
			this.eventSource.addEventListener('message', (e) => {
				messages.push(e);
			
				if (messages.length === 2) {
					expect(messages[0].type).to.equal('message');
					expect(messages[0].data).to.equal('<turbo-stream action="append" target="t1"><template>c1</template></turbo-stream>');
					expect(messages[1].type).to.equal('message');
					expect(messages[1].data).to.equal('<turbo-stream action="replace" target="t2"><template>c2</template></turbo-stream>');

					this.eventSource.close();
					resolve();
				}
			});
			
			// Send Turbo Stream messages.
			this.sseTurboStream
				.append('t1', 'c1')
				.replace('t2', 'c2');
		});
	});

});
