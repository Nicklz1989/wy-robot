'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const decoded = atob(token);
      const parts = decoded.split(':');
      if (parts.length >= 2) {
        setUsername(parts[1]);
      }
    } catch {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

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
          <h1 className={styles.title}>管理后台</h1>
        </div>
        <div className={styles.userSection}>
          <span className={styles.username}>{username}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            退出
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.card} onClick={() => router.push('/admin/knowledge')}>
            <div className={styles.cardIcon}>📚</div>
            <h3>知识库管理</h3>
            <p>管理平台的问答知识内容，包括添加、编辑、删除知识条目</p>
            <button className={styles.cardBtn}>进入管理</button>
          </div>

          <div className={styles.card} onClick={() => router.push('/admin/logs')}>
            <div className={styles.cardIcon}>📋</div>
            <h3>操作日志</h3>
            <p>查看系统操作记录，支持按时间范围和操作类型筛选</p>
            <button className={styles.cardBtn}>查看日志</button>
          </div>

          <div className={styles.card} onClick={() => router.push('/admin/settings')}>
            <div className={styles.cardIcon}>⚙️</div>
            <h3>系统设置</h3>
            <p>修改登录密码等系统配置</p>
            <button className={styles.cardBtn}>进入设置</button>
          </div>
        </div>
      </main>
    </div>
  );
}
