const test = require('ava')
const execa = require('execa')
const {
	TestFailureException,
	MissingCssException
} = require('../../lib/exceptions')
const normalizeTapOutput = require('../normalize-tap-output')

test('it reports a success if all assertions pass with CSS via stdIn', async t => {
	const {exitCode, stdout} = await execa('../../lib/cli.js', {
		input: 'body {\n\tcolor: blue;\n}\n',
		cwd: __dirname
	})

	t.is(exitCode, 0)
	t.snapshot(normalizeTapOutput(stdout))
})

test('it reports a success if all assertions pass with a CSS file path as an argument', async t => {
	const {stdout, exitCode} = await execa(
		'../../lib/cli.js',
		['fixture-success.css'],
		{
			cwd: __dirname
		}
	)
	t.is(exitCode, 0)
	t.snapshot(normalizeTapOutput(stdout))
})

test('it reports a failure if some assertions are exceeded', async t => {
	const {exitCode, stdout} = await t.throwsAsync(
		execa('../../lib/cli.js', {
			input: 'body {\n\tcolor: green;\n\tmargin: 0;\n}\n',
			cwd: __dirname
		})
	)

	t.is(exitCode, TestFailureException.code)
	t.snapshot(normalizeTapOutput(stdout))
})

test('it reports an error if no css is passed but a .constyble is present', async t => {
	const {stderr, exitCode} = await t.throwsAsync(
		execa('../../lib/cli.js', {input: '', cwd: __dirname})
	)

	t.is(exitCode, MissingCssException.code)
	t.snapshot(stderr)
})

test('it handles invalid css', async t => {
	const {exitCode} = await t.throwsAsync(
		execa('../../lib/cli.js', {cwd: __dirname, input: 'a'})
	)

	t.is(exitCode, 1)
})

test('it skips assertions when the config value is set to false or -1', async t => {
	const {exitCode, stdout} = await execa(
		'../../lib/cli.js',
		['--config', '.constyblerc-with-skip'],
		{
			input: 'body {\n\tcolor: blue; color: green;\n}\n',
			cwd: __dirname
		}
	)

	t.is(exitCode, 0)
	t.snapshot(normalizeTapOutput(stdout))
})
