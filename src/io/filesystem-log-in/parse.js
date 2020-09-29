const keys = {
	'dateRe': 'dateRe',
	'playerRe': 'playerRe',
	'targetRe': 'targetRe',
	'weaponRe': 'weaponRe',
	'steamIdRe': 'steamIdRe',
	'demo_tick': 'demo_tick',
	'demo_tick2': 'demo_tick2',
	'setposRe': 'setposRe',
	'setangRE': 'setangRE',
	'cmd_getpos': 'cmd_getpos',
	'ce_cameratools_show_users': 'ce_cameratools_show_users',
	'tf2_player_count': 'tf2_player_count',
	'tf2_playing_demo': 'tf2_playing_demo',
	'pause_tftrue': 'pause_tftrue',
	'pause_player': 'pause_player',
	'unpause': 'unpause',
	'unpause_tftrue': 'unpause_tftrue',
	'unpause_player': 'unpause_player',
}

const logApiRE = {}

function build(identifier, reString, callback) {
	logApiRE[identifier] = new RegExp(reString)
	logApiRE[identifier]._key = identifier
	keys[identifier] = identifier
	return logApiRE[identifier].source
}

function helper(identifier, reString, callback) {
	return new RegExp(reString).source
}

const dateRe = helper('dateRe', /(?<month>\d+)\/(?<day>\d+)\/(?<year>\d+) - (?<hour>\d+):(?<minute>\d+):(?<second>\d+):/)
const playerRe = helper('playerRe', /(?<player_nick>.+)/)
const targetRe = helper('targetRe', /(?<target_nick>.+)/)
const weaponRe = helper('weaponRe', /(?<weapon>.+)/)
const steamIdRe = helper('steamIdRe', /(?<steamid>\[U.+\])/)

/*
09/13/2020 - 22:15:28: Msg from unknown: svc_Sounds: number 1, bytes 11
09/13/2020 - 22:15:28: Msg from unknown: net_Tick: tick 104619
09/13/2020 - 22:15:28: Msg from unknown: svc_PacketEntities: delta 104618, max 1242, changed 18, bytes 580
09/13/2020 - 22:15:28: Msg from unknown: net_Tick: tick 104620
09/13/2020 - 22:15:28: Msg from unknown: svc_PacketEntities: delta 104619, max 1242, changed 18, bytes 654
09/13/2020 - 22:15:28: Msg from unknown: net_Tick: tick 104621
09/13/2020 - 22:15:28: Msg from unknown: svc_PacketEntities: delta 104620, max 1242, changed 17, bytes 534
09/13/2020 - 22:15:29:
09/13/2020 - 22:15:29: "net_showmsg" = "0" - Show incoming message: <0|1|name>
 */

/*
09/13/2020 - 22:01:40: Demo message, tick 64854, 502 bytes
09/13/2020 - 22:01:40: Demo message, tick 64855, 436 bytes
09/13/2020 - 22:01:40: 64855 network packet [436]
09/13/2020 - 22:01:40: 64856 network packet [466]
09/13/2020 - 22:01:40: Demo message, tick 64856, 466 bytes
demo_debug 1
 */

const demo_tick = build('demo_tick', `${dateRe} Demo message, tick (?<tick>\\d+)`)
const demo_tick2 = build('demo_tick2', `${dateRe} (?<tick>\\d+) network packet`)

/*
09/14/2020 - 12:20:08: setpos 299.764435 -554.278442 521.271606;setang -13.058824 203.753662 0.000000
09/14/2020 - 14:17:29: setpos 0.000000 0.000000 0.000000;setang 0.000000 0.000000 0.000000
 */

const setposRe = helper('setposRe', /setpos (?<posX>[^ ]+) (?<posY>[^ ]+) (?<posZ>[^ ]+);/)
const setangRE = helper('setangRE', /setang (?<angX>[^ ]+) (?<angY>[^ ]+) (?<angZ>[^ ]+)/)

const cmd_getpos = build('cmd_getpos', `${dateRe} ${setposRe}${setangRE}`)

/*
Plugins: found file "CastingEssentials.vdf"
Loading unsigned module addons\CastingEssentials.dll
Access to secure servers is disabled.
Hello from CastingEssentials r21!
 */

/*
09/14/2020 - 10:52:37: 12 Players:
09/14/2020 - 10:52:37:     alias player_red0 "ce_cameratools_spec_steamid [U:1:39329888]"		// Ascent Silentes (Soldier)
09/14/2020 - 10:52:37:     alias player_red1 "ce_cameratools_spec_steamid [U:1:124355652]"		// Ascent amppis (Scout)
09/14/2020 - 10:52:37:     alias player_red2 "ce_cameratools_spec_steamid [U:1:117926946]"		// Ascent Elacour (Demoman)
09/14/2020 - 10:52:37:     alias player_red4 "ce_cameratools_spec_steamid [U:1:89622677]"		// Ascent credu (Scout)
09/14/2020 - 10:52:37:     alias player_red3 "ce_cameratools_spec_steamid [U:1:106786225]"		// Ascent Connor (Medic)
09/14/2020 - 10:52:37:     alias player_red5 "ce_cameratools_spec_steamid [U:1:24614767]"		// Ascent Drackk (Soldier)
09/14/2020 - 10:52:37:     alias player_blu0 "ce_cameratools_spec_steamid [U:1:47737701]"		// 7 Starkie (Soldier)
09/14/2020 - 10:52:37:     alias player_blu1 "ce_cameratools_spec_steamid [U:1:73461364]"		// 7 kaptain (Soldier)
09/14/2020 - 10:52:37:     alias player_blu2 "ce_cameratools_spec_steamid [U:1:26802444]"		// 7 Raymon (Medic)
09/14/2020 - 10:52:37:     alias player_blu3 "ce_cameratools_spec_steamid [U:1:96525192]"		// 7 Domo (Demoman)
09/14/2020 - 10:52:37:     alias player_blu4 "ce_cameratools_spec_steamid [U:1:103786523]"		// 7 Thalash (Sniper)
09/14/2020 - 10:52:37:     alias player_blu5 "ce_cameratools_spec_steamid [U:1:115334142]"		// 7 Thaigrr (Engineer)
ce_cameratools_show_users
 */

const ce_cameratools_show_users = build('ce_cameratools_show_users', `${dateRe}\\s+alias player_(?<team>blu|red)(?<index>\\d|\\d\\d) "ce_cameratools_spec_steamid ${steamIdRe}"\\s+// (?<nick>.+) \\((?<game_class>.+[^)])\\)`)
const tf2_player_count = build('tf2_player_count', `${dateRe} (?<player_count>\\d{1,2}) Players:`)

/*
09/14/2020 - 10:54:35: Playing demo from tf\custom\pie-menu-gui\demos\test.dem.
09/14/2020 - 09:47:15: Playing demo from test.dem.
 */

const tf2_playing_demo = build('tf2_playing_demo', `${dateRe} Playing demo from (?<path>.+)\\.`)

/*
[Pause] Game was paused by ANT | seeds
 Updated version: doesn't allow uber building during pauses!
Saving ubercharge level for SEÑOR PERMZILLA
Saving ubercharge level for ANT | seeds
[TFTrue] The game was paused by ANT | seeds.
ANT | seeds paused the game
 */

const pause_tftrue = build('pause_tftrue', `[TFTrue] The game was paused by ${playerRe}`)
const pause_player = build('pause_player', `${playerRe} paused the game`)

/*
EÑOR STARKIE :  unpausing
ANT | Azunis :  go
[Pause] Game is being unpaused in 5 seconds by SEÑOR STARKIE...
[Pause] Game is being unpaused in 4 seconds...
[Pause] Game is being unpaused in 3 seconds...
[Pause] Game is being unpaused in 2 seconds...
[Pause] Game is being unpaused in 1 second...
Restoring ubercharge level for SEÑOR PERMZILLA
Restoring ubercharge level for ANT | seeds
[Pause] Game is unpaused!
[TFTrue] The game was unpaused by ANT | SOREXXXXXXXX.
[TFTrue] The game was unpaused by ANT | SOREXXXXXXXX.
SEÑOR CHONK WORLD unpaused the game
 */

const unpause = build('unpause', `[Pause] Game is unpaused!`)
const unpause_tftrue = build('unpause_tftrue', `[TFTrue] The game was unpaused by ${playerRe}`)
const unpause_player = build('unpause_player', `${playerRe} unpaused the game`)

/*
cp_process
09/14/2020 - 12:02:07: ANT | Nevo captured Middle Point for team #2
09/14/2020 - 12:21:08: SEÑOR Thaigrr_-, SEÑOR KAPTAIN captured Middle Point for team #3
 */

/*
09/14/2020 - 11:58:39: SEÑOR STARKIE killed ANT | Eemes with tf_projectile_rocket.
09/14/2020 - 11:58:40: SEÑOR PERMZILLA killed ANT | Azunis with sniperrifle. (crit)
09/14/2020 - 11:59:03: ANT | SOREXXXXXXXX killed SEÑOR STARKIE with world.
*/

const killed = build('killed', `${dateRe} ${playerRe} killed ${targetRe} with ${weaponRe}\\.`)

/*
09/14/2020 - 11:58:40: SEÑOR PERMZILLA suicided.
 */

// crater etc ?
const killed_self = build('killed_self', `${dateRe} ${playerRe} suicided`)

const doReExec = (line, key) => {
	let result = logApiRE[key].exec(line)
	
	result.groups['type'] = key
	
	let t = result.groups
	let time = new Date(`${t.year}-${t.month}-${t.day}T${t.hour}:${t.minute}:${t.second}Z`) // ISO8601
	result.groups['date_json'] = time.toJSON()
	
	return result
}

const apikeys = Object.keys(logApiRE)
const findMatch = (line) => {
	
	for (const key of apikeys) {
		let test = logApiRE[key].test(line)
		if (test) {
			let result = doReExec(line, key)
			return result
			
		}
	}
	return false
}

const parse = (buffer, cb) => {
	const txt = buffer.toString()
	// https://github.com/AnAkkk/TFTrue/blob/9dcfe26173f6597a0109f9cf129d28086d1a3a98/tournament.cpp#L528
	// AllMessage(*cmd_clientslot+1, "\x05[TFTrue] The game was unpaused by \x03%s\x05.\n", pClient->GetClientName());
	// 09/14/2020 - 12:14:49: <0x05>[TFTrue] The game was unpaused by <0x03>ANT | SOREXXXXXXXX<0x05>.
	txt.replace(String.fromCharCode(0x05), '')
	txt.replace(String.fromCharCode(0x03), '')
	const lines = txt.split((/\r\n|\n/))
	
	for (const line of lines) {
		const result = findMatch(line)
		if (result) cb(result.groups) //console.log(result.groups)
		
	}
	
}

module.exports.parse = parse