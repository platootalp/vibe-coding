import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, InputNumber, Select, Tag, Space, Typography, Row, Col, Layout, Card, Divider } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  PlusOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { PromptTemplate, PromptTestRequest, PromptTestResponse } from '../types/api';
import { promptService } from '../services/promptService';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const PromptManagement: React.FC = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [testResult, setTestResult] = useState<PromptTestResponse | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [form] = Form.useForm();
  const [testForm] = Form.useForm();

  // 获取提示词模板列表
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await promptService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 打开创建/编辑模态框
  const showModal = (template: PromptTemplate | null = null) => {
    setEditingTemplate(template);
    if (template) {
      form.setFieldsValue(template);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 打开测试模态框
  const showTestModal = (template: PromptTemplate) => {
    setEditingTemplate(template);
    testForm.setFieldsValue({ prompt: template.content, variables: {} });
    setIsTestModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTemplate(null);
    form.resetFields();
  };

  // 关闭测试模态框
  const handleTestCancel = () => {
    setIsTestModalVisible(false);
    setTestResult(null);
    testForm.resetFields();
  };

  // 保存提示词模板
  const handleSave = async (values: any) => {
    try {
      let updatedTemplate;
      if (editingTemplate) {
        updatedTemplate = await promptService.saveTemplate(values);
        setTemplates(templates.map(template => template.id === updatedTemplate.id ? updatedTemplate : template));
      } else {
        updatedTemplate = await promptService.saveTemplate(values);
        setTemplates([...templates, updatedTemplate]);
      }
      setIsModalVisible(false);
      setEditingTemplate(null);
      form.resetFields();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  // 删除提示词模板
  const handleDelete = async (id: string) => {
    try {
      await promptService.deleteTemplate(id);
      setTemplates(templates.filter(template => template.id !== id));
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  // 测试提示词
  const handleTest = async (values: PromptTestRequest) => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const result = await promptService.testPrompt(values);
      setTestResult(result);
    } catch (error) {
      console.error('Failed to test prompt:', error);
    } finally {
      setTestLoading(false);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '变量数量',
      dataIndex: 'variables',
      key: 'variables_count',
      render: (variables: any[]) => variables.length,
    },
    {
      title: '角色数量',
      dataIndex: 'roles',
      key: 'roles_count',
      render: (roles: any[]) => roles.length,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => tags.map(tag => <Tag key={tag}>{tag}</Tag>),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PromptTemplate) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => showTestModal(record)}>
            测试
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个提示词模板吗？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ margin: '24px 16px', padding: 24, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff', fontWeight: 600 }}>提示词管理</Title>
            <Text type="secondary" style={{ fontSize: 14 }}>创建、编辑和测试提示词模板，支持变量和角色配置</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            size="large"
            style={{ height: 40, borderRadius: 6, boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)' }}
          >
            新建模板
          </Button>
        </div>

        <Card style={{ border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: 'none' }}>
          <Table
            columns={columns}
            dataSource={templates}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `共 ${total} 个模板`
            }}
            bordered={false}
            size="middle"
            style={{ borderRadius: 8 }}
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
            onRow={(record) => ({
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

        {/* 创建/编辑提示词模板模态框 */}
        <Modal
          title={editingTemplate ? '编辑提示词模板' : '新建提示词模板'}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
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
              variables: [],
              roles: [],
              tags: [],
            }}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 500 }}>模板名称</span>}
              rules={[{ required: true, message: '请输入模板名称' }]}
            >
              <Input
                placeholder="请输入模板名称"
                style={{ borderRadius: 6 }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="content"
              label={<span style={{ fontWeight: 500 }}>提示词内容</span>}
              rules={[{ required: true, message: '请输入提示词内容' }]}
            >
              <Input.TextArea
                placeholder="请输入提示词内容"
                rows={10}
                style={{ borderRadius: 6 }}
                autoSize={{ minRows: 10, maxRows: 15 }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="variables"
                  label={<span style={{ fontWeight: 500 }}>变量配置</span>}
                  rules={[{ required: true, message: '请配置变量' }]}
                >
                  <Input.TextArea
                    placeholder="变量配置（JSON格式）"
                    rows={6}
                    style={{ borderRadius: 6, fontFamily: 'monospace' }}
                    getValueFromEvent={(e) => {
                      try {
                        return JSON.parse(e.target.value || '[]');
                      } catch {
                        return e.target.value;
                      }
                    }}
                    valuePropName="value"
                    getValueProps={(value) => ({
                      value: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
                    })}
                    autoSize={{ minRows: 6, maxRows: 10 }}
                  />
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      格式示例: [{`{"name":"name","type":"string"}`}]
                    </Text>
                    <Button
                      type="text"
                      icon={<CodeOutlined />}
                      size="small"
                      onClick={() => {
                        form.setFieldValue('variables', [
                          { "name": "name", "type": "string", "default_value": "", "description": "姓名" },
                          { "name": "age", "type": "number", "default_value": 18, "description": "年龄" }
                        ]);
                      }}
                    >
                      示例变量
                    </Button>
                  </div>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="roles"
                  label={<span style={{ fontWeight: 500 }}>角色配置</span>}
                  rules={[{ required: true, message: '请配置角色' }]}
                >
                  <Input.TextArea
                    placeholder="角色配置（JSON格式）"
                    rows={6}
                    style={{ borderRadius: 6, fontFamily: 'monospace' }}
                    getValueFromEvent={(e) => {
                      try {
                        return JSON.parse(e.target.value || '[]');
                      } catch {
                        return e.target.value;
                      }
                    }}
                    valuePropName="value"
                    getValueProps={(value) => ({
                      value: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
                    })}
                    autoSize={{ minRows: 6, maxRows: 10 }}
                  />
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      格式示例: [{`{"role":"system","content":"助手"}`}]
                    </Text>
                    <Button
                      type="text"
                      icon={<CodeOutlined />}
                      size="small"
                      onClick={() => {
                        form.setFieldValue('roles', [
                          { "role": "system", "content": "你是一个专业的助手", "enabled": true },
                          { "role": "user", "content": "你好", "enabled": true }
                        ]);
                      }}
                    >
                      示例角色
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="tags"
              label={<span style={{ fontWeight: 500 }}>标签</span>}
            >
              <Select
                mode="tags"
                placeholder="请输入标签"
                style={{ width: '100%', borderRadius: 6 }}
                size="large"
              />
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
                {editingTemplate ? '保存修改' : '创建模板'}
              </Button>
            </div>
          </Form>
        </Modal>

        {/* 测试提示词模板模态框 */}
        <Modal
          title="测试提示词"
          visible={isTestModalVisible}
          onCancel={handleTestCancel}
          footer={null}
          width={900}
          destroyOnClose
          maskClosable={false}
          centered
          style={{ borderRadius: 12 }}
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form
                form={testForm}
                layout="vertical"
                onFinish={handleTest}
              >
                <Form.Item
                  name="prompt"
                  label={<span style={{ fontWeight: 500 }}>提示词</span>}
                  rules={[{ required: true, message: '请输入提示词' }]}
                >
                  <Input.TextArea
                    placeholder="请输入提示词"
                    rows={10}
                    style={{ borderRadius: 6 }}
                    autoSize={{ minRows: 10, maxRows: 15 }}
                  />
                </Form.Item>

                <Form.Item
                  name="variables"
                  label={<span style={{ fontWeight: 500 }}>变量</span>}
                >
                  <Input.TextArea
                    placeholder="变量（JSON格式）"
                    rows={6}
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
                  />
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      格式示例: {`{"name":"张三"}`}
                    </Text>
                    <Button
                      type="text"
                      icon={<CodeOutlined />}
                      size="small"
                      onClick={() => {
                        testForm.setFieldValue('variables', { "name": "张三", "age": 25 });
                      }}
                    >
                      示例变量
                    </Button>
                  </div>
                </Form.Item>

                <Form.Item
                  name="model_parameters"
                  label={<span style={{ fontWeight: 500 }}>模型参数</span>}
                >
                  <Input.TextArea
                    placeholder="模型参数（JSON格式）"
                    rows={6}
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
                  />
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      格式示例: {`{"temperature":0.7,"max_tokens":1000}`}
                    </Text>
                    <Button
                      type="text"
                      icon={<CodeOutlined />}
                      size="small"
                      onClick={() => {
                        testForm.setFieldValue('model_parameters', { "temperature": 0.7, "max_tokens": 1000 });
                      }}
                    >
                      示例参数
                    </Button>
                  </div>
                </Form.Item>

                <div style={{ marginTop: 24, textAlign: 'right' }}>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    htmlType="submit"
                    loading={testLoading}
                    size="large"
                    style={{ borderRadius: 6, height: 36, boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)' }}
                  >
                    测试
                  </Button>
                </div>
              </Form>
            </Col>

            <Col span={12}>
              <Title level={4} style={{ margin: 0, padding: 0 }}>测试结果</Title>
              {testResult ? (
                <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                  <div>
                    <Text strong>输出：</Text>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: 16,
                      borderRadius: 8,
                      marginTop: 8,
                      minHeight: 200,
                      whiteSpace: 'pre-wrap',
                      border: '1px solid #e9ecef',
                      fontSize: 14
                    }}>
                      {testResult.output}
                    </div>
                  </div>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div style={{ backgroundColor: '#e6f7ff', padding: 12, borderRadius: 8, border: '1px solid #91d5ff' }}>
                        <Text style={{ fontSize: 12 }}>提示词Token：</Text>
                        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{testResult.prompt_tokens}</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ backgroundColor: '#e6f7ff', padding: 12, borderRadius: 8, border: '1px solid #91d5ff' }}>
                        <Text style={{ fontSize: 12 }}>生成Token：</Text>
                        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{testResult.completion_tokens}</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ backgroundColor: '#e6f7ff', padding: 12, borderRadius: 8, border: '1px solid #91d5ff' }}>
                        <Text style={{ fontSize: 12 }}>总Token：</Text>
                        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{testResult.total_tokens}</Text>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div style={{ backgroundColor: '#e6f7ff', padding: 12, borderRadius: 8, border: '1px solid #91d5ff' }}>
                        <Text style={{ fontSize: 12 }}>成本：</Text>
                        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>${testResult.cost?.toFixed(4) || '0.0000'}</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ backgroundColor: '#e6f7ff', padding: 12, borderRadius: 8, border: '1px solid #91d5ff' }}>
                        <Text style={{ fontSize: 12 }}>延迟：</Text>
                        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{testResult.latency.toFixed(2)}s</Text>
                      </div>
                    </Col>
                  </Row>
                </Space>
              ) : (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: 40,
                  borderRadius: 8,
                  textAlign: 'center',
                  color: '#6c757d',
                  border: '1px dashed #dee2e6',
                  marginTop: 16
                }}>
                  <CodeOutlined style={{ fontSize: 48, marginBottom: 16, color: '#adb5bd' }} />
                  <div>
                    点击上方测试按钮查看结果
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Modal>
      </Content>
    </Layout>
  );
};

export default PromptManagement;