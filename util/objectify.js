module.exports = (...keys) => values => keys
	.map((key, i) => ({ [key]: values[i] }))
	.reduce((accumulator, kvPair) => ({...accumulator, ...kvPair}), {});
