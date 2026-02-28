/**
 * 古籍条文数据库
 * 摘录自《三命通会》《渊海子平》《子平真诠》《滴天髓》等经典
 * 按条件标签索引，便于根据八字特征快速匹配
 */

export const classicsDatabase = [
  // ==================== 日主强弱类 ====================
  {
    id: 'dayMaster-strong-wood',
    category: '日主强弱',
    tags: ['日主五行=木', '身旺'],
    source: '《滴天髓》',
    text: '甲木参天，脱胎要火。春不容金，秋不容土。火炽乘龙，水宕骑虎。地润天和，植立千古。',
    interpretation: '木旺之人有领导才能，宜用火泄秀，忌金克。',
  },
  {
    id: 'dayMaster-weak-wood',
    category: '日主强弱',
    tags: ['日主五行=木', '身弱'],
    source: '《滴天髓》',
    text: '乙木虽柔，刲羊解牛。怀丁抱丙，跨凤乘猴。虚湿之地，骑马亦忧。藤萝系甲，可春可秋。',
    interpretation: '木弱之人需要依靠，得甲木相助则吉。',
  },
  {
    id: 'dayMaster-strong-fire',
    category: '日主强弱',
    tags: ['日主五行=火', '身旺'],
    source: '《滴天髓》',
    text: '丙火猛烈，欺霜侮雪。能煅庚金，逢辛反怯。土众成慈，水猖显节。虎马犬乡，甲来成灭。',
    interpretation: '火旺之人热情果断，但需防急躁冲动。',
  },
  {
    id: 'dayMaster-strong-earth',
    category: '日主强弱',
    tags: ['日主五行=土', '身旺'],
    source: '《滴天髓》',
    text: '戊土固重，既中且正。静翕动辟，万物司命。水润物生，火燥物病。若在艮坤，怕冲宜静。',
    interpretation: '土旺之人厚重可靠，宜水滋润，忌火太燥。',
  },
  {
    id: 'dayMaster-strong-metal',
    category: '日主强弱',
    tags: ['日主五行=金', '身旺'],
    source: '《滴天髓》',
    text: '庚金带煞，刚健为最。得水而清，得火而锐。土润则生，土干则脆。能赢甲兄，输于乙妹。',
    interpretation: '金旺之人刚毅果决，宜水火既济。',
  },
  {
    id: 'dayMaster-strong-water',
    category: '日主强弱',
    tags: ['日主五行=水', '身旺'],
    source: '《滴天髓》',
    text: '壬水通河，能泄金气。刚中之德，周流不滞。通根透癸，冲天奔地。化则有情，从则相济。',
    interpretation: '水旺之人聪明灵活，宜有制有泄。',
  },

  // ==================== 格局类 ====================
  {
    id: 'pattern-shangguan',
    category: '格局',
    tags: ['伤官格'],
    source: '《三命通会》',
    text: '伤官者，我生之物，乃五行之秀气。文人学士，多出于此。',
    interpretation: '伤官格人聪明有才华，宜从事创意、艺术类工作。',
  },
  {
    id: 'pattern-shangguan-jian',
    category: '格局',
    tags: ['伤官格', '见官'],
    source: '《渊海子平》',
    text: '伤官见官，为祸百端。',
    interpretation: '伤官与正官同见，易有是非口舌，需财星通关化解。',
  },
  {
    id: 'pattern-shangguan-pei',
    category: '格局',
    tags: ['伤官格', '配印'],
    source: '《子平真诠》',
    text: '伤官配印，贵不可言。',
    interpretation: '伤官与正印相配，才华得贵人扶持，功名显达。',
  },
  {
    id: 'pattern-cai',
    category: '格局',
    tags: ['正财格'],
    source: '《三命通会》',
    text: '正财乃妻财之位，为人踏实稳重，不善钻营。',
    interpretation: '正财格人勤劳务实，财运稳健，适合正当经营。',
  },
  {
    id: 'pattern-yin',
    category: '格局',
    tags: ['正印格'],
    source: '《渊海子平》',
    text: '印绶根轻，旺之中显达；印绶根重，旺之中受灾。',
    interpretation: '正印格人仁慈好学，但过旺则依赖心重。',
  },
  {
    id: 'pattern-bi',
    category: '格局',
    tags: ['建禄格'],
    source: '《子平真诠》',
    text: '建禄者，月令建禄，多主白手起家。',
    interpretation: '建禄格人自立自强，早年辛苦，中年后发达。',
  },

  // ==================== 神煞类 ====================
  {
    id: 'shensha-tianyi',
    category: '神煞',
    tags: ['天乙贵人'],
    source: '《三命通会》',
    text: '天乙者，乃天上之神，在紫微垣、阊阖门外，与太乙并列。',
    interpretation: '命带天乙贵人，一生得贵人扶持，逢凶化吉。',
  },
  {
    id: 'shensha-wenchang',
    category: '神煞',
    tags: ['文昌贵人'],
    source: '《三命通会》',
    text: '文昌入命，聪明过人，又主逢凶化吉。',
    interpretation: '文昌主学业功名，命带文昌利于考试升学。',
  },
  {
    id: 'shensha-taohua',
    category: '神煞',
    tags: ['桃花'],
    source: '《渊海子平》',
    text: '申子辰在酉，巳酉丑在午，亥卯未在子，寅午戌在卯。',
    interpretation: '命带桃花人缘好，但需防感情纠葛。',
  },
  {
    id: 'shensha-yima',
    category: '神煞',
    tags: ['驿马'],
    source: '《三命通会》',
    text: '驿马者，乃五行有为，待用之气，强名也。',
    interpretation: '驿马主动，命带驿马宜走动，适合远行、外派。',
  },
  {
    id: 'shensha-huagai',
    category: '神煞',
    tags: ['华盖'],
    source: '《三命通会》',
    text: '华盖者，喻如宝盖，天有此星，其形如盖，常覆乎大帝之座。',
    interpretation: '华盖主孤独，但利于学术、艺术、玄学。',
  },

  // ==================== 事业类 ====================
  {
    id: 'career-shishang',
    category: '事业',
    tags: ['食神', '伤官'],
    source: '《三命通会》',
    text: '食伤生财，宜从事技术、艺术、自由职业。',
    interpretation: '食伤旺的人适合创意、技术、演艺等行业。',
  },
  {
    id: 'career-guanyin',
    category: '事业',
    tags: ['正官', '正印'],
    source: '《渊海子平》',
    text: '官印相生，宜从政、公职、管理。',
    interpretation: '官印相生格适合公务员、管理岗位。',
  },
  {
    id: 'career-cai',
    category: '事业',
    tags: ['偏财'],
    source: '《三命通会》',
    text: '偏财旺者，宜经商、投资、风险行业。',
    interpretation: '偏财旺的人适合经商、股票、投资。',
  },

  // ==================== 婚姻类 ====================
  {
    id: 'marriage-dayzhi',
    category: '婚姻',
    tags: ['日支', '夫妻宫'],
    source: '《渊海子平》',
    text: '日支为夫妻宫，最喜安静，不喜刑冲破害。',
    interpretation: '日支稳定则婚姻稳定，受冲克则婚姻多变。',
  },
  {
    id: 'marriage-nan',
    category: '婚姻',
    tags: ['男命', '正财'],
    source: '《三命通会》',
    text: '男命以正财为妻星，正财得位，妻贤有助。',
    interpretation: '男命财星旺而得用，得贤妻之助。',
  },
  {
    id: 'marriage-nv',
    category: '婚姻',
    tags: ['女命', '正官'],
    source: '《三命通会》',
    text: '女命以正官为夫星，官星得位，夫贵有福。',
    interpretation: '女命官星旺而得用，嫁贵夫。',
  },

  // ==================== 学业类 ====================
  {
    id: 'study-yin',
    category: '学业',
    tags: ['正印', '学业'],
    source: '《渊海子平》',
    text: '印星主学业、文凭，印旺有制，学业有成。',
    interpretation: '正印旺且配合得当，利于学业深造。',
  },
  {
    id: 'study-shishang',
    category: '学业',
    tags: ['食神', '伤官', '学业'],
    source: '《子平真诠》',
    text: '食伤主聪明智慧，食伤吐秀，才华横溢。',
    interpretation: '食伤旺者聪明，但需要印星配合方能学业有成。',
  },

  // ==================== 财富类 ====================
  {
    id: 'wealth-caiwang',
    category: '财富',
    tags: ['财星旺'],
    source: '《三命通会》',
    text: '财星得用，富甲一方。财多身弱，富屋贫人。',
    interpretation: '财旺需身强方能承受，身弱财旺反为累。',
  },
  {
    id: 'wealth-caisheng',
    category: '财富',
    tags: ['食伤生财'],
    source: '《渊海子平》',
    text: '食伤生财，富贵自天来。',
    interpretation: '食伤生财格，以技艺求财，财源广进。',
  },

  // ==================== 月令类 ====================
  {
    id: 'month-spring-wood',
    category: '月令',
    tags: ['月令=寅', '月令=卯', '木旺'],
    source: '《穷通宝鉴》',
    text: '木旺于春，宜火泄秀，忌金克伐。',
    interpretation: '春木当令，喜火发荣，忌金过多。',
  },
  {
    id: 'month-summer-fire',
    category: '月令',
    tags: ['月令=巳', '月令=午', '火旺'],
    source: '《穷通宝鉴》',
    text: '火旺于夏，宜水既济，忌木过盛。',
    interpretation: '夏火当令，喜水调候，忌木多火炽。',
  },
  {
    id: 'month-autumn-metal',
    category: '月令',
    tags: ['月令=申', '月令=酉', '金旺'],
    source: '《穷通宝鉴》',
    text: '金旺于秋，宜火锻炼，忌土多埋金。',
    interpretation: '秋金当令，喜火锻造，忌土重。',
  },
  {
    id: 'month-winter-water',
    category: '月令',
    tags: ['月令=亥', '月令=子', '水旺'],
    source: '《穷通宝鉴》',
    text: '水旺于冬，宜土堤防，忌金多水荡。',
    interpretation: '冬水当令，喜土制约，忌金多。',
  },
];

/**
 * 根据八字特征匹配古籍条文
 * @param {Object} baziData - 八字排盘结果
 * @returns {Array} 匹配的古籍条文
 */
export function matchClassics(baziData) {
  const matches = [];
  const { pillars, dayMaster, wuxing, shenSha } = baziData;

  // 构建标签集合
  const tags = new Set();

  // 日主相关标签
  tags.add(`日主五行=${dayMaster.wuxing}`);

  // 判断日主强弱（简化算法）
  const dayMasterCount = wuxing[dayMaster.wuxing];
  const isStrong = dayMasterCount >= 3;
  tags.add(isStrong ? '身旺' : '身弱');

  // 月令
  const monthZhi = pillars.month.zhi;
  tags.add(`月令=${monthZhi}`);

  // 格局标签（简化判断）
  const monthGanShiShen = baziData.shiShen.month.gan;
  if (monthGanShiShen === '伤官' || monthGanShiShen === '食神') {
    tags.add('食伤格');
  }
  if (monthGanShiShen === '正财' || monthGanShiShen === '偏财') {
    tags.add('财格');
  }
  if (monthGanShiShen === '正官' || monthGanShiShen === '七杀') {
    tags.add('官杀格');
  }
  if (monthGanShiShen === '正印' || monthGanShiShen === '偏印') {
    tags.add('印格');
  }

  // 神煞标签
  for (const ss of shenSha) {
    tags.add(ss.name);
  }

  // 十神标签
  for (const position in baziData.shiShen) {
    const shiShen = baziData.shiShen[position].gan;
    tags.add(shiShen);
  }

  // 五行旺衰标签
  for (const [element, count] of Object.entries(wuxing)) {
    if (count >= 3) {
      tags.add(`${element}旺`);
    }
  }

  // 匹配条文
  for (const classic of classicsDatabase) {
    // 检查是否匹配所有标签
    const isMatch = classic.tags.some(tag => {
      // 支持简单的等号匹配
      if (tag.includes('=')) {
        return tags.has(tag);
      }
      // 或包含匹配
      return Array.from(tags).some(t => t.includes(tag));
    });

    if (isMatch) {
      matches.push(classic);
    }
  }

  // 去重并限制数量
  const uniqueMatches = matches.filter((item, index, self) =>
    index === self.findIndex(t => t.id === item.id)
  );

  return uniqueMatches.slice(0, 8); // 最多返回8条
}

/**
 * 生成AI分析用的提示词上下文
 * @param {Array} classics - 匹配的古籍条文
 * @returns {string} 格式化后的文本
 */
export function formatClassicsForAI(classics) {
  if (classics.length === 0) {
    return '暂无匹配的古籍条文。';
  }

  return classics.map((c, i) =>
    `${i + 1}. 【${c.source}】${c.text}\n   解读：${c.interpretation}`
  ).join('\n\n');
}
