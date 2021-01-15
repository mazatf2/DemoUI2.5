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
})({"EzlH":[function(require,module,exports) {
globalThis.define('component-dropfile', {
  attachShadow: {
    mode: 'open'
  },
  props: {
    onArrayBuffer: buff => {}
  },

  init() {
    const owner = this.shadowRoot.host.ownerDocument;
    owner.addEventListener('dragenter', e => this.stop(e));
    owner.addEventListener('dragover', e => this.stop(e));
    owner.addEventListener('drop', e => this.handleDrop(e));
  },

  render() {
    this.html`
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
		<div class="container content">
		<p>
			<a
				href=""
				onclick=${e => {
      this.showFileSelect(e);
    }}
				class=""
			>
				Select a TF2 stv .dem
			</a>
			or drag it here.
		</p>
		</div>
		<input
			id="select"
			type="file"
		 	accept=".dem"
		 	onchange=${e => {
      this.onchange(e);
    }}
		 	style="display: none;"
		>
		</input>`;
  },

  async handleFile(e) {
    let files = [];
    if (e.type === 'drop') files = e.dataTransfer.files;
    if (e.type === 'change') files = e.target.files;

    for (const file of files) {
      if (!file.name.match('.dem$')) continue;
      const buff = await file.arrayBuffer();
      this.onArrayBuffer(buff);
      this.html``;
      break;
    }
  },

  stop(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  handleDrop(e) {
    this.stop(e);
    this.handleFile(e);
  },

  onchange(e) {
    this.stop(e);
    this.handleFile(e);
  },

  showFileSelect(e) {
    this.stop(e);
    this.shadowRoot.querySelector('#select').click();
  }

});
},{}]},{},["EzlH"], null)