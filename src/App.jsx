import { useState } from 'react'
import { BaziForm } from './components/BaziForm'
import { BaziDisplay } from './components/BaziDisplay'
import { AIAnalysis } from './components/AIAnalysis'
import { calculateBazi } from './utils/baziCalculator'
import './App.css'

function App() {
  const [baziData, setBaziData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFormSubmit = (formData) => {
    setLoading(true)
    setError(null)

    try {
      // 计算八字
      const result = calculateBazi(formData)
      setBaziData(result)
    } catch (err) {
      setError('排盘出错：' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>八字命理排盘</h1>
        <p className="subtitle">基于传统历法 · 精准排盘 · AI解读</p>
      </header>

      <main className="app-main">
        <BaziForm onSubmit={handleFormSubmit} loading={loading} />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {baziData && (
          <>
            <BaziDisplay data={baziData} />
            <AIAnalysis baziData={baziData} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>八字命理仅供参考，人生掌握在自己手中</p>
        <p className="disclaimer">
          排盘结果基于《万年历》《三命通会》等传统典籍，算法已考虑真太阳时、夏令时、早晚子时等因素
        </p>
      </footer>
    </div>
  )
}

export default App
