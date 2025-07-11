import { FC, PropsWithChildren, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, MenuProps } from 'antd';

import { IRoute, RoutesList } from '@/routes/route';
import { PermissionType } from '@/types/permission';

import classes from './layout.module.scss';

const { Sider, Content } = AntLayout;

const generateMenuItems = (
  routes: IRoute[],
  permissionMap?: Record<string, PermissionType>,
  parentPath = ''
): MenuProps['items'] => {
  const menuItems: MenuProps['items'] = [];
  routes.forEach(route => {
    if (route.hideInMenu) return;
    // TODO: 此处为权限过滤逻辑，需要的话可以放开
    // if (route.authKey && !permissionMap[route.authKey]) return;
    const currMenu = {
      key: route.key,
      icon: route.icon,
      label: route.path ? <Link to={`${parentPath}${route.path}`}>{route.name}</Link> : route.name,
      children: route.children ? generateMenuItems(route.children, permissionMap, route.path) : undefined,
    };
    // 如果当前菜单有配置子菜单，但是鉴权后没有子菜单权限，则不显示
    if (route.children?.length && !currMenu.children?.length) return;
    menuItems.push(currMenu);
  });
  return menuItems;
};

/**
 * 页面布局
 */
const Layout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const location = useLocation();

  const menuItems = useMemo(() => {
    return generateMenuItems(RoutesList);
  }, []);

  const currentActiveMenuKey = useMemo(() => {
    const path = location.pathname;
    return path?.split('/')?.[1];
  }, [location.pathname]);

  return (
    <AntLayout className={classes.layout}>
      <Sider className={classes.sider} theme="light" width={230}>
        <Menu
          theme="dark"
          mode="inline"
          color="#fff"
          className={classes.menu}
          multiple={false}
          selectedKeys={currentActiveMenuKey ? [currentActiveMenuKey] : []}
          defaultSelectedKeys={['modelManage']}
          items={menuItems}
        />
      </Sider>
      <Content className={classes.content}>{children}</Content>
    </AntLayout>
  );
};
export default Layout;
