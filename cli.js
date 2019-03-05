#!/usr/bin/env node
'use strict'

const {readFile} = require('fs')
const {promisify} = require('util')
const {resolve: resolvePath} = require('path')
const analyzeCss = require('@projectwallace/css-analyzer')
const getStdin = require('get-stdin')
const meow = require('meow')
const stripJsonComments = require('strip-json-comments')
const parseJson = require('parse-json')
const pathExists = require('path-exists')
const updateNotifier = require('update-notifier')

const flattenStats = require('./lib/flatten-stats')
const runTests = require('./lib/test-runner')
const {
	MissingConfigException,
	MissingCssException,
	TestFailureException
} = require('./lib/exceptions')

const readFileAsync = promisify(readFile)
const cli = meow(
	`
	Usage
		$ constyble <input>
		$ <input> | constyble

	Options
		--config, -c Set path to a constyble config file (JSON)
		--help Show this help
		--version, -V Show the version number

	Examples
		$ constyble style.css
		$ constyble style.css --config /path/to/.constyblerc
		$ cat style.css | constyble
		$ curl https://example.com/style.css | constyble
`,
	{
		flags: {
			version: {
				alias: 'V'
			},
			config: {
				type: 'string',
				default: '.constyblerc'
			}
		}
	}
)

updateNotifier({pkg: cli.pkg, shouldNotifyInNpmScript: true}).notify()

// Wrap in an async fn to have async/await syntax
;(async () => {
	const configFileExists = await pathExists(resolvePath(cli.flags.config))
	const [inputFilePath] = cli.input
	const css = inputFilePath
		? (await pathExists(resolvePath(inputFilePath))) &&
		  (await readFileAsync(inputFilePath, 'utf8'))
		: await getStdin()

	if (!configFileExists && !css) {
		return cli.showHelp(0)
	}

	if (!configFileExists) {
		throw new MissingConfigException()
	}

	if (!css) {
		throw new MissingCssException()
	}

	const configFile = await readFileAsync(cli.flags.config, 'utf8')
	const config = parseJson(stripJsonComments(configFile), cli.flags.config)
	const cssStats = flattenStats(await analyzeCss(css))
	const testPassed = runTests(config, cssStats).every(result => result === true)

	if (!testPassed) {
		throw new TestFailureException()
	}
})().catch(error => {
	const {code, message} = error

	if (message) {
		console.error(message)
	}

	process.exit(code || 1)
})
