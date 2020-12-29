import {GameEvent} from '@demostf/demo.js/build/Data/GameEventTypes'
import {DemoToolEvents} from './demoToolEvents'

type newEventMinimal = {
	tick: number
	name: GameEvent['name'] | DemoToolEvents['name']
	values: GameEvent['values'] | DemoToolEvents['values']
	extend: {
		targetid: string
		userid: string
		attacker: string
	}
}

export function newEventMinimal(self, e: GameEvent | DemoToolEvents, tick: number): newEventMinimal {
	let extend = {
		// for ParseMode.Minimal
		
		// @ts-ignore
		targetid: self.match.parserState.userInfo.get(e.values?.targetid)?.steamId || '',
		// @ts-ignore
		userid: self.match.parserState.userInfo.get(e.values?.userid)?.steamId || '',
		// @ts-ignore
		attacker: self.match.parserState.userInfo.get(e.values?.attacker)?.steamId || '',
	}
	
	return {
		tick: tick,
		// name: e.name
		// values: e.values{}
		...e,
		extend: extend,
	}
}