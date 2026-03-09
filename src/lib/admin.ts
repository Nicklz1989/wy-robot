import type { Admin, LoginRequest } from '@/types';

// 硬编码管理员账号（确保部署环境可用）
const ADMIN_USERNAME = 'Nicklz';
const ADMIN_PASSWORD = 'Nicklz123';

export async function verifyLogin(credentials: LoginRequest): Promise<Admin | null> {
  console.log('Login attempt:', { 
    inputUsername: credentials.username, 
    inputPassword: credentials.password,
    expectedUsername: ADMIN_USERNAME,
    expectedPassword: ADMIN_PASSWORD,
    usernameMatch: credentials.username === ADMIN_USERNAME,
    passwordMatch: credentials.password === ADMIN_PASSWORD
  });

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

  console.log('Login failed: credentials mismatch');
  return null;
}

export async function changePassword(
  username: string,
  newPassword: string
): Promise<void> {
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
