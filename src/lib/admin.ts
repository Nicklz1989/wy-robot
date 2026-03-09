import { supabaseAdmin } from '@/lib/supabase';
import type { Admin, LoginRequest } from '@/types';

// 使用明文密码验证（部署环境兼容性更好）
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Nicklz';
const ADMIN_PASSWORD = 'Nicklz123';

export async function verifyLogin(credentials: LoginRequest): Promise<Admin | null> {
  console.log('Attempting login:', credentials.username);
  console.log('Expected username:', ADMIN_USERNAME);
  console.log('Expected password:', ADMIN_PASSWORD);
  console.log('Input password:', credentials.password);

  // 简单的明文密码验证
  if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
    console.log('Login successful');
    return {
      id: 'admin-id',
      username: ADMIN_USERNAME,
      password_hash: '',
      created_at: new Date().toISOString()
    };
  }

  console.log('Login failed');
  return null;
}

export async function changePassword(
  username: string,
  newPassword: string
): Promise<void> {
  // 暂不支持在线修改密码，需要在环境变量中修改
  throw new Error('密码修改功能暂不可用，请联系管理员');
}

export async function createAdmin(username: string, password: string): Promise<Admin> {
  throw new Error('创建管理员功能暂不可用');
}

export async function getAdmin(username: string): Promise<Admin | null> {
  if (username === ADMIN_USERNAME) {
    return {
      id: 'admin-id',
      username: ADMIN_USERNAME,
      password_hash: '',
      created_at: new Date().toISOString()
    };
  }
  return null;
}
