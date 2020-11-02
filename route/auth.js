const {  token } = require("../config/index");
const sha1 = require('sha1');
module.exports = async function (ctx) {
  if (ctx.request) {
    const { echostr, nonce, signature, timestamp } = ctx.request.query;
    const str = [timestamp, nonce, token].sort().join("");
    if (sha1(str) === signature) {
      ctx.response.body = echostr;
    } else {
      ctx.response.body = 'error';
    }
  }
};
