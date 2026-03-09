'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './settings.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }

    if (newPassword.length < 6) {
      setError('新密码长度至少为6位');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('密码修改成功，请重新登录');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // 3秒后退出登录
        setTimeout(() => {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        }, 3000);
      } else {
        setError(data.error || '密码修改失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/logo.svg" alt="Logo" className={styles.logo} />
          <h1 className={styles.title}>系统设置</h1>
        </div>
        <button className={styles.backBtn} onClick={() => router.push('/admin')}>
          返回首页
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2>修改密码</h2>
          
          {message && <div className={styles.success}>{message}</div>}
          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>当前密码</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="请输入当前密码"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>新密码</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码（至少6位）"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>确认新密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码"
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? '保存中...' : '保存修改'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
