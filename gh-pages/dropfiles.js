globalThis.define('component-dropfile', {
	attachShadow: {mode: 'open'},
	props: {
		onArrayBuffer: (buff) => {
		},
	},
	init() {
		const owner = this.shadowRoot.host.ownerDocument
		owner.addEventListener('dragenter', (e) => this.stop(e))
		owner.addEventListener('dragover', (e) => this.stop(e))
		owner.addEventListener('drop', (e) => this.handleDrop(e))
	},
	render() {
		this.html`
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
		<div class="container content">
		<p>
			<a
				href=""
				onclick=${(e) => {this.showFileSelect(e)}}
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
		 	onchange=${(e) => {this.onchange(e)}}
		 	style="display: none;"
		>
		</input>`
	},
	async handleFile(e) {
		let files = []
		
		if (e.type === 'drop')
			files = e.dataTransfer.files
		if (e.type === 'change')
			files = e.target.files
		
		for (const file of files) {
			if (!file.name.match('.dem$')) continue
			
			const buff = await file.arrayBuffer()
			this.onArrayBuffer(buff)
			this.html``
			break
		}
	},
	stop(e) {
		e.stopPropagation()
		e.preventDefault()
	},
	handleDrop(e) {
		this.stop(e)
		this.handleFile(e)
	},
	onchange(e) {
		this.stop(e)
		this.handleFile(e)
	},
	showFileSelect(e) {
		this.stop(e)
		this.shadowRoot.querySelector('#select').click()
	},
})