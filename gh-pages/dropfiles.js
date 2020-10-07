globalThis.define('component-dropfile', {
	attachShadow: {mode: 'open'},
	props: {
		onArrayBuffer: (buff) => {
		},
	},
	render() {
		this.html`
		<input
			type="file"
		 	accept=".dem"
		 	onchange=${(e) => {
			this.onchange(e)
		}}
		 	style="border: 1px solid black;width: 20rem;height: 10rem"
		>
			component-dropfile
		</input>`
	},
	handleDrop(arrayBuffer) {
		this.onArrayBuffer(arrayBuffer)
	},
	ondragenter(e) {
		e.stopPropagation()
		e.preventDefault()
	},
	ondragover(e) {
		e.stopPropagation()
		e.preventDefault()
	},
	async ondrop(e) {
		e.stopPropagation()
		e.preventDefault()
		
		const files = e.dataTransfer.files
		for (const file of files) {
			const buff = await file.arrayBuffer()
			this.handleDrop(buff)
		}
	},
	onchange(e) {
		e.stopPropagation()
		e.preventDefault()
		console.log(e, 'onchange')
		
		const fileList = e.target.files
		console.log(fileList)
	},
})