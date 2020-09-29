const {define} = require('uce')
const {overlay_manager_key} = require('../config.json')

import './page/roundinfo.js'

const style = `
#main {
	position: absolute;
	bottom: 0;
	width: 100%;
	background: white;
}

#main button {
	margin: 2px;
}

* {
	pointer-events: all;
	/* border: 1px black dotted; */
}

.timeline {
	width: 100%;
	height: 6rem;
	display: grid;
	grid-auto-flow: column;
}

.timeline section {
	width: 100px;
	height: 4rem;
}
`

const hide = () => {
	window.dispatchEvent(new Event('app.overlay.hide'))
}

define('overlay-manager', {
	attachShadow: {mode: 'open'},
	render(router) {
		if (!router) router = ''
		
		return this.html`<div id='main'>
		<style>${style}</style>
		<button onclick=${() => {
			hide()
		}}>Hide</button>
		<page-roundinfo/>
		</div>
	`
	},
	
	route(content) {
		this.render(content)
	},
	
	_once: false,
	
	_onKeydown(e) {
		if (e.code === overlay_manager_key){
			if(this._once) hide()
			this._once = !this._once
		}
	},
	
	init() {
		console.log('overlay-manager init')
		
		window.addEventListener('keydown', e => this._onKeydown(e)) // this.onKeydown doesnt work with uce/electron
		
		this.route()
	},
	
})

