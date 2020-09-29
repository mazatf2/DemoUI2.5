export interface DemoToolPauseStart {
	name: 'demotool_pause_start'
	values: {}
}

export interface DemoToolPauseEnd {
	name: 'demotool_pause_end'
	values: {}
}

export interface DemoToolJsonEnd {
	name: 'demotool_json_end'
	values: {}
}

export type DemoToolEvents = DemoToolPauseStart | DemoToolPauseEnd | DemoToolJsonEnd

const empyEvent = (name: DemoToolEvents['name']): DemoToolEvents => {
	return {name: name, values: {}}
}

export const DemoToolEvents = {
	'demotool_pause_start': () => <DemoToolPauseStart>empyEvent('demotool_pause_start'),
	'demotool_pause_end': () => <DemoToolPauseEnd>empyEvent('demotool_pause_end'),
	'demotool_json_end': () => <DemoToolJsonEnd>empyEvent('demotool_json_end'),
}


