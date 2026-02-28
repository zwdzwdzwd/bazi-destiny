/**
 * DeepSeek API 集成模块
 * 支持流式输出，用于AI解读八字
 */

const API_URL = 'https://api.deepseek.com/chat/completions';
const MODEL = 'deepseek-chat';

/**
 * 构建AI分析用的Prompt
 * @param {Object} baziData - 八字排盘结果
 * @param {Array} classics - 匹配的古籍条文
 * @returns {Array} messages数组
 */
export function buildPrompt(baziData, classics) {
  const { pillars, dayMaster, shiShen, shenSha, wuxing, daYun, zodiac } = baziData;

  const systemPrompt = `你是一位资深的八字命理分析师，拥有20年以上的命理研究经验。

你的解读风格：
1. 语气温和、鼓励，像一位睿智的心理咨询师
2. 避免宿命论，强调个人努力和选择的重要性
3. 用现代语言解释传统概念，让普通人能听懂
4. 分析要具体、有建设性，不要含糊其辞
5. 每个观点都要有命理依据

注意事项：
- 八字只是人生参考，不是决定因素
- 重点给出积极的建议和行动方向
- 涉及婚姻、事业等敏感话题时要委婉`;

  const userPrompt = `请为以下八字进行详细分析：

【基本信息】
- 四柱：${pillars.year.ganZhi} ${pillars.month.ganZhi} ${pillars.day.ganZhi} ${pillars.time.ganZhi}
- 日主：${dayMaster.gan}（${dayMaster.wuxing}）
- 生肖：${zodiac}

【十神配置】
- 年柱：${shiShen.year.gan}
- 月柱：${shiShen.month.gan}（月令）
- 日柱：日主
- 时柱：${shiShen.time.gan}

【五行分布】
- 金：${wuxing['金'].toFixed(1)}，木：${wuxing['木'].toFixed(1)}，水：${wuxing['水'].toFixed(1)}，火：${wuxing['火'].toFixed(1)}，土：${wuxing['土'].toFixed(1)}

【神煞】
${shenSha.map(s => `- ${s.name}：${s.description}`).join('\n')}

【大运起运】
- ${daYun.isForward ? '顺排' : '逆排'}
- 起运年龄：${daYun.startAge}岁

【相关古籍条文】
${classics.map((c, i) => `${i + 1}. 【${c.source}】${c.text} —— ${c.interpretation}`).join('\n')}

请从以下维度进行详细解读（每个维度200-300字）：
1. 命局概述：整体格局特点和人生基调
2. 性格分析：性格优势、需要注意的方面
3. 事业建议：适合的职业方向和发展建议
4. 财富分析：财运特点和理财建议
5. 婚姻感情：感情特质和相处之道
6. 学业运势：学习能力和提升建议
7. 健康提示：需要关注的健康问题
8. 人生建议：综合建议和鼓励

要求：语言温暖、客观、有建设性，避免宿命论。`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * 流式调用DeepSeek API
 * @param {string} apiKey - DeepSeek API Key
 * @param {Array} messages - 消息数组
 * @param {Function} onChunk - 每次收到数据时的回调
 * @param {Function} onDone - 完成时的回调
 * @param {Function} onError - 错误时的回调
 */
export async function streamChatCompletion(apiKey, messages, onChunk, onDone, onError) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // 保留最后一个可能不完整的行

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            onDone?.(fullContent);
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';

            if (content) {
              fullContent += content;
              onChunk?.(content, fullContent);
            }
          } catch (err) {
            // JSON不完整，跳过
          }
        }
      }
    }

    onDone?.(fullContent);
  } catch (error) {
    onError?.(error);
  }
}

/**
 * 非流式调用（备用）
 * @param {string} apiKey - DeepSeek API Key
 * @param {Array} messages - 消息数组
 * @returns {Promise<string>} 完整回复
 */
export async function chatCompletion(apiKey, messages) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: false,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * 验证API Key是否有效
 * @param {string} apiKey - DeepSeek API Key
 * @returns {Promise<boolean>}
 */
export async function validateApiKey(apiKey) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
