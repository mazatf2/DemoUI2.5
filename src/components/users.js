const define = globalThis.define
const html = globalThis.html
const css = globalThis.css

const gameClass = {
	1: 'Scout',
	2: 'Sniper',
	3: 'Soldier',
	4: 'Demoman',
	5: 'Medic',
	6: 'Heavy',
	7: 'Pyro',
	8: 'Spy',
	9: 'Engineer',
}

const UserRow = (i) => {
	const up = ([char, ...chars]) => {
		if (!char) return ''
		return char.toUpperCase() + chars.join('')
	}

	const classes = obj => {
		const keys = Object.keys(obj.classes)
		return keys.map(i => gameClass[i] || i).join(', ')
	}

	return html`
		<tr>
			<td>${up(i.team) || ''}</td>
			<td>${i.name || ''}</td>
			<td>${classes(i)}</td>
			<td>${i.steamId || ''}</td>
		</tr>
	`
}

define('page-users', {
	attachShadow: {mode: 'open'},
	props: {users: []},
	async init() {
		this.render()
	},
	render() {
		this.html`
			<link href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css" rel="stylesheet">
			<table class="table is-hoverable">
				<thead>
				<tr>
					<th>Team</th>
					<th>Nick</th>
					<th>Class</th>
					<th>Id</th>
				</tr>
				</thead>
				<tbody>
				${this.users.map(i => UserRow(i))}
				</tbody>
			</table>
		`
	},
})