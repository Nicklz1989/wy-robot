import { NextRequest, NextResponse } from 'next/server';
import { verifyLogin } from '@/lib/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '请提供用户名和密码' },
        { status: 400 }
      );
    }

    const admin = await verifyLogin({ username, password });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${admin.id}:${admin.username}`).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      username: admin.username,
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
