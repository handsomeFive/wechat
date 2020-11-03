import { Request } from "koa";
import { parseString } from "xml2js";

export default {
  getUserDataAsync(req: Request["req"]) {
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
  },
  parseXLMAsync(xmlData: string) {
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
  },
  formateData(jsData: { xml: any }) {
    const data: any = {};
    if (jsData.xml) {
      for (let key in jsData) {
        if (Array.isArray(jsData.xml[key]) && jsData.xml[key][0]) {
          data[key] = jsData.xml[key][0];
        }
      }
    }
    return data;
  },
};
//<xml>
//    <ToUserName><![CDATA[gh_87f30cf69362]]></ToUserName> // 开发者id
//    <FromUserName><![CDATA[oTTtn5qMltY8vkr-er5PdezNnpCg]]></FromUserName> // 用户openid
//    <CreateTime>1604314629</CreateTime> // 发送得时间粗
//    <MsgType><![CDATA[text]]></MsgType> // 发送消息类型
//    <Content><![CDATA[哈哈哈]]></Content> // 发送得内容
//    <MsgId>22968264638981452</MsgId> // 消息id 三天后便会呗销毁
//</xml>
