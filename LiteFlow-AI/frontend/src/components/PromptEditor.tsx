import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Space, Button, Tooltip, Input, Tag, Alert, Modal } from 'antd';
import {
  CodeOutlined,
  EyeOutlined,
  InsertRowBelowOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HighlightOutlined
} from '@ant-design/icons';
import { PromptTemplate } from '../types/api';

const { TabPane } = Tabs;
const { TextArea } = Input;

interface PromptEditorProps {
  value: PromptTemplate;
  onChange: (value: PromptTemplate) => void;
  onSave?: () => void;
  onTest?: () => void;
}

interface Variable {
  name: string;
  description: string;
  defaultValue?: string;
  type: 'string' | 'number' | 'boolean' | 'object';
}

const PromptEditor: React.FC<PromptEditorProps> = ({ value, onChange, onSave, onTest }) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [variables, setVariables] = useState<Variable[]>(value.variables || []);
  const [currentVariable, setCurrentVariable] = useState<Variable>({
    name: '',
    description: '',
    defaultValue: '',
    type: 'string'
  });
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [editingVariableIndex, setEditingVariableIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 检查提示词中的变量引用
  const validatePrompt = () => {
    const foundErrors: string[] = [];
    const content = value.content || '';

    // 查找所有变量引用 {{variableName}}
    const variableReferences = content.match(/\{\{([^{}]+)\}\}/g) || [];
    const referencedVariables = new Set(
      variableReferences.map(ref => ref.replace(/\{\{([^{}]+)\}\}/, '$1').trim())
    );

    // 查找所有定义的变量
    const definedVariables = new Set(variables.map(variable => variable.name));

    // 检查未定义的变量引用
    referencedVariables.forEach(varName => {
      if (!definedVariables.has(varName)) {
        foundErrors.push(`引用了未定义的变量: {{${varName}}}`);
      }
    });

    // 检查未使用的变量定义
    variables.forEach(variable => {
      if (!referencedVariables.has(variable.name)) {
        foundErrors.push(`定义了未使用的变量: ${variable.name}`);
      }
    });

    setErrors(foundErrors);
    return foundErrors.length === 0;
  };

  useEffect(() => {
    validatePrompt();
  }, [value.content, variables]);

  // 插入变量到编辑器
  const insertVariable = (variableName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentValue = textarea.value;

    const newValue =
      currentValue.substring(0, startPos) +
      `{{${variableName}}} ` +
      currentValue.substring(endPos);

    onChange({
      ...value,
      content: newValue
    });

    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + variableName.length + 4, startPos + variableName.length + 4);
    }, 0);
  };

  // 处理变量添加/编辑
  const handleVariableSave = () => {
    if (!currentVariable.name.trim()) return;

    let updatedVariables: Variable[];
    if (editingVariableIndex !== null) {
      updatedVariables = [...variables];
      updatedVariables[editingVariableIndex] = currentVariable;
    } else {
      updatedVariables = [...variables, currentVariable];
    }

    setVariables(updatedVariables);
    onChange({
      ...value,
      variables: updatedVariables
    });

    setShowVariableModal(false);
    setCurrentVariable({
      name: '',
      description: '',
      defaultValue: '',
      type: 'string'
    });
    setEditingVariableIndex(null);
  };

  // 编辑变量
  const editVariable = (index: number) => {
    const variable = variables[index];
    setCurrentVariable(variable);
    setEditingVariableIndex(index);
    setShowVariableModal(true);
  };

  // 删除变量
  const deleteVariable = (index: number) => {
    const updatedVariables = variables.filter((_, i) => i !== index);
    setVariables(updatedVariables);
    onChange({
      ...value,
      variables: updatedVariables
    });
  };

  // 格式化提示词内容
  const formatContent = () => {
    let content = value.content || '';

    // 对变量添加语法高亮样式
    variables.forEach(variable => {
      const regex = new RegExp(`\{\{${variable.name}\}\}`, 'g');
      content = content.replace(regex, `<span class="variable-highlight">{{${variable.name}}}</span>`);
    });

    return {
      __html: content
    };
  };

  return (
    <div>
      {/* 错误提示 */}
      {errors.length > 0 && (
        <Alert
          message="提示词错误"
          description={
            <ul>
              {errors.map((error, index) => (
                <li key={index} style={{ color: '#ff4d4f' }}>{error}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 编辑器控制面板 */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>提示词编辑器</span>
            <Space>
              {onTest && (
                <Tooltip title="测试提示词">
                  <Button type="primary" icon={<EyeOutlined />} onClick={onTest}>
                    测试
                  </Button>
                </Tooltip>
              )}
              {onSave && (
                <Tooltip title="保存提示词">
                  <Button type="default" icon={<CodeOutlined />} onClick={onSave}>
                    保存
                  </Button>
                </Tooltip>
              )}
            </Space>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="编辑器" key="editor">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Tooltip title="插入变量">
                  <Button
                    icon={<InsertRowBelowOutlined />}
                    onClick={() => {
                      setEditingVariableIndex(null);
                      setShowVariableModal(true);
                    }}
                  >
                    插入变量
                  </Button>
                </Tooltip>
                <Tooltip title="语法高亮">
                  <Button icon={<HighlightOutlined />} disabled>
                    语法高亮
                  </Button>
                </Tooltip>
              </Space>
            </div>

            <TextArea
              ref={textareaRef}
              value={value.content}
              onChange={(e) => onChange({ ...value, content: e.target.value })}
              placeholder="输入你的提示词内容，可以使用变量 {{variableName}}"
              rows={20}
              style={{
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: 14,
                lineHeight: 1.5
              }}
            />
          </TabPane>

          <TabPane tab="变量管理" key="variables">
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<InsertRowBelowOutlined />}
                onClick={() => {
                  setEditingVariableIndex(null);
                  setShowVariableModal(true);
                }}
              >
                添加变量
              </Button>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {variables.map((variable, index) => (
                <Card key={index} size="small" bordered>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <Tag color="blue">{variable.type}</Tag>
                        <strong style={{ marginLeft: 8 }}>{{{variable.name}}}</strong>
                      </div>
                      <div style={{ color: '#666', marginBottom: 8 }}>{variable.description}</div>
                      {variable.defaultValue && (
                        <div style={{ fontSize: 12, color: '#999' }}>
                          默认值: {variable.defaultValue}
                        </div>
                      )}
                    </div>
                    <Space>
                      <Button
                        type="link"
                        onClick={() => insertVariable(variable.name)}
                      >
                        插入
                      </Button>
                      <Button
                        type="link"
                        onClick={() => editVariable(index)}
                      >
                        编辑
                      </Button>
                      <Button
                        type="link"
                        danger
                        onClick={() => deleteVariable(index)}
                      >
                        删除
                      </Button>
                    </Space>
                  </div>
                </Card>
              ))}

              {variables.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                  <InsertRowBelowOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <div>还没有定义变量</div>
                  <div style={{ marginTop: 8 }}>点击上方添加变量按钮开始</div>
                </div>
              )}
            </div>
          </TabPane>

          <TabPane tab="预览" key="preview">
            <div style={{
              padding: 16,
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              backgroundColor: '#fafafa',
              minHeight: 400,
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              <div dangerouslySetInnerHTML={formatContent()} />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 变量编辑模态框 */}
      <Modal
        title={editingVariableIndex === null ? '添加变量' : '编辑变量'}
        visible={showVariableModal}
        onOk={handleVariableSave}
        onCancel={() => setShowVariableModal(false)}
        okText="保存"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            变量名称
          </label>
          <Input
            value={currentVariable.name}
            onChange={(e) => setCurrentVariable({ ...currentVariable, name: e.target.value })}
            placeholder="变量名（只能包含字母、数字和下划线）"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            描述
          </label>
          <Input
            value={currentVariable.description}
            onChange={(e) => setCurrentVariable({ ...currentVariable, description: e.target.value })}
            placeholder="变量描述"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            类型
          </label>
          <select
            value={currentVariable.type}
            onChange={(e) => setCurrentVariable({ ...currentVariable, type: e.target.value as any })}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}
          >
            <option value="string">字符串</option>
            <option value="number">数字</option>
            <option value="boolean">布尔值</option>
            <option value="object">对象</option>
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            默认值（可选）
          </label>
          <Input
            value={currentVariable.defaultValue || ''}
            onChange={(e) => setCurrentVariable({ ...currentVariable, defaultValue: e.target.value })}
            placeholder="默认值"
          />
        </div>
      </Modal>


    </div>
  );
};

export default PromptEditor;
