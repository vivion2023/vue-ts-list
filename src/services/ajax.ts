/**
 * @Description api接收
 * */
import axios from "axios";
import { message } from "ant-design-vue";
import { getToken } from "@/utils/user-token";

const instance = axios.create({
  timeout: 10 * 1000,
});

/**
 * @description 请求拦截：统一添加 token
 * */
instance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${getToken()}`; // JWT 的固定格式
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * response 响应拦截：统一处理 errno 和 msg
 * @see https://www.axios-http.cn/docs/interceptors
 * @param errno——0代表数据正常
 * */
instance.interceptors.response.use((res) => {
  const resData = (res.data || {}) as ResType;
  const { errno, data, msg } = resData;

  if (errno !== 0) {
    //数据有问题
    if (msg) {
      message.error(msg);
    }
    throw new Error(msg);
  }
  return data as any;
});

export default instance;

/**
 * 响应数据类型，接收数据先转换为该类型
 * */
export type ResDataType = {
  [key: string]: any;
};

/**
 * 响应类型
 * @param {type}
 * @returns
 * */
export type ResType = {
  errno: number;
  data?: ResDataType;
  msg?: string;
};
