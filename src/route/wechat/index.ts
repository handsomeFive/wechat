import { Context } from "koa";
import { token } from "../../config";
import tool from "./tool";

const { getUserDataAsync, parseXLMAsync, formateData } = tool;
// const { token } = require("../../config");
// const { getUserDataAsync, parseXLMAsync, formateData F} = require("./tool");
const sha1 = require("sha1");
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
      const xmlData = await getUserDataAsync(ctx.request.req);
      const data = await parseXLMAsync(xmlData as string);
      const message = formateData(data as any);
      let text = "我正在学习当中";
      if (message.MsgType === "text") {
        if (message.Content === "大威天龙") {
          text = "世尊地藏";
        } else if (message.Content.includes("怪")) {
          text = "怪可爱得";
        }
      }
      const replyMessage = `<xml>
      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${text}]]></Content>
    </xml>`;
      ctx.response.body = replyMessage;
    }
  }
}
