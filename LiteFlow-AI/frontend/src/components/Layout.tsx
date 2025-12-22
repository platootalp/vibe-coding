import React from 'react';
import { Layout as AntLayout, Menu, Button, Typography, Space } from 'antd';
import {
  AppstoreOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  CodeOutlined,
  BarChartOutlined,
  PlusOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <AppstoreOutlined />,
      label: <Link to="/">应用管理</Link>,
    },
    {
      key: '/workflow',
      icon: <SettingOutlined />,
      label: <Link to="/workflow">工作流管理</Link>,
    },
    {
      key: '/prompt',
      icon: <FileTextOutlined />,
      label: <Link to="/prompt">提示词管理</Link>,
    },
    {
      key: '/knowledge-base',
      icon: <DatabaseOutlined />,
      label: <Link to="/knowledge-base">知识库</Link>,
    },
    {
      key: '/debug',
      icon: <CodeOutlined />,
      label: <Link to="/debug">调试</Link>,
    },
    {
      key: '/monitoring',
      icon: <BarChartOutlined />,
      label: <Link to="/monitoring">监控分析</Link>,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header className="header" style={{
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <Space>
          <CodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>LiteFlow AI</Title>
        </Space>
        <div>
          <Button type="primary" icon={<PlusOutlined />} size="large">
            新建应用
          </Button>
        </div>
      </Header>
      <AntLayout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <AntLayout style={{ padding: '24px' }}>
          <Content style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {children}
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;