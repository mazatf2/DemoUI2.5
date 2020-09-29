const _teams = {
	'-1': 'neutral',
	'2': 'red',
	'3': 'blu',
}

export let teams = {
	neutral: 'neutral',
	red: 'red',
	blu: 'blu',
	
}

for (const i of Object.keys(_teams)) {
	teams[i] = i
}

export const team_from_index = team => _teams[team] || _teams['-1']

export const strings = {
	'round-pause': 'Pause',
	get(str) {
		return this[str] || ''
	},
	
}
