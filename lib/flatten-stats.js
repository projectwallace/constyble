import { flatten as f } from 'flat'

export function flatten(stats) {
	// TODO: remove unneeded stats, then flatten

	for (let [id, value] of Object.entries(flat)) {
		if (id.endsWith('.unique')) {
			flat[id] = Object.keys(value)
		}
	}

	let flat = f(stats, { safe: true })

	return flat
}
