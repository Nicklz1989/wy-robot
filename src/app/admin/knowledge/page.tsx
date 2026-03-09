'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './knowledge.module.css';

interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  content: string;
  version: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: '平台规则', label: '平台规则' },
  { value: '服务流程', label: '服务流程' },
  { value: '注意事项', label: '注意事项' },
  { value: '突发事件', label: '突发事件' },
  { value: '其他', label: '其他' },
];

export default function KnowledgeManagement() {
  const router = useRouter();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [formData, setFormData] = useState({
    category: '平台规则',
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const response = await fetch('/api/knowledge');
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingItem 
      ? `/api/knowledge/${editingItem.id}` 
      : '/api/knowledge';
    
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ category: '平台规则', title: '', content: '' });
        fetchKnowledge();
      } else {
        alert(data.error || '操作失败');
      }
    } catch (error) {
      alert('网络错误，请稍后重试');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条知识吗?')) return;

    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchKnowledge();
      } else {
        alert(data.error || '删除失败');
      }
    } catch (error) {
      alert('网络错误，请稍后重试');
    }
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      title: item.title,
      content: item.content,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ category: '平台规则', title: '', content: '' });
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        加载中...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/logo.svg" alt="Logo" className={styles.logo} />
          <h1 className={styles.title}>知识库管理</h1>
        </div>
        <button className={styles.backBtn} onClick={() => router.push('/admin')}>
          返回首页
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <button className={styles.addBtn} onClick={handleAdd}>
            + 添加内容
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>分类</th>
                <th>标题</th>
                <th>版本</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={`${styles.category} ${styles[item.category]}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className={styles.titleCell}>{item.title}</td>
                  <td>v{item.version}</td>
                  <td>{formatDate(item.updated_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => handleEdit(item)}
                      >
                        编辑
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(item.id)}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {items.length === 0 && (
            <div className={styles.empty}>
              暂无知识库内容，点击"添加内容"创建
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? '编辑知识' : '添加知识'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入标题"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入内容"
                  rows={8}
                  required
                />
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  取消
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingItem ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
