const path = require('path')
const Comlink = require('comlink')
import {define, html, css} from 'https://unpkg.com/uce@1.11.4?module'
import {commands} from '../../../commands.js'
import {strings, team_from_index, teams} from '../../../utils.js'
const {tf2_path} = require('../config.json')

const demoPath = path.join(tf2_path + '/tf/custom/demoui2.5/test.dem')

async function getRounds() {
	const demotool_worker = new Worker('file:../lib/demotool.worker.js')
	const Demotool = Comlink.wrap(demotool_worker)
	
	const demo = await fetch(demoPath)
	const arrayBuffer = await demo.arrayBuffer()
	console.log('arrayBuffer', arrayBuffer.byteLength)
	
	const demotool = await new Demotool()
	
	await demotool.parse({
		arrayBuffer: arrayBuffer, outputBatchSize: 1, outputType: 'obj', gameEvents: [
			'medic_death',
			'player_death',
			
			'demotool_pause_start',
			'demotool_pause_end',
			
			'teamplay_game_over',
			'tf_game_over',
			
			'teamplay_point_captured',
			
			'teamplay_round_selected',
			'teamplay_round_start',
			'teamplay_round_active',
			'teamplay_restart_round',
			'teamplay_round_win',
			'teamplay_round_stalemate',
			'teamplay_overtime_begin',
			'teamplay_overtime_end',
		], parserMode: 0,
	}, Comlink.proxy((onGameEvent)))
	
	console.log(demotool)
	console.log(rounds)
	return rounds
}

const style = css`
.timeline {
	width: 100vw; /* viewport width */
	height: 6rem;
	display: grid;
	/* grid-template-columns: repeat( auto-fill, minmax(50px, 1fr) ) */
	grid-auto-flow: column;
	overflow-x: scroll;
	position: relative;
}

.timeline section {
	height: 4rem;
}

.icon {
	top: 2rem;
}

.round-pause {
	z-index: 1;
	height: 3rem !important;
	top: 1rem;
	
	border-left: 1px black solid;
	border-top: 1px black solid;
	border-right: 1px black solid;

	background: repeating-linear-gradient(
		45deg,
		hsla(0, 0%, 66%, 0.2),
		hsla(0, 0%, 66%, 0.2) 1rem,
		hsla(0, 0%, 66%, 0.3) 1rem,
		hsla(0, 0%, 66%, 0.3) 2rem
	)
}
.round-pause * {
	z-index: 1;
}

.round-normal {
	border: 1px black solid;
}

.round-after {
	border-left: 1px black solid;
	border-top: 1px black solid;
	border-bottom: 1px black solid;
	background: #a9a9a9;
}

.round-normal span, .round-normal input, .round-normal button {
	margin: 2px;
}

* {
	/*border: 1px black dotted;*/
}
`

const GotoButton = (txt, tick, title = '') => {
	return html`
	<button
		onclick=${() => {
		commands.goto_tick(tick)
	}}
		title=${title}
	>
		${txt}
	</button>`
}

const RoundComponent = (round, options) => {
	const {start, end, type} = round
	let {showSpoilers, scalePx} = options
	if (scalePx) scalePx = 16
	const width = end - start
	let infoText = ''
	let typeString = ''
	let events = []
	let backgrounds = []
	let inputs = []
	let neutralTeam = teams.neutral
	
	let classNames = []
	classNames.push(type)
	
	if (type === 'round-normal') {
		typeString = strings.get(type)
		infoText = `${start} - ${end}`
		inputs = [GotoButton('Start', start, `Skip to round start: ${start}`), GotoButton('End', end, `Skip to round end: ${end}`)]
	}
	
	let style = css`
		position: absolute;
		left: ${start / scalePx + 'px'};
		width: ${width / scalePx + 'px'};
	`
	
	const pauses = round.pauseList.map(i => {
		const skip = GotoButton('Skip', i.end, `Skip pause. Skip to: ${i.end}`)
		
		const pxFromRoundStart = (i.start - start) / scalePx
		const pauseLen = (i.end - i.start) / scalePx
		console.log(i, pxFromRoundStart, pauseLen)
		const pauseTicks = `${i.start} - ${i.end}`
		
		let pauseStyle = css`
		position: absolute;
		left: ${pxFromRoundStart + 'px'};
		width: ${pauseLen + 'px'};
		`
		
		return html`<section
			class=round-pause
			style=${pauseStyle}
		>
			<span>Pause ${pauseTicks}</span>
			${skip}
		</section>`
	})
	
	let event = (event, icon, onclick, title) => {
		if (!event) return null
		if (!onclick) onclick = ''
		
		let pxFromRoundStart = (event.tick - start) / scalePx
		
		const style = css`
			position: absolute;
			left: ${pxFromRoundStart + 'px'};
		`
		return html`<img-icon data-tick=${event.tick} class=icon style=${style} src=${icon} onclick=${onclick} title=${title}/>`
	}
	
	if (round.type === 'round-normal') {
		let midWinner, roundWinner = neutralTeam
		
		if (showSpoilers) {
			midWinner = team_from_index(round.midCapture?.values?.team) || neutralTeam
			roundWinner = team_from_index(round.endValue?.values?.team) || neutralTeam
		}
		
		const offset = 200
		const n = tick => Number(tick) - offset
		
		events = [
			event(round.midCapture, 'cap-point/' + midWinner, () => {
				commands.goto_tick(n(round.midCapture?.tick))
			}, 'Skip to mid point capture'),
			event(round.firstDeath, 'health_dead', () => {
				commands.goto_tick_extend(n(round.firstDeath?.tick), 'ce_cameratools_spec_steamid ' + round.firstDeath?.extend?.userid || '' )
			}, 'Skip to first kill'),
		]
	}
	
	return html`
		<section
			class=${classNames}
			style=${style}
		>
			<span>${infoText}</span>
			${inputs}
			${events}
			${pauses}
			${backgrounds}
			<span>${typeString}</span>
		</section>
	`
}

let state = {
	isNormalRound: false,
	isAfterRound: false, // between rounds
}

let round = (start, end, type) => {
	return {start: start, end: end, type: type, width: -1, midCapture: -1, firstDeath: -1, pauseList: []}
}

let pauseBlock = round(-1, -1, 'round-pause')
let roundBlock = round(-1, -1, 'round-normal')
let afterRoundBlock = round(-1, -1, 'round-after')
let start = {tick: -1}
let end = {tick: -1}
const rounds = []

let pauses = []
let cpCaptures = []
let deaths = []

function onGameEvent(eventArr = []) {
	console.log('onEvent', ...eventArr)
	
	const on = eventName => eventArr.filter(i => i.name === eventName)
	
	const newPause = on('demotool_pause_start')
	const newPauseEnd = on('demotool_pause_end')
	
	if (newPause.length > 0)
		pauseBlock = round(newPause[0].tick, -1, 'round-pause')
	//pauseBlock.start = newPause[0].tick
	if (newPauseEnd.length > 0) {
		pauseBlock.end = newPauseEnd[0].tick
		pauseBlock.width = pauseBlock.end - pauseBlock.start
		pauses.push(pauseBlock)
	}
	
	const death = on('player_death')
	if (death.length > 0) deaths.push(death[0])
	const capture = on('teamplay_point_captured')
	if (capture.length > 0) cpCaptures.push(capture[0])
	
	const newStart = on('teamplay_round_start')
	const newEnd = on('teamplay_round_win')
	
	if (newStart.length > 0)
		start = newStart[0]
	if (newEnd.length > 0)
		end = newEnd[0]
	
	let doRoundStart = false
	let doAfterRoundStart = false
	
	if (newStart[0]?.tick > 0) {
		state.isNormalRound = true
		state.isAfterRound = false
		doRoundStart = true
	}
	
	if (newEnd[0]?.tick > 0) {
		state.isNormalRound = false
		state.isAfterRound = true
		doAfterRoundStart = true
	}
	
	if (doRoundStart) {
		console.log(newStart, 'newStart')
		
		roundBlock = round(start.tick, -1, 'round-normal')
		roundBlock.startvalues = start.values
		
		if (afterRoundBlock.start > 0) {
			afterRoundBlock.end = start.tick
			afterRoundBlock.width = afterRoundBlock.end - afterRoundBlock.start
			afterRoundBlock.endvalues = start.values
			rounds.push(afterRoundBlock)
			console.log(afterRoundBlock, 'afterRoundBlock')
		}
		
		pauses = []
		cpCaptures = []
		deaths = []
		
	}
	if (doAfterRoundStart) {
		console.log(newEnd, 'newEnd')
		
		afterRoundBlock = round(end.tick, -1, 'round-after')
		afterRoundBlock.startvalues = end.values
		
		roundBlock.end = end.tick
		roundBlock.width = roundBlock.end - roundBlock.start
		roundBlock.endvalues = end.values
		roundBlock.midCapture = cpCaptures[0]
		roundBlock.firstDeath = deaths[0]
		roundBlock.pauseList = pauses
		
		pauses = []
		cpCaptures = []
		deaths = []
		
		rounds.push(roundBlock)
		console.log(roundBlock, 'roundBlock')
		
	}
	
}

define('page-roundinfo', {
	attachShadow: {mode: 'open'},
	async init() {
		this.render()
		
		let rounds = await getRounds()
		console.log(rounds)
		const options = {showSpoilers: true, scalePx: 16}
		let components = rounds.map(round => RoundComponent(round, options))
		
		this.render(components)
	},
	
	render(r = []) {
		this.html`
			<style>${style}</style>
			<div class="timeline">
				${r}
			</div>
		`
	},
	
})