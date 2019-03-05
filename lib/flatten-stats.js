module.exports = stats => {
	return Object.entries(stats)
		.map(([key, stat]) => {
			if (key.includes('unique')) {
				return {
					key,
					stat: stat.map(item => item.value)
				}
			}

			return {key, stat}
		})
		.reduce((acc, curr) => {
			acc[curr.key] = curr.stat
			return acc
		}, {})
}
