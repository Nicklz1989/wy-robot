const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const KIMI_MODEL = 'kimi-k2-turbo-preview';

interface KimiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface KimiResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chatWithKimi(
  userMessage: string,
  contextKnowledge: string[] = []
): Promise<string> {
  const apiKey = process.env.KIMI_KEY;

  if (!apiKey) {
    throw new Error('KIMI_KEY 环境变量未配置');
  }

  const knowledgeContext = contextKnowledge.length > 0 
    ? contextKnowledge.join('\n\n---\n\n')
    : '知识库中暂无内容';

  const systemPrompt = `你是一个专业的往约上门推拿平台的智能客服。

【重要】你必须根据以下提供的知识库内容来回答用户的问题。知识库中的内容是平台官方信息，必须作为首要参考。

【知识库内容】
${knowledgeContext}

【回答要求】
1. 必须从上面的知识库内容中提取相关信息回答用户问题
2. 如果知识库中有相关内容，请直接引用知识库中的信息回答
3. 回答要简洁、专业、友好
4. 只有当知识库中没有相关信息时，才建议用户联系人工客服
5. 不要编造知识库中没有的信息`;

  const messages: KimiMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: KIMI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kimi API 请求失败: ${error}`);
  }

  const data: KimiResponse = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('Kimi API 返回为空');
  }

  return data.choices[0].message.content;
}
