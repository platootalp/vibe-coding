import React, { useState, useEffect } from 'react';
import {
  Table, Button, Popconfirm, Modal, Form, Input, Upload, Select,
  Tag, Space, Card, Typography, Row, Col, Divider, message, Tooltip
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  UploadOutlined,
  SearchOutlined,
  FolderOpenOutlined,
  EyeOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { KnowledgeBase, Document } from '../types/api';
import { knowledgeBaseService } from '../services/knowledgeBaseService';
import { UploadProps } from 'antd/es/upload';
import { Layout } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const KnowledgeBaseManagement: React.FC = () => {
  // 状态管理
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [editingKB, setEditingKB] = useState<KnowledgeBase | null>(null);
  const [currentKB, setCurrentKB] = useState<KnowledgeBase | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [docForm] = Form.useForm();

  // 获取知识库列表
  const fetchKnowledgeBases = async () => {
    setLoading(true);
    try {
      const data = await knowledgeBaseService.getAllKnowledgeBases();
      setKnowledgeBases(data);
    } catch (error) {
      console.error('Failed to fetch knowledge bases:', error);
      message.error('获取知识库列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取知识库中的文档
  const fetchDocuments = async (kbId: string) => {
    setDocLoading(true);
    try {
      const data = await knowledgeBaseService.getDocuments(kbId);
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      message.error('获取文档列表失败');
    } finally {
      setDocLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  // 打开创建/编辑知识库模态框
  const showModal = (kb: KnowledgeBase | null = null) => {
    setEditingKB(kb);
    if (kb) {
      form.setFieldsValue(kb);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 打开文档详情模态框
  const showDocModal = (doc: Document | null = null, kbId?: string) => {
    setEditingDoc(doc);
    if (doc) {
      docForm.setFieldsValue({ ...doc, content: doc.content.substring(0, 1000) });
    } else {
      docForm.resetFields();
    }
    setIsDocModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingKB(null);
    form.resetFields();
  };

  // 关闭文档模态框
  const handleDocCancel = () => {
    setIsDocModalVisible(false);
    setEditingDoc(null);
    docForm.resetFields();
  };

  // 保存知识库
  const handleSave = async (values: any) => {
    try {
      let updatedKB;
      if (editingKB) {
        updatedKB = await knowledgeBaseService.updateKnowledgeBase(editingKB.id, values);
        setKnowledgeBases(knowledgeBases.map(kb => kb.id === updatedKB.id ? updatedKB : kb));
      } else {
        updatedKB = await knowledgeBaseService.createKnowledgeBase(values);
        setKnowledgeBases([...knowledgeBases, updatedKB]);
      }
      setIsModalVisible(false);
      setEditingKB(null);
      form.resetFields();
      message.success(editingKB ? '更新成功' : '创建成功');
    } catch (error) {
      console.error('Failed to save knowledge base:', error);
      message.error('保存失败');
    }
  };

  // 删除知识库
  const handleDelete = async (id: string) => {
    try {
      await knowledgeBaseService.deleteKnowledgeBase(id);
      setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== id));
      if (currentKB?.id === id) {
        setCurrentKB(null);
        setDocuments([]);
      }
      message.success('删除成功');
    } catch (error) {
      console.error('Failed to delete knowledge base:', error);
      message.error('删除失败');
    }
  };

  // 选择知识库
  const handleKBSelect = (kb: KnowledgeBase) => {
    setCurrentKB(kb);
    fetchDocuments(kb.id);
    setSearchResults([]);
  };

  // 搜索知识库
  const handleSearch = async () => {
    if (!currentKB || !searchQuery) return;

    try {
      const results = await knowledgeBaseService.searchKnowledgeBase(currentKB.id, searchQuery);
      setSearchResults(results);
      message.success(`找到 ${results.length} 个相关结果`);
    } catch (error) {
      console.error('Search failed:', error);
      message.error('搜索失败');
    }
  };

  // 上传文档
  const handleUpload = async (file: File) => {
    if (!currentKB) {
      message.error('请先选择一个知识库');
      return false;
    }

    try {
      const document = await knowledgeBaseService.uploadDocument(currentKB.id, file);
      setDocuments([...documents, document]);
      message.success('文档上传成功');
      return false; // 阻止自动上传
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('上传失败');
      return false;
    }
  };

  // 删除文档
  const handleDeleteDocument = async (docId: string) => {
    if (!currentKB) return;

    try {
      await knowledgeBaseService.deleteDocument(currentKB.id, docId);
      setDocuments(documents.filter(doc => doc.id !== docId));
      message.success('文档删除成功');
    } catch (error) {
      console.error('Failed to delete document:', error);
      message.error('删除失败');
    }
  };

  // 知识库表格列
  const kbColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: KnowledgeBase) => (
        <Text strong>{text}</Text>
      ),
    },
    {
      title: '文档数量',
      dataIndex: 'document_count',
      key: 'document_count',
      render: (count: number) => (
        <Tag color={count > 0 ? 'green' : 'default'}>{count}</Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      render: (_: any, record: KnowledgeBase) => (
        <Space size="middle">
          <Tooltip title="查看文档">
            <Button
              type="primary"
              icon={<FolderOpenOutlined />}
              onClick={() => handleKBSelect(record)}
            >
              文档
            </Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="default" icon={<EditOutlined />} onClick={() => showModal(record)}>
              编辑
            </Button>
          </Tooltip>
          <Popconfirm
            title="确定要删除这个知识库吗？"
            onConfirm={() => handleDelete(record.id)}
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

  // 文档表格列
  const docColumns = [
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Document) => (
        <Text strong>{text}</Text>
      ),
    },
    {
      title: '内容预览',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }}>{text.substring(0, 100)}...</Text>
      ),
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
      render: (_: any, record: Document) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button type="primary" icon={<EyeOutlined />} onClick={() => showDocModal(record)}>
              查看
            </Button>
          </Tooltip>
          <Popconfirm
            title="确定要删除这个文档吗？"
            onConfirm={() => handleDeleteDocument(record.id)}
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

  // 上传配置
  const uploadProps: UploadProps = {
    beforeUpload: handleUpload,
    showUploadList: false,
    multiple: false,
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>知识库管理</Title>
            <Text type="secondary">管理您的知识库和文档</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>+ 新建知识库</Button>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={10}>
            <Card
              title="知识库列表"
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}
            >
              <Table
                columns={kbColumns}
                dataSource={knowledgeBases}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 个知识库`,
                  pageSizeOptions: ['10', '20', '50']
                }}
                bordered={false}
                size="middle"
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
          </Col>

          <Col xs={24} lg={14}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{currentKB ? `${currentKB.name} - 文档管理` : '文档管理'}</span>
                  {currentKB && (
                    <Upload {...uploadProps}>
                      <Button type="primary" icon={<UploadOutlined />}>上传文档</Button>
                    </Upload>
                  )}
                </div>
              }
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}
            >
              {currentKB ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col flex={1}>
                      <Input
                        placeholder="搜索知识库内容..."
                        prefix={<SearchOutlined />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onPressEnter={handleSearch}
                      />
                    </Col>
                    <Col>
                      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                        搜索
                      </Button>
                    </Col>
                  </Row>

                  {searchQuery && searchResults.length > 0 && (
                    <Card title="搜索结果" size="small" style={{ marginBottom: 16 }}>
                      {searchResults.map((result, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <Text strong>{result.document_name}</Text>
                          <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
                            {result.content.substring(0, 200)}...
                          </p>
                          <Tag color="blue" style={{ marginRight: 8 }}>相似度: {result.score.toFixed(2)}</Tag>
                          <Tag color="green">文档ID: {result.document_id}</Tag>
                        </div>
                      ))}
                    </Card>
                  )}

                  <Table
                    columns={docColumns}
                    dataSource={documents}
                    rowKey="id"
                    loading={docLoading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `共 ${total} 个文档`,
                      pageSizeOptions: ['10', '20', '50']
                    }}
                    bordered={false}
                    size="middle"
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
                </Space>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: 60,
                  color: '#999',
                  border: '2px dashed #d9d9d9',
                  borderRadius: 4
                }}>
                  <FolderOpenOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <div style={{ fontSize: 16, marginBottom: 8 }}>选择一个知识库查看文档</div>
                  <div style={{ fontSize: 14 }}>从左侧选择知识库或创建新的知识库</div>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* 创建/编辑知识库模态框 */}
        <Modal
          title={editingKB ? '编辑知识库' : '新建知识库'}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
          style={{ borderRadius: 12 }}
          bodyStyle={{ padding: 24 }}
          destroyOnClose
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              description: '',
              config: {},
            }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item
              name="name"
              label="知识库名称"
              rules={[{ required: true, message: '请输入知识库名称' }]}
            >
              <Input
                placeholder="请输入知识库名称"
                size="large"
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea
                placeholder="请输入知识库描述"
                rows={4}
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Form.Item
              name="config"
              label="配置"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Input.TextArea
                  placeholder="配置（JSON格式）"
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
                  autoSize={{ minRows: 6, maxRows: 10 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    格式示例: {`{"embedding_model":"openai","similarity_threshold":0.7}`}
                  </Text>
                  <Button
                    type="text"
                    icon={<CodeOutlined />}
                    size="small"
                    onClick={() => {
                      form.setFieldValue('config', JSON.parse(JSON.stringify({ "embedding_model": "openai", "similarity_threshold": 0.7 })));
                    }}
                  >
                    示例配置
                  </Button>
                </div>
              </div>
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button onClick={handleCancel} style={{ marginRight: 8, borderRadius: 6 }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" size="large" style={{ borderRadius: 6 }}>
                {editingKB ? '保存修改' : '创建知识库'}
              </Button>
            </div>
          </Form>
        </Modal>

        {/* 文档详情模态框 */}
        <Modal
          title={editingDoc ? `${editingDoc.name} - 详情` : '文档详情'}
          visible={isDocModalVisible}
          onCancel={handleDocCancel}
          footer={null}
          width={900}
          destroyOnClose
          centered
          style={{ borderRadius: 12 }}
          bodyStyle={{ padding: 24 }}
        >
          <Form
            form={docForm}
            layout="vertical"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item
              name="name"
              label="文档名称"
            >
              <Input disabled style={{ borderRadius: 6, backgroundColor: '#fafafa' }} />
            </Form.Item>

            <Form.Item
              name="content"
              label="内容预览（前1000字符）"
            >
              <Input.TextArea
                rows={20}
                disabled
                style={{
                  fontFamily: 'monospace',
                  borderRadius: 6,
                  backgroundColor: '#fafafa',
                  lineHeight: 1.5
                }}
              />
            </Form.Item>

            <Form.Item
              name="metadata"
              label="元数据"
            >
              <Input.TextArea
                rows={6}
                disabled
                style={{
                  fontFamily: 'monospace',
                  borderRadius: 6,
                  backgroundColor: '#fafafa'
                }}
                valuePropName="value"
                getValueProps={(value) => ({
                  value: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
                })}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default KnowledgeBaseManagement;
