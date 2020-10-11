globalThis.define('img-icon', {
	attachShadow: {mode: 'open'},
	
	init() {
		this.render()
	},
	
	render() {
		const path = this.props.src
		
		let src = `https://mazatf2.github.io/DemoUI2.5/img/${path}.avif`
		if (process && process?.versions?.electron)
			src = `../gh-pages/img/${path}.avif`
		
		return this.html`
			<img style="width: 2rem;height: 2rem;" src=${src}/>
		`
	},
})