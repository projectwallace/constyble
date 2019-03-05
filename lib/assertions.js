module.exports = {
	containsNoUnexpected: (actual, expected) => {
		const overflow = actual.filter(value => !expected.includes(value))

		if (overflow.length === 0) {
			return true
		}

		return overflow
	},
	isSmallerThanOrEqualTo: (actual, expected) => {
		return actual <= expected
	}
}
