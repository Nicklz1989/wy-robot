'use client';

import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  logoSrc?: string;
  onHistoryClick: () => void;
}

export default function ChatHeader({ logoSrc, onHistoryClick }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        {logoSrc ? (
          <img src={logoSrc} alt="Logo" className={styles.logo} />
        ) : (
          <div className={styles.logo} style={{
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--color-text)'
          }}>
            往
          </div>
        )}
        <h1 className={styles.title}>往约智能问答系统</h1>
      </div>
      <button className={styles.historyButton} onClick={onHistoryClick} title="历史记录">
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      </button>
    </header>
  );
}
