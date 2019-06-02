const test = require('ava')
const normalizeTapOutput = require('./normalize-tap-output')

test('it removes or trims lines correctly', t => {
	t.deepEqual(normalizeTapOutput('# line with comment'), '')
	t.deepEqual(normalizeTapOutput('1..4 # 200ms'), '1..4')
})
