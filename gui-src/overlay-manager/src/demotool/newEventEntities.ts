import {GameEvent} from '@demostf/demo.js/src/Data/GameEventTypes'
import {DemoToolEvents} from './demoToolEvents'

export function newEventEntities(self, e: GameEvent | DemoToolEvents, tick: number, conds, conds_placeholder) {
	let targetid = e.values?.targetid || -100
	let userid = e.values?.userid || -100
	let attacker = e.values?.attacker || -100
	
	if (e.name === 'crossbow_heal') {
		targetid = e.values.target || -100
		userid = e.values.healer || -100
	}
	
	const extend = {
		targetid: self.match.parserState.userInfo.get(targetid)?.steamId || '',
		userid: self.match.parserState.userInfo.get(userid)?.steamId || '',
		attacker: self.match.parserState.userInfo.get(attacker)?.steamId || '',
	}
	
	const get = id => {
		if (id === -100)
			return conds_placeholder()
		
		return conds(id)
	}
	
	const extend_conds = {
		targetid: get(targetid),
		userid: get(userid),
		attacker: get(attacker),
	}
	
	const extend_conds_last = {
		targetid: self.lastTickConds.get(targetid) || conds_placeholder(),
		userid: self.lastTickConds.get(userid) || conds_placeholder(),
		attacker: self.lastTickConds.get(attacker) || conds_placeholder(),
	}
	
	return {
		tick: tick,
		...e,
		extend: extend,
		extend_conds: extend_conds,
		extend_conds_last: extend_conds_last,
	}
}