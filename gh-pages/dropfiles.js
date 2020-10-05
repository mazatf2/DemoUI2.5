globalThis.define('component-dropfile', {
	attachShadow: {mode: 'open'},
	render() {
		this.html`
		<div style="border: 1px solid black;width: 10rem;height: 10rem">
			component-dropfile
		</div>`
	},
	handleDrop(e) {
		console.log(e)
	},
	ondragenter(e) {
		e.stopPropagation()
		e.preventDefault()
	},
	ondragover(e) {
		e.stopPropagation()
		e.preventDefault()
	},
	ondrop(e) {
		e.stopPropagation()
		e.preventDefault()
		
		this.handleDrop(e)
	},
})