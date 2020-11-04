import { Request, Context } from "koa";
import { parseString } from "xml2js";
import { WeChatEventType, WeChatMessageType } from "../../typeings/wechat";

async function getUserDataAsync(req: Request["req"]) {
  return new Promise((resolve, reject) => {
    let xmlData = "";
    // 分片发送流式数据
    req.on("data", (data) => {
      xmlData += data;
    });
    req.on("end", () => {
      resolve(xmlData);
    });
  });
}

async function parseXLMAsync(xmlData: string) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, { trim: true }, (err: any, data: any) => {
      if (err) {
        reject(err);
        console.error("something wrong with parseString xml2js");
      } else {
        resolve(data);
      }
    });
  });
}

function formateData(jsData: { xml: any }) {
  const data: any = {};
  if (jsData.xml) {
    for (let key in jsData.xml) {
      if (Array.isArray(jsData.xml[key]) && jsData.xml[key][0]) {
        data[key] = jsData.xml[key][0];
      }
    }
  }
  return data;
}

export async function answerMessage(ctx: Context) {
  const xmlData = await getUserDataAsync(ctx.request.req);
  const data = await parseXLMAsync(xmlData as string);
  const message: any = formateData(data as any);
  let replyMessage = `<xml>
  <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
  <CreateTime>${Date.now()}</CreateTime>`;

  if (message.MsgType === WeChatMessageType.event) {
    switch (message.Event) {
      case WeChatEventType.subscribe:
        replyMessage += `<MsgType><![CDATA[text]]></MsgType><Content><![CDATA[$欢迎您的订阅]]></Content></xml>`;
        break;
      case WeChatEventType.unsubscribe:
        replyMessage += `
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[$等待您得再次光临]]></Content>
    </xml>`;
        break;
      case WeChatEventType.CLICK:
        // EventKey
        console.log(message.EventKey);
        replyMessage = "success";
        break;
      case WeChatEventType.LOCATION:
        //  Latitude Longitude Precision
        replyMessage = "success";
        break;
      case WeChatEventType.SCAN:
        // Ticket
        replyMessage = "success";
        break;
      case WeChatEventType.VIEW:
        // EventKey 跳转的url
        replyMessage = "success";
        break;
    }
  } else {
    switch (message.MsgType) {
      case WeChatMessageType.text:
        let text = "我正在学习当中";
        if (message.MsgType === "text") {
          if (message.Content === "大威天龙") {
            text = "世尊地藏";
          } else if (message.Content.includes("怪")) {
            text = "怪可爱得";
          }
        }
        replyMessage = `<xml>
        <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
        <CreateTime>${Date.now()}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${text}]]></Content>
</xml>`;
        break;
      case WeChatMessageType.image:
        replyMessage = "success";
        break;
      case WeChatMessageType.link:
        replyMessage = "success";
        break;
      case WeChatMessageType.location:
        replyMessage = "success";
        break;
      case WeChatMessageType.shortvideo:
        replyMessage = "success";
        break;
      case WeChatMessageType.video:
        replyMessage = "success";
        break;
      case WeChatMessageType.voice:
        replyMessage = "success";
        break;
    }
  }
  console.log(replyMessage);
  ctx.response.body = replyMessage;
}
//<xml>
//    <ToUserName><![CDATA[gh_87f30cf69362]]></ToUserName> // 开发者id
//    <FromUserName><![CDATA[oTTtn5qMltY8vkr-er5PdezNnpCg]]></FromUserName> // 用户openid
//    <CreateTime>1604314629</CreateTime> // 发送得时间粗
//    <MsgType><![CDATA[text]]></MsgType> // 发送消息类型
//    <Content><![CDATA[哈哈哈]]></Content> // 发送得内容
//    <MsgId>22968264638981452</MsgId> // 消息id 三天后便会呗销毁
//</xml>
