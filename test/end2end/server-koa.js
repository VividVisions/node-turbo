
import Koa from 'koa';
import route from 'koa-route';
import serve from 'koa-static';
import bodyParser from '@koa/bodyparser';
import { turbochargeKoa } from '#koa';
import { SseTurboStream } from '#sse';

const app = new Koa();
let ssets;

app.on('error', (err, ctx) => {
	console.error('Error in Koa:', err);
});

// Add node-turbo functions to Koa context.
turbochargeKoa(app);

// Serve static Hotwire Turbo, which gets copied from node_modules before the test.
app.use(serve('./test/end2end/static'));

// Tell Playwright that this server is ready.
app.use(route.get('/ready', ctx => {
	ctx.body = `OK`;
	ctx.status = 200;
}));

// Main testing page. 
app.use(route.get('/test', ctx => {
	ctx.body = `<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="turbo-prefetch" content="false">
		<title>node-turbo E2E Tests</title>
		<script type="module">
		import * as Turbo from '/turbo.es2017-esm.js';
		const sse = new EventSource('/sse');
		Turbo.session.connectStreamSource(sse);

		document.getElementById('sse').addEventListener('click', async e => {
			// Ignore repsonse.
			await fetch('/sse-send');
		});
		</script>
	</head>
	<body>
		<h1>node-turbo E2E Tests</h1>
		<turbo-frame id="test-1">
			<p>preclick</p>
			<a href="/frame" data-testid="test-1-link">Link</a>
		</turbo-frame>
		<form action="/stream" method="POST" enctype="text/vnd.turbo-stream.html" id="test-form">
			<select name="action" id="select">
				<option value="append">append</option>
				<option value="prepend">prepend</option>
				<option value="replace">replace</option>
				<option value="update">update</option>
				<option value="remove">remove</option>
				<option value="before">before</option>
				<option value="after">after</option>
				<option value="refresh">refresh</option>
			</select>
			<input type="submit" id="submit">
		</form>
		<ul id="stream-response">
			<li>initial</li>
		</ul>
		<div id="sse-response">
			No SSE response yet.
		</div>
		<input id="sse" type="button" value="SSE">
	</body>
</html>`;
	ctx.status = 200;
}));

// For local use.
// app.use(async (ctx, next) => {
// 	console.log(`Request to ${ctx.path} (${ctx.method}).`);
// 	await next();
// });

// Turbo Frame response.
app.use(route.get('/frame', ctx => {
	if (ctx.isTurboFrameRequest()) {
		ctx.turboFrame('<p>afterclick</p>');
	}
	else {
		ctx.status = 501;
	}
}));

// Initiate Turbo Stream over SSE.
app.use(route.get('/sse', ctx => {
	ssets = ctx.sseTurboStream();
}));

// Send SSE on request (to prevent having to deal with timings).
app.use(route.get('/sse-send', ctx => {
	ssets.update('sse-response', 'sse-sent');
	
	ctx.status = 200;
	ctx.body = 'OK';
}));

// Parse POST body.
app.use(bodyParser());

// Turbo Stream responses.
app.use(route.post('/stream', ctx => {
	if (ctx.isTurboStreamRequest()) {
		switch (ctx.request.body?.action) {
			case 'append':
				ctx.turboStream().append('stream-response', '<li>append</li>');
				break;

			case 'prepend':
				ctx.turboStream().prepend('stream-response', '<li>prepend</li>');
				break;

			case 'replace':
				ctx.turboStream().replace('stream-response', '<div id="stream-response">replace</div>');
				break;

			case 'update':
				ctx.turboStream().update('stream-response', '<li>update</li>');
				break;

			case 'remove':
				ctx.turboStream().remove('stream-response');
				break;

			case 'before':
				ctx.turboStream().before('stream-response', '<div id="before">before</div>');
				break;

			case 'after':
				ctx.turboStream().before('stream-response', '<div id="after">after</div>');
				break;

			case 'refresh':
				ctx.turboStream().refresh();
				break;

			default:
				throw new Error(`Unknown action: ${ctx.request.body?.action}`);
		}
	}
	else {
		ctx.status = 501;
	}
}));

// Start server.
app.listen(3000);
