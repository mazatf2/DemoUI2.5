const {define, css} = require('uce')

define('img-icon', {
	attachShadow: {mode: 'open'},
	
	init() {
		this.render()
	},
	
	render() {
		const path = this.props.src
		
		const src = `file:img/${path}.avif`
		
		return this.html`
			<img style="width: 2rem;height: 2rem;" src=${src}/>
		`
	},
	
})