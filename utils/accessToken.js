const { writeFile, readFile } = require("fs");
const request = require("request-promise-native");
const { appsecret, appID } = require("../config/index");

class Wechat {
  constructor() {
    this.access_token = null;
    this.expires_in = null;
  }
  getAccessToken() {
    const url = ` https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    return new Promise((resolve, reject) => {
      request({ method: "get", url, json: true })
        .then((res) => {
          res.expires = Date.now() + (res.expires_in - 300) * 1000;
          resolve(res);
        })
        .catch((err) => {
          reject("something wrong with fetching access_token", err);
        });
    });
  }
  /** 保存token **/
  saveAccessToken(accessToken) {
    new Promise((resolve, reject) => {
      writeFile("./accessToken.txt", JSON.stringify(accessToken), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  readAccessToken() {
    new Promise((resolve, reject) => {
      readFile("./accessToken.txt", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
  isValidAccessToken(accessToken, expiresIn) {
    if (!accessToken || !expiresIn) {
      return false;
    }
    return expiresIn > Date.now();
  }
  fetchAccessToken() {
    if (
      this.access_token &&
      this.expires_in &&
      this.isValidAccessToken(this.accessToken)
    ) {
      return new Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in,
      });
    }
    return this.readAccessToken()
      .then(async (res) => {
        if (!this.isValidAccessToken(res.access_token, res.expires_in)) {
          const data = await this.getAccessToken();
          this.saveAccessToken(data);
          return new Promise.resolve(data);
        } else {
          return new Promise.resolve(res);
        }
      })
      .catch(async (err) => {
        const data = await this.getAccessToken();
        this.saveAccessToken(data);
        return new Promise.resolve(data);
      })
      .then((res) => {
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        return new Promise.resolve(data);
      });
  }
}
module.exports = Wechat;
