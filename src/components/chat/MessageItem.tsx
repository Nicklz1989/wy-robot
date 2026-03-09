'use client';

import styles from './MessageItem.module.css';

interface MessageItemProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function MessageItem({ role, content, timestamp }: MessageItemProps) {
  const isUser = role === 'user';
  
  return (
    <div className={`${styles.messageItem} ${isUser ? styles.userMessage : styles.aiMessage}`}>
      <div className={styles.avatar}>
        {isUser ? '👤' : '🤖'}
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.bubble}>
          <p className={styles.text}>{content}</p>
        </div>
        {timestamp && (
          <span className={styles.timestamp}>
            {new Date(timestamp).toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
    </div>
  );
}
