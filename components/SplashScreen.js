'use client'

import { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

const WORD = 'CodeQuest'

export default function SplashScreen() {
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    if (typed < WORD.length) {
      const delay = typed === 1 ? 500 : 100
      const t = setTimeout(() => setTyped(c => c + 1), delay)
      return () => clearTimeout(t)
    }
  }, [typed])

  useEffect(() => {
    if (typed < WORD.length) return
    const t1 = setTimeout(() => setPhase('expanding'), 700)
    const t2 = setTimeout(() => setPhase('done'), 2100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [typed])

  return (
    <div className={`${styles.splash} ${phase === 'done' ? styles.hidden : ''}`}>
      {phase !== 'expanding' && (
        <div className={styles.wordmark}>
          {WORD.split('').map((char, i) => (
            i === 1 ? (
              <span key={i} className={styles.oWrap}>
                <span className={`${styles.oLetter} ${typed > i ? styles.bounceIn : ''}`}>
                  {char}
                </span>
              </span>
            ) : (
              <span key={i} className={`${styles.char} ${typed > i ? styles.visible : ''}`}>
                {char}
              </span>
            )
          ))}
        </div>
      )}
      <div className={`${styles.circle} ${phase === 'expanding' ? styles.grow : ''}`} />
    </div>
  )
}
