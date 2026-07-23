'use client'

import { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

export default function SplashScreen() {
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('bouncing'), 400)
    const t2 = setTimeout(() => setPhase('assembled'), 1000)
    const t3 = setTimeout(() => setPhase('expanding'), 1500)
    const t4 = setTimeout(() => setPhase('done'), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <div className={`${styles.splash} ${phase === 'done' ? styles.hidden : ''}`}>
      <div className={styles.wordmark}>
        <span className={styles.char}>C</span>
        <span className={styles.oWrap}>
          <span
            className={`${styles.oLetter} ${
              phase === 'bouncing' || phase === 'assembled' ? styles.bounceIn : ''
            } ${phase === 'expanding' ? styles.fadeOut : ''}`}
          >
            o
          </span>
          <span
            className={`${styles.circle} ${phase === 'expanding' ? styles.grow : ''}`}
          />
        </span>
        <span className={styles.char}>deQuest</span>
      </div>
    </div>
  )
}
