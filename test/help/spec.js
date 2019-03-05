const test = require('ava')
const execa = require('execa')

test('it shows a help message when called with --help', async t => {
	const {stdout, code} = await execa('./cli.js', ['--help'])

	t.snapshot(stdout)
	t.is(code, 0)
})

test('it shows a help message when called without arguments', async t => {
	const {stdout, code} = await execa('./cli.js', {input: ''})

	t.snapshot(stdout)
	t.is(code, 0)
})
