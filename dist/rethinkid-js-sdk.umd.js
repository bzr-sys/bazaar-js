(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('buffer'), require('querystring'), require('stream'), require('url'), require('http'), require('https'), require('util'), require('net'), require('tls'), require('http2'), require('dns'), require('zlib'), require('fs'), require('child_process'), require('events'), require('crypto'), require('bufferutil'), require('utf-8-validate')) :
	typeof define === 'function' && define.amd ? define(['exports', 'buffer', 'querystring', 'stream', 'url', 'http', 'https', 'util', 'net', 'tls', 'http2', 'dns', 'zlib', 'fs', 'child_process', 'events', 'crypto', 'bufferutil', 'utf-8-validate'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["rethinkid-js-sdk"] = {}, global.buffer, global.querystring, global.stream$1, global.url$1, global.http, global.https, global.util, global.net, global.tls, global.http2, global.dns, global.zlib, global.fs, global.child_process, global.events, global.crypto, global.bufferutil, global.utf8Validate));
})(this, (function (exports, buffer, querystring, stream$1, url$1, http, https, util, net, tls, http2, dns, zlib, fs, child_process, events, crypto, bufferutil, utf8Validate) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var buffer__default = /*#__PURE__*/_interopDefaultLegacy(buffer);
	var querystring__default = /*#__PURE__*/_interopDefaultLegacy(querystring);
	var stream__default = /*#__PURE__*/_interopDefaultLegacy(stream$1);
	var url__default = /*#__PURE__*/_interopDefaultLegacy(url$1);
	var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
	var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
	var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
	var net__default = /*#__PURE__*/_interopDefaultLegacy(net);
	var tls__default = /*#__PURE__*/_interopDefaultLegacy(tls);
	var http2__default = /*#__PURE__*/_interopDefaultLegacy(http2);
	var dns__default = /*#__PURE__*/_interopDefaultLegacy(dns);
	var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
	var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
	var child_process__default = /*#__PURE__*/_interopDefaultLegacy(child_process);
	var events__default = /*#__PURE__*/_interopDefaultLegacy(events);
	var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
	var bufferutil__default = /*#__PURE__*/_interopDefaultLegacy(bufferutil);
	var utf8Validate__default = /*#__PURE__*/_interopDefaultLegacy(utf8Validate);

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var safeBuffer = createCommonjsModule(function (module, exports) {
	/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
	/* eslint-disable node/no-deprecated-api */

	var Buffer = buffer__default["default"].Buffer;

	// alternative to using Object.keys for old browsers
	function copyProps (src, dst) {
	  for (var key in src) {
	    dst[key] = src[key];
	  }
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
	  module.exports = buffer__default["default"];
	} else {
	  // Copy properties from require('buffer')
	  copyProps(buffer__default["default"], exports);
	  exports.Buffer = SafeBuffer;
	}

	function SafeBuffer (arg, encodingOrOffset, length) {
	  return Buffer(arg, encodingOrOffset, length)
	}

	SafeBuffer.prototype = Object.create(Buffer.prototype);

	// Copy static methods from Buffer
	copyProps(Buffer, SafeBuffer);

	SafeBuffer.from = function (arg, encodingOrOffset, length) {
	  if (typeof arg === 'number') {
	    throw new TypeError('Argument must not be a number')
	  }
	  return Buffer(arg, encodingOrOffset, length)
	};

	SafeBuffer.alloc = function (size, fill, encoding) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  var buf = Buffer(size);
	  if (fill !== undefined) {
	    if (typeof encoding === 'string') {
	      buf.fill(fill, encoding);
	    } else {
	      buf.fill(fill);
	    }
	  } else {
	    buf.fill(0);
	  }
	  return buf
	};

	SafeBuffer.allocUnsafe = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return Buffer(size)
	};

	SafeBuffer.allocUnsafeSlow = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return buffer__default["default"].SlowBuffer(size)
	};
	});
	safeBuffer.Buffer;

	var dist$a = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Type-safe event emitter.
	 */
	class Emitter {
	    constructor() {
	        this._ = [];
	        this.$ = Object.create(null);
	    }
	    on(type, callback) {
	        (this.$[type] = this.$[type] || []).push(callback);
	    }
	    off(type, callback) {
	        const stack = this.$[type];
	        if (stack)
	            stack.splice(stack.indexOf(callback) >>> 0, 1);
	    }
	    each(callback) {
	        this._.push(callback);
	    }
	    none(callback) {
	        this._.splice(this._.indexOf(callback) >>> 0, 1);
	    }
	    emit(type, ...args) {
	        const stack = this.$[type];
	        if (stack)
	            stack.slice().forEach(fn => fn(...args));
	        this._.slice().forEach(fn => fn({ type, args }));
	    }
	}
	exports.Emitter = Emitter;
	/**
	 * Helper to listen to an event once only.
	 */
	function once(events, type, callback) {
	    function self(...args) {
	        events.off(type, self);
	        return callback(...args);
	    }
	    events.on(type, self);
	    return self;
	}
	exports.once = once;

	});

	unwrapExports(dist$a);
	dist$a.Emitter;
	dist$a.once;

	var dist$9 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * Calculate the byte lengths for utf8 encoded strings.
	 */
	function byteLength(str) {
	    if (!str) {
	        return 0;
	    }
	    str = str.toString();
	    var len = str.length;
	    for (var i = str.length; i--;) {
	        var code = str.charCodeAt(i);
	        if (0xdc00 <= code && code <= 0xdfff) {
	            i--;
	        }
	        if (0x7f < code && code <= 0x7ff) {
	            len++;
	        }
	        else if (0x7ff < code && code <= 0xffff) {
	            len += 2;
	        }
	    }
	    return len;
	}
	exports.byteLength = byteLength;

	});

	unwrapExports(dist$9);
	dist$9.byteLength;

	var dist$8 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.expectNever = exports.expectType = void 0;
	/**
	 * Asserts the `value` type is assignable to the generic `Type`.
	 *
	 * ```ts
	 * expectType<number>(123);
	 * expectType<boolean>(true);
	 * ```
	 */
	const expectType = (value) => void 0;
	exports.expectType = expectType;
	/**
	 * Asserts the `value` type is `never`, i.e. this function should never be called.
	 * If it is called at runtime, it will throw a `TypeError`. The return type is
	 * `never` to support returning in exhaustive type checks.
	 *
	 * ```ts
	 * return expectNever(value);
	 * ```
	 */
	const expectNever = (value) => {
	    throw new TypeError("Unexpected value: " + value);
	};
	exports.expectNever = expectNever;

	});

	unwrapExports(dist$8);
	dist$8.expectNever;
	dist$8.expectType;

	var headers = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Map of HTTP headers.
	 */
	class Headers {
	    constructor(init) {
	        this.object = Object.create(null);
	        if (init)
	            this.extend(init);
	    }
	    set(headerName, value) {
	        this.object[headerName.toLowerCase()] =
	            Array.isArray(value) ? value.map(String) : String(value);
	    }
	    append(headerName, value) {
	        const key = headerName.toLowerCase();
	        const prevValue = this.object[key];
	        // tslint:disable-next-line
	        if (prevValue === undefined) {
	            if (Array.isArray(value)) {
	                this.object[key] = value.map(String);
	            }
	            else {
	                this.object[key] = String(value);
	            }
	        }
	        else if (Array.isArray(prevValue)) {
	            if (Array.isArray(value)) {
	                for (const v of value)
	                    prevValue.push(String(v));
	            }
	            else {
	                prevValue.push(String(value));
	            }
	        }
	        else {
	            this.object[key] = Array.isArray(value)
	                ? [prevValue, ...value.map(String)]
	                : [prevValue, String(value)];
	        }
	    }
	    get(headerName) {
	        const value = this.object[headerName.toLowerCase()];
	        if (value === undefined)
	            return null; // tslint:disable-line
	        return Array.isArray(value) ? value[0] : value;
	    }
	    getAll(headerName) {
	        const value = this.object[headerName.toLowerCase()];
	        if (value === undefined)
	            return []; // tslint:disable-line
	        return Array.isArray(value) ? [...value] : [value];
	    }
	    has(headerName) {
	        return headerName.toLowerCase() in this.object;
	    }
	    delete(headerName) {
	        delete this.object[headerName.toLowerCase()];
	    }
	    *entries() {
	        yield* Object.entries(this.object);
	    }
	    *keys() {
	        yield* Object.keys(this.object);
	    }
	    *values() {
	        yield* Object.values(this.object);
	    }
	    clear() {
	        this.object = Object.create(null);
	    }
	    asObject() {
	        return Object.assign(Object.create(null), this.object);
	    }
	    extend(obj) {
	        if (Symbol.iterator in obj) {
	            for (const [key, value] of obj) {
	                this.append(key, value);
	            }
	        }
	        else if (obj instanceof Headers) {
	            for (const [key, value] of obj.entries())
	                this.append(key, value);
	        }
	        else {
	            for (const key of Object.keys(obj)) {
	                const value = obj[key];
	                if (value !== undefined)
	                    this.append(key, value);
	            }
	        }
	    }
	    clone() {
	        return new Headers(this.object);
	    }
	}
	exports.Headers = Headers;

	});

	unwrapExports(headers);
	headers.Headers;

	var events_1 = dist$a;

	var signal = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Standard signal used to communicate during `request` processing.
	 */
	class Signal extends events_1.Emitter {
	    constructor() {
	        super();
	        this.aborted = false;
	        // Listen for the abort signal.
	        events_1.once(this, "abort", () => (this.aborted = true));
	    }
	}
	exports.Signal = Signal;
	/**
	 * Fetch abort controller interface.
	 */
	class AbortController {
	    constructor() {
	        this.signal = new Signal();
	    }
	    abort() {
	        this.signal.emit("abort");
	    }
	}
	exports.AbortController = AbortController;

	});

	unwrapExports(signal);
	signal.Signal;
	signal.AbortController;

	var common$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Marker to indicate the body has been used.
	 */
	exports.kBodyUsed = Symbol("bodyUsed");
	/**
	 * Marker to indicate the body has been destroyed and can not be used.
	 */
	exports.kBodyDestroyed = Symbol("bodyDestroyed");
	/**
	 * Read and "use" the raw body from a `Body` instance.
	 */
	function useRawBody(body) {
	    const rawBody = getRawBody(body);
	    if (rawBody === null)
	        return null; // "Unused".
	    body.$rawBody = exports.kBodyUsed;
	    return rawBody;
	}
	exports.useRawBody = useRawBody;
	/**
	 * Read the raw body from a `Body` instance.
	 */
	function getRawBody(body) {
	    const { $rawBody } = body;
	    if ($rawBody === exports.kBodyUsed)
	        throw new TypeError("Body already used");
	    if ($rawBody === exports.kBodyDestroyed)
	        throw new TypeError("Body is destroyed");
	    return $rawBody;
	}
	exports.getRawBody = getRawBody;

	});

	unwrapExports(common$1);
	common$1.kBodyUsed;
	common$1.kBodyDestroyed;
	common$1.useRawBody;
	common$1.getRawBody;

	var node$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });







	__export(headers);
	__export(signal);
	/**
	 * Check if a value is a node.js stream object.
	 */
	function isStream(stream) {
	    return (stream !== null &&
	        typeof stream === "object" &&
	        typeof stream.pipe === "function");
	}
	/**
	 * Convert a node.js `Stream` to `Buffer`.
	 */
	function streamToBuffer(stream) {
	    if (!stream.readable)
	        return Promise.resolve(Buffer.alloc(0));
	    return new Promise((resolve, reject) => {
	        const buf = [];
	        const onData = (chunk) => buf.push(chunk);
	        const onError = (err) => {
	            cleanup();
	            return reject(err);
	        };
	        const onClose = () => {
	            cleanup();
	            return resolve(Buffer.concat(buf));
	        };
	        const onEnd = (err) => {
	            cleanup();
	            if (err)
	                return reject(err);
	            return resolve(Buffer.concat(buf));
	        };
	        const cleanup = () => {
	            stream.removeListener("error", onError);
	            stream.removeListener("data", onData);
	            stream.removeListener("close", onClose);
	            stream.removeListener("end", onEnd);
	        };
	        stream.addListener("error", onError);
	        stream.addListener("data", onData);
	        stream.addListener("close", onClose);
	        stream.addListener("end", onEnd);
	    });
	}
	/**
	 * Convert a node.js `Buffer` into an `ArrayBuffer` instance.
	 */
	function bufferToArrayBuffer(buffer) {
	    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	}
	/**
	 * Node.js `Body` implementation.
	 */
	class Body {
	    constructor(body) {
	        const rawBody = body === undefined ? null : body;
	        this.$rawBody = rawBody;
	    }
	    get bodyUsed() {
	        return this.$rawBody === common$1.kBodyUsed || this.$rawBody === common$1.kBodyDestroyed;
	    }
	    json() {
	        return this.text().then(x => JSON.parse(x));
	    }
	    text() {
	        const rawBody = common$1.useRawBody(this);
	        if (rawBody === null)
	            return Promise.resolve("");
	        if (typeof rawBody === "string")
	            return Promise.resolve(rawBody);
	        if (Buffer.isBuffer(rawBody)) {
	            return Promise.resolve(rawBody.toString("utf8"));
	        }
	        if (rawBody instanceof ArrayBuffer) {
	            return Promise.resolve(Buffer.from(rawBody).toString("utf8"));
	        }
	        return streamToBuffer(rawBody).then(x => x.toString("utf8"));
	    }
	    buffer() {
	        const rawBody = common$1.useRawBody(this);
	        if (rawBody === null)
	            return Promise.resolve(Buffer.allocUnsafe(0));
	        if (Buffer.isBuffer(rawBody))
	            return Promise.resolve(rawBody);
	        if (typeof rawBody === "string") {
	            return Promise.resolve(Buffer.from(rawBody));
	        }
	        if (rawBody instanceof ArrayBuffer) {
	            return Promise.resolve(Buffer.from(rawBody));
	        }
	        return streamToBuffer(rawBody);
	    }
	    arrayBuffer() {
	        return this.buffer().then(bufferToArrayBuffer);
	    }
	    stream() {
	        const rawBody = common$1.useRawBody(this);
	        if (isStream(rawBody))
	            return rawBody;
	        // Push a `Buffer`, string or `null` into the readable stream.
	        let value = rawBody instanceof ArrayBuffer ? Buffer.from(rawBody) : rawBody;
	        return new stream__default["default"].Readable({
	            read() {
	                this.push(value);
	                value = null; // Force end of stream on next `read`.
	            }
	        });
	    }
	    clone() {
	        const rawBody = common$1.getRawBody(this);
	        if (isStream(rawBody)) {
	            const clonedRawBody = rawBody.pipe(new stream__default["default"].PassThrough());
	            this.$rawBody = rawBody.pipe(new stream__default["default"].PassThrough());
	            return new Body(clonedRawBody);
	        }
	        return new Body(rawBody);
	    }
	    destroy() {
	        const rawBody = common$1.getRawBody(this);
	        this.$rawBody = common$1.kBodyDestroyed;
	        // Destroy readable streams.
	        if (isStream(rawBody))
	            rawBody.destroy();
	        return Promise.resolve();
	    }
	}
	exports.Body = Body;
	/**
	 * Node.js `Request` implementation.
	 */
	class Request extends Body {
	    constructor(input, init = {}) {
	        // Clone request or use passed options object.
	        const req = typeof input === "string" ? undefined : input.clone();
	        const rawBody = init.body || (req ? common$1.getRawBody(req) : null);
	        const headers$1 = req && !init.headers
	            ? req.headers
	            : getDefaultHeaders(rawBody, init.headers, init.omitDefaultHeaders === true);
	        super(rawBody);
	        this.url = typeof input === "string" ? input : input.url;
	        this.method = init.method || (req && req.method) || "GET";
	        this.signal = init.signal || (req && req.signal) || new signal.Signal();
	        this.headers = headers$1;
	        this.trailer =
	            req && !init.trailer
	                ? req.trailer
	                : Promise.resolve(init.trailer).then(x => new headers.Headers(x));
	        // Destroy body on abort.
	        events_1.once(this.signal, "abort", () => this.destroy());
	    }
	    clone() {
	        const cloned = super.clone();
	        return new Request(this.url, {
	            body: common$1.getRawBody(cloned),
	            headers: this.headers.clone(),
	            omitDefaultHeaders: true,
	            method: this.method,
	            signal: this.signal,
	            trailer: this.trailer.then(x => x.clone())
	        });
	    }
	}
	exports.Request = Request;
	/**
	 * Node.js `Response` implementation.
	 */
	class Response extends Body {
	    get ok() {
	        return this.status >= 200 && this.status < 300;
	    }
	    constructor(body, init = {}) {
	        const headers$1 = getDefaultHeaders(body, init.headers, init.omitDefaultHeaders === true);
	        super(body);
	        this.status = init.status || 200;
	        this.statusText = init.statusText || "";
	        this.headers = headers$1;
	        this.trailer = Promise.resolve(init.trailer).then(x => new headers.Headers(x));
	    }
	    clone() {
	        const cloned = super.clone();
	        return new Response(common$1.getRawBody(cloned), {
	            status: this.status,
	            statusText: this.statusText,
	            headers: this.headers.clone(),
	            omitDefaultHeaders: true,
	            trailer: this.trailer.then(x => x.clone())
	        });
	    }
	}
	exports.Response = Response;
	/**
	 * Get default headers for `Request` and `Response` instances.
	 */
	function getDefaultHeaders(rawBody, init, omitDefaultHeaders) {
	    const headers$1 = new headers.Headers(init);
	    if (rawBody === null || rawBody === undefined)
	        return headers$1;
	    if (typeof rawBody === "string") {
	        if (!omitDefaultHeaders && !headers$1.has("Content-Type")) {
	            headers$1.set("Content-Type", "text/plain");
	        }
	        if (!omitDefaultHeaders && !headers$1.has("Content-Length")) {
	            headers$1.set("Content-Length", dist$9.byteLength(rawBody).toString());
	        }
	        return headers$1;
	    }
	    // Default to "octet stream" for raw bodies.
	    if (!omitDefaultHeaders && !headers$1.has("Content-Type")) {
	        headers$1.set("Content-Type", "application/octet-stream");
	    }
	    if (isStream(rawBody)) {
	        if (typeof rawBody.getHeaders === "function") {
	            headers$1.extend(rawBody.getHeaders());
	        }
	        return headers$1;
	    }
	    if (rawBody instanceof ArrayBuffer || Buffer.isBuffer(rawBody)) {
	        if (!omitDefaultHeaders && !headers$1.has("Content-Length")) {
	            headers$1.set("Content-Length", String(rawBody.byteLength));
	        }
	        return headers$1;
	    }
	    dist$8.expectType(rawBody);
	    throw new TypeError("Unknown body type");
	}

	});

	unwrapExports(node$1);
	node$1.Body;
	node$1.Request;
	node$1.Response;

	var dist$7 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Debug mode wrapper for middleware functions.
	 */
	function debugMiddleware(middleware) {
	    if (!Array.isArray(middleware)) {
	        throw new TypeError(`Expected middleware to be an array, got ${typeof middleware}`);
	    }
	    for (const fn of middleware) {
	        if (typeof fn !== "function") {
	            // tslint:disable-line
	            throw new TypeError(`Expected middleware to contain functions, but got ${typeof fn}`);
	        }
	    }
	    return function composedDebug(ctx, done) {
	        if (typeof done !== "function") {
	            // tslint:disable-line
	            throw new TypeError(`Expected the last argument to be \`done(ctx)\`, but got ${typeof done}`);
	        }
	        let index = 0;
	        function dispatch(pos) {
	            const fn = middleware[pos] || done;
	            index = pos;
	            return new Promise(resolve => {
	                const result = fn(ctx, function next() {
	                    if (pos < index) {
	                        throw new TypeError("`next()` called multiple times");
	                    }
	                    if (pos > middleware.length) {
	                        throw new TypeError("Composed `done(ctx)` function should not call `next()`");
	                    }
	                    return dispatch(pos + 1);
	                });
	                if (result === undefined) {
	                    // tslint:disable-line
	                    throw new TypeError("Expected middleware to return `next()` or a value");
	                }
	                return resolve(result);
	            });
	        }
	        return dispatch(index);
	    };
	}
	/**
	 * Production-mode middleware composition (no errors thrown).
	 */
	function composeMiddleware(middleware) {
	    function dispatch(pos, ctx, done) {
	        const fn = middleware[pos] || done;
	        return new Promise(resolve => {
	            return resolve(fn(ctx, function next() {
	                return dispatch(pos + 1, ctx, done);
	            }));
	        });
	    }
	    return function composed(ctx, done) {
	        return dispatch(0, ctx, done);
	    };
	}
	/**
	 * Compose an array of middleware functions into a single function.
	 */
	exports.compose = process.env.NODE_ENV === "production" ? composeMiddleware : debugMiddleware;

	});

	unwrapExports(dist$7);
	dist$7.compose;

	var makeError_1 = createCommonjsModule(function (module, exports) {

	// ===================================================================

	var construct = typeof Reflect !== "undefined" ? Reflect.construct : undefined;
	var defineProperty = Object.defineProperty;

	// -------------------------------------------------------------------

	var captureStackTrace = Error.captureStackTrace;
	if (captureStackTrace === undefined) {
	  captureStackTrace = function captureStackTrace(error) {
	    var container = new Error();

	    defineProperty(error, "stack", {
	      configurable: true,
	      get: function getStack() {
	        var stack = container.stack;

	        // Replace property with value for faster future accesses.
	        defineProperty(this, "stack", {
	          configurable: true,
	          value: stack,
	          writable: true,
	        });

	        return stack;
	      },
	      set: function setStack(stack) {
	        defineProperty(error, "stack", {
	          configurable: true,
	          value: stack,
	          writable: true,
	        });
	      },
	    });
	  };
	}

	// -------------------------------------------------------------------

	function BaseError(message) {
	  if (message !== undefined) {
	    defineProperty(this, "message", {
	      configurable: true,
	      value: message,
	      writable: true,
	    });
	  }

	  var cname = this.constructor.name;
	  if (cname !== undefined && cname !== this.name) {
	    defineProperty(this, "name", {
	      configurable: true,
	      value: cname,
	      writable: true,
	    });
	  }

	  captureStackTrace(this, this.constructor);
	}

	BaseError.prototype = Object.create(Error.prototype, {
	  // See: https://github.com/JsCommunity/make-error/issues/4
	  constructor: {
	    configurable: true,
	    value: BaseError,
	    writable: true,
	  },
	});

	// -------------------------------------------------------------------

	// Sets the name of a function if possible (depends of the JS engine).
	var setFunctionName = (function() {
	  function setFunctionName(fn, name) {
	    return defineProperty(fn, "name", {
	      configurable: true,
	      value: name,
	    });
	  }
	  try {
	    var f = function() {};
	    setFunctionName(f, "foo");
	    if (f.name === "foo") {
	      return setFunctionName;
	    }
	  } catch (_) {}
	})();

	// -------------------------------------------------------------------

	function makeError(constructor, super_) {
	  if (super_ == null || super_ === Error) {
	    super_ = BaseError;
	  } else if (typeof super_ !== "function") {
	    throw new TypeError("super_ should be a function");
	  }

	  var name;
	  if (typeof constructor === "string") {
	    name = constructor;
	    constructor =
	      construct !== undefined
	        ? function() {
	            return construct(super_, arguments, this.constructor);
	          }
	        : function() {
	            super_.apply(this, arguments);
	          };

	    // If the name can be set, do it once and for all.
	    if (setFunctionName !== undefined) {
	      setFunctionName(constructor, name);
	      name = undefined;
	    }
	  } else if (typeof constructor !== "function") {
	    throw new TypeError("constructor should be either a string or a function");
	  }

	  // Also register the super constructor also as `constructor.super_` just
	  // like Node's `util.inherits()`.
	  //
	  // eslint-disable-next-line dot-notation
	  constructor.super_ = constructor["super"] = super_;

	  var properties = {
	    constructor: {
	      configurable: true,
	      value: constructor,
	      writable: true,
	    },
	  };

	  // If the name could not be set on the constructor, set it on the
	  // prototype.
	  if (name !== undefined) {
	    properties.name = {
	      configurable: true,
	      value: name,
	      writable: true,
	    };
	  }
	  constructor.prototype = Object.create(super_.prototype, properties);

	  return constructor;
	}
	exports = module.exports = makeError;
	exports.BaseError = BaseError;
	});
	makeError_1.BaseError;

	var dist$6 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	/**
	 * @internal
	 */
	exports.SEPARATOR_TEXT = "\n\nThe following exception was the direct cause of the above exception:\n\n";
	/**
	 * Create a new error instance of `cause` property support.
	 */
	var BaseError = /** @class */ (function (_super) {
	    __extends(BaseError, _super);
	    function BaseError(message, cause) {
	        var _this = _super.call(this, message) || this;
	        _this.cause = cause;
	        Object.defineProperty(_this, "cause", {
	            writable: false,
	            enumerable: false,
	            configurable: false
	        });
	        return _this;
	    }
	    BaseError.prototype[util__default["default"].inspect.custom || /* istanbul ignore next */ "inspect"] = function () {
	        return fullStack(this);
	    };
	    return BaseError;
	}(makeError_1.BaseError));
	exports.BaseError = BaseError;
	/**
	 * Capture the full stack trace of any error instance.
	 */
	function fullStack(error) {
	    var chain = [];
	    var cause = error;
	    while (cause) {
	        chain.push(cause);
	        cause = cause.cause;
	    }
	    return chain
	        .map(function (err) { return util__default["default"].inspect(err, { customInspect: false }); })
	        .join(exports.SEPARATOR_TEXT);
	}
	exports.fullStack = fullStack;

	});

	unwrapExports(dist$6);
	dist$6.SEPARATOR_TEXT;
	dist$6.BaseError;
	dist$6.fullStack;

	var dist$5 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.transport = exports.AbortError = exports.NegotiateHttpVersion = exports.ALPNError = exports.ConnectionError = exports.CausedByTimeoutError = exports.CausedByEarlyCloseError = exports.defaultHttp2Connect = exports.defaultTlsConnect = exports.defaultNetConnect = exports.Http2ConnectionManager = exports.SocketConnectionManager = exports.SocketSet = exports.Http2Response = exports.HttpResponse = void 0;











	/**
	 * HTTP responses implement a node.js body.
	 */
	class HttpResponse extends node$1.Response {
	    constructor(body, options) {
	        super(body, options);
	        this.url = options.url;
	        this.connection = options.connection;
	        this.httpVersion = options.httpVersion;
	    }
	}
	exports.HttpResponse = HttpResponse;
	class Http2Response extends HttpResponse {
	}
	exports.Http2Response = Http2Response;
	/**
	 * Set of connections for HTTP pooling.
	 */
	class SocketSet {
	    constructor() {
	        // Tracks number of sockets claimed before they're created.
	        this.creating = 0;
	        // Tracks free sockets.
	        this.free = new Set();
	        // Tracks all available sockets.
	        this.sockets = new Set();
	        // Tracks pending requests for a socket.
	        this.pending = [];
	    }
	    // Get number of sockets available + creating.
	    size() {
	        return this.creating + this.sockets.size;
	    }
	    // Check if the pool is empty and can be cleaned up.
	    isEmpty() {
	        return this.size() === 0 && this.pending.length === 0;
	    }
	}
	exports.SocketSet = SocketSet;
	/**
	 * Get the value of an iterator.
	 */
	function value(iterator) {
	    return iterator.next().value;
	}
	/**
	 * Manage socket reuse.
	 */
	class SocketConnectionManager {
	    constructor(maxFreeConnections = 256, maxConnections = Infinity) {
	        this.maxFreeConnections = maxFreeConnections;
	        this.maxConnections = maxConnections;
	        this.pools = new Map();
	    }
	    /**
	     * Creates a connection when available.
	     */
	    async ready(key, onReady) {
	        const pool = this.pool(key);
	        // Add to "pending" queue when over max connections.
	        if (pool.size() >= this.maxConnections) {
	            return new Promise((resolve) => pool.pending.push(resolve)).then(onReady);
	        }
	        return onReady(this.free(key));
	    }
	    async creating(key, onCreate) {
	        const pool = this.pool(key);
	        try {
	            pool.creating++;
	            const socket = await onCreate();
	            return socket;
	        }
	        finally {
	            pool.creating--;
	        }
	    }
	    pool(key) {
	        const pool = this.pools.get(key);
	        if (!pool) {
	            const pool = new SocketSet();
	            this.pools.set(key, pool);
	            return pool;
	        }
	        return pool;
	    }
	    used(key, socket) {
	        socket.ref();
	        const pool = this.pool(key);
	        pool.free.delete(socket);
	        pool.sockets.add(socket);
	    }
	    freed(key, socket) {
	        const pool = this.pools.get(key);
	        if (!pool || !pool.sockets.has(socket))
	            return false;
	        // Immediately reuse for a pending connection.
	        const onReady = pool.pending.shift();
	        if (onReady) {
	            onReady(socket);
	            return false;
	        }
	        // Remove reference to freed sockets.
	        socket.unref();
	        // Save freed connections for reuse.
	        if (pool.free.size < this.maxFreeConnections) {
	            pool.free.add(socket);
	            return false;
	        }
	        this._delete(pool, key, socket);
	        return true;
	    }
	    _delete(pool, key, socket) {
	        pool.free.delete(socket);
	        pool.sockets.delete(socket);
	        if (pool.isEmpty())
	            this.pools.delete(key);
	    }
	    get(key) {
	        const pool = this.pools.get(key);
	        if (pool)
	            return value(pool.sockets.values());
	    }
	    free(key) {
	        const pool = this.pools.get(key);
	        if (pool)
	            return value(pool.free.values());
	    }
	    delete(key, socket) {
	        const pool = this.pools.get(key);
	        if (!pool || !pool.sockets.has(socket))
	            return;
	        // Remove the socket from the pool before calling a new `onReady`.
	        this._delete(pool, key, socket);
	        // Create a new pending socket when an old socket is removed.
	        // If a socket was removed we MUST be below `maxConnections`.
	        // We also MUST have already used our `free` connections up otherwise we
	        // wouldn't have a pending callback.
	        const onReady = pool.pending.shift();
	        if (onReady)
	            onReady(undefined);
	    }
	}
	exports.SocketConnectionManager = SocketConnectionManager;
	class Http2ConnectionManager {
	    constructor() {
	        this.sessions = new Map();
	        this.refs = new WeakMap();
	    }
	    async ready(key, onReady) {
	        return onReady(this.sessions.get(key));
	    }
	    async creating(key, create) {
	        return create();
	    }
	    used(key, session) {
	        const count = this.refs.get(session) || 0;
	        if (count === 0)
	            session.ref();
	        this.refs.set(session, count + 1);
	        this.sessions.set(key, session);
	    }
	    freed(key, session) {
	        const count = this.refs.get(session);
	        if (!count)
	            return false;
	        if (count === 1)
	            session.unref();
	        this.refs.set(session, count - 1);
	        return false;
	    }
	    get(key) {
	        return this.sessions.get(key);
	    }
	    free(key) {
	        return this.sessions.get(key);
	    }
	    delete(key, session) {
	        if (this.sessions.get(key) === session) {
	            this.refs.delete(session);
	            this.sessions.delete(key);
	        }
	    }
	}
	exports.Http2ConnectionManager = Http2ConnectionManager;
	exports.defaultNetConnect = net__default["default"].connect;
	exports.defaultTlsConnect = tls__default["default"].connect;
	const defaultHttp2Connect = (authority, socket) => {
	    return http2__default["default"].connect(authority, { createConnection: () => socket });
	};
	exports.defaultHttp2Connect = defaultHttp2Connect;
	function pipelineRequest(req, stream, onError) {
	    let bytesTransferred = 0;
	    const onData = (chunk) => {
	        req.signal.emit("requestBytes", (bytesTransferred += chunk.length));
	    };
	    const requestStream = new stream__default["default"].PassThrough();
	    requestStream.on("data", onData);
	    req.signal.emit("requestStarted");
	    stream__default["default"].pipeline(requestStream, stream, (err) => {
	        requestStream.removeListener("data", onData);
	        if (err)
	            req.signal.emit("error", err);
	        req.signal.emit("requestEnded");
	    });
	    const body = common$1.useRawBody(req);
	    if (body instanceof ArrayBuffer) {
	        return requestStream.end(new Uint8Array(body));
	    }
	    if (Buffer.isBuffer(body) || typeof body === "string" || body === null) {
	        return requestStream.end(body);
	    }
	    stream__default["default"].pipeline(body, requestStream, (err) => {
	        if (err)
	            return onError(err);
	    });
	}
	function pipelineResponse(req, stream, onEnd) {
	    let bytesTransferred = 0;
	    const onData = (chunk) => {
	        req.signal.emit("responseBytes", (bytesTransferred += chunk.length));
	    };
	    const responseStream = new stream__default["default"].PassThrough();
	    stream.on("data", onData);
	    req.signal.emit("responseStarted");
	    return stream__default["default"].pipeline(stream, responseStream, (err) => {
	        stream.removeListener("data", onData);
	        onEnd();
	        if (err)
	            req.signal.emit("error", err);
	        req.signal.emit("responseEnded");
	    });
	}
	/**
	 * Used as a cause for the connection error.
	 */
	class CausedByEarlyCloseError extends Error {
	    constructor() {
	        super("Connection closed too early");
	    }
	}
	exports.CausedByEarlyCloseError = CausedByEarlyCloseError;
	/**
	 * Used as a cause for the connection error.
	 */
	class CausedByTimeoutError extends Error {
	    constructor() {
	        super("Connection timeout");
	    }
	}
	exports.CausedByTimeoutError = CausedByTimeoutError;
	/**
	 * Expose connection errors.
	 */
	class ConnectionError extends dist$6.BaseError {
	    constructor(request, message, cause) {
	        super(message, cause);
	        this.request = request;
	        this.code = "EUNAVAILABLE";
	    }
	}
	exports.ConnectionError = ConnectionError;
	/**
	 * Execute HTTP request.
	 */
	function execHttp1(req, url, socket, config) {
	    return new Promise((resolve, reject) => {
	        const encrypted = url.protocol === "https:";
	        const request = encrypted ? https__default["default"].request : http__default["default"].request;
	        const arg = {
	            protocol: url.protocol,
	            hostname: url.hostname,
	            port: url.port,
	            defaultPort: encrypted ? 443 : 80,
	            method: req.method,
	            path: url.pathname + url.search,
	            headers: req.headers.asObject(),
	            auth: url.username || url.password
	                ? `${url.username}:${url.password}`
	                : undefined,
	            createConnection: () => socket,
	        };
	        const rawRequest = request(arg);
	        rawRequest.on("timeout", () => {
	            rawRequest.destroy();
	            return reject(new ConnectionError(req, `Connection timed out to ${url.host}`, new CausedByTimeoutError()));
	        });
	        // Timeout when no activity, pick minimum as request is using the entire socket.
	        rawRequest.setTimeout(config.idleSocketTimeout > 0
	            ? Math.min(config.idleRequestTimeout, config.idleSocketTimeout)
	            : config.idleRequestTimeout);
	        // Reuse HTTP connections where possible.
	        if (config.keepAlive > 0) {
	            rawRequest.shouldKeepAlive = true;
	            rawRequest.setHeader("Connection", "keep-alive");
	        }
	        // Trigger unavailable error when node.js errors before response.
	        const onRequestError = (err) => {
	            return reject(new ConnectionError(req, `Unable to connect to ${url.host}`, err));
	        };
	        // Track the node.js response.
	        const onResponse = (rawResponse) => {
	            var _a, _b;
	            // Trailers are populated on "end".
	            let resolveTrailers;
	            const trailer = new Promise((resolve) => (resolveTrailers = resolve));
	            rawRequest.removeListener("response", onResponse);
	            rawRequest.removeListener("error", onRequestError);
	            const { address: localAddress, port: localPort, } = ((_b = (_a = rawRequest.socket) === null || _a === void 0 ? void 0 : _a.address()) !== null && _b !== void 0 ? _b : {});
	            const { address: remoteAddress, port: remotePort, } = rawResponse.socket.address();
	            // Force `end` to be triggered so the response can still be piped.
	            // Reference: https://github.com/nodejs/node/issues/27981
	            const onAborted = () => {
	                rawResponse.push(null);
	            };
	            rawResponse.on("aborted", onAborted);
	            const res = new HttpResponse(pipelineResponse(req, rawResponse, () => {
	                req.signal.off("abort", onAbort);
	                rawResponse.removeListener("aborted", onAborted);
	                resolveTrailers(rawResponse.trailers);
	            }), {
	                status: rawResponse.statusCode,
	                statusText: rawResponse.statusMessage,
	                url: req.url,
	                headers: rawResponse.headers,
	                omitDefaultHeaders: true,
	                trailer,
	                connection: {
	                    localAddress,
	                    localPort,
	                    remoteAddress,
	                    remotePort,
	                    encrypted,
	                },
	                httpVersion: rawResponse.httpVersion,
	            });
	            return resolve(res);
	        };
	        const onAbort = () => {
	            rawRequest.destroy();
	        };
	        // Clean up lingering request listeners on close.
	        const onClose = () => {
	            req.signal.off("abort", onAbort);
	            rawRequest.removeListener("error", onRequestError);
	            rawRequest.removeListener("response", onResponse);
	            rawRequest.removeListener("close", onClose);
	        };
	        req.signal.on("abort", onAbort);
	        rawRequest.once("error", onRequestError);
	        rawRequest.once("response", onResponse);
	        rawRequest.once("close", onClose);
	        return pipelineRequest(req, rawRequest, reject);
	    });
	}
	/**
	 * ALPN validation error.
	 */
	class ALPNError extends Error {
	    constructor(request, message) {
	        super(message);
	        this.request = request;
	        this.code = "EALPNPROTOCOL";
	    }
	}
	exports.ALPNError = ALPNError;
	/**
	 * Execute a HTTP2 connection.
	 */
	function execHttp2(key, client, req, url, config) {
	    return new Promise((resolve, reject) => {
	        // HTTP2 formatted headers.
	        const headers = Object.assign({
	            [http2__default["default"].constants.HTTP2_HEADER_METHOD]: req.method,
	            [http2__default["default"].constants.HTTP2_HEADER_AUTHORITY]: url.host,
	            [http2__default["default"].constants.HTTP2_HEADER_SCHEME]: url.protocol.slice(0, -1),
	            [http2__default["default"].constants.HTTP2_HEADER_PATH]: url.pathname + url.search,
	        }, req.headers.asObject());
	        const http2Stream = client.request(headers, { endStream: false });
	        let cause = new CausedByEarlyCloseError();
	        // Handle socket timeouts more gracefully.
	        const onSocketTimeout = () => {
	            cause = new CausedByTimeoutError();
	        };
	        // Timeout after no activity.
	        http2Stream.setTimeout(config.idleRequestTimeout, () => {
	            cause = new CausedByTimeoutError();
	            http2Stream.close(http2__default["default"].constants.NGHTTP2_CANCEL);
	        });
	        // Trigger unavailable error when node.js errors before response.
	        const onRequestError = (err) => {
	            return reject(new ConnectionError(req, `Unable to connect to ${url.host}`, err));
	        };
	        const onResponse = (headers) => {
	            const encrypted = client.socket.encrypted === true;
	            const { localAddress = "", localPort = 0, remoteAddress = "", remotePort = 0, } = client.socket;
	            let resolveTrailers;
	            const trailer = new Promise((resolve) => (resolveTrailers = resolve));
	            const onTrailers = (headers) => {
	                resolveTrailers(headers);
	            };
	            http2Stream.once("trailers", onTrailers);
	            const res = new Http2Response(pipelineResponse(req, http2Stream, () => {
	                req.signal.off("abort", onAbort);
	                http2Stream.removeListener("trailers", onTrailers);
	                resolveTrailers({}); // Resolve in case "trailers" wasn't emitted.
	            }), {
	                status: Number(headers[http2__default["default"].constants.HTTP2_HEADER_STATUS]),
	                statusText: "",
	                url: req.url,
	                httpVersion: "2.0",
	                headers,
	                omitDefaultHeaders: true,
	                trailer,
	                connection: {
	                    localAddress,
	                    localPort,
	                    remoteAddress,
	                    remotePort,
	                    encrypted,
	                },
	            });
	            return resolve(res);
	        };
	        const onAbort = () => {
	            http2Stream.destroy();
	        };
	        // Release the HTTP2 connection claim when the stream ends.
	        const onClose = () => {
	            var _a;
	            // Clean up all lingering event listeners on final close.
	            req.signal.off("abort", onAbort);
	            http2Stream.removeListener("error", onRequestError);
	            http2Stream.removeListener("response", onResponse);
	            http2Stream.removeListener("close", onClose);
	            (_a = client.socket) === null || _a === void 0 ? void 0 : _a.removeListener("timeout", onSocketTimeout);
	            const shouldDestroy = config.http2Sessions.freed(key, client);
	            if (shouldDestroy)
	                client.destroy();
	            // Handle when the server closes the stream without responding.
	            return reject(new ConnectionError(req, `Connection closed without response from ${url.host}`, cause));
	        };
	        req.signal.on("abort", onAbort);
	        http2Stream.once("error", onRequestError);
	        http2Stream.once("response", onResponse);
	        http2Stream.once("close", onClose);
	        client.socket.once("timeout", onSocketTimeout);
	        config.http2Sessions.used(key, client);
	        return pipelineRequest(req, http2Stream, reject);
	    });
	}
	/**
	 * Configure HTTP version negotiation.
	 */
	var NegotiateHttpVersion;
	(function (NegotiateHttpVersion) {
	    NegotiateHttpVersion[NegotiateHttpVersion["HTTP1_ONLY"] = 0] = "HTTP1_ONLY";
	    NegotiateHttpVersion[NegotiateHttpVersion["HTTP2_FOR_HTTPS"] = 1] = "HTTP2_FOR_HTTPS";
	    NegotiateHttpVersion[NegotiateHttpVersion["HTTP2_ONLY"] = 2] = "HTTP2_ONLY";
	})(NegotiateHttpVersion = exports.NegotiateHttpVersion || (exports.NegotiateHttpVersion = {}));
	/**
	 * Custom abort error instance.
	 */
	class AbortError extends Error {
	    constructor(request, message) {
	        super(message);
	        this.request = request;
	        this.code = "EABORT";
	    }
	}
	exports.AbortError = AbortError;
	const DEFAULT_KEEP_ALIVE = 5000; // 5 seconds.
	const DEFAULT_IDLE_REQUEST_TIMEOUT = 30000; // 30 seconds.
	const DEFAULT_IDLE_SOCKET_TIMEOUT = 300000; // 5 minutes.
	function optionsToConfig(options) {
	    const { keepAlive = DEFAULT_KEEP_ALIVE, idleSocketTimeout = DEFAULT_IDLE_SOCKET_TIMEOUT, idleRequestTimeout = DEFAULT_IDLE_REQUEST_TIMEOUT, tlsSockets = new SocketConnectionManager(), netSockets = new SocketConnectionManager(), http2Sessions = new Http2ConnectionManager(), } = options;
	    return {
	        keepAlive,
	        idleSocketTimeout,
	        idleRequestTimeout,
	        tlsSockets,
	        netSockets,
	        http2Sessions,
	    };
	}
	/**
	 * Forward request over HTTP1/1 or HTTP2, with TLS support.
	 */
	function transport(options = {}) {
	    const config = optionsToConfig(options);
	    const { netSockets, tlsSockets, http2Sessions } = config;
	    const { lookup = dns__default["default"].lookup, createNetConnection = exports.defaultNetConnect, createTlsConnection = exports.defaultTlsConnect, createHttp2Connection = exports.defaultHttp2Connect, negotiateHttpVersion = NegotiateHttpVersion.HTTP2_FOR_HTTPS, } = options;
	    return async (req, next) => {
	        const url = new url__default["default"].URL(req.url, "http://localhost");
	        const { hostname, protocol } = url;
	        if (req.signal.aborted) {
	            throw new AbortError(req, "Request has been aborted");
	        }
	        if (protocol === "http:") {
	            const port = Number(url.port) || 80;
	            const connectionKey = `${hostname}:${port}:${negotiateHttpVersion}`;
	            if (negotiateHttpVersion === NegotiateHttpVersion.HTTP2_ONLY) {
	                const existingClient = http2Sessions.free(connectionKey);
	                if (existingClient) {
	                    return execHttp2(connectionKey, existingClient, req, url, config);
	                }
	            }
	            const socket = await netSockets.ready(connectionKey, (socket) => {
	                if (socket)
	                    return socket;
	                return netSockets.creating(connectionKey, async () => {
	                    const socket = await createNetConnection({
	                        host: hostname,
	                        port,
	                        lookup,
	                    });
	                    setupSocket(netSockets, connectionKey, socket, config);
	                    return socket;
	                });
	            });
	            claimSocket(netSockets, connectionKey, socket, config);
	            // Use existing HTTP2 session in HTTP2-only mode.
	            if (negotiateHttpVersion === NegotiateHttpVersion.HTTP2_ONLY) {
	                const client = await http2Sessions.ready(connectionKey, (existingClient) => {
	                    if (existingClient) {
	                        freeSocket(netSockets, connectionKey, socket, config);
	                        return existingClient;
	                    }
	                    return http2Sessions.creating(connectionKey, async () => {
	                        const client = await createHttp2Connection(url, socket);
	                        setupHttp2Client(connectionKey, client, config);
	                        return client;
	                    });
	                });
	                return execHttp2(connectionKey, client, req, url, config);
	            }
	            return execHttp1(req, url, socket, config);
	        }
	        // Optionally negotiate HTTP2 connection.
	        if (protocol === "https:") {
	            const { ca, cert, key, secureProtocol, secureContext, secureOptions, } = options;
	            const port = Number(url.port) || 443;
	            const servername = options.servername ||
	                calculateServerName(hostname, req.headers.get("host"));
	            const rejectUnauthorized = options.rejectUnauthorized !== false;
	            const connectionKey = `${hostname}:${port}:${negotiateHttpVersion}:${servername}:${rejectUnauthorized}:${ca || ""}:${cert || ""}:${key || ""}:${secureProtocol || ""}`;
	            // Use an existing HTTP2 session before making a new attempt.
	            if (negotiateHttpVersion === NegotiateHttpVersion.HTTP2_ONLY ||
	                negotiateHttpVersion === NegotiateHttpVersion.HTTP2_FOR_HTTPS) {
	                const existingSession = http2Sessions.free(connectionKey);
	                if (existingSession) {
	                    return execHttp2(connectionKey, existingSession, req, url, config);
	                }
	            }
	            // Use an existing TLS session to speed up handshake.
	            const existingSocket = tlsSockets.get(connectionKey);
	            const session = existingSocket ? existingSocket.getSession() : undefined;
	            const ALPNProtocols = negotiateHttpVersion === NegotiateHttpVersion.HTTP2_ONLY
	                ? ["h2"]
	                : negotiateHttpVersion === NegotiateHttpVersion.HTTP2_FOR_HTTPS
	                    ? ["h2", "http/1.1"]
	                    : undefined;
	            const socketOptions = {
	                host: hostname,
	                port,
	                servername,
	                rejectUnauthorized,
	                ca,
	                cert,
	                key,
	                session,
	                secureProtocol,
	                secureContext,
	                ALPNProtocols,
	                lookup,
	                secureOptions,
	            };
	            const socket = await tlsSockets.ready(connectionKey, (socket) => {
	                if (socket)
	                    return socket;
	                return tlsSockets.creating(connectionKey, async () => {
	                    const socket = await createTlsConnection(socketOptions);
	                    setupSocket(tlsSockets, connectionKey, socket, config);
	                    return socket;
	                });
	            });
	            claimSocket(tlsSockets, connectionKey, socket, config);
	            if (negotiateHttpVersion === NegotiateHttpVersion.HTTP1_ONLY) {
	                return execHttp1(req, url, socket, config);
	            }
	            if (negotiateHttpVersion === NegotiateHttpVersion.HTTP2_ONLY) {
	                const client = await http2Sessions.ready(connectionKey, (existingClient) => {
	                    if (existingClient) {
	                        freeSocket(tlsSockets, connectionKey, socket, config);
	                        return existingClient;
	                    }
	                    return http2Sessions.creating(connectionKey, async () => {
	                        const client = await createHttp2Connection(url, socket);
	                        setupHttp2Client(connectionKey, client, config);
	                        return client;
	                    });
	                });
	                return execHttp2(connectionKey, client, req, url, config);
	            }
	            return new Promise((resolve, reject) => {
	                const onClose = () => {
	                    socket.removeListener("error", onError);
	                    socket.removeListener("connect", onConnect);
	                    return reject(new ALPNError(req, "TLS connection closed early"));
	                };
	                const onError = (err) => {
	                    socket.removeListener("connect", onConnect);
	                    socket.removeListener("close", onClose);
	                    return reject(new ConnectionError(req, `Unable to connect to ${hostname}:${port}`, err));
	                };
	                // Execute HTTP connection according to negotiated ALPN protocol.
	                const onConnect = () => {
	                    socket.removeListener("error", onError);
	                    socket.removeListener("close", onClose);
	                    // Workaround for https://github.com/nodejs/node/pull/32958/files#r418695485.
	                    socket.secureConnecting = false;
	                    // Successfully negotiated HTTP2 connection.
	                    if (socket.alpnProtocol === "h2") {
	                        return resolve(http2Sessions
	                            .ready(connectionKey, (existingClient) => {
	                            if (existingClient) {
	                                freeSocket(tlsSockets, connectionKey, socket, config);
	                                return existingClient;
	                            }
	                            return http2Sessions.creating(connectionKey, async () => {
	                                const client = await createHttp2Connection(url, socket);
	                                setupHttp2Client(connectionKey, client, config);
	                                return client;
	                            });
	                        })
	                            .then((client) => execHttp2(connectionKey, client, req, url, config)));
	                    }
	                    if (socket.alpnProtocol === "http/1.1" || !socket.alpnProtocol) {
	                        return resolve(execHttp1(req, url, socket, config));
	                    }
	                    return reject(new ALPNError(req, `Unknown ALPN protocol negotiated: ${socket.alpnProtocol}`));
	                };
	                // Existing socket may already have negotiated ALPN protocol.
	                // Can be `null`, a string, or `false` when no protocol negotiated.
	                if (socket.alpnProtocol != null)
	                    return onConnect();
	                socket.once("secureConnect", onConnect);
	                socket.once("error", onError);
	                socket.once("close", onClose);
	            });
	        }
	        return next();
	    };
	}
	exports.transport = transport;
	/**
	 * Set socket config for usage, and configure for issues between assigning a socket and making the request.
	 */
	function claimSocket(manager, key, socket, config) {
	    socket.setTimeout(config.idleSocketTimeout);
	    manager.used(key, socket);
	}
	/**
	 * Free a socket in the manager.
	 */
	function freeSocket(manager, key, socket, config) {
	    socket.setTimeout(config.idleSocketTimeout);
	    const shouldDestroy = manager.freed(key, socket);
	    if (shouldDestroy)
	        socket.destroy();
	}
	/**
	 * Setup the socket with the connection manager.
	 *
	 * Ref: https://github.com/nodejs/node/blob/531b4bedcac14044f09129ffb65dab71cc2707d9/lib/_http_agent.js#L254
	 */
	function setupSocket(manager, key, socket, config) {
	    const onFree = () => freeSocket(manager, key, socket, config);
	    const cleanup = () => {
	        manager.delete(key, socket);
	        socket.removeListener("free", onFree);
	        socket.removeListener("close", cleanup);
	        socket.removeListener("error", cleanup);
	        socket.removeListener("timeout", onTimeout);
	    };
	    const onTimeout = () => {
	        socket.destroy();
	        return cleanup();
	    };
	    socket.on("free", onFree);
	    socket.once("close", cleanup);
	    socket.once("error", cleanup);
	    socket.once("timeout", onTimeout);
	    if (config.keepAlive > 0)
	        socket.setKeepAlive(true, config.keepAlive);
	}
	/**
	 * Set up a HTTP2 working session.
	 */
	function setupHttp2Client(key, client, config) {
	    const cleanup = () => {
	        client.removeListener("error", cleanup);
	        client.removeListener("goaway", cleanup);
	        client.removeListener("close", cleanup);
	        config.http2Sessions.delete(key, client);
	    };
	    client.once("error", cleanup);
	    client.once("goaway", cleanup);
	    client.once("close", cleanup);
	}
	/**
	 * Ref: https://github.com/nodejs/node/blob/5823938d156f4eb6dc718746afbf58f1150f70fb/lib/_http_agent.js#L231
	 */
	function calculateServerName(hostname, hostHeader) {
	    if (!hostHeader)
	        return hostname;
	    if (hostHeader.charAt(0) === "[") {
	        const index = hostHeader.indexOf("]");
	        if (index === -1)
	            return hostHeader;
	        return hostHeader.substr(1, index - 1);
	    }
	    return hostHeader.split(":", 1)[0];
	}

	});

	unwrapExports(dist$5);
	dist$5.transport;
	dist$5.AbortError;
	dist$5.NegotiateHttpVersion;
	dist$5.ALPNError;
	dist$5.ConnectionError;
	dist$5.CausedByTimeoutError;
	dist$5.CausedByEarlyCloseError;
	dist$5.defaultHttp2Connect;
	dist$5.defaultTlsConnect;
	dist$5.defaultNetConnect;
	dist$5.Http2ConnectionManager;
	dist$5.SocketConnectionManager;
	dist$5.SocketSet;
	dist$5.Http2Response;
	dist$5.HttpResponse;

	var ipRegex$1 = createCommonjsModule(function (module) {

	const v4 = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';

	const v6seg = '[0-9a-fA-F]{1,4}';
	const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

	const ip = module.exports = opts => opts && opts.exact ?
		new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
		new RegExp(`(?:${v4})|(?:${v6})`, 'g');

	ip.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, 'g');
	ip.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, 'g');
	});

	/** Highest positive signed 32-bit float value */
	const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	const base = 36;
	const tMin = 1;
	const tMax = 26;
	const skew = 38;
	const damp = 700;
	const initialBias = 72;
	const initialN = 128; // 0x80
	const delimiter = '-'; // '\x2D'

	/** Regular expressions */
	const regexPunycode = /^xn--/;
	const regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
	const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

	/** Error messages */
	const errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	};

	/** Convenience shortcuts */
	const baseMinusTMin = base - tMin;
	const floor = Math.floor;
	const stringFromCharCode = String.fromCharCode;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error$1(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map$1(array, fn) {
		const result = [];
		let length = array.length;
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		const parts = string.split('@');
		let result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		const labels = string.split('.');
		const encoded = map$1(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		const output = [];
		let counter = 0;
		const length = string.length;
		while (counter < length) {
			const value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// It's a high surrogate, and there is a next character.
				const extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// It's an unmatched surrogate; only append this code unit, in case the
					// next code unit is the high surrogate of a surrogate pair.
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	const ucs2encode = array => String.fromCodePoint(...array);

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	const basicToDigit = function(codePoint) {
		if (codePoint - 0x30 < 0x0A) {
			return codePoint - 0x16;
		}
		if (codePoint - 0x41 < 0x1A) {
			return codePoint - 0x41;
		}
		if (codePoint - 0x61 < 0x1A) {
			return codePoint - 0x61;
		}
		return base;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	const digitToBasic = function(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	const adapt = function(delta, numPoints, firstTime) {
		let k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	const decode$2 = function(input) {
		// Don't use UCS-2.
		const output = [];
		const inputLength = input.length;
		let i = 0;
		let n = initialN;
		let bias = initialBias;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		let basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (let j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error$1('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			let oldi = i;
			for (let w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error$1('invalid-input');
				}

				const digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error$1('overflow');
				}

				i += digit * w;
				const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				const baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error$1('overflow');
				}

				w *= baseMinusT;

			}

			const out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error$1('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output.
			output.splice(i++, 0, n);

		}

		return String.fromCodePoint(...output);
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	const encode$2 = function(input) {
		const output = [];

		// Convert the input in UCS-2 to an array of Unicode code points.
		input = ucs2decode(input);

		// Cache the length.
		let inputLength = input.length;

		// Initialize the state.
		let n = initialN;
		let delta = 0;
		let bias = initialBias;

		// Handle the basic code points.
		for (const currentValue of input) {
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		let basicLength = output.length;
		let handledCPCount = basicLength;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string with a delimiter unless it's empty.
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			let m = maxInt;
			for (const currentValue of input) {
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow.
			const handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error$1('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (const currentValue of input) {
				if (currentValue < n && ++delta > maxInt) {
					error$1('overflow');
				}
				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer.
					let q = delta;
					for (let k = base; /* no condition */; k += base) {
						const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						const qMinusT = q - t;
						const baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	};

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	const toUnicode = function(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode$2(string.slice(4).toLowerCase())
				: string;
		});
	};

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	const toASCII = function(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode$2(string)
				: string;
		});
	};

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	const punycode$1 = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '2.1.0',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode$2,
		'encode': encode$2,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	var punycode_1 = punycode$1;

	var rules = /*#__PURE__*/Object.freeze({
		__proto__: null
	});

	var require$$0 = getCjsExportFromNamespace(rules);

	var psl = createCommonjsModule(function (module, exports) {





	var internals = {};


	//
	// Read rules from file.
	//
	internals.rules = require$$0.map(function (rule) {

	  return {
	    rule: rule,
	    suffix: rule.replace(/^(\*\.|\!)/, ''),
	    punySuffix: -1,
	    wildcard: rule.charAt(0) === '*',
	    exception: rule.charAt(0) === '!'
	  };
	});


	//
	// Check is given string ends with `suffix`.
	//
	internals.endsWith = function (str, suffix) {

	  return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};


	//
	// Find rule for a given domain.
	//
	internals.findRule = function (domain) {

	  var punyDomain = punycode_1.toASCII(domain);
	  return internals.rules.reduce(function (memo, rule) {

	    if (rule.punySuffix === -1){
	      rule.punySuffix = punycode_1.toASCII(rule.suffix);
	    }
	    if (!internals.endsWith(punyDomain, '.' + rule.punySuffix) && punyDomain !== rule.punySuffix) {
	      return memo;
	    }
	    // This has been commented out as it never seems to run. This is because
	    // sub tlds always appear after their parents and we never find a shorter
	    // match.
	    //if (memo) {
	    //  var memoSuffix = Punycode.toASCII(memo.suffix);
	    //  if (memoSuffix.length >= punySuffix.length) {
	    //    return memo;
	    //  }
	    //}
	    return rule;
	  }, null);
	};


	//
	// Error codes and messages.
	//
	exports.errorCodes = {
	  DOMAIN_TOO_SHORT: 'Domain name too short.',
	  DOMAIN_TOO_LONG: 'Domain name too long. It should be no more than 255 chars.',
	  LABEL_STARTS_WITH_DASH: 'Domain name label can not start with a dash.',
	  LABEL_ENDS_WITH_DASH: 'Domain name label can not end with a dash.',
	  LABEL_TOO_LONG: 'Domain name label should be at most 63 chars long.',
	  LABEL_TOO_SHORT: 'Domain name label should be at least 1 character long.',
	  LABEL_INVALID_CHARS: 'Domain name label can only contain alphanumeric characters or dashes.'
	};


	//
	// Validate domain name and throw if not valid.
	//
	// From wikipedia:
	//
	// Hostnames are composed of series of labels concatenated with dots, as are all
	// domain names. Each label must be between 1 and 63 characters long, and the
	// entire hostname (including the delimiting dots) has a maximum of 255 chars.
	//
	// Allowed chars:
	//
	// * `a-z`
	// * `0-9`
	// * `-` but not as a starting or ending character
	// * `.` as a separator for the textual portions of a domain name
	//
	// * http://en.wikipedia.org/wiki/Domain_name
	// * http://en.wikipedia.org/wiki/Hostname
	//
	internals.validate = function (input) {

	  // Before we can validate we need to take care of IDNs with unicode chars.
	  var ascii = punycode_1.toASCII(input);

	  if (ascii.length < 1) {
	    return 'DOMAIN_TOO_SHORT';
	  }
	  if (ascii.length > 255) {
	    return 'DOMAIN_TOO_LONG';
	  }

	  // Check each part's length and allowed chars.
	  var labels = ascii.split('.');
	  var label;

	  for (var i = 0; i < labels.length; ++i) {
	    label = labels[i];
	    if (!label.length) {
	      return 'LABEL_TOO_SHORT';
	    }
	    if (label.length > 63) {
	      return 'LABEL_TOO_LONG';
	    }
	    if (label.charAt(0) === '-') {
	      return 'LABEL_STARTS_WITH_DASH';
	    }
	    if (label.charAt(label.length - 1) === '-') {
	      return 'LABEL_ENDS_WITH_DASH';
	    }
	    if (!/^[a-z0-9\-]+$/.test(label)) {
	      return 'LABEL_INVALID_CHARS';
	    }
	  }
	};


	//
	// Public API
	//


	//
	// Parse domain.
	//
	exports.parse = function (input) {

	  if (typeof input !== 'string') {
	    throw new TypeError('Domain name must be a string.');
	  }

	  // Force domain to lowercase.
	  var domain = input.slice(0).toLowerCase();

	  // Handle FQDN.
	  // TODO: Simply remove trailing dot?
	  if (domain.charAt(domain.length - 1) === '.') {
	    domain = domain.slice(0, domain.length - 1);
	  }

	  // Validate and sanitise input.
	  var error = internals.validate(domain);
	  if (error) {
	    return {
	      input: input,
	      error: {
	        message: exports.errorCodes[error],
	        code: error
	      }
	    };
	  }

	  var parsed = {
	    input: input,
	    tld: null,
	    sld: null,
	    domain: null,
	    subdomain: null,
	    listed: false
	  };

	  var domainParts = domain.split('.');

	  // Non-Internet TLD
	  if (domainParts[domainParts.length - 1] === 'local') {
	    return parsed;
	  }

	  var handlePunycode = function () {

	    if (!/xn--/.test(domain)) {
	      return parsed;
	    }
	    if (parsed.domain) {
	      parsed.domain = punycode_1.toASCII(parsed.domain);
	    }
	    if (parsed.subdomain) {
	      parsed.subdomain = punycode_1.toASCII(parsed.subdomain);
	    }
	    return parsed;
	  };

	  var rule = internals.findRule(domain);

	  // Unlisted tld.
	  if (!rule) {
	    if (domainParts.length < 2) {
	      return parsed;
	    }
	    parsed.tld = domainParts.pop();
	    parsed.sld = domainParts.pop();
	    parsed.domain = [parsed.sld, parsed.tld].join('.');
	    if (domainParts.length) {
	      parsed.subdomain = domainParts.pop();
	    }
	    return handlePunycode();
	  }

	  // At this point we know the public suffix is listed.
	  parsed.listed = true;

	  var tldParts = rule.suffix.split('.');
	  var privateParts = domainParts.slice(0, domainParts.length - tldParts.length);

	  if (rule.exception) {
	    privateParts.push(tldParts.shift());
	  }

	  parsed.tld = tldParts.join('.');

	  if (!privateParts.length) {
	    return handlePunycode();
	  }

	  if (rule.wildcard) {
	    tldParts.unshift(privateParts.pop());
	    parsed.tld = tldParts.join('.');
	  }

	  if (!privateParts.length) {
	    return handlePunycode();
	  }

	  parsed.sld = privateParts.pop();
	  parsed.domain = [parsed.sld,  parsed.tld].join('.');

	  if (privateParts.length) {
	    parsed.subdomain = privateParts.join('.');
	  }

	  return handlePunycode();
	};


	//
	// Get domain.
	//
	exports.get = function (domain) {

	  if (!domain) {
	    return null;
	  }
	  return exports.parse(domain).domain || null;
	};


	//
	// Check whether domain belongs to a known public suffix.
	//
	exports.isValid = function (domain) {

	  var parsed = exports.parse(domain);
	  return Boolean(parsed.domain && parsed.listed);
	};
	});
	psl.errorCodes;
	psl.parse;
	psl.get;
	psl.isValid;

	function getPublicSuffix$1(domain) {
	  return psl.get(domain);
	}

	var getPublicSuffix_1 = getPublicSuffix$1;

	var pubsuffixPsl = {
		getPublicSuffix: getPublicSuffix_1
	};

	/*!
	 * Copyright (c) 2015, Salesforce.com, Inc.
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are met:
	 *
	 * 1. Redistributions of source code must retain the above copyright notice,
	 * this list of conditions and the following disclaimer.
	 *
	 * 2. Redistributions in binary form must reproduce the above copyright notice,
	 * this list of conditions and the following disclaimer in the documentation
	 * and/or other materials provided with the distribution.
	 *
	 * 3. Neither the name of Salesforce.com nor the names of its contributors may
	 * be used to endorse or promote products derived from this software without
	 * specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
	 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	 * POSSIBILITY OF SUCH DAMAGE.
	 */
	/*jshint unused:false */

	function Store$2() {
	}
	var Store_1$1 = Store$2;

	// Stores may be synchronous, but are still required to use a
	// Continuation-Passing Style API.  The CookieJar itself will expose a "*Sync"
	// API that converts from synchronous-callbacks to imperative style.
	Store$2.prototype.synchronous = false;

	Store$2.prototype.findCookie = function(domain, path, key, cb) {
	  throw new Error('findCookie is not implemented');
	};

	Store$2.prototype.findCookies = function(domain, path, cb) {
	  throw new Error('findCookies is not implemented');
	};

	Store$2.prototype.putCookie = function(cookie, cb) {
	  throw new Error('putCookie is not implemented');
	};

	Store$2.prototype.updateCookie = function(oldCookie, newCookie, cb) {
	  // recommended default implementation:
	  // return this.putCookie(newCookie, cb);
	  throw new Error('updateCookie is not implemented');
	};

	Store$2.prototype.removeCookie = function(domain, path, key, cb) {
	  throw new Error('removeCookie is not implemented');
	};

	Store$2.prototype.removeCookies = function(domain, path, cb) {
	  throw new Error('removeCookies is not implemented');
	};

	Store$2.prototype.removeAllCookies = function(cb) {
	  throw new Error('removeAllCookies is not implemented');
	};

	Store$2.prototype.getAllCookies = function(cb) {
	  throw new Error('getAllCookies is not implemented (therefore jar cannot be serialized)');
	};

	var store = {
		Store: Store_1$1
	};

	// Gives the permutation of all possible domainMatch()es of a given domain. The
	// array is in shortest-to-longest order.  Handy for indexing.
	function permuteDomain$2 (domain) {
	  var pubSuf = pubsuffixPsl.getPublicSuffix(domain);
	  if (!pubSuf) {
	    return null;
	  }
	  if (pubSuf == domain) {
	    return [domain];
	  }

	  var prefix = domain.slice(0, -(pubSuf.length + 1)); // ".example.com"
	  var parts = prefix.split('.').reverse();
	  var cur = pubSuf;
	  var permutations = [cur];
	  while (parts.length) {
	    cur = parts.shift() + '.' + cur;
	    permutations.push(cur);
	  }
	  return permutations;
	}

	var permuteDomain_2 = permuteDomain$2;

	var permuteDomain_1 = {
		permuteDomain: permuteDomain_2
	};

	/*!
	 * Copyright (c) 2015, Salesforce.com, Inc.
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are met:
	 *
	 * 1. Redistributions of source code must retain the above copyright notice,
	 * this list of conditions and the following disclaimer.
	 *
	 * 2. Redistributions in binary form must reproduce the above copyright notice,
	 * this list of conditions and the following disclaimer in the documentation
	 * and/or other materials provided with the distribution.
	 *
	 * 3. Neither the name of Salesforce.com nor the names of its contributors may
	 * be used to endorse or promote products derived from this software without
	 * specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
	 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	 * POSSIBILITY OF SUCH DAMAGE.
	 */
	/*
	 * "A request-path path-matches a given cookie-path if at least one of the
	 * following conditions holds:"
	 */
	function pathMatch$2 (reqPath, cookiePath) {
	  // "o  The cookie-path and the request-path are identical."
	  if (cookiePath === reqPath) {
	    return true;
	  }

	  var idx = reqPath.indexOf(cookiePath);
	  if (idx === 0) {
	    // "o  The cookie-path is a prefix of the request-path, and the last
	    // character of the cookie-path is %x2F ("/")."
	    if (cookiePath.substr(-1) === "/") {
	      return true;
	    }

	    // " o  The cookie-path is a prefix of the request-path, and the first
	    // character of the request-path that is not included in the cookie- path
	    // is a %x2F ("/") character."
	    if (reqPath.substr(cookiePath.length, 1) === "/") {
	      return true;
	    }
	  }

	  return false;
	}

	var pathMatch_2 = pathMatch$2;

	var pathMatch_1$1 = {
		pathMatch: pathMatch_2
	};

	var Store$1 = store.Store;
	var permuteDomain$1 = permuteDomain_1.permuteDomain;
	var pathMatch$1 = pathMatch_1$1.pathMatch;


	function MemoryCookieStore$1() {
	  Store$1.call(this);
	  this.idx = {};
	}
	util__default["default"].inherits(MemoryCookieStore$1, Store$1);
	var MemoryCookieStore_1$1 = MemoryCookieStore$1;
	MemoryCookieStore$1.prototype.idx = null;

	// Since it's just a struct in RAM, this Store is synchronous
	MemoryCookieStore$1.prototype.synchronous = true;

	// force a default depth:
	MemoryCookieStore$1.prototype.inspect = function() {
	  return "{ idx: "+util__default["default"].inspect(this.idx, false, 2)+' }';
	};

	// Use the new custom inspection symbol to add the custom inspect function if
	// available.
	if (util__default["default"].inspect.custom) {
	  MemoryCookieStore$1.prototype[util__default["default"].inspect.custom] = MemoryCookieStore$1.prototype.inspect;
	}

	MemoryCookieStore$1.prototype.findCookie = function(domain, path, key, cb) {
	  if (!this.idx[domain]) {
	    return cb(null,undefined);
	  }
	  if (!this.idx[domain][path]) {
	    return cb(null,undefined);
	  }
	  return cb(null,this.idx[domain][path][key]||null);
	};

	MemoryCookieStore$1.prototype.findCookies = function(domain, path, cb) {
	  var results = [];
	  if (!domain) {
	    return cb(null,[]);
	  }

	  var pathMatcher;
	  if (!path) {
	    // null means "all paths"
	    pathMatcher = function matchAll(domainIndex) {
	      for (var curPath in domainIndex) {
	        var pathIndex = domainIndex[curPath];
	        for (var key in pathIndex) {
	          results.push(pathIndex[key]);
	        }
	      }
	    };

	  } else {
	    pathMatcher = function matchRFC(domainIndex) {
	       //NOTE: we should use path-match algorithm from S5.1.4 here
	       //(see : https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/canonical_cookie.cc#L299)
	       Object.keys(domainIndex).forEach(function (cookiePath) {
	         if (pathMatch$1(path, cookiePath)) {
	           var pathIndex = domainIndex[cookiePath];

	           for (var key in pathIndex) {
	             results.push(pathIndex[key]);
	           }
	         }
	       });
	     };
	  }

	  var domains = permuteDomain$1(domain) || [domain];
	  var idx = this.idx;
	  domains.forEach(function(curDomain) {
	    var domainIndex = idx[curDomain];
	    if (!domainIndex) {
	      return;
	    }
	    pathMatcher(domainIndex);
	  });

	  cb(null,results);
	};

	MemoryCookieStore$1.prototype.putCookie = function(cookie, cb) {
	  if (!this.idx[cookie.domain]) {
	    this.idx[cookie.domain] = {};
	  }
	  if (!this.idx[cookie.domain][cookie.path]) {
	    this.idx[cookie.domain][cookie.path] = {};
	  }
	  this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
	  cb(null);
	};

	MemoryCookieStore$1.prototype.updateCookie = function(oldCookie, newCookie, cb) {
	  // updateCookie() may avoid updating cookies that are identical.  For example,
	  // lastAccessed may not be important to some stores and an equality
	  // comparison could exclude that field.
	  this.putCookie(newCookie,cb);
	};

	MemoryCookieStore$1.prototype.removeCookie = function(domain, path, key, cb) {
	  if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
	    delete this.idx[domain][path][key];
	  }
	  cb(null);
	};

	MemoryCookieStore$1.prototype.removeCookies = function(domain, path, cb) {
	  if (this.idx[domain]) {
	    if (path) {
	      delete this.idx[domain][path];
	    } else {
	      delete this.idx[domain];
	    }
	  }
	  return cb(null);
	};

	MemoryCookieStore$1.prototype.removeAllCookies = function(cb) {
	  this.idx = {};
	  return cb(null);
	};

	MemoryCookieStore$1.prototype.getAllCookies = function(cb) {
	  var cookies = [];
	  var idx = this.idx;

	  var domains = Object.keys(idx);
	  domains.forEach(function(domain) {
	    var paths = Object.keys(idx[domain]);
	    paths.forEach(function(path) {
	      var keys = Object.keys(idx[domain][path]);
	      keys.forEach(function(key) {
	        if (key !== null) {
	          cookies.push(idx[domain][path][key]);
	        }
	      });
	    });
	  });

	  // Sort by creationIndex so deserializing retains the creation order.
	  // When implementing your own store, this SHOULD retain the order too
	  cookies.sort(function(a,b) {
	    return (a.creationIndex||0) - (b.creationIndex||0);
	  });

	  cb(null, cookies);
	};

	var memstore = {
		MemoryCookieStore: MemoryCookieStore_1$1
	};

	// generated by genversion
	var version$1 = '3.0.1';

	var urlParse = url__default["default"].parse;

	var ipRegex = ipRegex$1({ exact: true });

	var Store = store.Store;
	var MemoryCookieStore = memstore.MemoryCookieStore;
	var pathMatch = pathMatch_1$1.pathMatch;


	var punycode;
	try {
	  punycode = punycode_1;
	} catch(e) {
	  console.warn("tough-cookie: can't load punycode; won't use punycode for domain normalization");
	}

	// From RFC6265 S4.1.1
	// note that it excludes \x3B ";"
	var COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;

	var CONTROL_CHARS = /[\x00-\x1F]/;

	// From Chromium // '\r', '\n' and '\0' should be treated as a terminator in
	// the "relaxed" mode, see:
	// https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/parsed_cookie.cc#L60
	var TERMINATORS = ['\n', '\r', '\0'];

	// RFC6265 S4.1.1 defines path value as 'any CHAR except CTLs or ";"'
	// Note ';' is \x3B
	var PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;

	// date-time parsing constants (RFC6265 S5.1.1)

	var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;

	var MONTH_TO_NUM = {
	  jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
	  jul:6, aug:7, sep:8, oct:9, nov:10, dec:11
	};
	var NUM_TO_MONTH = [
	  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
	];
	var NUM_TO_DAY = [
	  'Sun','Mon','Tue','Wed','Thu','Fri','Sat'
	];

	var MAX_TIME = 2147483647000; // 31-bit max
	var MIN_TIME = 0; // 31-bit min

	/*
	 * Parses a Natural number (i.e., non-negative integer) with either the
	 *    <min>*<max>DIGIT ( non-digit *OCTET )
	 * or
	 *    <min>*<max>DIGIT
	 * grammar (RFC6265 S5.1.1).
	 *
	 * The "trailingOK" boolean controls if the grammar accepts a
	 * "( non-digit *OCTET )" trailer.
	 */
	function parseDigits(token, minDigits, maxDigits, trailingOK) {
	  var count = 0;
	  while (count < token.length) {
	    var c = token.charCodeAt(count);
	    // "non-digit = %x00-2F / %x3A-FF"
	    if (c <= 0x2F || c >= 0x3A) {
	      break;
	    }
	    count++;
	  }

	  // constrain to a minimum and maximum number of digits.
	  if (count < minDigits || count > maxDigits) {
	    return null;
	  }

	  if (!trailingOK && count != token.length) {
	    return null;
	  }

	  return parseInt(token.substr(0,count), 10);
	}

	function parseTime(token) {
	  var parts = token.split(':');
	  var result = [0,0,0];

	  /* RF6256 S5.1.1:
	   *      time            = hms-time ( non-digit *OCTET )
	   *      hms-time        = time-field ":" time-field ":" time-field
	   *      time-field      = 1*2DIGIT
	   */

	  if (parts.length !== 3) {
	    return null;
	  }

	  for (var i = 0; i < 3; i++) {
	    // "time-field" must be strictly "1*2DIGIT", HOWEVER, "hms-time" can be
	    // followed by "( non-digit *OCTET )" so therefore the last time-field can
	    // have a trailer
	    var trailingOK = (i == 2);
	    var num = parseDigits(parts[i], 1, 2, trailingOK);
	    if (num === null) {
	      return null;
	    }
	    result[i] = num;
	  }

	  return result;
	}

	function parseMonth(token) {
	  token = String(token).substr(0,3).toLowerCase();
	  var num = MONTH_TO_NUM[token];
	  return num >= 0 ? num : null;
	}

	/*
	 * RFC6265 S5.1.1 date parser (see RFC for full grammar)
	 */
	function parseDate(str) {
	  if (!str) {
	    return;
	  }

	  /* RFC6265 S5.1.1:
	   * 2. Process each date-token sequentially in the order the date-tokens
	   * appear in the cookie-date
	   */
	  var tokens = str.split(DATE_DELIM);
	  if (!tokens) {
	    return;
	  }

	  var hour = null;
	  var minute = null;
	  var second = null;
	  var dayOfMonth = null;
	  var month = null;
	  var year = null;

	  for (var i=0; i<tokens.length; i++) {
	    var token = tokens[i].trim();
	    if (!token.length) {
	      continue;
	    }

	    var result;

	    /* 2.1. If the found-time flag is not set and the token matches the time
	     * production, set the found-time flag and set the hour- value,
	     * minute-value, and second-value to the numbers denoted by the digits in
	     * the date-token, respectively.  Skip the remaining sub-steps and continue
	     * to the next date-token.
	     */
	    if (second === null) {
	      result = parseTime(token);
	      if (result) {
	        hour = result[0];
	        minute = result[1];
	        second = result[2];
	        continue;
	      }
	    }

	    /* 2.2. If the found-day-of-month flag is not set and the date-token matches
	     * the day-of-month production, set the found-day-of- month flag and set
	     * the day-of-month-value to the number denoted by the date-token.  Skip
	     * the remaining sub-steps and continue to the next date-token.
	     */
	    if (dayOfMonth === null) {
	      // "day-of-month = 1*2DIGIT ( non-digit *OCTET )"
	      result = parseDigits(token, 1, 2, true);
	      if (result !== null) {
	        dayOfMonth = result;
	        continue;
	      }
	    }

	    /* 2.3. If the found-month flag is not set and the date-token matches the
	     * month production, set the found-month flag and set the month-value to
	     * the month denoted by the date-token.  Skip the remaining sub-steps and
	     * continue to the next date-token.
	     */
	    if (month === null) {
	      result = parseMonth(token);
	      if (result !== null) {
	        month = result;
	        continue;
	      }
	    }

	    /* 2.4. If the found-year flag is not set and the date-token matches the
	     * year production, set the found-year flag and set the year-value to the
	     * number denoted by the date-token.  Skip the remaining sub-steps and
	     * continue to the next date-token.
	     */
	    if (year === null) {
	      // "year = 2*4DIGIT ( non-digit *OCTET )"
	      result = parseDigits(token, 2, 4, true);
	      if (result !== null) {
	        year = result;
	        /* From S5.1.1:
	         * 3.  If the year-value is greater than or equal to 70 and less
	         * than or equal to 99, increment the year-value by 1900.
	         * 4.  If the year-value is greater than or equal to 0 and less
	         * than or equal to 69, increment the year-value by 2000.
	         */
	        if (year >= 70 && year <= 99) {
	          year += 1900;
	        } else if (year >= 0 && year <= 69) {
	          year += 2000;
	        }
	      }
	    }
	  }

	  /* RFC 6265 S5.1.1
	   * "5. Abort these steps and fail to parse the cookie-date if:
	   *     *  at least one of the found-day-of-month, found-month, found-
	   *        year, or found-time flags is not set,
	   *     *  the day-of-month-value is less than 1 or greater than 31,
	   *     *  the year-value is less than 1601,
	   *     *  the hour-value is greater than 23,
	   *     *  the minute-value is greater than 59, or
	   *     *  the second-value is greater than 59.
	   *     (Note that leap seconds cannot be represented in this syntax.)"
	   *
	   * So, in order as above:
	   */
	  if (
	    dayOfMonth === null || month === null || year === null || second === null ||
	    dayOfMonth < 1 || dayOfMonth > 31 ||
	    year < 1601 ||
	    hour > 23 ||
	    minute > 59 ||
	    second > 59
	  ) {
	    return;
	  }

	  return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
	}

	function formatDate(date) {
	  var d = date.getUTCDate(); d = d >= 10 ? d : '0'+d;
	  var h = date.getUTCHours(); h = h >= 10 ? h : '0'+h;
	  var m = date.getUTCMinutes(); m = m >= 10 ? m : '0'+m;
	  var s = date.getUTCSeconds(); s = s >= 10 ? s : '0'+s;
	  return NUM_TO_DAY[date.getUTCDay()] + ', ' +
	    d+' '+ NUM_TO_MONTH[date.getUTCMonth()] +' '+ date.getUTCFullYear() +' '+
	    h+':'+m+':'+s+' GMT';
	}

	// S5.1.2 Canonicalized Host Names
	function canonicalDomain(str) {
	  if (str == null) {
	    return null;
	  }
	  str = str.trim().replace(/^\./,''); // S4.1.2.3 & S5.2.3: ignore leading .

	  // convert to IDN if any non-ASCII characters
	  if (punycode && /[^\u0001-\u007f]/.test(str)) {
	    str = punycode.toASCII(str);
	  }

	  return str.toLowerCase();
	}

	// S5.1.3 Domain Matching
	function domainMatch(str, domStr, canonicalize) {
	  if (str == null || domStr == null) {
	    return null;
	  }
	  if (canonicalize !== false) {
	    str = canonicalDomain(str);
	    domStr = canonicalDomain(domStr);
	  }

	  /*
	   * "The domain string and the string are identical. (Note that both the
	   * domain string and the string will have been canonicalized to lower case at
	   * this point)"
	   */
	  if (str == domStr) {
	    return true;
	  }

	  /* "All of the following [three] conditions hold:" (order adjusted from the RFC) */

	  /* "* The string is a host name (i.e., not an IP address)." */
	  if (ipRegex.test(str)) {
	    return false;
	  }

	  /* "* The domain string is a suffix of the string" */
	  var idx = str.indexOf(domStr);
	  if (idx <= 0) {
	    return false; // it's a non-match (-1) or prefix (0)
	  }

	  // e.g "a.b.c".indexOf("b.c") === 2
	  // 5 === 3+2
	  if (str.length !== domStr.length + idx) { // it's not a suffix
	    return false;
	  }

	  /* "* The last character of the string that is not included in the domain
	  * string is a %x2E (".") character." */
	  if (str.substr(idx-1,1) !== '.') {
	    return false;
	  }

	  return true;
	}


	// RFC6265 S5.1.4 Paths and Path-Match

	/*
	 * "The user agent MUST use an algorithm equivalent to the following algorithm
	 * to compute the default-path of a cookie:"
	 *
	 * Assumption: the path (and not query part or absolute uri) is passed in.
	 */
	function defaultPath(path) {
	  // "2. If the uri-path is empty or if the first character of the uri-path is not
	  // a %x2F ("/") character, output %x2F ("/") and skip the remaining steps.
	  if (!path || path.substr(0,1) !== "/") {
	    return "/";
	  }

	  // "3. If the uri-path contains no more than one %x2F ("/") character, output
	  // %x2F ("/") and skip the remaining step."
	  if (path === "/") {
	    return path;
	  }

	  var rightSlash = path.lastIndexOf("/");
	  if (rightSlash === 0) {
	    return "/";
	  }

	  // "4. Output the characters of the uri-path from the first character up to,
	  // but not including, the right-most %x2F ("/")."
	  return path.slice(0, rightSlash);
	}

	function trimTerminator(str) {
	  for (var t = 0; t < TERMINATORS.length; t++) {
	    var terminatorIdx = str.indexOf(TERMINATORS[t]);
	    if (terminatorIdx !== -1) {
	      str = str.substr(0,terminatorIdx);
	    }
	  }

	  return str;
	}

	function parseCookiePair(cookiePair, looseMode) {
	  cookiePair = trimTerminator(cookiePair);

	  var firstEq = cookiePair.indexOf('=');
	  if (looseMode) {
	    if (firstEq === 0) { // '=' is immediately at start
	      cookiePair = cookiePair.substr(1);
	      firstEq = cookiePair.indexOf('='); // might still need to split on '='
	    }
	  } else { // non-loose mode
	    if (firstEq <= 0) { // no '=' or is at start
	      return; // needs to have non-empty "cookie-name"
	    }
	  }

	  var cookieName, cookieValue;
	  if (firstEq <= 0) {
	    cookieName = "";
	    cookieValue = cookiePair.trim();
	  } else {
	    cookieName = cookiePair.substr(0, firstEq).trim();
	    cookieValue = cookiePair.substr(firstEq+1).trim();
	  }

	  if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) {
	    return;
	  }

	  var c = new Cookie();
	  c.key = cookieName;
	  c.value = cookieValue;
	  return c;
	}

	function parse$3(str, options) {
	  if (!options || typeof options !== 'object') {
	    options = {};
	  }
	  str = str.trim();

	  // We use a regex to parse the "name-value-pair" part of S5.2
	  var firstSemi = str.indexOf(';'); // S5.2 step 1
	  var cookiePair = (firstSemi === -1) ? str : str.substr(0, firstSemi);
	  var c = parseCookiePair(cookiePair, !!options.loose);
	  if (!c) {
	    return;
	  }

	  if (firstSemi === -1) {
	    return c;
	  }

	  // S5.2.3 "unparsed-attributes consist of the remainder of the set-cookie-string
	  // (including the %x3B (";") in question)." plus later on in the same section
	  // "discard the first ";" and trim".
	  var unparsed = str.slice(firstSemi + 1).trim();

	  // "If the unparsed-attributes string is empty, skip the rest of these
	  // steps."
	  if (unparsed.length === 0) {
	    return c;
	  }

	  /*
	   * S5.2 says that when looping over the items "[p]rocess the attribute-name
	   * and attribute-value according to the requirements in the following
	   * subsections" for every item.  Plus, for many of the individual attributes
	   * in S5.3 it says to use the "attribute-value of the last attribute in the
	   * cookie-attribute-list".  Therefore, in this implementation, we overwrite
	   * the previous value.
	   */
	  var cookie_avs = unparsed.split(';');
	  while (cookie_avs.length) {
	    var av = cookie_avs.shift().trim();
	    if (av.length === 0) { // happens if ";;" appears
	      continue;
	    }
	    var av_sep = av.indexOf('=');
	    var av_key, av_value;

	    if (av_sep === -1) {
	      av_key = av;
	      av_value = null;
	    } else {
	      av_key = av.substr(0,av_sep);
	      av_value = av.substr(av_sep+1);
	    }

	    av_key = av_key.trim().toLowerCase();

	    if (av_value) {
	      av_value = av_value.trim();
	    }

	    switch(av_key) {
	    case 'expires': // S5.2.1
	      if (av_value) {
	        var exp = parseDate(av_value);
	        // "If the attribute-value failed to parse as a cookie date, ignore the
	        // cookie-av."
	        if (exp) {
	          // over and underflow not realistically a concern: V8's getTime() seems to
	          // store something larger than a 32-bit time_t (even with 32-bit node)
	          c.expires = exp;
	        }
	      }
	      break;

	    case 'max-age': // S5.2.2
	      if (av_value) {
	        // "If the first character of the attribute-value is not a DIGIT or a "-"
	        // character ...[or]... If the remainder of attribute-value contains a
	        // non-DIGIT character, ignore the cookie-av."
	        if (/^-?[0-9]+$/.test(av_value)) {
	          var delta = parseInt(av_value, 10);
	          // "If delta-seconds is less than or equal to zero (0), let expiry-time
	          // be the earliest representable date and time."
	          c.setMaxAge(delta);
	        }
	      }
	      break;

	    case 'domain': // S5.2.3
	      // "If the attribute-value is empty, the behavior is undefined.  However,
	      // the user agent SHOULD ignore the cookie-av entirely."
	      if (av_value) {
	        // S5.2.3 "Let cookie-domain be the attribute-value without the leading %x2E
	        // (".") character."
	        var domain = av_value.trim().replace(/^\./, '');
	        if (domain) {
	          // "Convert the cookie-domain to lower case."
	          c.domain = domain.toLowerCase();
	        }
	      }
	      break;

	    case 'path': // S5.2.4
	      /*
	       * "If the attribute-value is empty or if the first character of the
	       * attribute-value is not %x2F ("/"):
	       *   Let cookie-path be the default-path.
	       * Otherwise:
	       *   Let cookie-path be the attribute-value."
	       *
	       * We'll represent the default-path as null since it depends on the
	       * context of the parsing.
	       */
	      c.path = av_value && av_value[0] === "/" ? av_value : null;
	      break;

	    case 'secure': // S5.2.5
	      /*
	       * "If the attribute-name case-insensitively matches the string "Secure",
	       * the user agent MUST append an attribute to the cookie-attribute-list
	       * with an attribute-name of Secure and an empty attribute-value."
	       */
	      c.secure = true;
	      break;

	    case 'httponly': // S5.2.6 -- effectively the same as 'secure'
	      c.httpOnly = true;
	      break;

	    default:
	      c.extensions = c.extensions || [];
	      c.extensions.push(av);
	      break;
	    }
	  }

	  return c;
	}

	// avoid the V8 deoptimization monster!
	function jsonParse(str) {
	  var obj;
	  try {
	    obj = JSON.parse(str);
	  } catch (e) {
	    return e;
	  }
	  return obj;
	}

	function fromJSON(str) {
	  if (!str) {
	    return null;
	  }

	  var obj;
	  if (typeof str === 'string') {
	    obj = jsonParse(str);
	    if (obj instanceof Error) {
	      return null;
	    }
	  } else {
	    // assume it's an Object
	    obj = str;
	  }

	  var c = new Cookie();
	  for (var i=0; i<Cookie.serializableProperties.length; i++) {
	    var prop = Cookie.serializableProperties[i];
	    if (obj[prop] === undefined ||
	        obj[prop] === Cookie.prototype[prop])
	    {
	      continue; // leave as prototype default
	    }

	    if (prop === 'expires' ||
	        prop === 'creation' ||
	        prop === 'lastAccessed')
	    {
	      if (obj[prop] === null) {
	        c[prop] = null;
	      } else {
	        c[prop] = obj[prop] == "Infinity" ?
	          "Infinity" : new Date(obj[prop]);
	      }
	    } else {
	      c[prop] = obj[prop];
	    }
	  }

	  return c;
	}

	/* Section 5.4 part 2:
	 * "*  Cookies with longer paths are listed before cookies with
	 *     shorter paths.
	 *
	 *  *  Among cookies that have equal-length path fields, cookies with
	 *     earlier creation-times are listed before cookies with later
	 *     creation-times."
	 */

	function cookieCompare(a,b) {
	  var cmp = 0;

	  // descending for length: b CMP a
	  var aPathLen = a.path ? a.path.length : 0;
	  var bPathLen = b.path ? b.path.length : 0;
	  cmp = bPathLen - aPathLen;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  // ascending for time: a CMP b
	  var aTime = a.creation ? a.creation.getTime() : MAX_TIME;
	  var bTime = b.creation ? b.creation.getTime() : MAX_TIME;
	  cmp = aTime - bTime;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  // break ties for the same millisecond (precision of JavaScript's clock)
	  cmp = a.creationIndex - b.creationIndex;

	  return cmp;
	}

	// Gives the permutation of all possible pathMatch()es of a given path. The
	// array is in longest-to-shortest order.  Handy for indexing.
	function permutePath(path) {
	  if (path === '/') {
	    return ['/'];
	  }
	  if (path.lastIndexOf('/') === path.length-1) {
	    path = path.substr(0,path.length-1);
	  }
	  var permutations = [path];
	  while (path.length > 1) {
	    var lindex = path.lastIndexOf('/');
	    if (lindex === 0) {
	      break;
	    }
	    path = path.substr(0,lindex);
	    permutations.push(path);
	  }
	  permutations.push('/');
	  return permutations;
	}

	function getCookieContext(url) {
	  if (url instanceof Object) {
	    return url;
	  }
	  // NOTE: decodeURI will throw on malformed URIs (see GH-32).
	  // Therefore, we will just skip decoding for such URIs.
	  try {
	    url = decodeURI(url);
	  }
	  catch(err) {
	    // Silently swallow error
	  }

	  return urlParse(url);
	}

	function Cookie(options) {
	  options = options || {};

	  Object.keys(options).forEach(function(prop) {
	    if (Cookie.prototype.hasOwnProperty(prop) &&
	        Cookie.prototype[prop] !== options[prop] &&
	        prop.substr(0,1) !== '_')
	    {
	      this[prop] = options[prop];
	    }
	  }, this);

	  this.creation = this.creation || new Date();

	  // used to break creation ties in cookieCompare():
	  Object.defineProperty(this, 'creationIndex', {
	    configurable: false,
	    enumerable: false, // important for assert.deepEqual checks
	    writable: true,
	    value: ++Cookie.cookiesCreated
	  });
	}

	Cookie.cookiesCreated = 0; // incremented each time a cookie is created

	Cookie.parse = parse$3;
	Cookie.fromJSON = fromJSON;

	Cookie.prototype.key = "";
	Cookie.prototype.value = "";

	// the order in which the RFC has them:
	Cookie.prototype.expires = "Infinity"; // coerces to literal Infinity
	Cookie.prototype.maxAge = null; // takes precedence over expires for TTL
	Cookie.prototype.domain = null;
	Cookie.prototype.path = null;
	Cookie.prototype.secure = false;
	Cookie.prototype.httpOnly = false;
	Cookie.prototype.extensions = null;

	// set by the CookieJar:
	Cookie.prototype.hostOnly = null; // boolean when set
	Cookie.prototype.pathIsDefault = null; // boolean when set
	Cookie.prototype.creation = null; // Date when set; defaulted by Cookie.parse
	Cookie.prototype.lastAccessed = null; // Date when set
	Object.defineProperty(Cookie.prototype, 'creationIndex', {
	  configurable: true,
	  enumerable: false,
	  writable: true,
	  value: 0
	});

	Cookie.serializableProperties = Object.keys(Cookie.prototype)
	  .filter(function(prop) {
	    return !(
	      Cookie.prototype[prop] instanceof Function ||
	      prop === 'creationIndex' ||
	      prop.substr(0,1) === '_'
	    );
	  });

	Cookie.prototype.inspect = function inspect() {
	  var now = Date.now();
	  return 'Cookie="'+this.toString() +
	    '; hostOnly='+(this.hostOnly != null ? this.hostOnly : '?') +
	    '; aAge='+(this.lastAccessed ? (now-this.lastAccessed.getTime())+'ms' : '?') +
	    '; cAge='+(this.creation ? (now-this.creation.getTime())+'ms' : '?') +
	    '"';
	};

	// Use the new custom inspection symbol to add the custom inspect function if
	// available.
	if (util__default["default"].inspect.custom) {
	  Cookie.prototype[util__default["default"].inspect.custom] = Cookie.prototype.inspect;
	}

	Cookie.prototype.toJSON = function() {
	  var obj = {};

	  var props = Cookie.serializableProperties;
	  for (var i=0; i<props.length; i++) {
	    var prop = props[i];
	    if (this[prop] === Cookie.prototype[prop]) {
	      continue; // leave as prototype default
	    }

	    if (prop === 'expires' ||
	        prop === 'creation' ||
	        prop === 'lastAccessed')
	    {
	      if (this[prop] === null) {
	        obj[prop] = null;
	      } else {
	        obj[prop] = this[prop] == "Infinity" ? // intentionally not ===
	          "Infinity" : this[prop].toISOString();
	      }
	    } else if (prop === 'maxAge') {
	      if (this[prop] !== null) {
	        // again, intentionally not ===
	        obj[prop] = (this[prop] == Infinity || this[prop] == -Infinity) ?
	          this[prop].toString() : this[prop];
	      }
	    } else {
	      if (this[prop] !== Cookie.prototype[prop]) {
	        obj[prop] = this[prop];
	      }
	    }
	  }

	  return obj;
	};

	Cookie.prototype.clone = function() {
	  return fromJSON(this.toJSON());
	};

	Cookie.prototype.validate = function validate() {
	  if (!COOKIE_OCTETS.test(this.value)) {
	    return false;
	  }
	  if (this.expires != Infinity && !(this.expires instanceof Date) && !parseDate(this.expires)) {
	    return false;
	  }
	  if (this.maxAge != null && this.maxAge <= 0) {
	    return false; // "Max-Age=" non-zero-digit *DIGIT
	  }
	  if (this.path != null && !PATH_VALUE.test(this.path)) {
	    return false;
	  }

	  var cdomain = this.cdomain();
	  if (cdomain) {
	    if (cdomain.match(/\.$/)) {
	      return false; // S4.1.2.3 suggests that this is bad. domainMatch() tests confirm this
	    }
	    var suffix = pubsuffixPsl.getPublicSuffix(cdomain);
	    if (suffix == null) { // it's a public suffix
	      return false;
	    }
	  }
	  return true;
	};

	Cookie.prototype.setExpires = function setExpires(exp) {
	  if (exp instanceof Date) {
	    this.expires = exp;
	  } else {
	    this.expires = parseDate(exp) || "Infinity";
	  }
	};

	Cookie.prototype.setMaxAge = function setMaxAge(age) {
	  if (age === Infinity || age === -Infinity) {
	    this.maxAge = age.toString(); // so JSON.stringify() works
	  } else {
	    this.maxAge = age;
	  }
	};

	// gives Cookie header format
	Cookie.prototype.cookieString = function cookieString() {
	  var val = this.value;
	  if (val == null) {
	    val = '';
	  }
	  if (this.key === '') {
	    return val;
	  }
	  return this.key+'='+val;
	};

	// gives Set-Cookie header format
	Cookie.prototype.toString = function toString() {
	  var str = this.cookieString();

	  if (this.expires != Infinity) {
	    if (this.expires instanceof Date) {
	      str += '; Expires='+formatDate(this.expires);
	    } else {
	      str += '; Expires='+this.expires;
	    }
	  }

	  if (this.maxAge != null && this.maxAge != Infinity) {
	    str += '; Max-Age='+this.maxAge;
	  }

	  if (this.domain && !this.hostOnly) {
	    str += '; Domain='+this.domain;
	  }
	  if (this.path) {
	    str += '; Path='+this.path;
	  }

	  if (this.secure) {
	    str += '; Secure';
	  }
	  if (this.httpOnly) {
	    str += '; HttpOnly';
	  }
	  if (this.extensions) {
	    this.extensions.forEach(function(ext) {
	      str += '; '+ext;
	    });
	  }

	  return str;
	};

	// TTL() partially replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
	// elsewhere)
	// S5.3 says to give the "latest representable date" for which we use Infinity
	// For "expired" we use 0
	Cookie.prototype.TTL = function TTL(now) {
	  /* RFC6265 S4.1.2.2 If a cookie has both the Max-Age and the Expires
	   * attribute, the Max-Age attribute has precedence and controls the
	   * expiration date of the cookie.
	   * (Concurs with S5.3 step 3)
	   */
	  if (this.maxAge != null) {
	    return this.maxAge<=0 ? 0 : this.maxAge*1000;
	  }

	  var expires = this.expires;
	  if (expires != Infinity) {
	    if (!(expires instanceof Date)) {
	      expires = parseDate(expires) || Infinity;
	    }

	    if (expires == Infinity) {
	      return Infinity;
	    }

	    return expires.getTime() - (now || Date.now());
	  }

	  return Infinity;
	};

	// expiryTime() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
	// elsewhere)
	Cookie.prototype.expiryTime = function expiryTime(now) {
	  if (this.maxAge != null) {
	    var relativeTo = now || this.creation || new Date();
	    var age = (this.maxAge <= 0) ? -Infinity : this.maxAge*1000;
	    return relativeTo.getTime() + age;
	  }

	  if (this.expires == Infinity) {
	    return Infinity;
	  }
	  return this.expires.getTime();
	};

	// expiryDate() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
	// elsewhere), except it returns a Date
	Cookie.prototype.expiryDate = function expiryDate(now) {
	  var millisec = this.expiryTime(now);
	  if (millisec == Infinity) {
	    return new Date(MAX_TIME);
	  } else if (millisec == -Infinity) {
	    return new Date(MIN_TIME);
	  } else {
	    return new Date(millisec);
	  }
	};

	// This replaces the "persistent-flag" parts of S5.3 step 3
	Cookie.prototype.isPersistent = function isPersistent() {
	  return (this.maxAge != null || this.expires != Infinity);
	};

	// Mostly S5.1.2 and S5.2.3:
	Cookie.prototype.cdomain =
	Cookie.prototype.canonicalizedDomain = function canonicalizedDomain() {
	  if (this.domain == null) {
	    return null;
	  }
	  return canonicalDomain(this.domain);
	};

	function CookieJar(store, options) {
	  if (typeof options === "boolean") {
	    options = {rejectPublicSuffixes: options};
	  } else if (options == null) {
	    options = {};
	  }
	  if (options.rejectPublicSuffixes != null) {
	    this.rejectPublicSuffixes = options.rejectPublicSuffixes;
	  }
	  if (options.looseMode != null) {
	    this.enableLooseMode = options.looseMode;
	  }

	  if (!store) {
	    store = new MemoryCookieStore();
	  }
	  this.store = store;
	}
	CookieJar.prototype.store = null;
	CookieJar.prototype.rejectPublicSuffixes = true;
	CookieJar.prototype.enableLooseMode = false;
	var CAN_BE_SYNC = [];

	CAN_BE_SYNC.push('setCookie');
	CookieJar.prototype.setCookie = function(cookie, url, options, cb) {
	  var err;
	  var context = getCookieContext(url);
	  if (options instanceof Function) {
	    cb = options;
	    options = {};
	  }

	  var host = canonicalDomain(context.hostname);
	  var loose = this.enableLooseMode;
	  if (options.loose != null) {
	    loose = options.loose;
	  }

	  // S5.3 step 1
	  if (typeof(cookie) === 'string' || cookie instanceof String) {
	    cookie = Cookie.parse(cookie, { loose: loose });
	    if (!cookie) {
	      err = new Error("Cookie failed to parse");
	      return cb(options.ignoreError ? null : err);
	    }
	  }
	  else if (!(cookie instanceof Cookie)) {
	    // If you're seeing this error, and are passing in a Cookie object, 
	    // it *might* be a Cookie object from another loaded version of tough-cookie.
	    err = new Error("First argument to setCookie must be a Cookie object or string");
	    return cb(options.ignoreError ? null : err);
	  }

	  // S5.3 step 2
	  var now = options.now || new Date(); // will assign later to save effort in the face of errors

	  // S5.3 step 3: NOOP; persistent-flag and expiry-time is handled by getCookie()

	  // S5.3 step 4: NOOP; domain is null by default

	  // S5.3 step 5: public suffixes
	  if (this.rejectPublicSuffixes && cookie.domain) {
	    var suffix = pubsuffixPsl.getPublicSuffix(cookie.cdomain());
	    if (suffix == null) { // e.g. "com"
	      err = new Error("Cookie has domain set to a public suffix");
	      return cb(options.ignoreError ? null : err);
	    }
	  }

	  // S5.3 step 6:
	  if (cookie.domain) {
	    if (!domainMatch(host, cookie.cdomain(), false)) {
	      err = new Error("Cookie not in this host's domain. Cookie:"+cookie.cdomain()+" Request:"+host);
	      return cb(options.ignoreError ? null : err);
	    }

	    if (cookie.hostOnly == null) { // don't reset if already set
	      cookie.hostOnly = false;
	    }

	  } else {
	    cookie.hostOnly = true;
	    cookie.domain = host;
	  }

	  //S5.2.4 If the attribute-value is empty or if the first character of the
	  //attribute-value is not %x2F ("/"):
	  //Let cookie-path be the default-path.
	  if (!cookie.path || cookie.path[0] !== '/') {
	    cookie.path = defaultPath(context.pathname);
	    cookie.pathIsDefault = true;
	  }

	  // S5.3 step 8: NOOP; secure attribute
	  // S5.3 step 9: NOOP; httpOnly attribute

	  // S5.3 step 10
	  if (options.http === false && cookie.httpOnly) {
	    err = new Error("Cookie is HttpOnly and this isn't an HTTP API");
	    return cb(options.ignoreError ? null : err);
	  }

	  var store = this.store;

	  if (!store.updateCookie) {
	    store.updateCookie = function(oldCookie, newCookie, cb) {
	      this.putCookie(newCookie, cb);
	    };
	  }

	  function withCookie(err, oldCookie) {
	    if (err) {
	      return cb(err);
	    }

	    var next = function(err) {
	      if (err) {
	        return cb(err);
	      } else {
	        cb(null, cookie);
	      }
	    };

	    if (oldCookie) {
	      // S5.3 step 11 - "If the cookie store contains a cookie with the same name,
	      // domain, and path as the newly created cookie:"
	      if (options.http === false && oldCookie.httpOnly) { // step 11.2
	        err = new Error("old Cookie is HttpOnly and this isn't an HTTP API");
	        return cb(options.ignoreError ? null : err);
	      }
	      cookie.creation = oldCookie.creation; // step 11.3
	      cookie.creationIndex = oldCookie.creationIndex; // preserve tie-breaker
	      cookie.lastAccessed = now;
	      // Step 11.4 (delete cookie) is implied by just setting the new one:
	      store.updateCookie(oldCookie, cookie, next); // step 12

	    } else {
	      cookie.creation = cookie.lastAccessed = now;
	      store.putCookie(cookie, next); // step 12
	    }
	  }

	  store.findCookie(cookie.domain, cookie.path, cookie.key, withCookie);
	};

	// RFC6365 S5.4
	CAN_BE_SYNC.push('getCookies');
	CookieJar.prototype.getCookies = function(url, options, cb) {
	  var context = getCookieContext(url);
	  if (options instanceof Function) {
	    cb = options;
	    options = {};
	  }

	  var host = canonicalDomain(context.hostname);
	  var path = context.pathname || '/';

	  var secure = options.secure;
	  if (secure == null && context.protocol &&
	      (context.protocol == 'https:' || context.protocol == 'wss:'))
	  {
	    secure = true;
	  }

	  var http = options.http;
	  if (http == null) {
	    http = true;
	  }

	  var now = options.now || Date.now();
	  var expireCheck = options.expire !== false;
	  var allPaths = !!options.allPaths;
	  var store = this.store;

	  function matchingCookie(c) {
	    // "Either:
	    //   The cookie's host-only-flag is true and the canonicalized
	    //   request-host is identical to the cookie's domain.
	    // Or:
	    //   The cookie's host-only-flag is false and the canonicalized
	    //   request-host domain-matches the cookie's domain."
	    if (c.hostOnly) {
	      if (c.domain != host) {
	        return false;
	      }
	    } else {
	      if (!domainMatch(host, c.domain, false)) {
	        return false;
	      }
	    }

	    // "The request-uri's path path-matches the cookie's path."
	    if (!allPaths && !pathMatch(path, c.path)) {
	      return false;
	    }

	    // "If the cookie's secure-only-flag is true, then the request-uri's
	    // scheme must denote a "secure" protocol"
	    if (c.secure && !secure) {
	      return false;
	    }

	    // "If the cookie's http-only-flag is true, then exclude the cookie if the
	    // cookie-string is being generated for a "non-HTTP" API"
	    if (c.httpOnly && !http) {
	      return false;
	    }

	    // deferred from S5.3
	    // non-RFC: allow retention of expired cookies by choice
	    if (expireCheck && c.expiryTime() <= now) {
	      store.removeCookie(c.domain, c.path, c.key, function(){}); // result ignored
	      return false;
	    }

	    return true;
	  }

	  store.findCookies(host, allPaths ? null : path, function(err,cookies) {
	    if (err) {
	      return cb(err);
	    }

	    cookies = cookies.filter(matchingCookie);

	    // sorting of S5.4 part 2
	    if (options.sort !== false) {
	      cookies = cookies.sort(cookieCompare);
	    }

	    // S5.4 part 3
	    var now = new Date();
	    cookies.forEach(function(c) {
	      c.lastAccessed = now;
	    });
	    // TODO persist lastAccessed

	    cb(null,cookies);
	  });
	};

	CAN_BE_SYNC.push('getCookieString');
	CookieJar.prototype.getCookieString = function(/*..., cb*/) {
	  var args = Array.prototype.slice.call(arguments,0);
	  var cb = args.pop();
	  var next = function(err,cookies) {
	    if (err) {
	      cb(err);
	    } else {
	      cb(null, cookies
	        .sort(cookieCompare)
	        .map(function(c){
	          return c.cookieString();
	        })
	        .join('; '));
	    }
	  };
	  args.push(next);
	  this.getCookies.apply(this,args);
	};

	CAN_BE_SYNC.push('getSetCookieStrings');
	CookieJar.prototype.getSetCookieStrings = function(/*..., cb*/) {
	  var args = Array.prototype.slice.call(arguments,0);
	  var cb = args.pop();
	  var next = function(err,cookies) {
	    if (err) {
	      cb(err);
	    } else {
	      cb(null, cookies.map(function(c){
	        return c.toString();
	      }));
	    }
	  };
	  args.push(next);
	  this.getCookies.apply(this,args);
	};

	CAN_BE_SYNC.push('serialize');
	CookieJar.prototype.serialize = function(cb) {
	  var type = this.store.constructor.name;
	  if (type === 'Object') {
	    type = null;
	  }

	  // update README.md "Serialization Format" if you change this, please!
	  var serialized = {
	    // The version of tough-cookie that serialized this jar. Generally a good
	    // practice since future versions can make data import decisions based on
	    // known past behavior. When/if this matters, use `semver`.
	    version: 'tough-cookie@'+version$1,

	    // add the store type, to make humans happy:
	    storeType: type,

	    // CookieJar configuration:
	    rejectPublicSuffixes: !!this.rejectPublicSuffixes,

	    // this gets filled from getAllCookies:
	    cookies: []
	  };

	  if (!(this.store.getAllCookies &&
	        typeof this.store.getAllCookies === 'function'))
	  {
	    return cb(new Error('store does not support getAllCookies and cannot be serialized'));
	  }

	  this.store.getAllCookies(function(err,cookies) {
	    if (err) {
	      return cb(err);
	    }

	    serialized.cookies = cookies.map(function(cookie) {
	      // convert to serialized 'raw' cookies
	      cookie = (cookie instanceof Cookie) ? cookie.toJSON() : cookie;

	      // Remove the index so new ones get assigned during deserialization
	      delete cookie.creationIndex;

	      return cookie;
	    });

	    return cb(null, serialized);
	  });
	};

	// well-known name that JSON.stringify calls
	CookieJar.prototype.toJSON = function() {
	  return this.serializeSync();
	};

	// use the class method CookieJar.deserialize instead of calling this directly
	CAN_BE_SYNC.push('_importCookies');
	CookieJar.prototype._importCookies = function(serialized, cb) {
	  var jar = this;
	  var cookies = serialized.cookies;
	  if (!cookies || !Array.isArray(cookies)) {
	    return cb(new Error('serialized jar has no cookies array'));
	  }
	  cookies = cookies.slice(); // do not modify the original

	  function putNext(err) {
	    if (err) {
	      return cb(err);
	    }

	    if (!cookies.length) {
	      return cb(err, jar);
	    }

	    var cookie;
	    try {
	      cookie = fromJSON(cookies.shift());
	    } catch (e) {
	      return cb(e);
	    }

	    if (cookie === null) {
	      return putNext(null); // skip this cookie
	    }

	    jar.store.putCookie(cookie, putNext);
	  }

	  putNext();
	};

	CookieJar.deserialize = function(strOrObj, store, cb) {
	  if (arguments.length !== 3) {
	    // store is optional
	    cb = store;
	    store = null;
	  }

	  var serialized;
	  if (typeof strOrObj === 'string') {
	    serialized = jsonParse(strOrObj);
	    if (serialized instanceof Error) {
	      return cb(serialized);
	    }
	  } else {
	    serialized = strOrObj;
	  }

	  var jar = new CookieJar(store, serialized.rejectPublicSuffixes);
	  jar._importCookies(serialized, function(err) {
	    if (err) {
	      return cb(err);
	    }
	    cb(null, jar);
	  });
	};

	CookieJar.deserializeSync = function(strOrObj, store) {
	  var serialized = typeof strOrObj === 'string' ?
	    JSON.parse(strOrObj) : strOrObj;
	  var jar = new CookieJar(store, serialized.rejectPublicSuffixes);

	  // catch this mistake early:
	  if (!jar.store.synchronous) {
	    throw new Error('CookieJar store is not synchronous; use async API instead.');
	  }

	  jar._importCookiesSync(serialized);
	  return jar;
	};
	CookieJar.fromJSON = CookieJar.deserializeSync;

	CookieJar.prototype.clone = function(newStore, cb) {
	  if (arguments.length === 1) {
	    cb = newStore;
	    newStore = null;
	  }

	  this.serialize(function(err,serialized) {
	    if (err) {
	      return cb(err);
	    }
	    CookieJar.deserialize(serialized, newStore, cb);
	  });
	};

	CAN_BE_SYNC.push('removeAllCookies');
	CookieJar.prototype.removeAllCookies = function(cb) {
	  var store = this.store;

	  // Check that the store implements its own removeAllCookies(). The default
	  // implementation in Store will immediately call the callback with a "not
	  // implemented" Error.
	  if (store.removeAllCookies instanceof Function &&
	      store.removeAllCookies !== Store.prototype.removeAllCookies)
	  {
	    return store.removeAllCookies(cb);
	  }

	  store.getAllCookies(function(err, cookies) {
	    if (err) {
	      return cb(err);
	    }

	    if (cookies.length === 0) {
	      return cb(null);
	    }

	    var completedCount = 0;
	    var removeErrors = [];

	    function removeCookieCb(removeErr) {
	      if (removeErr) {
	        removeErrors.push(removeErr);
	      }

	      completedCount++;

	      if (completedCount === cookies.length) {
	        return cb(removeErrors.length ? removeErrors[0] : null);
	      }
	    }

	    cookies.forEach(function(cookie) {
	      store.removeCookie(cookie.domain, cookie.path, cookie.key, removeCookieCb);
	    });
	  });
	};

	CookieJar.prototype._cloneSync = syncWrap('clone');
	CookieJar.prototype.cloneSync = function(newStore) {
	  if (!newStore.synchronous) {
	    throw new Error('CookieJar clone destination store is not synchronous; use async API instead.');
	  }
	  return this._cloneSync(newStore);
	};

	// Use a closure to provide a true imperative API for synchronous stores.
	function syncWrap(method) {
	  return function() {
	    if (!this.store.synchronous) {
	      throw new Error('CookieJar store is not synchronous; use async API instead.');
	    }

	    var args = Array.prototype.slice.call(arguments);
	    var syncErr, syncResult;
	    args.push(function syncCb(err, result) {
	      syncErr = err;
	      syncResult = result;
	    });
	    this[method].apply(this, args);

	    if (syncErr) {
	      throw syncErr;
	    }
	    return syncResult;
	  };
	}

	// wrap all declared CAN_BE_SYNC methods in the sync wrapper
	CAN_BE_SYNC.forEach(function(method) {
	  CookieJar.prototype[method+'Sync'] = syncWrap(method);
	});

	var version = version$1;
	var CookieJar_1 = CookieJar;
	var Cookie_1 = Cookie;
	var Store_1 = Store;
	var MemoryCookieStore_1 = MemoryCookieStore;
	var parseDate_1 = parseDate;
	var formatDate_1 = formatDate;
	var parse_1 = parse$3;
	var fromJSON_1 = fromJSON;
	var domainMatch_1 = domainMatch;
	var defaultPath_1 = defaultPath;
	var pathMatch_1 = pathMatch;
	var getPublicSuffix = pubsuffixPsl.getPublicSuffix;
	var cookieCompare_1 = cookieCompare;
	var permuteDomain = permuteDomain_1.permuteDomain;
	var permutePath_1 = permutePath;
	var canonicalDomain_1 = canonicalDomain;

	var cookie = {
		version: version,
		CookieJar: CookieJar_1,
		Cookie: Cookie_1,
		Store: Store_1,
		MemoryCookieStore: MemoryCookieStore_1,
		parseDate: parseDate_1,
		formatDate: formatDate_1,
		parse: parse_1,
		fromJSON: fromJSON_1,
		domainMatch: domainMatch_1,
		defaultPath: defaultPath_1,
		pathMatch: pathMatch_1,
		getPublicSuffix: getPublicSuffix,
		cookieCompare: cookieCompare_1,
		permuteDomain: permuteDomain,
		permutePath: permutePath_1,
		canonicalDomain: canonicalDomain_1
	};

	var dist$4 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.CookieJar = cookie.CookieJar;
	/**
	 * Read and write cookies with a cookie jar.
	 */
	function cookies(jar = new cookie.CookieJar()) {
	    return async function cookieJar(req, next) {
	        const prevCookies = req.headers.getAll("Cookie").join("; ");
	        const res = await new Promise((resolve, reject) => {
	            jar.getCookieString(req.url, (err, cookies) => {
	                if (err)
	                    return reject(err);
	                if (cookies) {
	                    req.headers.set("Cookie", prevCookies ? `${prevCookies}; ${cookies}` : cookies);
	                }
	                return resolve(next());
	            });
	        });
	        const cookies = res.headers.getAll("set-cookie");
	        await Promise.all(cookies.map(function (cookie) {
	            return new Promise(function (resolve, reject) {
	                jar.setCookie(cookie, req.url, { ignoreError: true }, (err) => (err ? reject(err) : resolve()));
	            });
	        }));
	        return res;
	    };
	}
	exports.cookies = cookies;

	});

	unwrapExports(dist$4);
	dist$4.CookieJar;
	dist$4.cookies;

	var dist$3 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Decoding errors.
	 */
	class EncodingError extends Error {
	    constructor(response, message) {
	        super(message);
	        this.response = response;
	        this.code = "EINVALIDENCODING";
	    }
	}
	exports.EncodingError = EncodingError;
	/**
	 * Automatically support decoding compressed HTTP responses.
	 */
	function contentEncoding() {
	    return async function (req, next) {
	        if (req.headers.has("Accept-Encoding"))
	            return next();
	        req.headers.set("Accept-Encoding", zlib__default["default"].createBrotliDecompress ? "gzip, deflate, br" : "gzip, deflate");
	        const res = await next();
	        const enc = res.headers.get("Content-Encoding");
	        // Unzip body automatically when response is encoded.
	        if (enc === "deflate" || enc === "gzip") {
	            res.$rawBody = res.stream().pipe(zlib__default["default"].createUnzip());
	        }
	        else if (enc === "br") {
	            if (zlib__default["default"].createBrotliDecompress) {
	                res.$rawBody = res.stream().pipe(zlib__default["default"].createBrotliDecompress());
	            }
	            else {
	                throw new EncodingError(res, "Unable to support Brotli decoding");
	            }
	        }
	        else if (enc && enc !== "identity") {
	            throw new EncodingError(res, `Unable to decode "${enc}" encoding`);
	        }
	        return res;
	    };
	}
	exports.contentEncoding = contentEncoding;

	});

	unwrapExports(dist$3);
	dist$3.EncodingError;
	dist$3.contentEncoding;

	var dist$2 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Redirection types to handle.
	 */
	var REDIRECT_TYPE;
	(function (REDIRECT_TYPE) {
	    REDIRECT_TYPE[REDIRECT_TYPE["FOLLOW_WITH_GET"] = 0] = "FOLLOW_WITH_GET";
	    REDIRECT_TYPE[REDIRECT_TYPE["FOLLOW_WITH_CONFIRMATION"] = 1] = "FOLLOW_WITH_CONFIRMATION";
	})(REDIRECT_TYPE || (REDIRECT_TYPE = {}));
	/**
	 * Possible redirection status codes.
	 */
	const REDIRECT_STATUS = {
	    "301": REDIRECT_TYPE.FOLLOW_WITH_GET,
	    "302": REDIRECT_TYPE.FOLLOW_WITH_GET,
	    "303": REDIRECT_TYPE.FOLLOW_WITH_GET,
	    "307": REDIRECT_TYPE.FOLLOW_WITH_CONFIRMATION,
	    "308": REDIRECT_TYPE.FOLLOW_WITH_CONFIRMATION
	};
	/**
	 * Maximum redirects error.
	 */
	class MaxRedirectsError extends Error {
	    constructor(request, message) {
	        super(message);
	        this.request = request;
	        this.code = "EMAXREDIRECTS";
	    }
	}
	exports.MaxRedirectsError = MaxRedirectsError;
	/**
	 * Middleware function for following HTTP redirects.
	 */
	function redirects(fn, maxRedirects = 5, confirmRedirect = () => false) {
	    return async function (initReq, done) {
	        let req = initReq.clone();
	        let redirectCount = 0;
	        while (redirectCount++ < maxRedirects) {
	            const res = await fn(req, done);
	            const redirect = REDIRECT_STATUS[res.status];
	            if (redirect === undefined || !res.headers.has("Location"))
	                return res;
	            const newUrl = url__default["default"].resolve(req.url, res.headers.get("Location")); // tslint:disable-line
	            await res.destroy(); // Ignore the result of the response on redirect.
	            req.signal.emit("redirect", newUrl);
	            if (redirect === REDIRECT_TYPE.FOLLOW_WITH_GET) {
	                const method = initReq.method.toUpperCase() === "HEAD" ? "HEAD" : "GET";
	                req = initReq.clone();
	                req.url = newUrl;
	                req.method = method;
	                req.$rawBody = null; // Override internal raw body.
	                // No body will be sent with this redirect.
	                req.headers.set("Content-Length", "0");
	                continue;
	            }
	            if (redirect === REDIRECT_TYPE.FOLLOW_WITH_CONFIRMATION) {
	                const { method } = req;
	                // Following HTTP spec by automatically redirecting with GET/HEAD.
	                if (method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") {
	                    req = initReq.clone();
	                    req.url = newUrl;
	                    req.method = method;
	                    continue;
	                }
	                // Allow the user to confirm redirect according to HTTP spec.
	                if (confirmRedirect(req, res)) {
	                    req = initReq.clone();
	                    req.url = newUrl;
	                    req.method = method;
	                    continue;
	                }
	            }
	            return res;
	        }
	        throw new MaxRedirectsError(req, `Maximum redirects exceeded: ${maxRedirects}`);
	    };
	}
	exports.redirects = redirects;

	});

	unwrapExports(dist$2);
	dist$2.MaxRedirectsError;
	dist$2.redirects;

	var dist$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Default `user-agent` header.
	 */
	exports.DEFAULT_USER_AGENT = "Popsicle (https://github.com/serviejs/popsicle)";
	/**
	 * Set a `User-Agent` header for every request.
	 */
	function userAgent(userAgent = exports.DEFAULT_USER_AGENT) {
	    return (req, next) => {
	        if (!req.headers.has("User-Agent")) {
	            req.headers.set("User-Agent", userAgent);
	        }
	        return next();
	    };
	}
	exports.userAgent = userAgent;

	});

	unwrapExports(dist$1);
	dist$1.DEFAULT_USER_AGENT;
	dist$1.userAgent;

	var common = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.toFetch = void 0;
	/**
	 * Create a `fetch` like interface from middleware stack.
	 */
	function toFetch(middleware, Request) {
	    function done() {
	        throw new TypeError("Invalid middleware stack, missing transport function");
	    }
	    return function fetch(...args) {
	        const req = args.length === 1 && args[0] instanceof Request
	            ? args[0]
	            : new Request(...args);
	        return middleware(req, done);
	    };
	}
	exports.toFetch = toFetch;

	});

	unwrapExports(common);
	common.toFetch;

	var node = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fetch = exports.middleware = exports.userAgent = exports.transport = exports.Request = exports.redirects = exports.HttpResponse = exports.cookies = exports.contentEncoding = void 0;

	Object.defineProperty(exports, "Request", { enumerable: true, get: function () { return node$1.Request; } });


	Object.defineProperty(exports, "transport", { enumerable: true, get: function () { return dist$5.transport; } });
	Object.defineProperty(exports, "HttpResponse", { enumerable: true, get: function () { return dist$5.HttpResponse; } });

	Object.defineProperty(exports, "cookies", { enumerable: true, get: function () { return dist$4.cookies; } });

	Object.defineProperty(exports, "contentEncoding", { enumerable: true, get: function () { return dist$3.contentEncoding; } });

	Object.defineProperty(exports, "redirects", { enumerable: true, get: function () { return dist$2.redirects; } });

	Object.defineProperty(exports, "userAgent", { enumerable: true, get: function () { return dist$1.userAgent; } });

	__exportStar(common, exports);
	__exportStar(signal, exports);
	__exportStar(headers, exports);
	/**
	 * Node.js standard middleware stack.
	 */
	exports.middleware = dist$7.compose([
	    dist$1.userAgent(),
	    dist$3.contentEncoding(),
	    // Redirects must happen around cookie support.
	    dist$2.redirects(dist$7.compose([dist$4.cookies(), dist$5.transport()]))
	]);
	/**
	 * Standard node.js fetch interface.
	 */
	exports.fetch = common.toFetch(exports.middleware, node$1.Request);

	});

	unwrapExports(node);
	node.fetch;
	node.middleware;
	node.userAgent;
	node.transport;
	node.Request;
	node.redirects;
	node.HttpResponse;
	node.cookies;
	node.contentEncoding;

	var dist = createCommonjsModule(function (module, exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.middleware = exports.fetch = void 0;

	__exportStar(common, exports);
	__exportStar(signal, exports);
	__exportStar(headers, exports);
	exports.fetch = node.fetch;
	exports.middleware = node.middleware;

	});

	unwrapExports(dist);
	dist.middleware;
	dist.fetch;

	/**
	 * Make a request using node.
	 *
	 * @param   {string}  method
	 * @param   {string}  url
	 * @param   {string}  body
	 * @param   {Object}  headers
	 * @returns {Promise}
	 */
	var request = function request (method, url, body, headers) {
	  return dist.fetch(url, {
	    body: body,
	    method: method,
	    headers: headers
	  }).then(function (res) {
	    return res.text()
	      .then(body => {
	        return {
	          status: res.status,
	          body: body
	        }
	      })
	  })
	};

	var Buffer$1 = safeBuffer.Buffer;



	const DEFAULT_URL_BASE = 'https://example.org/';

	var btoa$1;
	if (typeof Buffer$1 === 'function') {
	  btoa$1 = btoaBuffer;
	} else {
	  btoa$1 = window.btoa.bind(window);
	}

	/**
	 * Export `ClientOAuth2` class.
	 */
	var clientOauth2 = ClientOAuth2;

	/**
	 * Default headers for executing OAuth 2.0 flows.
	 */
	var DEFAULT_HEADERS = {
	  Accept: 'application/json, application/x-www-form-urlencoded',
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	/**
	 * Format error response types to regular strings for displaying to clients.
	 *
	 * Reference: http://tools.ietf.org/html/rfc6749#section-4.1.2.1
	 */
	var ERROR_RESPONSES = {
	  invalid_request: [
	    'The request is missing a required parameter, includes an',
	    'invalid parameter value, includes a parameter more than',
	    'once, or is otherwise malformed.'
	  ].join(' '),
	  invalid_client: [
	    'Client authentication failed (e.g., unknown client, no',
	    'client authentication included, or unsupported',
	    'authentication method).'
	  ].join(' '),
	  invalid_grant: [
	    'The provided authorization grant (e.g., authorization',
	    'code, resource owner credentials) or refresh token is',
	    'invalid, expired, revoked, does not match the redirection',
	    'URI used in the authorization request, or was issued to',
	    'another client.'
	  ].join(' '),
	  unauthorized_client: [
	    'The client is not authorized to request an authorization',
	    'code using this method.'
	  ].join(' '),
	  unsupported_grant_type: [
	    'The authorization grant type is not supported by the',
	    'authorization server.'
	  ].join(' '),
	  access_denied: [
	    'The resource owner or authorization server denied the request.'
	  ].join(' '),
	  unsupported_response_type: [
	    'The authorization server does not support obtaining',
	    'an authorization code using this method.'
	  ].join(' '),
	  invalid_scope: [
	    'The requested scope is invalid, unknown, or malformed.'
	  ].join(' '),
	  server_error: [
	    'The authorization server encountered an unexpected',
	    'condition that prevented it from fulfilling the request.',
	    '(This error code is needed because a 500 Internal Server',
	    'Error HTTP status code cannot be returned to the client',
	    'via an HTTP redirect.)'
	  ].join(' '),
	  temporarily_unavailable: [
	    'The authorization server is currently unable to handle',
	    'the request due to a temporary overloading or maintenance',
	    'of the server.'
	  ].join(' ')
	};

	/**
	 * Support base64 in node like how it works in the browser.
	 *
	 * @param  {string} string
	 * @return {string}
	 */
	function btoaBuffer (string) {
	  return Buffer$1.from(string).toString('base64')
	}

	/**
	 * Check if properties exist on an object and throw when they aren't.
	 *
	 * @throws {TypeError} If an expected property is missing.
	 *
	 * @param {Object}    obj
	 * @param {...string} props
	 */
	function expects (obj) {
	  for (var i = 1; i < arguments.length; i++) {
	    var prop = arguments[i];

	    if (obj[prop] == null) {
	      throw new TypeError('Expected "' + prop + '" to exist')
	    }
	  }
	}

	/**
	 * Pull an authentication error from the response data.
	 *
	 * @param  {Object} data
	 * @return {string}
	 */
	function getAuthError (body) {
	  var message = ERROR_RESPONSES[body.error] ||
	    body.error_description ||
	    body.error;

	  if (message) {
	    var err = new Error(message);
	    err.body = body;
	    err.code = 'EAUTH';
	    return err
	  }
	}

	/**
	 * Attempt to parse response body as JSON, fall back to parsing as a query string.
	 *
	 * @param {string} body
	 * @return {Object}
	 */
	function parseResponseBody (body) {
	  try {
	    return JSON.parse(body)
	  } catch (e) {
	    return querystring__default["default"].parse(body)
	  }
	}

	/**
	 * Sanitize the scopes option to be a string.
	 *
	 * @param  {Array}  scopes
	 * @return {string}
	 */
	function sanitizeScope (scopes) {
	  return Array.isArray(scopes) ? scopes.join(' ') : toString$1(scopes)
	}

	/**
	 * Create a request uri based on an options object and token type.
	 *
	 * @param  {Object} options
	 * @param  {string} tokenType
	 * @return {string}
	 */
	function createUri (options, tokenType) {
	  // Check the required parameters are set.
	  expects(options, 'clientId', 'authorizationUri');

	  const qs = {
	    client_id: options.clientId,
	    redirect_uri: options.redirectUri,
	    response_type: tokenType,
	    state: options.state
	  };
	  if (options.scopes !== undefined) {
	    qs.scope = sanitizeScope(options.scopes);
	  }

	  const sep = options.authorizationUri.includes('?') ? '&' : '?';
	  return options.authorizationUri + sep + querystring__default["default"].stringify(
	    Object.assign(qs, options.query))
	}

	/**
	 * Create basic auth header.
	 *
	 * @param  {string} username
	 * @param  {string} password
	 * @return {string}
	 */
	function auth (username, password) {
	  return 'Basic ' + btoa$1(toString$1(username) + ':' + toString$1(password))
	}

	/**
	 * Ensure a value is a string.
	 *
	 * @param  {string} str
	 * @return {string}
	 */
	function toString$1 (str) {
	  return str == null ? '' : String(str)
	}

	/**
	 * Merge request options from an options object.
	 */
	function requestOptions (requestOptions, options) {
	  return {
	    url: requestOptions.url,
	    method: requestOptions.method,
	    body: Object.assign({}, requestOptions.body, options.body),
	    query: Object.assign({}, requestOptions.query, options.query),
	    headers: Object.assign({}, requestOptions.headers, options.headers)
	  }
	}

	/**
	 * Construct an object that can handle the multiple OAuth 2.0 flows.
	 *
	 * @param {Object} options
	 */
	function ClientOAuth2 (options, request$1) {
	  this.options = options;
	  this.request = request$1 || request;

	  this.code = new CodeFlow(this);
	  this.token = new TokenFlow(this);
	  this.owner = new OwnerFlow(this);
	  this.credentials = new CredentialsFlow(this);
	  this.jwt = new JwtBearerFlow(this);
	}

	/**
	 * Alias the token constructor.
	 *
	 * @type {Function}
	 */
	ClientOAuth2.Token = ClientOAuth2Token;

	/**
	 * Create a new token from existing data.
	 *
	 * @param  {string} access
	 * @param  {string} [refresh]
	 * @param  {string} [type]
	 * @param  {Object} [data]
	 * @return {Object}
	 */
	ClientOAuth2.prototype.createToken = function (access, refresh, type, data) {
	  var options = Object.assign(
	    {},
	    data,
	    typeof access === 'string' ? { access_token: access } : access,
	    typeof refresh === 'string' ? { refresh_token: refresh } : refresh,
	    typeof type === 'string' ? { token_type: type } : type
	  );

	  return new ClientOAuth2.Token(this, options)
	};

	/**
	 * Using the built-in request method, we'll automatically attempt to parse
	 * the response.
	 *
	 * @param  {Object}  options
	 * @return {Promise}
	 */
	ClientOAuth2.prototype._request = function (options) {
	  var url = options.url;
	  var body = querystring__default["default"].stringify(options.body);
	  var query = querystring__default["default"].stringify(options.query);

	  if (query) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + query;
	  }

	  return this.request(options.method, url, body, options.headers)
	    .then(function (res) {
	      var body = parseResponseBody(res.body);
	      var authErr = getAuthError(body);

	      if (authErr) {
	        return Promise.reject(authErr)
	      }

	      if (res.status < 200 || res.status >= 399) {
	        var statusErr = new Error('HTTP status ' + res.status);
	        statusErr.status = res.status;
	        statusErr.body = res.body;
	        statusErr.code = 'ESTATUS';
	        return Promise.reject(statusErr)
	      }

	      return body
	    })
	};

	/**
	 * General purpose client token generator.
	 *
	 * @param {Object} client
	 * @param {Object} data
	 */
	function ClientOAuth2Token (client, data) {
	  this.client = client;
	  this.data = data;
	  this.tokenType = data.token_type && data.token_type.toLowerCase();
	  this.accessToken = data.access_token;
	  this.refreshToken = data.refresh_token;

	  this.expiresIn(Number(data.expires_in));
	}

	/**
	 * Expire the token after some time.
	 *
	 * @param  {number|Date} duration Seconds from now to expire, or a date to expire on.
	 * @return {Date}
	 */
	ClientOAuth2Token.prototype.expiresIn = function (duration) {
	  if (typeof duration === 'number') {
	    this.expires = new Date();
	    this.expires.setSeconds(this.expires.getSeconds() + duration);
	  } else if (duration instanceof Date) {
	    this.expires = new Date(duration.getTime());
	  } else {
	    throw new TypeError('Unknown duration: ' + duration)
	  }

	  return this.expires
	};

	/**
	 * Sign a standardised request object with user authentication information.
	 *
	 * @param  {Object} requestObject
	 * @return {Object}
	 */
	ClientOAuth2Token.prototype.sign = function (requestObject) {
	  if (!this.accessToken) {
	    throw new Error('Unable to sign without access token')
	  }

	  requestObject.headers = requestObject.headers || {};

	  if (this.tokenType === 'bearer') {
	    requestObject.headers.Authorization = 'Bearer ' + this.accessToken;
	  } else {
	    var parts = requestObject.url.split('#');
	    var token = 'access_token=' + this.accessToken;
	    var url = parts[0].replace(/[?&]access_token=[^&#]/, '');
	    var fragment = parts[1] ? '#' + parts[1] : '';

	    // Prepend the correct query string parameter to the url.
	    requestObject.url = url + (url.indexOf('?') > -1 ? '&' : '?') + token + fragment;

	    // Attempt to avoid storing the url in proxies, since the access token
	    // is exposed in the query parameters.
	    requestObject.headers.Pragma = 'no-store';
	    requestObject.headers['Cache-Control'] = 'no-store';
	  }

	  return requestObject
	};

	/**
	 * Refresh a user access token with the supplied token.
	 *
	 * @param  {Object}  opts
	 * @return {Promise}
	 */
	ClientOAuth2Token.prototype.refresh = function (opts) {
	  var self = this;
	  var options = Object.assign({}, this.client.options, opts);

	  if (!this.refreshToken) {
	    return Promise.reject(new Error('No refresh token'))
	  }

	  return this.client._request(requestOptions({
	    url: options.accessTokenUri,
	    method: 'POST',
	    headers: Object.assign({}, DEFAULT_HEADERS, {
	      Authorization: auth(options.clientId, options.clientSecret)
	    }),
	    body: {
	      refresh_token: this.refreshToken,
	      grant_type: 'refresh_token'
	    }
	  }, options))
	    .then(function (data) {
	      return self.client.createToken(Object.assign({}, self.data, data))
	    })
	};

	/**
	 * Check whether the token has expired.
	 *
	 * @return {boolean}
	 */
	ClientOAuth2Token.prototype.expired = function () {
	  return Date.now() > this.expires.getTime()
	};

	/**
	 * Support resource owner password credentials OAuth 2.0 grant.
	 *
	 * Reference: http://tools.ietf.org/html/rfc6749#section-4.3
	 *
	 * @param {ClientOAuth2} client
	 */
	function OwnerFlow (client) {
	  this.client = client;
	}

	/**
	 * Make a request on behalf of the user credentials to get an access token.
	 *
	 * @param  {string}  username
	 * @param  {string}  password
	 * @param  {Object}  [opts]
	 * @return {Promise}
	 */
	OwnerFlow.prototype.getToken = function (username, password, opts) {
	  var self = this;
	  var options = Object.assign({}, this.client.options, opts);

	  const body = {
	    username: username,
	    password: password,
	    grant_type: 'password'
	  };
	  if (options.scopes !== undefined) {
	    body.scope = sanitizeScope(options.scopes);
	  }

	  return this.client._request(requestOptions({
	    url: options.accessTokenUri,
	    method: 'POST',
	    headers: Object.assign({}, DEFAULT_HEADERS, {
	      Authorization: auth(options.clientId, options.clientSecret)
	    }),
	    body: body
	  }, options))
	    .then(function (data) {
	      return self.client.createToken(data)
	    })
	};

	/**
	 * Support implicit OAuth 2.0 grant.
	 *
	 * Reference: http://tools.ietf.org/html/rfc6749#section-4.2
	 *
	 * @param {ClientOAuth2} client
	 */
	function TokenFlow (client) {
	  this.client = client;
	}

	/**
	 * Get the uri to redirect the user to for implicit authentication.
	 *
	 * @param  {Object} [opts]
	 * @return {string}
	 */
	TokenFlow.prototype.getUri = function (opts) {
	  var options = Object.assign({}, this.client.options, opts);

	  return createUri(options, 'token')
	};

	/**
	 * Get the user access token from the uri.
	 *
	 * @param  {string|Object} uri
	 * @param  {Object}        [opts]
	 * @return {Promise}
	 */
	TokenFlow.prototype.getToken = function (uri, opts) {
	  var options = Object.assign({}, this.client.options, opts);
	  var url = typeof uri === 'object' ? uri : new URL(uri, DEFAULT_URL_BASE);
	  var expectedUrl = new URL(options.redirectUri, DEFAULT_URL_BASE);

	  if (typeof url.pathname === 'string' && url.pathname !== expectedUrl.pathname) {
	    return Promise.reject(
	      new TypeError('Redirected path should match configured path, but got: ' + url.pathname)
	    )
	  }

	  // If no query string or fragment exists, we won't be able to parse
	  // any useful information from the uri.
	  if (!url.hash && !url.search) {
	    return Promise.reject(new TypeError('Unable to process uri: ' + uri))
	  }

	  // Extract data from both the fragment and query string. The fragment is most
	  // important, but the query string is also used because some OAuth 2.0
	  // implementations (Instagram) have a bug where state is passed via query.
	  var data = Object.assign(
	    {},
	    typeof url.search === 'string' ? querystring__default["default"].parse(url.search.substr(1)) : (url.search || {}),
	    typeof url.hash === 'string' ? querystring__default["default"].parse(url.hash.substr(1)) : (url.hash || {})
	  );

	  var err = getAuthError(data);

	  // Check if the query string was populated with a known error.
	  if (err) {
	    return Promise.reject(err)
	  }

	  // Check whether the state matches.
	  if (options.state != null && data.state !== options.state) {
	    return Promise.reject(new TypeError('Invalid state: ' + data.state))
	  }

	  // Initalize a new token and return.
	  return Promise.resolve(this.client.createToken(data))
	};

	/**
	 * Support client credentials OAuth 2.0 grant.
	 *
	 * Reference: http://tools.ietf.org/html/rfc6749#section-4.4
	 *
	 * @param {ClientOAuth2} client
	 */
	function CredentialsFlow (client) {
	  this.client = client;
	}

	/**
	 * Request an access token using the client credentials.
	 *
	 * @param  {Object}  [opts]
	 * @return {Promise}
	 */
	CredentialsFlow.prototype.getToken = function (opts) {
	  var self = this;
	  var options = Object.assign({}, this.client.options, opts);

	  expects(options, 'clientId', 'clientSecret', 'accessTokenUri');

	  const body = {
	    grant_type: 'client_credentials'
	  };

	  if (options.scopes !== undefined) {
	    body.scope = sanitizeScope(options.scopes);
	  }

	  return this.client._request(requestOptions({
	    url: options.accessTokenUri,
	    method: 'POST',
	    headers: Object.assign({}, DEFAULT_HEADERS, {
	      Authorization: auth(options.clientId, options.clientSecret)
	    }),
	    body: body
	  }, options))
	    .then(function (data) {
	      return self.client.createToken(data)
	    })
	};

	/**
	 * Support authorization code OAuth 2.0 grant.
	 *
	 * Reference: http://tools.ietf.org/html/rfc6749#section-4.1
	 *
	 * @param {ClientOAuth2} client
	 */
	function CodeFlow (client) {
	  this.client = client;
	}

	/**
	 * Generate the uri for doing the first redirect.
	 *
	 * @param  {Object} [opts]
	 * @return {string}
	 */
	CodeFlow.prototype.getUri = function (opts) {
	  var options = Object.assign({}, this.client.options, opts);

	  return createUri(options, 'code')
	};

	/**
	 * Get the code token from the redirected uri and make another request for
	 * the user access token.
	 *
	 * @param  {string|Object} uri
	 * @param  {Object}        [opts]
	 * @return {Promise}
	 */
	CodeFlow.prototype.getToken = function (uri, opts) {
	  var self = this;
	  var options = Object.assign({}, this.client.options, opts);

	  expects(options, 'clientId', 'accessTokenUri');

	  var url = typeof uri === 'object' ? uri : new URL(uri, DEFAULT_URL_BASE);

	  if (
	    typeof options.redirectUri === 'string' &&
	    typeof url.pathname === 'string' &&
	    url.pathname !== (new URL(options.redirectUri, DEFAULT_URL_BASE)).pathname
	  ) {
	    return Promise.reject(
	      new TypeError('Redirected path should match configured path, but got: ' + url.pathname)
	    )
	  }

	  if (!url.search || !url.search.substr(1)) {
	    return Promise.reject(new TypeError('Unable to process uri: ' + uri))
	  }

	  var data = typeof url.search === 'string'
	    ? querystring__default["default"].parse(url.search.substr(1))
	    : (url.search || {});
	  var err = getAuthError(data);

	  if (err) {
	    return Promise.reject(err)
	  }

	  if (options.state != null && data.state !== options.state) {
	    return Promise.reject(new TypeError('Invalid state: ' + data.state))
	  }

	  // Check whether the response code is set.
	  if (!data.code) {
	    return Promise.reject(new TypeError('Missing code, unable to request token'))
	  }

	  var headers = Object.assign({}, DEFAULT_HEADERS);
	  var body = { code: data.code, grant_type: 'authorization_code', redirect_uri: options.redirectUri };

	  // `client_id`: REQUIRED, if the client is not authenticating with the
	  // authorization server as described in Section 3.2.1.
	  // Reference: https://tools.ietf.org/html/rfc6749#section-3.2.1
	  if (options.clientSecret) {
	    headers.Authorization = auth(options.clientId, options.clientSecret);
	  } else {
	    body.client_id = options.clientId;
	  }

	  return this.client._request(requestOptions({
	    url: options.accessTokenUri,
	    method: 'POST',
	    headers: headers,
	    body: body
	  }, options))
	    .then(function (data) {
	      return self.client.createToken(data)
	    })
	};

	/**
	 * Support JSON Web Token (JWT) Bearer Token OAuth 2.0 grant.
	 *
	 * Reference: https://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-12#section-2.1
	 *
	 * @param {ClientOAuth2} client
	 */
	function JwtBearerFlow (client) {
	  this.client = client;
	}

	/**
	 * Request an access token using a JWT token.
	 *
	 * @param  {string} token     A JWT token.
	 * @param  {Object} [opts]
	 * @return {Promise}
	 */
	JwtBearerFlow.prototype.getToken = function (token, opts) {
	  var self = this;
	  var options = Object.assign({}, this.client.options, opts);
	  var headers = Object.assign({}, DEFAULT_HEADERS);

	  expects(options, 'accessTokenUri');

	  // Authentication of the client is optional, as described in
	  // Section 3.2.1 of OAuth 2.0 [RFC6749]
	  if (options.clientId) {
	    headers.Authorization = auth(options.clientId, options.clientSecret);
	  }

	  const body = {
	    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
	    assertion: token
	  };

	  if (options.scopes !== undefined) {
	    body.scope = sanitizeScope(options.scopes);
	  }

	  return this.client._request(requestOptions({
	    url: options.accessTokenUri,
	    method: 'POST',
	    headers: headers,
	    body: body
	  }, options))
	    .then(function (data) {
	      return self.client.createToken(data)
	    })
	};

	function e(e){this.message=e;}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw "Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e;}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */

	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];

	var parseuri = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');

	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }

	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;

	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }

	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }

	    uri.pathNames = pathNames(uri, uri['path']);
	    uri.queryKey = queryKey(uri, uri['query']);

	    return uri;
	};

	function pathNames(obj, path) {
	    var regx = /\/{2,9}/g,
	        names = path.replace(regx, "/").split("/");

	    if (path.substr(0, 1) == '/' || path.length === 0) {
	        names.splice(0, 1);
	    }
	    if (path.substr(path.length - 1, 1) == '/') {
	        names.splice(names.length - 1, 1);
	    }

	    return names;
	}

	function queryKey(uri, query) {
	    var data = {};

	    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
	        if ($1) {
	            data[$1] = $2;
	        }
	    });

	    return data;
	}

	/**
	 * URL parser.
	 *
	 * @param uri - url
	 * @param path - the request path of the connection
	 * @param loc - An object meant to mimic window.location.
	 *        Defaults to window.location.
	 * @public
	 */
	function url(uri, path = "", loc) {
	    let obj = uri;
	    // default to window.location
	    loc = loc || (typeof location !== "undefined" && location);
	    if (null == uri)
	        uri = loc.protocol + "//" + loc.host;
	    // relative path support
	    if (typeof uri === "string") {
	        if ("/" === uri.charAt(0)) {
	            if ("/" === uri.charAt(1)) {
	                uri = loc.protocol + uri;
	            }
	            else {
	                uri = loc.host + uri;
	            }
	        }
	        if (!/^(https?|wss?):\/\//.test(uri)) {
	            if ("undefined" !== typeof loc) {
	                uri = loc.protocol + "//" + uri;
	            }
	            else {
	                uri = "https://" + uri;
	            }
	        }
	        // parse
	        obj = parseuri(uri);
	    }
	    // make sure we treat `localhost:80` and `localhost` equally
	    if (!obj.port) {
	        if (/^(http|ws)$/.test(obj.protocol)) {
	            obj.port = "80";
	        }
	        else if (/^(http|ws)s$/.test(obj.protocol)) {
	            obj.port = "443";
	        }
	    }
	    obj.path = obj.path || "/";
	    const ipv6 = obj.host.indexOf(":") !== -1;
	    const host = ipv6 ? "[" + obj.host + "]" : obj.host;
	    // define unique id
	    obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
	    // define href
	    obj.href =
	        obj.protocol +
	            "://" +
	            host +
	            (loc && loc.port === obj.port ? "" : ":" + obj.port);
	    return obj;
	}

	/**
	 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
	 *
	 * This can be used with JS designed for browsers to improve reuse of code and
	 * allow the use of existing libraries.
	 *
	 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
	 *
	 * @author Dan DeFelippi <dan@driverdan.com>
	 * @contributor David Ellis <d.f.ellis@ieee.org>
	 * @license MIT
	 */



	var spawn = child_process__default["default"].spawn;

	/**
	 * Module exports.
	 */

	var XMLHttpRequest_1 = XMLHttpRequest$1;

	// backwards-compat
	XMLHttpRequest$1.XMLHttpRequest = XMLHttpRequest$1;

	/**
	 * `XMLHttpRequest` constructor.
	 *
	 * Supported options for the `opts` object are:
	 *
	 *  - `agent`: An http.Agent instance; http.globalAgent may be used; if 'undefined', agent usage is disabled
	 *
	 * @param {Object} opts optional "options" object
	 */

	function XMLHttpRequest$1(opts) {

	  opts = opts || {};

	  /**
	   * Private variables
	   */
	  var self = this;
	  var http = http__default["default"];
	  var https = https__default["default"];

	  // Holds http.js objects
	  var request;
	  var response;

	  // Request settings
	  var settings = {};

	  // Disable header blacklist.
	  // Not part of XHR specs.
	  var disableHeaderCheck = false;

	  // Set some default headers
	  var defaultHeaders = {
	    "User-Agent": "node-XMLHttpRequest",
	    "Accept": "*/*"
	  };

	  var headers = Object.assign({}, defaultHeaders);

	  // These headers are not user setable.
	  // The following are allowed but banned in the spec:
	  // * user-agent
	  var forbiddenRequestHeaders = [
	    "accept-charset",
	    "accept-encoding",
	    "access-control-request-headers",
	    "access-control-request-method",
	    "connection",
	    "content-length",
	    "content-transfer-encoding",
	    "cookie",
	    "cookie2",
	    "date",
	    "expect",
	    "host",
	    "keep-alive",
	    "origin",
	    "referer",
	    "te",
	    "trailer",
	    "transfer-encoding",
	    "upgrade",
	    "via"
	  ];

	  // These request methods are not allowed
	  var forbiddenRequestMethods = [
	    "TRACE",
	    "TRACK",
	    "CONNECT"
	  ];

	  // Send flag
	  var sendFlag = false;
	  // Error flag, used when errors occur or abort is called
	  var errorFlag = false;
	  var abortedFlag = false;

	  // Event listeners
	  var listeners = {};

	  /**
	   * Constants
	   */

	  this.UNSENT = 0;
	  this.OPENED = 1;
	  this.HEADERS_RECEIVED = 2;
	  this.LOADING = 3;
	  this.DONE = 4;

	  /**
	   * Public vars
	   */

	  // Current state
	  this.readyState = this.UNSENT;

	  // default ready state change handler in case one is not set or is set late
	  this.onreadystatechange = null;

	  // Result & response
	  this.responseText = "";
	  this.responseXML = "";
	  this.status = null;
	  this.statusText = null;

	  /**
	   * Private methods
	   */

	  /**
	   * Check if the specified header is allowed.
	   *
	   * @param string header Header to validate
	   * @return boolean False if not allowed, otherwise true
	   */
	  var isAllowedHttpHeader = function(header) {
	    return disableHeaderCheck || (header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1);
	  };

	  /**
	   * Check if the specified method is allowed.
	   *
	   * @param string method Request method to validate
	   * @return boolean False if not allowed, otherwise true
	   */
	  var isAllowedHttpMethod = function(method) {
	    return (method && forbiddenRequestMethods.indexOf(method) === -1);
	  };

	  /**
	   * Public methods
	   */

	  /**
	   * Open the connection. Currently supports local server requests.
	   *
	   * @param string method Connection method (eg GET, POST)
	   * @param string url URL for the connection.
	   * @param boolean async Asynchronous connection. Default is true.
	   * @param string user Username for basic authentication (optional)
	   * @param string password Password for basic authentication (optional)
	   */
	  this.open = function(method, url, async, user, password) {
	    this.abort();
	    errorFlag = false;
	    abortedFlag = false;

	    // Check for valid request method
	    if (!isAllowedHttpMethod(method)) {
	      throw new Error("SecurityError: Request method not allowed");
	    }

	    settings = {
	      "method": method,
	      "url": url.toString(),
	      "async": (typeof async !== "boolean" ? true : async),
	      "user": user || null,
	      "password": password || null
	    };

	    setState(this.OPENED);
	  };

	  /**
	   * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
	   * This does not conform to the W3C spec.
	   *
	   * @param boolean state Enable or disable header checking.
	   */
	  this.setDisableHeaderCheck = function(state) {
	    disableHeaderCheck = state;
	  };

	  /**
	   * Sets a header for the request.
	   *
	   * @param string header Header name
	   * @param string value Header value
	   * @return boolean Header added
	   */
	  this.setRequestHeader = function(header, value) {
	    if (this.readyState != this.OPENED) {
	      throw new Error("INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN");
	    }
	    if (!isAllowedHttpHeader(header)) {
	      console.warn('Refused to set unsafe header "' + header + '"');
	      return false;
	    }
	    if (sendFlag) {
	      throw new Error("INVALID_STATE_ERR: send flag is true");
	    }
	    headers[header] = value;
	    return true;
	  };

	  /**
	   * Gets a header from the server response.
	   *
	   * @param string header Name of header to get.
	   * @return string Text of the header or null if it doesn't exist.
	   */
	  this.getResponseHeader = function(header) {
	    if (typeof header === "string"
	      && this.readyState > this.OPENED
	      && response.headers[header.toLowerCase()]
	      && !errorFlag
	    ) {
	      return response.headers[header.toLowerCase()];
	    }

	    return null;
	  };

	  /**
	   * Gets all the response headers.
	   *
	   * @return string A string with all response headers separated by CR+LF
	   */
	  this.getAllResponseHeaders = function() {
	    if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
	      return "";
	    }
	    var result = "";

	    for (var i in response.headers) {
	      // Cookie headers are excluded
	      if (i !== "set-cookie" && i !== "set-cookie2") {
	        result += i + ": " + response.headers[i] + "\r\n";
	      }
	    }
	    return result.substr(0, result.length - 2);
	  };

	  /**
	   * Gets a request header
	   *
	   * @param string name Name of header to get
	   * @return string Returns the request header or empty string if not set
	   */
	  this.getRequestHeader = function(name) {
	    // @TODO Make this case insensitive
	    if (typeof name === "string" && headers[name]) {
	      return headers[name];
	    }

	    return "";
	  };

	  /**
	   * Sends the request to the server.
	   *
	   * @param string data Optional data to send as request body.
	   */
	  this.send = function(data) {
	    if (this.readyState != this.OPENED) {
	      throw new Error("INVALID_STATE_ERR: connection must be opened before send() is called");
	    }

	    if (sendFlag) {
	      throw new Error("INVALID_STATE_ERR: send has already been called");
	    }

	    var ssl = false, local = false;
	    var url = url__default["default"].parse(settings.url);
	    var host;
	    // Determine the server
	    switch (url.protocol) {
	      case 'https:':
	        ssl = true;
	        // SSL & non-SSL both need host, no break here.
	      case 'http:':
	        host = url.hostname;
	        break;

	      case 'file:':
	        local = true;
	        break;

	      case undefined:
	      case '':
	        host = "localhost";
	        break;

	      default:
	        throw new Error("Protocol not supported.");
	    }

	    // Load files off the local filesystem (file://)
	    if (local) {
	      if (settings.method !== "GET") {
	        throw new Error("XMLHttpRequest: Only GET method is supported");
	      }

	      if (settings.async) {
	        fs__default["default"].readFile(unescape(url.pathname), 'utf8', function(error, data) {
	          if (error) {
	            self.handleError(error, error.errno || -1);
	          } else {
	            self.status = 200;
	            self.responseText = data;
	            setState(self.DONE);
	          }
	        });
	      } else {
	        try {
	          this.responseText = fs__default["default"].readFileSync(unescape(url.pathname), 'utf8');
	          this.status = 200;
	          setState(self.DONE);
	        } catch(e) {
	          this.handleError(e, e.errno || -1);
	        }
	      }

	      return;
	    }

	    // Default to port 80. If accessing localhost on another port be sure
	    // to use http://localhost:port/path
	    var port = url.port || (ssl ? 443 : 80);
	    // Add query string if one is used
	    var uri = url.pathname + (url.search ? url.search : '');

	    // Set the Host header or the server may reject the request
	    headers["Host"] = host;
	    if (!((ssl && port === 443) || port === 80)) {
	      headers["Host"] += ':' + url.port;
	    }

	    // Set Basic Auth if necessary
	    if (settings.user) {
	      if (typeof settings.password == "undefined") {
	        settings.password = "";
	      }
	      var authBuf = new Buffer(settings.user + ":" + settings.password);
	      headers["Authorization"] = "Basic " + authBuf.toString("base64");
	    }

	    // Set content length header
	    if (settings.method === "GET" || settings.method === "HEAD") {
	      data = null;
	    } else if (data) {
	      headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);

	      if (!headers["Content-Type"]) {
	        headers["Content-Type"] = "text/plain;charset=UTF-8";
	      }
	    } else if (settings.method === "POST") {
	      // For a post with no data set Content-Length: 0.
	      // This is required by buggy servers that don't meet the specs.
	      headers["Content-Length"] = 0;
	    }

	    var agent = opts.agent || false;
	    var options = {
	      host: host,
	      port: port,
	      path: uri,
	      method: settings.method,
	      headers: headers,
	      agent: agent
	    };

	    if (ssl) {
	      options.pfx = opts.pfx;
	      options.key = opts.key;
	      options.passphrase = opts.passphrase;
	      options.cert = opts.cert;
	      options.ca = opts.ca;
	      options.ciphers = opts.ciphers;
	      options.rejectUnauthorized = opts.rejectUnauthorized === false ? false : true;
	    }

	    // Reset error flag
	    errorFlag = false;
	    // Handle async requests
	    if (settings.async) {
	      // Use the proper protocol
	      var doRequest = ssl ? https.request : http.request;

	      // Request is being sent, set send flag
	      sendFlag = true;

	      // As per spec, this is called here for historical reasons.
	      self.dispatchEvent("readystatechange");

	      // Handler for the response
	      var responseHandler = function(resp) {
	        // Set response var to the response we got back
	        // This is so it remains accessable outside this scope
	        response = resp;
	        // Check for redirect
	        // @TODO Prevent looped redirects
	        if (response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
	          // Change URL to the redirect location
	          settings.url = response.headers.location;
	          var url = url__default["default"].parse(settings.url);
	          // Set host var in case it's used later
	          host = url.hostname;
	          // Options for the new request
	          var newOptions = {
	            hostname: url.hostname,
	            port: url.port,
	            path: url.path,
	            method: response.statusCode === 303 ? 'GET' : settings.method,
	            headers: headers
	          };

	          if (ssl) {
	            newOptions.pfx = opts.pfx;
	            newOptions.key = opts.key;
	            newOptions.passphrase = opts.passphrase;
	            newOptions.cert = opts.cert;
	            newOptions.ca = opts.ca;
	            newOptions.ciphers = opts.ciphers;
	            newOptions.rejectUnauthorized = opts.rejectUnauthorized === false ? false : true;
	          }

	          // Issue the new request
	          request = doRequest(newOptions, responseHandler).on('error', errorHandler);
	          request.end();
	          // @TODO Check if an XHR event needs to be fired here
	          return;
	        }

	        if (response && response.setEncoding) {
	          response.setEncoding("utf8");
	        }

	        setState(self.HEADERS_RECEIVED);
	        self.status = response.statusCode;

	        response.on('data', function(chunk) {
	          // Make sure there's some data
	          if (chunk) {
	            self.responseText += chunk;
	          }
	          // Don't emit state changes if the connection has been aborted.
	          if (sendFlag) {
	            setState(self.LOADING);
	          }
	        });

	        response.on('end', function() {
	          if (sendFlag) {
	            // The sendFlag needs to be set before setState is called.  Otherwise if we are chaining callbacks
	            // there can be a timing issue (the callback is called and a new call is made before the flag is reset).
	            sendFlag = false;
	            // Discard the 'end' event if the connection has been aborted
	            setState(self.DONE);
	          }
	        });

	        response.on('error', function(error) {
	          self.handleError(error);
	        });
	      };

	      // Error handler for the request
	      var errorHandler = function(error) {
	        self.handleError(error);
	      };

	      // Create the request
	      request = doRequest(options, responseHandler).on('error', errorHandler);

	      if (opts.autoUnref) {
	        request.on('socket', (socket) => {
	          socket.unref();
	        });
	      }

	      // Node 0.4 and later won't accept empty data. Make sure it's needed.
	      if (data) {
	        request.write(data);
	      }

	      request.end();

	      self.dispatchEvent("loadstart");
	    } else { // Synchronous
	      // Create a temporary file for communication with the other Node process
	      var contentFile = ".node-xmlhttprequest-content-" + process.pid;
	      var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
	      fs__default["default"].writeFileSync(syncFile, "", "utf8");
	      // The async request the other Node process executes
	      var execString = "var http = require('http'), https = require('https'), fs = require('fs');"
	        + "var doRequest = http" + (ssl ? "s" : "") + ".request;"
	        + "var options = " + JSON.stringify(options) + ";"
	        + "var responseText = '';"
	        + "var req = doRequest(options, function(response) {"
	        + "response.setEncoding('utf8');"
	        + "response.on('data', function(chunk) {"
	        + "  responseText += chunk;"
	        + "});"
	        + "response.on('end', function() {"
	        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-STATUS:' + response.statusCode + ',' + responseText, 'utf8');"
	        + "fs.unlinkSync('" + syncFile + "');"
	        + "});"
	        + "response.on('error', function(error) {"
	        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
	        + "fs.unlinkSync('" + syncFile + "');"
	        + "});"
	        + "}).on('error', function(error) {"
	        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
	        + "fs.unlinkSync('" + syncFile + "');"
	        + "});"
	        + (data ? "req.write('" + JSON.stringify(data).slice(1,-1).replace(/'/g, "\\'") + "');":"")
	        + "req.end();";
	      // Start the other Node Process, executing this string
	      var syncProc = spawn(process.argv[0], ["-e", execString]);
	      while(fs__default["default"].existsSync(syncFile)) {
	        // Wait while the sync file is empty
	      }
	      self.responseText = fs__default["default"].readFileSync(contentFile, 'utf8');
	      // Kill the child process once the file has data
	      syncProc.stdin.end();
	      // Remove the temporary file
	      fs__default["default"].unlinkSync(contentFile);
	      if (self.responseText.match(/^NODE-XMLHTTPREQUEST-ERROR:/)) {
	        // If the file returned an error, handle it
	        var errorObj = self.responseText.replace(/^NODE-XMLHTTPREQUEST-ERROR:/, "");
	        self.handleError(errorObj, 503);
	      } else {
	        // If the file returned okay, parse its data and move to the DONE state
	        self.status = self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:([0-9]*),.*/, "$1");
	        self.responseText = self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:[0-9]*,(.*)/, "$1");
	        setState(self.DONE);
	      }
	    }
	  };

	  /**
	   * Called when an error is encountered to deal with it.
	   * @param  status  {number}    HTTP status code to use rather than the default (0) for XHR errors.
	   */
	  this.handleError = function(error, status) {
	    this.status = status || 0;
	    this.statusText = error;
	    this.responseText = error.stack;
	    errorFlag = true;
	    setState(this.DONE);
	  };

	  /**
	   * Aborts a request.
	   */
	  this.abort = function() {
	    if (request) {
	      request.abort();
	      request = null;
	    }

	    headers = Object.assign({}, defaultHeaders);
	    this.responseText = "";
	    this.responseXML = "";

	    errorFlag = abortedFlag = true;
	    if (this.readyState !== this.UNSENT
	        && (this.readyState !== this.OPENED || sendFlag)
	        && this.readyState !== this.DONE) {
	      sendFlag = false;
	      setState(this.DONE);
	    }
	    this.readyState = this.UNSENT;
	  };

	  /**
	   * Adds an event listener. Preferred method of binding to events.
	   */
	  this.addEventListener = function(event, callback) {
	    if (!(event in listeners)) {
	      listeners[event] = [];
	    }
	    // Currently allows duplicate callbacks. Should it?
	    listeners[event].push(callback);
	  };

	  /**
	   * Remove an event callback that has already been bound.
	   * Only works on the matching funciton, cannot be a copy.
	   */
	  this.removeEventListener = function(event, callback) {
	    if (event in listeners) {
	      // Filter will return a new array with the callback removed
	      listeners[event] = listeners[event].filter(function(ev) {
	        return ev !== callback;
	      });
	    }
	  };

	  /**
	   * Dispatch any events, including both "on" methods and events attached using addEventListener.
	   */
	  this.dispatchEvent = function(event) {
	    if (typeof self["on" + event] === "function") {
	      if (this.readyState === this.DONE)
	        setImmediate(function() { self["on" + event](); });
	      else
	        self["on" + event]();
	    }
	    if (event in listeners) {
	      for (let i = 0, len = listeners[event].length; i < len; i++) {
	        if (this.readyState === this.DONE)
	          setImmediate(function() { listeners[event][i].call(self); });
	        else
	          listeners[event][i].call(self);
	      }
	    }
	  };

	  /**
	   * Changes readyState and calls onreadystatechange.
	   *
	   * @param int state New state
	   */
	  var setState = function(state) {
	    if ((self.readyState === state) || (self.readyState === self.UNSENT && abortedFlag))
	      return

	    self.readyState = state;

	    if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
	      self.dispatchEvent("readystatechange");
	    }

	    if (self.readyState === self.DONE) {
	      let fire;

	      if (abortedFlag)
	        fire = "abort";
	      else if (errorFlag)
	        fire = "error";
	      else
	        fire = "load";

	      self.dispatchEvent(fire);

	      // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
	      self.dispatchEvent("loadend");
	    }
	  };
	}

	var XMLHttpRequestModule = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': XMLHttpRequest_1,
		__moduleExports: XMLHttpRequest_1
	});

	const XMLHttpRequest = XMLHttpRequest_1 || XMLHttpRequestModule;

	var globalThis$1 = global;

	function pick(obj, ...attr) {
	    return attr.reduce((acc, k) => {
	        if (obj.hasOwnProperty(k)) {
	            acc[k] = obj[k];
	        }
	        return acc;
	    }, {});
	}
	// Keep a reference to the real timeout functions so they can be used when overridden
	const NATIVE_SET_TIMEOUT = setTimeout;
	const NATIVE_CLEAR_TIMEOUT = clearTimeout;
	function installTimerFunctions(obj, opts) {
	    if (opts.useNativeTimers) {
	        obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThis$1);
	        obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThis$1);
	    }
	    else {
	        obj.setTimeoutFn = setTimeout.bind(globalThis$1);
	        obj.clearTimeoutFn = clearTimeout.bind(globalThis$1);
	    }
	}

	/**
	 * Expose `Emitter`.
	 */

	var Emitter_1 = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	}

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }

	  // Remove event specific arrays for event types that no
	  // one is subscribed for to avoid memory leak.
	  if (callbacks.length === 0) {
	    delete this._callbacks['$' + event];
	  }

	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};

	  var args = new Array(arguments.length - 1)
	    , callbacks = this._callbacks['$' + event];

	  for (var i = 1; i < arguments.length; i++) {
	    args[i - 1] = arguments[i];
	  }

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	// alias used for reserved events (protected method)
	Emitter.prototype.emitReserved = Emitter.prototype.emit;

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};

	const PACKET_TYPES = Object.create(null); // no Map = no polyfill
	PACKET_TYPES["open"] = "0";
	PACKET_TYPES["close"] = "1";
	PACKET_TYPES["ping"] = "2";
	PACKET_TYPES["pong"] = "3";
	PACKET_TYPES["message"] = "4";
	PACKET_TYPES["upgrade"] = "5";
	PACKET_TYPES["noop"] = "6";
	const PACKET_TYPES_REVERSE = Object.create(null);
	Object.keys(PACKET_TYPES).forEach(key => {
	    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
	});
	const ERROR_PACKET = { type: "error", data: "parser error" };

	const encodePacket = ({ type, data }, supportsBinary, callback) => {
	    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
	        const buffer = toBuffer$2(data);
	        return callback(encodeBuffer(buffer, supportsBinary));
	    }
	    // plain string
	    return callback(PACKET_TYPES[type] + (data || ""));
	};
	const toBuffer$2 = data => {
	    if (Buffer.isBuffer(data)) {
	        return data;
	    }
	    else if (data instanceof ArrayBuffer) {
	        return Buffer.from(data);
	    }
	    else {
	        return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
	    }
	};
	// only 'message' packets can contain binary, so the type prefix is not needed
	const encodeBuffer = (data, supportsBinary) => {
	    return supportsBinary ? data : "b" + data.toString("base64");
	};

	const decodePacket = (encodedPacket, binaryType) => {
	    if (typeof encodedPacket !== "string") {
	        return {
	            type: "message",
	            data: mapBinary(encodedPacket, binaryType)
	        };
	    }
	    const type = encodedPacket.charAt(0);
	    if (type === "b") {
	        const buffer = Buffer.from(encodedPacket.substring(1), "base64");
	        return {
	            type: "message",
	            data: mapBinary(buffer, binaryType)
	        };
	    }
	    if (!PACKET_TYPES_REVERSE[type]) {
	        return ERROR_PACKET;
	    }
	    return encodedPacket.length > 1
	        ? {
	            type: PACKET_TYPES_REVERSE[type],
	            data: encodedPacket.substring(1)
	        }
	        : {
	            type: PACKET_TYPES_REVERSE[type]
	        };
	};
	const mapBinary = (data, binaryType) => {
	    const isBuffer = Buffer.isBuffer(data);
	    switch (binaryType) {
	        case "arraybuffer":
	            return isBuffer ? toArrayBuffer$1(data) : data;
	        case "nodebuffer":
	        default:
	            return data; // assuming the data is already a Buffer
	    }
	};
	const toArrayBuffer$1 = (buffer) => {
	    const arrayBuffer = new ArrayBuffer(buffer.length);
	    const view = new Uint8Array(arrayBuffer);
	    for (let i = 0; i < buffer.length; i++) {
	        view[i] = buffer[i];
	    }
	    return arrayBuffer;
	};

	const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
	const encodePayload = (packets, callback) => {
	    // some packets may be added to the array while encoding, so the initial length must be saved
	    const length = packets.length;
	    const encodedPackets = new Array(length);
	    let count = 0;
	    packets.forEach((packet, i) => {
	        // force base64 encoding for binary packets
	        encodePacket(packet, false, encodedPacket => {
	            encodedPackets[i] = encodedPacket;
	            if (++count === length) {
	                callback(encodedPackets.join(SEPARATOR));
	            }
	        });
	    });
	};
	const decodePayload = (encodedPayload, binaryType) => {
	    const encodedPackets = encodedPayload.split(SEPARATOR);
	    const packets = [];
	    for (let i = 0; i < encodedPackets.length; i++) {
	        const decodedPacket = decodePacket(encodedPackets[i], binaryType);
	        packets.push(decodedPacket);
	        if (decodedPacket.type === "error") {
	            break;
	        }
	    }
	    return packets;
	};
	const protocol$1 = 4;

	class Transport extends Emitter_1 {
	    /**
	     * Transport abstract constructor.
	     *
	     * @param {Object} options.
	     * @api private
	     */
	    constructor(opts) {
	        super();
	        this.writable = false;
	        installTimerFunctions(this, opts);
	        this.opts = opts;
	        this.query = opts.query;
	        this.readyState = "";
	        this.socket = opts.socket;
	    }
	    /**
	     * Emits an error.
	     *
	     * @param {String} str
	     * @return {Transport} for chaining
	     * @api protected
	     */
	    onError(msg, desc) {
	        const err = new Error(msg);
	        // @ts-ignore
	        err.type = "TransportError";
	        // @ts-ignore
	        err.description = desc;
	        super.emit("error", err);
	        return this;
	    }
	    /**
	     * Opens the transport.
	     *
	     * @api public
	     */
	    open() {
	        if ("closed" === this.readyState || "" === this.readyState) {
	            this.readyState = "opening";
	            this.doOpen();
	        }
	        return this;
	    }
	    /**
	     * Closes the transport.
	     *
	     * @api public
	     */
	    close() {
	        if ("opening" === this.readyState || "open" === this.readyState) {
	            this.doClose();
	            this.onClose();
	        }
	        return this;
	    }
	    /**
	     * Sends multiple packets.
	     *
	     * @param {Array} packets
	     * @api public
	     */
	    send(packets) {
	        if ("open" === this.readyState) {
	            this.write(packets);
	        }
	    }
	    /**
	     * Called upon open
	     *
	     * @api protected
	     */
	    onOpen() {
	        this.readyState = "open";
	        this.writable = true;
	        super.emit("open");
	    }
	    /**
	     * Called with data.
	     *
	     * @param {String} data
	     * @api protected
	     */
	    onData(data) {
	        const packet = decodePacket(data, this.socket.binaryType);
	        this.onPacket(packet);
	    }
	    /**
	     * Called with a decoded packet.
	     *
	     * @api protected
	     */
	    onPacket(packet) {
	        super.emit("packet", packet);
	    }
	    /**
	     * Called upon close.
	     *
	     * @api protected
	     */
	    onClose() {
	        this.readyState = "closed";
	        super.emit("close");
	    }
	}

	var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
	  , length = 64
	  , map = {}
	  , seed = 0
	  , i = 0
	  , prev;

	/**
	 * Return a string representing the specified number.
	 *
	 * @param {Number} num The number to convert.
	 * @returns {String} The string representation of the number.
	 * @api public
	 */
	function encode$1(num) {
	  var encoded = '';

	  do {
	    encoded = alphabet[num % length] + encoded;
	    num = Math.floor(num / length);
	  } while (num > 0);

	  return encoded;
	}

	/**
	 * Return the integer value specified by the given string.
	 *
	 * @param {String} str The string to convert.
	 * @returns {Number} The integer value represented by the string.
	 * @api public
	 */
	function decode$1(str) {
	  var decoded = 0;

	  for (i = 0; i < str.length; i++) {
	    decoded = decoded * length + map[str.charAt(i)];
	  }

	  return decoded;
	}

	/**
	 * Yeast: A tiny growing id generator.
	 *
	 * @returns {String} A unique id.
	 * @api public
	 */
	function yeast() {
	  var now = encode$1(+new Date());

	  if (now !== prev) return seed = 0, prev = now;
	  return now +'.'+ encode$1(seed++);
	}

	//
	// Map each character to its index.
	//
	for (; i < length; i++) map[alphabet[i]] = i;

	//
	// Expose the `yeast`, `encode` and `decode` functions.
	//
	yeast.encode = encode$1;
	yeast.decode = decode$1;
	var yeast_1 = yeast;

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */

	var encode = function (obj) {
	  var str = '';

	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }

	  return str;
	};

	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */

	var decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};

	var parseqs = {
		encode: encode,
		decode: decode
	};

	class Polling extends Transport {
	    constructor() {
	        super(...arguments);
	        this.polling = false;
	    }
	    /**
	     * Transport name.
	     */
	    get name() {
	        return "polling";
	    }
	    /**
	     * Opens the socket (triggers polling). We write a PING message to determine
	     * when the transport is open.
	     *
	     * @api private
	     */
	    doOpen() {
	        this.poll();
	    }
	    /**
	     * Pauses polling.
	     *
	     * @param {Function} callback upon buffers are flushed and transport is paused
	     * @api private
	     */
	    pause(onPause) {
	        this.readyState = "pausing";
	        const pause = () => {
	            this.readyState = "paused";
	            onPause();
	        };
	        if (this.polling || !this.writable) {
	            let total = 0;
	            if (this.polling) {
	                total++;
	                this.once("pollComplete", function () {
	                    --total || pause();
	                });
	            }
	            if (!this.writable) {
	                total++;
	                this.once("drain", function () {
	                    --total || pause();
	                });
	            }
	        }
	        else {
	            pause();
	        }
	    }
	    /**
	     * Starts polling cycle.
	     *
	     * @api public
	     */
	    poll() {
	        this.polling = true;
	        this.doPoll();
	        this.emit("poll");
	    }
	    /**
	     * Overloads onData to detect payloads.
	     *
	     * @api private
	     */
	    onData(data) {
	        const callback = packet => {
	            // if its the first message we consider the transport open
	            if ("opening" === this.readyState && packet.type === "open") {
	                this.onOpen();
	            }
	            // if its a close packet, we close the ongoing requests
	            if ("close" === packet.type) {
	                this.onClose();
	                return false;
	            }
	            // otherwise bypass onData and handle the message
	            this.onPacket(packet);
	        };
	        // decode payload
	        decodePayload(data, this.socket.binaryType).forEach(callback);
	        // if an event did not trigger closing
	        if ("closed" !== this.readyState) {
	            // if we got data we're not polling
	            this.polling = false;
	            this.emit("pollComplete");
	            if ("open" === this.readyState) {
	                this.poll();
	            }
	        }
	    }
	    /**
	     * For polling, send a close packet.
	     *
	     * @api private
	     */
	    doClose() {
	        const close = () => {
	            this.write([{ type: "close" }]);
	        };
	        if ("open" === this.readyState) {
	            close();
	        }
	        else {
	            // in case we're trying to close while
	            // handshaking is in progress (GH-164)
	            this.once("open", close);
	        }
	    }
	    /**
	     * Writes a packets payload.
	     *
	     * @param {Array} data packets
	     * @param {Function} drain callback
	     * @api private
	     */
	    write(packets) {
	        this.writable = false;
	        encodePayload(packets, data => {
	            this.doWrite(data, () => {
	                this.writable = true;
	                this.emit("drain");
	            });
	        });
	    }
	    /**
	     * Generates uri for connection.
	     *
	     * @api private
	     */
	    uri() {
	        let query = this.query || {};
	        const schema = this.opts.secure ? "https" : "http";
	        let port = "";
	        // cache busting is forced
	        if (false !== this.opts.timestampRequests) {
	            query[this.opts.timestampParam] = yeast_1();
	        }
	        if (!this.supportsBinary && !query.sid) {
	            query.b64 = 1;
	        }
	        // avoid port if default for schema
	        if (this.opts.port &&
	            (("https" === schema && Number(this.opts.port) !== 443) ||
	                ("http" === schema && Number(this.opts.port) !== 80))) {
	            port = ":" + this.opts.port;
	        }
	        const encodedQuery = parseqs.encode(query);
	        const ipv6 = this.opts.hostname.indexOf(":") !== -1;
	        return (schema +
	            "://" +
	            (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
	            port +
	            this.opts.path +
	            (encodedQuery.length ? "?" + encodedQuery : ""));
	    }
	}

	/* global attachEvent */
	/**
	 * Empty function
	 */
	function empty() { }
	const hasXHR2 = (function () {
	    const xhr = new XMLHttpRequest({
	        xdomain: false
	    });
	    return null != xhr.responseType;
	})();
	class XHR extends Polling {
	    /**
	     * XHR Polling constructor.
	     *
	     * @param {Object} opts
	     * @api public
	     */
	    constructor(opts) {
	        super(opts);
	        if (typeof location !== "undefined") {
	            const isSSL = "https:" === location.protocol;
	            let port = location.port;
	            // some user agents have empty `location.port`
	            if (!port) {
	                port = isSSL ? "443" : "80";
	            }
	            this.xd =
	                (typeof location !== "undefined" &&
	                    opts.hostname !== location.hostname) ||
	                    port !== opts.port;
	            this.xs = opts.secure !== isSSL;
	        }
	        /**
	         * XHR supports binary
	         */
	        const forceBase64 = opts && opts.forceBase64;
	        this.supportsBinary = hasXHR2 && !forceBase64;
	    }
	    /**
	     * Creates a request.
	     *
	     * @param {String} method
	     * @api private
	     */
	    request(opts = {}) {
	        Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
	        return new Request(this.uri(), opts);
	    }
	    /**
	     * Sends data.
	     *
	     * @param {String} data to send.
	     * @param {Function} called upon flush.
	     * @api private
	     */
	    doWrite(data, fn) {
	        const req = this.request({
	            method: "POST",
	            data: data
	        });
	        req.on("success", fn);
	        req.on("error", err => {
	            this.onError("xhr post error", err);
	        });
	    }
	    /**
	     * Starts a poll cycle.
	     *
	     * @api private
	     */
	    doPoll() {
	        const req = this.request();
	        req.on("data", this.onData.bind(this));
	        req.on("error", err => {
	            this.onError("xhr poll error", err);
	        });
	        this.pollXhr = req;
	    }
	}
	class Request extends Emitter_1 {
	    /**
	     * Request constructor
	     *
	     * @param {Object} options
	     * @api public
	     */
	    constructor(uri, opts) {
	        super();
	        installTimerFunctions(this, opts);
	        this.opts = opts;
	        this.method = opts.method || "GET";
	        this.uri = uri;
	        this.async = false !== opts.async;
	        this.data = undefined !== opts.data ? opts.data : null;
	        this.create();
	    }
	    /**
	     * Creates the XHR object and sends the request.
	     *
	     * @api private
	     */
	    create() {
	        const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
	        opts.xdomain = !!this.opts.xd;
	        opts.xscheme = !!this.opts.xs;
	        const xhr = (this.xhr = new XMLHttpRequest(opts));
	        try {
	            xhr.open(this.method, this.uri, this.async);
	            try {
	                if (this.opts.extraHeaders) {
	                    xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
	                    for (let i in this.opts.extraHeaders) {
	                        if (this.opts.extraHeaders.hasOwnProperty(i)) {
	                            xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
	                        }
	                    }
	                }
	            }
	            catch (e) { }
	            if ("POST" === this.method) {
	                try {
	                    xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
	                }
	                catch (e) { }
	            }
	            try {
	                xhr.setRequestHeader("Accept", "*/*");
	            }
	            catch (e) { }
	            // ie6 check
	            if ("withCredentials" in xhr) {
	                xhr.withCredentials = this.opts.withCredentials;
	            }
	            if (this.opts.requestTimeout) {
	                xhr.timeout = this.opts.requestTimeout;
	            }
	            xhr.onreadystatechange = () => {
	                if (4 !== xhr.readyState)
	                    return;
	                if (200 === xhr.status || 1223 === xhr.status) {
	                    this.onLoad();
	                }
	                else {
	                    // make sure the `error` event handler that's user-set
	                    // does not throw in the same tick and gets caught here
	                    this.setTimeoutFn(() => {
	                        this.onError(typeof xhr.status === "number" ? xhr.status : 0);
	                    }, 0);
	                }
	            };
	            xhr.send(this.data);
	        }
	        catch (e) {
	            // Need to defer since .create() is called directly from the constructor
	            // and thus the 'error' event can only be only bound *after* this exception
	            // occurs.  Therefore, also, we cannot throw here at all.
	            this.setTimeoutFn(() => {
	                this.onError(e);
	            }, 0);
	            return;
	        }
	        if (typeof document !== "undefined") {
	            this.index = Request.requestsCount++;
	            Request.requests[this.index] = this;
	        }
	    }
	    /**
	     * Called upon successful response.
	     *
	     * @api private
	     */
	    onSuccess() {
	        this.emit("success");
	        this.cleanup();
	    }
	    /**
	     * Called if we have data.
	     *
	     * @api private
	     */
	    onData(data) {
	        this.emit("data", data);
	        this.onSuccess();
	    }
	    /**
	     * Called upon error.
	     *
	     * @api private
	     */
	    onError(err) {
	        this.emit("error", err);
	        this.cleanup(true);
	    }
	    /**
	     * Cleans up house.
	     *
	     * @api private
	     */
	    cleanup(fromError) {
	        if ("undefined" === typeof this.xhr || null === this.xhr) {
	            return;
	        }
	        this.xhr.onreadystatechange = empty;
	        if (fromError) {
	            try {
	                this.xhr.abort();
	            }
	            catch (e) { }
	        }
	        if (typeof document !== "undefined") {
	            delete Request.requests[this.index];
	        }
	        this.xhr = null;
	    }
	    /**
	     * Called upon load.
	     *
	     * @api private
	     */
	    onLoad() {
	        const data = this.xhr.responseText;
	        if (data !== null) {
	            this.onData(data);
	        }
	    }
	    /**
	     * Aborts the request.
	     *
	     * @api public
	     */
	    abort() {
	        this.cleanup();
	    }
	}
	Request.requestsCount = 0;
	Request.requests = {};
	/**
	 * Aborts pending requests when unloading the window. This is needed to prevent
	 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
	 * emitted.
	 */
	if (typeof document !== "undefined") {
	    // @ts-ignore
	    if (typeof attachEvent === "function") {
	        // @ts-ignore
	        attachEvent("onunload", unloadHandler);
	    }
	    else if (typeof addEventListener === "function") {
	        const terminationEvent = "onpagehide" in globalThis$1 ? "pagehide" : "unload";
	        addEventListener(terminationEvent, unloadHandler, false);
	    }
	}
	function unloadHandler() {
	    for (let i in Request.requests) {
	        if (Request.requests.hasOwnProperty(i)) {
	            Request.requests[i].abort();
	        }
	    }
	}

	var constants = {
	  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
	  EMPTY_BUFFER: Buffer.alloc(0),
	  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
	  kForOnEventAttribute: Symbol('kIsForOnEventAttribute'),
	  kListener: Symbol('kListener'),
	  kStatusCode: Symbol('status-code'),
	  kWebSocket: Symbol('websocket'),
	  NOOP: () => {}
	};

	var bufferUtil = createCommonjsModule(function (module) {

	const { EMPTY_BUFFER } = constants;

	/**
	 * Merges an array of buffers into a new buffer.
	 *
	 * @param {Buffer[]} list The array of buffers to concat
	 * @param {Number} totalLength The total length of buffers in the list
	 * @return {Buffer} The resulting buffer
	 * @public
	 */
	function concat(list, totalLength) {
	  if (list.length === 0) return EMPTY_BUFFER;
	  if (list.length === 1) return list[0];

	  const target = Buffer.allocUnsafe(totalLength);
	  let offset = 0;

	  for (let i = 0; i < list.length; i++) {
	    const buf = list[i];
	    target.set(buf, offset);
	    offset += buf.length;
	  }

	  if (offset < totalLength) return target.slice(0, offset);

	  return target;
	}

	/**
	 * Masks a buffer using the given mask.
	 *
	 * @param {Buffer} source The buffer to mask
	 * @param {Buffer} mask The mask to use
	 * @param {Buffer} output The buffer where to store the result
	 * @param {Number} offset The offset at which to start writing
	 * @param {Number} length The number of bytes to mask.
	 * @public
	 */
	function _mask(source, mask, output, offset, length) {
	  for (let i = 0; i < length; i++) {
	    output[offset + i] = source[i] ^ mask[i & 3];
	  }
	}

	/**
	 * Unmasks a buffer using the given mask.
	 *
	 * @param {Buffer} buffer The buffer to unmask
	 * @param {Buffer} mask The mask to use
	 * @public
	 */
	function _unmask(buffer, mask) {
	  for (let i = 0; i < buffer.length; i++) {
	    buffer[i] ^= mask[i & 3];
	  }
	}

	/**
	 * Converts a buffer to an `ArrayBuffer`.
	 *
	 * @param {Buffer} buf The buffer to convert
	 * @return {ArrayBuffer} Converted buffer
	 * @public
	 */
	function toArrayBuffer(buf) {
	  if (buf.byteLength === buf.buffer.byteLength) {
	    return buf.buffer;
	  }

	  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
	}

	/**
	 * Converts `data` to a `Buffer`.
	 *
	 * @param {*} data The data to convert
	 * @return {Buffer} The buffer
	 * @throws {TypeError}
	 * @public
	 */
	function toBuffer(data) {
	  toBuffer.readOnly = true;

	  if (Buffer.isBuffer(data)) return data;

	  let buf;

	  if (data instanceof ArrayBuffer) {
	    buf = Buffer.from(data);
	  } else if (ArrayBuffer.isView(data)) {
	    buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
	  } else {
	    buf = Buffer.from(data);
	    toBuffer.readOnly = false;
	  }

	  return buf;
	}

	try {
	  const bufferUtil = bufferutil__default["default"];

	  module.exports = {
	    concat,
	    mask(source, mask, output, offset, length) {
	      if (length < 48) _mask(source, mask, output, offset, length);
	      else bufferUtil.mask(source, mask, output, offset, length);
	    },
	    toArrayBuffer,
	    toBuffer,
	    unmask(buffer, mask) {
	      if (buffer.length < 32) _unmask(buffer, mask);
	      else bufferUtil.unmask(buffer, mask);
	    }
	  };
	} catch (e) /* istanbul ignore next */ {
	  module.exports = {
	    concat,
	    mask: _mask,
	    toArrayBuffer,
	    toBuffer,
	    unmask: _unmask
	  };
	}
	});
	bufferUtil.concat;
	bufferUtil.mask;
	bufferUtil.toArrayBuffer;
	bufferUtil.toBuffer;
	bufferUtil.unmask;

	const kDone = Symbol('kDone');
	const kRun = Symbol('kRun');

	/**
	 * A very simple job queue with adjustable concurrency. Adapted from
	 * https://github.com/STRML/async-limiter
	 */
	class Limiter {
	  /**
	   * Creates a new `Limiter`.
	   *
	   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
	   *     to run concurrently
	   */
	  constructor(concurrency) {
	    this[kDone] = () => {
	      this.pending--;
	      this[kRun]();
	    };
	    this.concurrency = concurrency || Infinity;
	    this.jobs = [];
	    this.pending = 0;
	  }

	  /**
	   * Adds a job to the queue.
	   *
	   * @param {Function} job The job to run
	   * @public
	   */
	  add(job) {
	    this.jobs.push(job);
	    this[kRun]();
	  }

	  /**
	   * Removes a job from the queue and runs it if possible.
	   *
	   * @private
	   */
	  [kRun]() {
	    if (this.pending === this.concurrency) return;

	    if (this.jobs.length) {
	      const job = this.jobs.shift();

	      this.pending++;
	      job(this[kDone]);
	    }
	  }
	}

	var limiter = Limiter;

	const { kStatusCode: kStatusCode$2 } = constants;

	const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
	const kPerMessageDeflate = Symbol('permessage-deflate');
	const kTotalLength = Symbol('total-length');
	const kCallback = Symbol('callback');
	const kBuffers = Symbol('buffers');
	const kError$1 = Symbol('error');

	//
	// We limit zlib concurrency, which prevents severe memory fragmentation
	// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
	// and https://github.com/websockets/ws/issues/1202
	//
	// Intentionally global; it's the global thread pool that's an issue.
	//
	let zlibLimiter;

	/**
	 * permessage-deflate implementation.
	 */
	class PerMessageDeflate {
	  /**
	   * Creates a PerMessageDeflate instance.
	   *
	   * @param {Object} [options] Configuration options
	   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
	   *     for, or request, a custom client window size
	   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
	   *     acknowledge disabling of client context takeover
	   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
	   *     calls to zlib
	   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
	   *     use of a custom server window size
	   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
	   *     disabling of server context takeover
	   * @param {Number} [options.threshold=1024] Size (in bytes) below which
	   *     messages should not be compressed if context takeover is disabled
	   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
	   *     deflate
	   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
	   *     inflate
	   * @param {Boolean} [isServer=false] Create the instance in either server or
	   *     client mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(options, isServer, maxPayload) {
	    this._maxPayload = maxPayload | 0;
	    this._options = options || {};
	    this._threshold =
	      this._options.threshold !== undefined ? this._options.threshold : 1024;
	    this._isServer = !!isServer;
	    this._deflate = null;
	    this._inflate = null;

	    this.params = null;

	    if (!zlibLimiter) {
	      const concurrency =
	        this._options.concurrencyLimit !== undefined
	          ? this._options.concurrencyLimit
	          : 10;
	      zlibLimiter = new limiter(concurrency);
	    }
	  }

	  /**
	   * @type {String}
	   */
	  static get extensionName() {
	    return 'permessage-deflate';
	  }

	  /**
	   * Create an extension negotiation offer.
	   *
	   * @return {Object} Extension parameters
	   * @public
	   */
	  offer() {
	    const params = {};

	    if (this._options.serverNoContextTakeover) {
	      params.server_no_context_takeover = true;
	    }
	    if (this._options.clientNoContextTakeover) {
	      params.client_no_context_takeover = true;
	    }
	    if (this._options.serverMaxWindowBits) {
	      params.server_max_window_bits = this._options.serverMaxWindowBits;
	    }
	    if (this._options.clientMaxWindowBits) {
	      params.client_max_window_bits = this._options.clientMaxWindowBits;
	    } else if (this._options.clientMaxWindowBits == null) {
	      params.client_max_window_bits = true;
	    }

	    return params;
	  }

	  /**
	   * Accept an extension negotiation offer/response.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Object} Accepted configuration
	   * @public
	   */
	  accept(configurations) {
	    configurations = this.normalizeParams(configurations);

	    this.params = this._isServer
	      ? this.acceptAsServer(configurations)
	      : this.acceptAsClient(configurations);

	    return this.params;
	  }

	  /**
	   * Releases all resources used by the extension.
	   *
	   * @public
	   */
	  cleanup() {
	    if (this._inflate) {
	      this._inflate.close();
	      this._inflate = null;
	    }

	    if (this._deflate) {
	      const callback = this._deflate[kCallback];

	      this._deflate.close();
	      this._deflate = null;

	      if (callback) {
	        callback(
	          new Error(
	            'The deflate stream was closed while data was being processed'
	          )
	        );
	      }
	    }
	  }

	  /**
	   *  Accept an extension negotiation offer.
	   *
	   * @param {Array} offers The extension negotiation offers
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsServer(offers) {
	    const opts = this._options;
	    const accepted = offers.find((params) => {
	      if (
	        (opts.serverNoContextTakeover === false &&
	          params.server_no_context_takeover) ||
	        (params.server_max_window_bits &&
	          (opts.serverMaxWindowBits === false ||
	            (typeof opts.serverMaxWindowBits === 'number' &&
	              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
	        (typeof opts.clientMaxWindowBits === 'number' &&
	          !params.client_max_window_bits)
	      ) {
	        return false;
	      }

	      return true;
	    });

	    if (!accepted) {
	      throw new Error('None of the extension offers can be accepted');
	    }

	    if (opts.serverNoContextTakeover) {
	      accepted.server_no_context_takeover = true;
	    }
	    if (opts.clientNoContextTakeover) {
	      accepted.client_no_context_takeover = true;
	    }
	    if (typeof opts.serverMaxWindowBits === 'number') {
	      accepted.server_max_window_bits = opts.serverMaxWindowBits;
	    }
	    if (typeof opts.clientMaxWindowBits === 'number') {
	      accepted.client_max_window_bits = opts.clientMaxWindowBits;
	    } else if (
	      accepted.client_max_window_bits === true ||
	      opts.clientMaxWindowBits === false
	    ) {
	      delete accepted.client_max_window_bits;
	    }

	    return accepted;
	  }

	  /**
	   * Accept the extension negotiation response.
	   *
	   * @param {Array} response The extension negotiation response
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsClient(response) {
	    const params = response[0];

	    if (
	      this._options.clientNoContextTakeover === false &&
	      params.client_no_context_takeover
	    ) {
	      throw new Error('Unexpected parameter "client_no_context_takeover"');
	    }

	    if (!params.client_max_window_bits) {
	      if (typeof this._options.clientMaxWindowBits === 'number') {
	        params.client_max_window_bits = this._options.clientMaxWindowBits;
	      }
	    } else if (
	      this._options.clientMaxWindowBits === false ||
	      (typeof this._options.clientMaxWindowBits === 'number' &&
	        params.client_max_window_bits > this._options.clientMaxWindowBits)
	    ) {
	      throw new Error(
	        'Unexpected or invalid parameter "client_max_window_bits"'
	      );
	    }

	    return params;
	  }

	  /**
	   * Normalize parameters.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Array} The offers/response with normalized parameters
	   * @private
	   */
	  normalizeParams(configurations) {
	    configurations.forEach((params) => {
	      Object.keys(params).forEach((key) => {
	        let value = params[key];

	        if (value.length > 1) {
	          throw new Error(`Parameter "${key}" must have only a single value`);
	        }

	        value = value[0];

	        if (key === 'client_max_window_bits') {
	          if (value !== true) {
	            const num = +value;
	            if (!Number.isInteger(num) || num < 8 || num > 15) {
	              throw new TypeError(
	                `Invalid value for parameter "${key}": ${value}`
	              );
	            }
	            value = num;
	          } else if (!this._isServer) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else if (key === 'server_max_window_bits') {
	          const num = +value;
	          if (!Number.isInteger(num) || num < 8 || num > 15) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	          value = num;
	        } else if (
	          key === 'client_no_context_takeover' ||
	          key === 'server_no_context_takeover'
	        ) {
	          if (value !== true) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else {
	          throw new Error(`Unknown parameter "${key}"`);
	        }

	        params[key] = value;
	      });
	    });

	    return configurations;
	  }

	  /**
	   * Decompress data. Concurrency limited.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  decompress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._decompress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Compress data. Concurrency limited.
	   *
	   * @param {Buffer} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  compress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._compress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Decompress data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _decompress(data, fin, callback) {
	    const endpoint = this._isServer ? 'client' : 'server';

	    if (!this._inflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib__default["default"].Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._inflate = zlib__default["default"].createInflateRaw({
	        ...this._options.zlibInflateOptions,
	        windowBits
	      });
	      this._inflate[kPerMessageDeflate] = this;
	      this._inflate[kTotalLength] = 0;
	      this._inflate[kBuffers] = [];
	      this._inflate.on('error', inflateOnError);
	      this._inflate.on('data', inflateOnData);
	    }

	    this._inflate[kCallback] = callback;

	    this._inflate.write(data);
	    if (fin) this._inflate.write(TRAILER);

	    this._inflate.flush(() => {
	      const err = this._inflate[kError$1];

	      if (err) {
	        this._inflate.close();
	        this._inflate = null;
	        callback(err);
	        return;
	      }

	      const data = bufferUtil.concat(
	        this._inflate[kBuffers],
	        this._inflate[kTotalLength]
	      );

	      if (this._inflate._readableState.endEmitted) {
	        this._inflate.close();
	        this._inflate = null;
	      } else {
	        this._inflate[kTotalLength] = 0;
	        this._inflate[kBuffers] = [];

	        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	          this._inflate.reset();
	        }
	      }

	      callback(null, data);
	    });
	  }

	  /**
	   * Compress data.
	   *
	   * @param {Buffer} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _compress(data, fin, callback) {
	    const endpoint = this._isServer ? 'server' : 'client';

	    if (!this._deflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib__default["default"].Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._deflate = zlib__default["default"].createDeflateRaw({
	        ...this._options.zlibDeflateOptions,
	        windowBits
	      });

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      this._deflate.on('data', deflateOnData);
	    }

	    this._deflate[kCallback] = callback;

	    this._deflate.write(data);
	    this._deflate.flush(zlib__default["default"].Z_SYNC_FLUSH, () => {
	      if (!this._deflate) {
	        //
	        // The deflate stream was closed while data was being processed.
	        //
	        return;
	      }

	      let data = bufferUtil.concat(
	        this._deflate[kBuffers],
	        this._deflate[kTotalLength]
	      );

	      if (fin) data = data.slice(0, data.length - 4);

	      //
	      // Ensure that the callback will not be called again in
	      // `PerMessageDeflate#cleanup()`.
	      //
	      this._deflate[kCallback] = null;

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	        this._deflate.reset();
	      }

	      callback(null, data);
	    });
	  }
	}

	var permessageDeflate = PerMessageDeflate;

	/**
	 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function deflateOnData(chunk) {
	  this[kBuffers].push(chunk);
	  this[kTotalLength] += chunk.length;
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function inflateOnData(chunk) {
	  this[kTotalLength] += chunk.length;

	  if (
	    this[kPerMessageDeflate]._maxPayload < 1 ||
	    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
	  ) {
	    this[kBuffers].push(chunk);
	    return;
	  }

	  this[kError$1] = new RangeError('Max payload size exceeded');
	  this[kError$1].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
	  this[kError$1][kStatusCode$2] = 1009;
	  this.removeListener('data', inflateOnData);
	  this.reset();
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'error'` event.
	 *
	 * @param {Error} err The emitted error
	 * @private
	 */
	function inflateOnError(err) {
	  //
	  // There is no need to call `Zlib#close()` as the handle is automatically
	  // closed when an error is emitted.
	  //
	  this[kPerMessageDeflate]._inflate = null;
	  err[kStatusCode$2] = 1007;
	  this[kCallback](err);
	}

	var validation = createCommonjsModule(function (module) {

	//
	// Allowed token characters:
	//
	// '!', '#', '$', '%', '&', ''', '*', '+', '-',
	// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
	//
	// tokenChars[32] === 0 // ' '
	// tokenChars[33] === 1 // '!'
	// tokenChars[34] === 0 // '"'
	// ...
	//
	// prettier-ignore
	const tokenChars = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
	];

	/**
	 * Checks if a status code is allowed in a close frame.
	 *
	 * @param {Number} code The status code
	 * @return {Boolean} `true` if the status code is valid, else `false`
	 * @public
	 */
	function isValidStatusCode(code) {
	  return (
	    (code >= 1000 &&
	      code <= 1014 &&
	      code !== 1004 &&
	      code !== 1005 &&
	      code !== 1006) ||
	    (code >= 3000 && code <= 4999)
	  );
	}

	/**
	 * Checks if a given buffer contains only correct UTF-8.
	 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	 * Markus Kuhn.
	 *
	 * @param {Buffer} buf The buffer to check
	 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	 * @public
	 */
	function _isValidUTF8(buf) {
	  const len = buf.length;
	  let i = 0;

	  while (i < len) {
	    if ((buf[i] & 0x80) === 0) {
	      // 0xxxxxxx
	      i++;
	    } else if ((buf[i] & 0xe0) === 0xc0) {
	      // 110xxxxx 10xxxxxx
	      if (
	        i + 1 === len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i] & 0xfe) === 0xc0 // Overlong
	      ) {
	        return false;
	      }

	      i += 2;
	    } else if ((buf[i] & 0xf0) === 0xe0) {
	      // 1110xxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 2 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
	        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
	      ) {
	        return false;
	      }

	      i += 3;
	    } else if ((buf[i] & 0xf8) === 0xf0) {
	      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 3 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i + 3] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
	        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
	        buf[i] > 0xf4 // > U+10FFFF
	      ) {
	        return false;
	      }

	      i += 4;
	    } else {
	      return false;
	    }
	  }

	  return true;
	}

	try {
	  const isValidUTF8 = utf8Validate__default["default"];

	  module.exports = {
	    isValidStatusCode,
	    isValidUTF8(buf) {
	      return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
	    },
	    tokenChars
	  };
	} catch (e) /* istanbul ignore next */ {
	  module.exports = {
	    isValidStatusCode,
	    isValidUTF8: _isValidUTF8,
	    tokenChars
	  };
	}
	});
	validation.isValidStatusCode;
	validation.isValidUTF8;
	validation.tokenChars;

	const { Writable } = stream__default["default"];


	const {
	  BINARY_TYPES: BINARY_TYPES$1,
	  EMPTY_BUFFER: EMPTY_BUFFER$2,
	  kStatusCode: kStatusCode$1,
	  kWebSocket: kWebSocket$2
	} = constants;
	const { concat, toArrayBuffer, unmask } = bufferUtil;
	const { isValidStatusCode: isValidStatusCode$1, isValidUTF8 } = validation;

	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;

	/**
	 * HyBi Receiver implementation.
	 *
	 * @extends Writable
	 */
	class Receiver extends Writable {
	  /**
	   * Creates a Receiver instance.
	   *
	   * @param {Object} [options] Options object
	   * @param {String} [options.binaryType=nodebuffer] The type for binary data
	   * @param {Object} [options.extensions] An object containing the negotiated
	   *     extensions
	   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
	   *     client or server mode
	   * @param {Number} [options.maxPayload=0] The maximum allowed message length
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   */
	  constructor(options = {}) {
	    super();

	    this._binaryType = options.binaryType || BINARY_TYPES$1[0];
	    this._extensions = options.extensions || {};
	    this._isServer = !!options.isServer;
	    this._maxPayload = options.maxPayload | 0;
	    this._skipUTF8Validation = !!options.skipUTF8Validation;
	    this[kWebSocket$2] = undefined;

	    this._bufferedBytes = 0;
	    this._buffers = [];

	    this._compressed = false;
	    this._payloadLength = 0;
	    this._mask = undefined;
	    this._fragmented = 0;
	    this._masked = false;
	    this._fin = false;
	    this._opcode = 0;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragments = [];

	    this._state = GET_INFO;
	    this._loop = false;
	  }

	  /**
	   * Implements `Writable.prototype._write()`.
	   *
	   * @param {Buffer} chunk The chunk of data to write
	   * @param {String} encoding The character encoding of `chunk`
	   * @param {Function} cb Callback
	   * @private
	   */
	  _write(chunk, encoding, cb) {
	    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

	    this._bufferedBytes += chunk.length;
	    this._buffers.push(chunk);
	    this.startLoop(cb);
	  }

	  /**
	   * Consumes `n` bytes from the buffered data.
	   *
	   * @param {Number} n The number of bytes to consume
	   * @return {Buffer} The consumed bytes
	   * @private
	   */
	  consume(n) {
	    this._bufferedBytes -= n;

	    if (n === this._buffers[0].length) return this._buffers.shift();

	    if (n < this._buffers[0].length) {
	      const buf = this._buffers[0];
	      this._buffers[0] = buf.slice(n);
	      return buf.slice(0, n);
	    }

	    const dst = Buffer.allocUnsafe(n);

	    do {
	      const buf = this._buffers[0];
	      const offset = dst.length - n;

	      if (n >= buf.length) {
	        dst.set(this._buffers.shift(), offset);
	      } else {
	        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
	        this._buffers[0] = buf.slice(n);
	      }

	      n -= buf.length;
	    } while (n > 0);

	    return dst;
	  }

	  /**
	   * Starts the parsing loop.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  startLoop(cb) {
	    let err;
	    this._loop = true;

	    do {
	      switch (this._state) {
	        case GET_INFO:
	          err = this.getInfo();
	          break;
	        case GET_PAYLOAD_LENGTH_16:
	          err = this.getPayloadLength16();
	          break;
	        case GET_PAYLOAD_LENGTH_64:
	          err = this.getPayloadLength64();
	          break;
	        case GET_MASK:
	          this.getMask();
	          break;
	        case GET_DATA:
	          err = this.getData(cb);
	          break;
	        default:
	          // `INFLATING`
	          this._loop = false;
	          return;
	      }
	    } while (this._loop);

	    cb(err);
	  }

	  /**
	   * Reads the first two bytes of a frame.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getInfo() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(2);

	    if ((buf[0] & 0x30) !== 0x00) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV2 and RSV3 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_2_3'
	      );
	    }

	    const compressed = (buf[0] & 0x40) === 0x40;

	    if (compressed && !this._extensions[permessageDeflate.extensionName]) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV1 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_1'
	      );
	    }

	    this._fin = (buf[0] & 0x80) === 0x80;
	    this._opcode = buf[0] & 0x0f;
	    this._payloadLength = buf[1] & 0x7f;

	    if (this._opcode === 0x00) {
	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (!this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'invalid opcode 0',
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._opcode = this._fragmented;
	    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
	      if (this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid opcode ${this._opcode}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._compressed = compressed;
	    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
	      if (!this._fin) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'FIN must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_FIN'
	        );
	      }

	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (this._payloadLength > 0x7d) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid payload length ${this._payloadLength}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );
	      }
	    } else {
	      this._loop = false;
	      return error(
	        RangeError,
	        `invalid opcode ${this._opcode}`,
	        true,
	        1002,
	        'WS_ERR_INVALID_OPCODE'
	      );
	    }

	    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
	    this._masked = (buf[1] & 0x80) === 0x80;

	    if (this._isServer) {
	      if (!this._masked) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'MASK must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_MASK'
	        );
	      }
	    } else if (this._masked) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'MASK must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_MASK'
	      );
	    }

	    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
	    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
	    else return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+16).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength16() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    this._payloadLength = this.consume(2).readUInt16BE(0);
	    return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+64).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength64() {
	    if (this._bufferedBytes < 8) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(8);
	    const num = buf.readUInt32BE(0);

	    //
	    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
	    // if payload length is greater than this number.
	    //
	    if (num > Math.pow(2, 53 - 32) - 1) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'Unsupported WebSocket frame: payload length > 2^53 - 1',
	        false,
	        1009,
	        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
	      );
	    }

	    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
	    return this.haveLength();
	  }

	  /**
	   * Payload length has been read.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  haveLength() {
	    if (this._payloadLength && this._opcode < 0x08) {
	      this._totalPayloadLength += this._payloadLength;
	      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'Max payload size exceeded',
	          false,
	          1009,
	          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	        );
	      }
	    }

	    if (this._masked) this._state = GET_MASK;
	    else this._state = GET_DATA;
	  }

	  /**
	   * Reads mask bytes.
	   *
	   * @private
	   */
	  getMask() {
	    if (this._bufferedBytes < 4) {
	      this._loop = false;
	      return;
	    }

	    this._mask = this.consume(4);
	    this._state = GET_DATA;
	  }

	  /**
	   * Reads data bytes.
	   *
	   * @param {Function} cb Callback
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  getData(cb) {
	    let data = EMPTY_BUFFER$2;

	    if (this._payloadLength) {
	      if (this._bufferedBytes < this._payloadLength) {
	        this._loop = false;
	        return;
	      }

	      data = this.consume(this._payloadLength);
	      if (this._masked) unmask(data, this._mask);
	    }

	    if (this._opcode > 0x07) return this.controlMessage(data);

	    if (this._compressed) {
	      this._state = INFLATING;
	      this.decompress(data, cb);
	      return;
	    }

	    if (data.length) {
	      //
	      // This message is not compressed so its length is the sum of the payload
	      // length of all fragments.
	      //
	      this._messageLength = this._totalPayloadLength;
	      this._fragments.push(data);
	    }

	    return this.dataMessage();
	  }

	  /**
	   * Decompresses data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Function} cb Callback
	   * @private
	   */
	  decompress(data, cb) {
	    const perMessageDeflate = this._extensions[permessageDeflate.extensionName];

	    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
	      if (err) return cb(err);

	      if (buf.length) {
	        this._messageLength += buf.length;
	        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
	          return cb(
	            error(
	              RangeError,
	              'Max payload size exceeded',
	              false,
	              1009,
	              'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	            )
	          );
	        }

	        this._fragments.push(buf);
	      }

	      const er = this.dataMessage();
	      if (er) return cb(er);

	      this.startLoop(cb);
	    });
	  }

	  /**
	   * Handles a data message.
	   *
	   * @return {(Error|undefined)} A possible error
	   * @private
	   */
	  dataMessage() {
	    if (this._fin) {
	      const messageLength = this._messageLength;
	      const fragments = this._fragments;

	      this._totalPayloadLength = 0;
	      this._messageLength = 0;
	      this._fragmented = 0;
	      this._fragments = [];

	      if (this._opcode === 2) {
	        let data;

	        if (this._binaryType === 'nodebuffer') {
	          data = concat(fragments, messageLength);
	        } else if (this._binaryType === 'arraybuffer') {
	          data = toArrayBuffer(concat(fragments, messageLength));
	        } else {
	          data = fragments;
	        }

	        this.emit('message', data, true);
	      } else {
	        const buf = concat(fragments, messageLength);

	        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	          this._loop = false;
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('message', buf, false);
	      }
	    }

	    this._state = GET_INFO;
	  }

	  /**
	   * Handles a control message.
	   *
	   * @param {Buffer} data Data to handle
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  controlMessage(data) {
	    if (this._opcode === 0x08) {
	      this._loop = false;

	      if (data.length === 0) {
	        this.emit('conclude', 1005, EMPTY_BUFFER$2);
	        this.end();
	      } else if (data.length === 1) {
	        return error(
	          RangeError,
	          'invalid payload length 1',
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );
	      } else {
	        const code = data.readUInt16BE(0);

	        if (!isValidStatusCode$1(code)) {
	          return error(
	            RangeError,
	            `invalid status code ${code}`,
	            true,
	            1002,
	            'WS_ERR_INVALID_CLOSE_CODE'
	          );
	        }

	        const buf = data.slice(2);

	        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('conclude', code, buf);
	        this.end();
	      }
	    } else if (this._opcode === 0x09) {
	      this.emit('ping', data);
	    } else {
	      this.emit('pong', data);
	    }

	    this._state = GET_INFO;
	  }
	}

	var receiver = Receiver;

	/**
	 * Builds an error object.
	 *
	 * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	 * @param {String} message The error message
	 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
	 *     `message`
	 * @param {Number} statusCode The status code
	 * @param {String} errorCode The exposed error code
	 * @return {(Error|RangeError)} The error
	 * @private
	 */
	function error(ErrorCtor, message, prefix, statusCode, errorCode) {
	  const err = new ErrorCtor(
	    prefix ? `Invalid WebSocket frame: ${message}` : message
	  );

	  Error.captureStackTrace(err, error);
	  err.code = errorCode;
	  err[kStatusCode$1] = statusCode;
	  return err;
	}

	const { randomFillSync } = crypto__default["default"];


	const { EMPTY_BUFFER: EMPTY_BUFFER$1 } = constants;
	const { isValidStatusCode } = validation;
	const { mask: applyMask, toBuffer: toBuffer$1 } = bufferUtil;

	const mask = Buffer.alloc(4);

	/**
	 * HyBi Sender implementation.
	 */
	class Sender {
	  /**
	   * Creates a Sender instance.
	   *
	   * @param {(net.Socket|tls.Socket)} socket The connection socket
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   */
	  constructor(socket, extensions) {
	    this._extensions = extensions || {};
	    this._socket = socket;

	    this._firstFragment = true;
	    this._compress = false;

	    this._bufferedBytes = 0;
	    this._deflating = false;
	    this._queue = [];
	  }

	  /**
	   * Frames a piece of data according to the HyBi WebSocket protocol.
	   *
	   * @param {Buffer} data The data to frame
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @return {Buffer[]} The framed data as a list of `Buffer` instances
	   * @public
	   */
	  static frame(data, options) {
	    const merge = options.mask && options.readOnly;
	    let offset = options.mask ? 6 : 2;
	    let payloadLength = data.length;

	    if (data.length >= 65536) {
	      offset += 8;
	      payloadLength = 127;
	    } else if (data.length > 125) {
	      offset += 2;
	      payloadLength = 126;
	    }

	    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

	    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
	    if (options.rsv1) target[0] |= 0x40;

	    target[1] = payloadLength;

	    if (payloadLength === 126) {
	      target.writeUInt16BE(data.length, 2);
	    } else if (payloadLength === 127) {
	      target.writeUInt32BE(0, 2);
	      target.writeUInt32BE(data.length, 6);
	    }

	    if (!options.mask) return [target, data];

	    randomFillSync(mask, 0, 4);

	    target[1] |= 0x80;
	    target[offset - 4] = mask[0];
	    target[offset - 3] = mask[1];
	    target[offset - 2] = mask[2];
	    target[offset - 1] = mask[3];

	    if (merge) {
	      applyMask(data, mask, target, offset, data.length);
	      return [target];
	    }

	    applyMask(data, mask, data, 0, data.length);
	    return [target, data];
	  }

	  /**
	   * Sends a close message to the other peer.
	   *
	   * @param {Number} [code] The status code component of the body
	   * @param {(String|Buffer)} [data] The message component of the body
	   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(code, data, mask, cb) {
	    let buf;

	    if (code === undefined) {
	      buf = EMPTY_BUFFER$1;
	    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
	      throw new TypeError('First argument must be a valid error code number');
	    } else if (data === undefined || !data.length) {
	      buf = Buffer.allocUnsafe(2);
	      buf.writeUInt16BE(code, 0);
	    } else {
	      const length = Buffer.byteLength(data);

	      if (length > 123) {
	        throw new RangeError('The message must not be greater than 123 bytes');
	      }

	      buf = Buffer.allocUnsafe(2 + length);
	      buf.writeUInt16BE(code, 0);

	      if (typeof data === 'string') {
	        buf.write(data, 2);
	      } else {
	        buf.set(data, 2);
	      }
	    }

	    if (this._deflating) {
	      this.enqueue([this.doClose, buf, mask, cb]);
	    } else {
	      this.doClose(buf, mask, cb);
	    }
	  }

	  /**
	   * Frames and sends a close message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doClose(data, mask, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x08,
	        mask,
	        readOnly: false
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a ping message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  ping(data, mask, cb) {
	    const buf = toBuffer$1(data);

	    if (buf.length > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    if (this._deflating) {
	      this.enqueue([this.doPing, buf, mask, toBuffer$1.readOnly, cb]);
	    } else {
	      this.doPing(buf, mask, toBuffer$1.readOnly, cb);
	    }
	  }

	  /**
	   * Frames and sends a ping message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doPing(data, mask, readOnly, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x09,
	        mask,
	        readOnly
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a pong message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  pong(data, mask, cb) {
	    const buf = toBuffer$1(data);

	    if (buf.length > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    if (this._deflating) {
	      this.enqueue([this.doPong, buf, mask, toBuffer$1.readOnly, cb]);
	    } else {
	      this.doPong(buf, mask, toBuffer$1.readOnly, cb);
	    }
	  }

	  /**
	   * Frames and sends a pong message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doPong(data, mask, readOnly, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x0a,
	        mask,
	        readOnly
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a data message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Object} options Options object
	   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
	   *     or text
	   * @param {Boolean} [options.compress=false] Specifies whether or not to
	   *     compress `data`
	   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  send(data, options, cb) {
	    const buf = toBuffer$1(data);
	    const perMessageDeflate = this._extensions[permessageDeflate.extensionName];
	    let opcode = options.binary ? 2 : 1;
	    let rsv1 = options.compress;

	    if (this._firstFragment) {
	      this._firstFragment = false;
	      if (
	        rsv1 &&
	        perMessageDeflate &&
	        perMessageDeflate.params[
	          perMessageDeflate._isServer
	            ? 'server_no_context_takeover'
	            : 'client_no_context_takeover'
	        ]
	      ) {
	        rsv1 = buf.length >= perMessageDeflate._threshold;
	      }
	      this._compress = rsv1;
	    } else {
	      rsv1 = false;
	      opcode = 0;
	    }

	    if (options.fin) this._firstFragment = true;

	    if (perMessageDeflate) {
	      const opts = {
	        fin: options.fin,
	        rsv1,
	        opcode,
	        mask: options.mask,
	        readOnly: toBuffer$1.readOnly
	      };

	      if (this._deflating) {
	        this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
	      } else {
	        this.dispatch(buf, this._compress, opts, cb);
	      }
	    } else {
	      this.sendFrame(
	        Sender.frame(buf, {
	          fin: options.fin,
	          rsv1: false,
	          opcode,
	          mask: options.mask,
	          readOnly: toBuffer$1.readOnly
	        }),
	        cb
	      );
	    }
	  }

	  /**
	   * Dispatches a data message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     `data`
	   * @param {Object} options Options object
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  dispatch(data, compress, options, cb) {
	    if (!compress) {
	      this.sendFrame(Sender.frame(data, options), cb);
	      return;
	    }

	    const perMessageDeflate = this._extensions[permessageDeflate.extensionName];

	    this._bufferedBytes += data.length;
	    this._deflating = true;
	    perMessageDeflate.compress(data, options.fin, (_, buf) => {
	      if (this._socket.destroyed) {
	        const err = new Error(
	          'The socket was closed while data was being compressed'
	        );

	        if (typeof cb === 'function') cb(err);

	        for (let i = 0; i < this._queue.length; i++) {
	          const callback = this._queue[i][4];

	          if (typeof callback === 'function') callback(err);
	        }

	        return;
	      }

	      this._bufferedBytes -= data.length;
	      this._deflating = false;
	      options.readOnly = false;
	      this.sendFrame(Sender.frame(buf, options), cb);
	      this.dequeue();
	    });
	  }

	  /**
	   * Executes queued send operations.
	   *
	   * @private
	   */
	  dequeue() {
	    while (!this._deflating && this._queue.length) {
	      const params = this._queue.shift();

	      this._bufferedBytes -= params[1].length;
	      Reflect.apply(params[0], this, params.slice(1));
	    }
	  }

	  /**
	   * Enqueues a send operation.
	   *
	   * @param {Array} params Send operation parameters.
	   * @private
	   */
	  enqueue(params) {
	    this._bufferedBytes += params[1].length;
	    this._queue.push(params);
	  }

	  /**
	   * Sends a frame.
	   *
	   * @param {Buffer[]} list The frame to send
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  sendFrame(list, cb) {
	    if (list.length === 2) {
	      this._socket.cork();
	      this._socket.write(list[0]);
	      this._socket.write(list[1], cb);
	      this._socket.uncork();
	    } else {
	      this._socket.write(list[0], cb);
	    }
	  }
	}

	var sender = Sender;

	const { kForOnEventAttribute: kForOnEventAttribute$1, kListener: kListener$1 } = constants;

	const kCode = Symbol('kCode');
	const kData = Symbol('kData');
	const kError = Symbol('kError');
	const kMessage = Symbol('kMessage');
	const kReason = Symbol('kReason');
	const kTarget = Symbol('kTarget');
	const kType = Symbol('kType');
	const kWasClean = Symbol('kWasClean');

	/**
	 * Class representing an event.
	 */
	class Event {
	  /**
	   * Create a new `Event`.
	   *
	   * @param {String} type The name of the event
	   * @throws {TypeError} If the `type` argument is not specified
	   */
	  constructor(type) {
	    this[kTarget] = null;
	    this[kType] = type;
	  }

	  /**
	   * @type {*}
	   */
	  get target() {
	    return this[kTarget];
	  }

	  /**
	   * @type {String}
	   */
	  get type() {
	    return this[kType];
	  }
	}

	Object.defineProperty(Event.prototype, 'target', { enumerable: true });
	Object.defineProperty(Event.prototype, 'type', { enumerable: true });

	/**
	 * Class representing a close event.
	 *
	 * @extends Event
	 */
	class CloseEvent extends Event {
	  /**
	   * Create a new `CloseEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {Number} [options.code=0] The status code explaining why the
	   *     connection was closed
	   * @param {String} [options.reason=''] A human-readable string explaining why
	   *     the connection was closed
	   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
	   *     connection was cleanly closed
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kCode] = options.code === undefined ? 0 : options.code;
	    this[kReason] = options.reason === undefined ? '' : options.reason;
	    this[kWasClean] = options.wasClean === undefined ? false : options.wasClean;
	  }

	  /**
	   * @type {Number}
	   */
	  get code() {
	    return this[kCode];
	  }

	  /**
	   * @type {String}
	   */
	  get reason() {
	    return this[kReason];
	  }

	  /**
	   * @type {Boolean}
	   */
	  get wasClean() {
	    return this[kWasClean];
	  }
	}

	Object.defineProperty(CloseEvent.prototype, 'code', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'reason', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'wasClean', { enumerable: true });

	/**
	 * Class representing an error event.
	 *
	 * @extends Event
	 */
	class ErrorEvent extends Event {
	  /**
	   * Create a new `ErrorEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.error=null] The error that generated this event
	   * @param {String} [options.message=''] The error message
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kError] = options.error === undefined ? null : options.error;
	    this[kMessage] = options.message === undefined ? '' : options.message;
	  }

	  /**
	   * @type {*}
	   */
	  get error() {
	    return this[kError];
	  }

	  /**
	   * @type {String}
	   */
	  get message() {
	    return this[kMessage];
	  }
	}

	Object.defineProperty(ErrorEvent.prototype, 'error', { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, 'message', { enumerable: true });

	/**
	 * Class representing a message event.
	 *
	 * @extends Event
	 */
	class MessageEvent extends Event {
	  /**
	   * Create a new `MessageEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.data=null] The message content
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kData] = options.data === undefined ? null : options.data;
	  }

	  /**
	   * @type {*}
	   */
	  get data() {
	    return this[kData];
	  }
	}

	Object.defineProperty(MessageEvent.prototype, 'data', { enumerable: true });

	/**
	 * This provides methods for emulating the `EventTarget` interface. It's not
	 * meant to be used directly.
	 *
	 * @mixin
	 */
	const EventTarget = {
	  /**
	   * Register an event listener.
	   *
	   * @param {String} type A string representing the event type to listen for
	   * @param {Function} listener The listener to add
	   * @param {Object} [options] An options object specifies characteristics about
	   *     the event listener
	   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
	   *     listener should be invoked at most once after being added. If `true`,
	   *     the listener would be automatically removed when invoked.
	   * @public
	   */
	  addEventListener(type, listener, options = {}) {
	    let wrapper;

	    if (type === 'message') {
	      wrapper = function onMessage(data, isBinary) {
	        const event = new MessageEvent('message', {
	          data: isBinary ? data : data.toString()
	        });

	        event[kTarget] = this;
	        listener.call(this, event);
	      };
	    } else if (type === 'close') {
	      wrapper = function onClose(code, message) {
	        const event = new CloseEvent('close', {
	          code,
	          reason: message.toString(),
	          wasClean: this._closeFrameReceived && this._closeFrameSent
	        });

	        event[kTarget] = this;
	        listener.call(this, event);
	      };
	    } else if (type === 'error') {
	      wrapper = function onError(error) {
	        const event = new ErrorEvent('error', {
	          error,
	          message: error.message
	        });

	        event[kTarget] = this;
	        listener.call(this, event);
	      };
	    } else if (type === 'open') {
	      wrapper = function onOpen() {
	        const event = new Event('open');

	        event[kTarget] = this;
	        listener.call(this, event);
	      };
	    } else {
	      return;
	    }

	    wrapper[kForOnEventAttribute$1] = !!options[kForOnEventAttribute$1];
	    wrapper[kListener$1] = listener;

	    if (options.once) {
	      this.once(type, wrapper);
	    } else {
	      this.on(type, wrapper);
	    }
	  },

	  /**
	   * Remove an event listener.
	   *
	   * @param {String} type A string representing the event type to remove
	   * @param {Function} handler The listener to remove
	   * @public
	   */
	  removeEventListener(type, handler) {
	    for (const listener of this.listeners(type)) {
	      if (listener[kListener$1] === handler && !listener[kForOnEventAttribute$1]) {
	        this.removeListener(type, listener);
	        break;
	      }
	    }
	  }
	};

	var eventTarget = {
	  CloseEvent,
	  ErrorEvent,
	  Event,
	  EventTarget,
	  MessageEvent
	};

	const { tokenChars: tokenChars$1 } = validation;

	/**
	 * Adds an offer to the map of extension offers or a parameter to the map of
	 * parameters.
	 *
	 * @param {Object} dest The map of extension offers or parameters
	 * @param {String} name The extension or parameter name
	 * @param {(Object|Boolean|String)} elem The extension parameters or the
	 *     parameter value
	 * @private
	 */
	function push(dest, name, elem) {
	  if (dest[name] === undefined) dest[name] = [elem];
	  else dest[name].push(elem);
	}

	/**
	 * Parses the `Sec-WebSocket-Extensions` header into an object.
	 *
	 * @param {String} header The field value of the header
	 * @return {Object} The parsed object
	 * @public
	 */
	function parse$2(header) {
	  const offers = Object.create(null);
	  let params = Object.create(null);
	  let mustUnescape = false;
	  let isEscaping = false;
	  let inQuotes = false;
	  let extensionName;
	  let paramName;
	  let start = -1;
	  let code = -1;
	  let end = -1;
	  let i = 0;

	  for (; i < header.length; i++) {
	    code = header.charCodeAt(i);

	    if (extensionName === undefined) {
	      if (end === -1 && tokenChars$1[code] === 1) {
	        if (start === -1) start = i;
	      } else if (
	        i !== 0 &&
	        (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	      ) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        const name = header.slice(start, end);
	        if (code === 0x2c) {
	          push(offers, name, params);
	          params = Object.create(null);
	        } else {
	          extensionName = name;
	        }

	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else if (paramName === undefined) {
	      if (end === -1 && tokenChars$1[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 || code === 0x09) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        push(params, header.slice(start, end), true);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        start = end = -1;
	      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
	        paramName = header.slice(start, i);
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else {
	      //
	      // The value of a quoted-string after unescaping must conform to the
	      // token ABNF, so only token characters are valid.
	      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
	      //
	      if (isEscaping) {
	        if (tokenChars$1[code] !== 1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	        if (start === -1) start = i;
	        else if (!mustUnescape) mustUnescape = true;
	        isEscaping = false;
	      } else if (inQuotes) {
	        if (tokenChars$1[code] === 1) {
	          if (start === -1) start = i;
	        } else if (code === 0x22 /* '"' */ && start !== -1) {
	          inQuotes = false;
	          end = i;
	        } else if (code === 0x5c /* '\' */) {
	          isEscaping = true;
	        } else {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
	        inQuotes = true;
	      } else if (end === -1 && tokenChars$1[code] === 1) {
	        if (start === -1) start = i;
	      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
	        if (end === -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        let value = header.slice(start, end);
	        if (mustUnescape) {
	          value = value.replace(/\\/g, '');
	          mustUnescape = false;
	        }
	        push(params, paramName, value);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        paramName = undefined;
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    }
	  }

	  if (start === -1 || inQuotes || code === 0x20 || code === 0x09) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  if (end === -1) end = i;
	  const token = header.slice(start, end);
	  if (extensionName === undefined) {
	    push(offers, token, params);
	  } else {
	    if (paramName === undefined) {
	      push(params, token, true);
	    } else if (mustUnescape) {
	      push(params, paramName, token.replace(/\\/g, ''));
	    } else {
	      push(params, paramName, token);
	    }
	    push(offers, extensionName, params);
	  }

	  return offers;
	}

	/**
	 * Builds the `Sec-WebSocket-Extensions` header field value.
	 *
	 * @param {Object} extensions The map of extensions and parameters to format
	 * @return {String} A string representing the given object
	 * @public
	 */
	function format$1(extensions) {
	  return Object.keys(extensions)
	    .map((extension) => {
	      let configurations = extensions[extension];
	      if (!Array.isArray(configurations)) configurations = [configurations];
	      return configurations
	        .map((params) => {
	          return [extension]
	            .concat(
	              Object.keys(params).map((k) => {
	                let values = params[k];
	                if (!Array.isArray(values)) values = [values];
	                return values
	                  .map((v) => (v === true ? k : `${k}=${v}`))
	                  .join('; ');
	              })
	            )
	            .join('; ');
	        })
	        .join(', ');
	    })
	    .join(', ');
	}

	var extension = { format: format$1, parse: parse$2 };

	const { randomBytes, createHash: createHash$1 } = crypto__default["default"];
	const { URL: URL$1 } = url__default["default"];




	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  GUID: GUID$1,
	  kForOnEventAttribute,
	  kListener,
	  kStatusCode,
	  kWebSocket: kWebSocket$1,
	  NOOP
	} = constants;
	const {
	  EventTarget: { addEventListener: addEventListener$1, removeEventListener: removeEventListener$1 }
	} = eventTarget;
	const { format, parse: parse$1 } = extension;
	const { toBuffer } = bufferUtil;

	const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
	const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
	const protocolVersions = [8, 13];
	const closeTimeout = 30 * 1000;

	/**
	 * Class representing a WebSocket.
	 *
	 * @extends EventEmitter
	 */
	class WebSocket$1 extends events__default["default"] {
	  /**
	   * Create a new `WebSocket`.
	   *
	   * @param {(String|URL)} address The URL to which to connect
	   * @param {(String|String[])} [protocols] The subprotocols
	   * @param {Object} [options] Connection options
	   */
	  constructor(address, protocols, options) {
	    super();

	    this._binaryType = BINARY_TYPES[0];
	    this._closeCode = 1006;
	    this._closeFrameReceived = false;
	    this._closeFrameSent = false;
	    this._closeMessage = EMPTY_BUFFER;
	    this._closeTimer = null;
	    this._extensions = {};
	    this._protocol = '';
	    this._readyState = WebSocket$1.CONNECTING;
	    this._receiver = null;
	    this._sender = null;
	    this._socket = null;

	    if (address !== null) {
	      this._bufferedAmount = 0;
	      this._isServer = false;
	      this._redirects = 0;

	      if (protocols === undefined) {
	        protocols = [];
	      } else if (!Array.isArray(protocols)) {
	        if (typeof protocols === 'object' && protocols !== null) {
	          options = protocols;
	          protocols = [];
	        } else {
	          protocols = [protocols];
	        }
	      }

	      initAsClient(this, address, protocols, options);
	    } else {
	      this._isServer = true;
	    }
	  }

	  /**
	   * This deviates from the WHATWG interface since ws doesn't support the
	   * required default "blob" type (instead we define a custom "nodebuffer"
	   * type).
	   *
	   * @type {String}
	   */
	  get binaryType() {
	    return this._binaryType;
	  }

	  set binaryType(type) {
	    if (!BINARY_TYPES.includes(type)) return;

	    this._binaryType = type;

	    //
	    // Allow to change `binaryType` on the fly.
	    //
	    if (this._receiver) this._receiver._binaryType = type;
	  }

	  /**
	   * @type {Number}
	   */
	  get bufferedAmount() {
	    if (!this._socket) return this._bufferedAmount;

	    return this._socket._writableState.length + this._sender._bufferedBytes;
	  }

	  /**
	   * @type {String}
	   */
	  get extensions() {
	    return Object.keys(this._extensions).join();
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onclose() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onerror() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onopen() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onmessage() {
	    return null;
	  }

	  /**
	   * @type {String}
	   */
	  get protocol() {
	    return this._protocol;
	  }

	  /**
	   * @type {Number}
	   */
	  get readyState() {
	    return this._readyState;
	  }

	  /**
	   * @type {String}
	   */
	  get url() {
	    return this._url;
	  }

	  /**
	   * Set up the socket and the internal resources.
	   *
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Object} options Options object
	   * @param {Number} [options.maxPayload=0] The maximum allowed message size
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @private
	   */
	  setSocket(socket, head, options) {
	    const receiver$1 = new receiver({
	      binaryType: this.binaryType,
	      extensions: this._extensions,
	      isServer: this._isServer,
	      maxPayload: options.maxPayload,
	      skipUTF8Validation: options.skipUTF8Validation
	    });

	    this._sender = new sender(socket, this._extensions);
	    this._receiver = receiver$1;
	    this._socket = socket;

	    receiver$1[kWebSocket$1] = this;
	    socket[kWebSocket$1] = this;

	    receiver$1.on('conclude', receiverOnConclude);
	    receiver$1.on('drain', receiverOnDrain);
	    receiver$1.on('error', receiverOnError);
	    receiver$1.on('message', receiverOnMessage);
	    receiver$1.on('ping', receiverOnPing);
	    receiver$1.on('pong', receiverOnPong);

	    socket.setTimeout(0);
	    socket.setNoDelay();

	    if (head.length > 0) socket.unshift(head);

	    socket.on('close', socketOnClose);
	    socket.on('data', socketOnData);
	    socket.on('end', socketOnEnd);
	    socket.on('error', socketOnError$1);

	    this._readyState = WebSocket$1.OPEN;
	    this.emit('open');
	  }

	  /**
	   * Emit the `'close'` event.
	   *
	   * @private
	   */
	  emitClose() {
	    if (!this._socket) {
	      this._readyState = WebSocket$1.CLOSED;
	      this.emit('close', this._closeCode, this._closeMessage);
	      return;
	    }

	    if (this._extensions[permessageDeflate.extensionName]) {
	      this._extensions[permessageDeflate.extensionName].cleanup();
	    }

	    this._receiver.removeAllListeners();
	    this._readyState = WebSocket$1.CLOSED;
	    this.emit('close', this._closeCode, this._closeMessage);
	  }

	  /**
	   * Start a closing handshake.
	   *
	   *          +----------+   +-----------+   +----------+
	   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
	   *    |     +----------+   +-----------+   +----------+     |
	   *          +----------+   +-----------+         |
	   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
	   *          +----------+   +-----------+   |
	   *    |           |                        |   +---+        |
	   *                +------------------------+-->|fin| - - - -
	   *    |         +---+                      |   +---+
	   *     - - - - -|fin|<---------------------+
	   *              +---+
	   *
	   * @param {Number} [code] Status code explaining why the connection is closing
	   * @param {(String|Buffer)} [data] The reason why the connection is
	   *     closing
	   * @public
	   */
	  close(code, data) {
	    if (this.readyState === WebSocket$1.CLOSED) return;
	    if (this.readyState === WebSocket$1.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      return abortHandshake$1(this, this._req, msg);
	    }

	    if (this.readyState === WebSocket$1.CLOSING) {
	      if (
	        this._closeFrameSent &&
	        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
	      ) {
	        this._socket.end();
	      }

	      return;
	    }

	    this._readyState = WebSocket$1.CLOSING;
	    this._sender.close(code, data, !this._isServer, (err) => {
	      //
	      // This error is handled by the `'error'` listener on the socket. We only
	      // want to know if the close frame has been sent here.
	      //
	      if (err) return;

	      this._closeFrameSent = true;

	      if (
	        this._closeFrameReceived ||
	        this._receiver._writableState.errorEmitted
	      ) {
	        this._socket.end();
	      }
	    });

	    //
	    // Specify a timeout for the closing handshake to complete.
	    //
	    this._closeTimer = setTimeout(
	      this._socket.destroy.bind(this._socket),
	      closeTimeout
	    );
	  }

	  /**
	   * Send a ping.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the ping is sent
	   * @public
	   */
	  ping(data, mask, cb) {
	    if (this.readyState === WebSocket$1.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket$1.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Send a pong.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the pong is sent
	   * @public
	   */
	  pong(data, mask, cb) {
	    if (this.readyState === WebSocket$1.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket$1.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Send a data message.
	   *
	   * @param {*} data The message to send
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
	   *     text
	   * @param {Boolean} [options.compress] Specifies whether or not to compress
	   *     `data`
	   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when data is written out
	   * @public
	   */
	  send(data, options, cb) {
	    if (this.readyState === WebSocket$1.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof options === 'function') {
	      cb = options;
	      options = {};
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket$1.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    const opts = {
	      binary: typeof data !== 'string',
	      mask: !this._isServer,
	      compress: true,
	      fin: true,
	      ...options
	    };

	    if (!this._extensions[permessageDeflate.extensionName]) {
	      opts.compress = false;
	    }

	    this._sender.send(data || EMPTY_BUFFER, opts, cb);
	  }

	  /**
	   * Forcibly close the connection.
	   *
	   * @public
	   */
	  terminate() {
	    if (this.readyState === WebSocket$1.CLOSED) return;
	    if (this.readyState === WebSocket$1.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      return abortHandshake$1(this, this._req, msg);
	    }

	    if (this._socket) {
	      this._readyState = WebSocket$1.CLOSING;
	      this._socket.destroy();
	    }
	  }
	}

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket$1, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket$1.prototype, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket$1, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket$1.prototype, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket$1, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket$1.prototype, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket$1, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket$1.prototype, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	[
	  'binaryType',
	  'bufferedAmount',
	  'extensions',
	  'protocol',
	  'readyState',
	  'url'
	].forEach((property) => {
	  Object.defineProperty(WebSocket$1.prototype, property, { enumerable: true });
	});

	//
	// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
	// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
	//
	['open', 'error', 'close', 'message'].forEach((method) => {
	  Object.defineProperty(WebSocket$1.prototype, `on${method}`, {
	    enumerable: true,
	    get() {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) return listener[kListener];
	      }

	      return null;
	    },
	    set(handler) {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) {
	          this.removeListener(method, listener);
	          break;
	        }
	      }

	      if (typeof handler !== 'function') return;

	      this.addEventListener(method, handler, {
	        [kForOnEventAttribute]: true
	      });
	    }
	  });
	});

	WebSocket$1.prototype.addEventListener = addEventListener$1;
	WebSocket$1.prototype.removeEventListener = removeEventListener$1;

	var websocket = WebSocket$1;

	/**
	 * Initialize a WebSocket client.
	 *
	 * @param {WebSocket} websocket The client to initialize
	 * @param {(String|URL)} address The URL to which to connect
	 * @param {Array} protocols The subprotocols
	 * @param {Object} [options] Connection options
	 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
	 *     redirects
	 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	 *     handshake request
	 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	 *     size
	 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
	 *     allowed
	 * @param {String} [options.origin] Value of the `Origin` or
	 *     `Sec-WebSocket-Origin` header
	 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	 *     permessage-deflate
	 * @param {Number} [options.protocolVersion=13] Value of the
	 *     `Sec-WebSocket-Version` header
	 * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	 *     not to skip UTF-8 validation for text and close messages
	 * @private
	 */
	function initAsClient(websocket, address, protocols, options) {
	  const opts = {
	    protocolVersion: protocolVersions[1],
	    maxPayload: 100 * 1024 * 1024,
	    skipUTF8Validation: false,
	    perMessageDeflate: true,
	    followRedirects: false,
	    maxRedirects: 10,
	    ...options,
	    createConnection: undefined,
	    socketPath: undefined,
	    hostname: undefined,
	    protocol: undefined,
	    timeout: undefined,
	    method: undefined,
	    host: undefined,
	    path: undefined,
	    port: undefined
	  };

	  if (!protocolVersions.includes(opts.protocolVersion)) {
	    throw new RangeError(
	      `Unsupported protocol version: ${opts.protocolVersion} ` +
	        `(supported versions: ${protocolVersions.join(', ')})`
	    );
	  }

	  let parsedUrl;

	  if (address instanceof URL$1) {
	    parsedUrl = address;
	    websocket._url = address.href;
	  } else {
	    try {
	      parsedUrl = new URL$1(address);
	    } catch (e) {
	      throw new SyntaxError(`Invalid URL: ${address}`);
	    }

	    websocket._url = address;
	  }

	  const isSecure = parsedUrl.protocol === 'wss:';
	  const isUnixSocket = parsedUrl.protocol === 'ws+unix:';

	  if (parsedUrl.protocol !== 'ws:' && !isSecure && !isUnixSocket) {
	    throw new SyntaxError(
	      'The URL\'s protocol must be one of "ws:", "wss:", or "ws+unix:"'
	    );
	  }

	  if (isUnixSocket && !parsedUrl.pathname) {
	    throw new SyntaxError("The URL's pathname is empty");
	  }

	  if (parsedUrl.hash) {
	    throw new SyntaxError('The URL contains a fragment identifier');
	  }

	  const defaultPort = isSecure ? 443 : 80;
	  const key = randomBytes(16).toString('base64');
	  const get = isSecure ? https__default["default"].get : http__default["default"].get;
	  const protocolSet = new Set();
	  let perMessageDeflate;

	  opts.createConnection = isSecure ? tlsConnect : netConnect;
	  opts.defaultPort = opts.defaultPort || defaultPort;
	  opts.port = parsedUrl.port || defaultPort;
	  opts.host = parsedUrl.hostname.startsWith('[')
	    ? parsedUrl.hostname.slice(1, -1)
	    : parsedUrl.hostname;
	  opts.headers = {
	    'Sec-WebSocket-Version': opts.protocolVersion,
	    'Sec-WebSocket-Key': key,
	    Connection: 'Upgrade',
	    Upgrade: 'websocket',
	    ...opts.headers
	  };
	  opts.path = parsedUrl.pathname + parsedUrl.search;
	  opts.timeout = opts.handshakeTimeout;

	  if (opts.perMessageDeflate) {
	    perMessageDeflate = new permessageDeflate(
	      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
	      false,
	      opts.maxPayload
	    );
	    opts.headers['Sec-WebSocket-Extensions'] = format({
	      [permessageDeflate.extensionName]: perMessageDeflate.offer()
	    });
	  }
	  if (protocols.length) {
	    for (const protocol of protocols) {
	      if (
	        typeof protocol !== 'string' ||
	        !subprotocolRegex.test(protocol) ||
	        protocolSet.has(protocol)
	      ) {
	        throw new SyntaxError(
	          'An invalid or duplicated subprotocol was specified'
	        );
	      }

	      protocolSet.add(protocol);
	    }

	    opts.headers['Sec-WebSocket-Protocol'] = protocols.join(',');
	  }
	  if (opts.origin) {
	    if (opts.protocolVersion < 13) {
	      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
	    } else {
	      opts.headers.Origin = opts.origin;
	    }
	  }
	  if (parsedUrl.username || parsedUrl.password) {
	    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
	  }

	  if (isUnixSocket) {
	    const parts = opts.path.split(':');

	    opts.socketPath = parts[0];
	    opts.path = parts[1];
	  }

	  let req = (websocket._req = get(opts));

	  if (opts.timeout) {
	    req.on('timeout', () => {
	      abortHandshake$1(websocket, req, 'Opening handshake has timed out');
	    });
	  }

	  req.on('error', (err) => {
	    if (req === null || req.aborted) return;

	    req = websocket._req = null;
	    websocket._readyState = WebSocket$1.CLOSING;
	    websocket.emit('error', err);
	    websocket.emitClose();
	  });

	  req.on('response', (res) => {
	    const location = res.headers.location;
	    const statusCode = res.statusCode;

	    if (
	      location &&
	      opts.followRedirects &&
	      statusCode >= 300 &&
	      statusCode < 400
	    ) {
	      if (++websocket._redirects > opts.maxRedirects) {
	        abortHandshake$1(websocket, req, 'Maximum redirects exceeded');
	        return;
	      }

	      req.abort();

	      const addr = new URL$1(location, address);

	      initAsClient(websocket, addr, protocols, options);
	    } else if (!websocket.emit('unexpected-response', req, res)) {
	      abortHandshake$1(
	        websocket,
	        req,
	        `Unexpected server response: ${res.statusCode}`
	      );
	    }
	  });

	  req.on('upgrade', (res, socket, head) => {
	    websocket.emit('upgrade', res);

	    //
	    // The user may have closed the connection from a listener of the `upgrade`
	    // event.
	    //
	    if (websocket.readyState !== WebSocket$1.CONNECTING) return;

	    req = websocket._req = null;

	    const digest = createHash$1('sha1')
	      .update(key + GUID$1)
	      .digest('base64');

	    if (res.headers['sec-websocket-accept'] !== digest) {
	      abortHandshake$1(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
	      return;
	    }

	    const serverProt = res.headers['sec-websocket-protocol'];
	    let protError;

	    if (serverProt !== undefined) {
	      if (!protocolSet.size) {
	        protError = 'Server sent a subprotocol but none was requested';
	      } else if (!protocolSet.has(serverProt)) {
	        protError = 'Server sent an invalid subprotocol';
	      }
	    } else if (protocolSet.size) {
	      protError = 'Server sent no subprotocol';
	    }

	    if (protError) {
	      abortHandshake$1(websocket, socket, protError);
	      return;
	    }

	    if (serverProt) websocket._protocol = serverProt;

	    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

	    if (secWebSocketExtensions !== undefined) {
	      if (!perMessageDeflate) {
	        const message =
	          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
	          'was requested';
	        abortHandshake$1(websocket, socket, message);
	        return;
	      }

	      let extensions;

	      try {
	        extensions = parse$1(secWebSocketExtensions);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake$1(websocket, socket, message);
	        return;
	      }

	      const extensionNames = Object.keys(extensions);

	      if (
	        extensionNames.length !== 1 ||
	        extensionNames[0] !== permessageDeflate.extensionName
	      ) {
	        const message = 'Server indicated an extension that was not requested';
	        abortHandshake$1(websocket, socket, message);
	        return;
	      }

	      try {
	        perMessageDeflate.accept(extensions[permessageDeflate.extensionName]);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake$1(websocket, socket, message);
	        return;
	      }

	      websocket._extensions[permessageDeflate.extensionName] =
	        perMessageDeflate;
	    }

	    websocket.setSocket(socket, head, {
	      maxPayload: opts.maxPayload,
	      skipUTF8Validation: opts.skipUTF8Validation
	    });
	  });
	}

	/**
	 * Create a `net.Socket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {net.Socket} The newly created socket used to start the connection
	 * @private
	 */
	function netConnect(options) {
	  options.path = options.socketPath;
	  return net__default["default"].connect(options);
	}

	/**
	 * Create a `tls.TLSSocket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {tls.TLSSocket} The newly created socket used to start the connection
	 * @private
	 */
	function tlsConnect(options) {
	  options.path = undefined;

	  if (!options.servername && options.servername !== '') {
	    options.servername = net__default["default"].isIP(options.host) ? '' : options.host;
	  }

	  return tls__default["default"].connect(options);
	}

	/**
	 * Abort the handshake and emit an error.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	 *     abort or the socket to destroy
	 * @param {String} message The error message
	 * @private
	 */
	function abortHandshake$1(websocket, stream, message) {
	  websocket._readyState = WebSocket$1.CLOSING;

	  const err = new Error(message);
	  Error.captureStackTrace(err, abortHandshake$1);

	  if (stream.setHeader) {
	    stream.abort();

	    if (stream.socket && !stream.socket.destroyed) {
	      //
	      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
	      // called after the request completed. See
	      // https://github.com/websockets/ws/issues/1869.
	      //
	      stream.socket.destroy();
	    }

	    stream.once('abort', websocket.emitClose.bind(websocket));
	    websocket.emit('error', err);
	  } else {
	    stream.destroy(err);
	    stream.once('error', websocket.emit.bind(websocket, 'error'));
	    stream.once('close', websocket.emitClose.bind(websocket));
	  }
	}

	/**
	 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {*} [data] The data to send
	 * @param {Function} [cb] Callback
	 * @private
	 */
	function sendAfterClose(websocket, data, cb) {
	  if (data) {
	    const length = toBuffer(data).length;

	    //
	    // The `_bufferedAmount` property is used only when the peer is a client and
	    // the opening handshake fails. Under these circumstances, in fact, the
	    // `setSocket()` method is not called, so the `_socket` and `_sender`
	    // properties are set to `null`.
	    //
	    if (websocket._socket) websocket._sender._bufferedBytes += length;
	    else websocket._bufferedAmount += length;
	  }

	  if (cb) {
	    const err = new Error(
	      `WebSocket is not open: readyState ${websocket.readyState} ` +
	        `(${readyStates[websocket.readyState]})`
	    );
	    cb(err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'conclude'` event.
	 *
	 * @param {Number} code The status code
	 * @param {Buffer} reason The reason for closing
	 * @private
	 */
	function receiverOnConclude(code, reason) {
	  const websocket = this[kWebSocket$1];

	  websocket._closeFrameReceived = true;
	  websocket._closeMessage = reason;
	  websocket._closeCode = code;

	  if (websocket._socket[kWebSocket$1] === undefined) return;

	  websocket._socket.removeListener('data', socketOnData);
	  process.nextTick(resume, websocket._socket);

	  if (code === 1005) websocket.close();
	  else websocket.close(code, reason);
	}

	/**
	 * The listener of the `Receiver` `'drain'` event.
	 *
	 * @private
	 */
	function receiverOnDrain() {
	  this[kWebSocket$1]._socket.resume();
	}

	/**
	 * The listener of the `Receiver` `'error'` event.
	 *
	 * @param {(RangeError|Error)} err The emitted error
	 * @private
	 */
	function receiverOnError(err) {
	  const websocket = this[kWebSocket$1];

	  if (websocket._socket[kWebSocket$1] !== undefined) {
	    websocket._socket.removeListener('data', socketOnData);

	    //
	    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
	    // https://github.com/websockets/ws/issues/1940.
	    //
	    process.nextTick(resume, websocket._socket);

	    websocket.close(err[kStatusCode]);
	  }

	  websocket.emit('error', err);
	}

	/**
	 * The listener of the `Receiver` `'finish'` event.
	 *
	 * @private
	 */
	function receiverOnFinish() {
	  this[kWebSocket$1].emitClose();
	}

	/**
	 * The listener of the `Receiver` `'message'` event.
	 *
	 * @param {Buffer|ArrayBuffer|Buffer[])} data The message
	 * @param {Boolean} isBinary Specifies whether the message is binary or not
	 * @private
	 */
	function receiverOnMessage(data, isBinary) {
	  this[kWebSocket$1].emit('message', data, isBinary);
	}

	/**
	 * The listener of the `Receiver` `'ping'` event.
	 *
	 * @param {Buffer} data The data included in the ping frame
	 * @private
	 */
	function receiverOnPing(data) {
	  const websocket = this[kWebSocket$1];

	  websocket.pong(data, !websocket._isServer, NOOP);
	  websocket.emit('ping', data);
	}

	/**
	 * The listener of the `Receiver` `'pong'` event.
	 *
	 * @param {Buffer} data The data included in the pong frame
	 * @private
	 */
	function receiverOnPong(data) {
	  this[kWebSocket$1].emit('pong', data);
	}

	/**
	 * Resume a readable stream
	 *
	 * @param {Readable} stream The readable stream
	 * @private
	 */
	function resume(stream) {
	  stream.resume();
	}

	/**
	 * The listener of the `net.Socket` `'close'` event.
	 *
	 * @private
	 */
	function socketOnClose() {
	  const websocket = this[kWebSocket$1];

	  this.removeListener('close', socketOnClose);
	  this.removeListener('data', socketOnData);
	  this.removeListener('end', socketOnEnd);

	  websocket._readyState = WebSocket$1.CLOSING;

	  let chunk;

	  //
	  // The close frame might not have been received or the `'end'` event emitted,
	  // for example, if the socket was destroyed due to an error. Ensure that the
	  // `receiver` stream is closed after writing any remaining buffered data to
	  // it. If the readable side of the socket is in flowing mode then there is no
	  // buffered data as everything has been already written and `readable.read()`
	  // will return `null`. If instead, the socket is paused, any possible buffered
	  // data will be read as a single chunk.
	  //
	  if (
	    !this._readableState.endEmitted &&
	    !websocket._closeFrameReceived &&
	    !websocket._receiver._writableState.errorEmitted &&
	    (chunk = websocket._socket.read()) !== null
	  ) {
	    websocket._receiver.write(chunk);
	  }

	  websocket._receiver.end();

	  this[kWebSocket$1] = undefined;

	  clearTimeout(websocket._closeTimer);

	  if (
	    websocket._receiver._writableState.finished ||
	    websocket._receiver._writableState.errorEmitted
	  ) {
	    websocket.emitClose();
	  } else {
	    websocket._receiver.on('error', receiverOnFinish);
	    websocket._receiver.on('finish', receiverOnFinish);
	  }
	}

	/**
	 * The listener of the `net.Socket` `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function socketOnData(chunk) {
	  if (!this[kWebSocket$1]._receiver.write(chunk)) {
	    this.pause();
	  }
	}

	/**
	 * The listener of the `net.Socket` `'end'` event.
	 *
	 * @private
	 */
	function socketOnEnd() {
	  const websocket = this[kWebSocket$1];

	  websocket._readyState = WebSocket$1.CLOSING;
	  websocket._receiver.end();
	  this.end();
	}

	/**
	 * The listener of the `net.Socket` `'error'` event.
	 *
	 * @private
	 */
	function socketOnError$1() {
	  const websocket = this[kWebSocket$1];

	  this.removeListener('error', socketOnError$1);
	  this.on('error', NOOP);

	  if (websocket) {
	    websocket._readyState = WebSocket$1.CLOSING;
	    this.destroy();
	  }
	}

	const { Duplex } = stream__default["default"];

	/**
	 * Emits the `'close'` event on a stream.
	 *
	 * @param {Duplex} stream The stream.
	 * @private
	 */
	function emitClose$1(stream) {
	  stream.emit('close');
	}

	/**
	 * The listener of the `'end'` event.
	 *
	 * @private
	 */
	function duplexOnEnd() {
	  if (!this.destroyed && this._writableState.finished) {
	    this.destroy();
	  }
	}

	/**
	 * The listener of the `'error'` event.
	 *
	 * @param {Error} err The error
	 * @private
	 */
	function duplexOnError(err) {
	  this.removeListener('error', duplexOnError);
	  this.destroy();
	  if (this.listenerCount('error') === 0) {
	    // Do not suppress the throwing behavior.
	    this.emit('error', err);
	  }
	}

	/**
	 * Wraps a `WebSocket` in a duplex stream.
	 *
	 * @param {WebSocket} ws The `WebSocket` to wrap
	 * @param {Object} [options] The options for the `Duplex` constructor
	 * @return {Duplex} The duplex stream
	 * @public
	 */
	function createWebSocketStream(ws, options) {
	  let resumeOnReceiverDrain = true;
	  let terminateOnDestroy = true;

	  function receiverOnDrain() {
	    if (resumeOnReceiverDrain) ws._socket.resume();
	  }

	  if (ws.readyState === ws.CONNECTING) {
	    ws.once('open', function open() {
	      ws._receiver.removeAllListeners('drain');
	      ws._receiver.on('drain', receiverOnDrain);
	    });
	  } else {
	    ws._receiver.removeAllListeners('drain');
	    ws._receiver.on('drain', receiverOnDrain);
	  }

	  const duplex = new Duplex({
	    ...options,
	    autoDestroy: false,
	    emitClose: false,
	    objectMode: false,
	    writableObjectMode: false
	  });

	  ws.on('message', function message(msg, isBinary) {
	    const data =
	      !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;

	    if (!duplex.push(data)) {
	      resumeOnReceiverDrain = false;
	      ws._socket.pause();
	    }
	  });

	  ws.once('error', function error(err) {
	    if (duplex.destroyed) return;

	    // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
	    //
	    // - If the `'error'` event is emitted before the `'open'` event, then
	    //   `ws.terminate()` is a noop as no socket is assigned.
	    // - Otherwise, the error is re-emitted by the listener of the `'error'`
	    //   event of the `Receiver` object. The listener already closes the
	    //   connection by calling `ws.close()`. This allows a close frame to be
	    //   sent to the other peer. If `ws.terminate()` is called right after this,
	    //   then the close frame might not be sent.
	    terminateOnDestroy = false;
	    duplex.destroy(err);
	  });

	  ws.once('close', function close() {
	    if (duplex.destroyed) return;

	    duplex.push(null);
	  });

	  duplex._destroy = function (err, callback) {
	    if (ws.readyState === ws.CLOSED) {
	      callback(err);
	      process.nextTick(emitClose$1, duplex);
	      return;
	    }

	    let called = false;

	    ws.once('error', function error(err) {
	      called = true;
	      callback(err);
	    });

	    ws.once('close', function close() {
	      if (!called) callback(err);
	      process.nextTick(emitClose$1, duplex);
	    });

	    if (terminateOnDestroy) ws.terminate();
	  };

	  duplex._final = function (callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._final(callback);
	      });
	      return;
	    }

	    // If the value of the `_socket` property is `null` it means that `ws` is a
	    // client websocket and the handshake failed. In fact, when this happens, a
	    // socket is never assigned to the websocket. Wait for the `'error'` event
	    // that will be emitted by the websocket.
	    if (ws._socket === null) return;

	    if (ws._socket._writableState.finished) {
	      callback();
	      if (duplex._readableState.endEmitted) duplex.destroy();
	    } else {
	      ws._socket.once('finish', function finish() {
	        // `duplex` is not destroyed here because the `'end'` event will be
	        // emitted on `duplex` after this `'finish'` event. The EOF signaling
	        // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
	        callback();
	      });
	      ws.close();
	    }
	  };

	  duplex._read = function () {
	    if (ws.readyState === ws.OPEN && !resumeOnReceiverDrain) {
	      resumeOnReceiverDrain = true;
	      if (!ws._receiver._writableState.needDrain) ws._socket.resume();
	    }
	  };

	  duplex._write = function (chunk, encoding, callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._write(chunk, encoding, callback);
	      });
	      return;
	    }

	    ws.send(chunk, callback);
	  };

	  duplex.on('end', duplexOnEnd);
	  duplex.on('error', duplexOnError);
	  return duplex;
	}

	var stream = createWebSocketStream;

	const { tokenChars } = validation;

	/**
	 * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	 *
	 * @param {String} header The field value of the header
	 * @return {Set} The subprotocol names
	 * @public
	 */
	function parse(header) {
	  const protocols = new Set();
	  let start = -1;
	  let end = -1;
	  let i = 0;

	  for (i; i < header.length; i++) {
	    const code = header.charCodeAt(i);

	    if (end === -1 && tokenChars[code] === 1) {
	      if (start === -1) start = i;
	    } else if (
	      i !== 0 &&
	      (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	    ) {
	      if (end === -1 && start !== -1) end = i;
	    } else if (code === 0x2c /* ',' */) {
	      if (start === -1) {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }

	      if (end === -1) end = i;

	      const protocol = header.slice(start, end);

	      if (protocols.has(protocol)) {
	        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	      }

	      protocols.add(protocol);
	      start = end = -1;
	    } else {
	      throw new SyntaxError(`Unexpected character at index ${i}`);
	    }
	  }

	  if (start === -1 || end !== -1) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  const protocol = header.slice(start, i);

	  if (protocols.has(protocol)) {
	    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	  }

	  protocols.add(protocol);
	  return protocols;
	}

	var subprotocol = { parse };

	const { createHash } = crypto__default["default"];





	const { GUID, kWebSocket } = constants;

	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;

	/**
	 * Class representing a WebSocket server.
	 *
	 * @extends EventEmitter
	 */
	class WebSocketServer extends events__default["default"] {
	  /**
	   * Create a `WebSocketServer` instance.
	   *
	   * @param {Object} options Configuration options
	   * @param {Number} [options.backlog=511] The maximum length of the queue of
	   *     pending connections
	   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
	   *     track clients
	   * @param {Function} [options.handleProtocols] A hook to handle protocols
	   * @param {String} [options.host] The hostname where to bind the server
	   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	   *     size
	   * @param {Boolean} [options.noServer=false] Enable no server mode
	   * @param {String} [options.path] Accept only connections matching this path
	   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
	   *     permessage-deflate
	   * @param {Number} [options.port] The port where to bind the server
	   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
	   *     server to use
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @param {Function} [options.verifyClient] A hook to reject connections
	   * @param {Function} [callback] A listener for the `listening` event
	   */
	  constructor(options, callback) {
	    super();

	    options = {
	      maxPayload: 100 * 1024 * 1024,
	      skipUTF8Validation: false,
	      perMessageDeflate: false,
	      handleProtocols: null,
	      clientTracking: true,
	      verifyClient: null,
	      noServer: false,
	      backlog: null, // use default (511 as implemented in net.js)
	      server: null,
	      host: null,
	      path: null,
	      port: null,
	      ...options
	    };

	    if (
	      (options.port == null && !options.server && !options.noServer) ||
	      (options.port != null && (options.server || options.noServer)) ||
	      (options.server && options.noServer)
	    ) {
	      throw new TypeError(
	        'One and only one of the "port", "server", or "noServer" options ' +
	          'must be specified'
	      );
	    }

	    if (options.port != null) {
	      this._server = http__default["default"].createServer((req, res) => {
	        const body = http__default["default"].STATUS_CODES[426];

	        res.writeHead(426, {
	          'Content-Length': body.length,
	          'Content-Type': 'text/plain'
	        });
	        res.end(body);
	      });
	      this._server.listen(
	        options.port,
	        options.host,
	        options.backlog,
	        callback
	      );
	    } else if (options.server) {
	      this._server = options.server;
	    }

	    if (this._server) {
	      const emitConnection = this.emit.bind(this, 'connection');

	      this._removeListeners = addListeners(this._server, {
	        listening: this.emit.bind(this, 'listening'),
	        error: this.emit.bind(this, 'error'),
	        upgrade: (req, socket, head) => {
	          this.handleUpgrade(req, socket, head, emitConnection);
	        }
	      });
	    }

	    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
	    if (options.clientTracking) {
	      this.clients = new Set();
	      this._shouldEmitClose = false;
	    }

	    this.options = options;
	    this._state = RUNNING;
	  }

	  /**
	   * Returns the bound address, the address family name, and port of the server
	   * as reported by the operating system if listening on an IP socket.
	   * If the server is listening on a pipe or UNIX domain socket, the name is
	   * returned as a string.
	   *
	   * @return {(Object|String|null)} The address of the server
	   * @public
	   */
	  address() {
	    if (this.options.noServer) {
	      throw new Error('The server is operating in "noServer" mode');
	    }

	    if (!this._server) return null;
	    return this._server.address();
	  }

	  /**
	   * Stop the server from accepting new connections and emit the `'close'` event
	   * when all existing connections are closed.
	   *
	   * @param {Function} [cb] A one-time listener for the `'close'` event
	   * @public
	   */
	  close(cb) {
	    if (this._state === CLOSED) {
	      if (cb) {
	        this.once('close', () => {
	          cb(new Error('The server is not running'));
	        });
	      }

	      process.nextTick(emitClose, this);
	      return;
	    }

	    if (cb) this.once('close', cb);

	    if (this._state === CLOSING) return;
	    this._state = CLOSING;

	    if (this.options.noServer || this.options.server) {
	      if (this._server) {
	        this._removeListeners();
	        this._removeListeners = this._server = null;
	      }

	      if (this.clients) {
	        if (!this.clients.size) {
	          process.nextTick(emitClose, this);
	        } else {
	          this._shouldEmitClose = true;
	        }
	      } else {
	        process.nextTick(emitClose, this);
	      }
	    } else {
	      const server = this._server;

	      this._removeListeners();
	      this._removeListeners = this._server = null;

	      //
	      // The HTTP/S server was created internally. Close it, and rely on its
	      // `'close'` event.
	      //
	      server.close(() => {
	        emitClose(this);
	      });
	    }
	  }

	  /**
	   * See if a given request should be handled by this server instance.
	   *
	   * @param {http.IncomingMessage} req Request object to inspect
	   * @return {Boolean} `true` if the request is valid, else `false`
	   * @public
	   */
	  shouldHandle(req) {
	    if (this.options.path) {
	      const index = req.url.indexOf('?');
	      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

	      if (pathname !== this.options.path) return false;
	    }

	    return true;
	  }

	  /**
	   * Handle a HTTP Upgrade request.
	   *
	   * @param {http.IncomingMessage} req The request object
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @public
	   */
	  handleUpgrade(req, socket, head, cb) {
	    socket.on('error', socketOnError);

	    const key =
	      req.headers['sec-websocket-key'] !== undefined
	        ? req.headers['sec-websocket-key']
	        : false;
	    const version = +req.headers['sec-websocket-version'];

	    if (
	      req.method !== 'GET' ||
	      req.headers.upgrade.toLowerCase() !== 'websocket' ||
	      !key ||
	      !keyRegex.test(key) ||
	      (version !== 8 && version !== 13) ||
	      !this.shouldHandle(req)
	    ) {
	      return abortHandshake(socket, 400);
	    }

	    const secWebSocketProtocol = req.headers['sec-websocket-protocol'];
	    let protocols = new Set();

	    if (secWebSocketProtocol !== undefined) {
	      try {
	        protocols = subprotocol.parse(secWebSocketProtocol);
	      } catch (err) {
	        return abortHandshake(socket, 400);
	      }
	    }

	    const secWebSocketExtensions = req.headers['sec-websocket-extensions'];
	    const extensions = {};

	    if (
	      this.options.perMessageDeflate &&
	      secWebSocketExtensions !== undefined
	    ) {
	      const perMessageDeflate = new permessageDeflate(
	        this.options.perMessageDeflate,
	        true,
	        this.options.maxPayload
	      );

	      try {
	        const offers = extension.parse(secWebSocketExtensions);

	        if (offers[permessageDeflate.extensionName]) {
	          perMessageDeflate.accept(offers[permessageDeflate.extensionName]);
	          extensions[permessageDeflate.extensionName] = perMessageDeflate;
	        }
	      } catch (err) {
	        return abortHandshake(socket, 400);
	      }
	    }

	    //
	    // Optionally call external client verification handler.
	    //
	    if (this.options.verifyClient) {
	      const info = {
	        origin:
	          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
	        secure: !!(req.socket.authorized || req.socket.encrypted),
	        req
	      };

	      if (this.options.verifyClient.length === 2) {
	        this.options.verifyClient(info, (verified, code, message, headers) => {
	          if (!verified) {
	            return abortHandshake(socket, code || 401, message, headers);
	          }

	          this.completeUpgrade(
	            extensions,
	            key,
	            protocols,
	            req,
	            socket,
	            head,
	            cb
	          );
	        });
	        return;
	      }

	      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
	    }

	    this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
	  }

	  /**
	   * Upgrade the connection to WebSocket.
	   *
	   * @param {Object} extensions The accepted extensions
	   * @param {String} key The value of the `Sec-WebSocket-Key` header
	   * @param {Set} protocols The subprotocols
	   * @param {http.IncomingMessage} req The request object
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @throws {Error} If called more than once with the same socket
	   * @private
	   */
	  completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
	    //
	    // Destroy the socket if the client has already sent a FIN packet.
	    //
	    if (!socket.readable || !socket.writable) return socket.destroy();

	    if (socket[kWebSocket]) {
	      throw new Error(
	        'server.handleUpgrade() was called more than once with the same ' +
	          'socket, possibly due to a misconfiguration'
	      );
	    }

	    if (this._state > RUNNING) return abortHandshake(socket, 503);

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    const headers = [
	      'HTTP/1.1 101 Switching Protocols',
	      'Upgrade: websocket',
	      'Connection: Upgrade',
	      `Sec-WebSocket-Accept: ${digest}`
	    ];

	    const ws = new websocket(null);

	    if (protocols.size) {
	      //
	      // Optionally call external protocol selection handler.
	      //
	      const protocol = this.options.handleProtocols
	        ? this.options.handleProtocols(protocols, req)
	        : protocols.values().next().value;

	      if (protocol) {
	        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
	        ws._protocol = protocol;
	      }
	    }

	    if (extensions[permessageDeflate.extensionName]) {
	      const params = extensions[permessageDeflate.extensionName].params;
	      const value = extension.format({
	        [permessageDeflate.extensionName]: [params]
	      });
	      headers.push(`Sec-WebSocket-Extensions: ${value}`);
	      ws._extensions = extensions;
	    }

	    //
	    // Allow external modification/inspection of handshake headers.
	    //
	    this.emit('headers', headers, req);

	    socket.write(headers.concat('\r\n').join('\r\n'));
	    socket.removeListener('error', socketOnError);

	    ws.setSocket(socket, head, {
	      maxPayload: this.options.maxPayload,
	      skipUTF8Validation: this.options.skipUTF8Validation
	    });

	    if (this.clients) {
	      this.clients.add(ws);
	      ws.on('close', () => {
	        this.clients.delete(ws);

	        if (this._shouldEmitClose && !this.clients.size) {
	          process.nextTick(emitClose, this);
	        }
	      });
	    }

	    cb(ws, req);
	  }
	}

	var websocketServer = WebSocketServer;

	/**
	 * Add event listeners on an `EventEmitter` using a map of <event, listener>
	 * pairs.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @param {Object.<String, Function>} map The listeners to add
	 * @return {Function} A function that will remove the added listeners when
	 *     called
	 * @private
	 */
	function addListeners(server, map) {
	  for (const event of Object.keys(map)) server.on(event, map[event]);

	  return function removeListeners() {
	    for (const event of Object.keys(map)) {
	      server.removeListener(event, map[event]);
	    }
	  };
	}

	/**
	 * Emit a `'close'` event on an `EventEmitter`.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @private
	 */
	function emitClose(server) {
	  server._state = CLOSED;
	  server.emit('close');
	}

	/**
	 * Handle premature socket errors.
	 *
	 * @private
	 */
	function socketOnError() {
	  this.destroy();
	}

	/**
	 * Close the connection when preconditions are not fulfilled.
	 *
	 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} [message] The HTTP response body
	 * @param {Object} [headers] Additional HTTP response headers
	 * @private
	 */
	function abortHandshake(socket, code, message, headers) {
	  if (socket.writable) {
	    message = message || http__default["default"].STATUS_CODES[code];
	    headers = {
	      Connection: 'close',
	      'Content-Type': 'text/html',
	      'Content-Length': Buffer.byteLength(message),
	      ...headers
	    };

	    socket.write(
	      `HTTP/1.1 ${code} ${http__default["default"].STATUS_CODES[code]}\r\n` +
	        Object.keys(headers)
	          .map((h) => `${h}: ${headers[h]}`)
	          .join('\r\n') +
	        '\r\n\r\n' +
	        message
	    );
	  }

	  socket.removeListener('error', socketOnError);
	  socket.destroy();
	}

	websocket.createWebSocketStream = stream;
	websocket.Server = websocketServer;
	websocket.Receiver = receiver;
	websocket.Sender = sender;

	websocket.WebSocket = websocket;
	websocket.WebSocketServer = websocket.Server;

	var ws = websocket;

	const WebSocket = ws;
	const usingBrowserWebSocket = false;
	const defaultBinaryType = "nodebuffer";
	const nextTick = process.nextTick;

	// detect ReactNative environment
	const isReactNative = typeof navigator !== "undefined" &&
	    typeof navigator.product === "string" &&
	    navigator.product.toLowerCase() === "reactnative";
	class WS extends Transport {
	    /**
	     * WebSocket transport constructor.
	     *
	     * @api {Object} connection options
	     * @api public
	     */
	    constructor(opts) {
	        super(opts);
	        this.supportsBinary = !opts.forceBase64;
	    }
	    /**
	     * Transport name.
	     *
	     * @api public
	     */
	    get name() {
	        return "websocket";
	    }
	    /**
	     * Opens socket.
	     *
	     * @api private
	     */
	    doOpen() {
	        if (!this.check()) {
	            // let probe timeout
	            return;
	        }
	        const uri = this.uri();
	        const protocols = this.opts.protocols;
	        // React Native only supports the 'headers' option, and will print a warning if anything else is passed
	        const opts = isReactNative
	            ? {}
	            : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
	        if (this.opts.extraHeaders) {
	            opts.headers = this.opts.extraHeaders;
	        }
	        try {
	            this.ws =
	                usingBrowserWebSocket && !isReactNative
	                    ? protocols
	                        ? new WebSocket(uri, protocols)
	                        : new WebSocket(uri)
	                    : new WebSocket(uri, protocols, opts);
	        }
	        catch (err) {
	            return this.emit("error", err);
	        }
	        this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
	        this.addEventListeners();
	    }
	    /**
	     * Adds event listeners to the socket
	     *
	     * @api private
	     */
	    addEventListeners() {
	        this.ws.onopen = () => {
	            if (this.opts.autoUnref) {
	                this.ws._socket.unref();
	            }
	            this.onOpen();
	        };
	        this.ws.onclose = this.onClose.bind(this);
	        this.ws.onmessage = ev => this.onData(ev.data);
	        this.ws.onerror = e => this.onError("websocket error", e);
	    }
	    /**
	     * Writes data to socket.
	     *
	     * @param {Array} array of packets.
	     * @api private
	     */
	    write(packets) {
	        this.writable = false;
	        // encodePacket efficient as it uses WS framing
	        // no need for encodePayload
	        for (let i = 0; i < packets.length; i++) {
	            const packet = packets[i];
	            const lastPacket = i === packets.length - 1;
	            encodePacket(packet, this.supportsBinary, data => {
	                // always create a new object (GH-437)
	                const opts = {};
	                {
	                    if (packet.options) {
	                        opts.compress = packet.options.compress;
	                    }
	                    if (this.opts.perMessageDeflate) {
	                        const len = "string" === typeof data ? Buffer.byteLength(data) : data.length;
	                        if (len < this.opts.perMessageDeflate.threshold) {
	                            opts.compress = false;
	                        }
	                    }
	                }
	                // Sometimes the websocket has already been closed but the browser didn't
	                // have a chance of informing us about it yet, in that case send will
	                // throw an error
	                try {
	                    if (usingBrowserWebSocket) ;
	                    else {
	                        this.ws.send(data, opts);
	                    }
	                }
	                catch (e) {
	                }
	                if (lastPacket) {
	                    // fake drain
	                    // defer to next tick to allow Socket to clear writeBuffer
	                    nextTick(() => {
	                        this.writable = true;
	                        this.emit("drain");
	                    }, this.setTimeoutFn);
	                }
	            });
	        }
	    }
	    /**
	     * Closes socket.
	     *
	     * @api private
	     */
	    doClose() {
	        if (typeof this.ws !== "undefined") {
	            this.ws.close();
	            this.ws = null;
	        }
	    }
	    /**
	     * Generates uri for connection.
	     *
	     * @api private
	     */
	    uri() {
	        let query = this.query || {};
	        const schema = this.opts.secure ? "wss" : "ws";
	        let port = "";
	        // avoid port if default for schema
	        if (this.opts.port &&
	            (("wss" === schema && Number(this.opts.port) !== 443) ||
	                ("ws" === schema && Number(this.opts.port) !== 80))) {
	            port = ":" + this.opts.port;
	        }
	        // append timestamp to URI
	        if (this.opts.timestampRequests) {
	            query[this.opts.timestampParam] = yeast_1();
	        }
	        // communicate binary support capabilities
	        if (!this.supportsBinary) {
	            query.b64 = 1;
	        }
	        const encodedQuery = parseqs.encode(query);
	        const ipv6 = this.opts.hostname.indexOf(":") !== -1;
	        return (schema +
	            "://" +
	            (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
	            port +
	            this.opts.path +
	            (encodedQuery.length ? "?" + encodedQuery : ""));
	    }
	    /**
	     * Feature detection for WebSocket.
	     *
	     * @return {Boolean} whether this transport is available.
	     * @api public
	     */
	    check() {
	        return (!!WebSocket &&
	            !("__initialize" in WebSocket && this.name === WS.prototype.name));
	    }
	}

	const transports = {
	    websocket: WS,
	    polling: XHR
	};

	class Socket$1 extends Emitter_1 {
	    /**
	     * Socket constructor.
	     *
	     * @param {String|Object} uri or options
	     * @param {Object} opts - options
	     * @api public
	     */
	    constructor(uri, opts = {}) {
	        super();
	        if (uri && "object" === typeof uri) {
	            opts = uri;
	            uri = null;
	        }
	        if (uri) {
	            uri = parseuri(uri);
	            opts.hostname = uri.host;
	            opts.secure = uri.protocol === "https" || uri.protocol === "wss";
	            opts.port = uri.port;
	            if (uri.query)
	                opts.query = uri.query;
	        }
	        else if (opts.host) {
	            opts.hostname = parseuri(opts.host).host;
	        }
	        installTimerFunctions(this, opts);
	        this.secure =
	            null != opts.secure
	                ? opts.secure
	                : typeof location !== "undefined" && "https:" === location.protocol;
	        if (opts.hostname && !opts.port) {
	            // if no port is specified manually, use the protocol default
	            opts.port = this.secure ? "443" : "80";
	        }
	        this.hostname =
	            opts.hostname ||
	                (typeof location !== "undefined" ? location.hostname : "localhost");
	        this.port =
	            opts.port ||
	                (typeof location !== "undefined" && location.port
	                    ? location.port
	                    : this.secure
	                        ? "443"
	                        : "80");
	        this.transports = opts.transports || ["polling", "websocket"];
	        this.readyState = "";
	        this.writeBuffer = [];
	        this.prevBufferLen = 0;
	        this.opts = Object.assign({
	            path: "/engine.io",
	            agent: false,
	            withCredentials: false,
	            upgrade: true,
	            timestampParam: "t",
	            rememberUpgrade: false,
	            rejectUnauthorized: true,
	            perMessageDeflate: {
	                threshold: 1024
	            },
	            transportOptions: {},
	            closeOnBeforeunload: true
	        }, opts);
	        this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
	        if (typeof this.opts.query === "string") {
	            this.opts.query = parseqs.decode(this.opts.query);
	        }
	        // set on handshake
	        this.id = null;
	        this.upgrades = null;
	        this.pingInterval = null;
	        this.pingTimeout = null;
	        // set on heartbeat
	        this.pingTimeoutTimer = null;
	        if (typeof addEventListener === "function") {
	            if (this.opts.closeOnBeforeunload) {
	                // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
	                // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
	                // closed/reloaded)
	                addEventListener("beforeunload", () => {
	                    if (this.transport) {
	                        // silently close the transport
	                        this.transport.removeAllListeners();
	                        this.transport.close();
	                    }
	                }, false);
	            }
	            if (this.hostname !== "localhost") {
	                this.offlineEventListener = () => {
	                    this.onClose("transport close");
	                };
	                addEventListener("offline", this.offlineEventListener, false);
	            }
	        }
	        this.open();
	    }
	    /**
	     * Creates transport of the given type.
	     *
	     * @param {String} transport name
	     * @return {Transport}
	     * @api private
	     */
	    createTransport(name) {
	        const query = clone(this.opts.query);
	        // append engine.io protocol identifier
	        query.EIO = protocol$1;
	        // transport name
	        query.transport = name;
	        // session id if we already have one
	        if (this.id)
	            query.sid = this.id;
	        const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
	            query,
	            socket: this,
	            hostname: this.hostname,
	            secure: this.secure,
	            port: this.port
	        });
	        return new transports[name](opts);
	    }
	    /**
	     * Initializes transport to use and starts probe.
	     *
	     * @api private
	     */
	    open() {
	        let transport;
	        if (this.opts.rememberUpgrade &&
	            Socket$1.priorWebsocketSuccess &&
	            this.transports.indexOf("websocket") !== -1) {
	            transport = "websocket";
	        }
	        else if (0 === this.transports.length) {
	            // Emit error on next tick so it can be listened to
	            this.setTimeoutFn(() => {
	                this.emitReserved("error", "No transports available");
	            }, 0);
	            return;
	        }
	        else {
	            transport = this.transports[0];
	        }
	        this.readyState = "opening";
	        // Retry with the next transport if the transport is disabled (jsonp: false)
	        try {
	            transport = this.createTransport(transport);
	        }
	        catch (e) {
	            this.transports.shift();
	            this.open();
	            return;
	        }
	        transport.open();
	        this.setTransport(transport);
	    }
	    /**
	     * Sets the current transport. Disables the existing one (if any).
	     *
	     * @api private
	     */
	    setTransport(transport) {
	        if (this.transport) {
	            this.transport.removeAllListeners();
	        }
	        // set up transport
	        this.transport = transport;
	        // set up transport listeners
	        transport
	            .on("drain", this.onDrain.bind(this))
	            .on("packet", this.onPacket.bind(this))
	            .on("error", this.onError.bind(this))
	            .on("close", () => {
	            this.onClose("transport close");
	        });
	    }
	    /**
	     * Probes a transport.
	     *
	     * @param {String} transport name
	     * @api private
	     */
	    probe(name) {
	        let transport = this.createTransport(name);
	        let failed = false;
	        Socket$1.priorWebsocketSuccess = false;
	        const onTransportOpen = () => {
	            if (failed)
	                return;
	            transport.send([{ type: "ping", data: "probe" }]);
	            transport.once("packet", msg => {
	                if (failed)
	                    return;
	                if ("pong" === msg.type && "probe" === msg.data) {
	                    this.upgrading = true;
	                    this.emitReserved("upgrading", transport);
	                    if (!transport)
	                        return;
	                    Socket$1.priorWebsocketSuccess = "websocket" === transport.name;
	                    this.transport.pause(() => {
	                        if (failed)
	                            return;
	                        if ("closed" === this.readyState)
	                            return;
	                        cleanup();
	                        this.setTransport(transport);
	                        transport.send([{ type: "upgrade" }]);
	                        this.emitReserved("upgrade", transport);
	                        transport = null;
	                        this.upgrading = false;
	                        this.flush();
	                    });
	                }
	                else {
	                    const err = new Error("probe error");
	                    // @ts-ignore
	                    err.transport = transport.name;
	                    this.emitReserved("upgradeError", err);
	                }
	            });
	        };
	        function freezeTransport() {
	            if (failed)
	                return;
	            // Any callback called by transport should be ignored since now
	            failed = true;
	            cleanup();
	            transport.close();
	            transport = null;
	        }
	        // Handle any error that happens while probing
	        const onerror = err => {
	            const error = new Error("probe error: " + err);
	            // @ts-ignore
	            error.transport = transport.name;
	            freezeTransport();
	            this.emitReserved("upgradeError", error);
	        };
	        function onTransportClose() {
	            onerror("transport closed");
	        }
	        // When the socket is closed while we're probing
	        function onclose() {
	            onerror("socket closed");
	        }
	        // When the socket is upgraded while we're probing
	        function onupgrade(to) {
	            if (transport && to.name !== transport.name) {
	                freezeTransport();
	            }
	        }
	        // Remove all listeners on the transport and on self
	        const cleanup = () => {
	            transport.removeListener("open", onTransportOpen);
	            transport.removeListener("error", onerror);
	            transport.removeListener("close", onTransportClose);
	            this.off("close", onclose);
	            this.off("upgrading", onupgrade);
	        };
	        transport.once("open", onTransportOpen);
	        transport.once("error", onerror);
	        transport.once("close", onTransportClose);
	        this.once("close", onclose);
	        this.once("upgrading", onupgrade);
	        transport.open();
	    }
	    /**
	     * Called when connection is deemed open.
	     *
	     * @api private
	     */
	    onOpen() {
	        this.readyState = "open";
	        Socket$1.priorWebsocketSuccess = "websocket" === this.transport.name;
	        this.emitReserved("open");
	        this.flush();
	        // we check for `readyState` in case an `open`
	        // listener already closed the socket
	        if ("open" === this.readyState &&
	            this.opts.upgrade &&
	            this.transport.pause) {
	            let i = 0;
	            const l = this.upgrades.length;
	            for (; i < l; i++) {
	                this.probe(this.upgrades[i]);
	            }
	        }
	    }
	    /**
	     * Handles a packet.
	     *
	     * @api private
	     */
	    onPacket(packet) {
	        if ("opening" === this.readyState ||
	            "open" === this.readyState ||
	            "closing" === this.readyState) {
	            this.emitReserved("packet", packet);
	            // Socket is live - any packet counts
	            this.emitReserved("heartbeat");
	            switch (packet.type) {
	                case "open":
	                    this.onHandshake(JSON.parse(packet.data));
	                    break;
	                case "ping":
	                    this.resetPingTimeout();
	                    this.sendPacket("pong");
	                    this.emitReserved("ping");
	                    this.emitReserved("pong");
	                    break;
	                case "error":
	                    const err = new Error("server error");
	                    // @ts-ignore
	                    err.code = packet.data;
	                    this.onError(err);
	                    break;
	                case "message":
	                    this.emitReserved("data", packet.data);
	                    this.emitReserved("message", packet.data);
	                    break;
	            }
	        }
	    }
	    /**
	     * Called upon handshake completion.
	     *
	     * @param {Object} data - handshake obj
	     * @api private
	     */
	    onHandshake(data) {
	        this.emitReserved("handshake", data);
	        this.id = data.sid;
	        this.transport.query.sid = data.sid;
	        this.upgrades = this.filterUpgrades(data.upgrades);
	        this.pingInterval = data.pingInterval;
	        this.pingTimeout = data.pingTimeout;
	        this.onOpen();
	        // In case open handler closes socket
	        if ("closed" === this.readyState)
	            return;
	        this.resetPingTimeout();
	    }
	    /**
	     * Sets and resets ping timeout timer based on server pings.
	     *
	     * @api private
	     */
	    resetPingTimeout() {
	        this.clearTimeoutFn(this.pingTimeoutTimer);
	        this.pingTimeoutTimer = this.setTimeoutFn(() => {
	            this.onClose("ping timeout");
	        }, this.pingInterval + this.pingTimeout);
	        if (this.opts.autoUnref) {
	            this.pingTimeoutTimer.unref();
	        }
	    }
	    /**
	     * Called on `drain` event
	     *
	     * @api private
	     */
	    onDrain() {
	        this.writeBuffer.splice(0, this.prevBufferLen);
	        // setting prevBufferLen = 0 is very important
	        // for example, when upgrading, upgrade packet is sent over,
	        // and a nonzero prevBufferLen could cause problems on `drain`
	        this.prevBufferLen = 0;
	        if (0 === this.writeBuffer.length) {
	            this.emitReserved("drain");
	        }
	        else {
	            this.flush();
	        }
	    }
	    /**
	     * Flush write buffers.
	     *
	     * @api private
	     */
	    flush() {
	        if ("closed" !== this.readyState &&
	            this.transport.writable &&
	            !this.upgrading &&
	            this.writeBuffer.length) {
	            this.transport.send(this.writeBuffer);
	            // keep track of current length of writeBuffer
	            // splice writeBuffer and callbackBuffer on `drain`
	            this.prevBufferLen = this.writeBuffer.length;
	            this.emitReserved("flush");
	        }
	    }
	    /**
	     * Sends a message.
	     *
	     * @param {String} message.
	     * @param {Function} callback function.
	     * @param {Object} options.
	     * @return {Socket} for chaining.
	     * @api public
	     */
	    write(msg, options, fn) {
	        this.sendPacket("message", msg, options, fn);
	        return this;
	    }
	    send(msg, options, fn) {
	        this.sendPacket("message", msg, options, fn);
	        return this;
	    }
	    /**
	     * Sends a packet.
	     *
	     * @param {String} packet type.
	     * @param {String} data.
	     * @param {Object} options.
	     * @param {Function} callback function.
	     * @api private
	     */
	    sendPacket(type, data, options, fn) {
	        if ("function" === typeof data) {
	            fn = data;
	            data = undefined;
	        }
	        if ("function" === typeof options) {
	            fn = options;
	            options = null;
	        }
	        if ("closing" === this.readyState || "closed" === this.readyState) {
	            return;
	        }
	        options = options || {};
	        options.compress = false !== options.compress;
	        const packet = {
	            type: type,
	            data: data,
	            options: options
	        };
	        this.emitReserved("packetCreate", packet);
	        this.writeBuffer.push(packet);
	        if (fn)
	            this.once("flush", fn);
	        this.flush();
	    }
	    /**
	     * Closes the connection.
	     *
	     * @api public
	     */
	    close() {
	        const close = () => {
	            this.onClose("forced close");
	            this.transport.close();
	        };
	        const cleanupAndClose = () => {
	            this.off("upgrade", cleanupAndClose);
	            this.off("upgradeError", cleanupAndClose);
	            close();
	        };
	        const waitForUpgrade = () => {
	            // wait for upgrade to finish since we can't send packets while pausing a transport
	            this.once("upgrade", cleanupAndClose);
	            this.once("upgradeError", cleanupAndClose);
	        };
	        if ("opening" === this.readyState || "open" === this.readyState) {
	            this.readyState = "closing";
	            if (this.writeBuffer.length) {
	                this.once("drain", () => {
	                    if (this.upgrading) {
	                        waitForUpgrade();
	                    }
	                    else {
	                        close();
	                    }
	                });
	            }
	            else if (this.upgrading) {
	                waitForUpgrade();
	            }
	            else {
	                close();
	            }
	        }
	        return this;
	    }
	    /**
	     * Called upon transport error
	     *
	     * @api private
	     */
	    onError(err) {
	        Socket$1.priorWebsocketSuccess = false;
	        this.emitReserved("error", err);
	        this.onClose("transport error", err);
	    }
	    /**
	     * Called upon transport close.
	     *
	     * @api private
	     */
	    onClose(reason, desc) {
	        if ("opening" === this.readyState ||
	            "open" === this.readyState ||
	            "closing" === this.readyState) {
	            // clear timers
	            this.clearTimeoutFn(this.pingTimeoutTimer);
	            // stop event from firing again for transport
	            this.transport.removeAllListeners("close");
	            // ensure transport won't stay open
	            this.transport.close();
	            // ignore further transport communication
	            this.transport.removeAllListeners();
	            if (typeof removeEventListener === "function") {
	                removeEventListener("offline", this.offlineEventListener, false);
	            }
	            // set ready state
	            this.readyState = "closed";
	            // clear session id
	            this.id = null;
	            // emit close event
	            this.emitReserved("close", reason, desc);
	            // clean buffers after, so users can still
	            // grab the buffers on `close` event
	            this.writeBuffer = [];
	            this.prevBufferLen = 0;
	        }
	    }
	    /**
	     * Filters upgrades, returning only those matching client transports.
	     *
	     * @param {Array} server upgrades
	     * @api private
	     *
	     */
	    filterUpgrades(upgrades) {
	        const filteredUpgrades = [];
	        let i = 0;
	        const j = upgrades.length;
	        for (; i < j; i++) {
	            if (~this.transports.indexOf(upgrades[i]))
	                filteredUpgrades.push(upgrades[i]);
	        }
	        return filteredUpgrades;
	    }
	}
	Socket$1.protocol = protocol$1;
	function clone(obj) {
	    const o = {};
	    for (let i in obj) {
	        if (obj.hasOwnProperty(i)) {
	            o[i] = obj[i];
	        }
	    }
	    return o;
	}

	const withNativeArrayBuffer = typeof ArrayBuffer === "function";
	const isView = (obj) => {
	    return typeof ArrayBuffer.isView === "function"
	        ? ArrayBuffer.isView(obj)
	        : obj.buffer instanceof ArrayBuffer;
	};
	const toString = Object.prototype.toString;
	const withNativeBlob = typeof Blob === "function" ||
	    (typeof Blob !== "undefined" &&
	        toString.call(Blob) === "[object BlobConstructor]");
	const withNativeFile = typeof File === "function" ||
	    (typeof File !== "undefined" &&
	        toString.call(File) === "[object FileConstructor]");
	/**
	 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
	 *
	 * @private
	 */
	function isBinary(obj) {
	    return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
	        (withNativeBlob && obj instanceof Blob) ||
	        (withNativeFile && obj instanceof File));
	}
	function hasBinary(obj, toJSON) {
	    if (!obj || typeof obj !== "object") {
	        return false;
	    }
	    if (Array.isArray(obj)) {
	        for (let i = 0, l = obj.length; i < l; i++) {
	            if (hasBinary(obj[i])) {
	                return true;
	            }
	        }
	        return false;
	    }
	    if (isBinary(obj)) {
	        return true;
	    }
	    if (obj.toJSON &&
	        typeof obj.toJSON === "function" &&
	        arguments.length === 1) {
	        return hasBinary(obj.toJSON(), true);
	    }
	    for (const key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
	            return true;
	        }
	    }
	    return false;
	}

	/**
	 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
	 *
	 * @param {Object} packet - socket.io event packet
	 * @return {Object} with deconstructed packet and list of buffers
	 * @public
	 */
	function deconstructPacket(packet) {
	    const buffers = [];
	    const packetData = packet.data;
	    const pack = packet;
	    pack.data = _deconstructPacket(packetData, buffers);
	    pack.attachments = buffers.length; // number of binary 'attachments'
	    return { packet: pack, buffers: buffers };
	}
	function _deconstructPacket(data, buffers) {
	    if (!data)
	        return data;
	    if (isBinary(data)) {
	        const placeholder = { _placeholder: true, num: buffers.length };
	        buffers.push(data);
	        return placeholder;
	    }
	    else if (Array.isArray(data)) {
	        const newData = new Array(data.length);
	        for (let i = 0; i < data.length; i++) {
	            newData[i] = _deconstructPacket(data[i], buffers);
	        }
	        return newData;
	    }
	    else if (typeof data === "object" && !(data instanceof Date)) {
	        const newData = {};
	        for (const key in data) {
	            if (Object.prototype.hasOwnProperty.call(data, key)) {
	                newData[key] = _deconstructPacket(data[key], buffers);
	            }
	        }
	        return newData;
	    }
	    return data;
	}
	/**
	 * Reconstructs a binary packet from its placeholder packet and buffers
	 *
	 * @param {Object} packet - event packet with placeholders
	 * @param {Array} buffers - binary buffers to put in placeholder positions
	 * @return {Object} reconstructed packet
	 * @public
	 */
	function reconstructPacket(packet, buffers) {
	    packet.data = _reconstructPacket(packet.data, buffers);
	    packet.attachments = undefined; // no longer useful
	    return packet;
	}
	function _reconstructPacket(data, buffers) {
	    if (!data)
	        return data;
	    if (data && data._placeholder) {
	        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
	    }
	    else if (Array.isArray(data)) {
	        for (let i = 0; i < data.length; i++) {
	            data[i] = _reconstructPacket(data[i], buffers);
	        }
	    }
	    else if (typeof data === "object") {
	        for (const key in data) {
	            if (Object.prototype.hasOwnProperty.call(data, key)) {
	                data[key] = _reconstructPacket(data[key], buffers);
	            }
	        }
	    }
	    return data;
	}

	/**
	 * Protocol version.
	 *
	 * @public
	 */
	const protocol = 5;
	var PacketType;
	(function (PacketType) {
	    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
	    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
	    PacketType[PacketType["EVENT"] = 2] = "EVENT";
	    PacketType[PacketType["ACK"] = 3] = "ACK";
	    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
	    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
	    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
	})(PacketType || (PacketType = {}));
	/**
	 * A socket.io Encoder instance
	 */
	class Encoder {
	    /**
	     * Encode a packet as a single string if non-binary, or as a
	     * buffer sequence, depending on packet type.
	     *
	     * @param {Object} obj - packet object
	     */
	    encode(obj) {
	        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
	            if (hasBinary(obj)) {
	                obj.type =
	                    obj.type === PacketType.EVENT
	                        ? PacketType.BINARY_EVENT
	                        : PacketType.BINARY_ACK;
	                return this.encodeAsBinary(obj);
	            }
	        }
	        return [this.encodeAsString(obj)];
	    }
	    /**
	     * Encode packet as string.
	     */
	    encodeAsString(obj) {
	        // first is type
	        let str = "" + obj.type;
	        // attachments if we have them
	        if (obj.type === PacketType.BINARY_EVENT ||
	            obj.type === PacketType.BINARY_ACK) {
	            str += obj.attachments + "-";
	        }
	        // if we have a namespace other than `/`
	        // we append it followed by a comma `,`
	        if (obj.nsp && "/" !== obj.nsp) {
	            str += obj.nsp + ",";
	        }
	        // immediately followed by the id
	        if (null != obj.id) {
	            str += obj.id;
	        }
	        // json data
	        if (null != obj.data) {
	            str += JSON.stringify(obj.data);
	        }
	        return str;
	    }
	    /**
	     * Encode packet as 'buffer sequence' by removing blobs, and
	     * deconstructing packet into object with placeholders and
	     * a list of buffers.
	     */
	    encodeAsBinary(obj) {
	        const deconstruction = deconstructPacket(obj);
	        const pack = this.encodeAsString(deconstruction.packet);
	        const buffers = deconstruction.buffers;
	        buffers.unshift(pack); // add packet info to beginning of data list
	        return buffers; // write all the buffers
	    }
	}
	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 */
	class Decoder extends Emitter_1 {
	    constructor() {
	        super();
	    }
	    /**
	     * Decodes an encoded packet string into packet JSON.
	     *
	     * @param {String} obj - encoded packet
	     */
	    add(obj) {
	        let packet;
	        if (typeof obj === "string") {
	            packet = this.decodeString(obj);
	            if (packet.type === PacketType.BINARY_EVENT ||
	                packet.type === PacketType.BINARY_ACK) {
	                // binary packet's json
	                this.reconstructor = new BinaryReconstructor(packet);
	                // no attachments, labeled binary but no binary data to follow
	                if (packet.attachments === 0) {
	                    super.emitReserved("decoded", packet);
	                }
	            }
	            else {
	                // non-binary full packet
	                super.emitReserved("decoded", packet);
	            }
	        }
	        else if (isBinary(obj) || obj.base64) {
	            // raw binary data
	            if (!this.reconstructor) {
	                throw new Error("got binary data when not reconstructing a packet");
	            }
	            else {
	                packet = this.reconstructor.takeBinaryData(obj);
	                if (packet) {
	                    // received final buffer
	                    this.reconstructor = null;
	                    super.emitReserved("decoded", packet);
	                }
	            }
	        }
	        else {
	            throw new Error("Unknown type: " + obj);
	        }
	    }
	    /**
	     * Decode a packet String (JSON data)
	     *
	     * @param {String} str
	     * @return {Object} packet
	     */
	    decodeString(str) {
	        let i = 0;
	        // look up type
	        const p = {
	            type: Number(str.charAt(0)),
	        };
	        if (PacketType[p.type] === undefined) {
	            throw new Error("unknown packet type " + p.type);
	        }
	        // look up attachments if type binary
	        if (p.type === PacketType.BINARY_EVENT ||
	            p.type === PacketType.BINARY_ACK) {
	            const start = i + 1;
	            while (str.charAt(++i) !== "-" && i != str.length) { }
	            const buf = str.substring(start, i);
	            if (buf != Number(buf) || str.charAt(i) !== "-") {
	                throw new Error("Illegal attachments");
	            }
	            p.attachments = Number(buf);
	        }
	        // look up namespace (if any)
	        if ("/" === str.charAt(i + 1)) {
	            const start = i + 1;
	            while (++i) {
	                const c = str.charAt(i);
	                if ("," === c)
	                    break;
	                if (i === str.length)
	                    break;
	            }
	            p.nsp = str.substring(start, i);
	        }
	        else {
	            p.nsp = "/";
	        }
	        // look up id
	        const next = str.charAt(i + 1);
	        if ("" !== next && Number(next) == next) {
	            const start = i + 1;
	            while (++i) {
	                const c = str.charAt(i);
	                if (null == c || Number(c) != c) {
	                    --i;
	                    break;
	                }
	                if (i === str.length)
	                    break;
	            }
	            p.id = Number(str.substring(start, i + 1));
	        }
	        // look up json data
	        if (str.charAt(++i)) {
	            const payload = tryParse(str.substr(i));
	            if (Decoder.isPayloadValid(p.type, payload)) {
	                p.data = payload;
	            }
	            else {
	                throw new Error("invalid payload");
	            }
	        }
	        return p;
	    }
	    static isPayloadValid(type, payload) {
	        switch (type) {
	            case PacketType.CONNECT:
	                return typeof payload === "object";
	            case PacketType.DISCONNECT:
	                return payload === undefined;
	            case PacketType.CONNECT_ERROR:
	                return typeof payload === "string" || typeof payload === "object";
	            case PacketType.EVENT:
	            case PacketType.BINARY_EVENT:
	                return Array.isArray(payload) && payload.length > 0;
	            case PacketType.ACK:
	            case PacketType.BINARY_ACK:
	                return Array.isArray(payload);
	        }
	    }
	    /**
	     * Deallocates a parser's resources
	     */
	    destroy() {
	        if (this.reconstructor) {
	            this.reconstructor.finishedReconstruction();
	        }
	    }
	}
	function tryParse(str) {
	    try {
	        return JSON.parse(str);
	    }
	    catch (e) {
	        return false;
	    }
	}
	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 */
	class BinaryReconstructor {
	    constructor(packet) {
	        this.packet = packet;
	        this.buffers = [];
	        this.reconPack = packet;
	    }
	    /**
	     * Method to be called when binary data received from connection
	     * after a BINARY_EVENT packet.
	     *
	     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	     * @return {null | Object} returns null if more binary data is expected or
	     *   a reconstructed packet object if all buffers have been received.
	     */
	    takeBinaryData(binData) {
	        this.buffers.push(binData);
	        if (this.buffers.length === this.reconPack.attachments) {
	            // done with buffer list
	            const packet = reconstructPacket(this.reconPack, this.buffers);
	            this.finishedReconstruction();
	            return packet;
	        }
	        return null;
	    }
	    /**
	     * Cleans up binary packet reconstruction variables.
	     */
	    finishedReconstruction() {
	        this.reconPack = null;
	        this.buffers = [];
	    }
	}

	var parser = /*#__PURE__*/Object.freeze({
		__proto__: null,
		protocol: protocol,
		get PacketType () { return PacketType; },
		Encoder: Encoder,
		Decoder: Decoder
	});

	function on(obj, ev, fn) {
	    obj.on(ev, fn);
	    return function subDestroy() {
	        obj.off(ev, fn);
	    };
	}

	/**
	 * Internal events.
	 * These events can't be emitted by the user.
	 */
	const RESERVED_EVENTS = Object.freeze({
	    connect: 1,
	    connect_error: 1,
	    disconnect: 1,
	    disconnecting: 1,
	    // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
	    newListener: 1,
	    removeListener: 1,
	});
	class Socket extends Emitter_1 {
	    /**
	     * `Socket` constructor.
	     *
	     * @public
	     */
	    constructor(io, nsp, opts) {
	        super();
	        this.connected = false;
	        this.disconnected = true;
	        this.receiveBuffer = [];
	        this.sendBuffer = [];
	        this.ids = 0;
	        this.acks = {};
	        this.flags = {};
	        this.io = io;
	        this.nsp = nsp;
	        if (opts && opts.auth) {
	            this.auth = opts.auth;
	        }
	        if (this.io._autoConnect)
	            this.open();
	    }
	    /**
	     * Subscribe to open, close and packet events
	     *
	     * @private
	     */
	    subEvents() {
	        if (this.subs)
	            return;
	        const io = this.io;
	        this.subs = [
	            on(io, "open", this.onopen.bind(this)),
	            on(io, "packet", this.onpacket.bind(this)),
	            on(io, "error", this.onerror.bind(this)),
	            on(io, "close", this.onclose.bind(this)),
	        ];
	    }
	    /**
	     * Whether the Socket will try to reconnect when its Manager connects or reconnects
	     */
	    get active() {
	        return !!this.subs;
	    }
	    /**
	     * "Opens" the socket.
	     *
	     * @public
	     */
	    connect() {
	        if (this.connected)
	            return this;
	        this.subEvents();
	        if (!this.io["_reconnecting"])
	            this.io.open(); // ensure open
	        if ("open" === this.io._readyState)
	            this.onopen();
	        return this;
	    }
	    /**
	     * Alias for connect()
	     */
	    open() {
	        return this.connect();
	    }
	    /**
	     * Sends a `message` event.
	     *
	     * @return self
	     * @public
	     */
	    send(...args) {
	        args.unshift("message");
	        this.emit.apply(this, args);
	        return this;
	    }
	    /**
	     * Override `emit`.
	     * If the event is in `events`, it's emitted normally.
	     *
	     * @return self
	     * @public
	     */
	    emit(ev, ...args) {
	        if (RESERVED_EVENTS.hasOwnProperty(ev)) {
	            throw new Error('"' + ev + '" is a reserved event name');
	        }
	        args.unshift(ev);
	        const packet = {
	            type: PacketType.EVENT,
	            data: args,
	        };
	        packet.options = {};
	        packet.options.compress = this.flags.compress !== false;
	        // event ack callback
	        if ("function" === typeof args[args.length - 1]) {
	            const id = this.ids++;
	            const ack = args.pop();
	            this._registerAckCallback(id, ack);
	            packet.id = id;
	        }
	        const isTransportWritable = this.io.engine &&
	            this.io.engine.transport &&
	            this.io.engine.transport.writable;
	        const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
	        if (discardPacket) ;
	        else if (this.connected) {
	            this.packet(packet);
	        }
	        else {
	            this.sendBuffer.push(packet);
	        }
	        this.flags = {};
	        return this;
	    }
	    /**
	     * @private
	     */
	    _registerAckCallback(id, ack) {
	        const timeout = this.flags.timeout;
	        if (timeout === undefined) {
	            this.acks[id] = ack;
	            return;
	        }
	        // @ts-ignore
	        const timer = this.io.setTimeoutFn(() => {
	            delete this.acks[id];
	            for (let i = 0; i < this.sendBuffer.length; i++) {
	                if (this.sendBuffer[i].id === id) {
	                    this.sendBuffer.splice(i, 1);
	                }
	            }
	            ack.call(this, new Error("operation has timed out"));
	        }, timeout);
	        this.acks[id] = (...args) => {
	            // @ts-ignore
	            this.io.clearTimeoutFn(timer);
	            ack.apply(this, [null, ...args]);
	        };
	    }
	    /**
	     * Sends a packet.
	     *
	     * @param packet
	     * @private
	     */
	    packet(packet) {
	        packet.nsp = this.nsp;
	        this.io._packet(packet);
	    }
	    /**
	     * Called upon engine `open`.
	     *
	     * @private
	     */
	    onopen() {
	        if (typeof this.auth == "function") {
	            this.auth((data) => {
	                this.packet({ type: PacketType.CONNECT, data });
	            });
	        }
	        else {
	            this.packet({ type: PacketType.CONNECT, data: this.auth });
	        }
	    }
	    /**
	     * Called upon engine or manager `error`.
	     *
	     * @param err
	     * @private
	     */
	    onerror(err) {
	        if (!this.connected) {
	            this.emitReserved("connect_error", err);
	        }
	    }
	    /**
	     * Called upon engine `close`.
	     *
	     * @param reason
	     * @private
	     */
	    onclose(reason) {
	        this.connected = false;
	        this.disconnected = true;
	        delete this.id;
	        this.emitReserved("disconnect", reason);
	    }
	    /**
	     * Called with socket packet.
	     *
	     * @param packet
	     * @private
	     */
	    onpacket(packet) {
	        const sameNamespace = packet.nsp === this.nsp;
	        if (!sameNamespace)
	            return;
	        switch (packet.type) {
	            case PacketType.CONNECT:
	                if (packet.data && packet.data.sid) {
	                    const id = packet.data.sid;
	                    this.onconnect(id);
	                }
	                else {
	                    this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
	                }
	                break;
	            case PacketType.EVENT:
	                this.onevent(packet);
	                break;
	            case PacketType.BINARY_EVENT:
	                this.onevent(packet);
	                break;
	            case PacketType.ACK:
	                this.onack(packet);
	                break;
	            case PacketType.BINARY_ACK:
	                this.onack(packet);
	                break;
	            case PacketType.DISCONNECT:
	                this.ondisconnect();
	                break;
	            case PacketType.CONNECT_ERROR:
	                this.destroy();
	                const err = new Error(packet.data.message);
	                // @ts-ignore
	                err.data = packet.data.data;
	                this.emitReserved("connect_error", err);
	                break;
	        }
	    }
	    /**
	     * Called upon a server event.
	     *
	     * @param packet
	     * @private
	     */
	    onevent(packet) {
	        const args = packet.data || [];
	        if (null != packet.id) {
	            args.push(this.ack(packet.id));
	        }
	        if (this.connected) {
	            this.emitEvent(args);
	        }
	        else {
	            this.receiveBuffer.push(Object.freeze(args));
	        }
	    }
	    emitEvent(args) {
	        if (this._anyListeners && this._anyListeners.length) {
	            const listeners = this._anyListeners.slice();
	            for (const listener of listeners) {
	                listener.apply(this, args);
	            }
	        }
	        super.emit.apply(this, args);
	    }
	    /**
	     * Produces an ack callback to emit with an event.
	     *
	     * @private
	     */
	    ack(id) {
	        const self = this;
	        let sent = false;
	        return function (...args) {
	            // prevent double callbacks
	            if (sent)
	                return;
	            sent = true;
	            self.packet({
	                type: PacketType.ACK,
	                id: id,
	                data: args,
	            });
	        };
	    }
	    /**
	     * Called upon a server acknowlegement.
	     *
	     * @param packet
	     * @private
	     */
	    onack(packet) {
	        const ack = this.acks[packet.id];
	        if ("function" === typeof ack) {
	            ack.apply(this, packet.data);
	            delete this.acks[packet.id];
	        }
	    }
	    /**
	     * Called upon server connect.
	     *
	     * @private
	     */
	    onconnect(id) {
	        this.id = id;
	        this.connected = true;
	        this.disconnected = false;
	        this.emitBuffered();
	        this.emitReserved("connect");
	    }
	    /**
	     * Emit buffered events (received and emitted).
	     *
	     * @private
	     */
	    emitBuffered() {
	        this.receiveBuffer.forEach((args) => this.emitEvent(args));
	        this.receiveBuffer = [];
	        this.sendBuffer.forEach((packet) => this.packet(packet));
	        this.sendBuffer = [];
	    }
	    /**
	     * Called upon server disconnect.
	     *
	     * @private
	     */
	    ondisconnect() {
	        this.destroy();
	        this.onclose("io server disconnect");
	    }
	    /**
	     * Called upon forced client/server side disconnections,
	     * this method ensures the manager stops tracking us and
	     * that reconnections don't get triggered for this.
	     *
	     * @private
	     */
	    destroy() {
	        if (this.subs) {
	            // clean subscriptions to avoid reconnections
	            this.subs.forEach((subDestroy) => subDestroy());
	            this.subs = undefined;
	        }
	        this.io["_destroy"](this);
	    }
	    /**
	     * Disconnects the socket manually.
	     *
	     * @return self
	     * @public
	     */
	    disconnect() {
	        if (this.connected) {
	            this.packet({ type: PacketType.DISCONNECT });
	        }
	        // remove socket from pool
	        this.destroy();
	        if (this.connected) {
	            // fire events
	            this.onclose("io client disconnect");
	        }
	        return this;
	    }
	    /**
	     * Alias for disconnect()
	     *
	     * @return self
	     * @public
	     */
	    close() {
	        return this.disconnect();
	    }
	    /**
	     * Sets the compress flag.
	     *
	     * @param compress - if `true`, compresses the sending data
	     * @return self
	     * @public
	     */
	    compress(compress) {
	        this.flags.compress = compress;
	        return this;
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
	     * ready to send messages.
	     *
	     * @returns self
	     * @public
	     */
	    get volatile() {
	        this.flags.volatile = true;
	        return this;
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
	     * given number of milliseconds have elapsed without an acknowledgement from the server:
	     *
	     * ```
	     * socket.timeout(5000).emit("my-event", (err) => {
	     *   if (err) {
	     *     // the server did not acknowledge the event in the given delay
	     *   }
	     * });
	     * ```
	     *
	     * @returns self
	     * @public
	     */
	    timeout(timeout) {
	        this.flags.timeout = timeout;
	        return this;
	    }
	    /**
	     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	     * callback.
	     *
	     * @param listener
	     * @public
	     */
	    onAny(listener) {
	        this._anyListeners = this._anyListeners || [];
	        this._anyListeners.push(listener);
	        return this;
	    }
	    /**
	     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	     * callback. The listener is added to the beginning of the listeners array.
	     *
	     * @param listener
	     * @public
	     */
	    prependAny(listener) {
	        this._anyListeners = this._anyListeners || [];
	        this._anyListeners.unshift(listener);
	        return this;
	    }
	    /**
	     * Removes the listener that will be fired when any event is emitted.
	     *
	     * @param listener
	     * @public
	     */
	    offAny(listener) {
	        if (!this._anyListeners) {
	            return this;
	        }
	        if (listener) {
	            const listeners = this._anyListeners;
	            for (let i = 0; i < listeners.length; i++) {
	                if (listener === listeners[i]) {
	                    listeners.splice(i, 1);
	                    return this;
	                }
	            }
	        }
	        else {
	            this._anyListeners = [];
	        }
	        return this;
	    }
	    /**
	     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
	     * e.g. to remove listeners.
	     *
	     * @public
	     */
	    listenersAny() {
	        return this._anyListeners || [];
	    }
	}

	/**
	 * Expose `Backoff`.
	 */

	var backo2 = Backoff;

	/**
	 * Initialize backoff timer with `opts`.
	 *
	 * - `min` initial timeout in milliseconds [100]
	 * - `max` max timeout [10000]
	 * - `jitter` [0]
	 * - `factor` [2]
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function Backoff(opts) {
	  opts = opts || {};
	  this.ms = opts.min || 100;
	  this.max = opts.max || 10000;
	  this.factor = opts.factor || 2;
	  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	  this.attempts = 0;
	}

	/**
	 * Return the backoff duration.
	 *
	 * @return {Number}
	 * @api public
	 */

	Backoff.prototype.duration = function(){
	  var ms = this.ms * Math.pow(this.factor, this.attempts++);
	  if (this.jitter) {
	    var rand =  Math.random();
	    var deviation = Math.floor(rand * this.jitter * ms);
	    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
	  }
	  return Math.min(ms, this.max) | 0;
	};

	/**
	 * Reset the number of attempts.
	 *
	 * @api public
	 */

	Backoff.prototype.reset = function(){
	  this.attempts = 0;
	};

	/**
	 * Set the minimum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMin = function(min){
	  this.ms = min;
	};

	/**
	 * Set the maximum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMax = function(max){
	  this.max = max;
	};

	/**
	 * Set the jitter
	 *
	 * @api public
	 */

	Backoff.prototype.setJitter = function(jitter){
	  this.jitter = jitter;
	};

	class Manager extends Emitter_1 {
	    constructor(uri, opts) {
	        var _a;
	        super();
	        this.nsps = {};
	        this.subs = [];
	        if (uri && "object" === typeof uri) {
	            opts = uri;
	            uri = undefined;
	        }
	        opts = opts || {};
	        opts.path = opts.path || "/socket.io";
	        this.opts = opts;
	        installTimerFunctions(this, opts);
	        this.reconnection(opts.reconnection !== false);
	        this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
	        this.reconnectionDelay(opts.reconnectionDelay || 1000);
	        this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
	        this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
	        this.backoff = new backo2({
	            min: this.reconnectionDelay(),
	            max: this.reconnectionDelayMax(),
	            jitter: this.randomizationFactor(),
	        });
	        this.timeout(null == opts.timeout ? 20000 : opts.timeout);
	        this._readyState = "closed";
	        this.uri = uri;
	        const _parser = opts.parser || parser;
	        this.encoder = new _parser.Encoder();
	        this.decoder = new _parser.Decoder();
	        this._autoConnect = opts.autoConnect !== false;
	        if (this._autoConnect)
	            this.open();
	    }
	    reconnection(v) {
	        if (!arguments.length)
	            return this._reconnection;
	        this._reconnection = !!v;
	        return this;
	    }
	    reconnectionAttempts(v) {
	        if (v === undefined)
	            return this._reconnectionAttempts;
	        this._reconnectionAttempts = v;
	        return this;
	    }
	    reconnectionDelay(v) {
	        var _a;
	        if (v === undefined)
	            return this._reconnectionDelay;
	        this._reconnectionDelay = v;
	        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
	        return this;
	    }
	    randomizationFactor(v) {
	        var _a;
	        if (v === undefined)
	            return this._randomizationFactor;
	        this._randomizationFactor = v;
	        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
	        return this;
	    }
	    reconnectionDelayMax(v) {
	        var _a;
	        if (v === undefined)
	            return this._reconnectionDelayMax;
	        this._reconnectionDelayMax = v;
	        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
	        return this;
	    }
	    timeout(v) {
	        if (!arguments.length)
	            return this._timeout;
	        this._timeout = v;
	        return this;
	    }
	    /**
	     * Starts trying to reconnect if reconnection is enabled and we have not
	     * started reconnecting yet
	     *
	     * @private
	     */
	    maybeReconnectOnOpen() {
	        // Only try to reconnect if it's the first time we're connecting
	        if (!this._reconnecting &&
	            this._reconnection &&
	            this.backoff.attempts === 0) {
	            // keeps reconnection from firing twice for the same reconnection loop
	            this.reconnect();
	        }
	    }
	    /**
	     * Sets the current transport `socket`.
	     *
	     * @param {Function} fn - optional, callback
	     * @return self
	     * @public
	     */
	    open(fn) {
	        if (~this._readyState.indexOf("open"))
	            return this;
	        this.engine = new Socket$1(this.uri, this.opts);
	        const socket = this.engine;
	        const self = this;
	        this._readyState = "opening";
	        this.skipReconnect = false;
	        // emit `open`
	        const openSubDestroy = on(socket, "open", function () {
	            self.onopen();
	            fn && fn();
	        });
	        // emit `error`
	        const errorSub = on(socket, "error", (err) => {
	            self.cleanup();
	            self._readyState = "closed";
	            this.emitReserved("error", err);
	            if (fn) {
	                fn(err);
	            }
	            else {
	                // Only do this if there is no fn to handle the error
	                self.maybeReconnectOnOpen();
	            }
	        });
	        if (false !== this._timeout) {
	            const timeout = this._timeout;
	            if (timeout === 0) {
	                openSubDestroy(); // prevents a race condition with the 'open' event
	            }
	            // set timer
	            const timer = this.setTimeoutFn(() => {
	                openSubDestroy();
	                socket.close();
	                // @ts-ignore
	                socket.emit("error", new Error("timeout"));
	            }, timeout);
	            if (this.opts.autoUnref) {
	                timer.unref();
	            }
	            this.subs.push(function subDestroy() {
	                clearTimeout(timer);
	            });
	        }
	        this.subs.push(openSubDestroy);
	        this.subs.push(errorSub);
	        return this;
	    }
	    /**
	     * Alias for open()
	     *
	     * @return self
	     * @public
	     */
	    connect(fn) {
	        return this.open(fn);
	    }
	    /**
	     * Called upon transport open.
	     *
	     * @private
	     */
	    onopen() {
	        // clear old subs
	        this.cleanup();
	        // mark as open
	        this._readyState = "open";
	        this.emitReserved("open");
	        // add new subs
	        const socket = this.engine;
	        this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
	    }
	    /**
	     * Called upon a ping.
	     *
	     * @private
	     */
	    onping() {
	        this.emitReserved("ping");
	    }
	    /**
	     * Called with data.
	     *
	     * @private
	     */
	    ondata(data) {
	        this.decoder.add(data);
	    }
	    /**
	     * Called when parser fully decodes a packet.
	     *
	     * @private
	     */
	    ondecoded(packet) {
	        this.emitReserved("packet", packet);
	    }
	    /**
	     * Called upon socket error.
	     *
	     * @private
	     */
	    onerror(err) {
	        this.emitReserved("error", err);
	    }
	    /**
	     * Creates a new socket for the given `nsp`.
	     *
	     * @return {Socket}
	     * @public
	     */
	    socket(nsp, opts) {
	        let socket = this.nsps[nsp];
	        if (!socket) {
	            socket = new Socket(this, nsp, opts);
	            this.nsps[nsp] = socket;
	        }
	        return socket;
	    }
	    /**
	     * Called upon a socket close.
	     *
	     * @param socket
	     * @private
	     */
	    _destroy(socket) {
	        const nsps = Object.keys(this.nsps);
	        for (const nsp of nsps) {
	            const socket = this.nsps[nsp];
	            if (socket.active) {
	                return;
	            }
	        }
	        this._close();
	    }
	    /**
	     * Writes a packet.
	     *
	     * @param packet
	     * @private
	     */
	    _packet(packet) {
	        const encodedPackets = this.encoder.encode(packet);
	        for (let i = 0; i < encodedPackets.length; i++) {
	            this.engine.write(encodedPackets[i], packet.options);
	        }
	    }
	    /**
	     * Clean up transport subscriptions and packet buffer.
	     *
	     * @private
	     */
	    cleanup() {
	        this.subs.forEach((subDestroy) => subDestroy());
	        this.subs.length = 0;
	        this.decoder.destroy();
	    }
	    /**
	     * Close the current socket.
	     *
	     * @private
	     */
	    _close() {
	        this.skipReconnect = true;
	        this._reconnecting = false;
	        this.onclose("forced close");
	        if (this.engine)
	            this.engine.close();
	    }
	    /**
	     * Alias for close()
	     *
	     * @private
	     */
	    disconnect() {
	        return this._close();
	    }
	    /**
	     * Called upon engine close.
	     *
	     * @private
	     */
	    onclose(reason) {
	        this.cleanup();
	        this.backoff.reset();
	        this._readyState = "closed";
	        this.emitReserved("close", reason);
	        if (this._reconnection && !this.skipReconnect) {
	            this.reconnect();
	        }
	    }
	    /**
	     * Attempt a reconnection.
	     *
	     * @private
	     */
	    reconnect() {
	        if (this._reconnecting || this.skipReconnect)
	            return this;
	        const self = this;
	        if (this.backoff.attempts >= this._reconnectionAttempts) {
	            this.backoff.reset();
	            this.emitReserved("reconnect_failed");
	            this._reconnecting = false;
	        }
	        else {
	            const delay = this.backoff.duration();
	            this._reconnecting = true;
	            const timer = this.setTimeoutFn(() => {
	                if (self.skipReconnect)
	                    return;
	                this.emitReserved("reconnect_attempt", self.backoff.attempts);
	                // check again for the case socket closed in above events
	                if (self.skipReconnect)
	                    return;
	                self.open((err) => {
	                    if (err) {
	                        self._reconnecting = false;
	                        self.reconnect();
	                        this.emitReserved("reconnect_error", err);
	                    }
	                    else {
	                        self.onreconnect();
	                    }
	                });
	            }, delay);
	            if (this.opts.autoUnref) {
	                timer.unref();
	            }
	            this.subs.push(function subDestroy() {
	                clearTimeout(timer);
	            });
	        }
	    }
	    /**
	     * Called upon successful reconnect.
	     *
	     * @private
	     */
	    onreconnect() {
	        const attempt = this.backoff.attempts;
	        this._reconnecting = false;
	        this.backoff.reset();
	        this.emitReserved("reconnect", attempt);
	    }
	}

	/**
	 * Managers cache.
	 */
	const cache = {};
	function lookup(uri, opts) {
	    if (typeof uri === "object") {
	        opts = uri;
	        uri = undefined;
	    }
	    opts = opts || {};
	    const parsed = url(uri, opts.path || "/socket.io");
	    const source = parsed.source;
	    const id = parsed.id;
	    const path = parsed.path;
	    const sameNamespace = cache[id] && path in cache[id]["nsps"];
	    const newConnection = opts.forceNew ||
	        opts["force new connection"] ||
	        false === opts.multiplex ||
	        sameNamespace;
	    let io;
	    if (newConnection) {
	        io = new Manager(source, opts);
	    }
	    else {
	        if (!cache[id]) {
	            cache[id] = new Manager(source, opts);
	        }
	        io = cache[id];
	    }
	    if (parsed.query && !opts.query) {
	        opts.query = parsed.queryKey;
	    }
	    return io.socket(parsed.path, opts);
	}
	// so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
	// namespace (e.g. `io.connect(...)`), for backward compatibility
	Object.assign(lookup, {
	    Manager,
	    Socket,
	    io: lookup,
	    connect: lookup,
	});

	/**
	 * Generates a secure random string using the browser crypto functions
	 */
	function generateRandomString() {
	    const array = new Uint32Array(28);
	    window.crypto.getRandomValues(array);
	    return Array.from(array, (dec) => ("0" + dec.toString(16)).slice(-2)).join("");
	}
	/**
	 * Calculates the SHA256 hash of the input text.
	 * @param input A random string
	 */
	function sha256(input) {
	    const encoder = new TextEncoder();
	    const data = encoder.encode(input);
	    return window.crypto.subtle.digest("SHA-256", data);
	}
	/**
	 * Base64-url encodes an input string
	 * @param arrayBuffer the result of a random string hashed by sha256()
	 */
	function base64UrlEncode(arrayBuffer) {
	    // Convert the ArrayBuffer to string using Uint8 array to convert to what btoa accepts.
	    // btoa accepts chars only within ascii 0-255 and base64 encodes them.
	    // Then convert the base64 encoded to base64url encoded
	    // (replace + with -, replace / with _, trim trailing =)
	    return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
	        .replace(/\+/g, "-")
	        .replace(/\//g, "_")
	        .replace(/=+$/, "");
	}
	/**
	 * Return the base64-url encoded sha256 hash for the PKCE challenge
	 * @param codeVerifier A random string
	 */
	async function pkceChallengeFromVerifier(codeVerifier) {
	    const hashed = await sha256(codeVerifier);
	    return base64UrlEncode(hashed);
	}

	/**
	 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
	 */
	class RethinkID {
	    #signUpBaseUri = "http://localhost:3000/sign-up";
	    #tokenUri = "http://localhost:4444/oauth2/token";
	    #authUri = "http://localhost:4444/oauth2/auth";
	    #socketioUri = "http://localhost:4000";
	    #signUpRedirectUri = "";
	    #oAuthClient;
	    socket;
	    constructor(options) {
	        this.#signUpRedirectUri = options.signUpRedirectUri;
	        this.#oAuthClient = new clientOauth2({
	            clientId: options.appId,
	            redirectUri: options.logInRedirectUri,
	            accessTokenUri: this.#tokenUri,
	            authorizationUri: this.#authUri,
	            scopes: ["openid", "profile", "email"],
	        });
	        this.socketConnect();
	    }
	    /**
	     * Creates a SocketIO connection with an auth token
	     */
	    socketConnect() {
	        const token = localStorage.getItem("token");
	        if (!token) {
	            return;
	        }
	        this.socket = lookup(this.#socketioUri, {
	            auth: { token },
	        });
	        this.socket.on("connect", () => {
	            console.log("sdk: connected. this.socket.id:", this.socket.id);
	        });
	        this.socket.on("connect_error", (err) => {
	            console.error("sdk connect err.message", err.message);
	            if (err.message.includes("Unauthorized")) {
	                console.log("Unauthorized!");
	            }
	        });
	    }
	    /**
	     * Generate a URI to sign up a user, creating a RethinkID account
	     */
	    signUpUri() {
	        const params = new URLSearchParams();
	        params.append("redirect_uri", this.#signUpRedirectUri);
	        return `${this.#signUpBaseUri}?${params.toString()}`;
	    }
	    /**
	     * Generate a URI to log in a user to RethinkID and authorize your app.
	     * Uses the Authorization Code Flow for single page apps with PKCE code verification.
	     * Requests an authorization code.
	     */
	    async logInUri() {
	        // Create and store a random "state" value
	        const state = generateRandomString();
	        localStorage.setItem("pkce_state", state);
	        // Create and store a new PKCE code_verifier (the plaintext random secret)
	        const codeVerifier = generateRandomString();
	        localStorage.setItem("pkce_code_verifier", codeVerifier);
	        // Hash and base64-urlencode the secret to use as the challenge
	        const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);
	        return this.#oAuthClient.code.getUri({
	            state: state,
	            query: {
	                code_challenge: codeChallenge,
	                code_challenge_method: "S256",
	            },
	        });
	    }
	    /**
	     * Takes an authorization code and exchanges it for an access token and ID token
	     * An authorization code is received after a successfully calling logInUri() and
	     * approving the log in request.
	     * Stores the access token and ID token in local storage as `token` and `idToken` respectively.
	     */
	    async getTokens() {
	        const params = new URLSearchParams(window.location.search);
	        // Check if the auth server returned an error string
	        const error = params.get("error");
	        if (error) {
	            return {
	                error: error,
	                errorDescription: params.get("error_description") || "",
	            };
	        }
	        // Make sure the auth server returned a code
	        const code = params.get("code");
	        if (!code) {
	            return {
	                error: "No query param code",
	            };
	        }
	        // Verify state matches what we set at the beginning
	        if (localStorage.getItem("pkce_state") !== params.get("state")) {
	            return {
	                error: "State did not match. Possible CSRF attack",
	            };
	        }
	        let getTokenResponse;
	        try {
	            getTokenResponse = await this.#oAuthClient.code.getToken(window.location.href, {
	                body: {
	                    code_verifier: localStorage.getItem("pkce_code_verifier") || "",
	                },
	            });
	        }
	        catch (error) {
	            return {
	                error: `Error getting token: ${error.message}`,
	            };
	        }
	        if (!getTokenResponse) {
	            return {
	                error: "No token response",
	            };
	        }
	        // Clean these up since we don't need them anymore
	        localStorage.removeItem("pkce_state");
	        localStorage.removeItem("pkce_code_verifier");
	        // Store tokens and sign user in locally
	        const token = getTokenResponse.data.access_token;
	        const idToken = getTokenResponse.data.id_token;
	        localStorage.setItem("token", token);
	        localStorage.setItem("idToken", idToken);
	        try {
	            const tokenDecoded = o(token);
	            const idTokenDecoded = o(idToken);
	            this.socketConnect();
	            return {
	                tokenDecoded,
	                idTokenDecoded,
	            };
	        }
	        catch (error) {
	            return {
	                error: `Error decoding token: ${error.message}`,
	            };
	        }
	    }
	    /**
	     * A utility function to check if the user is logged in.
	     * i.e. if an access token and ID token are in local storage.
	     * Returns the decoded ID token for convenient access to user information.
	     */
	    isLoggedIn() {
	        const token = localStorage.getItem("token");
	        const idToken = localStorage.getItem("idToken");
	        if (token && idToken) {
	            try {
	                const idTokenDecoded = o(idToken);
	                return {
	                    idTokenDecoded,
	                };
	            }
	            catch (error) {
	                // clean up
	                localStorage.removeItem("token");
	                localStorage.removeItem("idToken");
	                return {
	                    error: `ID token decode error: ${error}`,
	                };
	            }
	        }
	        return false;
	    }
	    /**
	     * A utility function to log a user out.
	     * Deletes the access token and ID token from local storage and reloads the page.
	     */
	    logOut() {
	        if (localStorage.getItem("token") || localStorage.getItem("idToken")) {
	            localStorage.removeItem("token");
	            localStorage.removeItem("idToken");
	            location.reload();
	        }
	    }
	    // Data API
	    /**
	     * Makes sure a socket has connected.
	     */
	    _waitForConnection = () => {
	        return new Promise((resolve, reject) => {
	            if (this.socket.connected) {
	                resolve(true);
	            }
	            else {
	                this.socket.on("connect", () => {
	                    resolve(true);
	                });
	                // Don't wait for connection indefinitely
	                setTimeout(() => {
	                    reject(new Error("Timeout waiting for on connect"));
	                }, 1000);
	            }
	        });
	    };
	    /**
	     * Promisifies a socket.io emit event
	     * @param event A socket.io event name, like `tables:create`
	     * @param payload
	     */
	    _asyncEmit = async (event, payload) => {
	        await this._waitForConnection();
	        return new Promise((resolve, reject) => {
	            this.socket.emit(event, payload, (response) => {
	                if (response.error) {
	                    reject(new Error(response.error));
	                }
	                else {
	                    resolve(response);
	                }
	            });
	        });
	    };
	    /**
	     * Creates a table
	     */
	    async tablesCreate(tableName) {
	        return this._asyncEmit("tables:create", { tableName });
	    }
	    /**
	     * Drops, or deletes, a table
	     */
	    async tablesDrop(tableName) {
	        return this._asyncEmit("tables:drop", { tableName });
	    }
	    /**
	     * Lists all table names
	     */
	    async tablesList() {
	        return this._asyncEmit("tables:list", null);
	    }
	    /**
	     * Gets permissions for a user. At least one of the parameters must be provided.
	     */
	    async permissionsGet(tableName, userId, permission) {
	        return this._asyncEmit("permissions:get", { tableName, userId, permission });
	    }
	    /**
	     * Sets permissions for a user
	     */
	    async permissionsSet(permissions) {
	        return this._asyncEmit("permissions:set", permissions);
	    }
	    /**
	     * Sets permissions for a user
	     */
	    async permissionsDelete(rowId) {
	        return this._asyncEmit("permissions:delete", { rowId });
	    }
	    /**
	     * Get all rows from a table, or a single row if rowId is provided
	     */
	    async tableRead(tableName, rowId) {
	        return this._asyncEmit("table:read", { tableName, rowId });
	    }
	    /**
	     * Subscribe to table changes. Returns a handle to receive for changes,
	     * to be used with {@link socket}.
	     *
	     * @example
	     * ```js
	     *   const rid = new RethinkID(options);
	     *   rid.socket.on(socketTableHandle, (changes) => {
	     *     console.log("Received emitted changes", changes);
	     *     if (changes.new_val && changes.old_val === null) {
	     *         console.log("Received new message");
	     *     }
	     *     if (changes.new_val === null && changes.old_val) {
	     *         console.log("Received deleted message");
	     *     }
	     *     if (changes.new_val && changes.old_val) {
	     *         console.log("Received updated message");
	     *     }
	     * });
	     * ```
	     */
	    async tableSubscribe(tableName, userId) {
	        return this._asyncEmit("table:subscribe", { tableName, userId }); // data: socket table handle
	    }
	    /**
	     * Unsubscribe from table changes
	     * After having subscribed with {@link tableSubscribe}
	     */
	    async tableUnsubscribe(tableName, userId) {
	        return this._asyncEmit("table:unsubscribe", { tableName, userId });
	    }
	    /**
	     * Inserts a row into a table
	     */
	    async tableInsert(tableName, row, userId) {
	        return this._asyncEmit("table:insert", { tableName, row, userId });
	    }
	    /**
	     * Updates a row in a table
	     */
	    async tableUpdate(tableName, row, userId) {
	        return this._asyncEmit("table:update", { tableName, row, userId });
	    }
	    /**
	     * Replaces a row in a table
	     */
	    async tableReplace(tableName, row, userId) {
	        return this._asyncEmit("table:replace", { tableName, row, userId });
	    }
	    /**
	     * Deletes a row from a table
	     */
	    async tableDelete(tableName, rowId, userId) {
	        return this._asyncEmit("table:delete", { tableName, rowId, userId });
	    }
	}

	exports.RethinkID = RethinkID;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
