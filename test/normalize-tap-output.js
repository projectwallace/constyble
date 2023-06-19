export function normalize(tapOutput) {
	return tapOutput
		.split('\n')
		.map(line => line.replace(/#.*/, ''))
		.map(line => line.trimEnd())
		.join('\n')
}
