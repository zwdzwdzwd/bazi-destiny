/**
 * 统一AI API接口
 * 支持DeepSeek、OpenAI(ChatGPT)、Google Gemini、Kimi
 */

// API提供商配置
const API_PROVIDERS = {
  deepseek: {
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
    authType: 'bearer',
    supportsStream: true,
  },
  openai: {
    name: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    authType: 'bearer',
    supportsStream: true,
  },
  gemini: {
    name: 'Google Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    model: 'gemini-1.5-flash-latest',
    authType: 'query',
    supportsStream: false, // 简化实现，先不支持流式
  },
  kimi: {
    name: 'Kimi (月之暗面)',
    url: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-32k',
    authType: 'bearer',
    supportsStream: true,
  },
};

/**
 * 获取可用的API提供商列表
 */
export function getAvailableProviders() {
  return Object.entries(API_PROVIDERS).map(([key, config]) => ({
    key,
    name: config.name,
    supportsStream: config.supportsStream,
  }));
}

/**
 * 构建通用Prompt（各API通用）
 */
export function buildPrompt(baziData, classics) {
  const { pillars, dayMaster, shiShen, shenSha, wuxing, daYun, zodiac, cangGan, nayin } = baziData;
  const currentYear = new Date().getFullYear();

  // 构建大运描述
  const daYunDescription = daYun.list.map((dy, index) => {
    const gan = dy.ganZhi.charAt(0);
    const zhi = dy.ganZhi.charAt(1);
    const endYear = dy.startYear + 9;
    const endAge = dy.startAge + 9;
    const isCurrent = currentYear >= dy.startYear && currentYear <= endYear;
    const marker = isCurrent ? ' 【当前大运】' : '';

    return `第${['一','二','三','四','五','六','七','八'][index]}步大运：${dy.ganZhi}（${dy.startYear}-${endYear}年，约${dy.startAge}-${endAge}岁）${marker}
    - 天干：${gan}，地支：${zhi}
    - 与日主关系：需分析${gan}对${dayMaster.gan}的十神关系及${zhi}对命局的影响`;
  }).join('\n\n');

  const systemPrompt = `你是一位资深的八字命理分析师，拥有20年以上的命理研究经验，尤其擅长大运流年分析和人生阶段规划。

你的解读风格：
1. 语气温和、鼓励，像一位睿智的心理咨询师
2. 避免宿命论，强调个人努力和选择的重要性
3. 用现代语言解释传统概念，让普通人能听懂
4. 分析要具体、有建设性，不要含糊其辞
5. 每个观点都要有命理依据
6. 大运分析要详细具体，每步大运都要有独特见解

大运分析专业指南：
- 分析天干地支与命局的关系（生克制化）
- 结合十神变化判断运势走向
- 指出每步大运的关键机遇和挑战
- 给出具体年龄段的人生建议
- 标注当前所在大运的特殊提示

注意事项：
- 八字只是人生参考，不是决定因素
- 重点给出积极的建议和行动方向
- 涉及婚姻、事业等敏感话题时要委婉
- 大运分析不少于800字，每步大运都要有独立分析`;

  const userPrompt = `请为以下八字进行详细分析：

【基本信息】
- 四柱：${pillars.year.ganZhi} ${pillars.month.ganZhi} ${pillars.day.ganZhi} ${pillars.time.ganZhi}
- 日主：${dayMaster.gan}（${dayMaster.wuxing}）
- 生肖：${zodiac}
- 纳音：${nayin.year}、${nayin.month}、${nayin.day}、${nayin.time}

【十神配置】
- 年柱：${shiShen.year.gan}
- 月柱：${shiShen.month.gan}（月令，为提纲）
- 日柱：日主（命主本人）
- 时柱：${shiShen.time.gan}

【藏干信息】
- 年支${pillars.year.zhi}：${cangGan.year.map(c => c.gan + '(' + c.shiShen + ')').join('、')}
- 月支${pillars.month.zhi}：${cangGan.month.map(c => c.gan + '(' + c.shiShen + ')').join('、')}
- 日支${pillars.day.zhi}：${cangGan.day.map(c => c.gan + '(' + c.shiShen + ')').join('、')}
- 时支${pillars.time.zhi}：${cangGan.time.map(c => c.gan + '(' + c.shiShen + ')').join('、')}

【五行分布】
- 金：${wuxing['金'].toFixed(1)}，木：${wuxing['木'].toFixed(1)}，水：${wuxing['水'].toFixed(1)}，火：${wuxing['火'].toFixed(1)}，土：${wuxing['土'].toFixed(1)}
- 五行旺衰分析：请根据以上数据判断喜用神

【神煞】
${shenSha.map(s => `- ${s.name}：${s.description}`).join('\n')}

【大运详解】
- 排列方式：${daYun.isForward ? '顺排（阳年男命/阴年女命）' : '逆排（阴年男命/阳年女命）'}
- 起运年龄：${daYun.startAge}岁
- 起运年份：${daYun.startYear}年

${daYunDescription}

【相关古籍条文】
${classics.map((c, i) => `${i + 1}. 【${c.source}】${c.text} —— ${c.interpretation}`).join('\n')}

请从以下维度进行详细解读：

一、命局概述（200-300字）
整体格局特点、身强身弱判断、人生基调

二、性格分析（200-300字）
性格优势、需要注意的方面、人际关系特点

三、大运详批（800-1000字，重点）
请按以下格式详细分析每步大运：

第1步大运（${daYun.list[0]?.ganZhi || ''}）：
- 年龄段特点与人生主题
- 天干对日主的作用及十神变化
- 地支与命局的刑冲合害关系
- 此运的关键机遇与注意事项
- 具体建议

第2步大运（${daYun.list[1]?.ganZhi || ''}）：
- 同上结构分析

第3步大运（${daYun.list[2]?.ganZhi || ''}）：
- 同上结构分析

第4步大运（${daYun.list[3]?.ganZhi || ''}）${daYun.list[3] && currentYear >= daYun.list[3].startYear && currentYear <= daYun.list[3].startYear + 9 ? '【当前大运，重点分析】' : ''}：
- 同上结构分析
- 当前流年(${currentYear}年)的运势提示

第5-8步大运：简要概述未来发展方向

四、事业建议（200-300字）
适合的职业方向、发展建议、事业高峰期提示

五、财富分析（200-300字）
财运特点、理财建议、求财最佳时期

六、婚姻感情（200-300字）
感情特质、适婚年龄建议、相处之道

七、健康提示（200-300字）
需要关注的健康问题、养生建议

八、综合人生建议（200-300字）
总结命局特点，给出积极的人生指导

要求：
1. 语言温暖、客观、有建设性，避免宿命论
2. 大运分析要具体到每一步，不要泛泛而谈
3. 每个观点都要有命理依据（引用十神、五行生克等）
4. 当前大运要重点分析，给出具体年份建议`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * 流式调用AI API（统一接口）
 */
export async function streamChatCompletion(provider, apiKey, messages, onChunk, onDone, onError) {
  const config = API_PROVIDERS[provider];
  if (!config) {
    onError?.(new Error(`不支持的API提供商: ${provider}`));
    return;
  }

  try {
    if (provider === 'gemini') {
      // Gemini使用非流式接口
      const result = await callGemini(apiKey, messages);
      onChunk?.(result, result);
      onDone?.(result);
      return;
    }

    // DeepSeek和OpenAI使用标准OpenAI格式
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
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
      buffer = lines.pop();

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
 * 调用Google Gemini API
 */
async function callGemini(apiKey, messages) {
  const config = API_PROVIDERS.gemini;
  const url = `${config.url}?key=${apiKey}`;

  // 转换消息格式为Gemini格式
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const userMessage = messages.find(m => m.role === 'user')?.content || '';

  const body = {
    contents: [
      {
        parts: [
          { text: systemMessage + '\n\n' + userMessage }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4000,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * 验证API Key是否有效
 */
export async function validateApiKey(provider, apiKey) {
  const config = API_PROVIDERS[provider];
  if (!config) return false;

  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`;
      const response = await fetch(url);
      return response.ok;
    }

    // DeepSeek和OpenAI使用相同的验证方式
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
