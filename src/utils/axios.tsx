/* eslint-disable @typescript-eslint/no-shadow */
import axios, { AxiosInstance } from 'axios';
import { Space, message, notification, Typography } from 'antd';
import qs from 'qs';

export type AxiosErrorHandler = (status?: number, message?: string, error?: any) => void;
export type LoginRedirectUrlFn = () => string;

// 错误提示处理
const errorHandler: AxiosErrorHandler = (status?: number, message?: string) => {
  notification.error({
    message: '请求异常',
    description: (
      <Space direction="vertical" style={{ margin: '15px 0' }}>
        <div>
          status：
          <Typography.Text strong type="danger">
            {status}
          </Typography.Text>
        </div>

        {message && (
          <div>
            message：
            <Typography.Text>{message}</Typography.Text>
          </div>
        )}
      </Space>
    ),
  });
};

// 初始化 axios ，添加拦截器
export function initAxios(instance?: AxiosInstance) {
  const axiosInstance = instance ?? axios;
  axiosInstance.defaults.withCredentials = true;

  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    config => {
      config.paramsSerializer = qs.stringify;
      config.params = {
        ...config.params,
      };
      return config;
    },
    error => Promise.reject(error)
  );

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    response => {
      const res = response.data;
      if ((res.code && String(res.code) !== '200') || (typeof res.success === 'boolean' && !res.success)) {
        const msg = res?.message || res?.msg || res?.errMsg || '';
        message.error(`错误: ${msg as string}`);
        return Promise.reject(response);
      }
      return response;
    },
    error => {
      if (axios.isCancel(error)) {
        throw error;
      }
      const res = error.response;
      const status = res?.status;
      const msg = res?.data?.message || res?.data?.msg || res?.data?.errMsg || res?.data?.errorMsg || '服务器错误';
      if (status === 401) {
        // 未登录
        window.location.href =
          'https://account.zhenguanyu.com/login?service=' + encodeURIComponent(window.location.href);
      }
      setTimeout(() => {
        if (!error.processed) {
          errorHandler(status, msg, error);
        }
      });
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );
}
