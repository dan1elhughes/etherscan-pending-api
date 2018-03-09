const pending = require('./scrapers/pending');
const transaction = require('./scrapers/transaction');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3000;

router.get('/pending', async ctx => {
	const { query } = ctx;
	const { address } = query;
	const transactions = await pending(address);
	ctx.body = transactions;
});

router.get('/transaction', async ctx => {
	const { query } = ctx;
	const { hash } = query;
	const meta = await transaction(hash);
	ctx.body = meta;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);
console.log(`Listening on ${port}`); //eslint-disable-line
