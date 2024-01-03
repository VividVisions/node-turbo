
import { expect } from 'chai';
import request from 'supertest';
import { TurboStream } from '#core';
import { WsTurboStream } from '#ws';
import { WebSocketServer, WebSocket, createWebSocketStream } from 'ws';

// The port of our test server.
const port = 8888;

describe('WebSocket integration', function() {

	// Create server.
	before(function() {
		this.wss = new WebSocketServer({ port });

		this.wss.on('connection', ws => {
			ws.on('error', expect.fail);
		});
	});


	// Close all connections and the server.
	after(function() {
		this.wss.clients.forEach(ws => {
			ws.close();

			// A bit brutal but whatevs.
			process.nextTick(() => {
				if ([WebSocket.OPEN, WebSocket.CLOSING].includes(ws.readyState)) {
					ws.terminate();
				}
			});
		});

		this.wss.close();
	});


	it('Client receives Turbo Stream message (buffer = true)', function() {
		return new Promise((resolve, reject) => {
			// Create client.
			const ws = new WebSocket(`ws://localhost:${port}`, { perMessageDeflate: false });

			ws.on('error', err => {
				return reject(err);
			});

			// We're expecting one message with two elements.
			ws.on('message', data => {
				expect(data.toString()).to.equal('<turbo-stream action="append" target="t1"><template>c1</template></turbo-stream>\n<turbo-stream action="update" target="t2"><template>c2</template></turbo-stream>');
				ws.close();
				resolve();
			});

			// As soon as the client is ready, the server broadcasts the Turbo Stream message.
			ws.on('open', () => {
				this.wss.clients.forEach(ws => {
					const wsts = new WsTurboStream(ws);
					wsts
						.append('t1', 'c1')
						.update('t2', 'c2')
						.flush();
				});
			});
		});
	});


	it('Client receives Turbo Stream message (buffer = false)', function() {
		return new Promise((resolve, reject) => {
			// Create client.
			const ws = new WebSocket(`ws://localhost:${port}`, { perMessageDeflate: false });
			const messages = [];

			ws.on('error', err => {
				return reject(err);
			});

			// We're expecting one message with two elements.
			ws.on('message', data => {
				messages.push(data.toString());
				if (messages.length === 2) {
					expect(messages[0]).to.equal('<turbo-stream action="append" target="t1"><template>c1</template></turbo-stream>');
					expect(messages[1]).to.equal('<turbo-stream action="update" target="t2"><template>c2</template></turbo-stream>');
					ws.close();
					resolve();
				}
			});

			// As soon as the client is ready, the server broadcasts the Turbo Stream message.
			ws.on('open', () => {
				this.wss.clients.forEach(ws => {
					 WsTurboStream
					 	.use(ws)
						.append('t1', 'c1')
						.update('t2', 'c2');
				});
			});
		});
	});


	it('Client receives Turbo Stream message through Node.js streams API', function() {
		return new Promise((resolve, reject) => {
			// Create client.
			const ws = new WebSocket(`ws://localhost:${port}`, { perMessageDeflate: false });
			
			ws.on('error', err => {
				return reject(err);
			});

			const messages = [];

			// We're expecting one message with two elements.
			ws.on('message', (data, isBinary) => {
				messages.push(data.toString());
				if (messages.length === 2) {
					expect(messages[0]).to.equal('<turbo-stream action="append" target="t1"><template>c1</template></turbo-stream>');
					expect(messages[1]).to.equal('<turbo-stream action="update" target="t2"><template>c2</template></turbo-stream>');
					ws.close();
					resolve();
				}
			});

			// As soon as the client is ready, the server broadcasts the Turbo Stream message.
			ws.once('open', () => {
				this.wss.clients.forEach(ws => {
					const ts = new TurboStream();
					const readable = ts.createReadableStream();

					readable.on('error', err => {
						return reject(err);
					});

					const wsStream = createWebSocketStream(ws, { encoding: 'utf8' });

					wsStream.on('error', err => {
						return reject(err);
					});

					// Pipe TurboReadable to the WS duplex stream.
					readable.pipe(wsStream);
					
					// Write to TurboReadable.
					ts.append('t1', 'c1').update('t2', 'c2');
				});
			});
		});
	});

});



