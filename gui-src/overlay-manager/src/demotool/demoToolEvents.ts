import {PlayerCondition} from '@demostf/demo.js/src/index'

export type playerCondKey = Partial<keyof typeof PlayerCondition>

export interface DemoToolCondStart {
	name: 'demotool_cond_start'
	values: {
		userid: number
		cond: Partial<playerCondKey>
	}
}

export interface DemoToolCondEnd {
	name: 'demotool_cond_end'
	values: {
		userid: number
		cond: Partial<playerCondKey>
	}
}

export interface DemoToolCondDuration {
	name: 'demotool_cond_duration'
	values: {
		userid: number
		cond: Partial<playerCondKey>
		start: number
		end: number
		duration: number
	}
}

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

export type DemoToolEvents = DemoToolCondStart | DemoToolCondEnd | DemoToolCondDuration | DemoToolPauseStart | DemoToolPauseEnd | DemoToolJsonEnd

export function DemoToolEvents<EVENT extends DemoToolEvents = DemoToolEvents>(arg: EVENT) {
	return arg
}