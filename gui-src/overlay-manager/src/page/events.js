import {define, html} from 'https://unpkg.com/uce@1.11.4?module'

const Comlink = require('comlink')

const events = []

async function getEvents(arrayBuffer) {
	const demotool_worker = new Worker('file:../lib/demotool.worker.js')
	const Demotool = Comlink.wrap(demotool_worker)
	
	if (arrayBuffer.byteLength < 100) return
	
	const demotool = await new Demotool()
	
	await demotool.parse({
		arrayBuffer: arrayBuffer, outputBatchSize: 1, outputType: 'obj', gameEvents: [
			'player_chargedeployed',
			'player_death',
			
			'demotool_pause_start',
			'demotool_pause_end',
		
		], parserMode: 1,
	}, Comlink.proxy((onGameEvent)))
	
	console.log(demotool)
	console.log(events)
	
	return events
}

function onGameEvent(eventArr) {
	console.log(...eventArr)
	if (eventArr.length !== 1) debugger
	const e = eventArr[0]
	
	const blasting = e.extend_conds.BLASTJUMPING || e.extend_conds_last.BLASTJUMPING
	if (blasting)
		events.push(e)
}


const Row = (e) => {
	return html`
		<tr>
			<td>${e.name}</td> <td>${e.tick}</td> <td>Explosive jumping / surfing explosive damage</td>
		</tr>
	`
}

const Table = (e) => {
	return html``
}

define('page-events', {
	attachShadow: {mode: 'open'},
	
	props: {arrayBuffer: new ArrayBuffer(0)},
	
	observedAttributes: ['arrayBuffer'],
	
	attributeChanged(name, oldValue, newValue) { // doesn't seem to work with < .arrayBuffer= />
		console.log(name, oldValue, newValue, 'attributeChanged')
	},
	
	render() {
		return this.html`
		dem len ${this.arrayBuffer.byteLength ?? 'waiting'}
		${
			getEvents(this.arrayBuffer)
				.then(r => r.map(i => Row(i)))
		}
	`
	},
	
	init() {
		console.log('page-events init')
		
		this.render()
	},
})