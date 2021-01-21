const define = globalThis.define
const html = globalThis.html
const css = globalThis.css

const pie9 = (playersMap) => {
	const get = (team, game_class, index = 0) => {
		const result = [...playersMap.values()]
			.filter(i => i.team === team && i.game_class === game_class)
		
		if (result.length === 0) return game_class
		
		if (result?.[index]) {
			return html`
				<div>
					<player-t .data="${result?.[index]}" class="customElement"/>
				</div>`
		}
		return html`
			<div>
				${result?.[index]?.nick || game_class}
			</div>`
	}
	
	return html`
		<link href="file:gui.css" rel="stylesheet">
		<link href="file:castingessentials/ce-cameratools-spec-class.css" rel="stylesheet">
		
		<link href="./gui.css" rel="stylesheet">
		<link href="./castingessentials/ce-cameratools-spec-class.css" rel="stylesheet">
		
		<div id="container">
			<div class="pie pie9" id="castingessentials-piemenu">
				<section class="blu">
					<div class="buttonSized"></div>
					<button>
						${get('blu', 'Scout', 0)}
						<div style="display: none">0</div>
					</button>
					<button>
						${get('blu', 'Scout', 1)}
						<div style="display: none">1</div>
					</button>
				</section>
				<section>
					<button class="blu bluButton">
						${get('blu', 'Spy')}
					</button>
					<button class="red redButton">
						${get('red', 'Spy')}
					</button>
				</section>
				<section class="red">
					<button>
						${get('red', 'Scout', 0)}
						<div style="display: none">0</div>
					</button>
					<div class="buttonSized"></div>
					<div class="buttonSized"></div>
					<button>
						${get('red', 'Scout', 1)}
						<div style="display: none">1</div>
					</button>
				</section>
				
				
				<section class="blu">
					<button>
						${get('blu', 'Soldier', 0)}
						<div style="display: none">0</div>
					</button>
					<div class="buttonSized"></div>
					<button>
						${get('blu', 'Soldier', 1)}
						<div style="display: none">1</div>
					</button>
				</section>
				<section class="g5">
				</section>
				<section class="red">
					<div class="buttonSized"></div>
					<button>
						${get('red', 'Soldier', 0)}
						<div style="display: none">0</div>
					</button>
					<div class="buttonSized"></div>
					<button>
						${get('red', 'Soldier', 1)}
						<div style="display: none">1</div>
					</button>
				</section>
				
				
				<section class="blu">
					<button>
						${get('blu', 'Demoman')}
					</button>
					<div class="buttonSized"></div>
					<div class="buttonSized"></div>
					<button>
						${get('blu', 'Medic', 0)}
					</button>
				</section>
				<section>
					<div class="buttonSized"></div>
					<div class="buttonSized"></div>
					<button class="blu bluButton">
						${get('blu', 'Sniper')}
					</button>
					<button class="red redButton">
						${get('red', 'Sniper')}
					</button>
				</section>
				<section class="red">
					<div class="buttonSized"></div>
					<button>
						${get('red', 'Demoman')}
					</button>
					<button>
						${get('red', 'Medic')}
					</button>
				</section>
			</div>
		</div>
	`
}

const renderEvent = new Event('_customElements.render')
const DOMContentLoaded = new Event('DOMContentLoaded')

define('player-t', {
	attachShadow: {mode: 'open'},
	props: {data: new Player({steamid: ''})},
	observedAttributes: ['data'],
	bound: ['getData', 'command'],
	getData() {
		return this.data
	},
	command() {
		return `ce_cameratools_spec_steamid ${this.data.steamid}`
	},
	init() {
		this.render()
	},
	render() {
		this.html`
			<div>
				${this.data.nick}
			</div>
		`
	},
})

function Player(obj) {
	this.steamid = obj.steamid
	this.game_class = obj.game_class || ''
	this.team = obj.team || ''
	this.nick = obj.nick || ''
}

// steam32, Player
const players = new Map()

const getPlayer = (obj) => {
	if (players.has(obj.steamid)) {
		return players.get(obj.steamid)
	}
	const player = new Player(obj)
	players.set(obj.steamid, player)
	return player
}

const parse = (event) => {
	if (event.type === 'ce_cameratools_show_users') {
		getPlayer(event)
	}
}

define('ce-cameratools-spec-class', {
	attachShadow: {mode: 'open'},
	props: {users: []},
	async init() {
		this.render()
	},
	commandOut(str) {
		const exec = new CustomEvent('app.exec', {
			detail: str.toString(),
		})
		window.dispatchEvent(exec)
	},
	connected() {
		window.addEventListener('app.logState', event => {
			parse(event.detail)
			console.log(this)
			this.render()
		})
		
		const buttons = [...this.shadowRoot.querySelectorAll('#castingessentials-piemenu button')]
		for (const i of buttons) {
			const classList = i.classList // DOMTokenList. not [] or Set()
			classList.add('clickAble')
			classList.add('clickAble')
			if (i.parentElement.classList.contains('red')) classList.add('red')
			if (i.parentElement.classList.contains('blu')) classList.add('blu')
			i.id = 'castingessentials-piemenu-' + Math.floor(Date.now() * Math.random())
			
			i.addEventListener('click', e => {
				const component = i.querySelector('.customElement')
				
				if (component) {
					return this.commandOut(component.command())
				}
				
				let team = 'blu'
				const classList = e.target.classList
				
				classList.forEach((currentValue, index) => {
					if (currentValue === 'red') {
						team = 'red'
					}
				})
				
				//const team = classList['red'] || classList['blu']
				const gameClass = e.target.innerText.toLowerCase()
				
				return this.commandOut(`ce_cameratools_spec_class ${team} ${gameClass}`)
			})
		}
	},
	render() {
		window.dispatchEvent(renderEvent)
		this.html`${pie9(players)}`
	},
})