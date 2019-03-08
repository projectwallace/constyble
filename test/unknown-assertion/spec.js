const test = require('ava')
const execa = require('execa')
const semver = require('semver')
const {normalizeTapOutput} = require('../utils')
const {TestFailureException} = require('../../lib/exceptions')

const FIXTURE_CSS = 'body {\n\tcolor: blue;\n}\n'

test('it fails the test if an unknown assertion is given in the config', async t => {
	const {code, stdout} = await t.throwsAsync(
		execa('../../lib/cli.js', {
			input: FIXTURE_CSS,
			cwd: __dirname
		})
	)

	t.is(code, TestFailureException.code)
	if (semver.gte(process.version, '10.0.0')) {
		t.snapshot(normalizeTapOutput(stdout))
	}
})

test('it shows an alternative assertion if a given one in the config cannot be found', async t => {
	const {code, stdout} = await t.throwsAsync(
		execa('../../lib/cli.js', {
			input: FIXTURE_CSS,
			cwd: __dirname
		})
	)

	t.is(code, TestFailureException.code)
	if (semver.gte(process.version, '10.0.0')) {
		t.snapshot(normalizeTapOutput(stdout))
	}
})
