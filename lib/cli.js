#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs'
import { resolve as resolvePath } from 'path'
import { analyze } from '@projectwallace/css-analyzer'
import getStdin from 'get-stdin'
import meow from 'meow'
import JSON5 from 'json5'

import { flatten as flattenStats } from './flatten-stats.js'
import { runTests } from './test-runner.js'
import {
	MissingConfigException,
	MissingCssException,
	TestFailureException
} from './exceptions.js'

// Wrap in an async fn to have async/await syntax
(async () => {
	const cli = meow(`
		Usage
			$ constyble <input>
			$ <input> | constyble

		Options
			--config Set path to a constyble config file (JSON)
			--help Show this help
			--version Show the version number

		Examples
			$ constyble style.css
			$ constyble style.css --config /path/to/.constyblerc
			$ cat style.css | constyble
			$ curl https://example.com/style.css | constyble
	`, {
		flags: {
			config: {
				type: 'string',
				default: '.constyblerc'
			}
		},
		importMeta: import.meta
	})

	try {
		const configFileExists = existsSync(cli.flags.config)
		const [inputFilePath] = cli.input
		const css = inputFilePath ? (existsSync(resolvePath(inputFilePath))) && (readFileSync(inputFilePath, 'utf8')) : await getStdin()

		if (!configFileExists && !css) {
			return cli.showHelp(0)
		}

		if (!configFileExists) {
			throw new MissingConfigException()
		}

		if (!css) {
			throw new MissingCssException()
		}

		const configFile = readFileSync(cli.flags.config, 'utf8')
		const config = JSON5.parse(configFile)
		const cssStats = flattenStats(analyze(css))
		const testPassed = runTests(config, cssStats).every(result => result === true)

		if (!testPassed) {
			throw new TestFailureException()
		}
	} catch (error) {
		const { code, message } = error

		if (message) {
			console.error(message)
		}

		process.exit(code || 1)
	}
})()