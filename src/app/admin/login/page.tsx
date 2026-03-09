'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin');
      } else {
        setError(data.error || '登录失败');
      }
    } catch {
      setError('网络错误，请稍后重试');
    }
  };

  return <LoginForm onLogin={handleLogin} error={error} />;
}
