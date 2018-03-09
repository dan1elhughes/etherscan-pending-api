const cheerio = require('cheerio');
const fetch = require('node-fetch');

const objectify = require('../util/objectify');

const url = address => `https://etherscan.io/txsPending?a=${address}`;

module.exports = address => fetch(url(address))
	.then(res => res.text())
	.then(html => {
		const $ = cheerio.load(html);

		// pseudo jquery weirdness, can't do nested arrays in map
		// so join with delimiter and split afterwards
		const rows = $('#ContentPlaceHolder1_mainrow table tbody tr').map((i, tr) =>
			$(tr).find('td').map((e, td) => $(td).text().trim()).get().join('|')
		).get();

		const tds = rows.map(row => row.split('|'));

		const transactions = tds.map(objectify('txHash', 'lastSeen', 'gasLimit', 'gasPrice', 'from', 'to', 'value'));

		return transactions;
	});
