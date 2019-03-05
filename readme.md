<center>
	<h1>constyble</h1>
	<p>A CSS complexity linter, based on css-analyzer. Don't let your CSS grow beyond the thresholds that you provide.</p>
</center>

[![NPM Version](https://img.shields.io/npm/v/constyble.svg)](https://www.npmjs.com/package/constyble)
[![Build Status](https://travis-ci.org/bartveneman/constyble.svg?branch=master)](https://travis-ci.org/bartveneman/constyble)
[![Known Vulnerabilities](https://snyk.io/test/github/bartveneman/constyble/badge.svg)](https://snyk.io/test/github/bartveneman/constyble)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
![Dependencies Status](https://img.shields.io/david/bartveneman/constyble.svg)
![Dependencies Status](https://img.shields.io/david/dev/bartveneman/constyble.svg)
[![Project: Wallace](https://img.shields.io/badge/Project-Wallace-29c87d.svg)](https://www.projectwallace.com/oss)

## Installation

```sh
npm install constyble
# or
yarn add constyble
```

## Usage

We need a config with thresholds and CSS to compare it to.

```sh
# Default usage (assuming a .constyblerc file in the current directory)
$ constyble style.css

# Read from StdIn (assuming a .constyblerc file in the current directory)
$ cat style.css | constyble

# Custom config
$ constyble style.css --config my-config.json
```

The result will look like something like this:

```sh
TAP version 13
# Subtest: selectors.id.total
    ok 1 - selectors.id.total should not be larger than 0 (actual: 0)
    1..1
ok 1 - selectors.id.total # time=6.024ms

1..1
# time=15.076ms
```

Note that this example uses only 1 test (total ID selectors).

## Config file

constyble will try to fetch a `.constyblerc` file in your current directory. You
can also specify a different JSON config file with the `--config` option
([see usage](#usage)). The config JSON should look similar to this:

```json
{
	// Do not exceed 4095, otherwise IE9 will drop any subsequent rules
	"selectors.total": 4095,
	"selectors.id.total": 0,
	"values.colors.totalUnique": 2,
	"values.colors.unique": ["#fff", "#000"]
}
```

All the possible options for the config file can be found at
[@projectwallace/css-analyzer](https://github.com/projectwallace/css-analyzer#usage).
JSON comments are allowed.

## Custom reporter

By default, constyble will report in the
[TAP format](https://www.node-tap.org/tap-format/), but you can pipe the output
into something you may find prettier, like
[tap-nyan](https://www.npmjs.com/package/tap-nyan),
[tap-dot](https://github.com/scottcorgan/tap-dot) or any other
[TAP-reporter](https://github.com/substack/tape#pretty-reporters).

tap-nyan

```sh
$ constyble style.css | tap-nyan

 1   -_,------,
 0   -_|   /\_/\
 0   -^|__( ^ .^)
     -  ""  ""
  Pass!
```

## Usage in CI

If any test fails, constyble will exit with a non-zero exit code. When you run
constyble in your CI builds, this may cause the build to fail. This is exactly
what constyble was designed to do.

Example usage with package.json:

```json
{
	"name": "my-package",
	"version": "0.1.0",
	"scripts": {
		"test": "constyble compiled-styles.css"
	},
	"devDependencies": {
		"constyble": "*"
	}
}
```

## The name

constyble is a mix of the words Style and Constable. This package is like a
police officer (constable) for your styles. Previously this package was called
Gromit, but that was dropped because it's too closely related to the main
'Wallace' project that this package is part of.

## Related projects

- [CSS Analyzer](https://github.com/projectwallace/css-analyzer) - The analyzer
  that powers this module
- [Wallace CLI](https://github.com/bartveneman/wallace-cli) - CLI tool for
  @projectwallace/css-analyzer
- [CSS Analyzer Diff](https://github.com/bartveneman/css-analyzer-diff) -
  Calculates the diff between two sets of CSS analysis
- [Color Sorter](https://github.com/bartveneman/color-sorter) - Sort CSS colors
  by hue, saturation, lightness and opacity

## License

MIT © Bart Veneman
