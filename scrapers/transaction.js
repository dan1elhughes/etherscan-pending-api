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
		).next().text().trim();

		const from = $('#overview #ContentPlaceHolder1_maintable > div').filter((_, el) =>
			$(el).text() === 'From:'
		).next().text().trim();

		const timeFirstSeen = $('#overview #ContentPlaceHolder1_maintable > div').filter((_, el) =>
			$(el).text() === 'Time FirstSeen:'
		).next().text().match(/\(([^)]+)\)/)[1];

		// Parse time string to unix timestamp
		const timestamp = moment(timeFirstSeen, 'MMM-DD-YYYY HH:mm:ss A').unix();

		return { txHash: address, token, from, params, timestamp };
	});
