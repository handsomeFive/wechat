export default {
  button: [
    { name: "菜单view", type: "view", url: "http://www.baidu.com" },
    { name: "菜单click", type: "click", key: "click" },
    { name: "菜单sub", sub_button: [{ name: "子菜单", type: "click",key:'sub_click'}] },
  ],
};
