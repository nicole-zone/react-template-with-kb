import { Suspense, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Spin } from 'antd';

import { initAxios } from '@/utils/axios';
// import { httpClientInstance } from '@/hooks/useSwaggerApi';
import { AuthRoutes } from '@/routes/AuthRoutes';
import Layout from '@/components/Layout';

const App: React.FC = () => {
  useEffect(() => {
    // 设置 axios 拦截器
    initAxios(); // 全局 axios
    // initAxios(httpClientInstance.instance); // 生成的 axios 实例需要再次设置
  }, []);

  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<Spin size="large" />}>
          <AuthRoutes />
        </Suspense>
      </Layout>
    </HashRouter>
  );
};

export default App;
