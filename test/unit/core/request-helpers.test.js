
import { expect } from '../../chai.js';
import * as hlp from '../../../lib/request-helpers.js';
import httpMocks from 'node-mocks-http';

describe('Request helpers', function() {

	describe('isTurboStreamRequest()', function() {
		
		it('returns true on recognised MIME type', function() {
			const req = httpMocks.createRequest({
				method: 'POST',
				url: '/',
				headers: {
					'Accept': 'text/html',
					'Accept': 'text/vnd.turbo-stream.html'
				}
			});

			expect(hlp.isTurboStreamRequest(req)).to.be.true;
		});


		it('returns false on missing MIME type', function() {
			const req = httpMocks.createRequest({
				method: 'POST',
				url: '/',
				headers: {
					'Accept': 'text/html'
				}
			});

			expect(hlp.isTurboStreamRequest(req)).to.be.false;
		});


		it('returns false when missing headers fields', function() {
			expect(hlp.isTurboStreamRequest({})).to.be.false;
		});

	});

	describe('isTurboFrameRequest()', function() {

		it('returns true on recognised turbo-frame', function() {
			const req = httpMocks.createRequest({
				method: 'POST',
				url: '/',
				headers: {
					'turbo-frame': 'name',
				}
			});

			expect(hlp.isTurboFrameRequest(req)).to.be.true;
		});


		it('returns false on missing turbo-frame', function() {
			const req = httpMocks.createRequest({
				method: 'POST',
				url: '/',
				headers: {
				}
			});

			expect(hlp.isTurboFrameRequest(req)).to.be.false;
		});

		it('returns false when missing headers fields', function() {
			expect(hlp.isTurboFrameRequest({})).to.be.false;
		});

	});


	describe('getTurboFrameId()', function() {
		
		it('returns ID of turbo-frame if available', function() {
			const req = httpMocks.createRequest({
				method: 'POST',
				url: '/',
				headers: {
					'turbo-frame': 'name',
				}
			});

			expect(hlp.getTurboFrameId(req)).to.equal('name');
		});

		it('returns null in any other case', function() {
			expect(hlp.getTurboFrameId({})).to.be.null;
		});

	});


});
