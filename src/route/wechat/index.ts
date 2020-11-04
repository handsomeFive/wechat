import { Context } from "koa";
import { token } from "../../config";
import { answerMessage } from "./tool";
import sha1 from "sha1";

export default async function (ctx: Context) {
  if (ctx.request) {
    if (ctx.request.method === "GET") {
      const { echostr, nonce, signature, timestamp } = ctx.request.query;
      const str = [timestamp, nonce, token].sort().join("");
      if (sha1(str) === signature) {
        ctx.response.body = echostr;
      } else {
        ctx.response.body = "error";
      }
    } else if (ctx.request.method === "POST") {
      answerMessage(ctx);
    }
  }
}
