import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, Select, Tag, Space, Typography, Layout, Card, Row, Col, Divider, Avatar, Dropdown, Menu } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  StopOutlined,
  FileTextOutlined,
  CodeOutlined,
  ApiOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { App } from '../types/api';
import { appService } from '../services/appService';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AppManagement: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [form] = Form.useForm();

  // 获取应用列表
  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await appService.getAllApps();
      setApps(data);
    } catch (error) {
      console.error('Failed to fetch apps:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // 打开创建/编辑模态框
  const showModal = (app: App | null = null) => {
    setEditingApp(app);
    if (app) {
      form.setFieldsValue(app);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingApp(null);
    form.resetFields();
  };

  // 保存应用
  const handleSave = async (values: any) => {
    try {
      let updatedApp;
      if (editingApp) {
        updatedApp = await appService.updateApp(editingApp.id, values);
        setApps(apps.map(app => app.id === updatedApp.id ? updatedApp : app));
      } else {
        updatedApp = await appService.createApp(values);
        setApps([...apps, updatedApp]);
      }
      setIsModalVisible(false);
      setEditingApp(null);
      form.resetFields();
    } catch (error) {
      console.error('Failed to save app:', error);
    }
  };

  // 删除应用
  const handleDelete = async (id: string) => {
    try {
      await appService.deleteApp(id);
      setApps(apps.filter(app => app.id !== id));
    } catch (error) {
      console.error('Failed to delete app:', error);
    }
  };

  // 发布应用
  const handlePublish = async (id: string) => {
    try {
      const updatedApp = await appService.publishApp(id);
      setApps(apps.map(app => app.id === updatedApp.id ? updatedApp : app));
    } catch (error) {
      console.error('Failed to publish app:', error);
    }
  };

  // 启动应用
  const handleStart = async (id: string) => {
    try {
      await appService.startApp(id);
      // 刷新应用状态
      fetchApps();
    } catch (error) {
      console.error('Failed to start app:', error);
    }
  };

  // 停止应用
  const handleStop = async (id: string) => {
    try {
      await appService.stopApp(id);
      // 刷新应用状态
      fetchApps();
    } catch (error) {
      console.error('Failed to stop app:', error);
    }
  };

  // 应用类型标签
  const getAppTypeTag = (type: string) => {
    const typeConfig = {
      chatbot: { color: 'blue', icon: <FileTextOutlined /> },
      agent: { color: 'purple', icon: <ApiOutlined /> },
      workflow: { color: 'green', icon: <CodeOutlined /> },
    };
    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'default', icon: <FileTextOutlined /> };
    return (
      <Tag color={config.color} icon={config.icon}>
        {type}
      </Tag>
    );
  };

  // 应用状态标签
  const getAppStatusTag = (status: string) => {
    const statusConfig = {
      draft: { color: 'default', text: '草稿' },
      published: { color: 'success', text: '已发布' },
      archived: { color: 'gray', text: '已归档' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列配置
  const columns = [
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      align: 'left',
      render: (text: string, record: App) => (
        <Space>
          {getAppTypeTag(record.type)}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      align: 'center',
      render: (text: string) => getAppTypeTag(text),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (text: string) => getAppStatusTag(text),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      align: 'center',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      align: 'center',
      render: (_: any, record: App) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个应用吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
          {record.status === 'draft' && (
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => handlePublish(record.id)}>
              发布
            </Button>
          )}
          {record.status === 'published' && (
            <Button type="success" icon={<PlayCircleOutlined />} onClick={() => handleStart(record.id)}>
              启动
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ margin: '24px 16px', padding: 24, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff', fontWeight: 600 }}>应用管理</Title>
            <Text type="secondary" style={{ fontSize: 14 }}>管理所有应用的创建、编辑、发布和运行</Text>
          </div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">个人中心</Menu.Item>
                <Menu.Item key="2">设置</Menu.Item>
                <Menu.Item key="3">退出登录</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button
              type="default"
              size="large"
              style={{ height: 40, borderRadius: 6, border: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
            >
              <Avatar size="small" icon={<FileTextOutlined />} style={{ marginRight: 8 }} />
              用户设置
            </Button>
          </Dropdown>
        </div>

        <Card style={{ border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: 'none' }}>
          <Table
            columns={columns}
            dataSource={apps}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `共 ${total} 个应用`
            }}
            bordered={false}
            size="middle"
            style={{ borderRadius: 8 }}
            rowClassName={(_, index = 0) => index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
            onRow={(_, index = 0) => ({
              style: {
                cursor: 'pointer',
                transition: 'all 0.3s'
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fafafa' : '#fff';
              }
            })}
          />
        </Card>

        {/* 创建/编辑应用模态框 */}
        <Modal
          title={editingApp ? '编辑应用' : '新建应用'}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
          destroyOnClose
          maskClosable={false}
          centered
          style={{ borderRadius: 12 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              type: 'chatbot',
              status: 'draft',
              config: {},
            }}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 500 }}>应用名称</span>}
              rules={[
                { required: true, message: '请输入应用名称' },
                { min: 2, max: 50, message: '应用名称长度应在2-50个字符之间' }
              ]}
            >
              <Input
                placeholder="请输入应用名称"
                style={{ borderRadius: 6 }}
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="type"
                  label={<span style={{ fontWeight: 500 }}>应用类型</span>}
                  rules={[{ required: true, message: '请选择应用类型' }]}
                >
                  <Select
                    placeholder="请选择应用类型"
                    style={{ borderRadius: 6, width: '100%' }}
                    size="large"
                  >
                    <Option value="chatbot">Chatbot</Option>
                    <Option value="agent">Agent</Option>
                    <Option value="workflow">Workflow</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label={<span style={{ fontWeight: 500 }}>应用描述</span>}
              rules={[
                { max: 200, message: '应用描述不能超过200个字符' }
              ]}
            >
              <Input.TextArea
                placeholder="请输入应用描述"
                rows={4}
                style={{ borderRadius: 6 }}
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              name="config"
              label={<span style={{ fontWeight: 500 }}>应用配置</span>}
            >
              <Input.TextArea
                placeholder="应用配置（JSON格式）"
                rows={8}
                style={{ borderRadius: 6, fontFamily: 'monospace' }}
                getValueFromEvent={(e) => {
                  try {
                    return JSON.parse(e.target.value || '{}');
                  } catch {
                    return e.target.value;
                  }
                }}
                valuePropName="value"
                getValueProps={(value) => ({
                  value: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
                })}
                autoSize={{ minRows: 8, maxRows: 12 }}
              />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  格式示例: {`{"model":"gpt-3.5-turbo","temperature":0.7}`}
                </Text>
                <Button
                  type="text"
                  icon={<CodeOutlined />}
                  size="small"
                  onClick={() => {
                    form.setFieldValue('config', {
                      model: 'gpt-3.5-turbo',
                      temperature: 0.7,
                      max_tokens: 1000
                    });
                  }}
                >
                  示例配置
                </Button>
              </div>
            </Form.Item>

            <Divider style={{ margin: '24px 0' }} />

            <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button
                onClick={handleCancel}
                style={{ borderRadius: 6, height: 36 }}
                size="large"
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ borderRadius: 6, height: 36, boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)' }}
                size="large"
                icon={<SaveOutlined />}
              >
                {editingApp ? '保存修改' : '创建应用'}
              </Button>
            </div>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AppManagement;