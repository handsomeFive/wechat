import koa from "koa";
import bodyParse from "koa-bodyparser";
import auth from "./route/wechat/index";
import WeChat from "./utils/accessToken";

const app = new koa();
const w = new WeChat();

w.fetchAccessToken().then((res) => console.log(res));

app.use(bodyParse());

app.use(auth);
app.listen(80, function () {
  console.log("server is ready!");
});
