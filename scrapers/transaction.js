const cheerio = require('cheerio');
const fetch = require('node-fetch');
const moment = require('moment');

const url = hash => `https://etherscan.io/tx/${hash}`;

module.exports = address => fetch(url(address))
	.then(res => res.text())
	.then(html => {
		const $ = cheerio.load(html);

		// All 64 char hex strings in raw data section
		const inputdata = $('#inputdata').text();
		const params = inputdata.match(/[0-9a-f]{64}/ig);

		const token = $('#overview #ContentPlaceHolder1_maintable > div').filter((_, el) =>
			$(el).text() === 'To:'
		).next().text().replace('Contract', '').trim();

		const from = $('#overview #ContentPlaceHolder1_maintable > div').filter((_, el) =>
			$(el).text() === 'From:'
		).next().text().trim();

		const timeLastSeen = $('#overview #ContentPlaceHolder1_maintable > div').filter((_, el) =>
			$(el).text() === 'Time LastSeen:'
		).next().text();

		const blockHeight = $('#overview #ContentPlaceHolder1_maintable > div').filter((_, el) =>
			$(el).text() === 'Block Height:'
		).next().text();

		let confirmations = blockHeight;

		if (blockHeight === '(Pending)') {
			confirmations = 0;
		} else {
			confirmations = parseInt(blockHeight.match(/\d+/gi)[1], 10);
		}

		let timestamp;

		if (timeLastSeen) {
			const dateString = timeLastSeen.match(/\(([^)]+)\)/)[1];
			timestamp = moment(dateString, 'MMM-DD-YYYY HH:mm:ss A').unix();
		}

		return { txHash: address, token, from, params, timestamp, confirmations };
	});
