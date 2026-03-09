import { NextRequest, NextResponse } from 'next/server';
import { chatWithKimi } from '@/lib/kimi';
import { getAllKnowledge } from '@/lib/knowledge';
import { ratelimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || '127.0.0.1';
    
    if (ratelimit) {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: '请求过于频繁，请稍后重试' },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的消息内容' },
        { status: 400 }
      );
    }

    // 获取全部知识库内容
    const allKnowledge = await getAllKnowledge();
    const contextKnowledge = allKnowledge.map(
      item => `[${item.category}] ${item.title}\n${item.content}`
    );

    const aiResponse = await chatWithKimi(message, contextKnowledge);

    return NextResponse.json({
      success: true,
      message: aiResponse,
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('KIMI_KEY')) {
        return NextResponse.json(
          { error: 'AI 服务配置错误，请联系管理员' },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}
