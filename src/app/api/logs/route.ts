import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabaseAdmin
      .from('operation_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (action) {
      query = query.eq('action', action);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: '获取日志失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, logs: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
