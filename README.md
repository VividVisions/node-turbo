# node-turbo

A library for Node.js to assist with the server side of [37signals](https://37signals.com)' [Hotwire Turbo](https://turbo.hotwired.dev) framework. It provides classes and functions for Web servers and also convenience functions for the frameworks [Koa](https://koajs.com) and [Express](https://expressjs.com) as well as for [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) and [SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events).

This documentation assumes that you are familiar with Turbo and its [handbook](https://turbo.hotwired.dev/handbook/introduction).

## Table of Contents
- [Installation](#installation)
- [Compatibility](#compatibility)
  - [Browser](#browser)
  - [ES Module](#es-module)
  - [Tested](#tested)
- [API docs](#api-docs)
- [Usage](#usage)
  - [Basics\/Standalone](#basicsstandalone)
    - [Turbo Stream](#turbo-stream)
      - [Target multiple elements](#target-multiple-elements)
      - [Custom actions](#custom-actions)
      - [Using the Node.js streams API](#using-the-nodejs-streams-api)
    - [Turbo Frame](#turbo-frame)    
    - [Request helper functions](#request-helper-functions)
      - [isTurboStreamRequest(request)](#isturbostreamrequestrequest)
      - [isTurboFrameRequest(request)](#isturboframerequestrequest)
      - [getTurboFrameId(request)](#getturboframeidrequest)
  - [Koa](#koa)
  - [Express](#express)
  - [WebSocket](#websocket)
  - [SSE](#sse)
    - [Using http.Server](#using-httpserver)
    - [Using Koa](#using-koa)
    - [Using Express](#using-express)
- [License](#license)

## Installation
```console
npm install node-turbo 
```

## Compatibility

### Browser
This module has been built for Node.js only and does not work in the browser (nor is it needed there).

### ES Module
node-turbo as been written as an ECMAScript module and all examples will use ES module syntax. If you want to use node-turbo within a CommonJS application, use dynamic [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) instead of `require()`.

### Tested
node-turbo has been tested with:

| Name | Version(s) |
| :--- | :--- |
| [Node.js](https://nodejs.org/) | 16.6  — 18.16.0 |
| [Hotwired Turbo](https://turbo.hotwired.dev/) | 7.3.0 — 8.0.0-beta.2 |
| [Koa](https://koajs.com/) | 2.14.2 |
| [Express](https://expressjs.com/) | 4.18.2 |
| [ws](https://github.com/websockets/ws) | 8.15.1 |

## API docs
See [`/docs/API.md`](./doc/API.md) for a documentation of all node-turbo classes and functions.

## Usage

### Basics/Standalone

#### Turbo Stream
```javascript
import { TurboStream } from 'node-turbo';

const ts = new TurboStream({ 
		action: 'append', 
		target: 'target-id' 
	}, 
	'<p>My content</p>');

const html = ts.render();
```

This will render the following HTML fragment:

```html
<turbo-stream action="append" target="target-id">
	<template>
		<p>My content</p>
	</template>
</turbo-stream>
```

For all [supported actions](https://turbo.hotwired.dev/handbook/streams#stream-messages-and-actions), there are chainable shortcut functions:

```javascript
import { TurboStream } from 'node-turbo';

const ts = new TurboStream()
	.append('target-id', '<p>My content</p>')
	.replace('target-id-2', '<p>New content</p>')
	.remove('target-id-3');
const html = ts.render();
```

Result:

```html
<turbo-stream action="append" target="target-id">
	<template>
		<p>My content</p>
	</template>
</turbo-stream>
<turbo-stream action="replace" target="target-id-2">
	<template>
		<p>New content</p>
	</template>
</turbo-stream>
<turbo-stream action="remove" target="target-id-3">
	<!-- <template> and content are omitted -->
</turbo-stream>
```

##### Target multiple elements
If you want to [target multiple elements](https://turbo.hotwired.dev/handbook/streams#actions-with-multiple-targets), you can use the `[action]All()` function:

```javascript
import { TurboStream } from 'node-turbo';

let ts = new TurboStream()
	.appendAll('.my-targets', '<p>My content</p>');
```

Result:

```html
<turbo-stream action="append" targets=".my-targets">
	<template>
		<p>My content</p>
	</template>
</turbo-stream>
```

##### Custom actions
If you want to use [custom actions](https://turbo.hotwired.dev/handbook/streams#custom-actions), you can use the `custom()`/`customAll()` functions: 
```javascript
import { TurboStream } from 'node-turbo';

let ts = new TurboStream()
	.custom('custom-action', 'target-id', '<p>My content</p>');
```

##### Using the Node.js streams API
If you want to use the [Node.js streams API](https://nodejs.org/docs/latest/api/stream.html) with Turbo Streams, you can 
create a Readable stream instance which reads Turbo Stream messages.

```javascript
import { TurboStream } from 'node-turbo';

const ts = new TurboStream();
const readable = ts.createReadableStream();

readable.pipe(process.stdout)
```

See [Koa](#koa), [SSE](#sse) or [WebSocket](#websocket) for further examples.

#### Turbo Frame
```javascript
import { TurboFrame } from 'node-turbo';

const tf = new TurboFrame('my-id', '<p>content</p>');
const html = tframe.render();
```

This will render the following HTML fragment:

```html
<turbo-frame id="my-id">
	<p>My content</p>
</turbo-stream>
``` 

#### Request Helper Functions
node-turbo also provides the following helper functions. You can use these to adapt the behaviour of your server to the differend kind of requests.

##### isTurboStreamRequest(request)
```javascript
import { isTurboStreamRequest } from 'node-turbo';

const isTsReq = isTurboStreamRequest(req);
```
Checks if the request is a Turbo Stream request by looking if the HTTP header `Accept` includes the MIME type `text/vnd.turbo-stream.html`. Expects an object like an http.ClientRequest instance but doesn not make any hard checks. Returns `true` or `false`.

##### isTurboFrameRequest(request)
```javascript
import { isTurboFrameRequest } from 'node-turbo';

const isTfReq = isTurboFrameRequest(req);
```
Checks if the request is a Turbo Stream request by looking for the HTTP header `turbo-frame`, which holds the ID of the Turbo Frame that made the request. Expects an object like an `http.ClientRequest` instance but does not make any hard checks. Returns `true` or `false`.

##### getTurboFrameId(request)
```javascript
import { getTurboFrameId } from 'node-turbo';

const tfId = getTurboFrameId(req);
```
Returns the content of the HTTP header `turbo-frame`, which holds the ID of the Turbo Frame which made the request. Expects an object like an `http.ClientRequest` instance but doesn not make any hard checks.

### Koa
You can add convencience functions to your Koa application by calling `turbochargeKoa(app)`. This adds the following functions to Koa's `context`:

- `turboStream()`  
  Returns a chainable Turbo Stream instance which directly writes to `ctx.body` whenever an element is added. Also sets the correct `Content-Type` header.
- `turboFrame()`  
  Returns a Turbo Frame instance which directly writes to `ctx.body`. 
- `isTurboStreamRequest()`  
  Checks if the request is a Turbo Stream request by looking for the MIME type in the `accept` headers.  
  Returns `true`/`false`.
- `isTurboFrameRequest()`  
  Checks if the request is a Turbo Frame request by looking for the `turbo-frame` header.  
  Returns `true`/`false`.
- `getTurboFrameId()`  
  Returns the contents of the `turbo-frame` header.
- `sseTurboStream()`  
  *Experimental*. Configures Koa to keep the connection open and use a stream to pipe to `ctx.res`.  
  See [SSE using Koa](#using-koa) for further examples.


```javascript
import Koa from 'koa';
import { turbochargeKoa } from 'node-turbo/koa';

const app = new Koa();
turbochargeKoa(app);

app.use(async (ctx, next) => {
	if (ctx.path !== '/turbo-frame') {
		return await next();
	}

	if (ctx.isTurboFrameRequest()) {
		// Automatically retrieves the Turbo Frame ID from the header
		// and uses it for the response. 
		ctx.turboFrame('<p>New content</p>');
		//You can set it manually with:
		// ctx.turboFrame('turbo-frame-id', <p>New content</p>');
	}
	else {
		ctx.redirect('/path/to/other/page');
	}
});

app.use(async (ctx, next) => {
	if (ctx.path !== '/turbo-stream') {
		return await next();
	}

	if (ctx.isTurboStreamRequest()) {
		ctx.turboStream() 
			.append('target-id', '<p>New content</p>');
	}
	else {
		ctx.redirect('/path/to/other/page');
	}
});

app.use(async (ctx, next) => {
	if (ctx.path !== '/sse') {
		return await next();
	}

	const ssets = ctx.sseTurboStream();

	// These get automatically piped to ctx.res in SSE format.
	ssets
		.append('target-id', '<p>My content</p>')
		.updateAll('.targets', '<p>My other content</p>');
}); 

app.listen(8080);
```

### Express
You can add convencience functions to your Express application by calling `turbochargeExpress(app)`. This adds the following functions to Express' `request` object:

- `isTurboStreamRequest()`  
  Checks if the request is a Turbo Stream request by looking for the MIME type in the `accept` headers.  
  Returns `true`/`false`.
- `isTurboFrameRequest()`  
  Checks if the request is a Turbo Frame request by looking for the `turbo-frame` header.  
  Returns `true`/`false`.
- `getTurboFrameId()`
  Returns the contents of the `turbo-frame` header.

Also adds the following functions to Express' `response` object:

- `turboStream()`  
  Returns a chainable Turbo Stream instance which introduces the function `send()` which sends the rendered Turbo Stream message as HTTP response with the correct MIME type.
- `turboFrame(id, content)`
  Returns a Turbo Frame instance which directly sends the rendered Turbo Frame message as HTTP response.
- `turboFrame(content)`
  If you omit the `id` attribute, it is automatically added by using the ID from the `turbo-frame` header.
- `sseTurboStream()`  
  *Experimental*. Configures Express to keep the connection open and use a stream to pipe to `res`.  
  See [SSE using Express](#using-express) for further examples.

```javascript
import express from 'express';
import { turbochargeExpress } from 'node-turbo/express';

const app = express();
turbochargeExpress(app);

app.get('/', (req, res) => {
	if (req.isTurboFrameRequest()) {
		res.turboFrame('<p>My content</p>');	
	}
	else if (req.isTurboStreamRequest()) {
		res.turboStream()
			.append('target-id', '<p>My content</p>')
			.remove('taget-id-2')
			.send();
	}
	else {
		res.status(501).end();
	}
});

app.listen(8080, () => {
  // ...
});
```

### WebSocket

We're using the library [ws](https://github.com/websockets/ws) for our examples.

```javascript
import { WsTurboStream } from 'node-turbo/ws';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', webSocket => {
	// The Turbo Stream messages get sent immediately.
	WsTurboStream
		.use(webSocket)
		.append('id1', 'c1')
		.update('id2', 'c2');
});
```

You can also use the Node.js streams API by utilizing ws' `createWebSocketStream()` function.

```javascript
import { TurboStream } from 'node-turbo';
import { WebSocketServer, createWebSocketStream } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
	const ts = new TurboStream();
	const readable = ts.createReadableStream();
	const wsStream = createWebSocketStream(ws, { encoding: 'utf8' });
	readable.pipe(wsStream);

	ts
		.append('target-id', '<p>My content</p>')
		.update('target-id-2', '<p>Updated content</p>')
		.remove('target-id-2');
});
```

### SSE

#### Using http.Server

```javascript
import http from 'node:http';
import { SseTurboStream } from 'node-turbo/sse';

const config = {};
config.port = 8080;
config.baseUrl = `http://localhost:${config.port}`;
config.sseUrl = `${config.baseUrl}/sse`;

const httpServer = http.createServer((req, res) => {

	// SSE endpoint
	if (req.url === '/sse') {
	
		res.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			...(req.httpVersionMajor === 1 && { 'Connection': 'keep-alive' })
		});

		// Turbo listens to nameless events and 'message' events.
		const ssets = new SseTurboStream('message');
		
		// Timeout is only here for us to have time to observe.
		setTimeout(() => {	
			ssets.append('stream1', '<p>My content</p>')
				.append('stream2', '<p>My content 2</p>')
				.append('stream3', '<p>\n<span>My multiline content 3</span>\n</p>');
				
			res.write(ssets.flush());
		}, 1000);

		// You can also use the streams API.
		setTimeout(() => {		
			const stream = ssets.createReadableStream();
			stream.pipe(res);	
			ssets.prependAll('.stream', '<p>Prepend!</p>');
		}, 2000);

		return;
	}

	// Client
	res.end(`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>SSE Test</title>
		<style>
		.b {
			border: 1px dashed #cccc;
			margin-bottom: 10px;
			padding: 10px;
		}
		</style>
		<script type="module" src="https://unpkg.com/@hotwired/turbo@8.0.0-beta.2/dist/turbo.es2017-esm.js"></script>
		<script>
			var eventSource = new EventSource('/sse');
			eventSource.onmessage = function(event) {
				document.getElementById('log').innerText += event.data + '\\n\\n';
			};
		</script>
	</head>
	<body>
		<turbo-stream-source src="${ config.sseUrl }">
		<h1>SSE Test</h1>
		<h2>Control</h2>
		<pre class="b" id="log"></pre>
		<h2>stream1</h2>
		<div class="b stream" id="stream1"></div> 
		<h2>stream2</h2>
		<div class="b stream" id="stream2"></div> 
		<h2>stream3</h2>
		<div class="b stream" id="stream3"></div> 
	</body>
</html>`);
});

httpServer.listen(config.port);

httpServer.on('error', (err) => {
	console.log(err);
	process.exit(1);
});

httpServer.on('listening', () => {
	console.log(`HTTP server listening on port ${config.port}…`);
});
```

#### Using Koa
```javascript
import Koa from 'koa';
import { turbochargeKoa } from 'node-turbo/koa';

// Config
const config = {};
config.port = 8080;
config.baseUrl = `http://localhost:${config.port}`;
config.sseUrl = `${config.baseUrl}/sse`;

// Koa
const app = new Koa();

// Augment Koa with convenience functions.
turbochargeKoa(app);

app.use(async (ctx, next) => {
	if (ctx.path !== '/sse') {
		return await next();
	}

	// Use convenience function to configure Koa.
	// Returns SseTurboStream instance which directly streams to res.
	const ssets = ctx.sseTurboStream();

	// Timeout is only here for us to have time to observe.
	setTimeout(() => {
		ssets
			.append('stream1', '<p>My content <strong>1</strong></p>')
			.append('stream2', '<p>My content <strong>2</strong></p>')
			.append('stream3', '<p>My content <strong>3</strong></p>');
	}, 1000);

	setTimeout(() => {
		ssets.prependAll('.stream', '<p>Prepend all</p>');
	}, 2000);
});

app.use(async (ctx, next) => {
	ctx.body = `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>SSE Test</title>
		<style>
		.b {
			border: 1px dashed #cccc;
			margin-bottom: 10px;
			padding: 10px;
		}
		</style>
		<script type="module" src="https://unpkg.com/@hotwired/turbo@8.0.0-beta.2/dist/turbo.es2017-esm.js"></script>
		<script>
			var eventSource = new EventSource('/sse');
			eventSource.onmessage = function(event) {
				document.getElementById('log').innerText += event.data + '\\n\\n';
			};
		</script>
	</head>
	<body>
		<turbo-stream-source src="${ config.sseUrl }">
		<h1>SSE Test</h1>
		<h2>Control</h2>
		<pre class="b" id="log"></pre>
		<h2>stream1</h2>
		<div class="b stream" id="stream1"></div> 
		<h2>stream2</h2>
		<div class="b stream" id="stream2"></div> 
		<h2>stream3</h2>
		<div class="b stream" id="stream3"></div> 
	</body>
</html>`;
});

app.listen(config.port);
```

#### Using Express
```javascript
import express from 'express';
import { turbochargeExpress } from 'node-turbo/express';

// Config
const config = {};
config.port = 8080;
config.baseUrl = `http://localhost:${config.port}`;
config.sseUrl = `${config.baseUrl}/sse`;

// Express
const app = express();

// Augment Express with convenience functions.
turbochargeExpress(app);

// SSE endpoint
app.get('/sse', async (req, res) => {

	// Use convenience function to configure Express.
	// Returns SseTurboStream instance which directly streams to res.
	const ssets = res.sseTurboStream();

	// Timeout is only here for us to have time to observe.
	setTimeout(() => {
		ssets
			.append('stream1', '<p>My content <strong>1</strong></p>')
			.append('stream2', '<p>My content <strong>2</strong></p>')
			.append('stream3', '<p>My content <strong>3</strong></p>');
	}, 1000);

	setTimeout(() => {
		ssets.prependAll('.stream', '<p>Prepend all</p>');
	}, 2000);
});

// Client
app.get('/', async (req, res) => {
	res.send(`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>SSE Test</title>
		<style>
		.b {
			border: 1px dashed #cccc;
			margin-bottom: 10px;
			padding: 10px;
		}
		</style>
		<script type="module" src="https://unpkg.com/@hotwired/turbo@8.0.0-beta.2/dist/turbo.es2017-esm.js"></script>
		<script>
			var eventSource = new EventSource('/sse');
			eventSource.onmessage = function(event) {
				document.getElementById('log').innerText += event.data + '\\n\\n';
			};
		</script>
	</head>
	<body>
		<turbo-stream-source src="${ config.sseUrl }">
		<h1>SSE Test</h1>
		<h2>Control</h2>
		<pre class="b" id="log"></pre>
		<h2>stream1</h2>
		<div class="b stream" id="stream1"></div> 
		<h2>stream2</h2>
		<div class="b stream" id="stream2"></div> 
		<h2>stream3</h2>
		<div class="b stream" id="stream3"></div> 
	</body>
</html>`)
});

app.listen(config.port);
```
## License
 
node-turbo is © 2024 Walter Krivanek <walter@vividvisions.com> and released under the [MIT license](https://mit-license.org).
