// 中国主要城市经纬度数据库
// 经度用于真太阳时计算

export const cities = [
  { name: '北京', province: '北京', longitude: 116.4074, latitude: 39.9042 },
  { name: '上海', province: '上海', longitude: 121.4737, latitude: 31.2304 },
  { name: '广州', province: '广东', longitude: 113.2644, latitude: 23.1291 },
  { name: '深圳', province: '广东', longitude: 114.0859, latitude: 22.547 },
  { name: '天津', province: '天津', longitude: 117.2008, latitude: 39.0842 },
  { name: '重庆', province: '重庆', longitude: 106.5516, latitude: 29.563 },
  { name: '成都', province: '四川', longitude: 104.0668, latitude: 30.5728 },
  { name: '杭州', province: '浙江', longitude: 120.1551, latitude: 30.2741 },
  { name: '武汉', province: '湖北', longitude: 114.3054, latitude: 30.5931 },
  { name: '西安', province: '陕西', longitude: 108.9398, latitude: 34.3416 },
  { name: '南京', province: '江苏', longitude: 118.7969, latitude: 32.0603 },
  { name: '苏州', province: '江苏', longitude: 120.5853, latitude: 31.2989 },
  { name: '郑州', province: '河南', longitude: 113.6253, latitude: 34.7466 },
  { name: '长沙', province: '湖南', longitude: 112.9388, latitude: 28.2282 },
  { name: '沈阳', province: '辽宁', longitude: 123.4315, latitude: 41.8057 },
  { name: '青岛', province: '山东', longitude: 120.3826, latitude: 36.0671 },
  { name: '济南', province: '山东', longitude: 117.1205, latitude: 36.651 },
  { name: '哈尔滨', province: '黑龙江', longitude: 126.6424, latitude: 45.7569 },
  { name: '长春', province: '吉林', longitude: 125.3235, latitude: 43.8171 },
  { name: '大连', province: '辽宁', longitude: 121.6147, latitude: 38.914 },
  { name: '昆明', province: '云南', longitude: 102.8329, latitude: 24.8801 },
  { name: '贵阳', province: '贵州', longitude: 106.6302, latitude: 26.6477 },
  { name: '南宁', province: '广西', longitude: 108.3661, latitude: 22.8172 },
  { name: '福州', province: '福建', longitude: 119.2965, latitude: 26.0745 },
  { name: '厦门', province: '福建', longitude: 118.0894, latitude: 24.4798 },
  { name: '太原', province: '山西', longitude: 112.5489, latitude: 37.8706 },
  { name: '石家庄', province: '河北', longitude: 114.5149, latitude: 38.0423 },
  { name: '呼和浩特', province: '内蒙古', longitude: 111.7492, latitude: 40.8426 },
  { name: '乌鲁木齐', province: '新疆', longitude: 87.6168, latitude: 43.8256 },
  { name: '兰州', province: '甘肃', longitude: 103.8343, latitude: 36.0611 },
  { name: '银川', province: '宁夏', longitude: 106.2309, latitude: 38.4872 },
  { name: '西宁', province: '青海', longitude: 101.7782, latitude: 36.6171 },
  { name: '拉萨', province: '西藏', longitude: 91.1409, latitude: 29.6456 },
  { name: '海口', province: '海南', longitude: 110.3492, latitude: 20.0174 },
  { name: '南昌', province: '江西', longitude: 115.854, latitude: 28.683 },
  { name: '合肥', province: '安徽', longitude: 117.2272, latitude: 31.8206 },
  { name: '无锡', province: '江苏', longitude: 120.3119, latitude: 31.4912 },
  { name: '宁波', province: '浙江', longitude: 121.55, latitude: 29.875 },
  { name: '温州', province: '浙江', longitude: 120.6994, latitude: 27.9938 },
  { name: '佛山', province: '广东', longitude: 113.1214, latitude: 23.0215 },
  { name: '东莞', province: '广东', longitude: 113.7518, latitude: 23.0207 },
  { name: '珠海', province: '广东', longitude: 113.5767, latitude: 22.2707 },
  { name: '惠州', province: '广东', longitude: 114.4168, latitude: 23.1115 },
  { name: '中山', province: '广东', longitude: 113.3927, latitude: 22.5176 },
  { name: '江门', province: '广东', longitude: 113.0819, latitude: 22.5789 },
  { name: '湛江', province: '广东', longitude: 110.3594, latitude: 21.2707 },
  { name: '汕头', province: '广东', longitude: 116.7211, latitude: 23.3535 },
  { name: '揭阳', province: '广东', longitude: 116.3727, latitude: 23.5499 },
  { name: '潮州', province: '广东', longitude: 116.6285, latitude: 23.6567 },
  { name: '肇庆', province: '广东', longitude: 112.4653, latitude: 23.0469 },
  { name: '清远', province: '广东', longitude: 113.0560, latitude: 23.6820 },
  { name: '韶关', province: '广东', longitude: 113.5975, latitude: 24.8108 },
  { name: '佛山', province: '广东', longitude: 113.1214, latitude: 23.0215 },
  { name: '顺德', province: '广东', longitude: 113.2552, latitude: 22.8393 },
  { name: '香港', province: '香港', longitude: 114.1694, latitude: 22.3193 },
  { name: '澳门', province: '澳门', longitude: 113.5491, latitude: 22.1987 },
  { name: '台北', province: '台湾', longitude: 121.5654, latitude: 25.033 },
  { name: '高雄', province: '台湾', longitude: 120.3014, latitude: 22.6273 },
  { name: '台中', province: '台湾', longitude: 120.6736, latitude: 24.1477 },
  { name: '石家庄', province: '河北', longitude: 114.5149, latitude: 38.0423 },
  { name: '唐山', province: '河北', longitude: 118.1802, latitude: 39.6309 },
  { name: '保定', province: '河北', longitude: 115.4646, latitude: 38.8739 },
  { name: '邯郸', province: '河北', longitude: 114.4905, latitude: 36.6123 },
  { name: '秦皇岛', province: '河北', longitude: 119.6005, latitude: 39.9354 },
  { name: '张家口', province: '河北', longitude: 114.8863, latitude: 40.7680 },
  { name: '承德', province: '河北', longitude: 117.9328, latitude: 40.9510 },
  { name: '廊坊', province: '河北', longitude: 116.6837, latitude: 39.5380 },
  { name: '沧州', province: '河北', longitude: 116.8388, latitude: 38.3045 },
  { name: '衡水', province: '河北', longitude: 115.6860, latitude: 37.7350 },
  { name: '邢台', province: '河北', longitude: 114.5047, latitude: 37.0659 },
];

// 按省份分组
export const citiesByProvince = cities.reduce((acc, city) => {
  if (!acc[city.province]) {
    acc[city.province] = [];
  }
  acc[city.province].push(city);
  return acc;
}, {});

// 获取城市列表（去重并按拼音排序）
export const getSortedCities = () => {
  const uniqueCities = [];
  const seen = new Set();

  for (const city of cities) {
    if (!seen.has(city.name)) {
      seen.add(city.name);
      uniqueCities.push(city);
    }
  }

  return uniqueCities.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
};

// 根据城市名查找经纬度
export const getCityByName = (name) => {
  return cities.find(city => city.name === name);
};
