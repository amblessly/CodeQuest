'use client'

import { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

export default function SplashScreen() {
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    const shown = sessionStorage.getItem('cqsplash')
    if (shown) { setPhase('done'); return }
    sessionStorage.setItem('cqsplash', '1')

    const t1 = setTimeout(() => setPhase('expanding'), 900)
    const t2 = setTimeout(() => setPhase('done'), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className={`${styles.splash} ${phase === 'done' ? styles.hidden : ''}`}>
      <div className={styles.wordmark}>
        <span className={`${styles.char} ${phase !== 'idle' ? styles.charFade : ''}`}>C</span>
        <span className={styles.oWrap}>
          <span className={`${styles.char} ${styles.oLetter} ${phase !== 'idle' ? styles.charFade : ''}`}>o</span>
          <span className={`${styles.circle} ${phase !== 'idle' ? styles.grow : ''}`} />
        </span>
        <span className={`${styles.char} ${phase !== 'idle' ? styles.charFade : ''}`}>deQuest</span>
      </div>
    </div>
  )
}
