'use client';

import { useState, useEffect, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageList, { Message } from './MessageList';
import ChatInput from './ChatInput';
import styles from './ChatInterface.module.css';

const LOGO_PATH = '/logo.svg';
const STORAGE_KEY = 'wangyue_chat_history';

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  const saveToStorage = useCallback((newSessions: ChatSession[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: messages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '请求失败，请稍后重试');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);

      const currentSession: ChatSession = {
        id: Date.now().toString(),
        title: content.slice(0, 20) + (content.length > 20 ? '...' : ''),
        messages: [...messages, userMessage, aiMessage],
        createdAt: new Date().toISOString(),
      };

      const updatedSessions = [currentSession, ...sessions.filter((_, i) => i < 9)];
      setSessions(updatedSessions);
      saveToStorage(updatedSessions);

    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = () => {
    setHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryOpen(false);
  };

  const handleSelectHistory = (session: ChatSession) => {
    setMessages(session.messages);
    setHistoryOpen(false);
  };

  const handleClearHistory = () => {
    if (confirm('确定要清空所有聊天记录吗？')) {
      setSessions([]);
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
      setHistoryOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className={styles.container}>
      <ChatHeader logoSrc={LOGO_PATH} onHistoryClick={handleHistoryClick} />
      
      <main className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </main>

      <div 
        className={`${styles.overlay} ${historyOpen ? styles.visible : ''}`}
        onClick={handleCloseHistory}
      />

      <aside className={`${styles.historyPanel} ${historyOpen ? styles.open : ''}`}>
        <div className={styles.historyHeader}>
          <h2 className={styles.historyTitle}>聊天历史</h2>
          <button className={styles.closeButton} onClick={handleCloseHistory}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.historyContent}>
          {sessions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>
              暂无聊天记录
            </p>
          ) : (
            sessions.map((session) => (
              <div 
                key={session.id} 
                className={styles.historyItem}
                onClick={() => handleSelectHistory(session)}
              >
                <div className={styles.historyItemTitle}>{session.title}</div>
                <div className={styles.historyItemTime}>{formatDate(session.createdAt)}</div>
              </div>
            ))
          )}
        </div>
        {sessions.length > 0 && (
          <div className={styles.historyFooter}>
            <button className={styles.clearButton} onClick={handleClearHistory}>
              清空历史记录
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
