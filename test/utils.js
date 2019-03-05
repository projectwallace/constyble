const test = require('ava')
const trimRight = require('trim-right')

const normalizeTapOutput = tapOutput => {
	return tapOutput
		.split('\n')
		.map(line => line.replace(/#.*/, ''))
		.map(line => line.replace(/\/.*constyble/, 'constyble'))
		.map(line => trimRight(line))
		.join('\n')
}

test('it removes or trims lines correctly', t => {
	t.deepEqual(normalizeTapOutput('# line with comment'), '')
	t.deepEqual(normalizeTapOutput('1..4 # 200ms'), '1..4')
	t.deepEqual(
		normalizeTapOutput(
			'(/home/travis/build/bartveneman/constyble/lib/test-runner.js:45:11)'
		),
		'(constyble/lib/test-runner.js:45:11)'
	)
	t.deepEqual(
		normalizeTapOutput(
			'(/Users/MY-PROJECT-NAME/node_modules/constyble/lib/test-runner.js:45:11)'
		),
		'(constyble/lib/test-runner.js:45:11)'
	)
	t.deepEqual(
		normalizeTapOutput(
			'file: /home/travis/build/bartveneman/constyble/lib/test-runner.js'
		),
		'file: constyble/lib/test-runner.js'
	)
})

exports.normalizeTapOutput = normalizeTapOutput
