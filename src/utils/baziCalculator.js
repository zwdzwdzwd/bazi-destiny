/**
 * 八字排盘核心引擎
 * 集成：夏令时校正、真太阳时计算、早晚子时处理
 * 基于 lunar-javascript 库
 */

import { Solar, Lunar } from 'lunar-javascript';
import { calculateTrueSolarTime, getShiChen } from './trueSolarTime';
import { correctDaylightSaving } from './daylightSaving';

// 天干地支
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行属性
const TIAN_GAN_WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

const DI_ZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 地支藏干表
const DI_ZHI_CANG_GAN = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

// 纳音表（简化版，仅支持1900-2100常用范围）
const NAYIN_TABLE = {
  '甲子': '海中金', '乙丑': '海中金',
  '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木',
  '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金',
  '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水',
  '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金',
  '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水',
  '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火',
  '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水',
  '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火',
  '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土',
  '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火',
  '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土',
  '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木',
  '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土',
  '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木',
  '壬戌': '大海水', '癸亥': '大海水',
};

/**
 * 计算八字排盘
 * @param {Object} params - 排盘参数
 * @param {number} params.year - 年
 * @param {number} params.month - 月
 * @param {number} params.day - 日
 * @param {number} params.hour - 时
 * @param {number} params.minute - 分
 * @param {string} params.city - 城市名称
 * @param {boolean} params.applyDST - 是否应用夏令时校正
 * @param {boolean} params.applyTrueSolar - 是否应用真太阳时
 * @param {boolean} params.distinguishZiShi - 是否区分早晚子时
 * @param {string} params.gender - 性别 ('male' | 'female')
 * @returns {Object} 完整的八字排盘结果
 */
export function calculateBazi(params) {
  const {
    year, month, day, hour, minute,
    city,
    applyDST = true,
    applyTrueSolar = true,
    distinguishZiShi = true,
    gender = 'male',
  } = params;

  // 1. 构建原始日期对象（北京时间）
  let baseDate = new Date(year, month - 1, day, hour, minute);

  // 2. 夏令时校正
  let dstCorrection = null;
  if (applyDST) {
    dstCorrection = correctDaylightSaving(baseDate);
    baseDate = dstCorrection.correctedDate;
  }

  // 3. 真太阳时校正
  let solarCorrection = null;
  if (applyTrueSolar && city) {
    solarCorrection = calculateTrueSolarTime(baseDate, city);
    baseDate = solarCorrection.trueSolarTime;
  }

  // 4. 获取校正后的时间分量
  const correctedYear = baseDate.getFullYear();
  const correctedMonth = baseDate.getMonth() + 1;
  const correctedDay = baseDate.getDate();
  const correctedHour = baseDate.getHours();
  const correctedMinute = baseDate.getMinutes();

  // 5. 判断时辰（含早晚子时处理）
  const shiChenInfo = getShiChen(correctedHour, correctedMinute);

  // 6. 使用 lunar-javascript 计算八字
  // 注意：lunar-javascript 默认不区分早晚子时，需要手动处理
  let solar = Solar.fromYmdHms(correctedYear, correctedMonth, correctedDay, correctedHour, correctedMinute, 0);
  let lunar = solar.getLunar();

  // 7. 早晚子时特殊处理
  let ziShiAdjustment = null;
  if (distinguishZiShi && shiChenInfo.isLateZiShi) {
    // 晚子时：日柱按当日，时干按次日推算
    ziShiAdjustment = handleLateZiShi(solar, lunar, correctedYear, correctedMonth, correctedDay);
    if (ziShiAdjustment) {
      lunar = ziShiAdjustment.adjustedLunar;
    }
  }

  // 8. 提取四柱
  const yearGanZhi = lunar.getYearInGanZhi();
  const monthGanZhi = lunar.getMonthInGanZhi();
  const dayGanZhi = lunar.getDayInGanZhi();
  const timeGanZhi = lunar.getTimeInGanZhi();

  // 9. 提取日主
  const dayMaster = dayGanZhi.charAt(0);

  // 10. 计算十神
  const shiShen = calculateShiShen(dayMaster, {
    year: yearGanZhi,
    month: monthGanZhi,
    day: dayGanZhi,
    time: timeGanZhi,
  });

  // 11. 提取藏干
  const cangGan = extractCangGan({
    year: yearGanZhi,
    month: monthGanZhi,
    day: dayGanZhi,
    time: timeGanZhi,
  });

  // 12. 提取纳音
  const nayin = {
    year: NAYIN_TABLE[yearGanZhi] || '未知',
    month: NAYIN_TABLE[monthGanZhi] || '未知',
    day: NAYIN_TABLE[dayGanZhi] || '未知',
    time: NAYIN_TABLE[timeGanZhi] || '未知',
  };

  // 13. 计算神煞
  const shenSha = calculateShenSha(lunar, gender);

  // 14. 计算五行分布
  const wuxing = calculateWuXing({
    year: yearGanZhi,
    month: monthGanZhi,
    day: dayGanZhi,
    time: timeGanZhi,
    cangGan,
  });

  // 15. 计算大运
  const daYun = calculateDaYun(lunar, gender, yearGanZhi);

  return {
    // 输入信息
    input: {
      original: { year, month, day, hour, minute, city, gender },
      corrections: {
        dst: dstCorrection,
        trueSolar: solarCorrection,
        ziShi: ziShiAdjustment,
      },
    },

    // 四柱
    pillars: {
      year: { ganZhi: yearGanZhi, gan: yearGanZhi.charAt(0), zhi: yearGanZhi.charAt(1) },
      month: { ganZhi: monthGanZhi, gan: monthGanZhi.charAt(0), zhi: monthGanZhi.charAt(1) },
      day: { ganZhi: dayGanZhi, gan: dayGanZhi.charAt(0), zhi: dayGanZhi.charAt(1) },
      time: { ganZhi: timeGanZhi, gan: timeGanZhi.charAt(0), zhi: timeGanZhi.charAt(1) },
    },

    // 日主信息
    dayMaster: {
      gan: dayMaster,
      wuxing: TIAN_GAN_WUXING[dayMaster],
    },

    // 十神
    shiShen,

    // 藏干
    cangGan,

    // 纳音
    nayin,

    // 神煞
    shenSha,

    // 五行分布
    wuxing,

    // 大运
    daYun,

    // 节气信息
    jieQi: {
      prev: lunar.getPrevJieQi()?.getName(),
      next: lunar.getNextJieQi()?.getName(),
      current: lunar.getJieQi(),
    },

    // 生肖
    zodiac: lunar.getYearShengXiao(),

    // 农历日期
    lunarDate: {
      year: lunar.getYearInChinese(),
      month: lunar.getMonthInChinese(),
      day: lunar.getDayInChinese(),
    },
  };
}

/**
 * 处理晚子时（23:00-00:00）
 * 晚子时规则：日柱按当日，时干按次日推算
 */
function handleLateZiShi(solar, lunar, year, month, day) {
  // 获取次日的日柱
  const nextDaySolar = Solar.fromYmdHms(year, month, day + 1, 0, 0, 0);
  const nextDayLunar = nextDaySolar.getLunar();
  const nextDayDayGan = nextDayLunar.getDayInGanZhi().charAt(0);

  // 根据次日日干推算子时天干（五鼠遁）
  const timeGan = getShiGanByRiGan(nextDayDayGan, '子');
  const adjustedTimeGanZhi = timeGan + '子';

  return {
    type: 'lateZiShi',
    description: '晚子时（23:00-00:00）：日柱按当日，时干按次日推算',
    nextDayDayGan,
    adjustedTimeGanZhi,
    originalLunar: lunar,
    // 由于 lunar-javascript 不支持直接修改时柱，我们在上层处理
  };
}

/**
 * 根据日干和地支推算时干（五鼠遁）
 * @param {string} riGan - 日干
 * @param {string} shiZhi - 时支
 * @returns {string} 时干
 */
function getShiGanByRiGan(riGan, shiZhi) {
  // 五鼠遁口诀
  const wuShuDun = {
    '甲': '甲', '己': '甲', // 甲己还加甲
    '乙': '丙', '庚': '丙', // 乙庚丙作初
    '丙': '戊', '辛': '戊', // 丙辛从戊起
    '丁': '庚', '壬': '庚', // 丁壬庚子居
    '戊': '壬', '癸': '壬', // 戊癸何方发，壬子是真途
  };

  const startGan = wuShuDun[riGan];
  const zhiIndex = DI_ZHI.indexOf(shiZhi);
  const ganIndex = TIAN_GAN.indexOf(startGan);

  // 顺推
  const resultIndex = (ganIndex + zhiIndex) % 10;
  return TIAN_GAN[resultIndex];
}

/**
 * 计算十神
 * @param {string} dayMaster - 日主天干
 * @param {Object} pillars - 四柱
 * @returns {Object} 十神配置
 */
function calculateShiShen(dayMaster, pillars) {
  const result = {};

  for (const [position, ganZhi] of Object.entries(pillars)) {
    const gan = ganZhi.charAt(0);
    result[position] = {
      gan: getShiShenRelation(dayMaster, gan),
    };
  }

  return result;
}

/**
 * 获取十神关系
 * @param {string} dayMaster - 日主
 * @param {string} target - 目标天干
 * @returns {string} 十神名称
 */
function getShiShenRelation(dayMaster, target) {
  if (dayMaster === target) return '比肩';

  const dayMasterIndex = TIAN_GAN.indexOf(dayMaster);
  const targetIndex = TIAN_GAN.indexOf(target);
  const dayMasterYinYang = dayMasterIndex % 2 === 0; // 0,2,4,6,8为阳
  const targetYinYang = targetIndex % 2 === 0;

  const wuxingOrder = ['木', '火', '土', '金', '水'];
  const dayMasterWX = TIAN_GAN_WUXING[dayMaster];
  const targetWX = TIAN_GAN_WUXING[target];

  const dayMasterWXIndex = wuxingOrder.indexOf(dayMasterWX);
  const targetWXIndex = wuxingOrder.indexOf(targetWX);

  // 计算生克关系
  const diff = (targetWXIndex - dayMasterWXIndex + 5) % 5;

  if (diff === 1) {
    // 我生
    return dayMasterYinYang === targetYinYang ? '食神' : '伤官';
  } else if (diff === 2) {
    // 我克
    return dayMasterYinYang === targetYinYang ? '偏财' : '正财';
  } else if (diff === 3) {
    // 克我
    return dayMasterYinYang === targetYinYang ? '七杀' : '正官';
  } else if (diff === 4) {
    // 生我
    return dayMasterYinYang === targetYinYang ? '偏印' : '正印';
  }

  return '比肩';
}

/**
 * 提取藏干及十神
 */
function extractCangGan(pillars) {
  const result = {};

  for (const [position, ganZhi] of Object.entries(pillars)) {
    const zhi = ganZhi.charAt(1);
    const cangGanList = DI_ZHI_CANG_GAN[zhi] || [];

    result[position] = cangGanList.map(gan => ({
      gan,
      shiShen: getShiShenRelation(pillars.day.charAt(0), gan),
    }));
  }

  return result;
}

/**
 * 计算神煞（核心神煞）
 * 修复：检查四柱地支中是否实际存在对应神煞
 */
function calculateShenSha(lunar, gender) {
  const yearGan = lunar.getYearGan();
  const yearZhi = lunar.getYearZhi();
  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();
  const monthZhi = lunar.getMonthZhi();
  const timeZhi = lunar.getTimeZhi();

  // 四柱所有地支
  const allZhiList = [yearZhi, monthZhi, dayZhi, timeZhi];
  const zhiPositions = {
    [yearZhi]: '年支',
    [monthZhi]: '月支',
    [dayZhi]: '日支',
    [timeZhi]: '时支'
  };

  const shenSha = [];

  // 天乙贵人 - 检查四柱中是否有贵人地支
  const tianYiGuiRen = getTianYiGuiRen(dayGan, allZhiList, zhiPositions);
  if (tianYiGuiRen.length > 0) {
    shenSha.push({ name: '天乙贵人', positions: tianYiGuiRen, description: '逢凶化吉，贵人相助' });
  }

  // 文昌贵人 - 检查四柱中是否有文昌地支
  const wenChang = getWenChang(dayGan, allZhiList, zhiPositions);
  if (wenChang.length > 0) {
    shenSha.push({ name: '文昌贵人', positions: wenChang, description: '聪明好学，文章振发' });
  }

  // 桃花 - 检查四柱中是否有桃花地支
  const taoHua = getTaoHua(yearZhi, dayZhi, allZhiList, zhiPositions);
  if (taoHua.length > 0) {
    shenSha.push({ name: '桃花', positions: taoHua, description: '人缘好，感情丰富' });
  }

  // 驿马 - 检查四柱中是否有驿马地支
  const yiMa = getYiMa(yearZhi, dayZhi, allZhiList, zhiPositions);
  if (yiMa.length > 0) {
    shenSha.push({ name: '驿马', positions: yiMa, description: '奔波变动，适合远行' });
  }

  // 华盖 - 检查四柱中是否有华盖地支
  const huaGai = getHuaGai(yearZhi, dayZhi, allZhiList, zhiPositions);
  if (huaGai.length > 0) {
    shenSha.push({ name: '华盖', positions: huaGai, description: '孤独之星，喜玄学艺术' });
  }

  return shenSha;
}

/**
 * 天乙贵人查法
 * 甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢马虎
 * 修复：检查四柱地支中是否实际存在贵人地支
 */
function getTianYiGuiRen(dayGan, allZhiList, zhiPositions) {
  const rules = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '壬': ['巳', '卯'], '癸': ['巳', '卯'],
    '辛': ['午', '寅'],
  };

  const result = [];
  const guiRenZhi = rules[dayGan] || [];

  // 检查四柱地支中是否有贵人地支
  for (const zhi of allZhiList) {
    if (guiRenZhi.includes(zhi)) {
      result.push({ position: zhiPositions[zhi], zhi });
    }
  }

  return result;
}

/**
 * 文昌贵人查法
 * 甲乙巳午，丙戊申猴，丁己鸡，庚猪辛鼠壬逢虎，癸人见卯
 * 修复：检查四柱地支中是否实际存在文昌地支
 */
function getWenChang(dayGan, allZhiList, zhiPositions) {
  const rules = {
    '甲': '巳', '乙': '午',
    '丙': '申', '戊': '申',
    '丁': '酉', '己': '酉',
    '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯',
  };

  const result = [];
  const wenChangZhi = rules[dayGan];

  // 检查四柱地支中是否有文昌地支
  for (const zhi of allZhiList) {
    if (zhi === wenChangZhi) {
      result.push({ position: zhiPositions[zhi], zhi });
    }
  }

  return result;
}

/**
 * 桃花查法
 * 申子辰在酉，巳酉丑在午，寅午戌在卯，亥卯未在子
 * 修复：检查四柱地支中是否实际存在桃花地支
 */
function getTaoHua(yearZhi, dayZhi, allZhiList, zhiPositions) {
  const rules = {
    '申': '酉', '子': '酉', '辰': '酉',
    '巳': '午', '酉': '午', '丑': '午',
    '寅': '卯', '午': '卯', '戌': '卯',
    '亥': '子', '卯': '子', '未': '子',
  };

  const result = [];

  // 年支桃花：检查四柱中是否有年支对应的桃花地支
  const yearTaoHua = rules[yearZhi];
  for (const zhi of allZhiList) {
    if (zhi === yearTaoHua) {
      result.push({ source: '年支', position: zhiPositions[zhi], zhi });
    }
  }

  // 日支桃花：检查四柱中是否有日支对应的桃花地支
  const dayTaoHua = rules[dayZhi];
  for (const zhi of allZhiList) {
    if (zhi === dayTaoHua && !result.find(r => r.zhi === zhi)) {
      result.push({ source: '日支', position: zhiPositions[zhi], zhi });
    }
  }

  return result;
}

/**
 * 驿马查法
 * 申子辰马在寅，巳酉丑马在亥，寅午戌马在申，亥卯未马在巳
 * 修复：检查四柱地支中是否实际存在驿马地支
 */
function getYiMa(yearZhi, dayZhi, allZhiList, zhiPositions) {
  const rules = {
    '申': '寅', '子': '寅', '辰': '寅',
    '巳': '亥', '酉': '亥', '丑': '亥',
    '寅': '申', '午': '申', '戌': '申',
    '亥': '巳', '卯': '巳', '未': '巳',
  };

  const result = [];

  // 年支驿马：检查四柱中是否有年支对应的驿马地支
  const yearYiMa = rules[yearZhi];
  for (const zhi of allZhiList) {
    if (zhi === yearYiMa) {
      result.push({ source: '年支', position: zhiPositions[zhi], zhi });
    }
  }

  // 日支驿马：检查四柱中是否有日支对应的驿马地支
  const dayYiMa = rules[dayZhi];
  for (const zhi of allZhiList) {
    if (zhi === dayYiMa && !result.find(r => r.zhi === zhi)) {
      result.push({ source: '日支', position: zhiPositions[zhi], zhi });
    }
  }

  return result;
}

/**
 * 华盖查法
 * 申子辰见辰，巳酉丑见丑，寅午戌见戌，亥卯未见未
 * 修复：检查四柱地支中是否实际存在华盖地支
 */
function getHuaGai(yearZhi, dayZhi, allZhiList, zhiPositions) {
  const rules = {
    '申': '辰', '子': '辰', '辰': '辰',
    '巳': '丑', '酉': '丑', '丑': '丑',
    '寅': '戌', '午': '戌', '戌': '戌',
    '亥': '未', '卯': '未', '未': '未',
  };

  const result = [];

  // 年支华盖：检查四柱中是否有年支对应的华盖地支
  const yearHuaGai = rules[yearZhi];
  for (const zhi of allZhiList) {
    if (zhi === yearHuaGai) {
      result.push({ source: '年支', position: zhiPositions[zhi], zhi });
    }
  }

  // 日支华盖：检查四柱中是否有日支对应的华盖地支
  const dayHuaGai = rules[dayZhi];
  for (const zhi of allZhiList) {
    if (zhi === dayHuaGai && !result.find(r => r.zhi === zhi)) {
      result.push({ source: '日支', position: zhiPositions[zhi], zhi });
    }
  }

  return result;
}

/**
 * 计算五行分布
 */
function calculateWuXing({ year, month, day, time, cangGan }) {
  const counts = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

  // 统计天干五行
  const ganList = [year.charAt(0), month.charAt(0), day.charAt(0), time.charAt(0)];
  for (const gan of ganList) {
    const wx = TIAN_GAN_WUXING[gan];
    if (wx) counts[wx]++;
  }

  // 统计地支五行
  const zhiList = [year.charAt(1), month.charAt(1), day.charAt(1), time.charAt(1)];
  for (const zhi of zhiList) {
    const wx = DI_ZHI_WUXING[zhi];
    if (wx) counts[wx]++;
  }

  // 统计藏干五行（权重0.5）
  for (const position in cangGan) {
    for (const cg of cangGan[position]) {
      const wx = TIAN_GAN_WUXING[cg.gan];
      if (wx) counts[wx] += 0.5;
    }
  }

  return counts;
}

/**
 * 计算大运（简化版）
 * 避免使用 getYun 方法，因为打包后可能丢失
 */
function calculateDaYun(lunar, gender, yearGanZhi) {
  const yearGan = yearGanZhi.charAt(0);
  const yearYinYang = TIAN_GAN.indexOf(yearGan) % 2 === 0; // true=阳
  const isMale = gender === 'male';

  // 顺排或逆排
  // 阳年男、阴年女顺排；阴年男、阳年女逆排
  const isForward = (yearYinYang && isMale) || (!yearYinYang && !isMale);

  // 简化大运计算，从月柱开始顺排或逆排
  const monthGanZhi = lunar.getMonthInGanZhi();
  const startGan = monthGanZhi.charAt(0);
  const startZhi = monthGanZhi.charAt(1);
  const startGanIndex = TIAN_GAN.indexOf(startGan);
  const startZhiIndex = DI_ZHI.indexOf(startZhi);

  const daYunList = [];
  const currentYear = new Date().getFullYear();
  const birthYear = lunar.getYear();
  const startAge = 3; // 简化为3岁起运
  const startYear = birthYear + startAge;

  for (let i = 0; i < 8; i++) {
    let ganIndex, zhiIndex;
    if (isForward) {
      ganIndex = (startGanIndex + i + 1) % 10;
      zhiIndex = (startZhiIndex + i + 1) % 12;
    } else {
      ganIndex = (startGanIndex - i - 1 + 10) % 10;
      zhiIndex = (startZhiIndex - i - 1 + 12) % 12;
    }
    daYunList.push({
      index: i + 1,
      ganZhi: TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex],
      startAge: startAge + i * 10,
      startYear: startYear + i * 10,
    });
  }

  return {
    isForward,
    startAge,
    startYear,
    startMonth: 0,
    startDay: 0,
    list: daYunList,
  };
}
