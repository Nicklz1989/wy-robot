import { supabaseAdmin } from '@/lib/supabase';
import type { OperationLog } from '@/types';

export async function createLog(
  action: string,
  details: Record<string, unknown> | null = null,
  operator: string | null = null
): Promise<OperationLog> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized');

  const { data, error } = await supabaseAdmin
    .from('operation_logs')
    .insert({
      action,
      details,
      operator
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getLogs(options?: {
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<OperationLog[]> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized');

  let query = supabaseAdmin
    .from('operation_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.action) {
    query = query.eq('action', options.action);
  }

  if (options?.startDate) {
    query = query.gte('created_at', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('created_at', options.endDate);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function getLogCount(options?: {
  action?: string;
  startDate?: string;
  endDate?: string;
}): Promise<number> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized');

  let query = supabaseAdmin
    .from('operation_logs')
    .select('*', { count: 'exact', head: true });

  if (options?.action) {
    query = query.eq('action', options.action);
  }

  if (options?.startDate) {
    query = query.gte('created_at', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('created_at', options.endDate);
  }

  const { count, error } = await query;
  
  if (error) throw error;
  return count || 0;
}
