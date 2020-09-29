const {io_manager} = require('./io_browser')
const settings = require('../config.json')

io_manager()
const mouse = {x: 0, y: 0, clientX: 0, clientY: 0}
// key: keybind string, value: css id
const keybinds = new Map()
// key: css id, value: boolean
const hudShowState = new Map()
let $mountContainer = null
let mounts = []

const hud = {
	hideAll: function () {
		for (const [id, isActive] of hudShowState) {
			hudShowState.set(id, false)
			if (isActive) {
				const mount = mounts.find(i => i.id === id)
				mount.hoverOff()
			}
			
		}
		this.mouseCaptureArea.off()
	},
	isActive: () => [...hudShowState.values()].some(i => i === true),
	isHudActive: () => {
		for (const [id, isActive] of hudShowState) {
			if (isActive) {
				const mount = mounts.find(i => i.id === id)
				return mount.type === 'hud'
			}
		}
		return false
	},
	isOverlayActive: () => {
		for (const [id, isActive] of hudShowState) {
			if (isActive) {
				const mount = mounts.find(i => i.id === id)
				return mount.type === 'overlay'
			}
		}
		return false
	},
	mouseCaptureArea: {
		on: () => $body.classList.add('mouseCaptureArea'),
		off: () => $body.classList.remove('mouseCaptureArea'),
	},
}

const isInitDone = () => mounts.length > 0

function init() {
	$mountContainer = document.querySelector('#container')
	
	const inputElementsForLog = []
	mounts = [
		...$mountContainer.querySelectorAll('.mount'),
		// <div> <shadowroot/> </div>
	].map(el => {
		console.log(el.dataset)
		keybinds.set(el.dataset.keybind, el.id)
		hudShowState.set(el.id, false)
		el.classList.add('hide')
		
		const inputElements = [...el.children[0].shadowRoot.querySelectorAll('.clickAble')]
		inputElementsForLog.push(inputElements)
		return {
			el: el,
			id: el.id,
			type: el.dataset.type,
			inputElements: inputElements,
			keybind: el.dataset.keybind,
			toggleShow: () => el.classList.toggle('hide'),
			show: () => el.classList.remove('hide'),
			hide: function () {
				return this.el.classList.add('hide')
			},
			hoverOnByEl: function ($inputElement) {
				$inputElement.classList.add('hover')
				if (this.inputElements.length === 0) this.inputElements = [...this.el.children[0].shadowRoot.querySelectorAll('.clickAble')]
				
				this.inputElements.filter(i => i.id !== $inputElement.id)
					//.forEach(i => console.log(i))
					.forEach(i => i.classList.remove('hover'))
			},
			hoverOff: function ($inputElement) {
				if (this.type !== 'hud') return
				if (this.inputElements.length === 0) this.inputElements = [...this.el.children[0].shadowRoot.querySelectorAll('.clickAble')]
				
				this.inputElements.forEach(i => i.classList.remove('hover'))
			},
			
		}
	})
	console.log('init', mounts, inputElementsForLog)
	console.log('keybinds', keybinds)
	
}

// key: keybind string, value: css id
console.log(keybinds)
// key: css id, value: boolean
console.log(hudShowState)
console.log(mounts)

const $dot = document.querySelector('#dot')
const $body = document.body

window.addEventListener('DOMContentLoaded', (e) => {
	init()
	
})

window.addEventListener('_customElements.render', e => {
	// are we missing log entries?
	init()
	console.log('custom element mounted. event fired + caught correctly')
})

window.addEventListener('app.overlay.hide', e => {
	console.log(e)
	hud.hideAll()
})

document.addEventListener('mousemove', e => {
	if (!hud.isHudActive()) return
	
	mouse.clientX = e.x
	mouse.clientY = e.y
	
	const screenMid = getCenterPoint()
	
	const dis = distance(screenMid, mouse)
	
	if (dis < 150) {
		mouse.x += e.movementX
		mouse.y += e.movementY
	} else {
		const pos = towardsPoint(mouse, screenMid, 10)
		mouse.x = pos.x
		mouse.y = pos.y
	}
	
})

document.addEventListener('keydown', e => {
	if (!keybinds.has(e.code)) return
	if (e.repeat) return
	if (hud.isActive()) return
	
	console.log('keydown', e.code)
	
	const cssId = keybinds.get(e.code)
	hudShowState.set(cssId, true)
	
	// don't use "fps controls" for overlays
	if (!hud.isHudActive()) return
	
	$mountContainer.requestPointerLock()
	const mid = getCenterPoint()
	
	mouse.x = mid.x
	mouse.y = mid.y
	
	console.log(hudShowState)
})

document.addEventListener('keyup', e => {
	if (!keybinds.has(e.code)) return
	
	console.log('keyup', e.code)
	
	// overlays hide themself
	if (hud.isOverlayActive()) return
	
	const cssId = keybinds.get(e.code)
	hudShowState.set(cssId, false)
	console.log(hudShowState)
	
	document.exitPointerLock()
})

window.addEventListener('focus', (e) => {
	const mid = getCenterPoint()
	
	mouse.x = mid.x
	mouse.y = mid.y
})

window.addEventListener('blur', (e) => {
	document.exitPointerLock()
	hud.hideAll()
})

document.addEventListener('click', (e) => {
	if (!hud.isHudActive()) return
	
	const target = document.elementFromPoint(mouse.x, mouse.y)
	
	if (target.shadowRoot) {
		const realTarget = target.shadowRoot.elementFromPoint(mouse.x, mouse.y)
		realTarget.click()
		
		hud.hideAll()
	}
	
	document.exitPointerLock()
})

function renderDom() {
	if (!isInitDone()) return
	
	let renderOverlay = false // css .mouseCaptureArea
	
	for (const [cssId, isShowing] of hudShowState) {
		const mount = mounts.find(i => i.id === cssId)
		
		if (isShowing) {
			mount.show()
			
			renderOverlay = true
		}
		if (!isShowing) mount.hide()
		
	}
	
	$dot.style.left = mouse.x + 'px'
	$dot.style.top = mouse.y + 'px'
	
	if (renderOverlay) hud.mouseCaptureArea.on()
	if (!renderOverlay) hud.mouseCaptureArea.off()
	if (!hud.isActive()) return
	if (!hud.isHudActive()) return
	
	const raycast = doc => doc.elementFromPoint(mouse.x, mouse.y) // not real raycast
	const hit = raycast(document)
	
	// inner document
	if (hit.shadowRoot && renderOverlay) {
		const $shadowTarget = raycast(hit.shadowRoot)
		if ($shadowTarget) {
			const cssId = hit.shadowRoot.host.id
			const mount = mounts.find(i => i.id === cssId)
			
			mount.hoverOnByEl($shadowTarget)
		}
	}
}

//requestAnimationFrame(render)
setInterval(renderDom, 1000 / 120)

function distance(from, to) {
	const dx = from.x - to.x
	const dy = from.y - to.y
	return Math.sqrt(dx * dx + dy * dy)
}

function towardsPoint(from, to, amount) {
	const dis = distance(from, to)
	const ratio = amount / dis
	const x = from.x - ratio * (from.x - to.x)
	const y = from.y - ratio * (from.y - to.y)
	
	return {x: x, y: y}
}

function getCenterPoint() {
	const halfX = window.innerWidth / 2
	const halfY = window.innerHeight / 2
	return {x: halfX, y: halfY}
}

