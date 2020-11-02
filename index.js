const koa = require("koa");
const auth = require("./route/auth");
const Wechat = require("./utils/accessToken");

const app = new koa();
const w = new Wechat();

w.fetchAccessToken().then((res) => console.log(res));

app.use(auth);
console.log("?????");
app.listen(80);
