const {ipcMain} = require('electron')
const {rcon_out} = require('./io/rcon-out')
const {FileSystemLogIn} = require('./io/filesystem-log-in')
console.log('io_node')

const sendLogState = (logState) => {
	_webContents.send('app.logState', logState)
}

const sendSteamIds = (steamIds) => {
	_webContents.send('app.logState_steam_ids', steamIds)
}

let _webContents = null

module.exports.Io_nodejs = (webContents) => {
	if (!webContents) throw webContents
	_webContents = webContents
	console.log('Io_nodejs init')
	
	FileSystemLogIn(sendLogState, sendSteamIds)
	
	ipcMain.on('app.main', (event, arg) => {
		console.log(arg)
		if (arg.type === 'app.exec') {
			rcon_out(arg.detail)
		}
		if (arg.type === 'app.goto_tick') {
			rcon_out(arg.detail)
		}
		event.reply('app.renderer', [arg])
	})
	
}
