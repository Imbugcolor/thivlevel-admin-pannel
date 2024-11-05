import styles from './loading.module.css'
import React from 'react'

export default function Loading() {
    return (
        <div className={styles["loading"]}
            style={{ background: '#0008', color: 'white', top: 0, left: 0, zIndex: 1031 }}>
            <div className={styles["lds-spinner"]}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}