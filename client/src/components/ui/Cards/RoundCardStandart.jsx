import React from 'react'
import styles from "src/components/ui/Cards/Cards.module.css"
import placeholderImage from "src/components/ui/Cards/placeholder.png"

export default function RoundCardStandart() {
  return (
    <div className={styles.outerCircle}>
        <div className={styles.innerCircle}>
            <img className={styles.maskedImage} src="" alt="" />
        </div>
    </div>
  )
}
