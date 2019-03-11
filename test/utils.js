const test = require('ava')
const trimRight = require('trim-right')

const normalizeTapOutput = tapOutput => {
	return tapOutput
		.split('\n')
		.map(line => line.replace(/#.*/, ''))
		.map(line => trimRight(line))
		.join('\n')
}

test('it removes or trims lines correctly', t => {
	t.deepEqual(normalizeTapOutput('# line with comment'), '')
	t.deepEqual(normalizeTapOutput('1..4 # 200ms'), '1..4')
})

exports.normalizeTapOutput = normalizeTapOutput
