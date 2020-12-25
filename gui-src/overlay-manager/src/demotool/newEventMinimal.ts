import {GameEvent} from '@demostf/demo.js/src/Data/GameEventTypes'
import {DemoToolEvents} from './demoToolEvents'

export function newEventMinimal(self, e: GameEvent | DemoToolEvents, tick: number) {
	let extend = {}
	
	extend = {
		// for ParseMode.Minimal
		targetid: self.match.parserState.userInfo.get(e.values?.targetid)?.steamId || '',
		userid: self.match.parserState.userInfo.get(e.values?.userid)?.steamId || '',
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