import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 更新知识库内容
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { category, title, content } = body;

    // 先获取当前版本
    const { data: current, error: fetchError } = await supabase
      .from('knowledge_base')
      .select('version')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json(
        { success: false, error: '知识库条目不存在' },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_base')
      .update({
        category,
        title,
        content,
        version: current.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: '更新失败' },
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

// 删除知识库内容
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: '删除失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
