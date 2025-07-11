import { FC, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

import Home from '@/pages/Home';
import { PermissionType } from '@/types/permission';
import { IRoute, RoutesList } from './route';

const generateFlatRoutes = (routes: IRoute[], permissionMap?: Record<string, PermissionType> | null) => {
  // TODO: 此处为权限过滤逻辑，需要的话可以放开
  // if (!permissionMap) return [];
  return routes.reduce((acc, route) => {
    let routeElement: React.ReactElement | null = null;
    if (route.element) {
      if (!route.authKey || (route.authKey && permissionMap?.[route.authKey])) {
        routeElement = <Route key={route.key} path={route.path} element={route.element} />;
      }
    }
    routeElement && acc.push(routeElement);
    if (route.children) {
      acc.push(...generateFlatRoutes(route.children, permissionMap));
    }
    return acc;
  }, [] as React.ReactNode[]);
};

/**
 * 权限路由
 */
export const AuthRoutes: FC = () => {
  // TODO: 此处可添加权限过滤逻辑

  const permissionRoutesEL = useMemo(() => {
    return generateFlatRoutes(RoutesList);
  }, []);

  return (
    <Routes>
      {permissionRoutesEL}
      <Route path="/home" key="home" element={<Home />} />
      <Route path="/*" key="not-match" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
