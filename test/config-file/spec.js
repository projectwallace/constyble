const test = require('ava')
const execa = require('execa')
const normalizeTapOutput = require('../normalize-tap-output')
const {MissingConfigException} = require('../../lib/exceptions')

const FIXTURE_CSS = 'body {\n\tcolor: blue;\n}\n'

test('it parses config with JSON comments without problems', async t => {
	const {code, stdout} = await execa('../../lib/cli.js', {
		input: FIXTURE_CSS,
		cwd: __dirname
	})

	t.is(code, 0)
	t.snapshot(normalizeTapOutput(stdout))
})

test('it handles a custom config file correctly when a valid config path is given', async t => {
	const {code, stdout} = await execa(
		'./lib/cli.js',
		['--config=test/config-file/config.json'],
		{
			input: FIXTURE_CSS
		}
	)

	t.is(code, 0)
	t.snapshot(normalizeTapOutput(stdout))
})

test('it shows a helpful error message when the custom config file cannot be found', async t => {
	const {code, stderr} = await t.throwsAsync(
		execa('./lib/cli.js', {
			input: FIXTURE_CSS
		})
	)

	t.is(code, MissingConfigException.code)
	t.snapshot(stderr)
})

test('it reports an error if a config is not found when passed via --config', async t => {
	const {code, stderr} = await t.throwsAsync(
		execa('./lib/cli.js', ['--config', 'config.json'], {
			input: FIXTURE_CSS
		})
	)

	t.is(code, MissingConfigException.code)
	t.snapshot(stderr)
})

test('it reports an error if a .constyblerc is not found in the current working directory', async t => {
	const {code, stderr} = await t.throwsAsync(
		execa('./lib/cli.js', {
			input: FIXTURE_CSS
		})
	)

	t.is(code, MissingConfigException.code)
	t.snapshot(stderr)
})
