import React, { useState } from 'react';
import { getSortedCities } from '../data/cities';

/**
 * 八字输入表单组件
 */
export function BaziForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    city: '北京',
    gender: 'male',
    applyDST: true,
    applyTrueSolar: true,
    distinguishZiShi: true,
  });

  const cities = getSortedCities();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // 快速设置当前时间
  const setNow = () => {
    const now = new Date();
    setFormData(prev => ({
      ...prev,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    }));
  };

  return (
    <form className="bazi-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>八字排盘</h2>
        <button type="button" className="now-btn" onClick={setNow}>
          使用当前时间
        </button>
      </div>

      <div className="form-grid">
        {/* 出生日期 */}
        <div className="form-group date-group">
          <label>出生日期（公历）</label>
          <div className="date-inputs">
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleNumberChange}
              min="1900"
              max="2100"
              placeholder="年"
            />
            <span>年</span>
            <input
              type="number"
              name="month"
              value={formData.month}
              onChange={handleNumberChange}
              min="1"
              max="12"
              placeholder="月"
            />
            <span>月</span>
            <input
              type="number"
              name="day"
              value={formData.day}
              onChange={handleNumberChange}
              min="1"
              max="31"
              placeholder="日"
            />
            <span>日</span>
          </div>
        </div>

        {/* 出生时间 */}
        <div className="form-group time-group">
          <label>出生时间</label>
          <div className="time-inputs">
            <input
              type="number"
              name="hour"
              value={formData.hour}
              onChange={handleNumberChange}
              min="0"
              max="23"
              placeholder="时"
            />
            <span>:</span>
            <input
              type="number"
              name="minute"
              value={formData.minute}
              onChange={handleNumberChange}
              min="0"
              max="59"
              placeholder="分"
            />
          </div>
        </div>

        {/* 出生城市 */}
        <div className="form-group">
          <label htmlFor="city">出生城市</label>
          <select id="city" name="city" value={formData.city} onChange={handleChange}>
            {cities.map(city => (
              <option key={city.name} value={city.name}>
                {city.name} ({city.province})
              </option>
            ))}
          </select>
        </div>

        {/* 性别 */}
        <div className="form-group">
          <label>性别</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              男
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              女
            </label>
          </div>
        </div>
      </div>

      {/* 高级选项 */}
      <div className="advanced-options">
        <h4>高级选项</h4>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="applyDST"
              checked={formData.applyDST}
              onChange={handleChange}
            />
            夏令时校正（1986-1991）
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="applyTrueSolar"
              checked={formData.applyTrueSolar}
              onChange={handleChange}
            />
            真太阳时校正
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="distinguishZiShi"
              checked={formData.distinguishZiShi}
              onChange={handleChange}
            />
            区分早晚子时
          </label>
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? '排盘中...' : '开始排盘'}
      </button>

      <style>{`
        .bazi-form {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .form-header h2 {
          color: #8b4513;
          margin: 0;
        }

        .now-btn {
          background: #f5f0e8;
          border: 1px solid #d4c8b0;
          color: #8b4513;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .now-btn:hover {
          background: #ebe4d6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #8b4513;
        }

        .date-inputs,
        .time-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-inputs input,
        .time-inputs input {
          width: 60px;
          text-align: center;
        }

        .date-inputs span,
        .time-inputs span {
          color: #999;
        }

        .radio-group {
          display: flex;
          gap: 20px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-weight: normal !important;
        }

        .advanced-options {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .advanced-options h4 {
          color: #8b4513;
          margin-bottom: 12px;
        }

        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #555;
        }

        .submit-btn {
          width: 100%;
          margin-top: 24px;
          padding: 14px;
          background: #8b4513;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #a0522d;
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
