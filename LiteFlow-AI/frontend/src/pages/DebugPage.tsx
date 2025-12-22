import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Card, Space, Tag, Input, Select, Timeline, Modal, Typography } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, StopOutlined, StepForwardOutlined, StepBackwardOutlined, ReloadOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { debugService } from '../services/debugService';
import { DebugSession, DebugStep, DebugLog, App } from '../types/api';
import { appService } from '../services/appService';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const DebugPage: React.FC = () => {
    // 状态管理
    const [sessions, setSessions] = useState<DebugSession[]>([]);
    const [apps, setApps] = useState<App[]>([]);
    const [selectedSession, setSelectedSession] = useState<DebugSession | null>(null);
    const [steps, setSteps] = useState<DebugStep[]>([]);
    const [logs, setLogs] = useState<DebugLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('sessions');
    const [filter, setFilter] = useState({ appId: '', status: '' });

    // 获取应用列表
    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await appService.getAllApps();
                setApps(data);
            } catch (error) {
                console.error('Failed to fetch apps:', error);
            }
        };
        fetchApps();
    }, []);

    // 获取调试会话列表
    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await debugService.getSessions(filter.appId);
            setSessions(data);
        } catch (error) {
            console.error('Failed to fetch debug sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    // 获取会话详情
    const fetchSessionDetails = async (sessionId: string) => {
        try {
            const session = await debugService.getSession(sessionId);
            setSelectedSession(session);

            // 获取步骤和日志
            const [sessionSteps, sessionLogs] = await Promise.all([
                debugService.getSessionSteps(sessionId),
                debugService.getSessionLogs(sessionId)
            ]);

            setSteps(sessionSteps);
            setLogs(sessionLogs);
        } catch (error) {
            console.error('Failed to fetch session details:', error);
        }
    };

    // 创建新会话
    const createNewSession = async (appId: string) => {
        try {
            const newSession = await debugService.createSession(appId);
            setSessions([newSession, ...sessions]);
            setSelectedSession(newSession);

            // 获取步骤
            const sessionSteps = await debugService.getSessionSteps(newSession.id);
            setSteps(sessionSteps);
            setLogs([]);
        } catch (error) {
            console.error('Failed to create debug session:', error);
        }
    };

    // 会话控制函数
    const handleSessionAction = async (sessionId: string, action: 'pause' | 'resume' | 'end') => {
        try {
            let updatedSession: DebugSession;

            switch (action) {
                case 'pause':
                    updatedSession = await debugService.pauseSession(sessionId);
                    break;
                case 'resume':
                    updatedSession = await debugService.resumeSession(sessionId);
                    break;
                case 'end':
                    updatedSession = await debugService.endSession(sessionId);
                    break;
                default:
                    return;
            }

            // 更新会话列表
            setSessions(sessions.map(session =>
                session.id === sessionId ? updatedSession : session
            ));

            // 更新当前选中的会话
            if (selectedSession?.id === sessionId) {
                setSelectedSession(updatedSession);
            }
        } catch (error) {
            console.error(`Failed to ${action} session:`, error);
        }
    };

    // 步骤控制函数
    const handleStepAction = async (stepId: string, action: 'execute' | 'skip') => {
        if (!selectedSession) return;

        try {
            let updatedStep: DebugStep;

            if (action === 'execute') {
                updatedStep = await debugService.executeStep(selectedSession.id, stepId);
            } else {
                updatedStep = await debugService.skipStep(selectedSession.id, stepId);
            }

            // 更新步骤列表
            setSteps(steps.map(step =>
                step.id === stepId ? updatedStep : step
            ));

            // 更新日志
            const sessionLogs = await debugService.getSessionLogs(selectedSession.id);
            setLogs(sessionLogs);
        } catch (error) {
            console.error(`Failed to ${action} step:`, error);
        }
    };

    // 会话列表列定义
    const sessionColumns = [
        {
            title: '会话ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text code>{text.slice(-8)}</Text>,
        },
        {
            title: '应用',
            dataIndex: 'app_id',
            key: 'app_id',
            render: (appId: string) => {
                const app = apps.find(a => a.id === appId);
                return app ? app.name : appId;
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'active') color = 'green';
                if (status === 'completed') color = 'blue';
                if (status === 'failed') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            },
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
            render: (_: any, record: DebugSession) => (
                <Space size="middle">
                    <Button type="link" onClick={() => {
                        fetchSessionDetails(record.id);
                        setActiveTab('details');
                    }}>
                        查看
                    </Button>
                    {record.status === 'active' && (
                        <Button type="link" danger onClick={() => handleSessionAction(record.id, 'end')}>
                            结束
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    // 步骤列表列定义
    const stepColumns = [
        {
            title: '步骤',
            dataIndex: 'step_number',
            key: 'step_number',
            width: 80,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'success') color = 'green';
                if (status === 'error') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: '耗时 (ms)',
            dataIndex: 'duration',
            key: 'duration',
            width: 100,
            render: (duration: number) => duration || '-',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: DebugStep) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleStepAction(record.id, 'execute')}
                    >
                        执行
                    </Button>
                    <Button
                        size="small"
                        icon={<StepForwardOutlined />}
                        onClick={() => handleStepAction(record.id, 'skip')}
                    >
                        跳过
                    </Button>
                </Space>
            ),
        },
    ];

    // 日志列表列定义
    const logColumns = [
        {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (time: string) => new Date(time).toLocaleString(),
            width: 180,
        },
        {
            title: '级别',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => {
                let color = 'default';
                if (level === 'debug') color = 'cyan';
                if (level === 'info') color = 'blue';
                if (level === 'warn') color = 'gold';
                if (level === 'error') color = 'red';
                return <Tag color={color}>{level}</Tag>;
            },
            width: 100,
        },
        {
            title: '来源',
            dataIndex: 'source',
            key: 'source',
            width: 120,
        },
        {
            title: '消息',
            dataIndex: 'message',
            key: 'message',
        },
    ];

    return (
        <div className="debug-page">
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>调试控制台</Title>
                <Space>
                    <Select
                        placeholder="选择应用"
                        style={{ width: 200 }}
                        value={filter.appId}
                        onChange={(value) => setFilter(prev => ({ ...prev, appId: value }))}
                    >
                        <Option value="">所有应用</Option>
                        {apps.map(app => (
                            <Option key={app.id} value={app.id}>{app.name}</Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="会话状态"
                        style={{ width: 150 }}
                        value={filter.status}
                        onChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
                    >
                        <Option value="">所有状态</Option>
                        <Option value="active">运行中</Option>
                        <Option value="completed">已完成</Option>
                        <Option value="failed">失败</Option>
                    </Select>
                    <Button type="primary" onClick={fetchSessions} icon={<ReloadOutlined />}>
                        刷新
                    </Button>
                    <Modal
                        title="创建调试会话"
                        open={false}
                    // 这里需要实现创建会话的模态框
                    >
                        {/* 创建会话表单 */}
                    </Modal>
                    <Button type="primary" icon={<PlusOutlined />}>
                        新建会话
                    </Button>
                </Space>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="会话列表" key="sessions">
                    <Card>
                        <Table
                            columns={sessionColumns}
                            dataSource={sessions}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="会话详情" key="details" disabled={!selectedSession}>
                    {selectedSession && (
                        <div>
                            <Card title="会话信息" style={{ marginBottom: 16 }}>
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <div>
                                        <Text strong>会话ID: </Text>
                                        <Text code>{selectedSession.id}</Text>
                                    </div>
                                    <div>
                                        <Text strong>应用: </Text>
                                        {apps.find(a => a.id === selectedSession.app_id)?.name}
                                    </div>
                                    <div>
                                        <Text strong>状态: </Text>
                                        <Tag color={selectedSession.status === 'active' ? 'green' : 'blue'}>
                                            {selectedSession.status}
                                        </Tag>
                                    </div>
                                    <div>
                                        <Text strong>创建时间: </Text>
                                        {new Date(selectedSession.created_at).toLocaleString()}
                                    </div>
                                    <div>
                                        <Space>
                                            {selectedSession.status === 'active' && (
                                                <Button type="primary" icon={<PauseCircleOutlined />} onClick={() => handleSessionAction(selectedSession.id, 'pause')}>
                                                    暂停
                                                </Button>
                                            )}
                                            {selectedSession.status === 'active' && (
                                                <Button type="primary" danger icon={<StopOutlined />} onClick={() => handleSessionAction(selectedSession.id, 'end')}>
                                                    结束
                                                </Button>
                                            )}
                                        </Space>
                                    </div>
                                </Space>
                            </Card>

                            <Tabs defaultActiveKey="steps">
                                <TabPane tab="执行步骤" key="steps">
                                    <Card>
                                        <Table
                                            columns={stepColumns}
                                            dataSource={steps}
                                            rowKey="id"
                                            pagination={false}
                                        />
                                    </Card>

                                    <Timeline style={{ marginTop: 16 }}>
                                        {steps.map(step => (
                                            <Timeline.Item
                                                key={step.id}
                                                color={step.status === 'success' ? 'green' : step.status === 'error' ? 'red' : 'blue'}
                                            >
                                                <div>
                                                    <Text strong>{step.name}</Text>
                                                    <br />
                                                    <Text type="secondary">{new Date(step.timestamp).toLocaleString()}</Text>
                                                    {step.duration > 0 && (
                                                        <Text type="secondary" style={{ marginLeft: 16 }}>
                                                            耗时: {step.duration}ms
                                                        </Text>
                                                    )}
                                                </div>
                                                {step.error && (
                                                    <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                                                        错误: {step.error}
                                                    </Text>
                                                )}
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                </TabPane>

                                <TabPane tab="日志" key="logs">
                                    <Card>
                                        <Table
                                            columns={logColumns}
                                            dataSource={logs}
                                            rowKey="id"
                                            pagination={{ pageSize: 15 }}
                                            scroll={{ y: 400 }}
                                        />
                                    </Card>
                                </TabPane>
                            </Tabs>
                        </div>
                    )}
                </TabPane>
            </Tabs>
        </div>
    );
};

export default DebugPage;
