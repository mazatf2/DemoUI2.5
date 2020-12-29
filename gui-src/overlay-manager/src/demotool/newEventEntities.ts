import {GameEvent} from '@demostf/demo.js/build/Data/GameEventTypes'
import {DemoToolEvents} from './demoToolEvents'
import {activeConds, Conds} from './conds'

type newEventEntities = {
	tick: number
	name: GameEvent['name'] | DemoToolEvents['name']
	values: GameEvent['values'] | DemoToolEvents['values']
	extend: {
		targetid: string
		userid: string
		attacker: string
	}
	extend_conds: {
		targetid: activeConds
		userid: activeConds
		attacker: activeConds
	}
	extend_conds_last: {
		targetid: activeConds
		userid: activeConds
		attacker: activeConds
	}
}

export function newEventEntities(self, e: GameEvent | DemoToolEvents, tick: number, conds: Conds): newEventEntities {
	
	// @ts-ignore
	let targetid = e.values?.targetid || -100
	// @ts-ignore
	let userid = e.values?.userid || -100
	// @ts-ignore
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
			return conds.conds_placeholder()
		
		return conds.getActive(id, self.match)
	}
	
	const extend_conds = {
		targetid: get(targetid),
		userid: get(userid),
		attacker: get(attacker),
	}
	
	const extend_conds_last = {
		targetid: self.lastTickConds.get(targetid) || conds.conds_placeholder(),
		userid: self.lastTickConds.get(userid) || conds.conds_placeholder(),
		attacker: self.lastTickConds.get(attacker) || conds.conds_placeholder(),
	}
	
	return {
		tick: tick,
		...e,
		extend: extend,
		extend_conds: extend_conds,
		extend_conds_last: extend_conds_last,
	}
}