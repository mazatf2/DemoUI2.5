import * as Comlink from 'comlink'
import {GameEvent} from '@demostf/demo.js/src/Data/GameEventTypes'
import {Demo, Match, PlayerCondition} from '@demostf/demo.js/src'
import {Analyser} from '@demostf/demo.js/src/Analyser'
import {MessageType} from '@demostf/demo.js/src/Data/Message'
import {DemoToolEvents} from './demoToolEvents'
import {ParseMode} from '@demostf/demo.js/src/Demo'

type outputType = 'json' | 'obj'
type output = {
	start: () => void,
	msg: (obj) => void,
	msg_last: () => void,
	end: () => void
}
type outputCallback = () => outputBatch
type outputBatch = Array<GameEvent | DemoToolEvents | string>
type parse = {
	arrayBuffer: ArrayBuffer,
	outputBatchSize: number,
	outputType: outputType,
	gameEvents: string[],
	parserMode: ParseMode
}
type conds = {
	INVULNERABLE: boolean,
	INVULNERABLE_WEARINGOFF: boolean,
	BLASTJUMPING: boolean,
	CRITBOOSTED: boolean
}
type startEnd = {
	start: number,
	end: number,
}
type dbEntry = {
	INVULNERABLE: startEnd[],
	INVULNERABLE_WEARINGOFF: startEnd[],
	BLASTJUMPING: startEnd[],
	CRITBOOSTED: startEnd[],
}

const dbEntry_placeholder = (): dbEntry => {
	return {
		INVULNERABLE: [],
		INVULNERABLE_WEARINGOFF: [],
		BLASTJUMPING: [],
		CRITBOOSTED: [],
	}
}

const conds_placeholder = (): conds => {
	return {
		INVULNERABLE: false,
		INVULNERABLE_WEARINGOFF: false,
		BLASTJUMPING: false,
		CRITBOOSTED: false,
	}
}

export class DemoTool {
	public demo: Demo
	public analyser: Analyser
	public match: Match
	public outputBatchBuffer: outputBatch
	public callback: (outputBatch) => void
	public lastTickConds = new Map()
	public db = new Map<number, dbEntry>()
	
	constructor() {
		this.outputBatchBuffer = []
		console.log(this)
	}
	
	outputBatch(outputBatchSize: number, event: any) {
		if (!outputBatchSize) outputBatchSize = 1
		this.outputBatchBuffer.push(event)
		this.callback(this.outputBatchBuffer)
		this.outputBatchBuffer = []
	}
	
	json(outputBatchSize: number): output {
		const out = txt => this.outputBatch(outputBatchSize, txt)
		const outJSON = txt => out(JSON.stringify(txt) + ',\n')
		const outJSONNoTrailing = txt => out(JSON.stringify(txt) + '\n')
		
		return {
			start: () => out('{"data": [\n'),
			msg: obj => outJSON(obj),
			msg_last: () => outJSONNoTrailing(DemoToolEvents.demotool_json_end()),
			end: () => out(']}'),
		}
	}
	
	obj(outputBatchSize: number): output {
		const out = obj => this.outputBatch(outputBatchSize, obj)
		
		return {
			start: () => {},
			msg: obj => out(obj),
			msg_last: () => {},
			end: () => {},
		}
	}
	
	output(outputType: outputType, outputBatchSize: number): output {
		let out = this.json(outputBatchSize)
		
		if (outputType === 'json')
			out = this.json(outputBatchSize)
		if (outputType === 'obj')
			out = this.obj(outputBatchSize)
		
		return {
			start: () => out.start(),
			msg: obj => out.msg(obj),
			msg_last: () => out.msg_last(),
			end: () => out.end(),
		}
	}
	
	inc() {
		return 1
	}
	
	parse(opts: parse, callback) {
		if (!opts.outputBatchSize) opts.outputBatchSize = 1
		if (!opts.outputType) opts.outputType = 'obj'
		if (!opts.parserMode) opts.parserMode = ParseMode.MINIMAL
		if (!callback) this.callback = () => {
		}
		if (callback) this.callback = callback
		console.log(callback, this.callback)
		
		let captureThese = [
			'round_start',
			'round_end',
			'teamplay_round_start',
			'teamplay_round_win',
			'teamplay_team_ready',
		
		]
		
		if (opts.gameEvents) {
			//gameEvents.filter(i => typeof i === 'string')
			//if (gameEvents.length > 0) captureThese = gameEvents
			captureThese = opts.gameEvents
			console.log(opts.gameEvents, 'gameEvents')
		}
		
		this.demo = new Demo(opts.arrayBuffer)
		this.analyser = this.demo.getAnalyser(opts.parserMode || ParseMode.MINIMAL)
		this.match = this.analyser.match
		
		const demo = this.demo
		const analyser = this.analyser
		const match = this.match
		
		const output = this.output(opts.outputType, opts.outputBatchSize)
		
		/*
		const msg = analyser.getMessages()
			.filter(msg => msg.type === MessageType.Packet)
			//.map(i => [...i.packets])
			msg.packets
			.filter(i => <Packet>i.packetType === 'gameEvent')
			.filter(i=> i.packetType === 'gameEvent')
		*/
		
		/*
		const getPlayer = (id: number): Player => {
			let players = {}
			return (id: number) => {
				if(id in players){
					return players[id]
				}
				else {
					const player = match.getPlayerByUserId(id)
					players[id] = player
					return player
				}
			}
		}
		 */
		
		output.start()
		
		const conds = (userId) => {
			let player
			const get = userId => this.match.getPlayerByUserId(userId)
			
			if (userId === -100)
				player = null
			else
				player = get(userId)
			
			return {
				BLASTJUMPING: player?.hasCondition(PlayerCondition.TF_COND_BLASTJUMPING) || false,
				INVULNERABLE: player?.hasCondition(PlayerCondition.TF_COND_INVULNERABLE) || false,
				INVULNERABLE_WEARINGOFF: player?.hasCondition(PlayerCondition.TF_COND_INVULNERABLE_WEARINGOFF) || false,
				CRITBOOSTED: player?.hasCondition(PlayerCondition.TF_COND_CRITBOOSTED) || false,
			}
		}

		
		const newEventEntities = (e: GameEvent | DemoToolEvents, tick: number) => {
			
			const extend = {
				targetid: this.match.parserState.userInfo.get(e.values?.targetid)?.steamId || '',
				userid: this.match.parserState.userInfo.get(e.values?.userid)?.steamId || '',
				attacker: this.match.parserState.userInfo.get(e.values?.attacker)?.steamId || '',
			}
			
			const targetid = e.values?.targetid || -100
			const userid = e.values?.userid || -100
			const attacker = e.values?.attacker || -100
			
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
				targetid: this.lastTickConds.get(e.values?.targetid) || conds_placeholder(),
				userid: this.lastTickConds.get(e.values?.userid) || conds_placeholder(),
				attacker: this.lastTickConds.get(e.values?.attacker) || conds_placeholder(),
			}
			
			const out = {
				tick: tick,
				...e,
				extend: extend,
				extend_conds: extend_conds,
				extend_conds_last: extend_conds_last,
			}
			
			return output.msg(out)
		}
		
		const newEventMinimal = (e: GameEvent | DemoToolEvents, tick: number) => {
			let extend = {}
			
			extend = {
				// for ParseMode.Minimal
				targetid: this.match.parserState.userInfo.get(e.values?.targetid)?.steamId || '',
				userid: this.match.parserState.userInfo.get(e.values?.userid)?.steamId || '',
				attacker: this.match.parserState.userInfo.get(e.values?.attacker)?.steamId || '',
			}
			
			const out = {
				tick: tick,
				// name: e.name
				// values: e.values{}
				...e,
				extend: extend,
			}
			
			return output.msg(out)
			
		}
		
		let newEvent = (e: GameEvent | DemoToolEvents, tick: number) => {}
		if (opts.parserMode === ParseMode.MINIMAL) {
			newEvent = newEventMinimal
		} else {
			newEvent = newEventEntities
		}
		
		let pauseOffset: number = 0
		let isPaused = false
		let packetTick = 0
		
		for (const msg of analyser.getMessages()) {
			
			if (msg.type === MessageType.Packet) {
				type s = typeof msg
				
				for (const packet of msg.packets) {
					
					const tick: number = match.tick - match.startTick
					const correctedTick = () => tick + pauseOffset
					
					if (packet.packetType === 'setPause') {
						pauseOffset += msg.tick - tick
						if (packet.paused) {
							isPaused = true
							
							newEvent(DemoToolEvents.demotool_pause_start(), correctedTick())
							console.log(tick, correctedTick(), 'packet.paused', isPaused, pauseOffset)
						} else {
							isPaused = false
							pauseOffset += msg.tick - tick
							
							newEvent(DemoToolEvents.demotool_pause_end(), correctedTick())
							console.log(tick, correctedTick(), 'packet.paused', isPaused, pauseOffset)
						}
					}
					if (packet.packetType === 'gameEvent') {
						type s = typeof packet.event
						//console.log(packet.event.name)
						
						if (captureThese.includes(packet.event.name)) {
							newEvent(packet.event, correctedTick())
						}
					}
					if (packet.packetType === 'netTick') {
						if (packet.tick > packetTick) {
							for (const player of match.playerEntityMap.values()) {
								const userId = player.user.userId
								this.lastTickConds.set(userId, conds(userId))
								
								if(opts.parserMode === ParseMode.MINIMAL)
									return
								
								const newConds: conds = conds(userId)
								const oldConds: conds = this.lastTickConds.get(userId) || conds_placeholder()
								
								const setEntry = (i: dbEntry) => this.db.set(userId, i)
								const getEntry = () => {
									let entry = this.db.get(userId)
									if (!entry) {
										entry = this.dbEntry_placeholder()
										setEntry(entry)
									}
									return entry
									
								}
								
								for (const [key, newVal] of Object.entries(newConds)) {
									if (oldConds[key] === false && newVal === true) { // start
										const entry = getEntry()
										const entries: startEnd[] = entry[key]
										entries.push({start: correctedTick(), end: -1})
										entry[key] = entries
										
										setEntry(entry)
									}
									
									if (oldConds[key] === true && newVal === false) {
										const entry: dbEntry = getEntry()
										const entries: startEnd[] = entry[key]
										entries[entries.length - 1].end = correctedTick()
										
										setEntry(entry)
									}
								}
							}
							packetTick = packet.tick
						}
					}
				}
			}
		}
		
		output.msg_last()
		output.end()
		
	}
}

Comlink.expose(DemoTool)