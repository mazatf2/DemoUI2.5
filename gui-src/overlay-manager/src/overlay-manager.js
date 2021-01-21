const path = require('path')
import {define} from 'https://unpkg.com/uce@1.12.1?module'
import './page/roundinfo.js'
import './page/events.js'

const {overlay_manager_key, tf2_path} = require('../config.json')
const demoPath = path.join(tf2_path + '/tf/custom/demoui2.5/test.dem')

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
	
	arrayBuffer: new ArrayBuffer(0),
	
	viewMode: 'stv',
	
	render(router) {
		if (!router) router = ''
		
		return this.html`
			<div id="main">
				<style>${style}</style>
				<button onclick=${() => {
					hide()
				}}>
					Hide
				</button>
				
				${this.viewMode === 'stv' && 'stv'}
				${this.viewMode === 'dem' && html`
					<page-roundinfo .arrayBuffer="${this.arrayBuffer}"/>
					<page-events .arrayBuffer="${this.arrayBuffer}"/>
				`
				}
			</div>
		`
	},
	
	route(content) {
		this.render(content)
	},
	
	_once: false,
	
	_onKeydown(e) {
		if (e.code === overlay_manager_key) {
			if (this._once) hide()
			this._once = !this._once
		}
	},
	
	init() {
		console.log('overlay-manager init')
		
		window.addEventListener('keydown', e => this._onKeydown(e)) // this.onKeydown doesnt work with uce/electron
		
		const get = async () => {
			const demo = await fetch(demoPath)
			return await demo.arrayBuffer()
		}
		get().then(i => {
			this.arrayBuffer = i
			this.route()
		})
		
		this.route()
	},
	
})

