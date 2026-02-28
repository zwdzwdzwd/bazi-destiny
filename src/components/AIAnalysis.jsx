import React, { useState } from 'react';
import { buildPrompt, streamChatCompletion, getAvailableProviders } from '../utils/aiApi';
import { matchClassics } from '../data/classics';

/**
 * AI解读组件
 * 支持多API：DeepSeek、OpenAI(ChatGPT)、Google Gemini
 */
export function AIAnalysis({ baziData }) {
  const [provider, setProvider] = useState('deepseek');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(true);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [classics, setClassics] = useState([]);

  const providers = getAvailableProviders();

  // 获取当前API的配置信息
  const getProviderInfo = () => {
    switch (provider) {
      case 'deepseek':
        return {
          name: 'DeepSeek',
          link: 'https://platform.deepseek.com/',
          placeholder: '输入DeepSeek API Key',
        };
      case 'openai':
        return {
          name: 'OpenAI',
          link: 'https://platform.openai.com/api-keys',
          placeholder: '输入OpenAI API Key (sk-...)',
        };
      case 'gemini':
        return {
          name: 'Google Gemini',
          link: 'https://aistudio.google.com/app/apikey',
          placeholder: '输入Gemini API Key',
        };
      case 'kimi':
        return {
          name: 'Kimi',
          link: 'https://platform.moonshot.cn/',
          placeholder: '输入Kimi API Key (sk-...)',
        };
      default:
        return { name: 'AI', link: '#', placeholder: '输入API Key' };
    }
  };

  // 匹配古籍条文
  const handleMatchClassics = () => {
    const matched = matchClassics(baziData);
    setClassics(matched);
  };

  // 开始AI分析
  const startAnalysis = async () => {
    if (!apiKey.trim()) {
      setError(`请输入${getProviderInfo().name} API Key`);
      return;
    }

    setLoading(true);
    setError(null);
    setContent('');

    // 先匹配古籍
    const matchedClassics = matchClassics(baziData);
    setClassics(matchedClassics);

    // 构建Prompt
    const messages = buildPrompt(baziData, matchedClassics);

    // 流式调用
    await streamChatCompletion(
      provider,
      apiKey,
      messages,
      (chunk, full) => {
        setContent(full);
      },
      (full) => {
        setLoading(false);
      },
      (err) => {
        setError(err.message || '请求失败，请检查API Key和网络连接');
        setLoading(false);
      }
    );
  };

  const providerInfo = getProviderInfo();

  return (
    <div className="ai-analysis">
      <h3>AI命理解读</h3>

      {/* API选择 */}
      {showKeyInput && (
        <div className="api-key-section">
          <div className="provider-select">
            <label>选择AI模型：</label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setApiKey('');
                setError(null);
              }}
            >
              {providers.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.name} {p.supportsStream ? '(支持流式)' : ''}
                </option>
              ))}
            </select>
          </div>

          <p className="api-notice">
            需要{providerInfo.name} API Key才能进行AI解读。
            <a
              href={providerInfo.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              获取API Key
            </a>
          </p>
          <div className="key-input-group">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={providerInfo.placeholder}
              className="key-input"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="hide-key-btn"
            >
              隐藏
            </button>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="action-buttons">
        <button
          onClick={handleMatchClassics}
          className="match-classics-btn"
          disabled={loading}
        >
          匹配古籍条文
        </button>
        <button
          onClick={startAnalysis}
          className="analysis-btn"
          disabled={loading || !apiKey}
        >
          {loading ? '分析中...' : `开始${providerInfo.name}解读`}
        </button>
      </div>

      {/* 错误提示 */}
      {error && <div className="error-message">{error}</div>}

      {/* 古籍条文展示 */}
      {classics.length > 0 && !content && (
        <div className="classics-section">
          <h4>匹配的古籍条文</h4>
          <div className="classics-list">
            {classics.map((c) => (
              <div key={c.id} className="classic-item">
                <div className="classic-header">
                  <span className="classic-source">【{c.source}】</span>
                  <span className="classic-category">{c.category}</span>
                </div>
                <p className="classic-text">{c.text}</p>
                <p className="classic-interpretation">{c.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI解读结果 */}
      {content && (
        <div className="analysis-result">
          <h4>{providerInfo.name}解读</h4>
          <div className="result-content">
            {content.split('\n').map((line, i) => (
              <p key={i}>{line || ' '}</p>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .ai-analysis {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          margin-top: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .ai-analysis h3 {
          color: #8b4513;
          margin-bottom: 16px;
        }

        .api-key-section {
          background: #f8f4ed;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .provider-select {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .provider-select label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .provider-select select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
        }

        .api-notice {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 10px;
        }

        .api-notice a {
          color: #8b4513;
          margin-left: 8px;
        }

        .key-input-group {
          display: flex;
          gap: 8px;
        }

        .key-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .hide-key-btn {
          padding: 10px 16px;
          background: #e8e0d0;
          border: none;
          border-radius: 6px;
          color: #666;
          cursor: pointer;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .match-classics-btn,
        .analysis-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .match-classics-btn {
          background: #f5f0e8;
          color: #8b4513;
          border: 1px solid #d4c8b0;
        }

        .match-classics-btn:hover:not(:disabled) {
          background: #ebe4d6;
        }

        .analysis-btn {
          background: #8b4513;
          color: white;
        }

        .analysis-btn:hover:not(:disabled) {
          background: #a0522d;
        }

        .analysis-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
        }

        .classics-section {
          margin-top: 20px;
        }

        .classics-section h4 {
          color: #8b4513;
          margin-bottom: 12px;
        }

        .classics-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .classic-item {
          background: #faf8f3;
          padding: 16px;
          border-radius: 8px;
          border-left: 3px solid #8b4513;
        }

        .classic-header {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }

        .classic-source {
          font-weight: 500;
          color: #8b4513;
        }

        .classic-category {
          color: #999;
          font-size: 0.85rem;
        }

        .classic-text {
          font-style: italic;
          color: #555;
          margin-bottom: 8px;
          line-height: 1.6;
        }

        .classic-interpretation {
          color: #666;
          font-size: 0.9rem;
        }

        .analysis-result {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e8e0d0;
        }

        .analysis-result h4 {
          color: #8b4513;
          margin-bottom: 12px;
        }

        .result-content {
          background: #faf8f3;
          padding: 20px;
          border-radius: 8px;
          line-height: 1.8;
          color: #333;
          white-space: pre-wrap;
        }

        .result-content p {
          margin: 0 0 8px 0;
        }
      `}</style>
    </div>
  );
}
