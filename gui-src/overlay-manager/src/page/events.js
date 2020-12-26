const define = globalThis.define
const html = globalThis.html

const Comlink = require('comlink')

const events = []
let userInfo = []
let db = []

async function getEvents(arrayBuffer) {
	if (arrayBuffer.byteLength < 100) return []
	
	let demotool_worker = new Worker('../../../../lib/demotool.worker.js')
	if (process && process?.versions?.electron)
		demotool_worker = new Worker('file:../lib/demotool.worker.js')
	
	const Demotool = Comlink.wrap(demotool_worker)
	const demotool = await new Demotool()
	
	await demotool.parse({
		arrayBuffer: arrayBuffer, outputBatchSize: 1, outputType: 'obj', gameEvents: [
			'player_chargedeployed',
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
	console.log(...eventArr)
	if (eventArr.length !== 1) debugger
	const e = eventArr[0]
	
	const dmg_blast = () => e.values.damagebits & (1 << 6) // DMG_BLAST
	const blasting = () => e.extend_conds.userid.TF_COND_BLASTJUMPING || e.extend_conds_last.userid.TF_COND_BLASTJUMPING
	const ubered = () => e.extend_conds.userid.TF_COND_INVULNERABLE || e.extend_conds.userid.TF_COND_INVULNERABLE_WEARINGOFF
	const on = eventName => e.name === eventName
	const event = (ev) => {

		ev.name = e.name
		ev.tick = e.tick
		events.push(ev)
	}
	
	on('player_death') && blasting() && dmg_blast()
	&& event({steamId: e.extend.userid, labelShort: 'Player died from airshot while blasting'})
	
	on('player_death') && (e.extend_conds.attacker.TF_COND_BLASTJUMPING || e.extend_conds_last.attacker.BLASTJUMPING) && dmg_blast()
	&& event({steamId: e.extend.attacker, labelShort: 'Attacker got airshot kill while blasting'})
	
	on('player_chargedeployed') && blasting()
	&& event({steamId: e.extend.userid, labelShort: 'ÜberCharge activated while blasting'})
	
	on('crossbow_heal') && (e.extend_conds.targetid.TF_COND_BLASTJUMPING || e.extend_conds_last.targetid.BLASTJUMPING)
	&& event({steamId: e.extend.userid, labelShort: 'Airshot healing arrow'})
	
	on('rocket_jump') || on('sticky_jump') && ubered()
	&& event({steamId: e.extend.userid, labelShort: 'Blast jump while ubered'})
	
	on('rocket_jump') || on('sticky_jump') && e.extend_conds.userid.TF_COND_CRITBOOSTED
	&& event({steamId: e.extend.userid, labelShort: 'Blast jump while kritzed'})
	
	if (blasting()) {
		console.log('blasting', e)
	}
}

const Row = (e) => {
	const user = userInfo.find(i => i.steamId === e.steamId)
	const nickName = user.name || ''
	
	return html`
	<tr>
		<td>${e.name}</td>
		<td>${nickName}</td>
		<td>${e.steamId}</td>
		<td>${e.tick}</td>
		<td>${e.labelShort}</td>
		<td>${e.label}</td>
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