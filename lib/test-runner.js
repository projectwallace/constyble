const tap = require('tap')
const isNumber = require('is-number')
const isArray = require('is-array')
const leven = require('leven')
const {isSmallerThanOrEqualTo, containsNoUnexpected} = require('./assertions')

/**
 * Run tests on our stats with the given configuration
 * @param {*} config The test configuration
 * @param {*} stats The stats that the test checks against
 * @returns {Boolean} True if all tests passed
 */
module.exports = (config, stats) => {
	return Object.entries(config).map(([configName, expected]) => {
		const actual = stats[configName]

		// Need to cast to Boolean, since test.passing() doesn't seem
		// to return a strict Boolean
		return Boolean(
			tap.test(configName, test => {
				// Safety net, stat was not asserted, some config mistake?
				if (typeof actual === 'undefined') {
					const [proposedMetric] = Object.keys(stats).sort((a, b) => {
						return leven(a, configName) - leven(b, configName)
					})
					test.fail(
						`Could not assert '${configName}'. Did you mean '${proposedMetric}'?`
					)
					test.end()
					return false
				}

				// Disabled stats are skipped and considered passing
				if (expected === -1 || expected === false) {
					test.skip(`Skipping ${configName}`)
					test.end()
					return true
				}

				// Assert numeric stat (filesize, selector-count)
				if (isNumber(expected)) {
					const isBelowThreshold = test.true(
						isSmallerThanOrEqualTo(actual, expected),
						`${configName} should not be larger than ${expected} (actual: ${actual})`
					)
					test.end()
					return isBelowThreshold
				}

				// Assert listable stat (colors, font-sizes)
				if (isArray(expected)) {
					const isWithinRange = test.equals(
						containsNoUnexpected(actual, expected),
						true
					)
					test.end()
					return isWithinRange
				}

				// Assert all other types (probably Strings)
				const isSame = test.equals(
					actual,
					expected,
					`${configName} should be '${expected}' (actual: '${actual}')`
				)
				test.end()
				return isSame
			})
		)
	})
}
