const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let requests = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve, reject) => {
    requests.push(resolve);
    ctx.res.on('close', function(error) {
      reject(error);
    });
  });

  let message;
  try {
    message = await promise;
  } catch (e) {
    throw e;
  }
  ctx.body = message;
  next();
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message) {
    requests.forEach(function(resolve) {
      resolve(message);
    });
    requests = [];
  }
  ctx.body = "done";
  next();
});

app.use(router.routes());

module.exports = app;
