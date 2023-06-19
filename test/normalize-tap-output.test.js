const { test } = require('uvu')
const assert = require('uvu/assert')
const normalizeTapOutput = require('./normalize-tap-output.js')

test('it removes or trims lines correctly', () => {
	assert.equal(normalizeTapOutput('# line with comment'), '')
	assert.equal(normalizeTapOutput('1..4 # 200ms'), '1..4')
	assert.equal(normalizeTapOutput('  1..4  '), '  1..4')
})

test.run()