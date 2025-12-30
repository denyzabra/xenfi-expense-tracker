'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/utils/api-client';
import { Category } from '@/types';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import ConfirmModal from '@/components/ConfirmModal';

export default function CategoriesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; category: Category | null }>({
    show: false,
    category: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366F1',
  });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await api.get<{ status: string; data: { categories: Category[] } }>('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color || '#6366F1',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', color: '#6366F1' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#6366F1' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        showToast('Category updated successfully!', 'success');
      } else {
        await api.post('/categories', formData);
        showToast('Category created successfully!', 'success');
      }
      handleCloseModal();
      fetchCategories();
    } catch (error: any) {
      showToast(error.message || 'Failed to save category', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.category) return;
    try {
      await api.delete(`/categories/${deleteConfirm.category.id}`);
      showToast('Category deleted successfully!', 'success');
      setDeleteConfirm({ show: false, category: null });
      fetchCategories();
    } catch (error: any) {
      showToast(error.message || 'Failed to delete category', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-text-secondary mt-1">Manage your expense categories</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus size={18} />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-card-dark border border-border-dark rounded-xl p-5 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Tag size={20} style={{ color: category.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  {category.description && (
                    <p className="text-xs text-text-muted mt-0.5">{category.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleOpenModal(category)}
                className="flex-1 flex items-center justify-center gap-2 bg-card-elevated hover:bg-primary/10 text-text-secondary hover:text-primary px-3 py-2 rounded-lg text-xs font-medium transition-all"
              >
                <Edit2 size={14} />
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirm({ show: true, category })}
                className="flex-1 flex items-center justify-center gap-2 bg-card-elevated hover:bg-error/10 text-text-secondary hover:text-error px-3 py-2 rounded-lg text-xs font-medium transition-all"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
          <p className="text-text-muted mb-4">Create your first category to organize your expenses</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <Plus size={18} />
            Create Category
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card-dark border border-border-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border-dark bg-card-elevated/30">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase block mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Food & Dining"
                  className="w-full bg-card-elevated border border-border-dark rounded-lg py-2 px-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase block mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full bg-card-elevated border border-border-dark rounded-lg py-2 px-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase block mb-2">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#6366F1"
                    className="flex-1 bg-card-elevated border border-border-dark rounded-lg py-2 px-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-card-elevated transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, category: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteConfirm.category?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
      />
    </div>
  );
}
