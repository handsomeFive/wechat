export enum WeChatMessageType {
  text = "text", // 文本消息
  image = "image", // 图片消息
  voice = "voice", // 声音消息
  video = "video", // 视频消息
  shortvideo = "shortvideo", // 短视频消息
  location = "location", // 地理位置消息
  link = "link", // 链接消息
  event = "event", // 事件消息
}

export enum WeChatEventType {
  subscribe = "subscribe", // 关注事件
  unsubscribe = "unsubscribe", // 取消关注事件
  SCAN = "SCAN", // 扫描二维码关注
  LOCATION = "LOCATION", // 上报地理位置事件
  CLICK = "CLICK", // 自定义菜单事件
  VIEW = "VIEW", // 点击菜单跳转链接时的事件推送
}
