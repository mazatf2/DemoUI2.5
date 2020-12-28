import {GameEvent} from '@demostf/demo.js/src/Data/GameEventTypes'
import {DemoToolEvents} from './demoToolEvents'

export function newEventMinimal(self, e: GameEvent | DemoToolEvents, tick: number) {
	let extend = {}
	
	extend = {
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