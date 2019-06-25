const test = require('ava')
const execa = require('execa')
const semver = require('semver')

test('it shows a valid version when passing --version', async t => {
	const {stdout, exitCode} = await execa('./lib/cli.js', ['--version'])

	t.is(stdout, semver.valid(stdout))
	t.is(exitCode, 0)
})

test('it shows a valid version when passing -V', async t => {
	const {stdout, exitCode} = await execa('./lib/cli.js', ['-V'])

	t.is(stdout, semver.valid(stdout))
	t.is(exitCode, 0)
})
