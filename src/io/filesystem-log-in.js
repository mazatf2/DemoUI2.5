const Path = require('path')
const Tail = require('tail').Tail
const {parse} = require('./filesystem-log-in/parse')
const {tf2_path} = require('../../config.json')

const path = Path.join(tf2_path + 'tf/console.log')

let steamId_by_nick = new Map() // TODO free memory
const getSteamId = nick => steamId_by_nick.has(nick) && steamId_by_nick.get(nick) || null

const gatherSteamIds = (event) => {
	if (!event.type === 'ce_cameratools_show_users') return
	const {team, index, steamid, nick, game_class, type} = event
	if (!steamid || !nick) return
	const entry = steamId_by_nick.set(nick, steamid)
	
	return entry
}

const normalizeEvent = (event) => {
	if (!event.type) throw event
	const {type} = event
	
	const data = []
	const add = ev => data.push(ev)
	
	if (['pause_tftrue', 'pause_player'].includes(type)) {
		add({type: 'pause'})
	}
	
	if (['unpause', 'unpause_tftrue', 'pause_player'].includes(type)) {
		add({type: 'unpause'})
	}
	
	if (['killed'].includes(type)) {
		add({
			type: 'killed',
			player_nick: event.player_nick,
			target_nick: event.target_nick,
			steam_id: getSteamId(event.target_nick),
		})
		add({type: 'death', player_nick: event.target_nick, steam_id: getSteamId(event.target_nick)})
	}
	
	
	if (['killed_self'].includes(type)) {
		const id = getSteamId(event.player_nick)
		add({type: 'death_self', player_nick: event.player_nick, steam_id: id})
		add({type: 'death', player_nick: event.player_nick, steam_id: id})
	}
	
	if (['demo_tick', 'demo_tick2'].includes(type)) {
		add({type: 'tick', tick: event.tick})
	}
	
	return data
}

module.exports.FileSystemLogIn = (sendLogState, sendSteamIds) => {
	const tail = new Tail(path, {useWatchFile: true})
	steamId_by_nick = new Map()
	
	tail.on('line', buff => {
		
		parse(buff, (rawEvent) => {
			if (!rawEvent) return
			
			const ids = gatherSteamIds(rawEvent)
			if (ids) sendSteamIds(ids)
			
			const normalized = normalizeEvent(rawEvent)
			if (normalized.length > 0)
				return sendLogState(normalized)
			return sendLogState(rawEvent)
		})
	})
	
	tail.on('error', err => {
		console.log('error filesystem-log-in: ', err)
	})
	
}
