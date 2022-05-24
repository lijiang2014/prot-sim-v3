import { MockMethod } from "vite-plugin-mock";
export default [
  {
    url: "/api/login", //匹配到指定url 
    method: "post",        //请求类型
    timeout: 500,
    response: () => {
      return {
        code: 0,
        message: "ok",
        data: {          //需要返回的参数
          "token": /[a-zA-Z0-9]{10}/,
        },
      };
    },
  },
] as MockMethod[];
