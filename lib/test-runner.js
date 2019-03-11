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
	const defaultTestOptions = {
		diagnostic: false // Disable stack traces
	}

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
						`Could not assert '${configName}'. Did you mean '${proposedMetric}'?`,
						defaultTestOptions
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
						`${configName} should not be larger than ${expected} (actual: ${actual})`,
						defaultTestOptions
					)
					test.end()
					return isBelowThreshold
				}

				// Assert listable stat (colors, font-sizes)
				if (isArray(expected)) {
					const overflow = containsNoUnexpected(actual, expected)
					const isWithinRange = test.strictSame(
						overflow,
						[],
						`${configName} should only contain values listed in the config file`,
						defaultTestOptions
					)

					if (!isWithinRange) {
						tap.comment(
							`Did not expect to find the following values in ${configName}:\n`
						)
						tap.comment(
							overflow.map(unexpected => `\t- ${unexpected}`).join('\n') + '\n'
						)
					}

					test.end()

					return isWithinRange
				}

				// Assert all other types (probably Strings)
				const isSame = test.equals(
					actual,
					expected,
					`${configName} should be '${expected}' (actual: '${actual}')`,
					defaultTestOptions
				)
				test.end()
				return isSame
			})
		)
	})
}
