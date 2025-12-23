import React, { useState, useEffect } from 'react';
import { Card, Button, Tabs, Input, Space, Table, Modal, Form, message, Tooltip, Layout, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, CheckCircleOutlined, DownloadOutlined, UploadOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  Connection,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { workflowService } from '../services/workflowService';
import { Workflow, WorkflowNode, WorkflowEdge } from '../types/api';

const { Content } = Layout;
const { Title, Text } = Typography;

const { TabPane } = Tabs;


// 自定义节点类型
const nodeTypes: NodeTypes = {};
const edgeTypes: EdgeTypes = {};

const WorkflowPage: React.FC = () => {
  // 状态管理
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // React Flow状态
  const [nodes, setNodes] = useNodesState<Node[]>([]);
  const [edges, setEdges] = useEdgesState<Edge[]>([]);

  // 加载工作流列表
  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const data = await workflowService.getAllWorkflows();
      setWorkflows(data);
    } catch (error) {
      message.error('获取工作流列表失败');
      console.error('Failed to fetch workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载工作流详情
  const fetchWorkflowDetails = async (id: string) => {
    setLoading(true);
    try {
      const workflow = await workflowService.getWorkflow(id);
      setSelectedWorkflow(workflow);

      // 将工作流数据转换为React Flow格式
      const reactFlowNodes = workflow.nodes.map(node => ({
        ...node,
        draggable: true,
        connectable: true,
      })) as Node[];

      const reactFlowEdges = workflow.edges.map(edge => ({
        ...edge,
        animated: true,
      })) as Edge[];

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);

      setActiveTab('editor');
    } catch (error) {
      message.error('获取工作流详情失败');
      console.error('Failed to fetch workflow details:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建工作流
  const createWorkflow = async (values: any) => {
    setLoading(true);
    try {
      const newWorkflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'> = {
        ...values,
        nodes: [],
        edges: [],
        status: 'draft',
      };

      const createdWorkflow = await workflowService.createWorkflow(newWorkflow);
      setWorkflows([...workflows, createdWorkflow]);
      message.success('工作流创建成功');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('创建工作流失败');
      console.error('Failed to create workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  // 更新工作流
  const updateWorkflow = async (values: any) => {
    if (!selectedWorkflow) return;

    setLoading(true);
    try {
      const updatedWorkflow = await workflowService.updateWorkflow(selectedWorkflow.id, values);
      setWorkflows(workflows.map(wf => wf.id === updatedWorkflow.id ? updatedWorkflow : wf));
      setSelectedWorkflow(updatedWorkflow);
      message.success('工作流更新成功');
      setIsModalVisible(false);
    } catch (error) {
      message.error('更新工作流失败');
      console.error('Failed to update workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除工作流
  const deleteWorkflow = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此工作流吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        try {
          await workflowService.deleteWorkflow(id);
          setWorkflows(workflows.filter(wf => wf.id !== id));
          if (selectedWorkflow?.id === id) {
            setSelectedWorkflow(null);
            setNodes([]);
            setEdges([]);
            setActiveTab('list');
          }
          message.success('工作流删除成功');
        } catch (error) {
          message.error('删除工作流失败');
          console.error('Failed to delete workflow:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 保存工作流
  const saveWorkflow = async () => {
    if (!selectedWorkflow) return;

    setLoading(true);
    try {
      // 将ReactFlow的nodes和edges转换为WorkflowNode和WorkflowEdge类型
      const workflowNodes: WorkflowNode[] = nodes.map(node => ({
        id: node.id,
        type: node.type || 'default',
        data: node.data,
        position: node.position,
      }));

      const workflowEdges: WorkflowEdge[] = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default',
        data: edge.data,
      }));

      const updatedWorkflow = await workflowService.updateWorkflow(selectedWorkflow.id, {
        nodes: workflowNodes,
        edges: workflowEdges,
      });
      setSelectedWorkflow(updatedWorkflow);
      setWorkflows(workflows.map(wf => wf.id === updatedWorkflow.id ? updatedWorkflow : wf));
      message.success('工作流保存成功');
    } catch (error) {
      message.error('保存工作流失败');
      console.error('Failed to save workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  // 执行工作流
  const executeWorkflow = async () => {
    if (!selectedWorkflow) return;

    setLoading(true);
    try {
      const result = await workflowService.executeWorkflow(selectedWorkflow.id);
      message.success('工作流执行成功');
      console.log('Workflow execution result:', result);
    } catch (error) {
      message.error('执行工作流失败');
      console.error('Failed to execute workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  // 发布工作流
  const publishWorkflow = async () => {
    if (!selectedWorkflow) return;

    setLoading(true);
    try {
      const updatedWorkflow = await workflowService.publishWorkflow(selectedWorkflow.id);
      setSelectedWorkflow(updatedWorkflow);
      setWorkflows(workflows.map(wf => wf.id === updatedWorkflow.id ? updatedWorkflow : wf));
      message.success('工作流发布成功');
    } catch (error) {
      message.error('发布工作流失败');
      console.error('Failed to publish workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理节点连接
  const onConnect = (connection: Connection) => {
    setEdges(eds => addEdge(connection, eds));
  };

  // 处理节点变化
  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = [...nds];
      changes.forEach((change) => {
        if (change.type === 'position' && 'id' in change) {
          const nodeIndex = updatedNodes.findIndex((node) => node.id === change.id);
          if (nodeIndex !== -1) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              position: change.position || updatedNodes[nodeIndex].position,
            };
          }
        }
      });
      return updatedNodes;
    });
  };

  // 处理边变化
  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((eds) => {
      const updatedEdges = [...eds];
      changes.forEach((change) => {
        if (change.type === 'remove' && 'id' in change) {
          return updatedEdges.filter((edge) => edge.id !== change.id);
        }
        return updatedEdges;
      });
      return updatedEdges;
    });
  };

  // 显示模态框
  const showModal = (type: 'create' | 'edit', workflow?: Workflow) => {
    setModalType(type);
    if (type === 'edit' && workflow) {
      form.setFieldsValue({
        name: workflow.name,
        description: workflow.description,
      });
      setSelectedWorkflow(workflow);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 工作流列表列定义
  const workflowColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Workflow) => (
        <Tooltip title="点击查看详情">
          <a onClick={() => fetchWorkflowDetails(record.id)}>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '节点数',
      dataIndex: 'nodes',
      key: 'node_count',
      render: (nodes: WorkflowNode[]) => nodes.length,
    },
    {
      title: '边数',
      dataIndex: 'edges',
      key: 'edge_count',
      render: (edges: WorkflowEdge[]) => edges.length,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'published' ? '#52c41a' : '#faad14' }}>
          {status === 'published' ? '已发布' : '草稿'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      align: 'center',
      render: (_: any, record: Workflow) => (
        <Space size="small" wrap style={{ width: '100%' }}>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => showModal('edit', record)}>编辑</Button>
          <Button type="link" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteWorkflow(record.id)}>删除</Button>
          <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => executeWorkflow()}>执行</Button>
          {record.status === 'draft' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => publishWorkflow()}>发布</Button>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchWorkflows();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>工作流管理</Title>
            <Text type="secondary">管理您的工作流和流程自动化</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('create')}>
            新建工作流
          </Button>
        </div>
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="工作流列表" key="list">
              <Table
                columns={workflowColumns}
                dataSource={workflows}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 个工作流`,
                  pageSizeOptions: ['10', '20', '50']
                }}
                bordered={false}
                size="middle"
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
            </TabPane>

            <TabPane tab="工作流编辑器" key="editor">
              {selectedWorkflow ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Card size="small" title="工作流信息">
                    <Space size="middle">
                      <span><strong>名称：</strong>{selectedWorkflow.name}</span>
                      <span><strong>状态：</strong>
                        <span style={{ color: selectedWorkflow.status === 'published' ? '#52c41a' : '#faad14' }}>
                          {selectedWorkflow.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </span>
                      <Button type="primary" size="small" icon={<ReloadOutlined />} onClick={() => fetchWorkflowDetails(selectedWorkflow.id)}>
                        刷新
                      </Button>
                    </Space>
                  </Card>

                  <Card size="small" title="操作面板">
                    <Space wrap size="middle">
                      <Button type="primary" icon={<PlusOutlined />}>添加节点</Button>
                      <Button icon={<DeleteOutlined />}>删除选中</Button>
                      <Button icon={<SaveOutlined />} onClick={saveWorkflow}>保存</Button>
                      <Button icon={<PlayCircleOutlined />} onClick={executeWorkflow}>执行</Button>
                      {selectedWorkflow.status === 'draft' && (
                        <Button type="primary" icon={<CheckCircleOutlined />} onClick={publishWorkflow}>发布</Button>
                      )}
                      <Button icon={<DownloadOutlined />}>导出</Button>
                      <Button icon={<UploadOutlined />}>导入</Button>
                    </Space>
                  </Card>

                  <div style={{ height: 600, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={handleNodesChange}
                      onEdgesChange={handleEdgesChange}
                      onConnect={onConnect}
                      nodeTypes={nodeTypes}
                      edgeTypes={edgeTypes}
                      fitView
                    >
                      <Background gap={12} size={1} />
                      <Controls />
                      <MiniMap />
                      <Panel position="top-left">
                        <h4>工作流编辑器</h4>
                        <p>拖拽节点创建工作流</p>
                      </Panel>
                    </ReactFlow>
                  </div>
                </Space>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
                  <p>请选择一个工作流进行编辑</p>
                </div>
              )}
            </TabPane>
          </Tabs>
        </Card>

        {/* 工作流创建/编辑模态框 */}
        <Modal
          title={modalType === 'create' ? '新建工作流' : '编辑工作流'}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={700}
          style={{ borderRadius: 12 }}
          bodyStyle={{ padding: 24 }}
          destroyOnHidden
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={modalType === 'create' ? createWorkflow : updateWorkflow}
            initialValues={{
              description: '',
            }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item
              name="name"
              label="工作流名称"
              rules={[{ required: true, message: '请输入工作流名称' }]}
            >
              <Input
                placeholder="请输入工作流名称"
                size="large"
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="工作流描述"
            >
              <Input.TextArea
                placeholder="请输入工作流描述"
                rows={4}
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8, borderRadius: 6 }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" size="large" style={{ borderRadius: 6 }} loading={loading}>
                {modalType === 'create' ? '创建' : '更新'}
              </Button>
            </div>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default WorkflowPage;
