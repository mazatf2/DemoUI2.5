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
})({"zs1v":[function(require,module,exports) {
var define;
parcelRequire = function (e, r, t, n) {
  var i,
      o = "function" == typeof parcelRequire && parcelRequire,
      u = "function" == typeof require && require;

  function f(t, n) {
    if (!r[t]) {
      if (!e[t]) {
        var i = "function" == typeof parcelRequire && parcelRequire;
        if (!n && i) return i(t, !0);
        if (o) return o(t, !0);
        if (u && "string" == typeof t) return u(t);
        var c = new Error("Cannot find module '" + t + "'");
        throw c.code = "MODULE_NOT_FOUND", c;
      }

      p.resolve = function (r) {
        return e[t][1][r] || r;
      }, p.cache = {};
      var l = r[t] = new f.Module(t);
      e[t][0].call(l.exports, p, l, l.exports, this);
    }

    return r[t].exports;

    function p(e) {
      return f(p.resolve(e));
    }
  }

  f.isParcelRequire = !0, f.Module = function (e) {
    this.id = e, this.bundle = f, this.exports = {};
  }, f.modules = e, f.cache = r, f.parent = o, f.register = function (r, t) {
    e[r] = [function (e, r) {
      r.exports = t;
    }, {}];
  };

  for (var c = 0; c < t.length; c++) try {
    f(t[c]);
  } catch (e) {
    i || (i = e);
  }

  if (t.length) {
    var l = f(t[t.length - 1]);
    "object" == typeof exports && "undefined" != typeof module ? module.exports = l : "function" == typeof define && define.amd ? define(function () {
      return l;
    }) : n && (this[n] = l);
  }

  if (parcelRequire = f, i) throw i;
  return f;
}({
  "dVJy": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.expose = c, exports.proxy = v, exports.transfer = h, exports.windowEndpoint = x, exports.wrap = l, exports.transferHandlers = exports.releaseProxy = exports.proxyMarker = exports.createEndpoint = void 0;
    const e = Symbol("Comlink.proxy");
    exports.proxyMarker = e;
    const t = Symbol("Comlink.endpoint");
    exports.createEndpoint = t;
    const n = Symbol("Comlink.releaseProxy");
    exports.releaseProxy = n;

    const r = Symbol("Comlink.thrown"),
          a = e => "object" == typeof e && null !== e || "function" == typeof e,
          s = {
      canHandle: t => a(t) && t[e],

      serialize(e) {
        const {
          port1: t,
          port2: n
        } = new MessageChannel();
        return c(e, t), [n, [n]];
      },

      deserialize: e => (e.start(), l(e))
    },
          o = {
      canHandle: e => a(e) && r in e,

      serialize({
        value: e
      }) {
        let t;
        return [t = e instanceof Error ? {
          isError: !0,
          value: {
            message: e.message,
            name: e.name,
            stack: e.stack
          }
        } : {
          isError: !1,
          value: e
        }, []];
      },

      deserialize(e) {
        if (e.isError) throw Object.assign(new Error(e.value.message), e.value);
        throw e.value;
      }

    },
          i = new Map([["proxy", s], ["throw", o]]);

    function c(e, t = self) {
      t.addEventListener("message", function n(a) {
        if (!a || !a.data) return;
        const {
          id: s,
          type: o,
          path: i
        } = Object.assign({
          path: []
        }, a.data),
              p = (a.data.argumentList || []).map(w);
        let l;

        try {
          const t = i.slice(0, -1).reduce((e, t) => e[t], e),
                n = i.reduce((e, t) => e[t], e);

          switch (o) {
            case 0:
              l = n;
              break;

            case 1:
              t[i.slice(-1)[0]] = w(a.data.value), l = !0;
              break;

            case 2:
              l = n.apply(t, p);
              break;

            case 3:
              l = v(new n(...p));
              break;

            case 4:
              {
                const {
                  port1: t,
                  port2: n
                } = new MessageChannel();
                c(e, n), l = h(t, [t]);
              }
              break;

            case 5:
              l = void 0;
          }
        } catch (d) {
          l = {
            value: d,
            [r]: 0
          };
        }

        Promise.resolve(l).catch(e => ({
          value: e,
          [r]: 0
        })).then(e => {
          const [r, a] = b(e);
          t.postMessage(Object.assign(Object.assign({}, r), {
            id: s
          }), a), 5 === o && (t.removeEventListener("message", n), u(t));
        });
      }), t.start && t.start();
    }

    function p(e) {
      return "MessagePort" === e.constructor.name;
    }

    function u(e) {
      p(e) && e.close();
    }

    function l(e, t) {
      return f(e, [], t);
    }

    function d(e) {
      if (e) throw new Error("Proxy has been released and is not useable");
    }

    function f(e, r = [], a = function () {}) {
      let s = !1;
      const o = new Proxy(a, {
        get(t, a) {
          if (d(s), a === n) return () => E(e, {
            type: 5,
            path: r.map(e => e.toString())
          }).then(() => {
            u(e), s = !0;
          });

          if ("then" === a) {
            if (0 === r.length) return {
              then: () => o
            };
            const t = E(e, {
              type: 0,
              path: r.map(e => e.toString())
            }).then(w);
            return t.then.bind(t);
          }

          return f(e, [...r, a]);
        },

        set(t, n, a) {
          d(s);
          const [o, i] = b(a);
          return E(e, {
            type: 1,
            path: [...r, n].map(e => e.toString()),
            value: o
          }, i).then(w);
        },

        apply(n, a, o) {
          d(s);
          const i = r[r.length - 1];
          if (i === t) return E(e, {
            type: 4
          }).then(w);
          if ("bind" === i) return f(e, r.slice(0, -1));
          const [c, p] = g(o);
          return E(e, {
            type: 2,
            path: r.map(e => e.toString()),
            argumentList: c
          }, p).then(w);
        },

        construct(t, n) {
          d(s);
          const [a, o] = g(n);
          return E(e, {
            type: 3,
            path: r.map(e => e.toString()),
            argumentList: a
          }, o).then(w);
        }

      });
      return o;
    }

    function m(e) {
      return Array.prototype.concat.apply([], e);
    }

    function g(e) {
      const t = e.map(b);
      return [t.map(e => e[0]), m(t.map(e => e[1]))];
    }

    exports.transferHandlers = i;
    const y = new WeakMap();

    function h(e, t) {
      return y.set(e, t), e;
    }

    function v(t) {
      return Object.assign(t, {
        [e]: !0
      });
    }

    function x(e, t = self, n = "*") {
      return {
        postMessage: (t, r) => e.postMessage(t, n, r),
        addEventListener: t.addEventListener.bind(t),
        removeEventListener: t.removeEventListener.bind(t)
      };
    }

    function b(e) {
      for (const [t, n] of i) if (n.canHandle(e)) {
        const [r, a] = n.serialize(e);
        return [{
          type: 3,
          name: t,
          value: r
        }, a];
      }

      return [{
        type: 0,
        value: e
      }, y.get(e) || []];
    }

    function w(e) {
      switch (e.type) {
        case 3:
          return i.get(e.name).deserialize(e.value);

        case 0:
          return e.value;
      }
    }

    function E(e, t, n) {
      return new Promise(r => {
        const a = M();
        e.addEventListener("message", function t(n) {
          n.data && n.data.id && n.data.id === a && (e.removeEventListener("message", t), r(n.data));
        }), e.start && e.start(), e.postMessage(Object.assign({
          id: a
        }, t), n);
      });
    }

    function M() {
      return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
    }
  }, {}],
  "QAnv": [function (require, module, exports) {
    "use strict";

    exports.byteLength = u, exports.toByteArray = i, exports.fromByteArray = d;

    for (var r = [], t = [], e = "undefined" != typeof Uint8Array ? Uint8Array : Array, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, a = n.length; o < a; ++o) r[o] = n[o], t[n.charCodeAt(o)] = o;

    function h(r) {
      var t = r.length;
      if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var e = r.indexOf("=");
      return -1 === e && (e = t), [e, e === t ? 0 : 4 - e % 4];
    }

    function u(r) {
      var t = h(r),
          e = t[0],
          n = t[1];
      return 3 * (e + n) / 4 - n;
    }

    function c(r, t, e) {
      return 3 * (t + e) / 4 - e;
    }

    function i(r) {
      var n,
          o,
          a = h(r),
          u = a[0],
          i = a[1],
          f = new e(c(r, u, i)),
          A = 0,
          d = i > 0 ? u - 4 : u;

      for (o = 0; o < d; o += 4) n = t[r.charCodeAt(o)] << 18 | t[r.charCodeAt(o + 1)] << 12 | t[r.charCodeAt(o + 2)] << 6 | t[r.charCodeAt(o + 3)], f[A++] = n >> 16 & 255, f[A++] = n >> 8 & 255, f[A++] = 255 & n;

      return 2 === i && (n = t[r.charCodeAt(o)] << 2 | t[r.charCodeAt(o + 1)] >> 4, f[A++] = 255 & n), 1 === i && (n = t[r.charCodeAt(o)] << 10 | t[r.charCodeAt(o + 1)] << 4 | t[r.charCodeAt(o + 2)] >> 2, f[A++] = n >> 8 & 255, f[A++] = 255 & n), f;
    }

    function f(t) {
      return r[t >> 18 & 63] + r[t >> 12 & 63] + r[t >> 6 & 63] + r[63 & t];
    }

    function A(r, t, e) {
      for (var n, o = [], a = t; a < e; a += 3) n = (r[a] << 16 & 16711680) + (r[a + 1] << 8 & 65280) + (255 & r[a + 2]), o.push(f(n));

      return o.join("");
    }

    function d(t) {
      for (var e, n = t.length, o = n % 3, a = [], h = 0, u = n - o; h < u; h += 16383) a.push(A(t, h, h + 16383 > u ? u : h + 16383));

      return 1 === o ? (e = t[n - 1], a.push(r[e >> 2] + r[e << 4 & 63] + "==")) : 2 === o && (e = (t[n - 2] << 8) + t[n - 1], a.push(r[e >> 10] + r[e >> 4 & 63] + r[e << 2 & 63] + "=")), a.join("");
    }

    t["-".charCodeAt(0)] = 62, t["_".charCodeAt(0)] = 63;
  }, {}],
  "O1Qa": [function (require, module, exports) {
    exports.read = function (a, o, t, r, h) {
      var M,
          p,
          w = 8 * h - r - 1,
          f = (1 << w) - 1,
          e = f >> 1,
          i = -7,
          N = t ? h - 1 : 0,
          n = t ? -1 : 1,
          s = a[o + N];

      for (N += n, M = s & (1 << -i) - 1, s >>= -i, i += w; i > 0; M = 256 * M + a[o + N], N += n, i -= 8);

      for (p = M & (1 << -i) - 1, M >>= -i, i += r; i > 0; p = 256 * p + a[o + N], N += n, i -= 8);

      if (0 === M) M = 1 - e;else {
        if (M === f) return p ? NaN : 1 / 0 * (s ? -1 : 1);
        p += Math.pow(2, r), M -= e;
      }
      return (s ? -1 : 1) * p * Math.pow(2, M - r);
    }, exports.write = function (a, o, t, r, h, M) {
      var p,
          w,
          f,
          e = 8 * M - h - 1,
          i = (1 << e) - 1,
          N = i >> 1,
          n = 23 === h ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
          s = r ? 0 : M - 1,
          u = r ? 1 : -1,
          l = o < 0 || 0 === o && 1 / o < 0 ? 1 : 0;

      for (o = Math.abs(o), isNaN(o) || o === 1 / 0 ? (w = isNaN(o) ? 1 : 0, p = i) : (p = Math.floor(Math.log(o) / Math.LN2), o * (f = Math.pow(2, -p)) < 1 && (p--, f *= 2), (o += p + N >= 1 ? n / f : n * Math.pow(2, 1 - N)) * f >= 2 && (p++, f /= 2), p + N >= i ? (w = 0, p = i) : p + N >= 1 ? (w = (o * f - 1) * Math.pow(2, h), p += N) : (w = o * Math.pow(2, N - 1) * Math.pow(2, h), p = 0)); h >= 8; a[t + s] = 255 & w, s += u, w /= 256, h -= 8);

      for (p = p << h | w, e += h; e > 0; a[t + s] = 255 & p, s += u, p /= 256, e -= 8);

      a[t + s - u] |= 128 * l;
    };
  }, {}],
  "ZCp3": [function (require, module, exports) {
    var r = {}.toString;

    module.exports = Array.isArray || function (t) {
      return "[object Array]" == r.call(t);
    };
  }, {}],
  "fe91": [function (require, module, exports) {
    var global = arguments[3];

    var t = arguments[3],
        r = require("base64-js"),
        e = require("ieee754"),
        n = require("isarray");

    function i() {
      try {
        var t = new Uint8Array(1);
        return t.__proto__ = {
          __proto__: Uint8Array.prototype,
          foo: function () {
            return 42;
          }
        }, 42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength;
      } catch (r) {
        return !1;
      }
    }

    function o() {
      return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
    }

    function u(t, r) {
      if (o() < r) throw new RangeError("Invalid typed array length");
      return f.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(r)).__proto__ = f.prototype : (null === t && (t = new f(r)), t.length = r), t;
    }

    function f(t, r, e) {
      if (!(f.TYPED_ARRAY_SUPPORT || this instanceof f)) return new f(t, r, e);

      if ("number" == typeof t) {
        if ("string" == typeof r) throw new Error("If encoding is specified then the first argument must be a string");
        return c(this, t);
      }

      return s(this, t, r, e);
    }

    function s(t, r, e, n) {
      if ("number" == typeof r) throw new TypeError('"value" argument must not be a number');
      return "undefined" != typeof ArrayBuffer && r instanceof ArrayBuffer ? g(t, r, e, n) : "string" == typeof r ? l(t, r, e) : y(t, r);
    }

    function h(t) {
      if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
      if (t < 0) throw new RangeError('"size" argument must not be negative');
    }

    function a(t, r, e, n) {
      return h(r), r <= 0 ? u(t, r) : void 0 !== e ? "string" == typeof n ? u(t, r).fill(e, n) : u(t, r).fill(e) : u(t, r);
    }

    function c(t, r) {
      if (h(r), t = u(t, r < 0 ? 0 : 0 | w(r)), !f.TYPED_ARRAY_SUPPORT) for (var e = 0; e < r; ++e) t[e] = 0;
      return t;
    }

    function l(t, r, e) {
      if ("string" == typeof e && "" !== e || (e = "utf8"), !f.isEncoding(e)) throw new TypeError('"encoding" must be a valid string encoding');
      var n = 0 | v(r, e),
          i = (t = u(t, n)).write(r, e);
      return i !== n && (t = t.slice(0, i)), t;
    }

    function p(t, r) {
      var e = r.length < 0 ? 0 : 0 | w(r.length);
      t = u(t, e);

      for (var n = 0; n < e; n += 1) t[n] = 255 & r[n];

      return t;
    }

    function g(t, r, e, n) {
      if (r.byteLength, e < 0 || r.byteLength < e) throw new RangeError("'offset' is out of bounds");
      if (r.byteLength < e + (n || 0)) throw new RangeError("'length' is out of bounds");
      return r = void 0 === e && void 0 === n ? new Uint8Array(r) : void 0 === n ? new Uint8Array(r, e) : new Uint8Array(r, e, n), f.TYPED_ARRAY_SUPPORT ? (t = r).__proto__ = f.prototype : t = p(t, r), t;
    }

    function y(t, r) {
      if (f.isBuffer(r)) {
        var e = 0 | w(r.length);
        return 0 === (t = u(t, e)).length ? t : (r.copy(t, 0, 0, e), t);
      }

      if (r) {
        if ("undefined" != typeof ArrayBuffer && r.buffer instanceof ArrayBuffer || "length" in r) return "number" != typeof r.length || W(r.length) ? u(t, 0) : p(t, r);
        if ("Buffer" === r.type && n(r.data)) return p(t, r.data);
      }

      throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
    }

    function w(t) {
      if (t >= o()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o().toString(16) + " bytes");
      return 0 | t;
    }

    function d(t) {
      return +t != t && (t = 0), f.alloc(+t);
    }

    function v(t, r) {
      if (f.isBuffer(t)) return t.length;
      if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
      "string" != typeof t && (t = "" + t);
      var e = t.length;
      if (0 === e) return 0;

      for (var n = !1;;) switch (r) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;

        case "utf8":
        case "utf-8":
        case void 0:
          return $(t).length;

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return 2 * e;

        case "hex":
          return e >>> 1;

        case "base64":
          return K(t).length;

        default:
          if (n) return $(t).length;
          r = ("" + r).toLowerCase(), n = !0;
      }
    }

    function E(t, r, e) {
      var n = !1;
      if ((void 0 === r || r < 0) && (r = 0), r > this.length) return "";
      if ((void 0 === e || e > this.length) && (e = this.length), e <= 0) return "";
      if ((e >>>= 0) <= (r >>>= 0)) return "";

      for (t || (t = "utf8");;) switch (t) {
        case "hex":
          return x(this, r, e);

        case "utf8":
        case "utf-8":
          return Y(this, r, e);

        case "ascii":
          return L(this, r, e);

        case "latin1":
        case "binary":
          return D(this, r, e);

        case "base64":
          return S(this, r, e);

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return C(this, r, e);

        default:
          if (n) throw new TypeError("Unknown encoding: " + t);
          t = (t + "").toLowerCase(), n = !0;
      }
    }

    function b(t, r, e) {
      var n = t[r];
      t[r] = t[e], t[e] = n;
    }

    function R(t, r, e, n, i) {
      if (0 === t.length) return -1;

      if ("string" == typeof e ? (n = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, isNaN(e) && (e = i ? 0 : t.length - 1), e < 0 && (e = t.length + e), e >= t.length) {
        if (i) return -1;
        e = t.length - 1;
      } else if (e < 0) {
        if (!i) return -1;
        e = 0;
      }

      if ("string" == typeof r && (r = f.from(r, n)), f.isBuffer(r)) return 0 === r.length ? -1 : _(t, r, e, n, i);
      if ("number" == typeof r) return r &= 255, f.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, r, e) : Uint8Array.prototype.lastIndexOf.call(t, r, e) : _(t, [r], e, n, i);
      throw new TypeError("val must be string, number or Buffer");
    }

    function _(t, r, e, n, i) {
      var o,
          u = 1,
          f = t.length,
          s = r.length;

      if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
        if (t.length < 2 || r.length < 2) return -1;
        u = 2, f /= 2, s /= 2, e /= 2;
      }

      function h(t, r) {
        return 1 === u ? t[r] : t.readUInt16BE(r * u);
      }

      if (i) {
        var a = -1;

        for (o = e; o < f; o++) if (h(t, o) === h(r, -1 === a ? 0 : o - a)) {
          if (-1 === a && (a = o), o - a + 1 === s) return a * u;
        } else -1 !== a && (o -= o - a), a = -1;
      } else for (e + s > f && (e = f - s), o = e; o >= 0; o--) {
        for (var c = !0, l = 0; l < s; l++) if (h(t, o + l) !== h(r, l)) {
          c = !1;
          break;
        }

        if (c) return o;
      }

      return -1;
    }

    function A(t, r, e, n) {
      e = Number(e) || 0;
      var i = t.length - e;
      n ? (n = Number(n)) > i && (n = i) : n = i;
      var o = r.length;
      if (o % 2 != 0) throw new TypeError("Invalid hex string");
      n > o / 2 && (n = o / 2);

      for (var u = 0; u < n; ++u) {
        var f = parseInt(r.substr(2 * u, 2), 16);
        if (isNaN(f)) return u;
        t[e + u] = f;
      }

      return u;
    }

    function m(t, r, e, n) {
      return Q($(r, t.length - e), t, e, n);
    }

    function P(t, r, e, n) {
      return Q(G(r), t, e, n);
    }

    function T(t, r, e, n) {
      return P(t, r, e, n);
    }

    function B(t, r, e, n) {
      return Q(K(r), t, e, n);
    }

    function U(t, r, e, n) {
      return Q(H(r, t.length - e), t, e, n);
    }

    function S(t, e, n) {
      return 0 === e && n === t.length ? r.fromByteArray(t) : r.fromByteArray(t.slice(e, n));
    }

    function Y(t, r, e) {
      e = Math.min(t.length, e);

      for (var n = [], i = r; i < e;) {
        var o,
            u,
            f,
            s,
            h = t[i],
            a = null,
            c = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
        if (i + c <= e) switch (c) {
          case 1:
            h < 128 && (a = h);
            break;

          case 2:
            128 == (192 & (o = t[i + 1])) && (s = (31 & h) << 6 | 63 & o) > 127 && (a = s);
            break;

          case 3:
            o = t[i + 1], u = t[i + 2], 128 == (192 & o) && 128 == (192 & u) && (s = (15 & h) << 12 | (63 & o) << 6 | 63 & u) > 2047 && (s < 55296 || s > 57343) && (a = s);
            break;

          case 4:
            o = t[i + 1], u = t[i + 2], f = t[i + 3], 128 == (192 & o) && 128 == (192 & u) && 128 == (192 & f) && (s = (15 & h) << 18 | (63 & o) << 12 | (63 & u) << 6 | 63 & f) > 65535 && s < 1114112 && (a = s);
        }
        null === a ? (a = 65533, c = 1) : a > 65535 && (a -= 65536, n.push(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), n.push(a), i += c;
      }

      return O(n);
    }

    exports.Buffer = f, exports.SlowBuffer = d, exports.INSPECT_MAX_BYTES = 50, f.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : i(), exports.kMaxLength = o(), f.poolSize = 8192, f._augment = function (t) {
      return t.__proto__ = f.prototype, t;
    }, f.from = function (t, r, e) {
      return s(null, t, r, e);
    }, f.TYPED_ARRAY_SUPPORT && (f.prototype.__proto__ = Uint8Array.prototype, f.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && f[Symbol.species] === f && Object.defineProperty(f, Symbol.species, {
      value: null,
      configurable: !0
    })), f.alloc = function (t, r, e) {
      return a(null, t, r, e);
    }, f.allocUnsafe = function (t) {
      return c(null, t);
    }, f.allocUnsafeSlow = function (t) {
      return c(null, t);
    }, f.isBuffer = function (t) {
      return !(null == t || !t._isBuffer);
    }, f.compare = function (t, r) {
      if (!f.isBuffer(t) || !f.isBuffer(r)) throw new TypeError("Arguments must be Buffers");
      if (t === r) return 0;

      for (var e = t.length, n = r.length, i = 0, o = Math.min(e, n); i < o; ++i) if (t[i] !== r[i]) {
        e = t[i], n = r[i];
        break;
      }

      return e < n ? -1 : n < e ? 1 : 0;
    }, f.isEncoding = function (t) {
      switch (String(t).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;

        default:
          return !1;
      }
    }, f.concat = function (t, r) {
      if (!n(t)) throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === t.length) return f.alloc(0);
      var e;
      if (void 0 === r) for (r = 0, e = 0; e < t.length; ++e) r += t[e].length;
      var i = f.allocUnsafe(r),
          o = 0;

      for (e = 0; e < t.length; ++e) {
        var u = t[e];
        if (!f.isBuffer(u)) throw new TypeError('"list" argument must be an Array of Buffers');
        u.copy(i, o), o += u.length;
      }

      return i;
    }, f.byteLength = v, f.prototype._isBuffer = !0, f.prototype.swap16 = function () {
      var t = this.length;
      if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");

      for (var r = 0; r < t; r += 2) b(this, r, r + 1);

      return this;
    }, f.prototype.swap32 = function () {
      var t = this.length;
      if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");

      for (var r = 0; r < t; r += 4) b(this, r, r + 3), b(this, r + 1, r + 2);

      return this;
    }, f.prototype.swap64 = function () {
      var t = this.length;
      if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");

      for (var r = 0; r < t; r += 8) b(this, r, r + 7), b(this, r + 1, r + 6), b(this, r + 2, r + 5), b(this, r + 3, r + 4);

      return this;
    }, f.prototype.toString = function () {
      var t = 0 | this.length;
      return 0 === t ? "" : 0 === arguments.length ? Y(this, 0, t) : E.apply(this, arguments);
    }, f.prototype.equals = function (t) {
      if (!f.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      return this === t || 0 === f.compare(this, t);
    }, f.prototype.inspect = function () {
      var t = "",
          r = exports.INSPECT_MAX_BYTES;
      return this.length > 0 && (t = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (t += " ... ")), "<Buffer " + t + ">";
    }, f.prototype.compare = function (t, r, e, n, i) {
      if (!f.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      if (void 0 === r && (r = 0), void 0 === e && (e = t ? t.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), r < 0 || e > t.length || n < 0 || i > this.length) throw new RangeError("out of range index");
      if (n >= i && r >= e) return 0;
      if (n >= i) return -1;
      if (r >= e) return 1;
      if (this === t) return 0;

      for (var o = (i >>>= 0) - (n >>>= 0), u = (e >>>= 0) - (r >>>= 0), s = Math.min(o, u), h = this.slice(n, i), a = t.slice(r, e), c = 0; c < s; ++c) if (h[c] !== a[c]) {
        o = h[c], u = a[c];
        break;
      }

      return o < u ? -1 : u < o ? 1 : 0;
    }, f.prototype.includes = function (t, r, e) {
      return -1 !== this.indexOf(t, r, e);
    }, f.prototype.indexOf = function (t, r, e) {
      return R(this, t, r, e, !0);
    }, f.prototype.lastIndexOf = function (t, r, e) {
      return R(this, t, r, e, !1);
    }, f.prototype.write = function (t, r, e, n) {
      if (void 0 === r) n = "utf8", e = this.length, r = 0;else if (void 0 === e && "string" == typeof r) n = r, e = this.length, r = 0;else {
        if (!isFinite(r)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        r |= 0, isFinite(e) ? (e |= 0, void 0 === n && (n = "utf8")) : (n = e, e = void 0);
      }
      var i = this.length - r;
      if ((void 0 === e || e > i) && (e = i), t.length > 0 && (e < 0 || r < 0) || r > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      n || (n = "utf8");

      for (var o = !1;;) switch (n) {
        case "hex":
          return A(this, t, r, e);

        case "utf8":
        case "utf-8":
          return m(this, t, r, e);

        case "ascii":
          return P(this, t, r, e);

        case "latin1":
        case "binary":
          return T(this, t, r, e);

        case "base64":
          return B(this, t, r, e);

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return U(this, t, r, e);

        default:
          if (o) throw new TypeError("Unknown encoding: " + n);
          n = ("" + n).toLowerCase(), o = !0;
      }
    }, f.prototype.toJSON = function () {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    var I = 4096;

    function O(t) {
      var r = t.length;
      if (r <= I) return String.fromCharCode.apply(String, t);

      for (var e = "", n = 0; n < r;) e += String.fromCharCode.apply(String, t.slice(n, n += I));

      return e;
    }

    function L(t, r, e) {
      var n = "";
      e = Math.min(t.length, e);

      for (var i = r; i < e; ++i) n += String.fromCharCode(127 & t[i]);

      return n;
    }

    function D(t, r, e) {
      var n = "";
      e = Math.min(t.length, e);

      for (var i = r; i < e; ++i) n += String.fromCharCode(t[i]);

      return n;
    }

    function x(t, r, e) {
      var n = t.length;
      (!r || r < 0) && (r = 0), (!e || e < 0 || e > n) && (e = n);

      for (var i = "", o = r; o < e; ++o) i += Z(t[o]);

      return i;
    }

    function C(t, r, e) {
      for (var n = t.slice(r, e), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);

      return i;
    }

    function M(t, r, e) {
      if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
      if (t + r > e) throw new RangeError("Trying to access beyond buffer length");
    }

    function k(t, r, e, n, i, o) {
      if (!f.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (r > i || r < o) throw new RangeError('"value" argument is out of bounds');
      if (e + n > t.length) throw new RangeError("Index out of range");
    }

    function N(t, r, e, n) {
      r < 0 && (r = 65535 + r + 1);

      for (var i = 0, o = Math.min(t.length - e, 2); i < o; ++i) t[e + i] = (r & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i);
    }

    function z(t, r, e, n) {
      r < 0 && (r = 4294967295 + r + 1);

      for (var i = 0, o = Math.min(t.length - e, 4); i < o; ++i) t[e + i] = r >>> 8 * (n ? i : 3 - i) & 255;
    }

    function F(t, r, e, n, i, o) {
      if (e + n > t.length) throw new RangeError("Index out of range");
      if (e < 0) throw new RangeError("Index out of range");
    }

    function j(t, r, n, i, o) {
      return o || F(t, r, n, 4, 3.4028234663852886e38, -3.4028234663852886e38), e.write(t, r, n, i, 23, 4), n + 4;
    }

    function q(t, r, n, i, o) {
      return o || F(t, r, n, 8, 1.7976931348623157e308, -1.7976931348623157e308), e.write(t, r, n, i, 52, 8), n + 8;
    }

    f.prototype.slice = function (t, r) {
      var e,
          n = this.length;
      if ((t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), (r = void 0 === r ? n : ~~r) < 0 ? (r += n) < 0 && (r = 0) : r > n && (r = n), r < t && (r = t), f.TYPED_ARRAY_SUPPORT) (e = this.subarray(t, r)).__proto__ = f.prototype;else {
        var i = r - t;
        e = new f(i, void 0);

        for (var o = 0; o < i; ++o) e[o] = this[o + t];
      }
      return e;
    }, f.prototype.readUIntLE = function (t, r, e) {
      t |= 0, r |= 0, e || M(t, r, this.length);

      for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256);) n += this[t + o] * i;

      return n;
    }, f.prototype.readUIntBE = function (t, r, e) {
      t |= 0, r |= 0, e || M(t, r, this.length);

      for (var n = this[t + --r], i = 1; r > 0 && (i *= 256);) n += this[t + --r] * i;

      return n;
    }, f.prototype.readUInt8 = function (t, r) {
      return r || M(t, 1, this.length), this[t];
    }, f.prototype.readUInt16LE = function (t, r) {
      return r || M(t, 2, this.length), this[t] | this[t + 1] << 8;
    }, f.prototype.readUInt16BE = function (t, r) {
      return r || M(t, 2, this.length), this[t] << 8 | this[t + 1];
    }, f.prototype.readUInt32LE = function (t, r) {
      return r || M(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
    }, f.prototype.readUInt32BE = function (t, r) {
      return r || M(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
    }, f.prototype.readIntLE = function (t, r, e) {
      t |= 0, r |= 0, e || M(t, r, this.length);

      for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256);) n += this[t + o] * i;

      return n >= (i *= 128) && (n -= Math.pow(2, 8 * r)), n;
    }, f.prototype.readIntBE = function (t, r, e) {
      t |= 0, r |= 0, e || M(t, r, this.length);

      for (var n = r, i = 1, o = this[t + --n]; n > 0 && (i *= 256);) o += this[t + --n] * i;

      return o >= (i *= 128) && (o -= Math.pow(2, 8 * r)), o;
    }, f.prototype.readInt8 = function (t, r) {
      return r || M(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
    }, f.prototype.readInt16LE = function (t, r) {
      r || M(t, 2, this.length);
      var e = this[t] | this[t + 1] << 8;
      return 32768 & e ? 4294901760 | e : e;
    }, f.prototype.readInt16BE = function (t, r) {
      r || M(t, 2, this.length);
      var e = this[t + 1] | this[t] << 8;
      return 32768 & e ? 4294901760 | e : e;
    }, f.prototype.readInt32LE = function (t, r) {
      return r || M(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
    }, f.prototype.readInt32BE = function (t, r) {
      return r || M(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
    }, f.prototype.readFloatLE = function (t, r) {
      return r || M(t, 4, this.length), e.read(this, t, !0, 23, 4);
    }, f.prototype.readFloatBE = function (t, r) {
      return r || M(t, 4, this.length), e.read(this, t, !1, 23, 4);
    }, f.prototype.readDoubleLE = function (t, r) {
      return r || M(t, 8, this.length), e.read(this, t, !0, 52, 8);
    }, f.prototype.readDoubleBE = function (t, r) {
      return r || M(t, 8, this.length), e.read(this, t, !1, 52, 8);
    }, f.prototype.writeUIntLE = function (t, r, e, n) {
      (t = +t, r |= 0, e |= 0, n) || k(this, t, r, e, Math.pow(2, 8 * e) - 1, 0);
      var i = 1,
          o = 0;

      for (this[r] = 255 & t; ++o < e && (i *= 256);) this[r + o] = t / i & 255;

      return r + e;
    }, f.prototype.writeUIntBE = function (t, r, e, n) {
      (t = +t, r |= 0, e |= 0, n) || k(this, t, r, e, Math.pow(2, 8 * e) - 1, 0);
      var i = e - 1,
          o = 1;

      for (this[r + i] = 255 & t; --i >= 0 && (o *= 256);) this[r + i] = t / o & 255;

      return r + e;
    }, f.prototype.writeUInt8 = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 1, 255, 0), f.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), this[r] = 255 & t, r + 1;
    }, f.prototype.writeUInt16LE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8) : N(this, t, r, !0), r + 2;
    }, f.prototype.writeUInt16BE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = 255 & t) : N(this, t, r, !1), r + 2;
    }, f.prototype.writeUInt32LE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[r + 3] = t >>> 24, this[r + 2] = t >>> 16, this[r + 1] = t >>> 8, this[r] = 255 & t) : z(this, t, r, !0), r + 4;
    }, f.prototype.writeUInt32BE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = 255 & t) : z(this, t, r, !1), r + 4;
    }, f.prototype.writeIntLE = function (t, r, e, n) {
      if (t = +t, r |= 0, !n) {
        var i = Math.pow(2, 8 * e - 1);
        k(this, t, r, e, i - 1, -i);
      }

      var o = 0,
          u = 1,
          f = 0;

      for (this[r] = 255 & t; ++o < e && (u *= 256);) t < 0 && 0 === f && 0 !== this[r + o - 1] && (f = 1), this[r + o] = (t / u >> 0) - f & 255;

      return r + e;
    }, f.prototype.writeIntBE = function (t, r, e, n) {
      if (t = +t, r |= 0, !n) {
        var i = Math.pow(2, 8 * e - 1);
        k(this, t, r, e, i - 1, -i);
      }

      var o = e - 1,
          u = 1,
          f = 0;

      for (this[r + o] = 255 & t; --o >= 0 && (u *= 256);) t < 0 && 0 === f && 0 !== this[r + o + 1] && (f = 1), this[r + o] = (t / u >> 0) - f & 255;

      return r + e;
    }, f.prototype.writeInt8 = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 1, 127, -128), f.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), t < 0 && (t = 255 + t + 1), this[r] = 255 & t, r + 1;
    }, f.prototype.writeInt16LE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8) : N(this, t, r, !0), r + 2;
    }, f.prototype.writeInt16BE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = 255 & t) : N(this, t, r, !1), r + 2;
    }, f.prototype.writeInt32LE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 4, 2147483647, -2147483648), f.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8, this[r + 2] = t >>> 16, this[r + 3] = t >>> 24) : z(this, t, r, !0), r + 4;
    }, f.prototype.writeInt32BE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), f.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = 255 & t) : z(this, t, r, !1), r + 4;
    }, f.prototype.writeFloatLE = function (t, r, e) {
      return j(this, t, r, !0, e);
    }, f.prototype.writeFloatBE = function (t, r, e) {
      return j(this, t, r, !1, e);
    }, f.prototype.writeDoubleLE = function (t, r, e) {
      return q(this, t, r, !0, e);
    }, f.prototype.writeDoubleBE = function (t, r, e) {
      return q(this, t, r, !1, e);
    }, f.prototype.copy = function (t, r, e, n) {
      if (e || (e = 0), n || 0 === n || (n = this.length), r >= t.length && (r = t.length), r || (r = 0), n > 0 && n < e && (n = e), n === e) return 0;
      if (0 === t.length || 0 === this.length) return 0;
      if (r < 0) throw new RangeError("targetStart out of bounds");
      if (e < 0 || e >= this.length) throw new RangeError("sourceStart out of bounds");
      if (n < 0) throw new RangeError("sourceEnd out of bounds");
      n > this.length && (n = this.length), t.length - r < n - e && (n = t.length - r + e);
      var i,
          o = n - e;
      if (this === t && e < r && r < n) for (i = o - 1; i >= 0; --i) t[i + r] = this[i + e];else if (o < 1e3 || !f.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i) t[i + r] = this[i + e];else Uint8Array.prototype.set.call(t, this.subarray(e, e + o), r);
      return o;
    }, f.prototype.fill = function (t, r, e, n) {
      if ("string" == typeof t) {
        if ("string" == typeof r ? (n = r, r = 0, e = this.length) : "string" == typeof e && (n = e, e = this.length), 1 === t.length) {
          var i = t.charCodeAt(0);
          i < 256 && (t = i);
        }

        if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
        if ("string" == typeof n && !f.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
      } else "number" == typeof t && (t &= 255);

      if (r < 0 || this.length < r || this.length < e) throw new RangeError("Out of range index");
      if (e <= r) return this;
      var o;
      if (r >>>= 0, e = void 0 === e ? this.length : e >>> 0, t || (t = 0), "number" == typeof t) for (o = r; o < e; ++o) this[o] = t;else {
        var u = f.isBuffer(t) ? t : $(new f(t, n).toString()),
            s = u.length;

        for (o = 0; o < e - r; ++o) this[o + r] = u[o % s];
      }
      return this;
    };
    var V = /[^+\/0-9A-Za-z-_]/g;

    function X(t) {
      if ((t = J(t).replace(V, "")).length < 2) return "";

      for (; t.length % 4 != 0;) t += "=";

      return t;
    }

    function J(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }

    function Z(t) {
      return t < 16 ? "0" + t.toString(16) : t.toString(16);
    }

    function $(t, r) {
      var e;
      r = r || 1 / 0;

      for (var n = t.length, i = null, o = [], u = 0; u < n; ++u) {
        if ((e = t.charCodeAt(u)) > 55295 && e < 57344) {
          if (!i) {
            if (e > 56319) {
              (r -= 3) > -1 && o.push(239, 191, 189);
              continue;
            }

            if (u + 1 === n) {
              (r -= 3) > -1 && o.push(239, 191, 189);
              continue;
            }

            i = e;
            continue;
          }

          if (e < 56320) {
            (r -= 3) > -1 && o.push(239, 191, 189), i = e;
            continue;
          }

          e = 65536 + (i - 55296 << 10 | e - 56320);
        } else i && (r -= 3) > -1 && o.push(239, 191, 189);

        if (i = null, e < 128) {
          if ((r -= 1) < 0) break;
          o.push(e);
        } else if (e < 2048) {
          if ((r -= 2) < 0) break;
          o.push(e >> 6 | 192, 63 & e | 128);
        } else if (e < 65536) {
          if ((r -= 3) < 0) break;
          o.push(e >> 12 | 224, e >> 6 & 63 | 128, 63 & e | 128);
        } else {
          if (!(e < 1114112)) throw new Error("Invalid code point");
          if ((r -= 4) < 0) break;
          o.push(e >> 18 | 240, e >> 12 & 63 | 128, e >> 6 & 63 | 128, 63 & e | 128);
        }
      }

      return o;
    }

    function G(t) {
      for (var r = [], e = 0; e < t.length; ++e) r.push(255 & t.charCodeAt(e));

      return r;
    }

    function H(t, r) {
      for (var e, n, i, o = [], u = 0; u < t.length && !((r -= 2) < 0); ++u) n = (e = t.charCodeAt(u)) >> 8, i = e % 256, o.push(i), o.push(n);

      return o;
    }

    function K(t) {
      return r.toByteArray(X(t));
    }

    function Q(t, r, e, n) {
      for (var i = 0; i < n && !(i + e >= r.length || i >= t.length); ++i) r[i + e] = t[i];

      return i;
    }

    function W(t) {
      return t != t;
    }
  }, {
    "base64-js": "QAnv",
    "ieee754": "O1Qa",
    "isarray": "ZCp3",
    "buffer": "fe91"
  }],
  "iwlb": [function (require, module, exports) {
    var Buffer = require("buffer").Buffer;

    var define;

    var t,
        e = require("buffer").Buffer;

    !function (i) {
      var r = function (t, i, r) {
        if (!(t instanceof ArrayBuffer || void 0 !== e && t instanceof e)) throw new Error("Must specify a valid ArrayBuffer or Buffer.");
        i = i || 0, r = r || t.byteLength || t.length, this._view = new Uint8Array(t.buffer || t, i, r), this.bigEndian = !1;
      };

      r._scratch = new DataView(new ArrayBuffer(8)), Object.defineProperty(r.prototype, "buffer", {
        get: function () {
          return void 0 !== e ? e.from(this._view.buffer) : this._view.buffer;
        },
        enumerable: !0,
        configurable: !1
      }), Object.defineProperty(r.prototype, "byteLength", {
        get: function () {
          return this._view.length;
        },
        enumerable: !0,
        configurable: !1
      }), r.prototype._setBit = function (t, e) {
        e ? this._view[t >> 3] |= 1 << (7 & t) : this._view[t >> 3] &= ~(1 << (7 & t));
      }, r.prototype.getBits = function (t, e, i) {
        var r = 8 * this._view.length - t;
        if (e > r) throw new Error("Cannot get " + e + " bit(s) from offset " + t + ", " + r + " available");

        for (var n = 0, o = 0; o < e;) {
          var s = e - o,
              a = 7 & t,
              f = this._view[t >> 3],
              p = Math.min(s, 8 - a);
          this.bigEndian ? (n <<= p, n |= f >> 8 - p - a & ~(255 << p)) : n |= (f >> a & ~(255 << p)) << o, t += p, o += p;
        }

        return i ? (32 !== e && n & 1 << e - 1 && (n |= -1 ^ (1 << e) - 1), n) : n >>> 0;
      }, r.prototype.setBits = function (t, e, i) {
        var r = 8 * this._view.length - t;
        if (i > r) throw new Error("Cannot set " + i + " bit(s) from offset " + t + ", " + r + " available");

        for (var n = 0; n < i;) {
          var o,
              s,
              a,
              f = i - n,
              p = 7 & t,
              u = t >> 3,
              h = Math.min(f, 8 - p);

          if (this.bigEndian) {
            s = e >> i - n - h & (o = ~(-1 << h));
            var c = 8 - p - h;
            a = ~(o << c), this._view[u] = this._view[u] & a | s << c;
          } else s = e & (o = ~(255 << h)), e >>= h, a = ~(o << p), this._view[u] = this._view[u] & a | s << p;

          t += h, n += h;
        }
      }, r.prototype.getBoolean = function (t) {
        return 0 !== this.getBits(t, 1, !1);
      }, r.prototype.getInt8 = function (t) {
        return this.getBits(t, 8, !0);
      }, r.prototype.getUint8 = function (t) {
        return this.getBits(t, 8, !1);
      }, r.prototype.getInt16 = function (t) {
        return this.getBits(t, 16, !0);
      }, r.prototype.getUint16 = function (t) {
        return this.getBits(t, 16, !1);
      }, r.prototype.getInt32 = function (t) {
        return this.getBits(t, 32, !0);
      }, r.prototype.getUint32 = function (t) {
        return this.getBits(t, 32, !1);
      }, r.prototype.getFloat32 = function (t) {
        return r._scratch.setUint32(0, this.getUint32(t)), r._scratch.getFloat32(0);
      }, r.prototype.getFloat64 = function (t) {
        return r._scratch.setUint32(0, this.getUint32(t)), r._scratch.setUint32(4, this.getUint32(t + 32)), r._scratch.getFloat64(0);
      }, r.prototype.setBoolean = function (t, e) {
        this.setBits(t, e ? 1 : 0, 1);
      }, r.prototype.setInt8 = r.prototype.setUint8 = function (t, e) {
        this.setBits(t, e, 8);
      }, r.prototype.setInt16 = r.prototype.setUint16 = function (t, e) {
        this.setBits(t, e, 16);
      }, r.prototype.setInt32 = r.prototype.setUint32 = function (t, e) {
        this.setBits(t, e, 32);
      }, r.prototype.setFloat32 = function (t, e) {
        r._scratch.setFloat32(0, e), this.setBits(t, r._scratch.getUint32(0), 32);
      }, r.prototype.setFloat64 = function (t, e) {
        r._scratch.setFloat64(0, e), this.setBits(t, r._scratch.getUint32(0), 32), this.setBits(t + 32, r._scratch.getUint32(4), 32);
      }, r.prototype.getArrayBuffer = function (t, e) {
        for (var i = new Uint8Array(e), r = 0; r < e; r++) i[r] = this.getUint8(t + 8 * r);

        return i;
      };

      var n = function (t, e) {
        return function () {
          if (this._index + e > this._length) throw new Error("Trying to read past the end of the stream");

          var i = this._view[t](this._index);

          return this._index += e, i;
        };
      },
          o = function (t, e) {
        return function (i) {
          this._view[t](this._index, i), this._index += e;
        };
      };

      function s(t, e, i) {
        if (0 === e) return "";
        var r = 0,
            n = [],
            o = !0,
            s = !!e;

        for (e || (e = Math.floor((t._length - t._index) / 8)); r < e;) {
          var a = t.readUint8();
          if (0 === a && (o = !1, !s)) break;
          o && n.push(a), r++;
        }

        var f = String.fromCharCode.apply(null, n);
        if (!i) return f;

        try {
          return decodeURIComponent(escape(f));
        } catch (p) {
          return f;
        }
      }

      var a = function (t, i, n) {
        var o = t instanceof ArrayBuffer || void 0 !== e && t instanceof e;
        if (!(t instanceof r || o)) throw new Error("Must specify a valid BitView, ArrayBuffer or Buffer");
        this._view = o ? new r(t, i, n) : t, this._index = 0, this._startIndex = 0, this._length = 8 * this._view.byteLength;
      };

      Object.defineProperty(a.prototype, "index", {
        get: function () {
          return this._index - this._startIndex;
        },
        set: function (t) {
          this._index = t + this._startIndex;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(a.prototype, "length", {
        get: function () {
          return this._length - this._startIndex;
        },
        set: function (t) {
          this._length = t + this._startIndex;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(a.prototype, "bitsLeft", {
        get: function () {
          return this._length - this._index;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(a.prototype, "byteIndex", {
        get: function () {
          return Math.ceil(this._index / 8);
        },
        set: function (t) {
          this._index = 8 * t;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(a.prototype, "buffer", {
        get: function () {
          return this._view.buffer;
        },
        enumerable: !0,
        configurable: !1
      }), Object.defineProperty(a.prototype, "view", {
        get: function () {
          return this._view;
        },
        enumerable: !0,
        configurable: !1
      }), Object.defineProperty(a.prototype, "bigEndian", {
        get: function () {
          return this._view.bigEndian;
        },
        set: function (t) {
          this._view.bigEndian = t;
        },
        enumerable: !0,
        configurable: !1
      }), a.prototype.readBits = function (t, e) {
        var i = this._view.getBits(this._index, t, e);

        return this._index += t, i;
      }, a.prototype.writeBits = function (t, e) {
        this._view.setBits(this._index, t, e), this._index += e;
      }, a.prototype.readBoolean = n("getBoolean", 1), a.prototype.readInt8 = n("getInt8", 8), a.prototype.readUint8 = n("getUint8", 8), a.prototype.readInt16 = n("getInt16", 16), a.prototype.readUint16 = n("getUint16", 16), a.prototype.readInt32 = n("getInt32", 32), a.prototype.readUint32 = n("getUint32", 32), a.prototype.readFloat32 = n("getFloat32", 32), a.prototype.readFloat64 = n("getFloat64", 64), a.prototype.writeBoolean = o("setBoolean", 1), a.prototype.writeInt8 = o("setInt8", 8), a.prototype.writeUint8 = o("setUint8", 8), a.prototype.writeInt16 = o("setInt16", 16), a.prototype.writeUint16 = o("setUint16", 16), a.prototype.writeInt32 = o("setInt32", 32), a.prototype.writeUint32 = o("setUint32", 32), a.prototype.writeFloat32 = o("setFloat32", 32), a.prototype.writeFloat64 = o("setFloat64", 64), a.prototype.readASCIIString = function (t) {
        return function (t, e) {
          return s(t, e, !1);
        }(this, t);
      }, a.prototype.readUTF8String = function (t) {
        return function (t, e) {
          return s(t, e, !0);
        }(this, t);
      }, a.prototype.writeASCIIString = function (t, e) {
        !function (t, e, i) {
          for (var r = i || e.length + 1, n = 0; n < r; n++) t.writeUint8(n < e.length ? e.charCodeAt(n) : 0);
        }(this, t, e);
      }, a.prototype.writeUTF8String = function (t, e) {
        !function (t, e, i) {
          for (var r = function (t) {
            var e,
                i,
                r = [];

            for (e = 0; e < t.length; e++) (i = t.charCodeAt(e)) <= 127 ? r.push(i) : i <= 2047 ? (r.push(i >> 6 | 192), r.push(63 & i | 128)) : i <= 65535 ? (r.push(i >> 12 | 224), r.push(i >> 6 & 63 | 128), r.push(63 & i | 128)) : (r.push(i >> 18 | 240), r.push(i >> 12 & 63 | 128), r.push(i >> 6 & 63 | 128), r.push(63 & i | 128));

            return r;
          }(e), n = i || r.length + 1, o = 0; o < n; o++) t.writeUint8(o < r.length ? r[o] : 0);
        }(this, t, e);
      }, a.prototype.readBitStream = function (t) {
        var e = new a(this._view);
        return e._startIndex = this._index, e._index = this._index, e.length = t, this._index += t, e;
      }, a.prototype.writeBitStream = function (t, e) {
        var i;

        for (e || (e = t.bitsLeft); e > 0;) i = Math.min(e, 32), this.writeBits(t.readBits(i), i), e -= i;
      }, a.prototype.readArrayBuffer = function (t) {
        var e = this._view.getArrayBuffer(this._index, t);

        return this._index += 8 * t, e;
      }, a.prototype.writeArrayBuffer = function (t, e) {
        this.writeBitStream(new a(t), 8 * e);
      }, void 0 !== t && t.amd ? t(function () {
        return {
          BitView: r,
          BitStream: a
        };
      }) : "undefined" != typeof module && module.exports && (module.exports = {
        BitView: r,
        BitStream: a
      });
    }();
  }, {
    "buffer": "fe91"
  }],
  "LMQS": [function (require, module, exports) {
    "use strict";

    var e,
        t = "object" == typeof Reflect ? Reflect : null,
        n = t && "function" == typeof t.apply ? t.apply : function (e, t, n) {
      return Function.prototype.apply.call(e, t, n);
    };

    function r(e) {
      console && console.warn && console.warn(e);
    }

    e = t && "function" == typeof t.ownKeys ? t.ownKeys : Object.getOwnPropertySymbols ? function (e) {
      return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
    } : function (e) {
      return Object.getOwnPropertyNames(e);
    };

    var i = Number.isNaN || function (e) {
      return e != e;
    };

    function o() {
      o.init.call(this);
    }

    module.exports = o, module.exports.once = m, o.EventEmitter = o, o.prototype._events = void 0, o.prototype._eventsCount = 0, o.prototype._maxListeners = void 0;
    var s = 10;

    function u(e) {
      if ("function" != typeof e) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e);
    }

    function f(e) {
      return void 0 === e._maxListeners ? o.defaultMaxListeners : e._maxListeners;
    }

    function v(e, t, n, i) {
      var o, s, v;
      if (u(n), void 0 === (s = e._events) ? (s = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== s.newListener && (e.emit("newListener", t, n.listener ? n.listener : n), s = e._events), v = s[t]), void 0 === v) v = s[t] = n, ++e._eventsCount;else if ("function" == typeof v ? v = s[t] = i ? [n, v] : [v, n] : i ? v.unshift(n) : v.push(n), (o = f(e)) > 0 && v.length > o && !v.warned) {
        v.warned = !0;
        var l = new Error("Possible EventEmitter memory leak detected. " + v.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        l.name = "MaxListenersExceededWarning", l.emitter = e, l.type = t, l.count = v.length, r(l);
      }
      return e;
    }

    function l() {
      if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }

    function c(e, t, n) {
      var r = {
        fired: !1,
        wrapFn: void 0,
        target: e,
        type: t,
        listener: n
      },
          i = l.bind(r);
      return i.listener = n, r.wrapFn = i, i;
    }

    function a(e, t, n) {
      var r = e._events;
      if (void 0 === r) return [];
      var i = r[t];
      return void 0 === i ? [] : "function" == typeof i ? n ? [i.listener || i] : [i] : n ? d(i) : p(i, i.length);
    }

    function h(e) {
      var t = this._events;

      if (void 0 !== t) {
        var n = t[e];
        if ("function" == typeof n) return 1;
        if (void 0 !== n) return n.length;
      }

      return 0;
    }

    function p(e, t) {
      for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];

      return n;
    }

    function y(e, t) {
      for (; t + 1 < e.length; t++) e[t] = e[t + 1];

      e.pop();
    }

    function d(e) {
      for (var t = new Array(e.length), n = 0; n < t.length; ++n) t[n] = e[n].listener || e[n];

      return t;
    }

    function m(e, t) {
      return new Promise(function (n, r) {
        function i() {
          void 0 !== o && e.removeListener("error", o), n([].slice.call(arguments));
        }

        var o;
        "error" !== t && (o = function (n) {
          e.removeListener(t, i), r(n);
        }, e.once("error", o)), e.once(t, i);
      });
    }

    Object.defineProperty(o, "defaultMaxListeners", {
      enumerable: !0,
      get: function () {
        return s;
      },
      set: function (e) {
        if ("number" != typeof e || e < 0 || i(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
        s = e;
      }
    }), o.init = function () {
      void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }, o.prototype.setMaxListeners = function (e) {
      if ("number" != typeof e || e < 0 || i(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
      return this._maxListeners = e, this;
    }, o.prototype.getMaxListeners = function () {
      return f(this);
    }, o.prototype.emit = function (e) {
      for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);

      var i = "error" === e,
          o = this._events;
      if (void 0 !== o) i = i && void 0 === o.error;else if (!i) return !1;

      if (i) {
        var s;
        if (t.length > 0 && (s = t[0]), s instanceof Error) throw s;
        var u = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
        throw u.context = s, u;
      }

      var f = o[e];
      if (void 0 === f) return !1;
      if ("function" == typeof f) n(f, this, t);else {
        var v = f.length,
            l = p(f, v);

        for (r = 0; r < v; ++r) n(l[r], this, t);
      }
      return !0;
    }, o.prototype.addListener = function (e, t) {
      return v(this, e, t, !1);
    }, o.prototype.on = o.prototype.addListener, o.prototype.prependListener = function (e, t) {
      return v(this, e, t, !0);
    }, o.prototype.once = function (e, t) {
      return u(t), this.on(e, c(this, e, t)), this;
    }, o.prototype.prependOnceListener = function (e, t) {
      return u(t), this.prependListener(e, c(this, e, t)), this;
    }, o.prototype.removeListener = function (e, t) {
      var n, r, i, o, s;
      if (u(t), void 0 === (r = this._events)) return this;
      if (void 0 === (n = r[e])) return this;
      if (n === t || n.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete r[e], r.removeListener && this.emit("removeListener", e, n.listener || t));else if ("function" != typeof n) {
        for (i = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
          s = n[o].listener, i = o;
          break;
        }

        if (i < 0) return this;
        0 === i ? n.shift() : y(n, i), 1 === n.length && (r[e] = n[0]), void 0 !== r.removeListener && this.emit("removeListener", e, s || t);
      }
      return this;
    }, o.prototype.off = o.prototype.removeListener, o.prototype.removeAllListeners = function (e) {
      var t, n, r;
      if (void 0 === (n = this._events)) return this;
      if (void 0 === n.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== n[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete n[e]), this;

      if (0 === arguments.length) {
        var i,
            o = Object.keys(n);

        for (r = 0; r < o.length; ++r) "removeListener" !== (i = o[r]) && this.removeAllListeners(i);

        return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this;
      }

      if ("function" == typeof (t = n[e])) this.removeListener(e, t);else if (void 0 !== t) for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
      return this;
    }, o.prototype.listeners = function (e) {
      return a(this, e, !0);
    }, o.prototype.rawListeners = function (e) {
      return a(this, e, !1);
    }, o.listenerCount = function (e, t) {
      return "function" == typeof e.listenerCount ? e.listenerCount(t) : h.call(e, t);
    }, o.prototype.listenerCount = h, o.prototype.eventNames = function () {
      return this._eventsCount > 0 ? e(this._events) : [];
    };
  }, {}],
  "OreL": [function (require, module, exports) {
    "use strict";

    function e(e, i) {
      switch (e.event.name) {
        case "player_death":
          s(e.event, i);
          break;

        case "teamplay_round_win":
          t(e.event, i);
          break;

        case "player_spawn":
          a(e.event, i);
          break;

        case "object_destroyed":
          n(e.event, i);
          break;

        case "teamplay_round_start":
          r(e.event, i);
      }
    }

    function s(e, s) {
      const t = e.values;

      for (; t.assister > 256 && t.assister < 16384;) t.assister -= 256;

      const a = t.assister < 256 ? t.assister : null;

      for (; t.attacker > 256;) t.attacker -= 256;

      for (; t.userid > 256;) t.userid -= 256;

      s.deaths.push({
        killer: t.attacker,
        assister: a,
        victim: t.userid,
        weapon: t.weapon,
        tick: s.tick
      });
    }

    function t(e, s) {
      const t = e.values;
      6 !== t.winreason && s.rounds.push({
        winner: 2 === t.team ? "red" : "blue",
        length: t.round_time,
        end_tick: s.tick
      });
    }

    function a(e, s) {
      const t = e.values,
            a = t.userid,
            n = s.getUserInfo(a),
            r = s.playerEntityMap.get(n.entityId);
      n.team = 2 === t.team ? "red" : "blue";
      const i = t.class;
      r && (r.classId = i, r.team = t.team), n.classes[i] || (n.classes[i] = 0), n.classes[i]++;
    }

    function n(e, s) {
      const t = e.values;
      s.buildings.delete(t.index);
    }

    function r(e, s) {
      s.buildings.clear();
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.handleGameEvent = void 0, exports.handleGameEvent = e;
  }, {}],
  "yzjq": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Vector = void 0;

    class t {
      constructor(t, e, r) {
        this.x = t, this.y = e, this.z = r;
      }

      static areEqual(t, e) {
        return t.x === e.x && t.y === e.y && t.z === e.z;
      }

    }

    exports.Vector = t;
  }, {}],
  "h5UE": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.SendProp = void 0;

    const e = require("./Vector");

    class r {
      constructor(e) {
        this.definition = e, this.value = null;
      }

      static areEqual(e, t) {
        return e.definition.fullName === t.definition.fullName && r.valuesAreEqual(e.value, t.value);
      }

      static valuesAreEqual(t, n) {
        if (Array.isArray(t) && Array.isArray(n)) {
          if (t.length !== n.length) return !1;

          for (let e = 0; e < t.length; e++) if (!r.valuesAreEqual(t[e], n[e])) return !1;

          return !0;
        }

        return t instanceof e.Vector && n instanceof e.Vector ? e.Vector.areEqual(t, n) : t === n;
      }

      clone() {
        const e = new r(this.definition);
        return e.value = this.value, e;
      }

    }

    exports.SendProp = r;
  }, {
    "./Vector": "yzjq"
  }],
  "zVSi": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.PacketEntity = exports.PVS = void 0;

    const e = require("./SendProp");

    var t;
    !function (e) {
      e[e.PRESERVE = 0] = "PRESERVE", e[e.ENTER = 1] = "ENTER", e[e.LEAVE = 2] = "LEAVE", e[e.DELETE = 4] = "DELETE";
    }(t = exports.PVS || (exports.PVS = {}));

    class r {
      constructor(e, t, r) {
        this.serverClass = e, this.entityIndex = t, this.props = [], this.inPVS = !1, this.pvs = r;
      }

      static getPropByFullName(e, t) {
        for (const r of e) if (r.definition.fullName === t) return r;

        return null;
      }

      getPropByDefinition(e) {
        return r.getPropByFullName(this.props, e.fullName);
      }

      getProperty(e, t) {
        const s = r.getPropByFullName(this.props, `${e}.${t}`);
        if (s) return s;
        throw new Error(`Property not found in entity (${e}.${t})`);
      }

      hasProperty(e, t) {
        return null !== r.getPropByFullName(this.props, `${e}.${t}`);
      }

      clone() {
        const e = new r(this.serverClass, this.entityIndex, this.pvs);

        for (const t of this.props) e.props.push(t.clone());

        return this.serialNumber && (e.serialNumber = this.serialNumber), void 0 !== this.delay && (e.delay = this.delay), e.inPVS = this.inPVS, e;
      }

      applyPropUpdate(e) {
        for (const t of e) {
          const e = this.getPropByDefinition(t.definition);
          e ? e.value = t.value : this.props.push(t.clone());
        }
      }

      diffFromBaseLine(t) {
        return this.props.filter(s => {
          const o = r.getPropByFullName(t, s.definition.fullName);
          return !o || !e.SendProp.areEqual(s, o);
        });
      }

      getPropValue(e) {
        const t = r.getPropByFullName(this.props, e);
        return t ? t.value : null;
      }

    }

    exports.PacketEntity = r;
  }, {
    "./SendProp": "h5UE"
  }],
  "z4Yg": [function (require, module, exports) {
    "use strict";

    function e(e, n, a) {
      for (const t of e.props) "DT_AttributeContainer" === t.definition.ownerTableName && "m_hOuter" === t.definition.name && (n.outerMap.has(t.value) || n.outerMap.set(t.value, e.entityIndex));

      for (const t of e.props) "DT_BaseCombatWeapon" === t.definition.ownerTableName && "m_hOwner" === t.definition.name && (n.weaponMap.has(e.entityIndex) || n.weaponMap.set(e.entityIndex, {
        className: e.serverClass.name,
        owner: t.value
      }));

      switch (e.serverClass.name) {
        case "CWorld":
          n.world.boundaryMin = e.getProperty("DT_WORLD", "m_WorldMins").value, n.world.boundaryMax = e.getProperty("DT_WORLD", "m_WorldMaxs").value;
      }
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.handleBaseEntity = void 0, exports.handleBaseEntity = e;
  }, {}],
  "yRAc": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Player = exports.LifeState = void 0;

    const t = require("./Vector");

    var e;
    !function (t) {
      t[t.ALIVE = 0] = "ALIVE", t[t.DYING = 1] = "DYING", t[t.DEATH = 2] = "DEATH", t[t.RESPAWNABLE = 3] = "RESPAWNABLE";
    }(e = exports.LifeState || (exports.LifeState = {}));

    class i {
      constructor(i, s) {
        this.position = new t.Vector(0, 0, 0), this.health = 0, this.maxHealth = 0, this.classId = 0, this.team = 0, this.viewAngle = 0, this.weaponIds = [], this.ammo = [], this.lifeState = e.DEATH, this.activeWeapon = 0, this.match = i, this.user = s;
      }

      get weapons() {
        return this.weaponIds.map(t => this.match.outerMap.get(t)).filter(t => t > 0).map(t => this.match.weaponMap.get(t));
      }

      hasCondition(t) {
        if (t < 32) {
          if (this.m_nPlayerCond & 1 << t) return !0;
          if (this._condition_bits & 1 << t) return !0;
        }

        return !!(t < 64 && this.m_nPlayerCondEx & 1 << t - 32) || !!(t < 96 && this.m_nPlayerCondEx2 & 1 << t - 64) || !!(t < 128 && this.m_nPlayerCondEx3 & 1 << t - 96);
      }

    }

    exports.Player = i;
  }, {
    "./Vector": "yzjq"
  }],
  "KkD2": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.handleHL2DMEntity = void 0;

    const e = require("../Data/Player");

    function a(a, t, s) {
      switch (a.serverClass.name) {
        case "CHL2MP_Player":
          const s = t.getUserInfoForEntity(a);
          if (!s) throw new Error(`No user info for entity ${a.entityIndex}`);
          if (s.entityId !== a.entityIndex) throw new Error(`Invalid user info for entity ${a.entityIndex} vs ${s.entityId}`);
          const n = t.playerEntityMap.has(a.entityIndex) ? t.playerEntityMap.get(a.entityIndex) : new e.Player(t, s);
          t.playerEntityMap.has(a.entityIndex) || t.playerEntityMap.set(a.entityIndex, n);

          for (const e of a.props) {
            switch ("m_hMyWeapons" === e.definition.ownerTableName && 2097151 !== e.value && (n.weaponIds[parseInt(e.definition.name, 10)] = e.value), "m_iAmmo" === e.definition.ownerTableName && null !== e.value && e.value > 0 && (n.ammo[parseInt(e.definition.name, 10)] = e.value), e.definition.ownerTableName + "." + e.definition.name) {
              case "DT_BaseEntity.m_iTeamNum":
                n.user.team || 2 !== e.value && 3 !== e.value || (n.user.team = 2 === e.value ? "red" : "blue"), n.team = e.value;
                break;

              case "DT_BasePlayer.m_iHealth":
                n.health = e.value;
                break;

              case "DT_BasePlayer.m_iMaxHealth":
                n.maxHealth = e.value;
                break;

              case "DT_BaseEntity.m_vecOrigin":
                n.position.x = e.value.x, n.position.y = e.value.y, n.position.z = e.value.z;
                break;

              case "DT_HL2MP_Player.m_angEyeAngles[0]":
              case "DT_HL2MP_Player.m_angEyeAngles[1]":
                n.viewAngle = e.value;
                break;

              case "DT_BasePlayer.m_lifeState":
                n.lifeState = e.value;
                break;

              case "DT_BaseCombatCharacter.m_hActiveWeapon":
                for (let a = 0; a < n.weapons.length; a++) n.weaponIds[a] === e.value && (n.activeWeapon = a);

            }
          }

          break;

        case "CTeam":
          if (a.hasProperty("DT_Team", "m_iTeamNum")) {
            const e = a.getProperty("DT_Team", "m_iTeamNum").value;

            if (!t.teams.has(e)) {
              const s = {
                name: a.getProperty("DT_Team", "m_szTeamname").value,
                score: a.getProperty("DT_Team", "m_iScore").value,
                roundsWon: a.getProperty("DT_Team", "m_iRoundsWon").value,
                players: a.getProperty("DT_Team", '"player_array"').value,
                teamNumber: e
              };
              t.teams.set(e, s), t.teamEntityMap.set(a.entityIndex, s);
            }
          } else {
            const e = t.teamEntityMap.get(a.entityIndex);
            if (!e) throw new Error(`No team with entity id: ${a.entityIndex}`);

            for (const t of a.props) {
              switch (t.definition.ownerTableName + "." + t.definition.name) {
                case "DT_Team.m_iScore":
                  e.score = t.value;
                  break;

                case "DT_Team.m_szTeamname":
                  e.name = t.value;
                  break;

                case "DT_Team.m_iRoundsWon":
                  e.roundsWon = t.value;
                  break;

                case 'DT_Team."player_array"':
                  e.players = t.value;
              }
            }
          }

          break;

        case "CPlayerResource":
          for (const e of a.props) {
            const a = parseInt(e.definition.name, 10),
                  s = e.value;
            t.playerResources[a] || (t.playerResources[a] = {
              alive: !1,
              arenaSpectator: !1,
              bonusPoints: 0,
              chargeLevel: 0,
              connected: !1,
              damageAssists: 0,
              damageBlocked: 0,
              deaths: 0,
              dominations: 0,
              healing: 0,
              healingAssist: 0,
              health: 0,
              killStreak: 0,
              maxBuffedHealth: 0,
              maxHealth: 0,
              nextRespawn: 0,
              ping: 0,
              playerClass: 0,
              playerLevel: 0,
              score: 0,
              team: 0,
              totalScore: 0,
              damage: 0
            });
            const n = t.playerResources[a];

            switch (e.definition.ownerTableName) {
              case "m_iPing":
                n.ping = s;
                break;

              case "m_iScore":
                n.score = s;
                break;

              case "m_iDeaths":
                n.deaths = s;
                break;

              case "m_bConnected":
                n.connected = s > 0;
                break;

              case "m_iTeam":
                n.team = s;
                break;

              case "m_bAlive":
                n.alive = s > 0;
                break;

              case "m_iHealth":
                n.health = s;
                break;

              case "m_iTotalScore":
                n.totalScore = s;
                break;

              case "m_iMaxHealth":
                n.maxHealth = s;
                break;

              case "m_iMaxBuffedHealth":
                n.maxBuffedHealth = s;
                break;

              case "m_iPlayerClass":
                n.playerClass = s;
                break;

              case "m_bArenaSpectator":
                n.arenaSpectator = s > 0;
                break;

              case "m_iActiveDominations":
                n.dominations = s;
                break;

              case "m_flNextRespawnTime":
                n.nextRespawn = s;
                break;

              case "m_iChargeLevel":
                n.chargeLevel = s;
                break;

              case "m_iDamage":
                n.damage = s;
                break;

              case "m_iDamageAssist":
                n.damageAssists = s;
                break;

              case "m_iHealing":
                n.healing = s;
                break;

              case "m_iHealingAssist":
                n.healingAssist = s;
                break;

              case "m_iDamageBlocked":
                n.damageBlocked = s;
                break;

              case "m_iBonusPoints":
                n.bonusPoints = s;
                break;

              case "m_iPlayerLevel":
                n.playerLevel = s;
                break;

              case "m_iKillstreak":
                n.killStreak = s;
            }
          }

      }
    }

    exports.handleHL2DMEntity = a;
  }, {
    "../Data/Player": "yRAc"
  }],
  "M9RL": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.handleTFEntity = void 0;

    const e = require("../Data/PacketEntity"),
          a = require("../Data/Player"),
          t = require("../Data/Vector");

    function n(n, s, r) {
      switch (n.serverClass.name) {
        case "CTFPlayer":
          const l = s.getUserInfoForEntity(n);
          if (!l) throw new Error(`No user info for entity ${n.entityIndex}`);
          const o = s.playerEntityMap.has(n.entityIndex) ? s.playerEntityMap.get(n.entityIndex) : new a.Player(s, l);
          s.playerEntityMap.has(n.entityIndex) || s.playerEntityMap.set(n.entityIndex, o);

          for (const e of n.props) {
            switch ("m_hMyWeapons" === e.definition.ownerTableName && 2097151 !== e.value && (o.weaponIds[parseInt(e.definition.name, 10)] = e.value), "m_iAmmo" === e.definition.ownerTableName && null !== e.value && e.value > 0 && (o.ammo[parseInt(e.definition.name, 10)] = e.value), e.definition.ownerTableName + "." + e.definition.name) {
              case "DT_BasePlayer.m_iHealth":
                o.health = e.value;
                break;

              case "DT_BasePlayer.m_iMaxHealth":
                o.maxHealth = e.value;
                break;

              case "DT_TFLocalPlayerExclusive.m_vecOrigin":
                o.position.x = e.value.x, o.position.y = e.value.y, o.viewAngle = r.localViewAngles[0].y;
                break;

              case "DT_TFNonLocalPlayerExclusive.m_vecOrigin":
                o.position.x = e.value.x, o.position.y = e.value.y;
                break;

              case "DT_TFLocalPlayerExclusive.m_vecOrigin[2]":
              case "DT_TFNonLocalPlayerExclusive.m_vecOrigin[2]":
                o.position.z = e.value;
                break;

              case "DT_TFNonLocalPlayerExclusive.m_angEyeAngles[1]":
              case "DT_TFLocalPlayerExclusive.m_angEyeAngles[1]":
                o.viewAngle = e.value;
                break;

              case "DT_BasePlayer.m_lifeState":
                o.lifeState = e.value;
                break;

              case "DT_BaseCombatCharacter.m_hActiveWeapon":
                for (let a = 0; a < o.weapons.length; a++) o.weaponIds[a] === e.value && (o.activeWeapon = a);

                break;

              case "DT_TFPlayerShared.m_nPlayerCond":
                o.m_nPlayerCond = e.value;
                break;

              case "DT_TFPlayerShared.m_nPlayerCondEx":
                o.m_nPlayerCondEx = e.value;
                break;

              case "DT_TFPlayerShared.m_nPlayerCondEx2":
                o.m_nPlayerCondEx2 = e.value;
                break;

              case "DT_TFPlayerShared.m_nPlayerCondEx3":
                o.m_nPlayerCondEx3 = e.value;
                break;

              case "DT_TFPlayerConditionListExclusive._condition_bits":
                o._condition_bits = e.value;
            }
          }

          break;

        case "CWeaponMedigun":
          const c = s.weaponMap.get(n.entityIndex);
          if (c && "CWeaponMedigun" === c.className) for (const e of n.props) {
            switch (e.definition.ownerTableName + "." + e.definition.name) {
              case "DT_WeaponMedigun.m_hHealingTarget":
                c.healTarget = e.value;
                break;

              case "DT_TFWeaponMedigunDataNonLocal.m_flChargeLevel":
              case "DT_LocalTFWeaponMedigunData.m_flChargeLevel":
                c.chargeLevel = e.value;
            }
          }
          break;

        case "CTFTeam":
          if (n.hasProperty("DT_Team", "m_iTeamNum")) {
            const e = n.getProperty("DT_Team", "m_iTeamNum").value;

            if (!s.teams.has(e)) {
              const a = {
                name: n.getProperty("DT_Team", "m_szTeamname").value,
                score: n.getProperty("DT_Team", "m_iScore").value,
                roundsWon: n.getProperty("DT_Team", "m_iRoundsWon").value,
                players: n.getProperty("DT_Team", '"player_array"').value,
                teamNumber: e
              };
              s.teams.set(e, a), s.teamEntityMap.set(n.entityIndex, a);
            }
          } else {
            const e = s.teamEntityMap.get(n.entityIndex);
            if (!e) throw new Error(`No team with entity id: ${n.entityIndex}`);

            for (const a of n.props) {
              switch (a.definition.ownerTableName + "." + a.definition.name) {
                case "DT_Team.m_iScore":
                  e.score = a.value;
                  break;

                case "DT_Team.m_szTeamname":
                  e.name = a.value;
                  break;

                case "DT_Team.m_iRoundsWon":
                  e.roundsWon = a.value;
                  break;

                case 'DT_Team."player_array"':
                  e.players = a.value;
              }
            }
          }

          break;

        case "CObjectSentrygun":
          s.buildings.has(n.entityIndex) || s.buildings.set(n.entityIndex, {
            type: "sentry",
            ammoRockets: 0,
            ammoShells: 0,
            autoAimTarget: 0,
            builder: 0,
            health: 0,
            isBuilding: !1,
            isSapped: !1,
            level: 0,
            maxHealth: 0,
            playerControlled: !1,
            position: new t.Vector(0, 0, 0),
            shieldLevel: 0,
            isMini: !1,
            team: 0,
            angle: 0
          });
          const m = s.buildings.get(n.entityIndex);

          for (const e of n.props) {
            const a = e.definition.ownerTableName + "." + e.definition.name;

            switch (i(m, e, a), a) {
              case "DT_ObjectSentrygun.m_bPlayerControlled":
                m.playerControlled = e.value > 0;
                break;

              case "DT_ObjectSentrygun.m_hAutoAimTarget":
                m.autoAimTarget = e.value;
                break;

              case "DT_ObjectSentrygun.m_nShieldLevel":
                m.shieldLevel = e.value;
                break;

              case "DT_ObjectSentrygun.m_iAmmoShells":
                m.ammoShells = e.value;
                break;

              case "DT_ObjectSentrygun.m_iAmmoRockets":
                m.ammoRockets = e.value;
                break;

              case "DT_BaseObject.m_bMiniBuilding":
                m.isMini = e.value > 1;
                break;

              case "DT_TFNonLocalPlayerExclusive.m_angEyeAngles[1]":
                m.angle = e.value;
            }
          }

          n.pvs & e.PVS.LEAVE && s.buildings.delete(n.entityIndex);
          break;

        case "CObjectDispenser":
          s.buildings.has(n.entityIndex) || s.buildings.set(n.entityIndex, {
            type: "dispenser",
            builder: 0,
            health: 0,
            isBuilding: !1,
            isSapped: !1,
            level: 0,
            maxHealth: 0,
            position: new t.Vector(0, 0, 0),
            team: 0,
            healing: [],
            metal: 0,
            angle: 0
          });

          const _ = s.buildings.get(n.entityIndex);

          for (const e of n.props) {
            const a = e.definition.ownerTableName + "." + e.definition.name;

            switch (i(_, e, a), a) {
              case "DT_ObjectDispenser.m_iAmmoMetal":
                _.metal = e.value;
                break;

              case 'DT_ObjectDispenser."healing_array"':
                _.healing = e.value;
            }
          }

          n.pvs & e.PVS.LEAVE && s.buildings.delete(n.entityIndex);
          break;

        case "CObjectTeleporter":
          s.buildings.has(n.entityIndex) || s.buildings.set(n.entityIndex, {
            type: "teleporter",
            builder: 0,
            health: 0,
            isBuilding: !1,
            isSapped: !1,
            level: 0,
            maxHealth: 0,
            position: new t.Vector(0, 0, 0),
            team: 0,
            isEntrance: !1,
            otherEnd: 0,
            rechargeTime: 0,
            rechargeDuration: 0,
            timesUsed: 0,
            angle: 0,
            yawToExit: 0
          });
          const d = s.buildings.get(n.entityIndex);

          for (const e of n.props) {
            const a = e.definition.ownerTableName + "." + e.definition.name;

            switch (i(d, e, a), a) {
              case "DT_ObjectTeleporter.m_flRechargeTime":
                d.rechargeTime = e.value;
                break;

              case "DT_ObjectTeleporter.m_flCurrentRechargeDuration":
                d.rechargeDuration = e.value;
                break;

              case "DT_ObjectTeleporter.m_iTimesUsed":
                d.timesUsed = e.value;
                break;

              case "DT_ObjectTeleporter.m_bMatchBuilding":
                d.otherEnd = e.value;
                break;

              case "DT_ObjectTeleporter.m_flYawToExit":
                d.yawToExit = e.value;
                break;

              case "DT_BaseObject.m_iObjectMode":
                d.isEntrance = 0 === e.value;
            }
          }

          n.pvs & e.PVS.LEAVE && s.buildings.delete(n.entityIndex);
          break;

        case "CTFPlayerResource":
          for (const e of n.props) {
            const a = parseInt(e.definition.name, 10),
                  t = e.value;
            s.playerResources[a] || (s.playerResources[a] = {
              alive: !1,
              arenaSpectator: !1,
              bonusPoints: 0,
              chargeLevel: 0,
              connected: !1,
              damageAssists: 0,
              damageBlocked: 0,
              deaths: 0,
              dominations: 0,
              healing: 0,
              healingAssist: 0,
              health: 0,
              killStreak: 0,
              maxBuffedHealth: 0,
              maxHealth: 0,
              nextRespawn: 0,
              ping: 0,
              playerClass: 0,
              playerLevel: 0,
              score: 0,
              team: 0,
              totalScore: 0,
              damage: 0
            });
            const n = s.playerResources[a];

            switch (e.definition.ownerTableName) {
              case "m_iPing":
                n.ping = t;
                break;

              case "m_iScore":
                n.score = t;
                break;

              case "m_iDeaths":
                n.deaths = t;
                break;

              case "m_bConnected":
                n.connected = t > 0;
                break;

              case "m_iTeam":
                n.team = t;
                break;

              case "m_bAlive":
                n.alive = t > 0;
                break;

              case "m_iHealth":
                n.health = t;
                break;

              case "m_iTotalScore":
                n.totalScore = t;
                break;

              case "m_iMaxHealth":
                n.maxHealth = t;
                break;

              case "m_iMaxBuffedHealth":
                n.maxBuffedHealth = t;
                break;

              case "m_iPlayerClass":
                n.playerClass = t;
                break;

              case "m_bArenaSpectator":
                n.arenaSpectator = t > 0;
                break;

              case "m_iActiveDominations":
                n.dominations = t;
                break;

              case "m_flNextRespawnTime":
                n.nextRespawn = t;
                break;

              case "m_iChargeLevel":
                n.chargeLevel = t;
                break;

              case "m_iDamage":
                n.damage = t;
                break;

              case "m_iDamageAssist":
                n.damageAssists = t;
                break;

              case "m_iHealing":
                n.healing = t;
                break;

              case "m_iHealingAssist":
                n.healingAssist = t;
                break;

              case "m_iDamageBlocked":
                n.damageBlocked = t;
                break;

              case "m_iBonusPoints":
                n.bonusPoints = t;
                break;

              case "m_iPlayerLevel":
                n.playerLevel = t;
                break;

              case "m_iKillstreak":
                n.killStreak = t;
            }
          }

      }
    }

    function i(e, a, t) {
      switch (t) {
        case "DT_BaseObject.m_iUpgradeLevel":
          e.level = a.value;
          break;

        case "DT_BaseObject.m_hBuilder":
          e.builder = a.value;
          break;

        case "DT_BaseObject.m_iMaxHealth":
          e.maxHealth = a.value;
          break;

        case "DT_BaseObject.m_iHealth":
          e.health = a.value;
          break;

        case "DT_BaseObject.m_bBuilding":
          e.isBuilding = a.value > 0;
          break;

        case "DT_BaseObject.m_bHasSapper":
          e.isSapped = a.value > 0;
          break;

        case "DT_BaseEntity.m_vecOrigin":
          e.position = a.value;
          break;

        case "DT_BaseEntity.m_iTeamNum":
          e.team = a.value;
          break;

        case "DT_BaseEntity.m_angRotation":
          e.angle = a.value.y;
      }
    }

    exports.handleTFEntity = n;
  }, {
    "../Data/PacketEntity": "zVSi",
    "../Data/Player": "yRAc",
    "../Data/Vector": "yzjq"
  }],
  "wqyr": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.handlePacketEntitiesForState = exports.handlePacketEntities = void 0;

    const e = require("../Data/PacketEntity"),
          t = require("./BaseEntityHandler"),
          n = require("./HL2DMEntityHandler"),
          s = require("./TFEntityHandler");

    function i(e, i, a) {
      for (const r of e.entities) switch (t.handleBaseEntity(r, i, a), i.parserState.game) {
        case "tf":
          s.handleTFEntity(r, i, a);
          break;

        case "hl2mp":
          n.handleHL2DMEntity(r, i, a);
      }
    }

    function a(e, t) {
      for (const n of e.removedEntities) t.entityClasses.delete(n);

      for (const n of e.entities) r(n, t);
    }

    function r(t, n) {
      t.pvs === e.PVS.DELETE && n.entityClasses.delete(t.entityIndex), n.entityClasses.set(t.entityIndex, t.serverClass);
    }

    exports.handlePacketEntities = i, exports.handlePacketEntitiesForState = a;
  }, {
    "../Data/PacketEntity": "zVSi",
    "./BaseEntityHandler": "z4Yg",
    "./HL2DMEntityHandler": "KkD2",
    "./TFEntityHandler": "M9RL"
  }],
  "lfy2": [function (require, module, exports) {
    "use strict";

    function e(e, t) {
      if ("#TF_Name_Change" !== e.kind) t.chat.push({
        kind: e.kind,
        from: e.from,
        text: e.text,
        tick: t.tick
      });else for (const o of t.users.values()) o.name === e.from && (o.name = e.text);
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.handleSayText2 = void 0, exports.handleSayText2 = e;
  }, {}],
  "BVWM": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Match = void 0;

    const t = require("../PacketHandler/GameEvent"),
          e = require("../PacketHandler/PacketEntities"),
          s = require("../PacketHandler/SayText2");

    class a {
      constructor(t) {
        this.tick = 0, this.chat = [], this.users = new Map(), this.deaths = [], this.rounds = [], this.startTick = 0, this.intervalPerTick = 0, this.world = {
          boundaryMin: {
            x: 0,
            y: 0,
            z: 0
          },
          boundaryMax: {
            x: 0,
            y: 0,
            z: 0
          }
        }, this.playerEntityMap = new Map(), this.weaponMap = new Map(), this.outerMap = new Map(), this.teams = new Map(), this.teamEntityMap = new Map(), this.buildings = new Map(), this.playerResources = [], this.parserState = t;
      }

      getState() {
        const t = {};

        for (const e of this.parserState.userInfo.values()) this.getUserInfo(e.userId);

        for (const [e, s] of this.users.entries()) t[e] = {
          classes: s.classes,
          name: s.name,
          steamId: s.steamId,
          userId: s.userId
        }, s.team && (t[e].team = s.team);

        return {
          chat: this.chat,
          users: t,
          deaths: this.deaths,
          rounds: this.rounds,
          startTick: this.startTick,
          intervalPerTick: this.intervalPerTick
        };
      }

      handlePacket(a, r) {
        switch (a.packetType) {
          case "packetEntities":
            e.handlePacketEntities(a, this, r);
            break;

          case "netTick":
            0 === this.startTick && (this.startTick = a.tick), this.tick = a.tick;
            break;

          case "serverInfo":
            this.intervalPerTick = a.intervalPerTick;
            break;

          case "userMessage":
            switch (a.userMessageType) {
              case "sayText2":
                s.handleSayText2(a, this);
            }

            break;

          case "gameEvent":
            t.handleGameEvent(a, this);
        }
      }

      getUserInfo(t) {
        for (; t > 256;) t -= 256;

        const e = this.users.get(t);
        if (e && e.userId !== t) throw new Error("Invalid user info id");

        if (!e) {
          const e = this.parserState.getUserEntityInfo(t),
                s = Object.assign({
            classes: {},
            team: ""
          }, e);
          return this.users.set(t, s), s;
        }

        if (!e.steamId) {
          const s = this.parserState.getUserEntityInfo(t);
          s.steamId && (e.steamId = s.steamId, e.entityId = s.entityId, e.name = s.name);
        }

        return e;
      }

      getUserInfoForEntity(t) {
        for (const e of this.parserState.userInfo.values()) if (e && e.entityId === t.entityIndex) return this.getUserInfo(e.userId);

        return null;
      }

      getPlayerByUserId(t) {
        const e = this.getUserInfo(t);
        return this.playerEntityMap.get(e.entityId) || null;
      }

    }

    exports.Match = a;
  }, {
    "../PacketHandler/GameEvent": "OreL",
    "../PacketHandler/PacketEntities": "wqyr",
    "../PacketHandler/SayText2": "lfy2"
  }],
  "QLqZ": [function (require, module, exports) {
    "use strict";

    var e;
    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.MessageType = void 0, function (e) {
      e[e.Sigon = 1] = "Sigon", e[e.Packet = 2] = "Packet", e[e.SyncTick = 3] = "SyncTick", e[e.ConsoleCmd = 4] = "ConsoleCmd", e[e.UserCmd = 5] = "UserCmd", e[e.DataTables = 6] = "DataTables", e[e.Stop = 7] = "Stop", e[e.StringTables = 8] = "StringTables";
    }(e = exports.MessageType || (exports.MessageType = {}));
  }, {}],
  "tjse": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Analyser = void 0;

    const e = require("events"),
          t = require("./Data/Match"),
          s = require("./Data/Message");

    class a extends e.EventEmitter {
      constructor(e) {
        super(), this.analysed = !1, this.parser = e, this.match = new t.Match(this.parser.parserState);
      }

      getHeader() {
        return this.parser.getHeader();
      }

      getBody() {
        if (!this.analysed) {
          for (const e of this.getPackets()) this.emit("packet", e);

          this.emit("done");
        }

        return this.analysed = !0, this.match;
      }

      *getPackets() {
        for (const e of this.parser.getMessages()) if (e.type === s.MessageType.Packet) for (const t of e.packets) this.match.handlePacket(t, e), yield t;
      }

      *getMessages() {
        for (const e of this.parser.getMessages()) {
          if (e.type === s.MessageType.Packet) for (const t of e.packets) this.match.handlePacket(t, e);
          yield e;
        }
      }

    }

    exports.Analyser = a;
  }, {
    "events": "LMQS",
    "./Data/Match": "BVWM",
    "./Data/Message": "QLqZ"
  }],
  "H8pU": [function (require, module, exports) {
    "use strict";

    var e;
    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.PacketTypeId = void 0, function (e) {
      e[e.file = 2] = "file", e[e.netTick = 3] = "netTick", e[e.stringCmd = 4] = "stringCmd", e[e.setConVar = 5] = "setConVar", e[e.sigOnState = 6] = "sigOnState", e[e.print = 7] = "print", e[e.serverInfo = 8] = "serverInfo", e[e.classInfo = 10] = "classInfo", e[e.setPause = 11] = "setPause", e[e.createStringTable = 12] = "createStringTable", e[e.updateStringTable = 13] = "updateStringTable", e[e.voiceInit = 14] = "voiceInit", e[e.voiceData = 15] = "voiceData", e[e.parseSounds = 17] = "parseSounds", e[e.setView = 18] = "setView", e[e.fixAngle = 19] = "fixAngle", e[e.bspDecal = 21] = "bspDecal", e[e.userMessage = 23] = "userMessage", e[e.entityMessage = 24] = "entityMessage", e[e.gameEvent = 25] = "gameEvent", e[e.packetEntities = 26] = "packetEntities", e[e.tempEntities = 27] = "tempEntities", e[e.preFetch = 28] = "preFetch", e[e.menu = 29] = "menu", e[e.gameEventList = 30] = "gameEventList", e[e.getCvarValue = 31] = "getCvarValue", e[e.cmdKeyValues = 32] = "cmdKeyValues";
    }(e = exports.PacketTypeId || (exports.PacketTypeId = {}));
  }, {}],
  "kDn8": [function (require, module, exports) {
    "use strict";

    function e(e, t) {
      t.eventDefinitions = e.eventList;
      const n = Array.from(e.eventList.entries()).map(([e, t]) => [t.name, e]);
      t.eventDefinitionTypes = new Map(n);
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.handleGameEventList = void 0, exports.handleGameEventList = e;
  }, {}],
  "kjDW": [function (require, module, exports) {
    "use strict";

    function e(e, t) {
      a(e.table, t);
    }

    function t(e, t) {
      for (const n of e.tables) a(n, t);
    }

    function n(e, t) {
      s(t.stringTables[e.tableId].name, e.entries, t);
    }

    function a(e, t) {
      t.getStringTable(e.name) || t.stringTables.push(e), s(e.name, e.entries, t);
    }

    function s(e, t, n) {
      if ("userinfo" === e) for (const a of t) a && a.extraData && r(a.text, a.extraData, n);
      if ("instancebaseline" === e) for (const a of t) a && i(a, n);
    }

    function r(e, t, n) {
      if (t.bitsLeft > 256) {
        const a = t.readUTF8String(32);
        let s = t.readUint32();

        for (; s > 256;) s -= 256;

        const r = t.readUTF8String();

        if (r) {
          const t = parseInt(e, 10) + 1;
          let i = n.userInfo.get(s);
          i || (i = {
            name: "",
            userId: s,
            steamId: "",
            entityId: t
          }, n.userInfo.set(i.userId, i)), i.name = a, i.steamId = r;
        }
      }
    }

    function i(e, t) {
      if (!e.extraData) throw new Error("Missing baseline");
      {
        const n = parseInt(e.text, 10);
        t.staticBaselineCache.delete(n), t.staticBaseLines.set(n, e.extraData);
      }
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.handleTable = exports.handleStringTableUpdate = exports.handleStringTables = exports.handleStringTable = void 0, exports.handleStringTable = e, exports.handleStringTables = t, exports.handleStringTableUpdate = n, exports.handleTable = a;
  }, {}],
  "WRKG": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.createParserState = exports.getSendTable = exports.getClassBits = exports.ParserState = void 0;

    const e = require("../PacketHandler/GameEventList"),
          s = require("../PacketHandler/PacketEntities"),
          t = require("../PacketHandler/StringTable"),
          a = require("./Message");

    class n {
      constructor() {
        this.version = 0, this.staticBaseLines = new Map(), this.staticBaselineCache = new Map(), this.eventDefinitions = new Map(), this.eventDefinitionTypes = new Map(), this.entityClasses = new Map(), this.sendTables = new Map(), this.stringTables = [], this.serverClasses = [], this.instanceBaselines = [new Map(), new Map()], this.skippedPackets = [], this.userInfo = new Map(), this.tick = 0;
      }

      handlePacket(a) {
        switch (a.packetType) {
          case "netTick":
            this.tick = a.tick;
            break;

          case "serverInfo":
            this.version = a.version, this.game = a.game;
            break;

          case "stringTable":
            t.handleStringTables(a, this);
            break;

          case "createStringTable":
            t.handleStringTable(a, this);
            break;

          case "updateStringTable":
            t.handleStringTableUpdate(a, this);
            break;

          case "gameEventList":
            e.handleGameEventList(a, this);
            break;

          case "packetEntities":
            s.handlePacketEntitiesForState(a, this);
        }
      }

      handleMessage(e) {
        switch (e.type) {
          case a.MessageType.DataTables:
            this.handleDataTableMessage(e);
            break;

          case a.MessageType.StringTables:
            this.handleStringTableMessage(e);
        }
      }

      getStringTable(e) {
        const s = this.stringTables.find(s => s.name === e);
        return s || null;
      }

      getUserEntityInfo(e) {
        const s = this.userInfo.get(JSON.parse(JSON.stringify(e)));
        return s || {
          name: "",
          userId: e,
          steamId: "",
          entityId: 0
        };
      }

      handleDataTableMessage(e) {
        for (const s of e.tables) this.sendTables.set(s.name, s);

        this.serverClasses = e.serverClasses;
      }

      handleStringTableMessage(e) {
        for (const s of e.tables) t.handleTable(s, this);
      }

    }

    function i(e) {
      return Math.ceil(Math.log(e.serverClasses.length) * Math.LOG2E);
    }

    function r(e, s) {
      const t = e.sendTables.get(s);
      if (!t) throw new Error(`Unknown sendTable ${s}`);
      return t;
    }

    function l() {
      return new n();
    }

    exports.ParserState = n, exports.getClassBits = i, exports.getSendTable = r, exports.createParserState = l;
  }, {
    "../PacketHandler/GameEventList": "kDn8",
    "../PacketHandler/PacketEntities": "wqyr",
    "../PacketHandler/StringTable": "kjDW",
    "./Message": "QLqZ"
  }],
  "sUtz": [function (require, module, exports) {
    "use strict";

    function e(e) {
      return {
        type: e.readASCIIString(8),
        version: e.readInt32(),
        protocol: e.readInt32(),
        server: e.readASCIIString(260),
        nick: e.readASCIIString(260),
        map: e.readASCIIString(260),
        game: e.readASCIIString(260),
        duration: e.readFloat32(),
        ticks: e.readInt32(),
        frames: e.readInt32(),
        sigon: e.readInt32()
      };
    }

    function r(e, r) {
      r.writeASCIIString(e.type, 8), r.writeUint32(e.version), r.writeUint32(e.protocol), r.writeASCIIString(e.server, 260), r.writeASCIIString(e.nick, 260), r.writeASCIIString(e.map, 260), r.writeASCIIString(e.game, 260), r.writeFloat32(e.duration), r.writeUint32(e.ticks), r.writeUint32(e.frames), r.writeUint32(e.sigon);
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.encodeHeader = exports.parseHeader = void 0, exports.parseHeader = e, exports.encodeHeader = r;
  }, {}],
  "OACT": [function (require, module, exports) {
    var define;
    var e;
    !function (t, n) {
      if ("function" == typeof e && e.amd) e([], n);else if ("object" == typeof exports) module.exports = n();else {
        var r = n();
        t.TextEncoder = r.TextEncoder, t.TextDecoder = r.TextDecoder;
      }
    }(this, function () {
      "use strict";

      var e = "undefined" != typeof GLOBAL ? GLOBAL : self;
      if (void 0 !== e.TextEncoder && void 0 !== e.TextDecoder) return {
        TextEncoder: e.TextEncoder,
        TextDecoder: e.TextDecoder
      };
      var t = ["utf8", "utf-8", "unicode-1-1-utf-8"];
      return {
        TextEncoder: function (e) {
          if (t.indexOf(e) < 0 && void 0 !== e && null != e) throw new RangeError("Invalid encoding type. Only utf-8 is supported");
          this.encoding = "utf-8", this.encode = function (e) {
            if ("string" != typeof e) throw new TypeError("passed argument must be of tye string");
            var t = unescape(encodeURIComponent(e)),
                n = new Uint8Array(t.length);
            return t.split("").forEach(function (e, t) {
              n[t] = e.charCodeAt(0);
            }), n;
          };
        },
        TextDecoder: function (e, n) {
          if (t.indexOf(e) < 0 && void 0 !== e && null != e) throw new RangeError("Invalid encoding type. Only utf-8 is supported");
          if (this.encoding = "utf-8", this.ignoreBOM = !1, this.fatal = void 0 !== n && fatal in n && n.fatal, "boolean" != typeof this.fatal) throw new TypeError("fatal flag must be boolean");

          this.decode = function (e, t) {
            if (void 0 === e) return "";
            var n = void 0 !== t && n in t && t.stream;
            if ("boolean" != typeof n) throw new TypeError("stream option must be boolean");

            if (ArrayBuffer.isView(e)) {
              var r = new Uint8Array(e.buffer),
                  o = new Array(r.length);
              return r.forEach(function (e, t) {
                o[t] = String.fromCharCode(e);
              }), decodeURIComponent(escape(o.join("")));
            }

            throw new TypeError("passed argument must be an array buffer view");
          };
        }
      };
    });
  }, {}],
  "GtMa": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Parser = void 0;

    class t {
      constructor(t, s, e, r, i, o = []) {
        this.type = t, this.tick = s, this.stream = e, this.length = r, this.state = i, this.skippedPackets = o;
      }

    }

    exports.Parser = t;
  }, {}],
  "x1Ky": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.ConsoleCmdHandler = exports.ConsoleCmd = void 0;

    const e = require("text-encoding-shim"),
          r = require("../../Data/Message"),
          t = require("./Parser");

    class s extends t.Parser {
      parse() {
        return [{
          packetType: "consoleCmd",
          command: this.stream.readUTF8String()
        }];
      }

    }

    exports.ConsoleCmd = s, exports.ConsoleCmdHandler = {
      parseMessage: e => {
        const t = e.readInt32(),
              s = e.readInt32(),
              n = e.readBitStream(8 * s);
        return {
          type: r.MessageType.ConsoleCmd,
          tick: t,
          rawData: n,
          command: n.readUTF8String()
        };
      },
      encodeMessage: (r, t) => {
        t.writeUint32(r.tick);
        const s = new e.TextEncoder("utf-8").encode(r.command).length + 1;
        t.writeUint32(s), t.writeUTF8String(r.command);
      }
    };
  }, {
    "text-encoding-shim": "OACT",
    "../../Data/Message": "QLqZ",
    "./Parser": "GtMa"
  }],
  "B5Tw": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.SendPropFlag = exports.SendPropType = exports.SendPropDefinition = void 0;

    class P {
      constructor(P, t, e, _) {
        this.originalBitCount = null, this.type = P, this.name = t, this.flags = e, this.excludeDTName = null, this.lowValue = 0, this.highValue = 0, this.bitCount = 0, this.table = null, this.numElements = 0, this.arrayProperty = null, this.ownerTableName = _;
      }

      static formatFlags(P) {
        const t = [];

        for (const _ in e) if (e.hasOwnProperty(_)) {
          const O = e[_];
          "number" == typeof O && P & O && t.push(_);
        }

        return t;
      }

      hasFlag(P) {
        return 0 != (this.flags & P);
      }

      isExcludeProp() {
        return this.hasFlag(e.SPROP_EXCLUDE);
      }

      inspect() {
        const P = {
          ownerTableName: this.ownerTableName,
          name: this.name,
          type: t[this.type],
          flags: this.flags,
          bitCount: this.bitCount
        };
        return this.type === t.DPT_Float && (P.lowValue = this.lowValue, P.highValue = this.highValue), this.type === t.DPT_DataTable && this.table && (P.excludeDTName = this.table.name), P;
      }

      get fullName() {
        return `${this.ownerTableName}.${this.name}`;
      }

      get allFlags() {
        return P.formatFlags(this.flags);
      }

    }

    var t, e;
    exports.SendPropDefinition = P, function (P) {
      P[P.DPT_Int = 0] = "DPT_Int", P[P.DPT_Float = 1] = "DPT_Float", P[P.DPT_Vector = 2] = "DPT_Vector", P[P.DPT_VectorXY = 3] = "DPT_VectorXY", P[P.DPT_String = 4] = "DPT_String", P[P.DPT_Array = 5] = "DPT_Array", P[P.DPT_DataTable = 6] = "DPT_DataTable", P[P.DPT_NUMSendPropTypes = 7] = "DPT_NUMSendPropTypes";
    }(t = exports.SendPropType || (exports.SendPropType = {})), function (P) {
      P[P.SPROP_UNSIGNED = 1] = "SPROP_UNSIGNED", P[P.SPROP_COORD = 2] = "SPROP_COORD", P[P.SPROP_NOSCALE = 4] = "SPROP_NOSCALE", P[P.SPROP_ROUNDDOWN = 8] = "SPROP_ROUNDDOWN", P[P.SPROP_ROUNDUP = 16] = "SPROP_ROUNDUP", P[P.SPROP_NORMAL = 32] = "SPROP_NORMAL", P[P.SPROP_EXCLUDE = 64] = "SPROP_EXCLUDE", P[P.SPROP_XYZE = 128] = "SPROP_XYZE", P[P.SPROP_INSIDEARRAY = 256] = "SPROP_INSIDEARRAY", P[P.SPROP_PROXY_ALWAYS_YES = 512] = "SPROP_PROXY_ALWAYS_YES", P[P.SPROP_CHANGES_OFTEN = 1024] = "SPROP_CHANGES_OFTEN", P[P.SPROP_IS_A_VECTOR_ELEM = 2048] = "SPROP_IS_A_VECTOR_ELEM", P[P.SPROP_COLLAPSIBLE = 4096] = "SPROP_COLLAPSIBLE", P[P.SPROP_COORD_MP = 8192] = "SPROP_COORD_MP", P[P.SPROP_COORD_MP_LOWPRECISION = 16384] = "SPROP_COORD_MP_LOWPRECISION", P[P.SPROP_COORD_MP_INTEGRAL = 32768] = "SPROP_COORD_MP_INTEGRAL", P[P.SPROP_VARINT = 32] = "SPROP_VARINT";
    }(e = exports.SendPropFlag || (exports.SendPropFlag = {}));
  }, {}],
  "hlX4": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.SendTable = void 0;

    const e = require("./SendPropDefinition");

    class t {
      constructor(e) {
        this.name = e, this.props = [], this.cachedFlattenedProps = [];
      }

      addProp(e) {
        this.props.push(e);
      }

      getAllProps(e, t) {
        const s = [];
        this.getAllPropsIteratorProps(e, s, t);

        for (const o of s) t.push(o);
      }

      getAllPropsIteratorProps(t, s, o) {
        for (const r of this.props) r.hasFlag(e.SendPropFlag.SPROP_EXCLUDE) || t.filter(e => e.name === r.name && e.excludeDTName === r.ownerTableName).length > 0 || (r.type === e.SendPropType.DPT_DataTable && r.table ? r.hasFlag(e.SendPropFlag.SPROP_COLLAPSIBLE) ? r.table.getAllPropsIteratorProps(t, s, o) : r.table.getAllProps(t, o) : s.push(r));
      }

      get flattenedProps() {
        return 0 === this.cachedFlattenedProps.length && this.flatten(), this.cachedFlattenedProps;
      }

      get excludes() {
        let t = [];

        for (const s of this.props) s.hasFlag(e.SendPropFlag.SPROP_EXCLUDE) ? t.push(s) : s.type === e.SendPropType.DPT_DataTable && s.table && (t = t.concat(s.table.excludes));

        return t;
      }

      flatten() {
        const t = this.excludes,
              s = [];
        this.getAllProps(t, s);
        let o = 0;

        for (let r = 0; r < s.length; r++) if (s[r].hasFlag(e.SendPropFlag.SPROP_CHANGES_OFTEN)) {
          if (r !== o) {
            const e = s[r];
            s[r] = s[o], s[o] = e;
          }

          o++;
        }

        this.cachedFlattenedProps = s;
      }

    }

    exports.SendTable = t;
  }, {
    "./SendPropDefinition": "B5Tw"
  }],
  "Wijt": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.ServerClass = void 0;

    class e {
      constructor(e, s, t) {
        this.id = e, this.name = s, this.dataTable = t;
      }

    }

    exports.ServerClass = e;
  }, {}],
  "mMII": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.DataTableHandler = void 0;

    const e = require("../../Data/Message"),
          r = require("../../Data/SendPropDefinition"),
          t = require("../../Data/SendTable"),
          a = require("../../Data/ServerClass");

    function n(e, t) {
      if (e.writeBits(t.type, 5), e.writeASCIIString(t.name), e.writeBits(t.flags, 16), t.type === r.SendPropType.DPT_DataTable) {
        if (!t.table) throw new Error("Missing linked table");
        e.writeASCIIString(t.table.name);
      } else if (t.isExcludeProp()) {
        if (!t.excludeDTName) throw new Error("Missing linked table");
        e.writeASCIIString(t.excludeDTName);
      } else t.type === r.SendPropType.DPT_Array ? e.writeBits(t.numElements, 10) : (e.writeFloat32(t.lowValue), e.writeFloat32(t.highValue), t.hasFlag(r.SendPropFlag.SPROP_NOSCALE) && (t.type === r.SendPropType.DPT_Float || t.type === r.SendPropType.DPT_Vector && !t.hasFlag(r.SendPropFlag.SPROP_NORMAL)) ? null === t.originalBitCount || void 0 === t.originalBitCount ? e.writeBits(t.bitCount / 3, 7) : e.writeBits(t.originalBitCount, 7) : e.writeBits(t.bitCount, 7));
    }

    exports.DataTableHandler = {
      parseMessage: n => {
        const i = n.readInt32(),
              o = n.readInt32(),
              s = n.readBitStream(8 * o),
              l = [],
              d = new Map();

        for (; s.readBoolean();) {
          const e = s.readBoolean(),
                a = s.readASCIIString(),
                n = s.readBits(10),
                i = new t.SendTable(a);
          let o;
          i.needsDecoder = e;

          for (let t = 0; t < n; t++) {
            const e = s.readBits(5),
                  t = s.readASCIIString(),
                  n = 16,
                  l = s.readBits(n),
                  d = new r.SendPropDefinition(e, t, l, a);

            if (e === r.SendPropType.DPT_DataTable ? d.excludeDTName = s.readASCIIString() : d.isExcludeProp() ? d.excludeDTName = s.readASCIIString() : d.type === r.SendPropType.DPT_Array ? d.numElements = s.readBits(10) : (d.lowValue = s.readFloat32(), d.highValue = s.readFloat32(), d.bitCount = s.readBits(7)), d.hasFlag(r.SendPropFlag.SPROP_NOSCALE) && (d.type === r.SendPropType.DPT_Float ? (d.originalBitCount = d.bitCount, d.bitCount = 32) : d.type === r.SendPropType.DPT_Vector && (d.hasFlag(r.SendPropFlag.SPROP_NORMAL) || (d.originalBitCount = d.bitCount, d.bitCount = 96))), o) {
              if (d.type !== r.SendPropType.DPT_Array) throw new Error("expected prop of type array");
              d.arrayProperty = o, o = null;
            }

            if (d.hasFlag(r.SendPropFlag.SPROP_INSIDEARRAY)) {
              if (o) throw new Error("array element already set");
              if (d.hasFlag(r.SendPropFlag.SPROP_CHANGES_OFTEN)) throw new Error("unexpected CHANGES_OFTEN prop in array");
              o = d;
            } else i.addProp(d);
          }

          l.push(i), d.set(i.name, i);
        }

        for (const e of l) for (const t of e.props) if (t.type === r.SendPropType.DPT_DataTable && t.excludeDTName) {
          const e = d.get(t.excludeDTName);
          if (!e) throw new Error(`Unknown referenced table ${t.excludeDTName}`);
          t.table = e, t.excludeDTName = null;
        }

        const p = s.readUint16(),
              S = [];
        if (p <= 0) throw new Error("expected one or more serverclasses");

        for (let e = 0; e < p; e++) {
          const e = s.readUint16();
          if (e > p) throw new Error("invalid class id");
          const r = s.readASCIIString(),
                t = s.readASCIIString();
          S.push(new a.ServerClass(e, r, t));
        }

        if (s.bitsLeft > 7) throw new Error("unexpected remaining data in datatable (" + s.bitsLeft + " bits)");
        return {
          type: e.MessageType.DataTables,
          tick: i,
          rawData: s,
          tables: l,
          serverClasses: S
        };
      },
      encodeMessage: (e, r) => {
        r.writeUint32(e.tick);
        const t = r.index;
        r.index += 32;
        const a = r.index;

        for (const s of e.tables) {
          r.writeBoolean(!0), r.writeBoolean(s.needsDecoder), r.writeASCIIString(s.name);
          const e = r.index;
          r.index += 10;
          let t = 0;

          for (const i of s.props) i.arrayProperty && (n(r, i.arrayProperty), t++), n(r, i), t++;

          const a = r.index;
          r.index = e, r.writeBits(t, 10), r.index = a;
        }

        r.writeBoolean(!1), r.writeUint16(e.serverClasses.length);

        for (const n of e.serverClasses) r.writeUint16(n.id), r.writeASCIIString(n.name), r.writeASCIIString(n.dataTable);

        const i = r.index;
        r.index = t;
        const o = Math.ceil((i - a) / 8);
        r.writeUint32(o), r.index = a + 8 * o;
      }
    };
  }, {
    "../../Data/Message": "QLqZ",
    "../../Data/SendPropDefinition": "B5Tw",
    "../../Data/SendTable": "hlX4",
    "../../Data/ServerClass": "Wijt"
  }],
  "OpLt": [function (require, module, exports) {
    "use strict";

    function e(e) {
      let o = 0;

      for (e >>= 1; 0 !== e && o < 32;) o++, e >>= 1;

      return o;
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.logBase2 = void 0, exports.logBase2 = e;
  }, {}],
  "qcki": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.writeVarInt = exports.readVarInt = exports.readUBitVar = exports.writeBitVar = exports.readBitVar = exports.makeUnsigned = void 0;

    const t = require("../Math");

    function r(t, r) {
      if (r) {
        const r = t < 0 ? 1 : 0;
        return ((t ^ -r) << 1) + r;
      }

      return t;
    }

    function e(t, r) {
      switch (t.readBits(2)) {
        case 0:
          return t.readBits(4, r);

        case 1:
          return t.readBits(8, r);

        case 2:
          return t.readBits(12, r);

        case 3:
          return t.readBits(32, r);
      }

      throw new Error("Invalid var bit");
    }

    function i(r, e, i) {
      const s = i ? t.logBase2(Math.abs(r)) + 2 : t.logBase2(r) + 1;

      if (i) {
        const t = r < 0 ? 1 : 0;
        r ^= (-t << s - 1) + (t << s - 1);
      }

      s > 12 ? (e.writeBits(3, 2), e.writeBits(r, 32)) : s > 8 ? (e.writeBits(2, 2), e.writeBits(r, 12)) : s > 4 ? (e.writeBits(1, 2), e.writeBits(r, 8)) : (e.writeBits(0, 2), e.writeBits(r, 4));
    }

    function s(t, r = !1) {
      let e = 0;

      for (let i = 0; i < 35; i += 7) {
        const r = t.readUint8();
        if (e |= (127 & r) << i, r >> 7 == 0) break;
      }

      return r ? e >> 1 ^ -(1 & e) : e;
    }

    function a(t, e, i = !1) {
      t = r(t, i);

      do {
        const r = 127 & t,
              i = t >= 128 ? 128 : 0;
        e.writeUint8(r | i), t >>= 7;
      } while (t > 0);
    }

    exports.makeUnsigned = r, exports.readBitVar = e, exports.writeBitVar = i, exports.readUBitVar = e, exports.readVarInt = s, exports.writeVarInt = a;
  }, {
    "../Math": "OpLt"
  }],
  "Oirr": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.SendPropParser = exports.bitNormalFactor = void 0;

    const r = require("../Data/SendPropDefinition"),
          e = require("../Data/Vector"),
          t = require("../Math"),
          a = require("./readBitVar");

    exports.bitNormalFactor = 1 / 2047;

    class o {
      static decode(e, t) {
        switch (e.type) {
          case r.SendPropType.DPT_Int:
            return o.readInt(e, t);

          case r.SendPropType.DPT_Vector:
            return o.readVector(e, t);

          case r.SendPropType.DPT_VectorXY:
            return o.readVectorXY(e, t);

          case r.SendPropType.DPT_Float:
            return o.readFloat(e, t);

          case r.SendPropType.DPT_String:
            return o.readString(t);

          case r.SendPropType.DPT_Array:
            return o.readArray(e, t);
        }

        throw new Error(`Unknown property type ${e.type}`);
      }

      static readInt(e, t) {
        return e.hasFlag(r.SendPropFlag.SPROP_VARINT) ? a.readVarInt(t, !e.hasFlag(r.SendPropFlag.SPROP_UNSIGNED)) : t.readBits(e.bitCount, !e.hasFlag(r.SendPropFlag.SPROP_UNSIGNED));
      }

      static readArray(r, e) {
        const a = t.logBase2(r.numElements) + 1,
              n = e.readBits(a),
              d = [];
        if (!r.arrayProperty) throw new Error("Array of undefined type");

        for (let t = 0; t < n; t++) {
          const t = o.decode(r.arrayProperty, e);
          if (t instanceof Array) throw new Error("Nested arrays not supported");
          d.push(t);
        }

        return d;
      }

      static readString(r) {
        const e = r.readBits(9);
        return r.readASCIIString(e);
      }

      static readVector(r, t) {
        const a = o.readFloat(r, t),
              n = o.readFloat(r, t),
              d = o.readFloat(r, t);
        return new e.Vector(a, n, d);
      }

      static readVectorXY(r, t) {
        const a = o.readFloat(r, t),
              n = o.readFloat(r, t);
        return new e.Vector(a, n, 0);
      }

      static readFloat(e, t) {
        if (e.hasFlag(r.SendPropFlag.SPROP_COORD)) return o.readBitCoord(t);
        if (e.hasFlag(r.SendPropFlag.SPROP_COORD_MP)) return o.readBitCoordMP(t, !1, !1);
        if (e.hasFlag(r.SendPropFlag.SPROP_COORD_MP_LOWPRECISION)) return o.readBitCoordMP(t, !1, !0);
        if (e.hasFlag(r.SendPropFlag.SPROP_COORD_MP_INTEGRAL)) return o.readBitCoordMP(t, !0, !1);
        if (e.hasFlag(r.SendPropFlag.SPROP_NOSCALE)) return t.readFloat32();
        if (e.hasFlag(r.SendPropFlag.SPROP_NORMAL)) return o.readBitNormal(t);
        {
          const r = t.readBits(e.bitCount) / ((1 << e.bitCount) - 1);
          return e.lowValue + (e.highValue - e.lowValue) * r;
        }
      }

      static readBitNormal(r) {
        const e = r.readBoolean(),
              t = r.readBits(11) * exports.bitNormalFactor;
        return e ? -t : t;
      }

      static readBitCoord(r) {
        const e = r.readBoolean(),
              t = r.readBoolean();

        if (e || t) {
          const a = r.readBoolean(),
                o = (e ? r.readBits(14) + 1 : 0) + (t ? r.readBits(5) : 0) * (1 / 32);
          return a ? -o : o;
        }

        return 0;
      }

      static readBitCoordMP(r, e, t) {
        let a = 0,
            o = !1;
        const n = r.readBoolean(),
              d = r.readBoolean();

        if (e) {
          if (d) if (o = r.readBoolean(), n) a = r.readBits(11) + 1;else if ((a = r.readBits(14) + 1) < 2048) throw new Error("Something's fishy...");
        } else {
          o = r.readBoolean(), d && (a = n ? r.readBits(11) + 1 : r.readBits(14) + 1), a += r.readBits(t ? 3 : 5) * (1 / (1 << (t ? 3 : 5)));
        }

        return o && (a = -a), a;
      }

    }

    exports.SendPropParser = o;
  }, {
    "../Data/SendPropDefinition": "B5Tw",
    "../Data/Vector": "yzjq",
    "../Math": "OpLt",
    "./readBitVar": "qcki"
  }],
  "ByDl": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.SendPropEncoder = void 0;

    const r = require("../Data/SendPropDefinition"),
          t = require("../Data/Vector"),
          e = require("../Math"),
          i = require("./readBitVar"),
          o = require("./SendPropParser");

    class a {
      static encode(e, i, o) {
        switch (i.type) {
          case r.SendPropType.DPT_Int:
            if ("number" != typeof e) throw new Error(`Invalid value for DPT_Int ${JSON.stringify(e)}`);
            return a.writeInt(e, i, o);

          case r.SendPropType.DPT_Vector:
            if (!(e instanceof t.Vector)) throw new Error(`Invalid value for DPT_Vector ${JSON.stringify(e)}`);
            return a.writeVector(e, i, o);

          case r.SendPropType.DPT_VectorXY:
            if (!(e instanceof t.Vector)) throw new Error(`Invalid value for DPT_VectorXY ${JSON.stringify(e)}`);
            return a.writeVectorXY(e, i, o);

          case r.SendPropType.DPT_Float:
            if ("number" != typeof e) throw new Error(`Invalid value for DPT_Float ${JSON.stringify(e)}`);
            return a.writeFloat(e, i, o);

          case r.SendPropType.DPT_String:
            if ("string" != typeof e) throw new Error(`Invalid value for DPT_String ${JSON.stringify(e)}`);
            return a.writeString(e, o);

          case r.SendPropType.DPT_Array:
            if (!Array.isArray(e)) throw new Error(`Invalid value for DPT_Array ${JSON.stringify(e)}`);
            return a.writeArray(e, i, o);
        }

        throw new Error("Unknown property type");
      }

      static writeInt(t, e, o) {
        return e.hasFlag(r.SendPropFlag.SPROP_VARINT) ? i.writeVarInt(t, o, !e.hasFlag(r.SendPropFlag.SPROP_UNSIGNED)) : e.hasFlag(r.SendPropFlag.SPROP_UNSIGNED) ? o.writeBits(t, e.bitCount) : o.writeBits(i.makeUnsigned(t), e.bitCount);
      }

      static writeArray(r, t, i) {
        const o = e.logBase2(t.numElements) + 1;
        if (i.writeBits(r.length, o), !t.arrayProperty) throw new Error("Array of undefined type");

        for (const e of r) a.encode(e, t.arrayProperty, i);
      }

      static writeString(r, t) {
        t.writeBits(r.length, 9), r && t.writeASCIIString(r, r.length);
      }

      static writeVector(r, t, e) {
        a.writeFloat(r.x, t, e), a.writeFloat(r.y, t, e), a.writeFloat(r.z, t, e);
      }

      static writeVectorXY(r, t, e) {
        a.writeFloat(r.x, t, e), a.writeFloat(r.y, t, e);
      }

      static writeFloat(t, e, i) {
        if (e.hasFlag(r.SendPropFlag.SPROP_COORD)) return a.writeBitCoord(t, i);
        if (e.hasFlag(r.SendPropFlag.SPROP_COORD_MP)) return a.writeBitCoordMP(t, i, !1, !1);
        if (e.hasFlag(r.SendPropFlag.SPROP_COORD_MP_LOWPRECISION)) return a.writeBitCoordMP(t, i, !1, !0);
        if (e.hasFlag(r.SendPropFlag.SPROP_COORD_MP_INTEGRAL)) return a.writeBitCoordMP(t, i, !0, !1);
        if (e.hasFlag(r.SendPropFlag.SPROP_NOSCALE)) return i.writeFloat32(t);
        if (e.hasFlag(r.SendPropFlag.SPROP_NORMAL)) return a.writeBitNormal(t, i);
        {
          const r = (t - e.lowValue) / (e.highValue - e.lowValue),
                o = Math.round(r * ((1 << e.bitCount) - 1));
          i.writeBits(o, e.bitCount);
        }
      }

      static writeBitNormal(r, t) {
        t.writeBoolean(r < 0);
        const e = Math.abs(r) % 1,
              i = Math.round(e / o.bitNormalFactor);
        t.writeBits(i, 11);
      }

      static writeBitCoord(r, t) {
        const e = Math.abs(r),
              i = Math.floor(e),
              o = e % 1;
        t.writeBoolean(0 !== i), t.writeBoolean(0 !== o), (i || o) && (t.writeBoolean(r < 0), i && t.writeBits(i - 1, 14), o && t.writeBits(32 * o, 5));
      }

      static writeBitCoordMP(r, t, e, i) {
        const o = Math.abs(r),
              a = Math.floor(o),
              n = o % 1,
              s = a < Math.pow(2, 11);
        if (t.writeBoolean(s), t.writeBoolean(a > 0), e) a && (t.writeBoolean(r < 0), s ? t.writeBits(a - 1, 11) : t.writeBits(a - 1, 14));else {
          t.writeBoolean(r < 0), a && (s ? t.writeBits(a - 1, 11) : t.writeBits(a - 1, 14));
          const e = Math.round(n / (1 / (1 << (i ? 3 : 5))));
          t.writeBits(e, i ? 3 : 5);
        }
      }

    }

    exports.SendPropEncoder = a;
  }, {
    "../Data/SendPropDefinition": "B5Tw",
    "../Data/Vector": "yzjq",
    "../Math": "OpLt",
    "./readBitVar": "qcki",
    "./SendPropParser": "Oirr"
  }],
  "j1p9": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeBSPDecal = exports.ParseBSPDecal = exports.encodeVecCoord = exports.getVecCoord = void 0;

    const e = require("../SendPropEncoder"),
          o = require("../SendPropParser");

    function r(e) {
      const r = e.readBoolean(),
            t = e.readBoolean(),
            n = e.readBoolean();
      return {
        x: r ? o.SendPropParser.readBitCoord(e) : 0,
        y: t ? o.SendPropParser.readBitCoord(e) : 0,
        z: n ? o.SendPropParser.readBitCoord(e) : 0
      };
    }

    function t(o, r) {
      r.writeBoolean(0 !== o.x), r.writeBoolean(0 !== o.y), r.writeBoolean(0 !== o.z), 0 !== o.x && e.SendPropEncoder.writeBitCoord(o.x, r), 0 !== o.y && e.SendPropEncoder.writeBitCoord(o.y, r), 0 !== o.z && e.SendPropEncoder.writeBitCoord(o.z, r);
    }

    function n(e) {
      let o = 0,
          t = 0;
      const n = r(e),
            d = e.readBits(9);
      return e.readBoolean() && (t = e.readBits(11), o = e.readBits(12)), {
        packetType: "bspDecal",
        position: n,
        textureIndex: d,
        entIndex: t,
        modelIndex: o,
        lowPriority: e.readBoolean()
      };
    }

    function d(e, o) {
      t(e.position, o), o.writeBits(e.textureIndex, 9), e.entIndex || e.modelIndex ? (o.writeBoolean(!0), o.writeBits(e.entIndex, 11), o.writeBits(e.modelIndex, 12)) : o.writeBoolean(!1), o.writeBoolean(e.lowPriority);
    }

    exports.getVecCoord = r, exports.encodeVecCoord = t, exports.ParseBSPDecal = n, exports.EncodeBSPDecal = d;
  }, {
    "../SendPropEncoder": "ByDl",
    "../SendPropParser": "Oirr"
  }],
  "pVYJ": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeClassInfo = exports.ParseClassInfo = void 0;

    const e = require("../../Math");

    function s(s) {
      const t = s.readUint16(),
            r = s.readBoolean(),
            a = [];

      if (!r) {
        const r = e.logBase2(t) + 1;

        for (let e = 0; e < t; e++) {
          const e = {
            classId: s.readBits(r),
            className: s.readASCIIString(),
            dataTableName: s.readASCIIString()
          };
          a.push(e);
        }
      }

      return {
        packetType: "classInfo",
        number: t,
        create: r,
        entries: a
      };
    }

    function t(s, t) {
      if (t.writeUint16(s.number), t.writeBoolean(s.create), !s.create) {
        const r = e.logBase2(s.number) + 1;

        for (const e of s.entries) t.writeBits(e.classId, r), t.writeASCIIString(e.className), t.writeASCIIString(e.dataTableName);
      }
    }

    exports.ParseClassInfo = s, exports.EncodeClassInfo = t;
  }, {
    "../../Math": "OpLt"
  }],
  "Cror": [function (require, module, exports) {
    "use strict";

    var r = [0, 255, 65535, 16777215, 4294967295];

    function t(r, t, e, s, n) {
      var i;

      for (i = 0; i < n; i++) e[s + i] = r[t + i];
    }

    function e(r, t, e, s) {
      var n;

      for (n = 0; n < s; n++) r[t + n] = r[t - e + n];
    }

    function s(r) {
      this.array = r, this.pos = 0;
    }

    s.prototype.readUncompressedLength = function () {
      for (var r, t, e = 0, s = 0; s < 32 && this.pos < this.array.length;) {
        if (r = this.array[this.pos], this.pos += 1, (t = 127 & r) << s >>> s !== t) return -1;
        if (e |= t << s, r < 128) return e;
        s += 7;
      }

      return -1;
    }, s.prototype.uncompressToBuffer = function (s) {
      for (var n, i, o, a, f = this.array, u = f.length, p = this.pos, h = 0; p < f.length;) if (n = f[p], p += 1, 0 == (3 & n)) {
        if ((i = 1 + (n >>> 2)) > 60) {
          if (p + 3 >= u) return !1;
          o = i - 60, i = 1 + ((i = f[p] + (f[p + 1] << 8) + (f[p + 2] << 16) + (f[p + 3] << 24)) & r[o]), p += o;
        }

        if (p + i > u) return !1;
        t(f, p, s, h, i), p += i, h += i;
      } else {
        switch (3 & n) {
          case 1:
            i = 4 + (n >>> 2 & 7), a = f[p] + (n >>> 5 << 8), p += 1;
            break;

          case 2:
            if (p + 1 >= u) return !1;
            i = 1 + (n >>> 2), a = f[p] + (f[p + 1] << 8), p += 2;
            break;

          case 3:
            if (p + 3 >= u) return !1;
            i = 1 + (n >>> 2), a = f[p] + (f[p + 1] << 8) + (f[p + 2] << 16) + (f[p + 3] << 24), p += 4;
        }

        if (0 === a || a > h) return !1;
        e(s, h, a, i), h += i;
      }

      return !0;
    }, exports.SnappyDecompressor = s;
  }, {}],
  "m9Mg": [function (require, module, exports) {
    "use strict";

    var r = 16,
        n = 1 << r,
        t = 14,
        o = new Array(t + 1);

    function e(r, n) {
      return 506832829 * r >>> n;
    }

    function f(r, n) {
      return r[n] + (r[n + 1] << 8) + (r[n + 2] << 16) + (r[n + 3] << 24);
    }

    function i(r, n, t) {
      return r[n] === r[t] && r[n + 1] === r[t + 1] && r[n + 2] === r[t + 2] && r[n + 3] === r[t + 3];
    }

    function a(r, n, t, o, e) {
      var f;

      for (f = 0; f < e; f++) t[o + f] = r[n + f];
    }

    function u(r, n, t, o, e) {
      return t <= 60 ? (o[e] = t - 1 << 2, e += 1) : t < 256 ? (o[e] = 240, o[e + 1] = t - 1, e += 2) : (o[e] = 244, o[e + 1] = t - 1 & 255, o[e + 2] = t - 1 >>> 8, e += 3), a(r, n, o, e, t), e + t;
    }

    function c(r, n, t, o) {
      return o < 12 && t < 2048 ? (r[n] = 1 + (o - 4 << 2) + (t >>> 8 << 5), r[n + 1] = 255 & t, n + 2) : (r[n] = 2 + (o - 1 << 2), r[n + 1] = 255 & t, r[n + 2] = t >>> 8, n + 3);
    }

    function h(r, n, t, o) {
      for (; o >= 68;) n = c(r, n, t, 64), o -= 64;

      return o > 64 && (n = c(r, n, t, 60), o -= 60), c(r, n, t, o);
    }

    function s(r, n, a, c, s) {
      for (var p = 1; 1 << p <= a && p <= t;) p += 1;

      var v = 32 - (p -= 1);
      void 0 === o[p] && (o[p] = new Uint16Array(1 << p));
      var y,
          l = o[p];

      for (y = 0; y < l.length; y++) l[y] = 0;

      var d,
          m,
          w,
          b,
          g,
          k,
          x,
          A,
          C,
          M,
          B = n + a,
          L = n,
          S = n,
          T = !0;
      if (a >= 15) for (d = B - 15, w = e(f(r, n += 1), v); T;) {
        k = 32, b = n;

        do {
          if (m = w, x = k >>> 5, k += 1, b = (n = b) + x, n > d) {
            T = !1;
            break;
          }

          w = e(f(r, b), v), g = L + l[m], l[m] = n - L;
        } while (!i(r, n, g));

        if (!T) break;
        s = u(r, S, n - S, c, s);

        do {
          for (A = n, C = 4; n + C < B && r[n + C] === r[g + C];) C += 1;

          if (n += C, s = h(c, s, A - g, C), S = n, n >= d) {
            T = !1;
            break;
          }

          l[e(f(r, n - 1), v)] = n - 1 - L, g = L + l[M = e(f(r, n), v)], l[M] = n - L;
        } while (i(r, n, g));

        if (!T) break;
        w = e(f(r, n += 1), v);
      }
      return S < B && (s = u(r, S, B - S, c, s)), s;
    }

    function p(r, n, t) {
      do {
        n[t] = 127 & r, (r >>>= 7) > 0 && (n[t] += 128), t += 1;
      } while (r > 0);

      return t;
    }

    function v(r) {
      this.array = r;
    }

    v.prototype.maxCompressedLength = function () {
      var r = this.array.length;
      return 32 + r + Math.floor(r / 6);
    }, v.prototype.compressToBuffer = function (r) {
      var t,
          o = this.array,
          e = o.length,
          f = 0,
          i = 0;

      for (i = p(e, r, i); f < e;) i = s(o, f, t = Math.min(e - f, n), r, i), f += t;

      return i;
    }, exports.SnappyCompressor = v;
  }, {}],
  "rH1J": [function (require, module, exports) {
    var t,
        e,
        n = module.exports = {};

    function r() {
      throw new Error("setTimeout has not been defined");
    }

    function o() {
      throw new Error("clearTimeout has not been defined");
    }

    function i(e) {
      if (t === setTimeout) return setTimeout(e, 0);
      if ((t === r || !t) && setTimeout) return t = setTimeout, setTimeout(e, 0);

      try {
        return t(e, 0);
      } catch (n) {
        try {
          return t.call(null, e, 0);
        } catch (n) {
          return t.call(this, e, 0);
        }
      }
    }

    function u(t) {
      if (e === clearTimeout) return clearTimeout(t);
      if ((e === o || !e) && clearTimeout) return e = clearTimeout, clearTimeout(t);

      try {
        return e(t);
      } catch (n) {
        try {
          return e.call(null, t);
        } catch (n) {
          return e.call(this, t);
        }
      }
    }

    !function () {
      try {
        t = "function" == typeof setTimeout ? setTimeout : r;
      } catch (n) {
        t = r;
      }

      try {
        e = "function" == typeof clearTimeout ? clearTimeout : o;
      } catch (n) {
        e = o;
      }
    }();
    var c,
        s = [],
        l = !1,
        a = -1;

    function f() {
      l && c && (l = !1, c.length ? s = c.concat(s) : a = -1, s.length && h());
    }

    function h() {
      if (!l) {
        var t = i(f);
        l = !0;

        for (var e = s.length; e;) {
          for (c = s, s = []; ++a < e;) c && c[a].run();

          a = -1, e = s.length;
        }

        c = null, l = !1, u(t);
      }
    }

    function m(t, e) {
      this.fun = t, this.array = e;
    }

    function p() {}

    n.nextTick = function (t) {
      var e = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
      s.push(new m(t, e)), 1 !== s.length || l || i(h);
    }, m.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, n.title = "browser", n.env = {}, n.argv = [], n.version = "", n.versions = {}, n.on = p, n.addListener = p, n.once = p, n.off = p, n.removeListener = p, n.removeAllListeners = p, n.emit = p, n.prependListener = p, n.prependOnceListener = p, n.listeners = function (t) {
      return [];
    }, n.binding = function (t) {
      throw new Error("process.binding is not supported");
    }, n.cwd = function () {
      return "/";
    }, n.chdir = function (t) {
      throw new Error("process.chdir is not supported");
    }, n.umask = function () {
      return 0;
    };
  }, {}],
  "RdAC": [function (require, module, exports) {
    var process = require("process");

    var Buffer = require("buffer").Buffer;

    var r = require("process"),
        e = require("buffer").Buffer;

    function n() {
      return "object" == typeof r && "object" == typeof r.versions && void 0 !== r.versions.node;
    }

    function o(r) {
      return r instanceof Uint8Array && (!n() || !e.isBuffer(r));
    }

    function s(r) {
      return r instanceof ArrayBuffer;
    }

    function f(r) {
      return !!n() && e.isBuffer(r);
    }

    var t = require("./snappy_decompressor").SnappyDecompressor,
        i = require("./snappy_compressor").SnappyCompressor,
        a = "Argument compressed must be type of ArrayBuffer, Buffer, or Uint8Array";

    function p(r) {
      if (!o(r) && !s(r) && !f(r)) throw new TypeError(a);
      var n = !1,
          i = !1;
      o(r) ? n = !0 : s(r) && (i = !0, r = new Uint8Array(r));
      var p,
          u,
          c = new t(r),
          y = c.readUncompressedLength();
      if (-1 === y) throw new Error("Invalid Snappy bitstream");

      if (n) {
        if (p = new Uint8Array(y), !c.uncompressToBuffer(p)) throw new Error("Invalid Snappy bitstream");
      } else if (i) {
        if (p = new ArrayBuffer(y), u = new Uint8Array(p), !c.uncompressToBuffer(u)) throw new Error("Invalid Snappy bitstream");
      } else if (p = e.alloc(y), !c.uncompressToBuffer(p)) throw new Error("Invalid Snappy bitstream");

      return p;
    }

    function u(r) {
      if (!o(r) && !s(r) && !f(r)) throw new TypeError(a);
      var n = !1,
          t = !1;
      o(r) ? n = !0 : s(r) && (t = !0, r = new Uint8Array(r));
      var p,
          u,
          c,
          y = new i(r),
          m = y.maxCompressedLength();
      return n ? (p = new Uint8Array(m), c = y.compressToBuffer(p)) : t ? (p = new ArrayBuffer(m), u = new Uint8Array(p), c = y.compressToBuffer(u)) : (p = e.alloc(m), c = y.compressToBuffer(p)), p.slice(0, c);
    }

    exports.uncompress = p, exports.compress = u;
  }, {
    "./snappy_decompressor": "Cror",
    "./snappy_compressor": "m9Mg",
    "process": "rH1J",
    "buffer": "fe91"
  }],
  "eIyi": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.encodeStringTableEntries = exports.guessStringTableEntryLength = exports.parseStringTableEntries = void 0;

    const t = require("../Math");

    function e(e, r, i, a = []) {
      const n = t.logBase2(r.maxEntries),
            s = [];
      let o = -1;
      const l = [];

      for (let t = 0; t < i; t++) {
        const t = e.readBoolean() ? o + 1 : e.readBits(n);
        if (o = t, t < 0 || t > r.maxEntries) throw new Error("Invalid string index for string table");
        let i, x;

        if (e.readBoolean()) {
          if (e.readBoolean()) {
            const t = e.readBits(5),
                  r = e.readBits(5),
                  a = e.readASCIIString();
            i = l[t].text ? l[t].text.substr(0, r) + a : a;
          } else i = e.readASCIIString();
        }

        if (e.readBoolean()) if (r.fixedUserDataSize && r.fixedUserDataSizeBits) x = e.readBitStream(r.fixedUserDataSizeBits);else {
          const t = e.readBits(14);
          x = e.readBitStream(8 * t);
        }

        if (a[t]) {
          const e = Object.assign({}, a[t]);
          x && (e.extraData = x), void 0 !== i && (e.text = i), s[t] = e, l.push(e);
        } else s[t] = {
          text: i,
          extraData: x
        }, l.push(s[t]);

        l.length > 32 && l.shift();
      }

      return s;
    }

    function r(e, r) {
      const i = Math.ceil(t.logBase2(e.maxEntries) / 8);
      return r.reduce((t, e) => t + i + 1 + 1 + 1 + (e.text ? e.text.length + 1 : 1) + (e.extraData ? Math.ceil(e.extraData.length / 8) : 0), 1);
    }

    function i(e, r, i, n = []) {
      const s = t.logBase2(r.maxEntries);
      let o = -1;
      const l = [];

      for (let t = 0; t < i.length; t++) if (i[t]) {
        const x = i[t];
        if (t !== o + 1 ? (e.writeBoolean(!1), e.writeBits(t, s)) : e.writeBoolean(!0), o = t, void 0 === x.text || n[t] && x.text === n[t].text) e.writeBoolean(!1);else {
          e.writeBoolean(!0);
          const {
            index: t,
            count: r
          } = a(l, x.text);
          -1 !== t ? (e.writeBoolean(!0), e.writeBits(t, 5), e.writeBits(r, 5), e.writeASCIIString(x.text.substr(r))) : (e.writeBoolean(!1), e.writeASCIIString(x.text));
        }

        if (x.extraData) {
          if (e.writeBoolean(!0), x.extraData.index = 0, r.fixedUserDataSize && r.fixedUserDataSizeBits) e.writeBitStream(x.extraData, r.fixedUserDataSizeBits);else {
            const t = Math.ceil(x.extraData.length / 8);
            e.writeBits(t, 14), e.writeBitStream(x.extraData, 8 * t);
          }
          x.extraData.index = 0;
        } else e.writeBoolean(!1);

        l.push(x), l.length > 32 && l.shift();
      }
    }

    function a(t, e) {
      let r = -1,
          i = 0;

      for (let a = 0; a < t.length; a++) {
        const n = s(t[a].text, e);
        n >= 3 && n > i && (i = n, r = a);
      }

      return {
        index: r,
        count: i
      };
    }

    exports.parseStringTableEntries = e, exports.guessStringTableEntryLength = r, exports.encodeStringTableEntries = i;
    const n = 32;

    function s(t, e) {
      const r = Math.min(t.length, e.length, n);

      for (let i = 0; i < r; i++) if (t[i] !== e[i]) return i;

      return Math.min(r, n - 1);
    }
  }, {
    "../Math": "OpLt"
  }],
  "MCtB": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeCreateStringTable = exports.ParseCreateStringTable = void 0;

    const e = require("bit-buffer"),
          t = require("../../Math"),
          r = require("../readBitVar"),
          a = require("snappyjs"),
          i = require("../StringTableParser");

    function n(n) {
      const s = n.readASCIIString(),
            o = n.readUint16(),
            l = t.logBase2(o),
            d = n.readBits(l + 1),
            b = r.readVarInt(n);
      let f = 0,
          c = 0;
      n.readBoolean() && (f = n.readBits(12), c = n.readBits(4));
      const S = n.readBoolean();
      let B = n.readBitStream(b);

      if (S) {
        const t = B.readUint32(),
              r = B.readUint32(),
              i = B.readASCIIString(4),
              n = B.readArrayBuffer(r - 4);
        if ("SNAP" !== i) throw new Error("Unknown compressed stringtable format");
        const s = a.uncompress(n);
        if (s.byteLength !== t) throw new Error("Incorrect length of decompressed stringtable");
        B = new e.BitStream(s.buffer);
      }

      const g = {
        name: s,
        entries: [],
        maxEntries: o,
        fixedUserDataSize: f,
        fixedUserDataSizeBits: c,
        compressed: S
      };
      return g.entries = i.parseStringTableEntries(B, g, d), {
        packetType: "createStringTable",
        table: g
      };
    }

    function s(n, s) {
      s.writeASCIIString(n.table.name), s.writeUint16(n.table.maxEntries);
      const o = t.logBase2(n.table.maxEntries),
            l = n.table.entries.filter(e => e).length;
      s.writeBits(l, o + 1);
      let d = new e.BitStream(new ArrayBuffer(i.guessStringTableEntryLength(n.table, n.table.entries)));

      if (i.encodeStringTableEntries(d, n.table, n.table.entries), n.table.compressed) {
        const t = Math.ceil(d.length / 8);
        d.index = 0;
        const r = a.compress(d.readArrayBuffer(t));
        (d = new e.BitStream(new ArrayBuffer(t))).writeUint32(t), d.writeUint32(r.byteLength + 4), d.writeASCIIString("SNAP", 4);
        const i = r.buffer;
        d.writeArrayBuffer(i);
      }

      const b = d.index;
      d.index = 0, r.writeVarInt(b, s), n.table.fixedUserDataSize || n.table.fixedUserDataSizeBits ? (s.writeBoolean(!0), s.writeBits(n.table.fixedUserDataSize || 0, 12), s.writeBits(n.table.fixedUserDataSizeBits || 0, 4)) : s.writeBoolean(!1), s.writeBoolean(n.table.compressed), b && s.writeBitStream(d, b);
    }

    exports.ParseCreateStringTable = n, exports.EncodeCreateStringTable = s;
  }, {
    "bit-buffer": "iwlb",
    "../../Math": "OpLt",
    "../readBitVar": "qcki",
    "snappyjs": "RdAC",
    "../StringTableParser": "eIyi"
  }],
  "fYJ7": [function (require, module, exports) {
    "use strict";

    var e;
    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.GameEventValueType = void 0, function (e) {
      e[e.STRING = 1] = "STRING", e[e.FLOAT = 2] = "FLOAT", e[e.LONG = 3] = "LONG", e[e.SHORT = 4] = "SHORT", e[e.BYTE = 5] = "BYTE", e[e.BOOLEAN = 6] = "BOOLEAN", e[e.LOCAL = 7] = "LOCAL";
    }(e = exports.GameEventValueType || (exports.GameEventValueType = {}));
  }, {}],
  "QEvd": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeGameEvent = exports.ParseGameEvent = void 0;

    const e = require("../../Data/GameEvent");

    function t(e, t) {
      const n = {};

      for (const a of e.entries) {
        const e = r(t, a);
        null !== e && (n[a.name] = e);
      }

      return {
        name: e.name,
        values: n
      };
    }

    function n(e, t, n) {
      for (const r of t.entries) {
        const t = e.values[r.name];
        if (void 0 === t) throw new Error("empty event value");
        a(t, n, r);
      }
    }

    function r(t, n) {
      switch (n.type) {
        case e.GameEventValueType.STRING:
          return t.readUTF8String();

        case e.GameEventValueType.FLOAT:
          return t.readFloat32();

        case e.GameEventValueType.LONG:
          return t.readUint32();

        case e.GameEventValueType.SHORT:
          return t.readUint16();

        case e.GameEventValueType.BYTE:
          return t.readUint8();

        case e.GameEventValueType.BOOLEAN:
          return t.readBoolean();

        case e.GameEventValueType.LOCAL:
          return null;
      }
    }

    function a(t, n, r) {
      switch (r.type) {
        case e.GameEventValueType.STRING:
          if ("string" != typeof t) throw new Error(`Invalid value for game event, expected string got ${typeof t}`);
          return n.writeASCIIString(t);

        case e.GameEventValueType.FLOAT:
          if ("number" != typeof t) throw new Error(`Invalid value for game event, expected number got ${typeof t}`);
          return n.writeFloat32(t);

        case e.GameEventValueType.LONG:
          if ("number" != typeof t) throw new Error(`Invalid value for game event, expected number got ${typeof t}`);
          return n.writeUint32(t);

        case e.GameEventValueType.SHORT:
          if ("number" != typeof t) throw new Error(`Invalid value for game event, expected number got ${typeof t}`);
          return n.writeUint16(t);

        case e.GameEventValueType.BYTE:
          if ("number" != typeof t) throw new Error(`Invalid value for game event, expected number got ${typeof t}`);
          return n.writeUint8(t);

        case e.GameEventValueType.BOOLEAN:
          if ("boolean" != typeof t) throw new Error(`Invalid value for game event, expected boolean got ${typeof t}`);
          return n.writeBoolean(t);
      }
    }

    function o(e, n) {
      const r = e.readBits(11),
            a = e.readBitStream(r),
            o = a.readBits(9),
            i = n.eventDefinitions.get(o);
      if (!i) throw new Error(`Unknown game event type ${o}`);
      return {
        packetType: "gameEvent",
        event: t(i, a)
      };
    }

    function i(e, t, r) {
      const a = t.index;
      t.index += 11;
      const o = r.eventDefinitionTypes.get(e.event.name);
      if (void 0 === o) throw new Error(`Unknown game event type ${e.event.name}`);
      const i = t.index;
      t.writeBits(o, 9);
      const u = r.eventDefinitions.get(o);
      if (void 0 === u) throw new Error(`Unknown game event type ${e.event.name}`);
      n(e.event, u, t);
      const v = t.index;
      t.index = a, t.writeBits(v - i, 11), t.index = v;
    }

    exports.ParseGameEvent = o, exports.EncodeGameEvent = i;
  }, {
    "../../Data/GameEvent": "fYJ7"
  }],
  "JJ5b": [function (require, module, exports) {
    "use strict";

    function e(e) {
      const t = e.readBits(9),
            i = e.readBits(20),
            n = e.readBitStream(i),
            r = new Map();

      for (let s = 0; s < t; s++) {
        const e = n.readBits(9),
              t = n.readASCIIString();
        let i = n.readBits(3);
        const s = [];

        for (; 0 !== i;) s.push({
          type: i,
          name: n.readASCIIString()
        }), i = n.readBits(3);

        r.set(e, {
          id: e,
          name: t,
          entries: s
        });
      }

      return {
        packetType: "gameEventList",
        eventList: r
      };
    }

    function t(e, t) {
      const i = Array.from(e.eventList.values());
      t.writeBits(i.length, 9);
      const n = t.index;
      t.index += 20;
      const r = t.index;

      for (const o of i) {
        t.writeBits(o.id, 9), t.writeASCIIString(o.name);

        for (const e of o.entries) t.writeBits(e.type, 3), t.writeASCIIString(e.name);

        t.writeBits(0, 3);
      }

      const s = t.index;
      t.index = n, t.writeBits(s - r, 20), t.index = s;
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeGameEventList = exports.ParseGameEventList = void 0, exports.ParseGameEventList = e, exports.EncodeGameEventList = t;
  }, {}],
  "g9BL": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.encodeEntityUpdate = exports.getEntityUpdate = void 0;

    const e = require("../Data/SendProp"),
          n = require("./readBitVar"),
          t = require("./SendPropEncoder"),
          r = require("./SendPropParser");

    function o(n, t) {
      let o = -1;
      const i = n.flattenedProps,
            l = new Map();
      let d = -1;

      for (; t.readBoolean();) {
        if (d = o, (o = a(t, o)) >= 4096 || o > i.length) throw new Error(`prop index out of bounds while applying update for ${n.name}\n\t\t\tgot ${o} property only has ${i.length} properties (lastProp: ${d})`);
        const f = i[o],
              u = new e.SendProp(f);
        u.value = r.SendPropParser.decode(f, t), l.set(f.fullName, u);
      }

      return Array.from(l.values());
    }

    function i(e, n, r) {
      const o = n.flattenedProps;
      e.sort((e, n) => {
        return o.findIndex(n => n.fullName === e.definition.fullName) - o.findIndex(e => e.fullName === n.definition.fullName);
      });
      let i = -1;

      for (const a of e) {
        r.writeBoolean(!0);
        const e = o.findIndex(e => e.fullName === a.definition.fullName);
        if (-1 === e) throw new Error(`Unknown definition for property ${a.definition.fullName} in ${n.name}`);
        if (e < i) throw new Error("Property index not incremental while encoding " + `${a.definition.fullName} after ${o[i].fullName} ` + `in ${n.name} (current: ${e}, last: ${i})`);
        l(e, r, i), i = e, null !== a.value && t.SendPropEncoder.encode(a.value, a.definition, r);
      }

      r.writeBoolean(!1);
    }

    function a(e, t) {
      return t + n.readBitVar(e) + 1;
    }

    function l(e, t, r) {
      const o = e - r - 1;
      n.writeBitVar(o, t);
    }

    exports.getEntityUpdate = o, exports.encodeEntityUpdate = i;
  }, {
    "../Data/SendProp": "h5UE",
    "./readBitVar": "qcki",
    "./SendPropEncoder": "ByDl",
    "./SendPropParser": "Oirr"
  }],
  "l9AK": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodePacketEntities = exports.ParsePacketEntities = void 0;

    const e = require("../../Data/PacketEntity"),
          t = require("../../Data/ParserState"),
          s = require("../EntityDecoder"),
          n = require("../readBitVar"),
          i = new Map([[0, e.PVS.PRESERVE], [2, e.PVS.ENTER], [1, e.PVS.LEAVE], [3, e.PVS.LEAVE + e.PVS.DELETE]]),
          a = new Map([[e.PVS.PRESERVE, 0], [e.PVS.ENTER, 2], [e.PVS.LEAVE, 1], [e.PVS.LEAVE + e.PVS.DELETE, 3]]);

    function r(e) {
      const t = e.readBits(2);
      return i.get(t);
    }

    function o(e, t) {
      const s = a.get(e);
      if (void 0 === s) throw new Error(`Unknown pvs ${e}`);
      t.writeBits(s, 2);
    }

    function d(n, i, a, r) {
      const o = t.getClassBits(a),
            d = a.serverClasses[n.readBits(o)],
            c = n.readBits(10),
            l = t.getSendTable(a, d.dataTable),
            E = a.instanceBaselines[r].get(i),
            p = new e.PacketEntity(d, i, e.PVS.ENTER);
      if (p.serialNumber = c, E) return p.props = E.map(e => e.clone()), p;
      {
        const e = a.staticBaseLines.get(d.id);

        if (e) {
          let t = a.staticBaselineCache.get(d.id);
          t || (e.index = 0, t = s.getEntityUpdate(l, e), a.staticBaselineCache.set(d.id, t)), p.props = t.map(e => e.clone());
        }

        return p;
      }
    }

    function c(e, n, i, a) {
      const r = i.serverClasses.findIndex(t => t && e.serverClass.id === t.id);
      if (-1 === r) throw new Error(`Unknown server class ${e.serverClass.name}(${e.serverClass.id})`);
      const o = i.serverClasses[r];
      n.writeBits(r, t.getClassBits(i)), n.writeBits(e.serialNumber || 0, 10);
      const d = t.getSendTable(i, o.dataTable);
      let c = i.instanceBaselines[a].get(e.entityIndex);

      if (!c) {
        const e = i.staticBaseLines.get(o.id);
        e && ((c = i.staticBaselineCache.get(o.id)) || (e.index = 0, c = s.getEntityUpdate(d, e), i.staticBaselineCache.set(o.id, c)));
      }

      const l = c ? e.diffFromBaseLine(c) : e.props;
      s.encodeEntityUpdate(l, d, n);
    }

    function l(t, s, n) {
      const i = s.entityClasses.get(t);
      if (!i) throw new Error(`"unknown entity ${t} for ${e.PVS[n]}(${n})`);
      return new e.PacketEntity(i, t, n);
    }

    function E(i, a, o = !1) {
      const c = i.readBits(11),
            E = i.readBoolean(),
            p = E ? i.readInt32() : 0,
            B = i.readBits(1),
            P = i.readBits(11),
            f = i.readBits(20),
            w = i.readBoolean(),
            u = (i.index, i.index + f);
      let V = -1;
      const S = [],
            x = [];

      if (!o) {
        w && (a.instanceBaselines[1 - B] = new Map(a.instanceBaselines[B]));

        for (let o = 0; o < P; o++) {
          V += 1 + n.readUBitVar(i);
          const o = r(i);

          if (o === e.PVS.ENTER) {
            const e = d(i, V, a, B),
                  n = t.getSendTable(a, e.serverClass.dataTable),
                  r = s.getEntityUpdate(n, i);
            e.applyPropUpdate(r), w && a.instanceBaselines[1 - B].set(V, e.clone().props), e.inPVS = !0, S.push(e);
          } else if (o === e.PVS.PRESERVE) {
            const e = l(V, a, o),
                  t = a.sendTables.get(e.serverClass.dataTable);
            if (!t) throw new Error(`Unknown sendTable ${e.serverClass.dataTable}`);
            const n = s.getEntityUpdate(t, i);
            e.applyPropUpdate(n), S.push(e);
          } else if (a.entityClasses.has(V)) {
            const e = l(V, a, o);
            S.push(e);
          }
        }

        if (E) for (; i.readBoolean();) x.push(i.readBits(11));
      }

      return i.index = u, {
        packetType: "packetEntities",
        entities: S,
        removedEntities: x,
        maxEntries: c,
        delta: p,
        baseLine: B,
        updatedBaseLine: w
      };
    }

    function p(i, a, r) {
      a.writeBits(i.maxEntries, 11);
      const d = i.delta > 0;
      a.writeBoolean(d), d && a.writeInt32(i.delta), a.writeBits(i.baseLine, 1), a.writeBits(i.entities.length, 11);
      const l = a.index;
      a.index += 20, a.writeBoolean(i.updatedBaseLine);
      const E = a.index;
      let p = -1;
      i.updatedBaseLine && (r.instanceBaselines[1 - i.baseLine] = new Map(r.instanceBaselines[i.baseLine]));

      for (const P of i.entities) {
        const d = P.entityIndex - p;
        if (p = P.entityIndex, n.writeBitVar(d - 1, a), o(P.pvs, a), P.pvs === e.PVS.ENTER) i.updatedBaseLine && r.instanceBaselines[1 - i.baseLine].set(P.entityIndex, P.clone().props), c(P, a, r, i.baseLine);else if (P.pvs === e.PVS.PRESERVE) {
          const e = t.getSendTable(r, P.serverClass.dataTable);
          s.encodeEntityUpdate(P.props, e, a);
        }
      }

      if (d) {
        for (const e of i.removedEntities) a.writeBoolean(!0), a.writeBits(e, 11);

        a.writeBoolean(!1);
      }

      const B = a.index;
      a.index = l, a.writeBits(B - E, 20), a.index = B;
    }

    exports.ParsePacketEntities = E, exports.EncodePacketEntities = p;
  }, {
    "../../Data/PacketEntity": "zVSi",
    "../../Data/ParserState": "WRKG",
    "../EntityDecoder": "g9BL",
    "../readBitVar": "qcki"
  }],
  "RgkT": [function (require, module, exports) {
    "use strict";

    function t(t, n, s = "packetType", i = {}) {
      const u = n.split("}").map(t => t.split("{")).filter(t => t[0]);
      return {
        parser: e => {
          const o = Object.assign({}, i);
          o[s] = t;

          try {
            for (const t of u) {
              const n = r(e, t[1], o);
              "_" !== t[0] && (o[t[0]] = n);
            }
          } catch (a) {
            throw new Error("Failed reading pattern " + n + ". " + a);
          }

          return o;
        },
        encoder: (t, r) => {
          for (const n of u) e(r, n[1], t, t[n[0]]);
        },
        name: t
      };
    }

    function r(t, r, e) {
      if ("b" === r[0]) return t.readBoolean();

      if ("s" === r[0]) {
        if (1 === r.length) return t.readUTF8String();
        {
          const e = parseInt(r.substr(1), 10);
          return t.readASCIIString(e);
        }
      }

      if ("f32" === r) return t.readFloat32();

      if ("u" === r[0]) {
        const e = parseInt(r.substr(1), 10);
        return t.readBits(e);
      }

      if ("$" === r[0] && "*8" === r.substr(r.length - 2)) {
        const n = r.substr(1, r.length - 3);
        return t.readBitStream(8 * e[n]);
      }

      if ("$" === r[0]) {
        const n = r.substr(1);
        return t.readBitStream(e[n]);
      }

      return t.readBits(parseInt(r, 10), !0);
    }

    function e(t, r, e, n) {
      if ("b" === r[0]) return t.writeBoolean(n);

      if ("s" === r[0]) {
        if (1 === r.length) return t.writeUTF8String(n);
        {
          const e = parseInt(r.substr(1), 10);
          return t.writeUTF8String(n, e);
        }
      }

      if ("f32" === r) return t.writeFloat32(n);

      if ("u" === r[0]) {
        const e = parseInt(r.substr(1), 10);
        return t.writeBits(n, e);
      }

      if ("$" === r[0] && "*8" === r.substr(r.length - 2)) {
        const s = r.substr(1, r.length - 3);
        return t.writeBitStream(n, 8 * e[s]);
      }

      if ("$" === r[0]) {
        const s = r.substr(1);
        return t.writeBitStream(n, e[s]);
      }

      return t.writeBits(n, parseInt(r, 10));
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.make = void 0, exports.make = t;
  }, {}],
  "EDYg": [function (require, module, exports) {
    "use strict";

    function e(e) {
      const t = e.readBoolean(),
            r = t ? 1 : e.readUint8(),
            n = t ? e.readUint8() : e.readUint16();
      return {
        packetType: "parseSounds",
        reliable: t,
        num: r,
        length: n,
        data: e.readBitStream(n)
      };
    }

    function t(e, t) {
      t.writeBoolean(e.reliable), e.reliable ? t.writeUint8(e.length) : (t.writeUint8(e.num), t.writeUint16(e.length)), e.data.index = 0, t.writeBitStream(e.data, e.length), e.data.index = 0;
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeParseSounds = exports.ParseParseSounds = void 0, exports.ParseParseSounds = e, exports.EncodeParseSounds = t;
  }, {}],
  "IqTV": [function (require, module, exports) {
    "use strict";

    function e(e) {
      const r = e.readUint8(),
            t = new Map();

      for (let n = 0; n < r; n++) {
        const r = e.readUTF8String(),
              n = e.readUTF8String();
        t.set(r, n);
      }

      return {
        packetType: "setConVar",
        vars: t
      };
    }

    function r(e, r) {
      r.writeUint8(e.vars.size);

      for (const [t, n] of e.vars.entries()) r.writeUTF8String(t), r.writeUTF8String(n);
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeSetConVar = exports.ParseSetConVar = void 0, exports.ParseSetConVar = e, exports.EncodeSetConVar = r;
  }, {}],
  "GcNy": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.DynamicBitView = void 0;

    const e = require("bit-buffer");

    class t extends e.BitView {
      setBits(e, t, i) {
        return i > 8 * this.byteLength - e && this.grow(), super.setBits(e, t, i);
      }

      grow() {
        const e = new Uint8Array(2 * this.byteLength);
        e.set(this._view), this._view = e;
      }

    }

    exports.DynamicBitView = t;
  }, {
    "bit-buffer": "iwlb"
  }],
  "RbPo": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.DynamicBitStream = void 0;

    const e = require("bit-buffer"),
          t = require("./DynamicBitView");

    class r extends e.BitStream {
      constructor(e = 16384) {
        super(new t.DynamicBitView(new ArrayBuffer(e)));
      }

      get length() {
        return 8 * this.view.byteLength;
      }

    }

    exports.DynamicBitStream = r;
  }, {
    "bit-buffer": "iwlb",
    "./DynamicBitView": "GcNy"
  }],
  "mb8e": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeTempEntities = exports.ParseTempEntities = void 0;

    const e = require("../../Data/PacketEntity"),
          t = require("../../Data/ParserState"),
          r = require("../../DynamicBitStream"),
          n = require("../EntityDecoder"),
          i = require("../readBitVar");

    function s(r, s, a = !1) {
      const o = r.readUint8(),
            d = i.readVarInt(r),
            l = r.readBitStream(d);
      let p = null;
      const c = [];

      if (!a) {
        for (let r = 0; r < o; r++) {
          const r = l.readBoolean() ? l.readUint8() / 100 : 0;

          if (l.readBoolean()) {
            const i = l.readBits(t.getClassBits(s)),
                  a = s.serverClasses[i - 1];
            if (!a) throw new Error(`Unknown serverClass ${i}`);
            const o = t.getSendTable(s, a.dataTable);
            (p = new e.PacketEntity(a, 0, e.PVS.ENTER)).delay = r, p.props = n.getEntityUpdate(o, l), c.push(p);
          } else {
            if (!p) throw new Error("no entity set to update");
            {
              const e = t.getSendTable(s, p.serverClass.dataTable),
                    r = n.getEntityUpdate(e, l);
              (p = p.clone()).applyPropUpdate(r), c.push(p);
            }
          }
        }

        if (l.bitsLeft > 8) throw new Error(`unexpected content after TempEntities ${l.bitsLeft} bits`);
      }

      return {
        packetType: "tempEntities",
        entities: c
      };
    }

    function a(e, s, a) {
      s.writeUint8(e.entities.length);
      const o = new r.DynamicBitStream();

      for (const r of e.entities) {
        r.delay ? (o.writeBoolean(!0), o.writeUint8(Math.round(100 * r.delay))) : o.writeBoolean(!1), o.writeBoolean(!0);
        const e = a.serverClasses.findIndex(e => e && e.name === r.serverClass.name) + 1;
        o.writeBits(e, t.getClassBits(a));
        const i = t.getSendTable(a, r.serverClass.dataTable);
        n.encodeEntityUpdate(r.props, i, o);
      }

      const d = o.index;
      o.index = 0, i.writeVarInt(d, s), d > 0 && s.writeBitStream(o, d);
    }

    exports.ParseTempEntities = s, exports.EncodeTempEntities = a;
  }, {
    "../../Data/PacketEntity": "zVSi",
    "../../Data/ParserState": "WRKG",
    "../../DynamicBitStream": "RbPo",
    "../EntityDecoder": "g9BL",
    "../readBitVar": "qcki"
  }],
  "vu7p": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeUpdateStringTable = exports.ParseUpdateStringTable = void 0;

    const e = require("../StringTableParser");

    function t(t, r) {
      const n = t.readBits(5),
            i = t.readBoolean() ? t.readUint16() : 1,
            a = t.readBits(20),
            s = t.readBitStream(a);
      if (s.index = 0, !r.stringTables[n]) throw new Error(`Table not found for update: ${n}`);
      const o = r.stringTables[n];
      return {
        packetType: "updateStringTable",
        entries: e.parseStringTableEntries(s, o, i, o.entries),
        tableId: n
      };
    }

    function r(t, r, n) {
      r.writeBits(t.tableId, 5);
      const i = t.entries.filter(e => e).length,
            a = i > 1;
      if (r.writeBoolean(a), a && r.writeUint16(i), !n.stringTables[t.tableId]) throw new Error(`Table not found for update: ${t.tableId}`);
      const s = r.index;
      r.index += 20;
      const o = r.index,
            d = n.stringTables[t.tableId];
      e.encodeStringTableEntries(r, d, t.entries, d.entries);
      const l = r.index;
      r.index = s;
      const b = l - o;
      r.writeBits(b, 20), r.index = l;
    }

    exports.ParseUpdateStringTable = t, exports.EncodeUpdateStringTable = r;
  }, {
    "../StringTableParser": "eIyi"
  }],
  "S9Zo": [function (require, module, exports) {
    "use strict";

    var e, a;
    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.UserMessagePacketTypeMap = exports.HudTextLocation = exports.UserMessageType = void 0, function (e) {
      e[e.Geiger = 0] = "Geiger", e[e.Train = 1] = "Train", e[e.HudText = 2] = "HudText", e[e.SayText = 3] = "SayText", e[e.SayText2 = 4] = "SayText2", e[e.TextMsg = 5] = "TextMsg", e[e.ResetHUD = 6] = "ResetHUD", e[e.GameTitle = 7] = "GameTitle", e[e.ItemPickup = 8] = "ItemPickup", e[e.ShowMenu = 9] = "ShowMenu", e[e.Shake = 10] = "Shake", e[e.Fade = 11] = "Fade", e[e.VGUIMenu = 12] = "VGUIMenu", e[e.Rumble = 13] = "Rumble", e[e.CloseCaption = 14] = "CloseCaption", e[e.SendAudio = 15] = "SendAudio", e[e.VoiceMask = 16] = "VoiceMask", e[e.RequestState = 17] = "RequestState", e[e.Damage = 18] = "Damage", e[e.HintText = 19] = "HintText", e[e.KeyHintText = 20] = "KeyHintText", e[e.HudMsg = 21] = "HudMsg", e[e.AmmoDenied = 22] = "AmmoDenied", e[e.AchievementEvent = 23] = "AchievementEvent", e[e.UpdateRadar = 24] = "UpdateRadar", e[e.VoiceSubtitle = 25] = "VoiceSubtitle", e[e.HudNotify = 26] = "HudNotify", e[e.HudNotifyCustom = 27] = "HudNotifyCustom", e[e.PlayerStatsUpdate = 28] = "PlayerStatsUpdate", e[e.PlayerIgnited = 29] = "PlayerIgnited", e[e.PlayerIgnitedInv = 30] = "PlayerIgnitedInv", e[e.HudArenaNotify = 31] = "HudArenaNotify", e[e.UpdateAchievement = 32] = "UpdateAchievement", e[e.TrainingMsg = 33] = "TrainingMsg", e[e.TrainingObjective = 34] = "TrainingObjective", e[e.DamageDodged = 35] = "DamageDodged", e[e.PlayerJarated = 36] = "PlayerJarated", e[e.PlayerExtinguished = 37] = "PlayerExtinguished", e[e.PlayerJaratedFade = 38] = "PlayerJaratedFade", e[e.PlayerShieldBlocked = 39] = "PlayerShieldBlocked", e[e.BreakModel = 40] = "BreakModel", e[e.CheapBreakModel = 41] = "CheapBreakModel", e[e.BreakModel_Pumpkin = 42] = "BreakModel_Pumpkin", e[e.BreakModelRocketDud = 43] = "BreakModelRocketDud", e[e.CallVoteFailed = 44] = "CallVoteFailed", e[e.VoteStart = 45] = "VoteStart", e[e.VotePass = 46] = "VotePass", e[e.VoteFailed = 47] = "VoteFailed", e[e.VoteSetup = 48] = "VoteSetup", e[e.PlayerBonusPoints = 49] = "PlayerBonusPoints", e[e.SpawnFlyingBird = 50] = "SpawnFlyingBird", e[e.PlayerGodRayEffect = 51] = "PlayerGodRayEffect", e[e.SPHapWeapEvent = 52] = "SPHapWeapEvent", e[e.HapDmg = 53] = "HapDmg", e[e.HapPunch = 54] = "HapPunch", e[e.HapSetDrag = 55] = "HapSetDrag", e[e.HapSet = 56] = "HapSet", e[e.HapMeleeContact = 57] = "HapMeleeContact";
    }(e = exports.UserMessageType || (exports.UserMessageType = {})), function (e) {
      e[e.HUD_PRINTNOTIFY = 1] = "HUD_PRINTNOTIFY", e[e.HUD_PRINTCONSOLE = 2] = "HUD_PRINTCONSOLE", e[e.HUD_PRINTTALK = 3] = "HUD_PRINTTALK", e[e.HUD_PRINTCENTER = 4] = "HUD_PRINTCENTER";
    }(a = exports.HudTextLocation || (exports.HudTextLocation = {})), exports.UserMessagePacketTypeMap = new Map([["sayText2", e.SayText2], ["textMsg", e.TextMsg], ["train", e.Train], ["voiceSubtitle", e.VoiceSubtitle], ["breakModelPumpkin", e.BreakModel_Pumpkin], ["resetHUD", e.ResetHUD], ["shake", e.Shake], ["unknownUserMessage", -1]]);
  }, {}],
  "JB5U": [function (require, module, exports) {
    "use strict";

    function e(e) {
      const t = e.readUint8(),
            r = e.readUint8(),
            i = e.index;
      let n, s, a;

      if (1 === e.readUint8()) {
        if (7 === e.readUint8()) {
          e.readUTF8String(6);
        } else e.index = i + 8;

        if ("*DEAD*" === (s = e.readUTF8String()).substr(0, 6)) {
          const e = s.indexOf(""),
                t = s.indexOf("");
          n = s.substr(e + 1, t - e - 1), s = s.substr(t + 5), a = "TF_Chat_AllDead";
        }
      } else e.index = i, a = e.readUTF8String(), n = e.readUTF8String(), s = e.readUTF8String(), e.readUint16();

      let d = (s = (s = s.replace(/\u0001/g, "")).replace(/\u0003/g, "")).indexOf("");

      for (; -1 !== d;) d = (s = s.slice(0, d) + s.slice(d + 7)).indexOf("");

      return {
        packetType: "userMessage",
        userMessageType: "sayText2",
        client: t,
        raw: r,
        kind: a,
        from: n,
        text: s
      };
    }

    function t(e, t) {
      if (t.writeUint8(e.client), t.writeUint8(e.raw), "TF_Chat_AllDead" === e.kind) {
        const r = `*DEAD* ${e.from}:    ${e.text}`;
        t.writeUTF8String(r);
      } else t.writeUTF8String(e.kind), t.writeUTF8String(e.from), t.writeUTF8String(e.text), t.writeUint16(0);
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeSayText2 = exports.ParseSayText2 = void 0, exports.ParseSayText2 = e, exports.EncodeSayText2 = t;
  }, {}],
  "Wpmj": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeUserMessage = exports.ParseUserMessage = void 0;

    const e = require("../../Data/UserMessage"),
          s = require("../UserMessage/SayText2"),
          a = require("./ParserGenerator");

    function t(s) {
      return {
        parser: a => ({
          packetType: "userMessage",
          userMessageType: s,
          type: e.UserMessagePacketTypeMap.get(s),
          data: a
        }),
        encoder: (e, s) => {
          e.data.index = 0, s.writeBitStream(e.data), e.data.index = 0;
        },
        name: s
      };
    }

    const r = new Map([[e.UserMessageType.SayText2, {
      parser: s.ParseSayText2,
      encoder: s.EncodeSayText2,
      name: "sayText2"
    }], [e.UserMessageType.TextMsg, a.make("textMsg", "destType{8}text{s}substitute1{s}substitute2{s}substitute3{s}substitute4{s}", "userMessageType", {
      packetType: "userMessage"
    })], [e.UserMessageType.ResetHUD, a.make("resetHUD", "data{8}", "userMessageType", {
      packetType: "userMessage"
    })], [e.UserMessageType.Train, a.make("train", "data{8}", "userMessageType", {
      packetType: "userMessage"
    })], [e.UserMessageType.VoiceSubtitle, a.make("voiceSubtitle", "client{8}menu{8}item{8}", "userMessageType", {
      packetType: "userMessage"
    })], [e.UserMessageType.BreakModel_Pumpkin, t("breakModelPumpkin")], [e.UserMessageType.Shake, a.make("shake", "command{8}amplitude{f32}frequency{f32}duration{f32}", "userMessageType", {
      packetType: "userMessage"
    })]]);

    function n(e) {
      const s = e.readUint8(),
            a = e.readBits(11),
            t = e.readBitStream(a),
            n = r.get(s);
      return n ? n.parser(t) : {
        packetType: "userMessage",
        userMessageType: "unknownUserMessage",
        type: s,
        data: t
      };
    }

    function i(s, a) {
      if ("unknownUserMessage" === s.userMessageType) a.writeUint8(s.type), a.writeBits(s.data.length, 11), s.data.index = 0, a.writeBitStream(s.data), s.data.index = 0;else {
        const t = e.UserMessagePacketTypeMap.get(s.userMessageType);
        if (!t) throw new Error(`Unknown userMessage type ${t}`);
        a.writeUint8(t);
        const n = a.index;
        a.index += 11;
        const i = a.index,
              p = r.get(t);
        if (!p) throw new Error(`No encoder for userMessage ${s.userMessageType}(${t})`);
        p.encoder(s, a);
        const u = a.index;
        a.index = n, a.writeBits(u - i, 11), a.index = u;
      }
    }

    exports.ParseUserMessage = n, exports.EncodeUserMessage = i;
  }, {
    "../../Data/UserMessage": "S9Zo",
    "../UserMessage/SayText2": "JB5U",
    "./ParserGenerator": "RgkT"
  }],
  "IvQE": [function (require, module, exports) {
    "use strict";

    function t(t) {
      const e = t.readUint8(),
            i = t.readUint8(),
            a = t.readUint16();
      return {
        packetType: "voiceData",
        client: e,
        proximity: i,
        length: a,
        data: t.readBitStream(a)
      };
    }

    function e(t, e) {
      e.writeUint8(t.client), e.writeUint8(t.proximity), e.writeUint16(t.length), t.data.index = 0, e.writeBitStream(t.data, t.length), t.data.index = 0;
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeVoiceData = exports.ParseVoiceData = void 0, exports.ParseVoiceData = t, exports.EncodeVoiceData = e;
  }, {}],
  "wd0f": [function (require, module, exports) {
    "use strict";

    function t(t) {
      const i = t.readASCIIString(),
            r = t.readUint8();
      return {
        packetType: "voiceInit",
        codec: i,
        quality: r,
        extraData: e(t, i, r)
      };
    }

    function e(t, e, i) {
      return 255 === i ? t.readUint16() : "vaudio_celt" === e ? 11025 : 0;
    }

    function i(t, e) {
      e.writeASCIIString(t.codec), e.writeUint8(t.quality), 255 === t.quality && e.writeUint16(t.extraData);
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.EncodeVoiceInit = exports.ParseVoiceInit = void 0, exports.ParseVoiceInit = t, exports.EncodeVoiceInit = i;
  }, {}],
  "rmgk": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.PacketMessageHandler = void 0;

    const e = require("../Packet/BSPDecal"),
          t = require("../Packet/ClassInfo"),
          a = require("../Packet/CreateStringTable"),
          r = require("../Packet/GameEvent"),
          n = require("../Packet/GameEventList"),
          s = require("../Packet/PacketEntities"),
          c = require("../Packet/ParserGenerator"),
          i = require("../Packet/ParseSounds"),
          o = require("../Packet/SetConVar"),
          d = require("../Packet/TempEntities"),
          p = require("../Packet/UpdateStringTable"),
          l = require("../Packet/UserMessage"),
          k = require("../Packet/VoiceData"),
          P = require("../Packet/VoiceInit"),
          g = require("../../Data/Message"),
          u = require("../../Data/Packet"),
          y = require("../../Data/Vector"),
          I = new Map([[u.PacketTypeId.file, c.make("file", "transferId{32}fileName{s}requested{b}")], [u.PacketTypeId.netTick, c.make("netTick", "tick{32}frameTime{16}stdDev{16}")], [u.PacketTypeId.stringCmd, c.make("stringCmd", "command{s}")], [u.PacketTypeId.setConVar, {
      parser: o.ParseSetConVar,
      encoder: o.EncodeSetConVar
    }], [u.PacketTypeId.sigOnState, c.make("sigOnState", "state{8}count{32}")], [u.PacketTypeId.print, c.make("print", "value{s}")], [u.PacketTypeId.serverInfo, c.make("serverInfo", "version{16}serverCount{32}stv{b}dedicated{b}maxCrc{32}maxClasses{16}mapHash{128}playerCount{8}maxPlayerCount{8}intervalPerTick{f32}platform{s1}game{s}map{s}skybox{s}serverName{s}replay{b}")], [u.PacketTypeId.classInfo, {
      parser: t.ParseClassInfo,
      encoder: t.EncodeClassInfo
    }], [u.PacketTypeId.setPause, c.make("setPause", "paused{b}")], [u.PacketTypeId.createStringTable, {
      parser: a.ParseCreateStringTable,
      encoder: a.EncodeCreateStringTable
    }], [u.PacketTypeId.updateStringTable, {
      parser: p.ParseUpdateStringTable,
      encoder: p.EncodeUpdateStringTable
    }], [u.PacketTypeId.voiceInit, {
      parser: P.ParseVoiceInit,
      encoder: P.EncodeVoiceInit
    }], [u.PacketTypeId.voiceData, {
      parser: k.ParseVoiceData,
      encoder: k.EncodeVoiceData
    }], [u.PacketTypeId.parseSounds, {
      parser: i.ParseParseSounds,
      encoder: i.EncodeParseSounds
    }], [u.PacketTypeId.setView, c.make("setView", "index{11}")], [u.PacketTypeId.fixAngle, c.make("fixAngle", "relative{b}x{16}y{16}z{16}")], [u.PacketTypeId.bspDecal, {
      parser: e.ParseBSPDecal,
      encoder: e.EncodeBSPDecal
    }], [u.PacketTypeId.userMessage, {
      parser: l.ParseUserMessage,
      encoder: l.EncodeUserMessage
    }], [u.PacketTypeId.entityMessage, c.make("entityMessage", "index{11}classId{9}length{11}data{$length}")], [u.PacketTypeId.gameEvent, {
      parser: r.ParseGameEvent,
      encoder: r.EncodeGameEvent
    }], [u.PacketTypeId.packetEntities, {
      parser: s.ParsePacketEntities,
      encoder: s.EncodePacketEntities
    }], [u.PacketTypeId.tempEntities, {
      parser: d.ParseTempEntities,
      encoder: d.EncodeTempEntities
    }], [u.PacketTypeId.preFetch, c.make("preFetch", "index{14}")], [u.PacketTypeId.menu, c.make("menu", "type{u16}length{u16}data{$length*8}")], [u.PacketTypeId.gameEventList, {
      parser: n.ParseGameEventList,
      encoder: n.EncodeGameEventList
    }], [u.PacketTypeId.getCvarValue, c.make("getCvarValue", "cookie{32}value{s}")], [u.PacketTypeId.cmdKeyValues, c.make("cmdKeyValues", "length{32}data{$length}")]]);

    exports.PacketMessageHandler = {
      parseMessage: (e, t) => {
        const a = e.readInt32(),
              r = e.readInt32(),
              n = [new y.Vector(0, 0, 0), new y.Vector(0, 0, 0)],
              s = [new y.Vector(0, 0, 0), new y.Vector(0, 0, 0)],
              c = [new y.Vector(0, 0, 0), new y.Vector(0, 0, 0)];

        for (let P = 0; P < 2; P++) n[P] = new y.Vector(e.readFloat32(), e.readFloat32(), e.readFloat32()), s[P] = new y.Vector(e.readFloat32(), e.readFloat32(), e.readFloat32()), c[P] = new y.Vector(e.readFloat32(), e.readFloat32(), e.readFloat32());

        const i = e.readInt32(),
              o = e.readInt32(),
              d = e.readInt32(),
              p = e.readBitStream(8 * d),
              l = [];
        let k = 0;

        for (; p.bitsLeft > 6;) {
          const e = p.readBits(6);

          if (0 !== e) {
            const a = I.get(e);
            if (!a) throw new Error(`Unknown packet type ${e} just parsed a ${u.PacketTypeId[k]}`);
            {
              const r = -1 !== t.skippedPackets.indexOf(e),
                    n = a.parser(p, t, r);
              l.push(n);
            }
            k = e;
          }
        }

        return {
          type: g.MessageType.Packet,
          tick: a,
          rawData: p,
          packets: l,
          flags: r,
          viewOrigin: n,
          viewAngles: s,
          localViewAngles: c,
          sequenceIn: i,
          sequenceOut: o
        };
      },
      encodeMessage: (e, t, a) => {
        t.writeUint32(e.tick), t.writeUint32(e.flags);

        for (let i = 0; i < 2; i++) t.writeFloat32(e.viewOrigin[i].x), t.writeFloat32(e.viewOrigin[i].y), t.writeFloat32(e.viewOrigin[i].z), t.writeFloat32(e.viewAngles[i].x), t.writeFloat32(e.viewAngles[i].y), t.writeFloat32(e.viewAngles[i].z), t.writeFloat32(e.localViewAngles[i].x), t.writeFloat32(e.localViewAngles[i].y), t.writeFloat32(e.localViewAngles[i].z);

        t.writeUint32(e.sequenceIn), t.writeUint32(e.sequenceOut);
        const r = t.index;
        t.index += 32;
        const n = t.index;

        for (const i of e.packets) {
          const e = u.PacketTypeId[i.packetType];
          t.writeBits(e, 6);
          const r = I.get(e);
          if (!r) throw new Error(`No handler for packet type ${i.packetType}`);
          r.encoder(i, t, a);
        }

        t.writeBits(0, 6);
        const s = t.index;
        t.index = r;
        const c = Math.ceil((s - n) / 8);
        t.writeUint32(c), t.index = n + 8 * c;
      }
    };
  }, {
    "../Packet/BSPDecal": "j1p9",
    "../Packet/ClassInfo": "pVYJ",
    "../Packet/CreateStringTable": "MCtB",
    "../Packet/GameEvent": "QEvd",
    "../Packet/GameEventList": "JJ5b",
    "../Packet/PacketEntities": "l9AK",
    "../Packet/ParserGenerator": "RgkT",
    "../Packet/ParseSounds": "EDYg",
    "../Packet/SetConVar": "IqTV",
    "../Packet/TempEntities": "mb8e",
    "../Packet/UpdateStringTable": "vu7p",
    "../Packet/UserMessage": "Wpmj",
    "../Packet/VoiceData": "IvQE",
    "../Packet/VoiceInit": "wd0f",
    "../../Data/Message": "QLqZ",
    "../../Data/Packet": "H8pU",
    "../../Data/Vector": "yzjq"
  }],
  "yBKN": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.StopHandler = void 0;

    const e = require("../../Data/Message");

    exports.StopHandler = {
      parseMessage: s => ({
        type: e.MessageType.Stop,
        rawData: s.readBitStream(0)
      }),
      encodeMessage: (e, s) => {}
    };
  }, {
    "../../Data/Message": "QLqZ"
  }],
  "A8Cn": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.StringTableHandler = void 0;

    const e = require("../../Data/Message");

    function t(e) {
      const t = {
        text: e.readUTF8String()
      };

      if (e.readBoolean()) {
        const n = e.readUint16();
        t.extraData = e.readBitStream(8 * n);
      }

      return t;
    }

    function n(e, t) {
      t.writeUTF8String(e.text), e.extraData ? (t.writeBoolean(!0), t.writeUint16(Math.ceil(e.extraData.length / 8)), e.extraData.index = 0, t.writeBitStream(e.extraData, e.extraData.length)) : t.writeBoolean(!1);
    }

    exports.StringTableHandler = {
      parseMessage: n => {
        const r = n.readInt32(),
              i = n.readInt32(),
              a = n.readBitStream(8 * i),
              s = a.readUint8(),
              o = [];

        for (let e = 0; e < s; e++) {
          const e = [],
                n = a.readASCIIString(),
                r = a.readUint16();

          for (let s = 0; s < r; s++) {
            const n = t(a);
            e.push(n);
          }

          const i = {
            entries: e,
            name: n,
            maxEntries: r,
            clientEntries: [],
            compressed: !1
          };

          if (a.readBoolean()) {
            const e = a.readUint16();

            for (let n = 0; n < e; n++) {
              const e = t(a);
              i.clientEntries.push(e);
            }
          }

          o.push(i);
        }

        return {
          type: e.MessageType.StringTables,
          tick: r,
          rawData: a,
          tables: o
        };
      },
      encodeMessage: (e, t) => {
        t.writeUint32(e.tick);
        const r = t.index;
        t.index += 32;
        const i = t.index;
        t.writeUint8(e.tables.length);

        for (const o of e.tables) {
          t.writeASCIIString(o.name), t.writeUint16(o.entries.length);

          for (const e of o.entries) n(e, t);

          if (o.clientEntries && o.clientEntries.length) {
            t.writeBoolean(!0), t.writeUint16(o.clientEntries.length);

            for (const e of o.clientEntries) n(e, t);
          } else t.writeBoolean(!1);
        }

        const a = t.index;
        t.index = r;
        const s = Math.ceil((a - i) / 8);
        t.writeUint32(s), t.index = i + 8 * s;
      }
    };
  }, {
    "../../Data/Message": "QLqZ"
  }],
  "svLs": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.SyncTickHandler = void 0;

    const e = require("../../Data/Message");

    exports.SyncTickHandler = {
      parseMessage: t => {
        const r = t.readInt32();
        return {
          type: e.MessageType.SyncTick,
          tick: r,
          rawData: t.readBitStream(0)
        };
      },
      encodeMessage: (e, t) => {
        t.writeUint32(e.tick);
      }
    };
  }, {
    "../../Data/Message": "QLqZ"
  }],
  "n1Ny": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.UserCmdHandler = void 0;

    const e = require("../../Data/Message");

    exports.UserCmdHandler = {
      parseMessage: r => {
        const t = r.readInt32(),
              s = r.readInt32(),
              a = r.readInt32(),
              d = r.readBitStream(8 * a);
        return {
          type: e.MessageType.UserCmd,
          tick: t,
          rawData: d,
          sequenceOut: s
        };
      },
      encodeMessage: (e, r) => {
        throw new Error("not implemented");
      }
    };
  }, {
    "../../Data/Message": "QLqZ"
  }],
  "iwgC": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Parser = exports.messageHandlers = void 0;

    const e = require("./Data/Message"),
          s = require("./Data/Packet"),
          a = require("./Data/ParserState"),
          t = require("./Parser/Header"),
          r = require("./Parser/Message/ConsoleCmd"),
          i = require("./Parser/Message/DataTable"),
          g = require("./Parser/Message/Packet"),
          n = require("./Parser/Message/Stop"),
          d = require("./Parser/Message/StringTable"),
          o = require("./Parser/Message/SyncTick"),
          p = require("./Parser/Message/UserCmd");

    exports.messageHandlers = new Map([[e.MessageType.Sigon, g.PacketMessageHandler], [e.MessageType.Packet, g.PacketMessageHandler], [e.MessageType.ConsoleCmd, r.ConsoleCmdHandler], [e.MessageType.UserCmd, p.UserCmdHandler], [e.MessageType.DataTables, i.DataTableHandler], [e.MessageType.StringTables, d.StringTableHandler], [e.MessageType.SyncTick, o.SyncTickHandler], [e.MessageType.Stop, n.StopHandler]]);

    class l {
      constructor(e, t = []) {
        this.header = null, this.lastMessage = -1, this.stream = e, this.parserState = new a.ParserState(), "hl2mp" === this.getHeader().game ? this.parserState.skippedPackets = [s.PacketTypeId.tempEntities] : this.parserState.skippedPackets = t;
      }

      getHeader() {
        return this.header || (this.header = t.parseHeader(this.stream)), this.header;
      }

      *getPackets() {
        this.getHeader();

        for (const e of this.iterateMessages()) yield* this.handleMessage(e);
      }

      *getMessages() {
        this.getHeader();

        for (const e of this.iterateMessages()) {
          for (const s of this.handleMessage(e));

          yield e;
        }
      }

      *iterateMessages() {
        for (;;) {
          const s = this.readMessage(this.stream, this.parserState);
          if (yield s, s.type === e.MessageType.Stop) return;
        }
      }

      *handleMessage(s) {
        if (this.parserState.handleMessage(s), s.type === e.MessageType.Packet) for (const e of s.packets) this.parserState.handlePacket(e), yield e;
      }

      readMessage(s, a) {
        if (s.bitsLeft < 8) throw new Error("Stream ended without stop packet");
        const t = s.readUint8();
        if (0 === t) return {
          type: e.MessageType.Stop,
          rawData: s.readBitStream(0)
        };
        const r = exports.messageHandlers.get(t);
        if (!r) throw new Error(`No handler for message of type ${e.MessageType[t]}(${t}),\n\t\t\tlast message: ${e.MessageType[this.lastMessage]}(${this.lastMessage})`);
        return this.lastMessage = t, r.parseMessage(this.stream, a);
      }

    }

    exports.Parser = l;
  }, {
    "./Data/Message": "QLqZ",
    "./Data/Packet": "H8pU",
    "./Data/ParserState": "WRKG",
    "./Parser/Header": "sUtz",
    "./Parser/Message/ConsoleCmd": "x1Ky",
    "./Parser/Message/DataTable": "mMII",
    "./Parser/Message/Packet": "rmgk",
    "./Parser/Message/Stop": "yBKN",
    "./Parser/Message/StringTable": "A8Cn",
    "./Parser/Message/SyncTick": "svLs",
    "./Parser/Message/UserCmd": "n1Ny"
  }],
  "y7Ci": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Demo = exports.ParseMode = void 0;

    const e = require("bit-buffer"),
          r = require("./Analyser"),
          t = require("./Data/Packet"),
          s = require("./Parser");

    var a;
    !function (e) {
      e[e.MINIMAL = 0] = "MINIMAL", e[e.ENTITIES = 1] = "ENTITIES", e[e.COMPLETE = 2] = "COMPLETE";
    }(a = exports.ParseMode || (exports.ParseMode = {}));

    class i {
      constructor(r) {
        this.stream = new e.BitStream(r);
      }

      static fromNodeBuffer(e) {
        return new i(e.buffer);
      }

      getParser(e = a.ENTITIES) {
        return this.parser || (this.parser = new s.Parser(this.stream, this.getSkippedPackets(e))), this.parser;
      }

      getAnalyser(e = a.ENTITIES) {
        return new r.Analyser(this.getParser(e));
      }

      getSkippedPackets(e) {
        switch (e) {
          case a.MINIMAL:
            return [t.PacketTypeId.packetEntities, t.PacketTypeId.tempEntities, t.PacketTypeId.entityMessage];

          case a.ENTITIES:
            return [t.PacketTypeId.tempEntities];

          case a.COMPLETE:
            return [];
        }
      }

    }

    exports.Demo = i;
  }, {
    "bit-buffer": "iwlb",
    "./Analyser": "tjse",
    "./Data/Packet": "H8pU",
    "./Parser": "iwgC"
  }],
  "Ox55": [function (require, module, exports) {
    "use strict";

    var _;

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.PlayerCondition = void 0, function (_) {
      _[_.TF_COND_AIMING = 0] = "TF_COND_AIMING", _[_.TF_COND_ZOOMED = 1] = "TF_COND_ZOOMED", _[_.TF_COND_DISGUISING = 2] = "TF_COND_DISGUISING", _[_.TF_COND_DISGUISED = 3] = "TF_COND_DISGUISED", _[_.TF_COND_STEALTHED = 4] = "TF_COND_STEALTHED", _[_.TF_COND_INVULNERABLE = 5] = "TF_COND_INVULNERABLE", _[_.TF_COND_TELEPORTED = 6] = "TF_COND_TELEPORTED", _[_.TF_COND_TAUNTING = 7] = "TF_COND_TAUNTING", _[_.TF_COND_INVULNERABLE_WEARINGOFF = 8] = "TF_COND_INVULNERABLE_WEARINGOFF", _[_.TF_COND_STEALTHED_BLINK = 9] = "TF_COND_STEALTHED_BLINK", _[_.TF_COND_SELECTED_TO_TELEPORT = 10] = "TF_COND_SELECTED_TO_TELEPORT", _[_.TF_COND_CRITBOOSTED = 11] = "TF_COND_CRITBOOSTED", _[_.TF_COND_TMPDAMAGEBONUS = 12] = "TF_COND_TMPDAMAGEBONUS", _[_.TF_COND_FEIGN_DEATH = 13] = "TF_COND_FEIGN_DEATH", _[_.TF_COND_PHASE = 14] = "TF_COND_PHASE", _[_.TF_COND_STUNNED = 15] = "TF_COND_STUNNED", _[_.TF_COND_OFFENSEBUFF = 16] = "TF_COND_OFFENSEBUFF", _[_.TF_COND_SHIELD_CHARGE = 17] = "TF_COND_SHIELD_CHARGE", _[_.TF_COND_DEMO_BUFF = 18] = "TF_COND_DEMO_BUFF", _[_.TF_COND_ENERGY_BUFF = 19] = "TF_COND_ENERGY_BUFF", _[_.TF_COND_RADIUSHEAL = 20] = "TF_COND_RADIUSHEAL", _[_.TF_COND_HEALTH_BUFF = 21] = "TF_COND_HEALTH_BUFF", _[_.TF_COND_BURNING = 22] = "TF_COND_BURNING", _[_.TF_COND_HEALTH_OVERHEALED = 23] = "TF_COND_HEALTH_OVERHEALED", _[_.TF_COND_URINE = 24] = "TF_COND_URINE", _[_.TF_COND_BLEEDING = 25] = "TF_COND_BLEEDING", _[_.TF_COND_DEFENSEBUFF = 26] = "TF_COND_DEFENSEBUFF", _[_.TF_COND_MAD_MILK = 27] = "TF_COND_MAD_MILK", _[_.TF_COND_MEGAHEAL = 28] = "TF_COND_MEGAHEAL", _[_.TF_COND_REGENONDAMAGEBUFF = 29] = "TF_COND_REGENONDAMAGEBUFF", _[_.TF_COND_MARKEDFORDEATH = 30] = "TF_COND_MARKEDFORDEATH", _[_.TF_COND_NOHEALINGDAMAGEBUFF = 31] = "TF_COND_NOHEALINGDAMAGEBUFF", _[_.TF_COND_SPEED_BOOST = 32] = "TF_COND_SPEED_BOOST", _[_.TF_COND_CRITBOOSTED_PUMPKIN = 33] = "TF_COND_CRITBOOSTED_PUMPKIN", _[_.TF_COND_CRITBOOSTED_USER_BUFF = 34] = "TF_COND_CRITBOOSTED_USER_BUFF", _[_.TF_COND_CRITBOOSTED_DEMO_CHARGE = 35] = "TF_COND_CRITBOOSTED_DEMO_CHARGE", _[_.TF_COND_SODAPOPPER_HYPE = 36] = "TF_COND_SODAPOPPER_HYPE", _[_.TF_COND_CRITBOOSTED_FIRST_BLOOD = 37] = "TF_COND_CRITBOOSTED_FIRST_BLOOD", _[_.TF_COND_CRITBOOSTED_BONUS_TIME = 38] = "TF_COND_CRITBOOSTED_BONUS_TIME", _[_.TF_COND_CRITBOOSTED_CTF_CAPTURE = 39] = "TF_COND_CRITBOOSTED_CTF_CAPTURE", _[_.TF_COND_CRITBOOSTED_ON_KILL = 40] = "TF_COND_CRITBOOSTED_ON_KILL", _[_.TF_COND_CANNOT_SWITCH_FROM_MELEE = 41] = "TF_COND_CANNOT_SWITCH_FROM_MELEE", _[_.TF_COND_DEFENSEBUFF_NO_CRIT_BLOCK = 42] = "TF_COND_DEFENSEBUFF_NO_CRIT_BLOCK", _[_.TF_COND_REPROGRAMMED = 43] = "TF_COND_REPROGRAMMED", _[_.TF_COND_CRITBOOSTED_RAGE_BUFF = 44] = "TF_COND_CRITBOOSTED_RAGE_BUFF", _[_.TF_COND_DEFENSEBUFF_HIGH = 45] = "TF_COND_DEFENSEBUFF_HIGH", _[_.TF_COND_SNIPERCHARGE_RAGE_BUFF = 46] = "TF_COND_SNIPERCHARGE_RAGE_BUFF", _[_.TF_COND_DISGUISE_WEARINGOFF = 47] = "TF_COND_DISGUISE_WEARINGOFF", _[_.TF_COND_MARKEDFORDEATH_SILENT = 48] = "TF_COND_MARKEDFORDEATH_SILENT", _[_.TF_COND_DISGUISED_AS_DISPENSER = 49] = "TF_COND_DISGUISED_AS_DISPENSER", _[_.TF_COND_SAPPED = 50] = "TF_COND_SAPPED", _[_.TF_COND_INVULNERABLE_HIDE_UNLESS_DAMAGED = 51] = "TF_COND_INVULNERABLE_HIDE_UNLESS_DAMAGED", _[_.TF_COND_INVULNERABLE_USER_BUFF = 52] = "TF_COND_INVULNERABLE_USER_BUFF", _[_.TF_COND_HALLOWEEN_BOMB_HEAD = 53] = "TF_COND_HALLOWEEN_BOMB_HEAD", _[_.TF_COND_HALLOWEEN_THRILLER = 54] = "TF_COND_HALLOWEEN_THRILLER", _[_.TF_COND_RADIUSHEAL_ON_DAMAGE = 55] = "TF_COND_RADIUSHEAL_ON_DAMAGE", _[_.TF_COND_CRITBOOSTED_CARD_EFFECT = 56] = "TF_COND_CRITBOOSTED_CARD_EFFECT", _[_.TF_COND_INVULNERABLE_CARD_EFFECT = 57] = "TF_COND_INVULNERABLE_CARD_EFFECT", _[_.TF_COND_MEDIGUN_UBER_BULLET_RESIST = 58] = "TF_COND_MEDIGUN_UBER_BULLET_RESIST", _[_.TF_COND_MEDIGUN_UBER_BLAST_RESIST = 59] = "TF_COND_MEDIGUN_UBER_BLAST_RESIST", _[_.TF_COND_MEDIGUN_UBER_FIRE_RESIST = 60] = "TF_COND_MEDIGUN_UBER_FIRE_RESIST", _[_.TF_COND_MEDIGUN_SMALL_BULLET_RESIST = 61] = "TF_COND_MEDIGUN_SMALL_BULLET_RESIST", _[_.TF_COND_MEDIGUN_SMALL_BLAST_RESIST = 62] = "TF_COND_MEDIGUN_SMALL_BLAST_RESIST", _[_.TF_COND_MEDIGUN_SMALL_FIRE_RESIST = 63] = "TF_COND_MEDIGUN_SMALL_FIRE_RESIST", _[_.TF_COND_STEALTHED_USER_BUFF = 64] = "TF_COND_STEALTHED_USER_BUFF", _[_.TF_COND_MEDIGUN_DEBUFF = 65] = "TF_COND_MEDIGUN_DEBUFF", _[_.TF_COND_STEALTHED_USER_BUFF_FADING = 66] = "TF_COND_STEALTHED_USER_BUFF_FADING", _[_.TF_COND_BULLET_IMMUNE = 67] = "TF_COND_BULLET_IMMUNE", _[_.TF_COND_BLAST_IMMUNE = 68] = "TF_COND_BLAST_IMMUNE", _[_.TF_COND_FIRE_IMMUNE = 69] = "TF_COND_FIRE_IMMUNE", _[_.TF_COND_PREVENT_DEATH = 70] = "TF_COND_PREVENT_DEATH", _[_.TF_COND_MVM_BOT_STUN_RADIOWAVE = 71] = "TF_COND_MVM_BOT_STUN_RADIOWAVE", _[_.TF_COND_HALLOWEEN_SPEED_BOOST = 72] = "TF_COND_HALLOWEEN_SPEED_BOOST", _[_.TF_COND_HALLOWEEN_QUICK_HEAL = 73] = "TF_COND_HALLOWEEN_QUICK_HEAL", _[_.TF_COND_HALLOWEEN_GIANT = 74] = "TF_COND_HALLOWEEN_GIANT", _[_.TF_COND_HALLOWEEN_TINY = 75] = "TF_COND_HALLOWEEN_TINY", _[_.TF_COND_HALLOWEEN_IN_HELL = 76] = "TF_COND_HALLOWEEN_IN_HELL", _[_.TF_COND_HALLOWEEN_GHOST_MODE = 77] = "TF_COND_HALLOWEEN_GHOST_MODE", _[_.TF_COND_MINICRITBOOSTED_ON_KILL = 78] = "TF_COND_MINICRITBOOSTED_ON_KILL", _[_.TF_COND_OBSCURED_SMOKE = 79] = "TF_COND_OBSCURED_SMOKE", _[_.TF_COND_PARACHUTE_ACTIVE = 80] = "TF_COND_PARACHUTE_ACTIVE", _[_.TF_COND_BLASTJUMPING = 81] = "TF_COND_BLASTJUMPING", _[_.TF_COND_HALLOWEEN_KART = 82] = "TF_COND_HALLOWEEN_KART", _[_.TF_COND_HALLOWEEN_KART_DASH = 83] = "TF_COND_HALLOWEEN_KART_DASH", _[_.TF_COND_BALLOON_HEAD = 84] = "TF_COND_BALLOON_HEAD", _[_.TF_COND_MELEE_ONLY = 85] = "TF_COND_MELEE_ONLY", _[_.TF_COND_SWIMMING_CURSE = 86] = "TF_COND_SWIMMING_CURSE", _[_.TF_COND_FREEZE_INPUT = 87] = "TF_COND_FREEZE_INPUT", _[_.TF_COND_HALLOWEEN_KART_CAGE = 88] = "TF_COND_HALLOWEEN_KART_CAGE", _[_.TF_COND_DONOTUSE_0 = 89] = "TF_COND_DONOTUSE_0", _[_.TF_COND_RUNE_STRENGTH = 90] = "TF_COND_RUNE_STRENGTH", _[_.TF_COND_RUNE_HASTE = 91] = "TF_COND_RUNE_HASTE", _[_.TF_COND_RUNE_REGEN = 92] = "TF_COND_RUNE_REGEN", _[_.TF_COND_RUNE_RESIST = 93] = "TF_COND_RUNE_RESIST", _[_.TF_COND_RUNE_VAMPIRE = 94] = "TF_COND_RUNE_VAMPIRE", _[_.TF_COND_RUNE_REFLECT = 95] = "TF_COND_RUNE_REFLECT", _[_.TF_COND_RUNE_PRECISION = 96] = "TF_COND_RUNE_PRECISION", _[_.TF_COND_RUNE_AGILITY = 97] = "TF_COND_RUNE_AGILITY", _[_.TF_COND_GRAPPLINGHOOK = 98] = "TF_COND_GRAPPLINGHOOK", _[_.TF_COND_GRAPPLINGHOOK_SAFEFALL = 99] = "TF_COND_GRAPPLINGHOOK_SAFEFALL", _[_.TF_COND_GRAPPLINGHOOK_LATCHED = 100] = "TF_COND_GRAPPLINGHOOK_LATCHED", _[_.TF_COND_GRAPPLINGHOOK_BLEEDING = 101] = "TF_COND_GRAPPLINGHOOK_BLEEDING", _[_.TF_COND_AFTERBURN_IMMUNE = 102] = "TF_COND_AFTERBURN_IMMUNE", _[_.TF_COND_RUNE_KNOCKOUT = 103] = "TF_COND_RUNE_KNOCKOUT", _[_.TF_COND_RUNE_IMBALANCE = 104] = "TF_COND_RUNE_IMBALANCE", _[_.TF_COND_CRITBOOSTED_RUNE_TEMP = 105] = "TF_COND_CRITBOOSTED_RUNE_TEMP", _[_.TF_COND_PASSTIME_INTERCEPTION = 106] = "TF_COND_PASSTIME_INTERCEPTION", _[_.TF_COND_SWIMMING_NO_EFFECTS = 107] = "TF_COND_SWIMMING_NO_EFFECTS", _[_.TF_COND_PURGATORY = 108] = "TF_COND_PURGATORY", _[_.TF_COND_RUNE_KING = 109] = "TF_COND_RUNE_KING", _[_.TF_COND_RUNE_PLAGUE = 110] = "TF_COND_RUNE_PLAGUE", _[_.TF_COND_RUNE_SUPERNOVA = 111] = "TF_COND_RUNE_SUPERNOVA", _[_.TF_COND_PLAGUE = 112] = "TF_COND_PLAGUE", _[_.TF_COND_KING_BUFFED = 113] = "TF_COND_KING_BUFFED", _[_.TF_COND_TEAM_GLOWS = 114] = "TF_COND_TEAM_GLOWS", _[_.TF_COND_KNOCKED_INTO_AIR = 115] = "TF_COND_KNOCKED_INTO_AIR", _[_.TF_COND_COMPETITIVE_WINNER = 116] = "TF_COND_COMPETITIVE_WINNER", _[_.TF_COND_COMPETITIVE_LOSER = 117] = "TF_COND_COMPETITIVE_LOSER", _[_.TF_COND_HEALING_DEBUFF = 118] = "TF_COND_HEALING_DEBUFF", _[_.TF_COND_PASSTIME_PENALTY_DEBUFF = 119] = "TF_COND_PASSTIME_PENALTY_DEBUFF", _[_.TF_COND_GRAPPLED_TO_PLAYER = 120] = "TF_COND_GRAPPLED_TO_PLAYER", _[_.TF_COND_GRAPPLED_BY_PLAYER = 121] = "TF_COND_GRAPPLED_BY_PLAYER", _[_.TF_COND_PARACHUTE_DEPLOYED = 122] = "TF_COND_PARACHUTE_DEPLOYED", _[_.TF_COND_GAS = 123] = "TF_COND_GAS", _[_.TF_COND_BURNING_PYRO = 124] = "TF_COND_BURNING_PYRO", _[_.TF_COND_ROCKETPACK = 125] = "TF_COND_ROCKETPACK", _[_.TF_COND_LOST_FOOTING = 126] = "TF_COND_LOST_FOOTING", _[_.TF_COND_AIR_CURRENT = 127] = "TF_COND_AIR_CURRENT", _[_.TF_COND_HALLOWEEN_HELL_HEAL = 128] = "TF_COND_HALLOWEEN_HELL_HEAL";
    }(_ = exports.PlayerCondition || (exports.PlayerCondition = {}));
  }, {}],
  "fv66": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.GameEventTypeIdMap = void 0, exports.GameEventTypeIdMap = new Map([["server_spawn", 0], ["server_changelevel_failed", 1], ["server_shutdown", 2], ["server_cvar", 3], ["server_message", 4], ["server_addban", 5], ["server_removeban", 6], ["player_connect", 7], ["player_connect_client", 8], ["player_info", 9], ["player_disconnect", 10], ["player_activate", 11], ["player_say", 12], ["client_disconnect", 13], ["client_beginconnect", 14], ["client_connected", 15], ["client_fullconnect", 16], ["host_quit", 17], ["team_info", 18], ["team_score", 19], ["teamplay_broadcast_audio", 20], ["player_team", 21], ["player_class", 22], ["player_death", 23], ["player_hurt", 24], ["player_chat", 25], ["player_score", 26], ["player_spawn", 27], ["player_shoot", 28], ["player_use", 29], ["player_changename", 30], ["player_hintmessage", 31], ["base_player_teleported", 32], ["game_init", 33], ["game_newmap", 34], ["game_start", 35], ["game_end", 36], ["round_start", 37], ["round_end", 38], ["game_message", 39], ["break_breakable", 40], ["break_prop", 41], ["entity_killed", 42], ["bonus_updated", 43], ["achievement_event", 44], ["achievement_increment", 45], ["physgun_pickup", 46], ["flare_ignite_npc", 47], ["helicopter_grenade_punt_miss", 48], ["user_data_downloaded", 49], ["ragdoll_dissolved", 50], ["hltv_changed_mode", 51], ["hltv_changed_target", 52], ["vote_ended", 53], ["vote_started", 54], ["vote_changed", 55], ["vote_passed", 56], ["vote_failed", 57], ["vote_cast", 58], ["vote_options", 59], ["replay_saved", 60], ["entered_performance_mode", 61], ["browse_replays", 62], ["replay_youtube_stats", 63], ["inventory_updated", 64], ["cart_updated", 65], ["store_pricesheet_updated", 66], ["gc_connected", 67], ["item_schema_initialized", 68], ["intro_finish", 69], ["intro_nextcamera", 70], ["mm_lobby_chat", 71], ["mm_lobby_member_join", 72], ["mm_lobby_member_leave", 73], ["player_changeclass", 74], ["tf_map_time_remaining", 75], ["tf_game_over", 76], ["ctf_flag_captured", 77], ["controlpoint_initialized", 78], ["controlpoint_updateimages", 79], ["controlpoint_updatelayout", 80], ["controlpoint_updatecapping", 81], ["controlpoint_updateowner", 82], ["controlpoint_starttouch", 83], ["controlpoint_endtouch", 84], ["controlpoint_pulse_element", 85], ["controlpoint_fake_capture", 86], ["controlpoint_fake_capture_mult", 87], ["teamplay_round_selected", 88], ["teamplay_round_start", 89], ["teamplay_round_active", 90], ["teamplay_waiting_begins", 91], ["teamplay_waiting_ends", 92], ["teamplay_waiting_abouttoend", 93], ["teamplay_restart_round", 94], ["teamplay_ready_restart", 95], ["teamplay_round_restart_seconds", 96], ["teamplay_team_ready", 97], ["teamplay_round_win", 98], ["teamplay_update_timer", 99], ["teamplay_round_stalemate", 100], ["teamplay_overtime_begin", 101], ["teamplay_overtime_end", 102], ["teamplay_suddendeath_begin", 103], ["teamplay_suddendeath_end", 104], ["teamplay_game_over", 105], ["teamplay_map_time_remaining", 106], ["teamplay_timer_flash", 107], ["teamplay_timer_time_added", 108], ["teamplay_point_startcapture", 109], ["teamplay_point_captured", 110], ["teamplay_point_locked", 111], ["teamplay_point_unlocked", 112], ["teamplay_capture_broken", 113], ["teamplay_capture_blocked", 114], ["teamplay_flag_event", 115], ["teamplay_win_panel", 116], ["teamplay_teambalanced_player", 117], ["teamplay_setup_finished", 118], ["teamplay_alert", 119], ["training_complete", 120], ["show_freezepanel", 121], ["hide_freezepanel", 122], ["freezecam_started", 123], ["localplayer_changeteam", 124], ["localplayer_score_changed", 125], ["localplayer_changeclass", 126], ["localplayer_respawn", 127], ["building_info_changed", 128], ["localplayer_changedisguise", 129], ["player_account_changed", 130], ["spy_pda_reset", 131], ["flagstatus_update", 132], ["player_stats_updated", 133], ["playing_commentary", 134], ["player_chargedeployed", 135], ["player_builtobject", 136], ["player_upgradedobject", 137], ["player_carryobject", 138], ["player_dropobject", 139], ["object_removed", 140], ["object_destroyed", 141], ["object_detonated", 142], ["achievement_earned", 143], ["spec_target_updated", 144], ["tournament_stateupdate", 145], ["tournament_enablecountdown", 146], ["player_calledformedic", 147], ["player_askedforball", 148], ["localplayer_becameobserver", 149], ["player_ignited_inv", 150], ["player_ignited", 151], ["player_extinguished", 152], ["player_teleported", 153], ["player_healedmediccall", 154], ["localplayer_chargeready", 155], ["localplayer_winddown", 156], ["player_invulned", 157], ["escort_speed", 158], ["escort_progress", 159], ["escort_recede", 160], ["gameui_activated", 161], ["gameui_hidden", 162], ["player_escort_score", 163], ["player_healonhit", 164], ["player_stealsandvich", 165], ["show_class_layout", 166], ["show_vs_panel", 167], ["player_damaged", 168], ["arena_player_notification", 169], ["arena_match_maxstreak", 170], ["arena_round_start", 171], ["arena_win_panel", 172], ["pve_win_panel", 173], ["air_dash", 174], ["landed", 175], ["player_damage_dodged", 176], ["player_stunned", 177], ["scout_grand_slam", 178], ["scout_slamdoll_landed", 179], ["arrow_impact", 180], ["player_jarated", 181], ["player_jarated_fade", 182], ["player_shield_blocked", 183], ["player_pinned", 184], ["player_healedbymedic", 185], ["player_sapped_object", 186], ["item_found", 187], ["show_annotation", 188], ["hide_annotation", 189], ["post_inventory_application", 190], ["controlpoint_unlock_updated", 191], ["deploy_buff_banner", 192], ["player_buff", 193], ["medic_death", 194], ["overtime_nag", 195], ["teams_changed", 196], ["halloween_pumpkin_grab", 197], ["rocket_jump", 198], ["rocket_jump_landed", 199], ["sticky_jump", 200], ["sticky_jump_landed", 201], ["medic_defended", 202], ["localplayer_healed", 203], ["player_destroyed_pipebomb", 204], ["object_deflected", 205], ["player_mvp", 206], ["raid_spawn_mob", 207], ["raid_spawn_squad", 208], ["nav_blocked", 209], ["path_track_passed", 210], ["num_cappers_changed", 211], ["player_regenerate", 212], ["update_status_item", 213], ["stats_resetround", 214], ["scorestats_accumulated_update", 215], ["scorestats_accumulated_reset", 216], ["achievement_earned_local", 217], ["player_healed", 218], ["building_healed", 219], ["item_pickup", 220], ["duel_status", 221], ["fish_notice", 222], ["fish_notice__arm", 223], ["throwable_hit", 224], ["pumpkin_lord_summoned", 225], ["pumpkin_lord_killed", 226], ["merasmus_summoned", 227], ["merasmus_killed", 228], ["merasmus_escape_warning", 229], ["merasmus_escaped", 230], ["eyeball_boss_summoned", 231], ["eyeball_boss_stunned", 232], ["eyeball_boss_killed", 233], ["eyeball_boss_killer", 234], ["eyeball_boss_escape_imminent", 235], ["eyeball_boss_escaped", 236], ["npc_hurt", 237], ["controlpoint_timer_updated", 238], ["player_highfive_start", 239], ["player_highfive_cancel", 240], ["player_highfive_success", 241], ["player_bonuspoints", 242], ["player_upgraded", 243], ["player_buyback", 244], ["player_used_powerup_bottle", 245], ["christmas_gift_grab", 246], ["player_killed_achievement_zone", 247], ["party_updated", 248], ["lobby_updated", 249], ["mvm_mission_update", 250], ["recalculate_holidays", 251], ["player_currency_changed", 252], ["doomsday_rocket_open", 253], ["remove_nemesis_relationships", 254], ["mvm_creditbonus_wave", 255], ["mvm_creditbonus_all", 256], ["mvm_creditbonus_all_advanced", 257], ["mvm_quick_sentry_upgrade", 258], ["mvm_tank_destroyed_by_players", 259], ["mvm_kill_robot_delivering_bomb", 260], ["mvm_pickup_currency", 261], ["mvm_bomb_carrier_killed", 262], ["mvm_sentrybuster_detonate", 263], ["mvm_scout_marked_for_death", 264], ["mvm_medic_powerup_shared", 265], ["mvm_begin_wave", 266], ["mvm_wave_complete", 267], ["mvm_mission_complete", 268], ["mvm_bomb_reset_by_player", 269], ["mvm_bomb_alarm_triggered", 270], ["mvm_bomb_deploy_reset_by_player", 271], ["mvm_wave_failed", 272], ["mvm_reset_stats", 273], ["damage_resisted", 274], ["revive_player_notify", 275], ["revive_player_stopped", 276], ["revive_player_complete", 277], ["player_turned_to_ghost", 278], ["medigun_shield_blocked_damage", 279], ["mvm_adv_wave_complete_no_gates", 280], ["mvm_sniper_headshot_currency", 281], ["mvm_mannhattan_pit", 282], ["flag_carried_in_detection_zone", 283], ["mvm_adv_wave_killed_stun_radio", 284], ["player_directhit_stun", 285], ["mvm_sentrybuster_killed", 286], ["upgrades_file_changed", 287], ["rd_team_points_changed", 288], ["rd_rules_state_changed", 289], ["rd_robot_killed", 290], ["rd_robot_impact", 291], ["teamplay_pre_round_time_left", 292], ["parachute_deploy", 293], ["parachute_holster", 294], ["kill_refills_meter", 295], ["rps_taunt_event", 296], ["conga_kill", 297], ["player_initial_spawn", 298], ["competitive_victory", 299], ["competitive_stats_update", 300], ["minigame_win", 301], ["sentry_on_go_active", 302], ["duck_xp_level_up", 303], ["questlog_opened", 304], ["schema_updated", 305], ["localplayer_pickup_weapon", 306], ["rd_player_score_points", 307], ["demoman_det_stickies", 308], ["quest_objective_completed", 309], ["player_score_changed", 310], ["killed_capping_player", 311], ["environmental_death", 312], ["projectile_direct_hit", 313], ["pass_get", 314], ["pass_score", 315], ["pass_free", 316], ["pass_pass_caught", 317], ["pass_ball_stolen", 318], ["pass_ball_blocked", 319], ["damage_prevented", 320], ["halloween_boss_killed", 321], ["escaped_loot_island", 322], ["tagged_player_as_it", 323], ["merasmus_stunned", 324], ["merasmus_prop_found", 325], ["halloween_skeleton_killed", 326], ["escape_hell", 327], ["cross_spectral_bridge", 328], ["minigame_won", 329], ["respawn_ghost", 330], ["kill_in_hell", 331], ["halloween_duck_collected", 332], ["special_score", 333], ["team_leader_killed", 334], ["halloween_soul_collected", 335], ["recalculate_truce", 336], ["deadringer_cheat_death", 337], ["crossbow_heal", 338], ["damage_mitigated", 339], ["payload_pushed", 340], ["player_abandoned_match", 341], ["cl_drawline", 342], ["restart_timer_time", 343], ["winlimit_changed", 344], ["winpanel_show_scores", 345], ["top_streams_request_finished", 346], ["competitive_state_changed", 347], ["global_war_data_updated", 348], ["stop_watch_changed", 349], ["ds_stop", 350], ["ds_screenshot", 351], ["show_match_summary", 352], ["experience_changed", 353], ["begin_xp_lerp", 354], ["matchmaker_stats_updated", 355], ["rematch_vote_period_over", 356], ["rematch_failed_to_create", 357], ["player_rematch_change", 358], ["ping_updated", 359], ["player_next_map_vote_change", 360], ["vote_maps_changed", 361], ["hltv_status", 362], ["hltv_cameraman", 363], ["hltv_rank_camera", 364], ["hltv_rank_entity", 365], ["hltv_fixed", 366], ["hltv_chase", 367], ["hltv_message", 368], ["hltv_title", 369], ["hltv_chat", 370], ["replay_startrecord", 371], ["replay_sessioninfo", 372], ["replay_endrecord", 373], ["replay_replaysavailable", 374], ["replay_servererror", 375]]);
  }, {}],
  "WzNp": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });
  }, {}],
  "iDkm": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Packet = exports.Header = exports.UserInfo = exports.World = exports.Vector = exports.SendProp = exports.SendPropType = exports.SendPropFlag = exports.SendPropDefinition = exports.PacketEntity = exports.GameEvent = exports.PlayerCondition = exports.Player = exports.Match = exports.Parser = exports.Demo = void 0;

    var e = require("./Demo");

    Object.defineProperty(exports, "Demo", {
      enumerable: !0,
      get: function () {
        return e.Demo;
      }
    });

    var r = require("./Parser");

    Object.defineProperty(exports, "Parser", {
      enumerable: !0,
      get: function () {
        return r.Parser;
      }
    });

    var t = require("./Data/Match");

    Object.defineProperty(exports, "Match", {
      enumerable: !0,
      get: function () {
        return t.Match;
      }
    });

    var n = require("./Data/Player");

    Object.defineProperty(exports, "Player", {
      enumerable: !0,
      get: function () {
        return n.Player;
      }
    });

    var o = require("./Data/PlayerCondition");

    Object.defineProperty(exports, "PlayerCondition", {
      enumerable: !0,
      get: function () {
        return o.PlayerCondition;
      }
    });

    var a = require("./Data/GameEventTypes");

    Object.defineProperty(exports, "GameEvent", {
      enumerable: !0,
      get: function () {
        return a.GameEvent;
      }
    });

    var i = require("./Data/PacketEntity");

    Object.defineProperty(exports, "PacketEntity", {
      enumerable: !0,
      get: function () {
        return i.PacketEntity;
      }
    });

    var p = require("./Data/SendPropDefinition");

    Object.defineProperty(exports, "SendPropDefinition", {
      enumerable: !0,
      get: function () {
        return p.SendPropDefinition;
      }
    }), Object.defineProperty(exports, "SendPropFlag", {
      enumerable: !0,
      get: function () {
        return p.SendPropFlag;
      }
    }), Object.defineProperty(exports, "SendPropType", {
      enumerable: !0,
      get: function () {
        return p.SendPropType;
      }
    });

    var u = require("./Data/SendProp");

    Object.defineProperty(exports, "SendProp", {
      enumerable: !0,
      get: function () {
        return u.SendProp;
      }
    });

    var P = require("./Data/Vector");

    Object.defineProperty(exports, "Vector", {
      enumerable: !0,
      get: function () {
        return P.Vector;
      }
    });

    var c = require("./Data/World");

    Object.defineProperty(exports, "World", {
      enumerable: !0,
      get: function () {
        return c.World;
      }
    });

    var d = require("./Data/UserInfo");

    Object.defineProperty(exports, "UserInfo", {
      enumerable: !0,
      get: function () {
        return d.UserInfo;
      }
    });

    var s = require("./Data/Header");

    Object.defineProperty(exports, "Header", {
      enumerable: !0,
      get: function () {
        return s.Header;
      }
    });

    var f = require("./Data/Packet");

    Object.defineProperty(exports, "Packet", {
      enumerable: !0,
      get: function () {
        return f.Packet;
      }
    });
  }, {
    "./Demo": "y7Ci",
    "./Parser": "iwgC",
    "./Data/Match": "BVWM",
    "./Data/Player": "yRAc",
    "./Data/PlayerCondition": "Ox55",
    "./Data/GameEventTypes": "fv66",
    "./Data/PacketEntity": "zVSi",
    "./Data/SendPropDefinition": "B5Tw",
    "./Data/SendProp": "h5UE",
    "./Data/Vector": "yzjq",
    "./Data/World": "WzNp",
    "./Data/UserInfo": "WzNp",
    "./Data/Header": "WzNp",
    "./Data/Packet": "H8pU"
  }],
  "TFPF": [function (require, module, exports) {
    "use strict";

    function e(e) {
      return e;
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.DemoToolEvents = e;
  }, {}],
  "Yg8T": [function (require, module, exports) {
    "use strict";

    function e(e, t, a, d) {
      var s, o, r, l, i, n;
      let c = (null === (s = t.values) || void 0 === s ? void 0 : s.targetid) || -100,
          u = (null === (o = t.values) || void 0 === o ? void 0 : o.userid) || -100,
          v = (null === (r = t.values) || void 0 === r ? void 0 : r.attacker) || -100;
      "crossbow_heal" === t.name && (c = t.values.target || -100, u = t.values.healer || -100);

      const g = {
        targetid: (null === (l = e.match.parserState.userInfo.get(c)) || void 0 === l ? void 0 : l.steamId) || "",
        userid: (null === (i = e.match.parserState.userInfo.get(u)) || void 0 === i ? void 0 : i.steamId) || "",
        attacker: (null === (n = e.match.parserState.userInfo.get(v)) || void 0 === n ? void 0 : n.steamId) || ""
      },
            h = t => -100 === t ? d.conds_placeholder() : d.getActive(t, e.match),
            p = {
        targetid: h(c),
        userid: h(u),
        attacker: h(v)
      },
            _ = {
        targetid: e.lastTickConds.get(c) || d.conds_placeholder(),
        userid: e.lastTickConds.get(u) || d.conds_placeholder(),
        attacker: e.lastTickConds.get(v) || d.conds_placeholder()
      };

      return {
        tick: a,
        ...t,
        extend: g,
        extend_conds: p,
        extend_conds_last: _
      };
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.newEventEntities = e;
  }, {}],
  "HNes": [function (require, module, exports) {
    "use strict";

    function e(e, t, a) {
      var r, d, i, o, l, s;
      let u = {
        targetid: (null === (d = e.match.parserState.userInfo.get(null === (r = t.values) || void 0 === r ? void 0 : r.targetid)) || void 0 === d ? void 0 : d.steamId) || "",
        userid: (null === (o = e.match.parserState.userInfo.get(null === (i = t.values) || void 0 === i ? void 0 : i.userid)) || void 0 === o ? void 0 : o.steamId) || "",
        attacker: (null === (s = e.match.parserState.userInfo.get(null === (l = t.values) || void 0 === l ? void 0 : l.attacker)) || void 0 === s ? void 0 : s.steamId) || ""
      };
      return {
        tick: a,
        ...t,
        extend: u
      };
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.newEventMinimal = e;
  }, {}],
  "E25O": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Conds = void 0;

    var e = require("@demostf/demo.js/src");

    class o {
      constructor(e, o) {
        this.conds = e, this.duration = o;
      }

      conds_placeholder() {
        return Object.fromEntries(this.conds.map(e => [e, !1]));
      }

      dbEntry_placeholder() {
        return Object.fromEntries(this.conds.map(e => [e, []]));
      }

      getActive(o, t) {
        let r;
        r = -100 === o ? null : (e => t.getPlayerByUserId(e))(o);

        const s = o => (null == r ? void 0 : r.hasCondition(null === e.PlayerCondition || void 0 === e.PlayerCondition ? void 0 : e.PlayerCondition[o])) || !1;

        return Object.fromEntries(this.conds.map(e => [e, s(e)]));
      }

    }

    exports.Conds = o;
  }, {
    "@demostf/demo.js/src": "iDkm"
  }],
  "YPVd": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.DemoTool = void 0;

    var e = u(require("comlink")),
        t = require("@demostf/demo.js/src"),
        o = require("@demostf/demo.js/src/Data/Message"),
        s = require("./demoToolEvents"),
        n = require("@demostf/demo.js/src/Demo"),
        r = require("./newEventEntities"),
        a = require("./newEventMinimal"),
        c = require("./conds");

    function i() {
      if ("function" != typeof WeakMap) return null;
      var e = new WeakMap();
      return i = function () {
        return e;
      }, e;
    }

    function u(e) {
      if (e && e.__esModule) return e;
      if (null === e || "object" != typeof e && "function" != typeof e) return {
        default: e
      };
      var t = i();
      if (t && t.has(e)) return t.get(e);
      var o = {},
          s = Object.defineProperty && Object.getOwnPropertyDescriptor;

      for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
        var r = s ? Object.getOwnPropertyDescriptor(e, n) : null;
        r && (r.get || r.set) ? Object.defineProperty(o, n, r) : o[n] = e[n];
      }

      return o.default = e, t && t.set(e, o), o;
    }

    class l {
      constructor() {
        this.lastTickConds = new Map(), this.db = new Map(), this.outputBatchBuffer = [], console.log(this);
      }

      outputBatch(e, t) {
        e || (e = 1), this.outputBatchBuffer.push(t), this.callback(this.outputBatchBuffer), this.outputBatchBuffer = [];
      }

      json(e) {
        const t = t => this.outputBatch(e, t);

        return {
          start: () => t('{"data": [\n'),
          msg: e => (e => t(JSON.stringify(e) + ",\n"))(e),
          msg_last: () => (e => t(JSON.stringify(e) + "\n"))((0, s.DemoToolEvents)({
            name: "demotool_json_end",
            values: {}
          })),
          end: () => t("]}")
        };
      }

      obj(e) {
        const t = t => this.outputBatch(e, t),
              o = () => {};

        return {
          start: () => o,
          msg: e => t(e),
          msg_last: () => o,
          end: () => o
        };
      }

      output(e, t) {
        let o = this.json(t);
        return "json" === e && (o = this.json(t)), "obj" === e && (o = this.obj(t)), {
          start: () => o.start(),
          msg: e => o.msg(e),
          msg_last: () => o.msg_last(),
          end: () => o.end()
        };
      }

      parse(e, i) {
        e.outputBatchSize || (e.outputBatchSize = 1), e.outputType || (e.outputType = "obj"), e.parserMode || (e.parserMode = n.ParseMode.MINIMAL), i || (this.callback = () => {}), i && (this.callback = i), console.log(i, this.callback);
        let u = ["round_start", "round_end", "teamplay_round_start", "teamplay_round_win", "teamplay_team_ready"];
        e.gameEvents && (u = e.gameEvents, console.log(e.gameEvents, "gameEvents"));
        let l = [],
            d = [];
        e.conds && (l = e.conds), e.condDurations && (d = e.condDurations), this.demo = new t.Demo(e.arrayBuffer), this.analyser = this.demo.getAnalyser(e.parserMode || n.ParseMode.MINIMAL), this.match = this.analyser.match;
        this.demo;

        const p = this.analyser,
              m = this.match,
              h = new c.Conds(l, d),
              _ = this.output(e.outputType, e.outputBatchSize);

        _.start();

        const f = (e, t) => {
          const o = (0, r.newEventEntities)(this, e, t, h);
          return _.msg(o);
        },
              v = (e, t) => {
          const o = (0, a.newEventMinimal)(this, e, t);
          return _.msg(o);
        };

        let g = (e, t) => {};

        g = e.parserMode === n.ParseMode.MINIMAL ? v : f;
        let k = 0,
            y = !1,
            M = 0;

        for (const t of p.getMessages()) if (t.type === o.MessageType.Packet) for (const o of t.packets) {
          const r = m.tick - m.startTick,
                a = () => r + k;

          if ("setPause" === o.packetType && (k += t.tick - r, o.paused ? (y = !0, u.includes("demotool_pause_start") && g((0, s.DemoToolEvents)({
            name: "demotool_pause_start",
            values: {}
          }), a()), console.log(r, a(), "packet.paused", y, k), console.log("msg.tick", t.tick, "tick", r, "packetTick", M, "packetTick this", null == o ? void 0 : o.tick)) : (y = !1, k += t.tick - r, u.includes("demotool_pause_end") && g((0, s.DemoToolEvents)({
            name: "demotool_pause_end",
            values: {}
          }), a()), console.log(r, a(), "packet.paused", y, k), console.log("msg.tick", t.tick, "tick", r, "packetTick", M, "packetTick this", null == o ? void 0 : o.tick))), "gameEvent" === o.packetType && (u.includes(o.event.name) && "demotool_player_hurt_others" !== o.event.name && g(o.event, a()), u.includes("demotool_player_hurt_others") && "player_hurt" === o.event.name && o.event.values.attacker !== o.event.values.userid && g(o.event, a())), "netTick" === o.packetType && o.tick > M) {
            for (const t of m.playerEntityMap.values()) {
              const o = t.user.userId,
                    r = e => this.lastTickConds.set(e, h.getActive(e, m));

              if (e.parserMode === n.ParseMode.MINIMAL) return void r(o);

              const c = h.getActive(o, m),
                    i = this.lastTickConds.get(o) || h.conds_placeholder(),
                    l = e => this.db.set(o, e),
                    d = () => {
                let e = this.db.get(o);
                return e || (e = h.dbEntry_placeholder(), l(e)), e;
              };

              for (const [e, t] of Object.entries(c)) {
                const n = e;

                if (!1 === i[n] && !0 === t) {
                  const e = d(),
                        t = e[n];
                  t.push({
                    start: a(),
                    end: -1
                  }), e[n] = t, l(e), u.includes("demotool_cond_start") && g((0, s.DemoToolEvents)({
                    name: "demotool_cond_start",
                    values: {
                      userid: o,
                      cond: n
                    }
                  }), a());
                }

                if (!0 === i[n] && !1 === t) {
                  const e = d(),
                        t = e[n],
                        r = t[t.length - 1];
                  r.end = a(), l(e), u.includes("demotool_cond_end") && g((0, s.DemoToolEvents)({
                    name: "demotool_cond_end",
                    values: {
                      userid: o,
                      cond: n
                    }
                  }), a()), u.includes("demotool_cond_duration") && g((0, s.DemoToolEvents)({
                    name: "demotool_cond_duration",
                    values: {
                      userid: o,
                      cond: n,
                      start: r.start,
                      end: r.end,
                      duration: r.end - r.start
                    }
                  }), a());
                }
              }

              r(o);
            }

            M = o.tick;
          }
        }

        _.msg_last(), _.end();
      }

      async getUsers() {
        return [...this.match.users.values()];
      }

      async getDB() {
        return console.log(this.db), [...this.db.entries()];
      }

    }

    exports.DemoTool = l, e.expose(l);
  }, {
    "comlink": "dVJy",
    "@demostf/demo.js/src": "iDkm",
    "@demostf/demo.js/src/Data/Message": "QLqZ",
    "./demoToolEvents": "TFPF",
    "@demostf/demo.js/src/Demo": "y7Ci",
    "./newEventEntities": "Yg8T",
    "./newEventMinimal": "HNes",
    "./conds": "E25O"
  }]
}, {}, ["YPVd"], null);
},{}]},{},["zs1v"], null)