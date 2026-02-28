/**
 * DeepSeek API 集成模块
 * 支持流式输出，用于AI解读八字
 */

const API_URL = 'https://api.deepseek.com/chat/completions';
const MODEL = 'deepseek-chat';

/**
 * 构建大运详细描述
 * @param {Object} daYun - 大运数据
 * @param {string} dayMasterGan - 日干
 * @returns {string} 格式化的大运描述
 */
function buildDaYunDescription(daYun, dayMasterGan) {
  const currentYear = new Date().getFullYear();

  return daYun.list.map((dy, index) => {
    const gan = dy.ganZhi.charAt(0);
    const zhi = dy.ganZhi.charAt(1);
    const endYear = dy.startYear + 9;
    const endAge = dy.startAge + 9;
    const isCurrent = currentYear >= dy.startYear && currentYear <= endYear;
    const marker = isCurrent ? ' 【当前大运】' : '';

    return `第${['一','二','三','四','五','六','七','八'][index]}步大运：${dy.ganZhi}（${dy.startYear}-${endYear}年，约${dy.startAge}-${endAge}岁）${marker}
    - 天干：${gan}，地支：${zhi}
    - 与日主关系：需分析${gan}对${dayMasterGan}的十神关系及${zhi}对命局的影响`;
  }).join('\n\n');
}

/**
 * 构建AI分析用的Prompt
 * @param {Object} baziData - 八字排盘结果
 * @param {Array} classics - 匹配的古籍条文
 * @returns {Array} messages数组
 */
export function buildPrompt(baziData, classics) {
  const { pillars, dayMaster, shiShen, shenSha, wuxing, daYun, zodiac, cangGan, nayin } = baziData;

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

  const daYunDescription = buildDaYunDescription(daYun, dayMaster.gan);

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

第4步大运（${daYun.list[3]?.ganZhi || ''}）${daYun.list[3] && new Date().getFullYear() >= daYun.list[3].startYear && new Date().getFullYear() <= daYun.list[3].startYear + 9 ? '【当前大运，重点分析】' : ''}：
- 同上结构分析
- 当前流年(${new Date().getFullYear()}年)的运势提示

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
