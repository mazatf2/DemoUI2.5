const renderEvent = new Event('_customElements.render')
const DOMContentLoaded = new Event('DOMContentLoaded')

const tagName = 'ce-cameratools-spec-class'
customElements.define(
	tagName,
	class extends HTMLElement {
		constructor() {
			super()
			this.attachShadow({mode: 'open'})
		}
		
		commandOut(team, gameClass) {
			const exec = new CustomEvent('app.exec', {
				detail: `ce_cameratools_spec_class ${team} ${gameClass}`,
			})
			window.dispatchEvent(exec)
		}
		
		connectedCallback() {
			console.log(tagName, 'init')
			
			fetch('./castingessentials/ce-cameratools-spec-class.html')
				
				.then(async r => {
						this.shadowRoot.innerHTML = await r.text()
						
						window.dispatchEvent(renderEvent)
						
						const buttons = [...this.shadowRoot.querySelectorAll('#castingessentials-piemenu button')]
						
						for (const i of buttons) {
							const classList = i.classList // DOMTokenList. not [] or Set()
							classList.add('clickAble')
							classList.add('clickAble')
							if (i.parentElement.classList.contains('red')) classList.add('red')
							if (i.parentElement.classList.contains('blu')) classList.add('blu')
							i.id = 'castingessentials-piemenu-' + Math.floor(Date.now() * Math.random())
							
							i.addEventListener('click', e => {
								console.log(e, 123213123213)
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
				)
		}
	},
)