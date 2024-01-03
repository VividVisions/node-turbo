
import { expect } from 'chai';
import request from 'supertest';
import Koa from 'koa';
import route from 'koa-route';
import { TurboStream, TurboFrame } from '#core';
import { turbochargeKoa } from '#koa';

describe('Koa integration', function() {

	before(function() {
		const app = new Koa();

		app.on('error', (err, ctx) => {
			expect.fail(err);
		});

		turbochargeKoa(app);
		
		app.use(async (ctx, next) => {
			this.storedCtx = ctx;
			await next();
		});
		
		app.use(route.get('/frame', ctx => {
			if (ctx.isTurboFrameRequest()) {
				ctx.turboFrame('<p>content</p>');
			}
			else {
				ctx.status = 501;
			}
		}));

		app.use(route.get('/stream', ctx => {
			if (ctx.isTurboStreamRequest()) {
				ctx
					.turboStream()
					.append('target-id', '<p>append</p>');
			}
			else {
				ctx.status = 501;
			}
		}));
		
		this.app = app;
	});

	describe('turbochargeKoa()', function() {
		
		before(function() {
			return new Promise((resolve, reject) => {;
				request(this.app.callback())
					.get('/')
					.end((err, res) => {
						if (err) {
							return reject(err);
						}
						resolve(res);
					});
			});
		});


		it('adds helper functions to Koa\'s ctx', function() {
			expect(this.storedCtx.getTurboFrameId).to.be.a('function');
			expect(this.storedCtx.isTurboFrameRequest).to.be.a('function');
			expect(this.storedCtx.isTurboStreamRequest).to.be.a('function');
		});


		it('adds turboStream() to Koa\'s ctx', function() {
			expect(this.storedCtx.turboStream).to.be.a('function');
		});


		it('adds turboFrame() to Koa\'s ctx', function() {
			expect(this.storedCtx.turboFrame).to.be.a('function');
		});

	});

	describe('Turbo Frames', function() {
		
		it('Turbo Frame request returns Turbo Frame message', function() {
			return request(this.app.callback())
				.get('/frame')
				.set(TurboFrame.HEADER_KEY, 'turbo-frame-id')
				.expect(200)
				.expect('Content-Type', /text\/html/)
				.then(response => {
					expect(response.text).to.equal('<turbo-frame id="turbo-frame-id"><p>content</p></turbo-frame>');
				});
		});

		it('Non Turbo Frame request returns status 501', function() {
			return request(this.app.callback())
				.get('/frame')
				.expect(501);
		});

	});


	describe('Turbo Streams', function() {
		
		it('Turbo Stream request returns Turbo Stream message with correct MIME type', function() {
			return request(this.app.callback())
				.get('/stream')
				.set('Accept', TurboStream.MIME_TYPE)
				.expect(200)
				.expect('Content-Type', new RegExp(TurboStream.MIME_TYPE))
				.then(response => {
					expect(response.text.trim()).to.equal('<turbo-stream action="append" target="target-id"><template><p>append</p></template></turbo-stream>');
				});
		});

		it('Non Turbo Stream request returns status 501', function() {
			return request(this.app.callback())
				.get('/stream')
				.expect(501);
		});

	});

});
