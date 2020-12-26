import * as Comlink from 'comlink'
import {GameEvent} from '@demostf/demo.js/src/Data/GameEventTypes'
import {Demo, Match, PlayerCondition, UserInfo} from '@demostf/demo.js/src'
import {Analyser} from '@demostf/demo.js/src/Analyser'
import {MessageType} from '@demostf/demo.js/src/Data/Message'
import {DemoToolEvents, playerCondKey} from './demoToolEvents'
import {ParseMode} from '@demostf/demo.js/src/Demo'
import {newEventEntities} from './newEventEntities'
import {newEventMinimal} from './newEventMinimal'
import {Conds} from './conds'

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
	conds: Partial<keyof typeof PlayerCondition>[]
	condDurations: Partial<keyof typeof PlayerCondition>[]
}
export type startEnd = {
	start: number,
	end: number,
}
export type dbEntry = Partial<Record<keyof typeof PlayerCondition, startEnd[]>>

export class DemoTool {
	public demo: Demo
	public analyser: Analyser
	public match: Match
	public outputBatchBuffer: outputBatch
	public callback: (outputBatch) => void
	public lastTickConds = new Map()
	public db = new Map<number, dbEntry>() // {cond1: [{start: 0, end: 1}, ..], cond2: [{start: 0, end: 1}, ..], ..})
	
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
		const nullOut = () => {
		}
		
		return {
			start: () => nullOut,
			msg: obj => out(obj),
			msg_last: () => nullOut,
			end: () => nullOut,
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
			captureThese = opts.gameEvents
			console.log(opts.gameEvents, 'gameEvents')
		}
		
		let captureConds: playerCondKey[] = []
		let captureCondDurations: playerCondKey[] = []
		
		if (opts.conds) {
			captureConds = opts.conds
		}
		
		if (opts.condDurations) {
			captureCondDurations = opts.condDurations
		}
		
		this.demo = new Demo(opts.arrayBuffer)
		this.analyser = this.demo.getAnalyser(opts.parserMode || ParseMode.MINIMAL)
		this.match = this.analyser.match
		
		const demo = this.demo
		const analyser = this.analyser
		const match = this.match
		const conds = new Conds(captureConds, captureCondDurations)
		
		const output = this.output(opts.outputType, opts.outputBatchSize)
		
		output.start()
		
		const _newEventEntities = (e, tick) => {
			const out = newEventEntities(this, e, tick, conds)
			return output.msg(out)
		}
		
		const _newEventMinimal = (e: GameEvent | DemoToolEvents, tick: number) => {
			const out = newEventMinimal(this, e, tick)
			return output.msg(out)
		}
		
		let newEvent = (e: GameEvent | DemoToolEvents, tick: number) => {
		}
		if (opts.parserMode === ParseMode.MINIMAL) {
			newEvent = _newEventMinimal
		} else {
			newEvent = _newEventEntities
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
							
							if (captureThese.includes('demotool_pause_start')) {
								newEvent(DemoToolEvents({name: 'demotool_pause_start', values: {}}), correctedTick())
							}
							console.log(tick, correctedTick(), 'packet.paused', isPaused, pauseOffset)
						} else {
							isPaused = false
							pauseOffset += msg.tick - tick
							
							if (captureThese.includes('demotool_pause_end')) {
								newEvent(DemoToolEvents({name: 'demotool_pause_end', values: {}}), correctedTick())
							}
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
								
								const setLastTickConds = (userId) => this.lastTickConds.set(userId, conds.getActive(userId, match))
								
								if (opts.parserMode === ParseMode.MINIMAL) {
									setLastTickConds(userId)
									return
								}
								
								const newConds = conds.getActive(userId, match)
								const oldConds = this.lastTickConds.get(userId) || conds.conds_placeholder()
								
								const setPlayerEntry = (i: dbEntry) => this.db.set(userId, i)
								const getPlayerEntry = () => {
									let entry = this.db.get(userId)
									if (!entry) {
										entry = conds.dbEntry_placeholder()
										setPlayerEntry(entry)
									}
									return entry
									
								}
								
								for (const [_key, newVal] of Object.entries(newConds)) {
									const key = _key as playerCondKey
									
									if (oldConds[key] === false && newVal === true) { // start
										const player = getPlayerEntry()
										const entries: startEnd[] = player[key]
										entries.push({start: correctedTick(), end: -1})
										player[key] = entries
										
										setPlayerEntry(player)
										
										if (captureThese.includes('demotool_cond_start')) {
											newEvent(DemoToolEvents({
												name: 'demotool_cond_start',
												values: {userid: userId, cond: key},
											}), correctedTick())
										}
									}
									
									if (oldConds[key] === true && newVal === false) {
										const player: dbEntry = getPlayerEntry()
										const entries: startEnd[] = player[key]
										const current = entries[entries.length - 1]
										current.end = correctedTick()
										
										setPlayerEntry(player)
										
										if (captureThese.includes('demotool_cond_end')) {
											newEvent(DemoToolEvents({
												name: 'demotool_cond_end',
												values: {userid: userId, cond: key},
											}), correctedTick())
										}
										
										if (captureThese.includes('demotool_cond_duration')) {
											newEvent(DemoToolEvents({
												name: 'demotool_cond_duration',
												values: {
													userid: userId,
													cond: key,
													start: current.start,
													end: current.end,
													duration: current.end - current.start,
												},
											}), correctedTick())
										}
									}
								}
								setLastTickConds(userId)
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
	
	async getUsers(): Promise<UserInfo[]> {
		return [...this.match.users.values()]
	}
	
	async getDB() {
		console.log(this.db)
		return [...this.db.entries()]
	}
}

Comlink.expose(DemoTool)