import {Match, PlayerCondition} from '@demostf/demo.js'
import {dbEntry} from './demotool.worker'
import {playerCondKey} from './demoToolEvents'

export class Conds {
	public conds: Partial<keyof typeof PlayerCondition>[]
	public duration: Partial<keyof typeof PlayerCondition>[]
	
	constructor(conds: playerCondKey[], duration: playerCondKey[]) {
		this.conds = conds
		this.duration = duration
	}
	
	conds_placeholder(): Partial<Record<keyof typeof PlayerCondition, false>> {
		return Object.fromEntries(this.conds.map(cond => [cond, false]))
	}
	
	dbEntry_placeholder(): dbEntry {
		return Object.fromEntries(this.conds.map(cond => [cond, []]))
	}
	
	getActive(userId: number, match: Match): Partial<Record<keyof typeof PlayerCondition, boolean>> {
		let player
		const get = userId => match.getPlayerByUserId(userId)
		
		if (userId === -100)
			player = null
		else
			player = get(userId)
		
		const isActive = (key) => player?.hasCondition(PlayerCondition?.[key]) || false
		
		return Object.fromEntries(this.conds.map(cond => [cond, isActive(cond)]))
	}
}