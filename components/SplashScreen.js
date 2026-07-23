'use client'

import { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

const WORD = 'CodeQuest'

export default function SplashScreen() {
  const [typed, setTyped] = useState(0)
  const [showO, setShowO] = useState(false)
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    if (typed < WORD.length) {
      const t = setTimeout(() => setTyped(c => c + 1), 80)
      return () => clearTimeout(t)
    }
  }, [typed])

  useEffect(() => {
    if (typed < WORD.length) return
    const t0 = setTimeout(() => setShowO(true), 50)
    const t1 = setTimeout(() => setPhase('expanding'), 850)
    const t2 = setTimeout(() => setPhase('done'), 2500)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2) }
  }, [typed])

  return (
    <div className={`${styles.splash} ${phase === 'done' ? styles.hidden : ''}`}>
      <div className={styles.wordmark}>
        {WORD.split('').map((char, i) => (
          i === 1 ? (
            <span key={i} className={styles.oWrap}>
              <span
                className={`${styles.oLetter} ${showO ? styles.bounceIn : ''} ${phase === 'expanding' ? styles.fadeOut : ''}`}
              >
                {char}
              </span>
              <span className={`${styles.circle} ${phase === 'expanding' ? styles.grow : ''}`} />
            </span>
          ) : (
            <span key={i} className={`${styles.char} ${typed > i ? styles.visible : ''}`}>
              {char}
            </span>
          )
        ))}
      </div>
    </div>
  )
}
