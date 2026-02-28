import React from 'react';

/**
 * 八字排盘展示组件
 * 以传统八字盘形式展示四柱、十神、藏干等信息
 */
export function BaziDisplay({ data }) {
  if (!data) return null;

  const { pillars, dayMaster, shiShen, cangGan, nayin, shenSha, wuxing, daYun, zodiac, lunarDate, input } = data;

  // 四柱标题
  const headers = ['年柱', '月柱', '日柱', '时柱'];
  const positions = ['year', 'month', 'day', 'time'];

  return (
    <div className="bazi-display">
      {/* 基本信息 */}
      <div className="basic-info">
        <h3>八字命盘</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">日主：</span>
            <span className="value highlight">{dayMaster.gan}（{dayMaster.wuxing}）</span>
          </div>
          <div className="info-item">
            <span className="label">生肖：</span>
            <span className="value">{zodiac}</span>
          </div>
          <div className="info-item">
            <span className="label">农历：</span>
            <span className="value">{lunarDate.year} {lunarDate.month} {lunarDate.day}</span>
          </div>
        </div>
      </div>

      {/* 四柱主表 */}
      <div className="pillars-table">
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 天干 */}
            <tr className="gan-row">
              {positions.map((pos, i) => (
                <td key={i} className={pos === 'day' ? 'day-master' : ''}>
                  <span className="gan-char">{pillars[pos].gan}</span>
                  <span className="shishen-label">{pos === 'day' ? '日主' : shiShen[pos].gan}</span>
                </td>
              ))}
            </tr>
            {/* 地支 */}
            <tr className="zhi-row">
              {positions.map((pos, i) => (
                <td key={i} className={pos === 'day' ? 'day-branch' : ''}>
                  <span className="zhi-char">{pillars[pos].zhi}</span>
                </td>
              ))}
            </tr>
            {/* 藏干 */}
            <tr className="canggan-row">
              {positions.map((pos, i) => (
                <td key={i}>
                  <div className="canggan-list">
                    {cangGan[pos].map((cg, idx) => (
                      <div key={idx} className="canggan-item">
                        <span className="gan">{cg.gan}</span>
                        <span className="shishen">{cg.shiShen}</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            {/* 纳音 */}
            <tr className="nayin-row">
              {positions.map((pos, i) => (
                <td key={i}>
                  <span className="nayin-text">{nayin[pos]}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 五行分布 */}
      <div className="wuxing-section">
        <h4>五行分布</h4>
        <div className="wuxing-bars">
          {Object.entries(wuxing).map(([element, count]) => (
            <div key={element} className="wuxing-item">
              <span className="element-name">{element}</span>
              <div className="bar-container">
                <div
                  className={`bar ${element}`}
                  style={{ width: `${Math.min(count * 15, 100)}%` }}
                />
              </div>
              <span className="count">{count.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 神煞 */}
      {shenSha.length > 0 && (
        <div className="shensha-section">
          <h4>神煞</h4>
          <div className="shensha-list">
            {shenSha.map((ss, i) => (
              <div key={i} className="shensha-item">
                <span className="shensha-name">{ss.name}</span>
                <span className="shensha-desc">{ss.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 大运 */}
      <div className="dayun-section">
        <h4>大运（{daYun.isForward ? '顺排' : '逆排'}，{daYun.startAge}岁起运）</h4>
        <div className="dayun-list">
          {daYun.list.map((dy, i) => (
            <div key={i} className="dayun-item">
              <span className="dayun-index">{dy.index}</span>
              <span className="dayun-ganzhi">{dy.ganZhi}</span>
              <span className="dayun-age">{dy.startAge}岁</span>
              <span className="dayun-year">{dy.startYear}年</span>
            </div>
          ))}
        </div>
      </div>

      {/* 校正信息 */}
      {(input.corrections.dst?.wasCorrected || input.corrections.trueSolar) && (
        <div className="correction-info">
          <h4>时间校正说明</h4>
          {input.corrections.dst?.wasCorrected && (
            <p className="correction-item">
              <span className="label">夏令时校正：</span>
              {input.corrections.dst.dstInfo.message}
              <br />
              <span className="time-change">
                {input.corrections.dst.formatted.original} → {input.corrections.dst.formatted.corrected}
              </span>
            </p>
          )}
          {input.corrections.trueSolar && (
            <p className="correction-item">
              <span className="label">真太阳时校正：</span>
              经度修正 {input.corrections.trueSolar.longitudeCorrection.toFixed(1)} 分钟
              + 时差 {input.corrections.trueSolar.equationOfTime.toFixed(1)} 分钟
              <br />
              <span className="time-change">
                共修正 {input.corrections.trueSolar.totalCorrection.toFixed(1)} 分钟
              </span>
            </p>
          )}
        </div>
      )}

      <style>{`
        .bazi-display {
          background: #faf8f3;
          border-radius: 12px;
          padding: 24px;
          margin-top: 20px;
          border: 1px solid #e8e0d0;
        }

        .basic-info h3 {
          color: #8b4513;
          margin-bottom: 16px;
          font-size: 1.4rem;
          text-align: center;
        }

        .info-grid {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .info-item {
          font-size: 1rem;
        }

        .label {
          color: #666;
        }

        .value {
          color: #333;
          font-weight: 500;
        }

        .highlight {
          color: #c41e3a;
          font-weight: bold;
          font-size: 1.1em;
        }

        .pillars-table {
          margin: 20px 0;
          overflow-x: auto;
        }

        .pillars-table table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
        }

        .pillars-table th {
          background: #8b4513;
          color: white;
          padding: 12px 8px;
          font-weight: normal;
        }

        .pillars-table td {
          padding: 12px 8px;
          border: 1px solid #e8e0d0;
        }

        .gan-row td {
          background: #fff;
        }

        .zhi-row td {
          background: #f5f0e8;
        }

        .canggan-row td {
          background: #faf8f3;
          padding: 8px;
        }

        .nayin-row td {
          background: #f0ebe0;
          font-size: 0.85rem;
          color: #666;
        }

        .gan-char, .zhi-char {
          font-size: 2rem;
          font-weight: bold;
          display: block;
        }

        .day-master .gan-char {
          color: #c41e3a;
        }

        .shishen-label {
          font-size: 0.75rem;
          color: #666;
          display: block;
          margin-top: 4px;
        }

        .canggan-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .canggan-item {
          display: flex;
          justify-content: center;
          gap: 6px;
          font-size: 0.85rem;
        }

        .canggan-item .gan {
          font-weight: 500;
        }

        .canggan-item .shishen {
          color: #666;
          font-size: 0.75rem;
        }

        .wuxing-section, .shensha-section, .dayun-section, .correction-info {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e8e0d0;
        }

        .wuxing-section h4, .shensha-section h4, .dayun-section h4, .correction-info h4 {
          color: #8b4513;
          margin-bottom: 12px;
        }

        .wuxing-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .wuxing-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .element-name {
          width: 30px;
          font-weight: 500;
        }

        .bar-container {
          flex: 1;
          height: 20px;
          background: #e8e0d0;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar {
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .bar.金 { background: linear-gradient(90deg, #c0c0c0, #e8e8e8); }
        .bar.木 { background: linear-gradient(90deg, #228b22, #90ee90); }
        .bar.水 { background: linear-gradient(90deg, #1e90ff, #87ceeb); }
        .bar.火 { background: linear-gradient(90deg, #ff4500, #ffa07a); }
        .bar.土 { background: linear-gradient(90deg, #8b4513, #d2b48c); }

        .count {
          width: 40px;
          text-align: right;
          color: #666;
        }

        .shensha-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .shensha-item {
          background: #fff;
          border: 1px solid #d4c8b0;
          border-radius: 6px;
          padding: 8px 12px;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .shensha-name {
          font-weight: 500;
          color: #8b4513;
        }

        .shensha-desc {
          font-size: 0.8rem;
          color: #666;
        }

        .dayun-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .dayun-item {
          background: #fff;
          border: 1px solid #e8e0d0;
          border-radius: 6px;
          padding: 8px 12px;
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 0.9rem;
        }

        .dayun-index {
          color: #999;
          font-size: 0.8rem;
        }

        .dayun-ganzhi {
          font-weight: 500;
          color: #333;
        }

        .dayun-age {
          color: #666;
          font-size: 0.85rem;
        }

        .dayun-year {
          color: #999;
          font-size: 0.8rem;
        }

        .correction-info {
          background: #f8f4ed;
          padding: 16px;
          border-radius: 8px;
        }

        .correction-item {
          margin: 8px 0;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .time-change {
          color: #c41e3a;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
