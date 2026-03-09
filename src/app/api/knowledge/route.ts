import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 获取所有知识库内容
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: '获取数据失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, items: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 创建新知识
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, title, content } = body;

    if (!category || !title || !content) {
      return NextResponse.json(
        { success: false, error: '请填写完整信息' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert({
        category,
        title,
        content,
        version: 1,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: '创建失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
