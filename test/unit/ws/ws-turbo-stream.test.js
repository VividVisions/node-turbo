
import { expect, spy } from '../../chai.js';
import { WsTurboStream } from '#ws';
import { TurboStream } from '#core';


// Mock WebSocket instance.
const mockWs = {
	readyState: WsTurboStream.OPEN,
	send() {}
};


describe('WsTurboStream', function() {

	beforeEach(() => {
		spy.on(mockWs, 'send');
	});


	afterEach(() => {
		spy.restore(mockWs, 'send');
	});


	it('Message is sent to WebSocket on \'render\' when buffer === true', function() {
		const wsts = new WsTurboStream(mockWs)
			.append('t', 'c')
			.flush();

		expect(mockWs.send).to.have.been.called();
	});


	it('Message is sent to WebSocket on \'element\' when buffer === false', function() {
		const wsts = WsTurboStream
			.use(mockWs)
			.append('t1', 'c1')
			.append('t2', 'c2');

		expect(mockWs.send).to.have.been.called.twice;
	});

});
