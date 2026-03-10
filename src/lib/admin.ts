import { supabaseAdmin } from '@/lib/supabase';
import type { Admin, LoginRequest } from '@/types';
import bcrypt from 'bcryptjs';

// 临时使用明文密码验证（仅用于调试）
const TEMP_PASSWORD = 'Nicklz123';

export async function verifyLogin(credentials: LoginRequest): Promise<Admin | null> {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized');
    throw new Error('Supabase admin client not initialized');
  }

  console.log('Attempting login:', credentials.username);

  const { data: admins, error } = await supabaseAdmin
    .from('admins')
    .select('*')
    .eq('username', credentials.username)
    .limit(1);

  if (error) {
    console.error('Database error:', error);
    return null;
  }

  if (!admins || admins.length === 0) {
    console.log('User not found');
    return null;
  }

  const admin = admins[0];
  console.log('Found admin:', admin.username);
  console.log('Stored hash:', admin.password_hash);
  console.log('Input password:', credentials.password);

  // 先尝试明文密码（临时方案）
  if (credentials.password === TEMP_PASSWORD) {
    console.log('Plain text password match');
    return admin;
  }

  // 再尝试 bcrypt 验证
  try {
    const isValid = await bcrypt.compare(credentials.password, admin.password_hash);
    console.log('Bcrypt validation result:', isValid);
    return isValid ? admin : null;
  } catch (e) {
    console.error('Bcrypt error:', e);
    return null;
  }
}

export async function changePassword(
  username: string,
  newPassword: string
): Promise<void> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  const { error } = await supabaseAdmin
    .from('admins')
    .update({ password_hash: passwordHash })
    .eq('username', username);

  if (error) throw error;
}

export async function createAdmin(username: string, password: string): Promise<Admin> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized');

  const passwordHash = await bcrypt.hash(password, 10);
  
  const { data, error } = await supabaseAdmin
    .from('admins')
    .insert({
      username,
      password_hash: passwordHash
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAdmin(username: string): Promise<Admin | null> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized');

  const { data, error } = await supabaseAdmin
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();

  if (error) return null;
  return data;
}
