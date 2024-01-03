
import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { TurboStream, TurboFrame } from '#core';
import { turbochargeExpress } from '#express';

describe('Express integration', function() {

	before(function() {
		const app = express();

		turbochargeExpress(app);		
		
		app.use((req, res, next) => {
			this.storedReq = req;
			this.storedRes = res;
			next();
		});
		
		app.get('/frameautoid', (req, res) => {
			if (req.isTurboFrameRequest()) {
				res.turboFrame('<p>content</p>');	
			}
			else {
				res.status(501).end();
			}
		});

		app.get('/framesetid', (req, res) => {
			if (req.isTurboFrameRequest()) {
				res.turboFrame('set-id', '<p>content</p>');	
			}
			else {
				res.status(501).end();
			}
		});

		app.get('/stream', (req, res) => {
			if (req.isTurboStreamRequest()) {
				res
					.turboStream()
					.append('target-id', '<p>append</p>')
					.send();
			}
			else {
				res.status(501).end();
			}
		});
		
		this.app = app;
	});

	describe('turbochargeExpress()', function() {
		
		it('adds helper functions to Express\' request object', function() {
			return request(this.app)
				.get('/')
				.then(response => {
					expect(this.storedReq.getTurboFrameId).to.be.an('function');
					expect(this.storedReq.isTurboFrameRequest).to.be.an('function');
					expect(this.storedReq.isTurboStreamRequest).to.be.an('function');
				});
		});

		it('adds turboStream() to Express\' response object', function() {
			return request(this.app)
				.get('/')
				.then(response => {
					expect(this.storedRes.turboStream).to.be.an('function');
				});
		});

		it('adds turboFrame() to Express\' response object', function() {
			return request(this.app)
				.get('/')
				.then(response => {
					expect(this.storedRes.turboFrame).to.be.an('function');
				});
		});

	});

	describe('Turbo Frames', function() {
		
		it('res.turboFrame() autom. retrieves Turbo-Frame ID from request when not set', function() {
			return request(this.app)
				.get('/frameautoid')
				.set(TurboFrame.HEADER_KEY, 'turbo-frame-id')
				.expect(200)
				.then(response => {
					expect(response.text).to.equal('<turbo-frame id="turbo-frame-id"><p>content</p></turbo-frame>');
				});
		});


		it('Turbo Frame request returns Turbo Frame message', function() {
			return request(this.app)
				.get('/framesetid')
				.set(TurboFrame.HEADER_KEY, 'turbo-frame-id')
				.expect(200)
				.then(response => {
					expect(response.text).to.equal('<turbo-frame id="set-id"><p>content</p></turbo-frame>');
				});
		});


		it('Non Turbo Frame request returns status 501', function() {
			return request(this.app)
				.get('/frameautoid')
				.expect(501);
		});

	});


	describe('Turbo Streams', function() {
		
		it('Turbo Stream request returns Turbo Stream message', function() {
			return request(this.app)
				.get('/stream')
				.set('Accept', TurboStream.MIME_TYPE)
				.expect(200)
				.then(response => {
					expect(response.text.trim()).to.equal('<turbo-stream action="append" target="target-id"><template><p>append</p></template></turbo-stream>');
				});
		});

		it('Non Turbo Stream request returns status 501', function() {
			return request(this.app)
				.get('/stream')
				.expect(501);
		});

	});

});
