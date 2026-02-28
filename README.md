# 八字命理排盘网站

一个基于传统历法、精密算法和AI解读的八字命理排盘网站。

## 核心特性

### 精准排盘算法
- **lunar-javascript 开源库**：基于《寿星天文历》算法，支持1900-2100年
- **真太阳时校正**：根据出生地经度自动计算地方时
- **夏令时校正**：自动处理1986-1991年中国夏令时
- **早晚子时处理**：支持区分早晚子时的专业排盘

### 完整的八字信息
- 四柱（年柱、月柱、日柱、时柱）
- 天干地支与十神
- 藏干与纳音
- 神煞（天乙贵人、文昌、桃花、驿马、华盖等）
- 大运流年
- 五行分布分析

### AI智能解读
- 集成 DeepSeek API
- 基于古籍条文的智能匹配
- 流式输出，打字机效果
- 温暖、专业、不宿命论的解读风格

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + Vite |
| 历法计算 | lunar-javascript |
| AI接口 | DeepSeek API |
| 部署 | Vercel / GitHub Pages |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 部署到 Vercel

### 方法一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 方法二：通过 GitHub 集成

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 导入项目
3. 配置构建命令：`npm run build`
4. 输出目录：`dist`
5. 自动部署

## 使用说明

### 基本使用

1. 输入出生年月日时（公历）
2. 选择出生城市（用于真太阳时校正）
3. 选择性别
4. 点击"开始排盘"

### AI解读

1. 获取 DeepSeek API Key：[platform.deepseek.com](https://platform.deepseek.com/)
2. 在页面中输入 API Key
3. 点击"匹配古籍条文"查看相关经典
4. 点击"开始AI解读"获取详细分析

### 高级选项

- **夏令时校正**：自动检测1986-1991年出生并校正
- **真太阳时校正**：根据城市经度计算地方时
- **区分早晚子时**：23:00-00:00按晚子时处理

## 项目结构

```
src/
├── components/          # React组件
│   ├── BaziForm.jsx    # 输入表单
│   ├── BaziDisplay.jsx # 排盘展示
│   └── AIAnalysis.jsx  # AI解读
├── data/
│   ├── cities.js       # 城市经纬度数据
│   └── classics.js     # 古籍条文数据库
├── utils/
│   ├── baziCalculator.js    # 八字计算核心
│   ├── trueSolarTime.js     # 真太阳时计算
│   ├── daylightSaving.js    # 夏令时校正
│   └── deepseek.js          # DeepSeek API
├── App.jsx
└── main.jsx
```

## 注意事项

1. **API Key 安全**：纯前端方案中 API Key 会暴露在前端，建议：
   - 仅使用免费额度
   - 或在生产环境使用后端代理

2. **真太阳时精度**：
   - 城市经纬度精确到0.1度
   - 经度每差1度，时间差4分钟

3. **早晚子时争议**：
   - 本项目默认区分早晚子时
   - 晚子时（23:00-00:00）日柱按当日，时干按次日

## 古籍参考

- 《渊海子平》
- 《三命通会》
- 《子平真诠》
- 《滴天髓》
- 《穷通宝鉴》

## 开源协议

MIT License

## 免责声明

八字命理仅供参考和学术研究，人生道路由个人选择和努力决定。请理性看待命理分析结果。
