import menu from "../config/menu";

const { writeFile, readFile } = require("fs");
const request = require("request-promise-native");
const { appsecret, appID } = require("../config/index");

interface AccessToken {
  access_token: string;
  expires_in: number;
}

interface WeChatError {
  errcode: number;
  errmsg: string;
}

class Wechat {
  access_token: undefined | string;
  expires_in: undefined | number;

  getAccessToken() {
    const url = ` https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    return new Promise<AccessToken>((resolve, reject) => {
      request({ method: "get", url, json: true })
        .then((res: AccessToken) => {
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
          resolve(res);
        })
        .catch((err: WeChatError) => {
          reject("something wrong with fetching access_token" + err);
        });
    });
  }
  /** 保存token **/
  saveAccessToken(accessToken: string) {
    new Promise((resolve, reject) => {
      writeFile(
        "./accessToken.txt",
        JSON.stringify(accessToken),
        (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  readAccessToken() {
    return new Promise<AccessToken>((resolve, reject) => {
      readFile("./accessToken.txt", (err: any, data: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  isValidAccessToken(accessToken: string, expiresIn: number) {
    if (!accessToken || !expiresIn) {
      return false;
    }
    return expiresIn > Date.now();
  }

  fetchAccessToken() {
    if (
      this.access_token &&
      this.expires_in &&
      this.isValidAccessToken(this.access_token, this.expires_in)
    ) {
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in,
      });
    }
    return this.readAccessToken()
      .then(async (res) => {
        if (!this.isValidAccessToken(res.access_token, res.expires_in)) {
          const data = await this.getAccessToken();
          this.saveAccessToken(data.access_token);
          return Promise.resolve(data);
        } else {
          return Promise.resolve(res);
        }
      })
      .catch(async (err) => {
        const data = await this.getAccessToken();
        this.saveAccessToken(data.access_token);
        return Promise.resolve(data);
      })
      .then((res) => {
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        return Promise.resolve({
          access_token: res.access_token,
          expires_in: res.expires_in,
        });
      });
  }
  async fetchCreatMenu() {
    const { access_token } = await this.fetchAccessToken();
    return new Promise(function (resolve, reject) {
      request({
        method: "post",
        url: ` https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`,
        json: true,
        body: menu,
      })
        .then((res: any) => {
          if (res.errcode) {
            reject(res.errmsg);
          } else {
            resolve();
          }
        })
        .catch((res: any) => {
          reject(res);
        });
    });
  }
  async fetchDeleteMenu() {
    const { access_token } = await this.fetchAccessToken();
    return new Promise(function (resolve, reject) {
      request({
        method: "get",
        url: ` https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`,
      })
        .then((res: any) => {
          if (res.errcode) {
            reject(res.errmsg);
          } else {
            resolve();
          }
        })
        .catch((res: any) => {
          reject(res);
        });
    });
  }
}
export default Wechat;
