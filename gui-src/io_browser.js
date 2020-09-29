const ipcRenderer = require('electron').ipcRenderer

module.exports.io_manager = () => {
	console.log('io_manager init')
	
	window.addEventListener('app.goto_tick', e => {
		console.log(e.type, e)
		
		send({
			type: e.type,
			detail: e.detail,
		})
	})
	
	window.addEventListener('app.exec', e => {
		
		send({
			type: e.type,
			detail: e.detail,
		})
		
	})
	
	ipcRenderer.on('app.renderer', (event, message) => {
		console.log(message)
		console.log(1)
	})
	
	ipcRenderer.on('app.logState', (event, message) => {
		console.log('app.logState', message)
		console.log(1)
	})
	
	function send(event) {
		ipcRenderer.send('app.main', event)
	}
	
}
