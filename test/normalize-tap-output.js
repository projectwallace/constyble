const trimRight = require('trim-right')

module.exports = tapOutput => {
	return tapOutput
		.split('\n')
		.map(line => line.replace(/#.*/, ''))
		.map(line => trimRight(line))
		.join('\n')
}
