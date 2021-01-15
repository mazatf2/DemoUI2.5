const define = globalThis.define
const html = globalThis.html
const css = globalThis.css

const pie9 = html`
	<link href="file:gui.css" rel="stylesheet">
	<link href="file:castingessentials/ce-cameratools-spec-class.css" rel="stylesheet">
	
	<div id="container">
		
		<div class="pie pie9" id="castingessentials-piemenu">
			<section class="blu">
				<div class="buttonSized"></div>
				<button>
					Scout
					<div style="display: none">0</div>
				</button>
				<button>
					Scout
					<div style="display: none">1</div>
				</button>
			</section>
			<section>
				<button class="blu">
					Spy
				</button>
				<button class="red">
					Spy
				</button>
			</section>
			<section class="red">
				<button>
					Scout
					<div style="display: none">0</div>
				</button>
				<div class="buttonSized"></div>
				<div class="buttonSized"></div>
				<button>
					Scout
					<div style="display: none">1</div>
				</button>
			</section>
			
			
			<section class="blu">
				<button>
					Soldier
					<div style="display: none">0</div>
				</button>
				<div class="buttonSized"></div>
				<button>
					Soldier
					<div style="display: none">1</div>
				</button>
			</section>
			<section class="g5">
			</section>
			<section class="red">
				<div class="buttonSized"></div>
				<button>
					Soldier
					<div style="display: none">0</div>
				</button>
				<div class="buttonSized"></div>
				<button>
					Soldier
					<div style="display: none">1</div>
				</button>
			</section>
			
			
			<section class="blu">
				<button>
					Demo
				</button>
				<div class="buttonSized"></div>
				<div class="buttonSized"></div>
				<button>
					Medic
				</button>
			</section>
			<section>
				<div class="buttonSized"></div>
				<div class="buttonSized"></div>
				<button class="blu">
					Sniper
				</button>
				<button class="red">
					Sniper
				</button>
			</section>
			<section class="red">
				<div class="buttonSized"></div>
				<button>
					Demo
				</button>
				<button>
					Medic
				</button>
			</section>
		</div>
	</div>
`

const renderEvent = new Event('_customElements.render')
const DOMContentLoaded = new Event('DOMContentLoaded')

define('ce-cameratools-spec-class', {
	attachShadow: {mode: 'open'},
	props: {users: []},
	async init() {
		this.render()
	},
	commandOut(team, gameClass) {
		const exec = new CustomEvent('app.exec', {
			detail: `ce_cameratools_spec_class ${team} ${gameClass}`,
		})
		window.dispatchEvent(exec)
	},
	
	render() {
		window.dispatchEvent(renderEvent)
		this.html`${pie9}`
		
		const buttons = [...this.shadowRoot.querySelectorAll('#castingessentials-piemenu button')]
		for (const i of buttons) {
			const classList = i.classList // DOMTokenList. not [] or Set()
			classList.add('clickAble')
			classList.add('clickAble')
			if (i.parentElement.classList.contains('red')) classList.add('red')
			if (i.parentElement.classList.contains('blu')) classList.add('blu')
			i.id = 'castingessentials-piemenu-' + Math.floor(Date.now() * Math.random())
			
			i.addEventListener('click', e => {
				let team = 'blu'
				const classList = e.target.classList
				
				classList.forEach((currentValue, index) => {
					if (currentValue === 'red') {
						team = 'red'
					}
				})
				
				//const team = classList['red'] || classList['blu']
				const gameClass = e.target.innerText.toLowerCase()
				
				this.commandOut(team, gameClass)
			})
		}
	},
})