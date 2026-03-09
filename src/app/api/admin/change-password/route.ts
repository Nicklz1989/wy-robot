import { NextRequest, NextResponse } from 'next/server';
import { changePassword, verifyLogin } from '@/lib/admin';
import { createLog } from '@/lib/logs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: '请提供当前密码和新密码' },
        { status: 400 }
      );
    }

    // 从请求头获取 token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    let username: string;

    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const parts = decoded.split(':');
      if (parts.length < 2) {
        throw new Error('Invalid token');
      }
      username = parts[1];
    } catch {
      return NextResponse.json(
        { success: false, error: '无效的登录凭证' },
        { status: 401 }
      );
    }

    // 验证当前密码
    const admin = await verifyLogin({ username, password: currentPassword });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: '当前密码错误' },
        { status: 401 }
      );
    }

    // 修改密码
    await changePassword(username, newPassword);

    // 记录日志
    await createLog('change_password', { username }, username);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password API error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
