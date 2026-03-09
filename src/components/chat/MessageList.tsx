'use client';

import { useEffect, useRef } from 'react';
import styles from './MessageList.module.css';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={styles.messageList} ref={listRef}>
        <div className={styles.welcomeMessage}>
          <div className={styles.welcomeIcon}>🤖</div>
          <div className={styles.welcomeTitle}>你好，我是往约智能助手</div>
          <div className={styles.welcomeDesc}>
            可以咨询平台规则、服务流程、注意事项等问题，我会尽力为你解答
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.messageList} ref={listRef}>
      {messages.map((message) => (
        <div key={message.id} className={`${styles.messageItem} ${styles[message.role]}`}>
          <div className={`${styles.avatar} ${styles[message.role]}`}>
            {message.role === 'user' ? '👤' : '🤖'}
          </div>
          <div>
            <div className={styles.messageContent}>
              {message.content}
            </div>
            <div className={styles.time}>
              {formatTime(message.createdAt)}
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className={`${styles.messageItem} ${styles.ai}`}>
          <div className={`${styles.avatar} ${styles.ai}`}>🤖</div>
          <div className={styles.loading}>
            <span className={styles.loadingDot}></span>
            <span className={styles.loadingDot}></span>
            <span className={styles.loadingDot}></span>
            思考中...
          </div>
        </div>
      )}
    </div>
  );
}
