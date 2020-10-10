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
},{}],"pq01":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = void 0;

const commandOut = (type, arg) => {
  const event = new CustomEvent(type + '', {
    detail: arg
  });
  window.dispatchEvent(event);
};

const commands = {
  goto_tick_extend: (tick, extend) => commandOut('app.goto_tick', `demo_gototick ${tick}; ${extend || ''}`),
  goto_tick: tick => commandOut('app.goto_tick', 'demo_gototick ' + tick),
  exec: str => commandOut('app.exec', str)
};
exports.commands = commands;
},{}],"Ndla":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strings = exports.team_from_index = exports.teams = void 0;
const _teams = {
  '-1': 'neutral',
  '2': 'red',
  '3': 'blu'
};
let teams = {
  neutral: 'neutral',
  red: 'red',
  blu: 'blu'
};
exports.teams = teams;

for (const i of Object.keys(_teams)) {
  teams[i] = i;
}

const team_from_index = team => _teams[team] || _teams['-1'];

exports.team_from_index = team_from_index;
const strings = {
  'round-pause': 'Pause',

  get(str) {
    return this[str] || '';
  }

};
exports.strings = strings;
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
},{}],"vvhj":[function(require,module,exports) {

var process = require("process");
"use strict";

var _commands = require("../../../commands.js");

var _utils = require("../../../utils.js");

const Comlink = require('comlink');

const define = globalThis.define;
const html = globalThis.html;
const css = globalThis.css;

async function getRounds(arrayBuffer) {
  if (arrayBuffer.byteLength < 100) return;
  let demotool_worker = new Worker("https://mazatf2.github.io/DemoUI2.5/demotool.worker.b2d91ddd.js");
  if (process && process?.versions?.electron) demotool_worker = new Worker('file:../lib/demotool.worker.js');
  const Demotool = Comlink.wrap(demotool_worker);
  const demotool = await new Demotool();
  await demotool.parse({
    arrayBuffer: arrayBuffer,
    outputBatchSize: 1,
    outputType: 'obj',
    gameEvents: ['medic_death', 'player_death', 'demotool_pause_start', 'demotool_pause_end', 'teamplay_game_over', 'tf_game_over', 'teamplay_point_captured', 'teamplay_round_selected', 'teamplay_round_start', 'teamplay_round_active', 'teamplay_restart_round', 'teamplay_round_win', 'teamplay_round_stalemate', 'teamplay_overtime_begin', 'teamplay_overtime_end'],
    parserMode: 0
  }, Comlink.proxy(onGameEvent));
  console.log(demotool);
  console.log(rounds);
  return rounds;
}

const style = css`
.timeline {
	width: 100vw; /* viewport width */
	height: 6rem;
	display: grid;
	/* grid-template-columns: repeat( auto-fill, minmax(50px, 1fr) ) */
	grid-auto-flow: column;
	overflow-x: scroll;
	position: relative;
}

.timeline section {
	height: 4rem;
}

.icon {
	top: 2rem;
}

.round-pause {
	z-index: 1;
	height: 3rem !important;
	top: 1rem;
	
	border-left: 1px black solid;
	border-top: 1px black solid;
	border-right: 1px black solid;

	background: repeating-linear-gradient(
		45deg,
		hsla(0, 0%, 66%, 0.2),
		hsla(0, 0%, 66%, 0.2) 1rem,
		hsla(0, 0%, 66%, 0.3) 1rem,
		hsla(0, 0%, 66%, 0.3) 2rem
	)
}
.round-pause * {
	z-index: 1;
}

.round-normal {
	border: 1px black solid;
}

.round-after {
	border-left: 1px black solid;
	border-top: 1px black solid;
	border-bottom: 1px black solid;
	background: #a9a9a9;
}

.round-normal span, .round-normal input, .round-normal button {
	margin: 2px;
}

* {
	/*border: 1px black dotted;*/
}
`;

const GotoButton = (txt, tick, title = '') => {
  return html`
	<button
		onclick=${() => {
    _commands.commands.goto_tick(tick);
  }}
		title=${title}
	>
		${txt}
	</button>`;
};

const RoundComponent = (round, options) => {
  const {
    start,
    end,
    type
  } = round;
  let {
    showSpoilers,
    scalePx
  } = options;
  if (scalePx) scalePx = 16;
  const width = end - start;
  let infoText = '';
  let typeString = '';
  let events = [];
  let backgrounds = [];
  let inputs = [];
  let neutralTeam = _utils.teams.neutral;
  let classNames = [];
  classNames.push(type);

  if (type === 'round-normal') {
    typeString = _utils.strings.get(type);
    infoText = `${start} - ${end}`;
    inputs = [GotoButton('Start', start, `Skip to round start: ${start}`), GotoButton('End', end, `Skip to round end: ${end}`)];
  }

  let style = css`
		position: absolute;
		left: ${start / scalePx + 'px'};
		width: ${width / scalePx + 'px'};
	`;
  const pauses = round.pauseList.map(i => {
    const skip = GotoButton('Skip', i.end, `Skip pause. Skip to: ${i.end}`);
    const pxFromRoundStart = (i.start - start) / scalePx;
    const pauseLen = (i.end - i.start) / scalePx;
    console.log(i, pxFromRoundStart, pauseLen);
    const pauseTicks = `${i.start} - ${i.end}`;
    let pauseStyle = css`
		position: absolute;
		left: ${pxFromRoundStart + 'px'};
		width: ${pauseLen + 'px'};
		`;
    return html`<section
			class=round-pause
			style=${pauseStyle}
		>
			<span>Pause ${pauseTicks}</span>
			${skip}
		</section>`;
  });

  let event = (event, icon, onclick, title) => {
    if (!event) return null;
    if (!onclick) onclick = '';
    let pxFromRoundStart = (event.tick - start) / scalePx;
    const style = css`
			position: absolute;
			left: ${pxFromRoundStart + 'px'};
		`;
    return html`<img-icon data-tick=${event.tick} class=icon style=${style} src=${icon} onclick=${onclick} title=${title}/>`;
  };

  if (round.type === 'round-normal') {
    let midWinner,
        roundWinner = neutralTeam;

    if (showSpoilers) {
      midWinner = (0, _utils.team_from_index)(round.midCapture?.values?.team) || neutralTeam;
      roundWinner = (0, _utils.team_from_index)(round.endValue?.values?.team) || neutralTeam;
    }

    const offset = 200;

    const n = tick => Number(tick) - offset;

    events = [event(round.midCapture, 'cap-point/' + midWinner, () => {
      _commands.commands.goto_tick(n(round.midCapture?.tick));
    }, 'Skip to mid point capture'), event(round.firstDeath, 'health_dead', () => {
      _commands.commands.goto_tick_extend(n(round.firstDeath?.tick), 'ce_cameratools_spec_steamid ' + round.firstDeath?.extend?.userid || '');
    }, 'Skip to first kill')];
  }

  return html`
		<section
			class=${classNames}
			style=${style}
		>
			<span>${infoText}</span>
			${inputs}
			${events}
			${pauses}
			${backgrounds}
			<span>${typeString}</span>
		</section>
	`;
};

let state = {
  isNormalRound: false,
  isAfterRound: false // between rounds

};

let round = (start, end, type) => {
  return {
    start: start,
    end: end,
    type: type,
    width: -1,
    midCapture: -1,
    firstDeath: -1,
    pauseList: []
  };
};

let pauseBlock = round(-1, -1, 'round-pause');
let roundBlock = round(-1, -1, 'round-normal');
let afterRoundBlock = round(-1, -1, 'round-after');
let start = {
  tick: -1
};
let end = {
  tick: -1
};
const rounds = [];
let pauses = [];
let cpCaptures = [];
let deaths = [];

function onGameEvent(eventArr = []) {
  console.log('onEvent', ...eventArr);

  const on = eventName => eventArr.filter(i => i.name === eventName);

  const newPause = on('demotool_pause_start');
  const newPauseEnd = on('demotool_pause_end');
  if (newPause.length > 0) pauseBlock = round(newPause[0].tick, -1, 'round-pause'); //pauseBlock.start = newPause[0].tick

  if (newPauseEnd.length > 0) {
    pauseBlock.end = newPauseEnd[0].tick;
    pauseBlock.width = pauseBlock.end - pauseBlock.start;
    pauses.push(pauseBlock);
  }

  const death = on('player_death');
  if (death.length > 0) deaths.push(death[0]);
  const capture = on('teamplay_point_captured');
  if (capture.length > 0) cpCaptures.push(capture[0]);
  const newStart = on('teamplay_round_start');
  const newEnd = on('teamplay_round_win');
  if (newStart.length > 0) start = newStart[0];
  if (newEnd.length > 0) end = newEnd[0];
  let doRoundStart = false;
  let doAfterRoundStart = false;

  if (newStart[0]?.tick > 0) {
    state.isNormalRound = true;
    state.isAfterRound = false;
    doRoundStart = true;
  }

  if (newEnd[0]?.tick > 0) {
    state.isNormalRound = false;
    state.isAfterRound = true;
    doAfterRoundStart = true;
  }

  if (doRoundStart) {
    console.log(newStart, 'newStart');
    roundBlock = round(start.tick, -1, 'round-normal');
    roundBlock.startvalues = start.values;

    if (afterRoundBlock.start > 0) {
      afterRoundBlock.end = start.tick;
      afterRoundBlock.width = afterRoundBlock.end - afterRoundBlock.start;
      afterRoundBlock.endvalues = start.values;
      rounds.push(afterRoundBlock);
      console.log(afterRoundBlock, 'afterRoundBlock');
    }

    pauses = [];
    cpCaptures = [];
    deaths = [];
  }

  if (doAfterRoundStart) {
    console.log(newEnd, 'newEnd');
    afterRoundBlock = round(end.tick, -1, 'round-after');
    afterRoundBlock.startvalues = end.values;
    roundBlock.end = end.tick;
    roundBlock.width = roundBlock.end - roundBlock.start;
    roundBlock.endvalues = end.values;
    roundBlock.midCapture = cpCaptures[0];
    roundBlock.firstDeath = deaths[0];
    roundBlock.pauseList = pauses;
    pauses = [];
    cpCaptures = [];
    deaths = [];
    rounds.push(roundBlock);
    console.log(roundBlock, 'roundBlock');
  }
}

define('page-roundinfo', {
  attachShadow: {
    mode: 'open'
  },
  props: {
    arrayBuffer: new ArrayBuffer(0)
  },

  async init() {
    this.render();
  },

  async update() {
    const rounds = await getRounds(this.arrayBuffer);
    console.log(rounds);
    const options = {
      showSpoilers: true,
      scalePx: 16
    };
    const components = rounds.map(round => RoundComponent(round, options));
    this.html`
			<style>${style}</style>
			<div class="timeline">
				${components}
			</div>`;
  },

  render(r = []) {
    this.update();
    this.html`
			<style>${style}</style>
			<div class="timeline">
				<span>Waiting</span>
			</div>
		`;
  }

});
},{"comlink":"JZPE","../../../commands.js":"pq01","../../../utils.js":"Ndla","./../../../../lib/demotool.worker.js":[["demotool.worker.b2d91ddd.js","zs1v"],"zs1v"],"process":"pBGv"}]},{},["vvhj"], null)