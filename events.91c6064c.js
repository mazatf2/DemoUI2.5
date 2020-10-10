// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"JZPE":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expose = expose;
exports.proxy = proxy;
exports.transfer = transfer;
exports.windowEndpoint = windowEndpoint;
exports.wrap = wrap;
exports.transferHandlers = exports.releaseProxy = exports.proxyMarker = exports.createEndpoint = void 0;

/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const proxyMarker = Symbol("Comlink.proxy");
exports.proxyMarker = proxyMarker;
const createEndpoint = Symbol("Comlink.endpoint");
exports.createEndpoint = createEndpoint;
const releaseProxy = Symbol("Comlink.releaseProxy");
exports.releaseProxy = releaseProxy;
const throwMarker = Symbol("Comlink.thrown");

const isObject = val => typeof val === "object" && val !== null || typeof val === "function";
/**
 * Internal transfer handle to handle objects marked to proxy.
 */


const proxyTransferHandler = {
  canHandle: val => isObject(val) && val[proxyMarker],

  serialize(obj) {
    const {
      port1,
      port2
    } = new MessageChannel();
    expose(obj, port1);
    return [port2, [port2]];
  },

  deserialize(port) {
    port.start();
    return wrap(port);
  }

};
/**
 * Internal transfer handler to handle thrown exceptions.
 */

const throwTransferHandler = {
  canHandle: value => isObject(value) && throwMarker in value,

  serialize({
    value
  }) {
    let serialized;

    if (value instanceof Error) {
      serialized = {
        isError: true,
        value: {
          message: value.message,
          name: value.name,
          stack: value.stack
        }
      };
    } else {
      serialized = {
        isError: false,
        value
      };
    }

    return [serialized, []];
  },

  deserialize(serialized) {
    if (serialized.isError) {
      throw Object.assign(new Error(serialized.value.message), serialized.value);
    }

    throw serialized.value;
  }

};
/**
 * Allows customizing the serialization of certain values.
 */

const transferHandlers = new Map([["proxy", proxyTransferHandler], ["throw", throwTransferHandler]]);
exports.transferHandlers = transferHandlers;

function expose(obj, ep = self) {
  ep.addEventListener("message", function callback(ev) {
    if (!ev || !ev.data) {
      return;
    }

    const {
      id,
      type,
      path
    } = Object.assign({
      path: []
    }, ev.data);
    const argumentList = (ev.data.argumentList || []).map(fromWireValue);
    let returnValue;

    try {
      const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
      const rawValue = path.reduce((obj, prop) => obj[prop], obj);

      switch (type) {
        case 0
        /* GET */
        :
          {
            returnValue = rawValue;
          }
          break;

        case 1
        /* SET */
        :
          {
            parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
            returnValue = true;
          }
          break;

        case 2
        /* APPLY */
        :
          {
            returnValue = rawValue.apply(parent, argumentList);
          }
          break;

        case 3
        /* CONSTRUCT */
        :
          {
            const value = new rawValue(...argumentList);
            returnValue = proxy(value);
          }
          break;

        case 4
        /* ENDPOINT */
        :
          {
            const {
              port1,
              port2
            } = new MessageChannel();
            expose(obj, port2);
            returnValue = transfer(port1, [port1]);
          }
          break;

        case 5
        /* RELEASE */
        :
          {
            returnValue = undefined;
          }
          break;
      }
    } catch (value) {
      returnValue = {
        value,
        [throwMarker]: 0
      };
    }

    Promise.resolve(returnValue).catch(value => {
      return {
        value,
        [throwMarker]: 0
      };
    }).then(returnValue => {
      const [wireValue, transferables] = toWireValue(returnValue);
      ep.postMessage(Object.assign(Object.assign({}, wireValue), {
        id
      }), transferables);

      if (type === 5
      /* RELEASE */
      ) {
          // detach and deactive after sending release response above.
          ep.removeEventListener("message", callback);
          closeEndPoint(ep);
        }
    });
  });

  if (ep.start) {
    ep.start();
  }
}

function isMessagePort(endpoint) {
  return endpoint.constructor.name === "MessagePort";
}

function closeEndPoint(endpoint) {
  if (isMessagePort(endpoint)) endpoint.close();
}

function wrap(ep, target) {
  return createProxy(ep, [], target);
}

function throwIfProxyReleased(isReleased) {
  if (isReleased) {
    throw new Error("Proxy has been released and is not useable");
  }
}

function createProxy(ep, path = [], target = function () {}) {
  let isProxyReleased = false;
  const proxy = new Proxy(target, {
    get(_target, prop) {
      throwIfProxyReleased(isProxyReleased);

      if (prop === releaseProxy) {
        return () => {
          return requestResponseMessage(ep, {
            type: 5
            /* RELEASE */
            ,
            path: path.map(p => p.toString())
          }).then(() => {
            closeEndPoint(ep);
            isProxyReleased = true;
          });
        };
      }

      if (prop === "then") {
        if (path.length === 0) {
          return {
            then: () => proxy
          };
        }

        const r = requestResponseMessage(ep, {
          type: 0
          /* GET */
          ,
          path: path.map(p => p.toString())
        }).then(fromWireValue);
        return r.then.bind(r);
      }

      return createProxy(ep, [...path, prop]);
    },

    set(_target, prop, rawValue) {
      throwIfProxyReleased(isProxyReleased); // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
      // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯

      const [value, transferables] = toWireValue(rawValue);
      return requestResponseMessage(ep, {
        type: 1
        /* SET */
        ,
        path: [...path, prop].map(p => p.toString()),
        value
      }, transferables).then(fromWireValue);
    },

    apply(_target, _thisArg, rawArgumentList) {
      throwIfProxyReleased(isProxyReleased);
      const last = path[path.length - 1];

      if (last === createEndpoint) {
        return requestResponseMessage(ep, {
          type: 4
          /* ENDPOINT */

        }).then(fromWireValue);
      } // We just pretend that `bind()` didn’t happen.


      if (last === "bind") {
        return createProxy(ep, path.slice(0, -1));
      }

      const [argumentList, transferables] = processArguments(rawArgumentList);
      return requestResponseMessage(ep, {
        type: 2
        /* APPLY */
        ,
        path: path.map(p => p.toString()),
        argumentList
      }, transferables).then(fromWireValue);
    },

    construct(_target, rawArgumentList) {
      throwIfProxyReleased(isProxyReleased);
      const [argumentList, transferables] = processArguments(rawArgumentList);
      return requestResponseMessage(ep, {
        type: 3
        /* CONSTRUCT */
        ,
        path: path.map(p => p.toString()),
        argumentList
      }, transferables).then(fromWireValue);
    }

  });
  return proxy;
}

function myFlat(arr) {
  return Array.prototype.concat.apply([], arr);
}

function processArguments(argumentList) {
  const processed = argumentList.map(toWireValue);
  return [processed.map(v => v[0]), myFlat(processed.map(v => v[1]))];
}

const transferCache = new WeakMap();

function transfer(obj, transfers) {
  transferCache.set(obj, transfers);
  return obj;
}

function proxy(obj) {
  return Object.assign(obj, {
    [proxyMarker]: true
  });
}

function windowEndpoint(w, context = self, targetOrigin = "*") {
  return {
    postMessage: (msg, transferables) => w.postMessage(msg, targetOrigin, transferables),
    addEventListener: context.addEventListener.bind(context),
    removeEventListener: context.removeEventListener.bind(context)
  };
}

function toWireValue(value) {
  for (const [name, handler] of transferHandlers) {
    if (handler.canHandle(value)) {
      const [serializedValue, transferables] = handler.serialize(value);
      return [{
        type: 3
        /* HANDLER */
        ,
        name,
        value: serializedValue
      }, transferables];
    }
  }

  return [{
    type: 0
    /* RAW */
    ,
    value
  }, transferCache.get(value) || []];
}

function fromWireValue(value) {
  switch (value.type) {
    case 3
    /* HANDLER */
    :
      return transferHandlers.get(value.name).deserialize(value.value);

    case 0
    /* RAW */
    :
      return value.value;
  }
}

function requestResponseMessage(ep, msg, transfers) {
  return new Promise(resolve => {
    const id = generateUUID();
    ep.addEventListener("message", function l(ev) {
      if (!ev.data || !ev.data.id || ev.data.id !== id) {
        return;
      }

      ep.removeEventListener("message", l);
      resolve(ev.data);
    });

    if (ep.start) {
      ep.start();
    }

    ep.postMessage(Object.assign({
      id
    }, msg), transfers);
  });
}

function generateUUID() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
},{}],"pBGv":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"wLbz":[function(require,module,exports) {

var process = require("process");
const define = globalThis.define;
const html = globalThis.html;

const Comlink = require('comlink');

const events = [];

async function getEvents(arrayBuffer) {
  if (arrayBuffer.byteLength < 100) return;
  let demotool_worker = new Worker("/demotool.worker.b2d91ddd.js");
  if (process && process?.versions?.electron) demotool_worker = new Worker('file:../lib/demotool.worker.js');
  const Demotool = Comlink.wrap(demotool_worker);
  const demotool = await new Demotool();
  await demotool.parse({
    arrayBuffer: arrayBuffer,
    outputBatchSize: 1,
    outputType: 'obj',
    gameEvents: ['player_chargedeployed', 'player_death', 'crossbow_heal', 'rocket_jump', 'sticky_jump', 'demotool_pause_start', 'demotool_pause_end'],
    parserMode: 1
  }, Comlink.proxy(onGameEvent));
  console.log(demotool);
  console.log(events);
  return events;
}

function onGameEvent(eventArr) {
  console.log(...eventArr);
  if (eventArr.length !== 1) debugger;
  const e = eventArr[0];

  const dmg_blast = () => e.values.damagebits & 1 << 6; // DMG_BLAST


  const blasting = () => e.extend_conds.userid.BLASTJUMPING || e.extend_conds_last.userid.BLASTJUMPING;

  const ubered = () => e.extend_conds.userid.INVULNERABLE || e.extend_conds.userid.INVULNERABLE_WEARINGOFF;

  const on = eventName => e.name === eventName;

  const event = ev => {
    ev.name = e.name;
    ev.tick = e.tick;
    events.push(ev);
  };

  on('player_death') && blasting() && dmg_blast() && event({
    steamId: e.extend.userid,
    labelShort: 'Player died from airshot while blasting'
  });
  on('player_death') && (e.extend_conds.attacker.BLASTJUMPING || e.extend_conds_last.attacker.BLASTJUMPING) && dmg_blast() && event({
    steamId: e.extend.attacker,
    labelShort: 'Attacker got airshot kill while blasting'
  });
  on('player_chargedeployed') && blasting() && event({
    steamId: e.extend.userid,
    labelShort: 'ÜberCharge activated while blasting'
  });
  on('crossbow_heal') && (e.extend_conds.targetid.BLASTJUMPING || e.extend_conds_last.targetid.BLASTJUMPING) && event({
    steamId: e.extend.userid,
    labelShort: 'Airshot healing arrow'
  });
  on('rocket_jump') || on('sticky_jump') && ubered() && event({
    steamId: e.extend.userid,
    labelShort: 'Blast jump while ubered'
  });
  on('rocket_jump') || on('sticky_jump') && e.extend_conds.userid.CRITBOOSTED && event({
    steamId: e.extend.userid,
    labelShort: 'Blast jump while kritzed'
  });

  if (blasting()) {
    console.log('blasting', e);
  }
}

const Row = e => {
  return html`
	<tr>
		<td>${e.name}</td>
		<td>${e.steamId}</td>
		<td>${e.tick}</td>
		<td>${e.labelShort}</td>
		<td>${e.label}</td>
	</tr>`;
};

const Table = rows => {
  return html`
	<table>
		${rows}
	</table>`;
};

define('page-events', {
  attachShadow: {
    mode: 'open'
  },
  props: {
    arrayBuffer: new ArrayBuffer(0)
  },
  observedAttributes: ['arrayBuffer'],

  attributeChanged(name, oldValue, newValue) {
    // doesn't seem to work with < .arrayBuffer= />
    console.log(name, oldValue, newValue, 'attributeChanged');
  },

  async update() {
    const data = await getEvents(this.arrayBuffer).then(r => r.map(i => Row(i)));
    this.html`
			${Table(data)}
		`;
  },

  render() {
    this.update();
    return this.html`
			dem len ${this.arrayBuffer.byteLength ?? 'waiting'}`;
  },

  init() {
    console.log('page-events init');
    this.render();
  }

});
},{"comlink":"JZPE","./../../../../lib/demotool.worker.js":[["demotool.worker.b2d91ddd.js","zs1v"],"zs1v"],"process":"pBGv"}]},{},["wLbz"], null)