import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Tabs, Card, Table, Space, Tag, Input, Select, DatePicker, Typography, Statistic, Row, Col, Descriptions, List, Button } from 'antd';
import { BarChartOutlined, LogoutOutlined, DatabaseOutlined, ClockCircleOutlined, AlertOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { monitorService } from '../services/monitorService';
import { Metric, Trace, TraceSpan, AppUsage, LogEntry, App } from '../types/api';
import { appService } from '../services/appService';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const MonitoringPage: React.FC = () => {
  // 状态管理
  const [apps, setApps] = useState<App[]>([]);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [systemStatus, setSystemStatus] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // 筛选条件
  const [filters, setFilters] = useState({
    appId: '',
    period: '24h',
    timeRange: [moment().subtract(24, 'hours'), moment()],
    logLevel: '',
    logSource: '',
    metricName: '',
  });

  // 加载应用列表
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

  // 加载系统状态
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const status = await monitorService.getSystemStatus();
        setSystemStatus(status);
      } catch (error) {
        console.error('Failed to fetch system status:', error);
      }
    };
    fetchSystemStatus();
  }, []);

  // 页面加载时自动获取数据
  useEffect(() => {
    fetchAppUsage();
    fetchLogs();
    fetchTraces();
  }, []);

  // 获取应用使用情况
  const fetchAppUsage = async () => {
    setLoading(true);
    try {
      const data = await monitorService.getAppUsage({
        appId: filters.appId,
        period: filters.period,
        startTime: filters.timeRange[0].toISOString(),
        endTime: filters.timeRange[1].toISOString(),
      });
      setAppUsage(data);
    } catch (error) {
      console.error('Failed to fetch app usage:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取日志
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await monitorService.getLogs({
        appId: filters.appId,
        level: filters.logLevel as any,
        source: filters.logSource,
        startTime: filters.timeRange[0].toISOString(),
        endTime: filters.timeRange[1].toISOString(),
      });
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取追踪
  const fetchTraces = async () => {
    setLoading(true);
    try {
      const data = await monitorService.getTraces({
        appId: filters.appId,
        startTime: filters.timeRange[0].toISOString(),
        endTime: filters.timeRange[1].toISOString(),
      });
      setTraces(data);
    } catch (error) {
      console.error('Failed to fetch traces:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取指标
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await monitorService.getMetrics({
        name: filters.metricName,
        appId: filters.appId,
        startTime: filters.timeRange[0].toISOString(),
        endTime: filters.timeRange[1].toISOString(),
      });
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // 应用使用情况表格列定义
  const appUsageColumns = [
    {
      title: '应用',
      dataIndex: 'app_name',
      key: 'app_name',
    },
    {
      title: '请求数',
      dataIndex: 'requests_count',
      key: 'requests_count',
      render: (value: number) => <Statistic value={value} />,
    },
    {
      title: '错误数',
      dataIndex: 'errors_count',
      key: 'errors_count',
      render: (value: number) => <Statistic value={value} />,
    },
    {
      title: '平均延迟 (ms)',
      dataIndex: 'avg_latency',
      key: 'avg_latency',
      render: (value: number) => <Statistic value={value} precision={2} />,
    },
    {
      title: '总 Token',
      dataIndex: 'total_tokens',
      key: 'total_tokens',
      render: (value: number) => <Statistic value={value} />,
    },
    {
      title: '周期',
      dataIndex: 'period',
      key: 'period',
    },
  ];

  // 日志表格列定义
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

  // 追踪表格列定义
  const traceColumns = [
    {
      title: '追踪ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text code>{text.slice(-12)}</Text>,
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
        let color = status === 'success' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time: string) => new Date(time).toLocaleString(),
      width: 180,
    },
    {
      title: '耗时 (ms)',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => <Text strong>{duration}</Text>,
      width: 120,
    },
    {
      title: '跨度数',
      dataIndex: 'spans',
      key: 'spans',
      render: (spans: TraceSpan[]) => spans.length,
      width: 100,
    },
  ];

  // 格式化时间范围
  const handleTimeRangeChange = (dates: any) => {
    if (dates) {
      setFilters(prev => ({
        ...prev,
        timeRange: dates
      }));
    }
  };

  // 渲染系统状态卡片
  const renderSystemStatusCards = () => {
    if (!systemStatus) return null;

    // 计算系统状态
    const calculateSystemStatus = () => {
      const cpuUsage = systemStatus.cpu_usage || 0;
      const memoryUsage = systemStatus.memory_usage || 0;

      if (cpuUsage > 80 || memoryUsage > 80) {
        return { status: '警告', color: '#faad14' };
      } else if (cpuUsage > 90 || memoryUsage > 90) {
        return { status: '危险', color: '#cf1322' };
      } else {
        return { status: '健康', color: '#3f8600' };
      }
    };

    const systemHealth = calculateSystemStatus();

    return (
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统状态"
              value={systemHealth.status}
              valueStyle={{ color: systemHealth.color }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="内存使用率"
              value={systemStatus.memory_usage || 0}
              suffix="%"
              valueStyle={{ color: systemStatus.memory_usage > 80 ? '#faad14' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="磁盘使用率"
              value={systemStatus.disk_usage || 0}
              suffix="%"
              valueStyle={{ color: systemStatus.disk_usage > 80 ? '#faad14' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="CPU 使用率"
              value={systemStatus.cpu_usage || 0}
              suffix="%"
              valueStyle={{ color: systemStatus.cpu_usage > 80 ? '#faad14' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div className="monitoring-page">
      <Title level={2}>监控分析</Title>

      {/* 系统概览 */}
      <Card title="系统概览" style={{ marginBottom: 16 }}>
        {renderSystemStatusCards()}
      </Card>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap size="middle">
          <Select
            placeholder="选择应用"
            style={{ width: 200 }}
            value={filters.appId}
            onChange={(value) => setFilters(prev => ({ ...prev, appId: value }))}
          >
            <Option value="">所有应用</Option>
            {apps.map(app => (
              <Option key={app.id} value={app.id}>{app.name}</Option>
            ))}
          </Select>
          <RangePicker
            showTime
            value={filters.timeRange}
            onChange={handleTimeRangeChange}
            style={{ width: 300 }}
          />
          <Select
            placeholder="时间周期"
            style={{ width: 120 }}
            value={filters.period}
            onChange={(value) => setFilters(prev => ({ ...prev, period: value }))}
          >
            <Option value="1h">1小时</Option>
            <Option value="24h">24小时</Option>
            <Option value="7d">7天</Option>
            <Option value="30d">30天</Option>
          </Select>
          <Button type="primary" onClick={fetchAppUsage} icon={<ReloadOutlined />}>
            刷新数据
          </Button>
        </Space>
      </Card>

      <Tabs defaultActiveKey="dashboard">
        <TabPane tab="应用仪表盘" key="dashboard">
          <Card title="应用使用情况">
            <Table
              columns={appUsageColumns}
              dataSource={appUsage}
              rowKey="app_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="追踪" key="traces">
          <Card>
            <Table
              columns={traceColumns}
              dataSource={traces}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              onRow={(record) => ({
                onClick: () => {
                  // 展开追踪详情
                  console.log('Trace details:', record);
                },
              })}
            />
          </Card>
        </TabPane>

        <TabPane tab="日志" key="logs">
          <Card>
            <Space wrap style={{ marginBottom: 16 }}>
              <Select
                placeholder="日志级别"
                style={{ width: 120 }}
                value={filters.logLevel}
                onChange={(value) => setFilters(prev => ({ ...prev, logLevel: value }))}
              >
                <Option value="">所有级别</Option>
                <Option value="debug">Debug</Option>
                <Option value="info">Info</Option>
                <Option value="warn">Warn</Option>
                <Option value="error">Error</Option>
              </Select>
              <Search
                placeholder="搜索日志消息"
                style={{ width: 300 }}
                enterButton
                onSearch={(value) => console.log('Search logs:', value)}
              />
              <Button type="primary" onClick={fetchLogs} icon={<ReloadOutlined />}>
                刷新日志
              </Button>
            </Space>

            <Table
              columns={logColumns}
              dataSource={logs}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 15 }}
              scroll={{ y: 400 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="指标" key="metrics">
          <Card>
            <Space wrap style={{ marginBottom: 16 }}>
              <Select
                placeholder="选择指标"
                style={{ width: 200 }}
                value={filters.metricName}
                onChange={(value) => setFilters(prev => ({ ...prev, metricName: value }))}
              >
                <Option value="">所有指标</Option>
                <Option value="app_request_count">请求数</Option>
                <Option value="app_latency">延迟</Option>
                <Option value="app_token_usage">Token 使用</Option>
              </Select>
              <Button type="primary" onClick={fetchMetrics} icon={<ReloadOutlined />}>
                刷新指标
              </Button>
            </Space>

            {/* 指标图表 */}
            <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">指标图表将在此处显示</Text>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MonitoringPage;
