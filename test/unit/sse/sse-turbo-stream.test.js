
import { expect } from '../../chai.js';
import { SseTurboStream } from '#sse';
import { Transform } from 'node:stream';

describe('SseTurboStream', function() {

	describe('renderSseEvent()', function() {
		it('returns null if no string', function() {
			const sseSt = new SseTurboStream();
			expect(sseSt.renderSseEvent()).to.be.null;
		});

		it('correctly generates SSE data for each line', function() {
			const result = new SseTurboStream().renderSseEvent('line 1\nline 2');
			expect(result).to.equal('data: line 1\ndata: line 2\n\n');
		});

		it('correctly generates SSE message for named events', function() {
			const result = new SseTurboStream('my-event').renderSseEvent('line 1\nline 2');
			expect(result).to.equal('event: my-event\ndata: line 1\ndata: line 2\n\n');
		});
	});


	describe('render()', function() {
		it('returns null if no elements', function() {
			const sseSt = new SseTurboStream('my-event');

			expect(sseSt.render()).to.be.null;
		});

		it('generates SSE message', function() {
			const sseSt = new SseTurboStream()
				.append('t', 'c');

			expect(sseSt.render()).to.equal('data: <turbo-stream action="append" target="t"><template>c</template></turbo-stream>\n\n');
		});


		it('generates SSE message with event name', function() {
			const sseSt = new SseTurboStream('my-event')
				.append('t', 'c');

			expect(sseSt.render()).to.equal('event: my-event\ndata: <turbo-stream action="append" target="t"><template>c</template></turbo-stream>\n\n');
		});
	});


	describe('event()', function() {
		it('sets the event name', function() {
			const sseSt = new SseTurboStream().event('my-event');
			expect(sseSt.eventName).to.equal('my-event');
		});

		it('is chainable', function() {
			const sseSt = new SseTurboStream().event('my-event');
			expect(sseSt).to.be.an.instanceof(SseTurboStream);
		});
	});


	it('createReadableStream() returns Transform', function() {
		const sseSt = new SseTurboStream();
		const readable = sseSt.createReadableStream();

		expect(readable).to.be.an.instanceof(Transform);
	});


	it('SSE message gets written to stream', function() {
		return new Promise((resolve, reject) => {
			const sseSt = new SseTurboStream();
			const readable = sseSt.createReadableStream();

			readable.on('data', chunk => {
				expect(chunk.toString()).to.equal('data: <turbo-stream action="append" target="t"><template>c</template></turbo-stream>\n\n');
				readable.destroy();
				resolve();
			});

			readable.on('error', err => {
				reject(err);
			});

			sseSt.append('t', 'c');
		});
	});


	it('SSE message with event name gets written to stream', function() {
		return new Promise((resolve, reject) => {
			const sseSt = new SseTurboStream('my-event');
			const readable = sseSt.createReadableStream();

			readable.on('data', chunk => {
				expect(chunk.toString()).to.equal('event: my-event\ndata: <turbo-stream action="append" target="t"><template>c</template></turbo-stream>\n\n');
				resolve();
			});

			readable.on('error', err => {
				reject(err);
			});

			sseSt.append('t', 'c');
		});
	});

});
