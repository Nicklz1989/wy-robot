import { supabase } from '@/lib/supabase';
import type { KnowledgeItem, KnowledgeCreateRequest, KnowledgeUpdateRequest } from '@/types';

export async function getAllKnowledge(): Promise<KnowledgeItem[]> {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getKnowledgeById(id: string): Promise<KnowledgeItem | null> {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getKnowledgeByCategory(category: string): Promise<KnowledgeItem[]> {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function searchKnowledge(query: string): Promise<KnowledgeItem[]> {
  // 获取所有知识库内容，然后在服务端进行匹配
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*');
  
  if (error) throw error;
  
  const allItems = data || [];
  const queryLower = query.toLowerCase();
  
  // 简单的关键词匹配
  const matchedItems = allItems.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(queryLower);
    const contentMatch = item.content.toLowerCase().includes(queryLower);
    const categoryMatch = item.category.toLowerCase().includes(queryLower);
    return titleMatch || contentMatch || categoryMatch;
  });
  
  return matchedItems;
}

export async function createKnowledge(item: KnowledgeCreateRequest): Promise<KnowledgeItem> {
  const { data, error } = await supabase
    .from('knowledge_base')
    .insert({
      category: item.category,
      title: item.title,
      content: item.content,
      version: 1
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateKnowledge(item: KnowledgeUpdateRequest): Promise<KnowledgeItem> {
  const existing = await getKnowledgeById(item.id);
  if (!existing) throw new Error('知识库条目不存在');

  const { data, error } = await supabase
    .from('knowledge_base')
    .update({
      category: item.category ?? existing.category,
      title: item.title ?? existing.title,
      content: item.content ?? existing.content,
      version: existing.version + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', item.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteKnowledge(id: string): Promise<void> {
  const { error } = await supabase
    .from('knowledge_base')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function getKnowledgeVersions(id: string): Promise<KnowledgeItem[]> {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('id', id)
    .order('version', { ascending: false });
  
  if (error) throw error;
  return data || [];
}
