export function MissingConfigException() {
	this.message =
		'Please provide a valid config file by creating a .constyblerc file in the current working directory or setting the path to a config file via the --config flag.\n\nDocs: https://github.com/projectwallace/constyble#config-file'
	this.code = 3
}

MissingConfigException.code = 3

export function MissingCssException() {
	this.message =
		'Please provide CSS to run tests against. No CSS found.\n\nDocs: https://github.com/projectwallace/constyble#usage'
	this.code = 2
}

MissingCssException.code = 2

export function TestFailureException() {
	this.message = ''
	this.code = 1
}

TestFailureException.code = 1

