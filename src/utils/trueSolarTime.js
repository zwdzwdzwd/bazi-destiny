/**
 * 真太阳时计算模块
 * 核心公式：真太阳时 = 北京时间 + (经度 - 120°) × 4分钟 + 每日时差
 */

import { getCityByName } from '../data/cities';

/**
 * 计算每日时差（Equation of Time）
 * 由于地球轨道是椭圆形，需要修正真太阳时与平太阳时的差异
 * @param {Date} date - 日期
 * @returns {number} 时差（分钟）
 */
export function getEquationOfTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 计算当年第几天
  const startOfYear = new Date(year, 0, 1);
  const currentDate = new Date(year, month - 1, day);
  const dayOfYear = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000)) + 1;

  // 简化的时差计算公式（基于天文算法近似）
  // B = 360° × (N - 81) / 365，N为当年第几天
  const B = ((dayOfYear - 81) * 360) / 365 * (Math.PI / 180);

  // 时差 = 9.87 × sin(2B) - 7.53 × cos(B) - 1.5 × sin(B) （单位：分钟）
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  return equationOfTime;
}

/**
 * 计算真太阳时
 * @param {Date} beijingTime - 北京时间
 * @param {string|number} longitude - 城市名称或经度
 * @returns {Object} 真太阳时相关信息
 */
export function calculateTrueSolarTime(beijingTime, longitude) {
  let lng;

  // 如果是城市名称，查找对应经度
  if (typeof longitude === 'string') {
    const city = getCityByName(longitude);
    if (!city) {
      throw new Error(`未找到城市：${longitude}`);
    }
    lng = city.longitude;
  } else {
    lng = longitude;
  }

  // 1. 经度修正：每度相差4分钟
  // 北京时间基于东经120度
  const longitudeDiff = lng - 120;
  const longitudeCorrection = longitudeDiff * 4; // 分钟

  // 2. 每日时差修正
  const equationOfTime = getEquationOfTime(beijingTime);

  // 3. 总修正（分钟）
  const totalCorrection = longitudeCorrection + equationOfTime;

  // 4. 计算真太阳时
  const trueSolarTime = new Date(beijingTime.getTime() + totalCorrection * 60 * 1000);

  return {
    beijingTime,
    trueSolarTime,
    longitude: lng,
    longitudeDiff,
    longitudeCorrection,
    equationOfTime,
    totalCorrection,
    formatted: formatDateTime(trueSolarTime),
  };
}

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @returns {Object} 格式化后的时间对象
 */
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return {
    year,
    month,
    day,
    hour,
    minute,
    hourMinute: hour + minute / 60,
    timeString: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    dateString: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

/**
 * 获取时辰信息
 * @param {number} hour - 小时（0-23）
 * @param {number} minute - 分钟（0-59）
 * @returns {Object} 时辰信息
 */
export function getShiChen(hour, minute) {
  // 十二时辰对应表
  const shiChenList = [
    { name: '子时', start: 23, end: 1, index: 0, ganZhi: '子' },
    { name: '丑时', start: 1, end: 3, index: 1, ganZhi: '丑' },
    { name: '寅时', start: 3, end: 5, index: 2, ganZhi: '寅' },
    { name: '卯时', start: 5, end: 7, index: 3, ganZhi: '卯' },
    { name: '辰时', start: 7, end: 9, index: 4, ganZhi: '辰' },
    { name: '巳时', start: 9, end: 11, index: 5, ganZhi: '巳' },
    { name: '午时', start: 11, end: 13, index: 6, ganZhi: '午' },
    { name: '未时', start: 13, end: 15, index: 7, ganZhi: '未' },
    { name: '申时', start: 15, end: 17, index: 8, ganZhi: '申' },
    { name: '酉时', start: 17, end: 19, index: 9, ganZhi: '酉' },
    { name: '戌时', start: 19, end: 21, index: 10, ganZhi: '戌' },
    { name: '亥时', start: 21, end: 23, index: 11, ganZhi: '亥' },
  ];

  // 计算当前时间的总分钟数
  const totalMinutes = hour * 60 + minute;

  // 找到对应的时辰
  for (const sc of shiChenList) {
    const startMinutes = sc.start * 60;
    const endMinutes = sc.end * 60;

    // 特殊处理子时（跨天）
    if (sc.name === '子时') {
      if (totalMinutes >= 23 * 60 || totalMinutes < 1 * 60) {
        return {
          ...sc,
          isZiShi: true,
          isLateZiShi: totalMinutes >= 23 * 60, // 晚子时（23:00-00:00）
          isEarlyZiShi: totalMinutes < 1 * 60,  // 早子时（00:00-01:00）
        };
      }
    } else if (totalMinutes >= startMinutes && totalMinutes < endMinutes) {
      return { ...sc, isZiShi: false };
    }
  }

  // 默认返回子时（理论上不会执行到这里）
  return { ...shiChenList[0], isZiShi: true, isLateZiShi: true, isEarlyZiShi: false };
}

/**
 * 判断是否跨越时辰边界
 * @param {Date} before - 修正前时间
 * @param {Date} after - 修正后时间
 * @returns {boolean} 是否跨越时辰
 */
export function hasCrossedShiChen(before, after) {
  const beforeShiChen = getShiChen(before.getHours(), before.getMinutes());
  const afterShiChen = getShiChen(after.getHours(), after.getMinutes());

  return beforeShiChen.name !== afterShiChen.name;
}
