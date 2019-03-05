const test = require('ava')
const execa = require('execa')
const semver = require('semver')

test('it shows a valid version when passing --version', async t => {
	const {stdout, code} = await execa('./cli.js', ['--version'])

	t.is(stdout, semver.valid(stdout))
	t.is(code, 0)
})

test('it shows a valid version when passing -V', async t => {
	const {stdout, code} = await execa('./cli.js', ['-V'])

	t.is(stdout, semver.valid(stdout))
	t.is(code, 0)
})
