/**
 * 夏令时处理模块
 * 中国在1986-1991年间实行夏令时
 * 每年4月中旬第2个星期日凌晨2点至9月中旬第1个星期日凌晨2点
 */

// 夏令时实施期间（已简化处理，实际每年具体日期略有不同）
const DST_PERIODS = [
  { year: 1986, start: '05-04', end: '09-14' },
  { year: 1987, start: '04-12', end: '09-13' },
  { year: 1988, start: '04-10', end: '09-11' },
  { year: 1989, start: '04-16', end: '09-17' },
  { year: 1990, start: '04-15', end: '09-16' },
  { year: 1991, start: '04-14', end: '09-15' },
];

/**
 * 检查指定日期是否在夏令时期间
 * @param {Date} date - 要检查的日期
 * @returns {Object} 夏令时信息
 */
export function checkDaylightSaving(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 只检查1986-1991年
  if (year < 1986 || year > 1991) {
    return {
      isDST: false,
      year,
      message: '该年份未实行夏令时',
    };
  }

  const period = DST_PERIODS.find(p => p.year === year);
  if (!period) {
    return {
      isDST: false,
      year,
      message: '该年份未实行夏令时',
    };
  }

  // 解析开始和结束日期
  const [startMonth, startDay] = period.start.split('-').map(Number);
  const [endMonth, endDay] = period.end.split('-').map(Number);

  // 创建日期对象进行比较（忽略时间部分）
  const currentDate = new Date(year, month - 1, day);
  const startDate = new Date(year, startMonth - 1, startDay);
  const endDate = new Date(year, endMonth - 1, endDay);

  // 检查是否在夏令时期间
  const isDST = currentDate >= startDate && currentDate <= endDate;

  return {
    isDST,
    year,
    startDate: period.start,
    endDate: period.end,
    message: isDST
      ? `${year}年${month}月${day}日处于夏令时期间（${period.start} 至 ${period.end}），已自动减1小时`
      : `${year}年${month}月${day}日不在夏令时期间`,
  };
}

/**
 * 校正夏令时
 * 如果日期在夏令时期间，将时间减去1小时
 * @param {Date} date - 原始时间
 * @returns {Object} 校正后的时间和信息
 */
export function correctDaylightSaving(date) {
  const dstInfo = checkDaylightSaving(date);

  if (dstInfo.isDST) {
    // 减去1小时
    const correctedDate = new Date(date.getTime() - 60 * 60 * 1000);
    return {
      originalDate: date,
      correctedDate,
      dstInfo,
      wasCorrected: true,
      formatted: {
        original: formatDateTime(date),
        corrected: formatDateTime(correctedDate),
      },
    };
  }

  return {
    originalDate: date,
    correctedDate: date,
    dstInfo,
    wasCorrected: false,
    formatted: {
      original: formatDateTime(date),
      corrected: formatDateTime(date),
    },
  };
}

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @returns {string} 格式化字符串
 */
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * 获取夏令时历史信息
 * @returns {Array} 夏令时历史记录
 */
export function getDSTHistory() {
  return DST_PERIODS.map(period => ({
    ...period,
    description: `${period.year}年：${period.start} 至 ${period.end}`,
  }));
}
