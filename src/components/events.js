const define = globalThis.define
const html = globalThis.html

const Comlink = require('comlink')

const events = []
let userInfo = []
let db = []

async function getEvents(arrayBuffer) {
	if (arrayBuffer.byteLength < 100) return []
	
	let demotool_worker = new Worker('../../lib/demotool.worker.js')
	
	const Demotool = Comlink.wrap(demotool_worker)
	const demotool = await new Demotool()
	
	await demotool.parse({
		arrayBuffer: arrayBuffer, outputBatchSize: 1, outputType: 'obj', gameEvents: [
			'player_chargedeployed',
			'demotool_player_hurt_others',
			'player_death',
			'crossbow_heal',
			'rocket_jump',
			'sticky_jump',
			'demotool_pause_start',
			'demotool_pause_end',
			'demotool_cond_start',
			'demotool_pause_end',
		],
		conds: [
			'TF_COND_BLASTJUMPING',
			'TF_COND_CRITBOOSTED',
			'TF_COND_INVULNERABLE',
			'TF_COND_INVULNERABLE_WEARINGOFF',
		],
		parserMode: 1,
	}, Comlink.proxy((onGameEvent)))
	
	userInfo = await demotool.getUsers()
	db = await demotool.getDB()
	console.log(demotool)
	console.log(events)
	
	return events
}

function onGameEvent(eventArr) {
	//console.log(...eventArr)
	if (eventArr.length !== 1) debugger
	const e = eventArr[0]
	
	const dmg_blast = () => e.values.damagebits & (1 << 6) // DMG_BLAST
	const blasting = () => e.extend_conds.userid.TF_COND_BLASTJUMPING || e.extend_conds_last.userid.TF_COND_BLASTJUMPING
	const ubered = () => e.extend_conds.userid.TF_COND_INVULNERABLE || e.extend_conds.userid.TF_COND_INVULNERABLE_WEARINGOFF
	const on = eventName => e.name === eventName
	const event = (ev) => {
		ev.name = e.name
		ev.tick = e.tick
		ev.event = e
		ev.steamIdFrom = ev.steamId
		ev.steamId = e.extend[ev.steamId]
		events.push(ev)
	}
	
	on('player_hurt') && blasting()
	&& event({steamId: 'userid', labelShort: 'Player got damaged from airshot while blasting'})
	
	on('player_death') && blasting() && dmg_blast()
	&& event({steamId: 'userid', labelShort: 'Player died from airshot while blasting'})
	
	on('player_death') && (e.extend_conds.attacker.TF_COND_BLASTJUMPING || e.extend_conds_last.attacker.BLASTJUMPING) && dmg_blast()
	&& event({steamId: 'attacker', labelShort: 'Attacker got airshot kill while blasting'})
	
	on('player_chargedeployed') && blasting()
	&& event({steamId: 'userid', labelShort: 'ÜberCharge activated while blasting'})
	
	on('crossbow_heal') && (e.extend_conds.targetid.TF_COND_BLASTJUMPING || e.extend_conds_last.targetid.BLASTJUMPING)
	&& event({steamId: 'userid', labelShort: 'Airshot healing arrow'})
	
	on('rocket_jump') || on('sticky_jump') && ubered()
	&& event({steamId: 'userid', labelShort: 'Blast jump while ubered'})
	
	on('rocket_jump') || on('sticky_jump') && e.extend_conds.userid.TF_COND_CRITBOOSTED
	&& event({steamId: 'userid', labelShort: 'Blast jump while kritzed'})
	
	if (blasting() && window.dev) {
		console.log('blasting', e)
	}
}

const Row = (e) => {
	const user = userInfo.find(i => i.steamId === e.steamId)
	const nickName = user.name || ''
	const attackers = Object.entries(e.event.extend) //[[key,value], ...]
	const attackersLen = Object.values(e.event.extend).filter(i => i).length
	let maybeAttackerId = ''
	let maybeAttackerFrom = ''
	if(attackersLen === 1) {
		maybeAttackerId = e.event.extend[e.steamIdFrom]
		maybeAttackerFrom = e.steamIdFrom
	}
	if(attackersLen === 2) {
		const temp = attackers.find(i => i[1] !== '' && i[0] !== e.steamIdFrom)
		maybeAttackerFrom = temp[0]
		maybeAttackerId = temp[1]
	}
	if(attackersLen === 3) {
		maybeAttackerId = 'error'
	}
	const maybeAttackerName = userInfo.find(i => i.steamId === maybeAttackerId)?.name || ''
	
	return html`
	<tr>
		<td>${e.name}</td>
		<td>${nickName}</td>
		<td>${e.steamId}</td>
		<td>${e.tick}</td>
		<td>${e.labelShort}</td>
		<td>${maybeAttackerName}</td>
		<td>${maybeAttackerId}</td>
	</tr>`
}

const Thead = () => {
	return html`
	<thead>
		<tr>
			<th>Event</th>
			<th>Nick</th>
			<th>Steam id</th>
			<th>Tick</th>
			<th>Label</th>
			<th></th>
			<th></th>
		</tr>
	</thead>`
}

define('page-events', {
	attachShadow: {mode: 'open'},
	
	props: {arrayBuffer: new ArrayBuffer(0)},
	
	observedAttributes: ['arrayBuffer'],
	
	attributeChanged(name, oldValue, newValue) { // doesn't seem to work with < .arrayBuffer= />
		console.log(name, oldValue, newValue, 'attributeChanged')
	},
	
	async update() {
		const data = await getEvents(this.arrayBuffer)
		const rows = data.map(i => Row(i))
		
		this.html`
			<link href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css" rel="stylesheet">
			<table class="table is-hoverable">
				${Thead()}
				<tbody>
					${rows}
				</tbody>
			</table>`
	},
	
	render() {
		this.update()
		
		return this.html`Waiting`
	},
	
	init() {
		console.log('page-events init')
		
		this.render()
	},
})