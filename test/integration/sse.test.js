
import { expect } from '../chai.js';
import request from 'supertest';
import Koa from 'koa';
import { EventSource } from 'eventsource';
import { TurboStream } from '#core';
import { SseTurboStream } from '#sse';
import { PassThrough } from 'node:stream';

const port = 8888;

describe('SSE integration', function() {

	before(function() {
		this.app = new Koa();
		this.sseTurboStream = new SseTurboStream();

		this.app.on('error', (err, ctx) => {
			expect.fail(err);
		});

		this.app.use(async (ctx, next) => {
			if (ctx.path !== '/sse') {
				return await next();
			}

			ctx.request.socket.setTimeout(0);
			ctx.req.socket.setNoDelay(true);
			ctx.req.socket.setKeepAlive(true);

			ctx.set({
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
			});

			this.readable = this.sseTurboStream.createReadableStream();

			ctx.type = SseTurboStream.MIME_TYPE;
			ctx.status = 200;
			ctx.body = this.readable;
		});

		this.server = this.app.listen(port);
	});


	after(function() {
		this.readable.destroy();
		this.eventSource.close();
		this.server.close();
	});


	it('Turbo Stream messages get sent to EventSource as SSE messages', function(done) {
		const messages = [];
		
		this.eventSource = new EventSource(`http://localhost:${port}/sse`);
		
		this.eventSource.addEventListener('error', e => {
			expect.fail('An error occurred while attempting to connect');
		});

		this.eventSource.addEventListener('message', e => {
			
			messages.push(e.data);

			if (messages.length === 2) {
				expect(messages[0]).to.equal('<turbo-stream action="append" target="t1"><template>c1</template></turbo-stream>');
				expect(messages[1]).to.equal('<turbo-stream action="replace" target="t2"><template>c2</template></turbo-stream>');
				done();
			}
		});

		// Send Turbo Stream messages.
		this.sseTurboStream.append('t1', 'c1');
		this.sseTurboStream.replace('t2', 'c2');
	});


});
