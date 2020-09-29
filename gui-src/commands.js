const commandOut = (type, arg) => {
	const event = new CustomEvent(type + '', {
		detail: arg,
	})
	window.dispatchEvent(event)
}

export const commands = {
	goto_tick_extend: (tick, extend) => commandOut('app.goto_tick', `demo_gototick ${tick}; ${extend || ''}`),
	goto_tick: (tick) => commandOut('app.goto_tick', 'demo_gototick ' + tick),
	exec: str => commandOut('app.exec', str),
}