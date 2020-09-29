const {app, BrowserWindow} = require('electron')
const {Io_nodejs} = require('./src/io_nodejs')
require('./src/io_nodejs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null

app.on('ready', () => {
	createWindow()
})

function createWindow() {
	
	mainWindow = new BrowserWindow({
		width: 1920,
		height: 1080,
		webPreferences: {
			nodeIntegration: true,
		},
		frame: false,
		transparent: true,
		resizable: false, // required for transparent window
		allowRendererProcessReuse: false, // required for fs callbacks
		
	})
	
	mainWindow.loadURL('file://' + __dirname + '/gui-src/gui.html')
	
	// undocked needed for transparent window
	mainWindow.webContents.openDevTools({mode: 'undocked'})
	
	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
	
	mainWindow.webContents.on('did-finish-load', () => {
		Io_nodejs(mainWindow.webContents)
	})
	
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

process.on('uncaughtException', error => {
	console.log('uncaughtException', error)
})


