'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './logs.module.css';

interface LogItem {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  operator: string | null;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  'login': '登录',
  'logout': '退出',
  'create_knowledge': '创建知识',
  'update_knowledge': '更新知识',
  'delete_knowledge': '删除知识',
  'change_password': '修改密码',
};

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getActionLabel = (action: string) => {
    return ACTION_LABELS[action] || action;
  };

  const filteredLogs = filter
    ? logs.filter(log => log.action.includes(filter) || (log.operator && log.operator.includes(filter)))
    : logs;

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        加载中...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/logo.svg" alt="Logo" className={styles.logo} />
          <h1 className={styles.title}>操作日志</h1>
        </div>
        <button className={styles.backBtn} onClick={() => router.push('/admin')}>
          返回首页
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <input
            type="text"
            className={styles.filterInput}
            placeholder="筛选操作类型或操作人..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>时间</th>
                <th>操作类型</th>
                <th>操作人</th>
                <th>详情</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.created_at)}</td>
                  <td>
                    <span className={styles.actionTag}>{getActionLabel(log.action)}</span>
                  </td>
                  <td>{log.operator || '-'}</td>
                  <td className={styles.details}>
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className={styles.empty}>
              暂无操作日志
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
