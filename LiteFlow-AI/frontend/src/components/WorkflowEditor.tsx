import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  NodeResizer,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Card, Space, Tooltip, Tag, Modal, Form, Input, Select, Tabs, Row, Col } from 'antd';
import { 
  PlusOutlined, 
  SaveOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  ExportOutlined, 
  ImportOutlined,
  PlayCircleOutlined,
  StopOutlined,
  ClearOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  UndoOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { Workflow, WorkflowNode, WorkflowEdge } from '../types/api';

// 节点类型定义
interface CustomNodeProps {
  data: any;
  type: string;
}

// 自定义节点组件
const CustomNode: React.FC<CustomNodeProps> = ({ data, type }) => {
  const nodeColors: Record<string, string> = {
    start: '#52c41a',
    end: '#ff4d4f',
    llm: '#1890ff',
    prompt: '#722ed1',
    knowledge_base: '#eb2f96',
    tool: '#faad14',
    condition: '#2f54eb',
    variable: '#13c2c2',
    code: '#595959'
  };

  const nodeIcons: Record<string, string> = {
    start: '▶',
    end: '■',
    llm: '🧠',
    prompt: '💬',
    knowledge_base: '📚',
    tool: '🔧',
    condition: '❓',
    variable: '🔤',
    code: '💻'
  };

  const color = nodeColors[type] || '#1890ff';
  const icon = nodeIcons[type] || '📦';

  return (
    <Card
      size="small"
      style={{ 
        width: 180, 
        backgroundColor: color,
        color: '#fff',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
      bodyStyle={{ padding: 12 }}
    >
      <div style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>
        {icon}
      </div>
      <div style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>
        {data.label || type}
      </div>
      {data.description && (
        <div style={{ fontSize: 12, opacity: 0.9, textAlign: 'center' }}>
          {data.description}
        </div>
      )}
      <Tag style={{ marginTop: 8 }} color="rgba(255, 255, 255, 0.3)">
        {type}
      </Tag>
    </Card>
  );
};

// 节点类型映射
const nodeTypes: NodeTypes = {
  start: CustomNode,
  end: CustomNode,
  llm: CustomNode,
  prompt: CustomNode,
  knowledge_base: CustomNode,
  tool: CustomNode,
  condition: CustomNode,
  variable: CustomNode,
  code: CustomNode
};

// 节点配置类型
interface NodeConfig {
  type: string;
  label: string;
  description: string;
  color: string;
}

interface WorkflowEditorProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  onRun?: (workflow: Workflow) => void;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ workflow, onSave, onRun }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [isNodeModalVisible, setIsNodeModalVisible] = useState(false);
  const [isEdgeModalVisible, setIsEdgeModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null);
  const [form] = Form.useForm();
  const [currentPosition, setCurrentPosition] = useState({ x: 100, y: 100 });
  const [history, setHistory] = useState<Array<{ nodes: Node[], edges: Edge[] }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 可用节点类型
  const nodeConfigs: NodeConfig[] = [
    { type: 'start', label: '开始', description: '工作流起始节点', color: '#52c41a' },
    { type: 'end', label: '结束', description: '工作流结束节点', color: '#ff4d4f' },
    { type: 'llm', label: '大模型', description: '调用大语言模型', color: '#1890ff' },
    { type: 'prompt', label: '提示词', description: '使用提示词模板', color: '#722ed1' },
    { type: 'knowledge_base', label: '知识库', description: '查询知识库', color: '#eb2f96' },
    { type: 'tool', label: '工具', description: '调用外部工具', color: '#faad14' },
    { type: 'condition', label: '条件', description: '条件判断', color: '#2f54eb' },
    { type: 'variable', label: '变量', description: '变量赋值', color: '#13c2c2' },
    { type: 'code', label: '代码', description: '执行代码', color: '#595959' }
  ];

  // 添加历史记录
  const addToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes, edges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, nodes, edges]);

  // 初始化工作流
  React.useEffect(() => {
    if (workflow && workflow.nodes && workflow.edges) {
      // 将工作流数据转换为React Flow节点和边
      const reactFlowNodes = workflow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: { ...node.data },
        style: {
          width: 200,
          height: 150
        },
        draggable: true,
        connectable: true
      }));

      const reactFlowEdges = workflow.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'smoothstep',
        data: { ...edge.data },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#333'
        }
      }));

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
      addToHistory();
    } else {
      // 创建默认节点
      const defaultNodes: Node[] = [
        {
          id: 'start',
          type: 'start',
          position: { x: 500, y: 50 },
          data: { label: '开始', description: '工作流起始点' },
          style: {
            width: 200,
            height: 150
          },
          draggable: true,
          connectable: true
        },
        {
          id: 'end',
          type: 'end',
          position: { x: 500, y: 300 },
          data: { label: '结束', description: '工作流结束点' },
          style: {
            width: 200,
            height: 150
          },
          draggable: true,
          connectable: true
        }
      ];
      setNodes(defaultNodes);
      setEdges([]);
      addToHistory();
    }
  }, [workflow, setNodes, setEdges, addToHistory]);

  // 连接节点
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#333'
        },
        data: {
          label: '默认连接'
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addToHistory();
    },
    [setEdges, addToHistory]
  );

  // 添加新节点
  const onAddNode = useCallback(
    (nodeType: string) => {
      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position: currentPosition,
        data: {
          label: nodeConfigs.find(nc => nc.type === nodeType)?.label || nodeType,
          description: nodeConfigs.find(nc => nc.type === nodeType)?.description || '',
        },
        style: {
          width: 200,
          height: 150
        },
        draggable: true,
        connectable: true
      };

      setNodes((nds) => [...nds, newNode]);
      addToHistory();
    },
    [currentPosition, nodeConfigs, setNodes, addToHistory]
  );

  // 删除节点
  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      addToHistory();
    },
    [setNodes, setEdges, addToHistory]
  );

  // 删除边
  const onDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      addToHistory();
    },
    [setEdges, addToHistory]
  );

  // 打开节点编辑模态框
  const onEditNode = useCallback(
    (node: Node) => {
      setEditingNode(node);
      form.setFieldsValue({
        label: node.data.label,
        description: node.data.description || '',
        type: node.type,
        data: JSON.stringify(node.data, null, 2)
      });
      setIsNodeModalVisible(true);
    },
    [form]
  );

  // 保存节点编辑
  const onSaveNode = useCallback(
    (values: any) => {
      if (!editingNode) return;

      const updatedNode: Node = {
        ...editingNode,
        data: {
          ...editingNode.data,
          label: values.label,
          description: values.description,
          ...JSON.parse(values.data)
        }
      };

      setNodes((nds) => nds.map((node) => (node.id === updatedNode.id ? updatedNode : node)));
      setIsNodeModalVisible(false);
      setEditingNode(null);
      addToHistory();
    },
    [editingNode, setNodes, addToHistory]
  );

  // 导出工作流
  const onExport = useCallback(() => {
    const exportData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        data: edge.data
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `workflow-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

  // 保存工作流
  const onSaveWorkflow = useCallback(() => {
    if (!onSave) return;

    const workflowData: Workflow = {
      id: workflow?.id || `workflow-${Date.now()}`,
      name: workflow?.name || '未命名工作流',
      description: workflow?.description || '',
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'smoothstep',
        data: edge.data
      })),
      created_at: workflow?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: workflow?.status || 'draft'
    };

    onSave(workflowData);
  }, [nodes, edges, workflow, onSave]);

  // 撤销操作
  const onUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // 重做操作
  const onRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // 清空画布
  const onClear = useCallback(() => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空画布吗？此操作不可恢复。',
      onOk: () => {
        setNodes([]);
        setEdges([]);
        addToHistory();
      }
    });
  }, [setNodes, setEdges, addToHistory]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <Card 
        size="small" 
        style={{ marginBottom: 16, flexShrink: 0 }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>工作流编辑器</span>
            <Space>
              <Tooltip title="撤销">
                <Button 
                  icon={<UndoOutlined />} 
                  onClick={onUndo} 
                  disabled={historyIndex <= 0}
                />
              </Tooltip>
              <Tooltip title="重做">
                <Button 
                  icon={<RedoOutlined />} 
                  onClick={onRedo} 
                  disabled={historyIndex >= history.length - 1}
                />
              </Tooltip>
              <Tooltip title="清空画布">
                <Button danger icon={<ClearOutlined />} onClick={onClear} />
              </Tooltip>
            </Space>
          </div>
        }
      >
        <Tabs defaultActiveKey="nodes">
          <Tabs.TabPane tab="节点" key="nodes">
            <Row gutter={[16, 16]}>
              {nodeConfigs.map((config) => (
                <Col key={config.type} xs={12} sm={8} md={6} lg={4}>
                  <Button
                    type="default"
                    block
                    style={{ height: 80 }}
                    onClick={() => onAddNode(config.type)}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>
                      {nodeConfigs.find(nc => nc.type === config.type)?.label?.charAt(0)}
                    </div>
                    <div style={{ fontSize: 12 }}>{config.label}</div>
                  </Button>
                </Col>
              ))}
            </Row>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="操作" key="actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Tooltip title="保存工作流">
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />} 
                      onClick={onSaveWorkflow} 
                      block
                      disabled={!onSave}
                    >
                      保存工作流
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Tooltip title="导出工作流">
                    <Button 
                      icon={<ExportOutlined />} 
                      onClick={onExport} 
                      block
                    >
                      导出工作流
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Tooltip title="导入工作流">
                    <Button 
                      icon={<ImportOutlined />} 
                      block
                      disabled
                    >
                      导入工作流
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Tooltip title="运行工作流">
                    <Button 
                      type="success" 
                      icon={<PlayCircleOutlined />} 
                      block
                      disabled={!onRun}
                    >
                      运行工作流
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Space>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 画布区域 */}
      <div ref={reactFlowWrapper} style={{ flex: 1, border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          snapToGrid
          snapGrid={[15, 15]}
          connectionLineStyle={{ stroke: '#333', strokeWidth: 2 }}
          connectionLineType="smoothstep"
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const config = nodeConfigs.find(nc => nc.type === node.type);
              return config?.color || '#1890ff';
            }}
            zoomable
            pannable
          />
          <Panel position="top-left">
            <div style={{ padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>工作流编辑器</h3>
              <p style={{ margin: '5px 0 0 0', fontSize: 12, color: '#666' }}>
                使用左侧节点库构建工作流
              </p>
            </div>
          </Panel>
          
          {/* 节点操作面板 */}
          {nodes.map((node) => (
            <Panel
              key={node.id}
              position={Position.TopRight}
              nodeId={node.id}
            >
              <Space>
                <Tooltip title="编辑节点">
                  <Button 
                    size="small" 
                    icon={<EditOutlined />} 
                    onClick={() => onEditNode(node)}
                  />
                </Tooltip>
                <Tooltip title="删除节点">
                  <Button 
                    size="small" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => onDeleteNode(node.id)}
                  />
                </Tooltip>
              </Space>
            </Panel>
          ))}
        </ReactFlow>
      </div>

      {/* 节点编辑模态框 */}
      <Modal
        title="编辑节点"
        visible={isNodeModalVisible}
        onOk={form.submit}
        onCancel={() => setIsNodeModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onSaveNode}
        >
          <Form.Item
            name="type"
            label="节点类型"
          >
            <Select disabled>
              {nodeConfigs.map(config => (
                <Select.Option key={config.type} value={config.type}>
                  {config.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="label"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="节点名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="节点描述"
          >
            <Input.TextArea placeholder="节点描述" rows={3} />
          </Form.Item>

          <Form.Item
            name="data"
            label="节点数据（JSON）"
            rules={[{ required: true, message: '请输入节点数据' }]}
          >
            <Input.TextArea placeholder="节点数据（JSON格式）" rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 包装器组件
const WorkflowEditorWrapper: React.FC<WorkflowEditorProps> = (props) => (
  <ReactFlowProvider>
    <WorkflowEditor {...props} />
  </ReactFlowProvider>
);

export default WorkflowEditorWrapper;
