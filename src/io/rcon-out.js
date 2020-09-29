const rcon = require('rcon-srcds')

let server = new rcon({
	host: '127.0.0.1',
	port: 27015,
})

module.exports.rcon_out = async (command) => {
	console.log('rcon_out', command)
	
	try {
		
		const retry = () => {
			const id = setTimeout(() => {
				server = new rcon({
					host: '127.0.0.1',
					port: 27015,
				})
				if (server.authenticated) {
					clearTimeout(id)
				}
			}, 1000)
			
		}
		
		if (!server.authenticated) {
			retry()
		}
		
		console.log(server.authenticated)
		
		await server.authenticate('test')
		console.log('authenticated')
		
		server.execute(command.toString())
		
	} catch (e) {
		console.error(e)
	}
}