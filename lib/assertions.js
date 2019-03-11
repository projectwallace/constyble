module.exports = {
	containsNoUnexpected: (actual, expected) => {
		return actual.filter(value => !expected.includes(value))
	},
	isSmallerThanOrEqualTo: (actual, expected) => {
		return actual <= expected
	}
}
