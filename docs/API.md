# node-turbo API documentation

Version 1.1.1

## Table of Contents

- [node-turbo](#node-turbo)
   - [Class: TurboFrame](#class-turboframe)
      - [TurboFrame.HEADER_KEY](#turboframeheader_key)
      - [TurboFrame.MIME_TYPE](#turboframemime_type)
      - [new TurboFrame(idOrAttributes, content)](#new-turboframeidorattributes-content)
      - [turboframe.validate()](#turboframevalidate)
      - [turboframe.render()](#turboframerender)
   - [Class: TurboStream](#class-turbostream)
      - [TurboStream.MIME_TYPE](#turbostreammime_type)
      - [TurboStream.ACTIONS](#turbostreamactions)
      - [new TurboStream([attributes][, content])](#new-turbostreamattributes-content)
      - [turbostream.config](#turbostreamconfig)
      - [turbostream.elements](#turbostreamelements)
      - [turbostream.length](#turbostreamlength)
      - [turbostream.updateConfig(config)](#turbostreamupdateconfigconfig)
      - [turbostream.addElement(attributesOrElement, content)](#turbostreamaddelementattributesorelement-content)
      - [turbostream.clear()](#turbostreamclear)
      - [turbostream.render()](#turbostreamrender)
      - [turbostream.renderElements()](#turbostreamrenderelements)
      - [turbostream.flush()](#turbostreamflush)
      - [turbostream.custom(action, target, content)](#turbostreamcustomaction-target-content)
      - [turbostream.customAll(action, targets, content)](#turbostreamcustomallaction-targets-content)
      - [turbostream.createReadableStream(opts, opts.continuous, streamOptions)](#turbostreamcreatereadablestreamopts-optscontinuous-streamoptions)
      - [turbostream.append(targetOrAttributes, content)](#turbostreamappendtargetorattributes-content)
      - [turbostream.appendAll(targetsOrAttributes, content)](#turbostreamappendalltargetsorattributes-content)
      - [turbostream.prepend(targetOrAttributes, content)](#turbostreamprependtargetorattributes-content)
      - [turbostream.prependAll(targetsOrAttributes, content)](#turbostreamprependalltargetsorattributes-content)
      - [turbostream.replace(targetOrAttributes, content)](#turbostreamreplacetargetorattributes-content)
      - [turbostream.replaceAll(targetsOrAttributes, content)](#turbostreamreplacealltargetsorattributes-content)
      - [turbostream.update(targetOrAttributes, content)](#turbostreamupdatetargetorattributes-content)
      - [turbostream.updateAll(targetsOrAttributes, content)](#turbostreamupdatealltargetsorattributes-content)
      - [turbostream.remove(targetOrAttributes)](#turbostreamremovetargetorattributes)
      - [turbostream.removeAll(targetsOrAttributes)](#turbostreamremovealltargetsorattributes)
      - [turbostream.before(targetOrAttributes, content)](#turbostreambeforetargetorattributes-content)
      - [turbostream.beforeAll(targetsOrAttributes, content)](#turbostreambeforealltargetsorattributes-content)
      - [turbostream.after(targetOrAttributes, content)](#turbostreamaftertargetorattributes-content)
      - [turbostream.afterAll(targetsOrAttributes, content)](#turbostreamafteralltargetsorattributes-content)
      - [turbostream.morph(targetOrAttributes, content)](#turbostreammorphtargetorattributes-content)
      - [turbostream.morphAll(targetsOrAttributes, content)](#turbostreammorphalltargetsorattributes-content)
      - [turbostream.refresh(requestIdOrAttributes)](#turbostreamrefreshrequestidorattributes)
   - [Class: TurboStreamElement](#class-turbostreamelement)
      - [turbostreamelement.validate()](#turbostreamelementvalidate)
      - [turbostreamelement.render()](#turbostreamelementrender)
   - [Class: TurboElement](#class-turboelement)
      - [new TurboElement(attributes, content)](#new-turboelementattributes-content)
      - [turboelement.attributes](#turboelementattributes)
      - [turboelement.content](#turboelementcontent)
      - [turboelement.renderAttributesAsHtml()](#turboelementrenderattributesashtml)
      - [turboelement.validate()](#turboelementvalidate)
      - [turboelement.render()](#turboelementrender)
   - [Class: TurboReadable](#class-turboreadable)
      - [new TurboReadable(turboStream[, opts])](#new-turboreadableturbostream-opts)
      - [turboreadable._turboStream](#turboreadable_turbostream)
      - [turboreadable._boundPush](#turboreadable_boundpush)
      - [turboreadable._pushElement(el)](#turboreadable_pushelementel)
      - [turboreadable._read()](#turboreadable_read)
      - [turboreadable._destroy(err)](#turboreadable_destroyerr)
      - [turboreadable.done()](#turboreadabledone)
   - [isTurboStreamRequest(request)](#isturbostreamrequestrequest)
   - [isTurboFrameRequest(request)](#isturboframerequestrequest)
   - [getTurboFrameId(request)](#getturboframeidrequest)
- [node-turbo/ws](#node-turbows)
   - [Class: WsTurboStream](#class-wsturbostream)
      - [WsTurboStream.use(ws)](#wsturbostreamusews)
      - [WsTurboStream.OPEN](#wsturbostreamopen)
      - [new WsTurboStream(ws[, config])](#new-wsturbostreamws-config)
      - [wsturbostream.ws](#wsturbostreamws)
      - [wsturbostream.handleConfig(config)](#wsturbostreamhandleconfigconfig)
      - [wsturbostream.handleRender(html)](#wsturbostreamhandlerenderhtml)
      - [wsturbostream.handleElement(element)](#wsturbostreamhandleelementelement)
- [node-turbo/koa](#node-turbokoa)
   - [Class: KoaTurboStream](#class-koaturbostream)
      - [new KoaTurboStream(koaCtx)](#new-koaturbostreamkoactx)
      - [koaturbostream.koaCtx](#koaturbostreamkoactx)
   - [turbochargeKoa(koaApp, opts, opts.autoRender)](#turbochargekoakoaapp-opts-optsautorender)
- [node-turbo/express](#node-turboexpress)
   - [Class: ExpressTurboStream](#class-expressturbostream)
      - [new ExpressTurboStream(res[, attributes][, content])](#new-expressturbostreamres-attributes-content)
      - [expressturbostream.res](#expressturbostreamres)
      - [expressturbostream.send()](#expressturbostreamsend)
   - [turbochargeExpress(expressApp, opts)](#turbochargeexpressexpressapp-opts)
- [node-turbo/sse](#node-turbosse)
   - [Class: SseTurboStream](#class-sseturbostream)
      - [SseTurboStream.MIME_TYPE](#sseturbostreammime_type)
      - [new SseTurboStream([eventname])](#new-sseturbostreameventname)
      - [sseturbostream.eventName](#sseturbostreameventname)
      - [sseturbostream.render()](#sseturbostreamrender)
      - [sseturbostream.renderSseEvent(raw)](#sseturbostreamrendersseeventraw)
      - [sseturbostream.createReadableStream()](#sseturbostreamcreatereadablestream)
      - [sseturbostream.event(eventName)](#sseturbostreameventeventname)
- [node-turbo/errors](#node-turboerrors)
   - [Class: ValidationError](#class-validationerror)
   - [Class: AttributeMalformedError](#class-attributemalformederror)
   - [Class: AttributeMissingError](#class-attributemissingerror)
   - [Class: AttributeInvalidError](#class-attributeinvaliderror)

## node-turbo

### Class: TurboFrame

```javascript
import { TurboFrame } from 'node-turbo';
```

***Extends:***  
- [TurboElement](#class-turboelement)  

This class represents a Turbo Frame message.

#### TurboFrame.HEADER_KEY

`static` {String}

The key which is added to the HTTP headers when the request is made by a Turbo Frame.

#### TurboFrame.MIME_TYPE

`static` {String}

MIME type of a Turbo Frame HTTP response, which is just `text/html`.

#### new TurboFrame(idOrAttributes, content)

- `idOrAttributes` {String | Object} Either the ID as string or an object 
 containing all attributes (including `id`).
- `content` {String} The HTML content of this Turbo Frame message.

#### turboframe.validate()

Validates the attributes. `attributes.id` is mandatory. Gets called automatically by the constructor.

Throws {AttributeMissingError} when mandatory attributes are missing.  
Throws {AttributeMalformedError} when mandatory attributes are malformed.  

#### turboframe.render()

Renders the Turbo Frame message as HTML string and returns it.

Returns: {String} The rendered HTML.

#### Inherited from class [TurboElement](#class-turboelement):

> - attributes  
The attribute object.
> - content  
The HTML content.
> - renderAttributesAsHtml()  
Converts the attributes object to a string in the form
of HTML attributes ({ name: value } -&#62; 'name="value"').

***

### Class: TurboStream

```javascript
import { TurboStream } from 'node-turbo';
```

***Extends:***  
- node:events~EventEmitter  

A Turbo Stream message.

#### TurboStream.MIME_TYPE

`static` {String}

MIME type for Turbo Stream messages.

See [https://turbo.hotwired.dev/handbook/streams#streaming-from-http-responses](https://turbo.hotwired.dev/handbook/streams#streaming-from-http-responses)  

#### TurboStream.ACTIONS

`static` {Array}

List of all supported official actions: `append`, `prepend`, `replace`, `update`, `remove`, `before`, `after` and `refresh`.

See [https://turbo.hotwired.dev/handbook/streams#stream-messages-and-actions](https://turbo.hotwired.dev/handbook/streams#stream-messages-and-actions)  

#### new TurboStream([attributes][, content])

- `attributes` {Object<String, String>} The attributes of this element.
- `content` {String} The HTML content of this element.

If `attributes` and `content` are available, a Turbo Stream element is added to the buffer, pending validation.

#### turbostream.config

{Object<String, String>}

- `buffer` {Boolean} Should elements be added to the buffer (default: true)?

Default configuration.

#### turbostream.elements

{Array}

Array of buffered elements. Gets filled if `config.buffer` is `true`.

#### turbostream.length

`get` {Number}

The number of buffered Turbo Stream elements.

#### turbostream.updateConfig(config)

- `config` {Object} New configuration.

Extends/Overwrites the configuration.

Returns: {TurboStream} The instance for chaining.

#### turbostream.addElement(attributesOrElement, content)

- `attributesOrElement` {Object<String, String> | TurboFrameElement} 
- `content` {String} The HTML content of the element.

Adds a Turbo Stream element to the message. Adds the element to the buffer, if config.buffer === true. Fires the event 'element' with the added element.

Returns: {TurboStream} The instance for chaining.

#### turbostream.clear()

Clears the buffer.

Returns: {TurboStream} The instance for chaining.

#### turbostream.render()

Renders this Turbo Stream message if there are buffered elements.

Returns: {String | null} The rendered Turbo Stream HTML fragment or null if there were no buffered elements.

#### turbostream.renderElements()

If there are buffered elements, renders them and returns an array with the HTML fragments.

Returns: {Array | null} The rendered Turbo Stream HTML fragments as array or null if there were no buffered elements.

#### turbostream.flush()

Renders this Turbo Stream message and clears the buffer.

Returns: {String | null} The rendered Turbo Stream HTML fragment or null if there were no buffered elements.

#### turbostream.custom(action, target, content)

- `action` {String} The name of the custom action.
- `target` {String} The target ID.
- `content` {String} The HTML content of the element.

Adds a Turbo Stream Element with a custom action.

Returns: {TurboStream} The instance for chaining.

#### turbostream.customAll(action, targets, content)

- `action` {String} The name of the custom action.
- `targets` {String} The query string targeting multiple DOM elements.
- `content` {String} The HTML content of the element.

Adds a Turbo Stream Element with a custom action, targeting multiple DOM elements.

Returns: {TurboStream} The instance for chaining.

#### turbostream.createReadableStream(opts, opts.continuous, streamOptions)

- `opts` {Object<String, String>} The options for stream creation.
- `opts.continuous` {Boolean} If true, a TurboReadable instance is returned. 
 If false, a readable stream created from the buffered items is returned.
- `streamOptions` {Object<String, String>} The options for the readable stream itself.

Creates a readable stream.

Returns: {stream.Readable | TurboReadable} Either a readable stream or a TurboReadable instance.

#### turbostream.append(targetOrAttributes, content)


- `targetOrAttributes` {String | Object<String.String>} Either the target ID as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `append` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.appendAll(targetsOrAttributes, content)


- `targetsOrAttributes` {String | Object<String.String>} Either the query targeting multiple DOM elements as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `append` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.prepend(targetOrAttributes, content)


- `targetOrAttributes` {String | Object<String.String>} Either the target ID as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `prepend` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.prependAll(targetsOrAttributes, content)


- `targetsOrAttributes` {String | Object<String.String>} Either the query targeting multiple DOM elements as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `prepend` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.replace(targetOrAttributes, content)


- `targetOrAttributes` {String | Object<String.String>} Either the target ID as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `replace` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.replaceAll(targetsOrAttributes, content)


- `targetsOrAttributes` {String | Object<String.String>} Either the query targeting multiple DOM elements as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `replace` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.update(targetOrAttributes, content)


- `targetOrAttributes` {String | Object<String.String>} Either the target ID as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `update` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.updateAll(targetsOrAttributes, content)


- `targetsOrAttributes` {String | Object<String.String>} Either the query targeting multiple DOM elements as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `update` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.remove(targetOrAttributes)


- `targetOrAttributes` {String | Object<String.String>} Either the target ID as string or all attributes as object.

Adds a Turbo Stream element with the action `remove` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.removeAll(targetsOrAttributes)


- `targetsOrAttributes` {String | Object<String.String>} Either the query targeting multiple DOM elements as string or all attributes as object.

Adds a Turbo Stream element with the action `remove` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.before(targetOrAttributes, content)


- `targetOrAttributes` {String | Object<String.String>} Either the target ID as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `before` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.beforeAll(targetsOrAttributes, content)


- `targetsOrAttributes` {String | Object<String.String>} Either the query targeting multiple DOM elements as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `before` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.after(targetOrAttributes, content)


- `targetOrAttributes` {String | Object<String.String>} Either the target ID as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `after` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.afterAll(targetsOrAttributes, content)


- `targetsOrAttributes` {String | Object<String.String>} Either the query targeting multiple DOM elements as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `after` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.morph(targetOrAttributes, content)


- `targetOrAttributes` {String | Object<String.String>} Either the target ID as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `morph` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.morphAll(targetsOrAttributes, content)


- `targetsOrAttributes` {String | Object<String.String>} Either the query targeting multiple DOM elements as string or all attributes as object.

- `content` {String} The HTML content of the element.
Adds a Turbo Stream element with the action `morph` to the message.

Returns: {TurboStream} The instance for chaining.

#### turbostream.refresh(requestIdOrAttributes)

- `requestIdOrAttributes` {String | Object<String, String>} Either the request ID as string or all attributes as an object.

Adds a Turbo Stream Element with the action 'refresh' to the message.

Returns: {TurboStream} The instance for chaining.

***

### Class: TurboStreamElement

```javascript
import { TurboStreamElement } from 'node-turbo';
```

***Extends:***  
- [TurboElement](#class-turboelement)  

A Turbo Stream element. A Turbo Stream message consists of one or several Turbo Stream elements.

#### turbostreamelement.validate()

Validates the attributes. `attributes.action` is mandatory. `attributes.target` (or `attributes.targets`) is mandatory for any action but 'refresh'. Gets called by the constructor.

Throws {AttributeMissingError} when mandatory attributes are missing.  
Throws {AttributeMalformedError} when mandatory attributes are malformed.  
Throws {AttributeInvalidError} when attributes are invalid.  

#### turbostreamelement.render()

Renders this Turbo Stream element as HTML string. Omits `<template>[content]<template>` when the attribute `action` is 'remove' or 'refresh'.

Returns: {String} The rendered HTML fragment.

#### Inherited from class [TurboElement](#class-turboelement):

> - constructor(attributes, content)  
Automatically calls validate().
> - attributes  
The attribute object.
> - content  
The HTML content.
> - renderAttributesAsHtml()  
Converts the attributes object to a string in the form
of HTML attributes ({ name: value } -&#62; 'name="value"').

***

### Class: TurboElement

```javascript
import { TurboElement } from 'node-turbo';
```

Base class with common functionality for Turbo Stream elements and Turbo Frames. Not to be used directly.

#### new TurboElement(attributes, content)

- `attributes` {Object} The attributes of this element.
- `content` {String} The HTML content of this element.

Automatically calls validate().

#### turboelement.attributes

{Object<String, String>}

The attribute object.

#### turboelement.content

{String}

The HTML content.

#### turboelement.renderAttributesAsHtml()

Converts the attributes object to a string in the form of HTML attributes ({ name: value } -> 'name="value"').

Returns: {String} The HTML attribute string.

#### turboelement.validate()

Validation function to implement.

#### turboelement.render()

Render function to implement.

***

### Class: TurboReadable

```javascript
import { TurboReadable } from 'node-turbo';
```

***Extends:***  
- node:stream~Readable  

This class represents a readable stream which reads messages/elements from a Turbo Stream instance.

#### new TurboReadable(turboStream[, opts])

- `turboStream` {TurboStream} The Turbo Stream instance to create the readable stream for.
- `opts` {Object} The options for the readable stream.

Creates the readable stream instance. Updates the Turbo Stream's configuration to not buffer elements and adds an event listener for `element` events to it, which get handled by `_boundPush(el)`.

If there are already buffered elements, they get pushed into into the read queue immediately and the buffer is cleared afterwards.

#### turboreadable._turboStream

{TurboStream}

The Turbo Stream instance to create the readable stream for.

#### turboreadable._boundPush

{Function}

This is the bound variant of `_pushElement(el)`. This function serves as handler for the `element` event.

#### turboreadable._pushElement(el)

- `el` {TurboStreamElement} The Turbo Stream element.

Pushes a Turbo Stream element into the read queue.

#### turboreadable._read()

Gets called when data is available for reading. This implementation does nothing. (Normally, push data would be pushed into the read queue here.)

#### turboreadable._destroy(err)

- `err` {Error} The error object, if thrown.

Gets called when the stream is being destroyed. The event listener for the event `element` is removed and the configuration restored.

#### turboreadable.done()

Pushes `null` to the readable buffer to signal the end of the input.

***

#### isTurboStreamRequest(request)

```javascript
import { isTurboStreamRequest } from 'node-turbo';
```

`static`

- `request` {Object} The request object. Expects an object like an {http.ClientRequest} instance.

Checks if the request is a Turbo Stream request.

Returns: {Boolean} `true`, if the request has been identified as a Turbo Stream request. `false` otherwise.

#### isTurboFrameRequest(request)

```javascript
import { isTurboFrameRequest } from 'node-turbo';
```

`static`

- `request` {Object} The request object. Expects an object like an {http.ClientRequest} instance.

Checks if the request is a Turbo Frame request.

Returns: {Boolean} `true`, if the request has been identified as a Turbo Frame request. false otherwise.

#### getTurboFrameId(request)

```javascript
import { getTurboFrameId } from 'node-turbo';
```

`static`

- `request` {Object} The request object. Expects an object like an {http.ClientRequest} instance.

Returns the content of the 'turbo-frame' header, which is the ID of the requesting Turbo Frame.

Returns: {String | null} The Turbo Frame ID or `null` if not found.

## node-turbo/ws

### Class: WsTurboStream

```javascript
import { WsTurboStream } from 'node-turbo/ws';
```

***Extends:***  
- [TurboStream](#class-turbostream)  

This class represents a Turbo Stream message with added functionality for WebSockets.

#### WsTurboStream.use(ws)

`static` 

- `ws` {WebSocket} The WebSocket instance to send to.

Convenience function to create a non-buffering WsTurboStream instance, which uses the passed WebSocket.

Returns: {WsTurboStream} A new WsTurboStream instance.

#### WsTurboStream.OPEN

`static` {Number}

Ready-state `OPEN` of a WebSocket.

See [https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState)  

#### new WsTurboStream(ws[, config])

- `ws` {WebSocket} The WebSocket to send to.
- `config` {Object} The config to override.

Listens for the event `config` and calls `handleConfig(config)` if it has been emitted.

#### wsturbostream.ws

{WebSocket}

The WebSocket instance to send to.

#### wsturbostream.handleConfig(config)

- `config` {Object} The changed config object.

Changes event listeners depending on `config.buffer`:  
If `true`, it will listen for the event `render` and call `handleRender()` when the event has been emitted.  
If `false`, it will listen for the event `element` and call `handleElement()` when the event has been emitted.

#### wsturbostream.handleRender(html)

- `html` {String} The rendered HTML fragment.

Sends the rendered HTML fragment to the WebSocket.

#### wsturbostream.handleElement(element)

- `element` {TurboStreamElement} The Turbo Stream element to send.

Sends the Turbo Stream element to the WebSocket.

#### Inherited from class [TurboStream](#class-turbostream):

> - `static` ACTIONS  
List of all supported official actions:
`append`, `prepend`, `replace`, `update`, `remove`, `before`, `after`
and `refresh`.
> - `static` MIME_TYPE  
MIME type for Turbo Stream messages.
> - `get` length  
The number of buffered Turbo Stream elements.
> - config  
Default configuration.
> - elements  
Array of buffered elements. Gets filled if `config.buffer` is `true`.
> - addElement(attributesOrElement, content)  
Adds a Turbo Stream element to the message. 
Adds the element to the buffer, if config.buffer === true.
Fires the event 'element' with the added element.
> - clear()  
Clears the buffer.
> - createReadableStream(opts, opts.continuous, streamOptions)  
Creates a readable stream.
> - custom(action, target, content)  
Adds a Turbo Stream Element with a custom action.
> - customAll(action, targets, content)  
Adds a Turbo Stream Element with a custom action, targeting multiple DOM elements.
> - flush()  
Renders this Turbo Stream message and clears the buffer.
> - refresh(requestIdOrAttributes)  
Adds a Turbo Stream Element with the action 'refresh' to the message.
> - render()  
Renders this Turbo Stream message if there are buffered elements.
> - renderElements()  
If there are buffered elements, renders them and returns an array with the HTML fragments.
> - updateConfig(config)  
Extends/Overwrites the configuration.

***

## node-turbo/koa

### Class: KoaTurboStream

```javascript
import { KoaTurboStream } from 'node-turbo/koa';
```

***Extends:***  
- [TurboStream](#class-turbostream)  

This class represents a Turbo Stream message with added functionality for Koa. Renders directly to Koa's `ctx.body` whenever a Turbo Stream element gets added.

#### new KoaTurboStream(koaCtx)

- `koaCtx` {Object} Koa's context object.

#### koaturbostream.koaCtx

{Object}

Koa's context object.

See [https://koajs.com/#context](https://koajs.com/#context)  

#### Inherited from class [TurboStream](#class-turbostream):

> - `static` ACTIONS  
List of all supported official actions:
`append`, `prepend`, `replace`, `update`, `remove`, `before`, `after`
and `refresh`.
> - `static` MIME_TYPE  
MIME type for Turbo Stream messages.
> - `get` length  
The number of buffered Turbo Stream elements.
> - config  
Default configuration.
> - elements  
Array of buffered elements. Gets filled if `config.buffer` is `true`.
> - addElement(attributesOrElement, content)  
Adds a Turbo Stream element to the message. 
Adds the element to the buffer, if config.buffer === true.
Fires the event 'element' with the added element.
> - clear()  
Clears the buffer.
> - createReadableStream(opts, opts.continuous, streamOptions)  
Creates a readable stream.
> - custom(action, target, content)  
Adds a Turbo Stream Element with a custom action.
> - customAll(action, targets, content)  
Adds a Turbo Stream Element with a custom action, targeting multiple DOM elements.
> - flush()  
Renders this Turbo Stream message and clears the buffer.
> - refresh(requestIdOrAttributes)  
Adds a Turbo Stream Element with the action 'refresh' to the message.
> - render()  
Renders this Turbo Stream message if there are buffered elements.
> - renderElements()  
If there are buffered elements, renders them and returns an array with the HTML fragments.
> - updateConfig(config)  
Extends/Overwrites the configuration.

***

#### turbochargeKoa(koaApp, opts, opts.autoRender)

```javascript
import { turbochargeKoa } from 'node-turbo/koa';
```

`static`

- `koaApp` {Object} The Koa application object.
- `opts` {Object} The options.
- `opts.autoRender` {Boolean} Should Turbo Stream elements automatically be rendered and sent? (Default: `true`)

Adds the following functions to Koa's context object:

-   `turboStream()`  
    Returns a chainable Turbo Stream instance which directly writes to `ctx.body` whenever an element is added. Also sets the correct `Content-Type` header.
-   `turboFrame()`  
    Returns a Turbo Frame instance which directly writes to `ctx.body`.
-   `isTurboStreamRequest()`  
    Checks if the request is a Turbo Stream request by looking for the MIME type in the `accept` headers.  
    Returns `true`/`false`.
-   `isTurboFrameRequest()`  
    Checks if the request is a Turbo Frame request by looking for the `turbo-frame` header.  
    Returns `true`/`false`.
-   `getTurboFrameId()`  
    Returns the contents of the `turbo-frame` header.
-   `sseTurboStream()`  
    <em>Experimental</em>. Configures Koa to keep the connection open and use a stream to pipe to `ctx.res`.

## node-turbo/express

### Class: ExpressTurboStream

```javascript
import { ExpressTurboStream } from 'node-turbo/express';
```

***Extends:***  
- [TurboStream](#class-turbostream)  

This class represents a Turbo Stream message for Express. Introduces the function `send()` to send the rendered message as HTTP response with the correct MIME type.

#### new ExpressTurboStream(res[, attributes][, content])

- `res` {Object} Express' response object to send to.
- `attributes` {Object} Attributes of the added element.
- `content` {String} The HTML content of the added element.

Stores Express' response object and creates a `TurboStream` instance.

#### expressturbostream.res

{Object}

Express' response object to send to.

#### expressturbostream.send()

Sends the rendered message as HTTP response with the correct MIME type.

#### Inherited from class [TurboStream](#class-turbostream):

> - `static` ACTIONS  
List of all supported official actions:
`append`, `prepend`, `replace`, `update`, `remove`, `before`, `after`
and `refresh`.
> - `static` MIME_TYPE  
MIME type for Turbo Stream messages.
> - `get` length  
The number of buffered Turbo Stream elements.
> - config  
Default configuration.
> - elements  
Array of buffered elements. Gets filled if `config.buffer` is `true`.
> - addElement(attributesOrElement, content)  
Adds a Turbo Stream element to the message. 
Adds the element to the buffer, if config.buffer === true.
Fires the event 'element' with the added element.
> - clear()  
Clears the buffer.
> - createReadableStream(opts, opts.continuous, streamOptions)  
Creates a readable stream.
> - custom(action, target, content)  
Adds a Turbo Stream Element with a custom action.
> - customAll(action, targets, content)  
Adds a Turbo Stream Element with a custom action, targeting multiple DOM elements.
> - flush()  
Renders this Turbo Stream message and clears the buffer.
> - refresh(requestIdOrAttributes)  
Adds a Turbo Stream Element with the action 'refresh' to the message.
> - render()  
Renders this Turbo Stream message if there are buffered elements.
> - renderElements()  
If there are buffered elements, renders them and returns an array with the HTML fragments.
> - updateConfig(config)  
Extends/Overwrites the configuration.

***

#### turbochargeExpress(expressApp, opts)

```javascript
import { turbochargeExpress } from 'node-turbo/express';
```

`static`

- `expressApp` {Object} The Express application object.
- `opts` {Object} The options to override.

Adds the following functions to Express' request object:

-   `isTurboStreamRequest()`  
    Checks if the request is a Turbo Stream request by looking for the MIME type in the `accept` headers.  
    Returns `true`/`false`.
-   `isTurboFrameRequest()`  
    Checks if the request is a Turbo Frame request by looking for the `turbo-frame` header.  
    Returns `true`/`false`.
-   `getTurboFrameId()` Returns the contents of the `turbo-frame` header.

Also adds the following functions to Express' `response` object:

-   `turboStream()`  
    Returns a chainable Turbo Stream instance which introduces the function `send()` which sends the rendered Turbo Stream message as HTTP response with the correct MIME type.
-   `turboFrame(id, content)` Returns a Turbo Frame instance which directly sends the rendered Turbo Frame message as HTTP response.
-   `turboFrame(content)` If you omit the `id` attribute, it is automatically added by using the ID from the `turbo-frame` header.
-   `sseTurboStream()`  
    <em>Experimental</em>. Configures Express to keep the connection open and use a stream to pipe to `res`.

## node-turbo/sse

### Class: SseTurboStream

```javascript
import { SseTurboStream } from 'node-turbo/sse';
```

***Extends:***  
- [TurboStream](#class-turbostream)  

This class represents a Turbo Stream message for SSE.  
**Note**: This class is in **experimental** stage.

#### SseTurboStream.MIME_TYPE

`static` {String}

MIME type for an SSE message (`text/event-stream`).

#### new SseTurboStream([eventname])

- `eventname` {String} The SSE event name to send the message under.

Creates a Turbo Stream message instance which automatically writes to the SSE stream as soon as a Turbo Stream element is added.

#### sseturbostream.eventName

{String}

The optional name to send the event under.

#### sseturbostream.render()

Renders the Turbo Stream message and adds SSE specific syntax.

Returns: {String | null} The rendered SSE or null if there were no elements in the buffer.

#### sseturbostream.renderSseEvent(raw)

- `raw` {String} The raw HTML string.

Takes a HTML fragment string and converts it to an SSE event message.

Returns: {String | null} The converted SSE event message or null if no string has been passed.

#### sseturbostream.createReadableStream()

Creates a {TurboReadable} instance, which pipes to a {node:stream~Transform} to add SSE specific syntax.

Returns: {node:stream.Transform} The Transform stream instance.

#### sseturbostream.event(eventName)

- `eventName` {String} The event name to send the message under.

Set the event name for the SSE data.

Returns: {SseTurboStream} The instance for chaining.

#### Inherited from class [TurboStream](#class-turbostream):

> - `static` ACTIONS  
List of all supported official actions:
`append`, `prepend`, `replace`, `update`, `remove`, `before`, `after`
and `refresh`.
> - `get` length  
The number of buffered Turbo Stream elements.
> - config  
Default configuration.
> - elements  
Array of buffered elements. Gets filled if `config.buffer` is `true`.
> - addElement(attributesOrElement, content)  
Adds a Turbo Stream element to the message. 
Adds the element to the buffer, if config.buffer === true.
Fires the event 'element' with the added element.
> - clear()  
Clears the buffer.
> - custom(action, target, content)  
Adds a Turbo Stream Element with a custom action.
> - customAll(action, targets, content)  
Adds a Turbo Stream Element with a custom action, targeting multiple DOM elements.
> - flush()  
Renders this Turbo Stream message and clears the buffer.
> - refresh(requestIdOrAttributes)  
Adds a Turbo Stream Element with the action 'refresh' to the message.
> - renderElements()  
If there are buffered elements, renders them and returns an array with the HTML fragments.
> - updateConfig(config)  
Extends/Overwrites the configuration.

***

## node-turbo/errors

### Class: ValidationError

```javascript
import { ValidationError } from 'node-turbo/errors';
```

***Extends:***  
- node:Error  

Parent class for all validation errors.

***

### Class: AttributeMalformedError

```javascript
import { AttributeMalformedError } from 'node-turbo/errors';
```

***Extends:***  
- [ValidationError](#class-validationerror)  

Gets thrown when mandatory attributes are malformed.

***

### Class: AttributeMissingError

```javascript
import { AttributeMissingError } from 'node-turbo/errors';
```

***Extends:***  
- [ValidationError](#class-validationerror)  

Gets thrown when mandatory attributes are missing.

***

### Class: AttributeInvalidError

```javascript
import { AttributeInvalidError } from 'node-turbo/errors';
```

***Extends:***  
- [ValidationError](#class-validationerror)  

Gets thrown when invalid attributes are discovered.

***


***

node-turbo is © 2024 by Walter Krivanek and released under the [MIT license](https://mit-license.org).
