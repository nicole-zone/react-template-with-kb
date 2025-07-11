import { OpenAIOutlined, PieChartOutlined } from '@ant-design/icons';

import PageAIndexPage from '@/pages/page-a';
import ChildOneIndexPage from '@/pages/page-b/ChildOneIndexPage';
import CityManagementIndexPage from '@/pages/city-management';

export interface IRoute {
  /** 页面组件 */
  element?: React.ReactNode;
  /** 菜单图标 */
  icon?: React.ReactNode;
  /** 菜单唯一标识 */
  key: string;
  /** 菜单名称 */
  name: string;
  /** 菜单权限，如果为空，则表示不进行权限校验，默认展示 */
  authKey?: string;
  /** 菜单对应页面路径 */
  path?: string;
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean;
  /** 子菜单 */
  children?: this[];
}

export const RoutesList: IRoute[] = [
  {
    name: 'PageA',
    key: 'page-a',
    // authKey: 'page-a',
    path: '/page-a',
    icon: <OpenAIOutlined />,
    element: <PageAIndexPage />,
  },
  {
    name: 'PageB',
    key: 'page-b',
    icon: <PieChartOutlined />,
    children: [
      {
        name: 'PageBChild1',
        key: 'page-b-child-1',
        path: '/page-b-child-1',
        element: <ChildOneIndexPage />,
      },
    ],
  },
  {
    name: '城市管理',
    key: 'city-management',
    path: '/city-management',
    icon: <PieChartOutlined />,
    element: <CityManagementIndexPage />,
  },
];
