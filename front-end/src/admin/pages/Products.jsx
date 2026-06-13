import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, Pencil, Plus, Search, Tags, Trash2 } from 'lucide-react';
import { authApi } from '../../lib/api';
import { mediaUrl } from '../../lib/mediaUrl';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';
import { normalizeList } from '../utils';

const PAGE_SIZE = 8;

const emptyForm = {
  title: '',
  desc: '',
  category: '',
  image: '',
  price: '',
  currency: 'USD',
  features: '',
  specs: '',
  category_id: '',
  is_published: true,
  sort_order: 0,
};

const emptyCategoryForm = {
  name: '',
  slug: '',
};

function productPrice(product) {
  return Number(product.meta?.price ?? product.price ?? 0);
}

function productCurrency(product) {
  return product.meta?.currency ?? product.currency ?? 'USD';
}

function listToText(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}

function textToList(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function ProductThumb({ product }) {
  const [failed, setFailed] = useState(false);
  const image = product.image_url || product.image;

  if (!image || failed) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400">
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={mediaUrl(image)}
      alt={product.title}
      className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authApi('GET', '/content?type=product');
      setProducts(normalizeList(result.data ?? result));
    } catch (err) {
      setError(err.message || 'Products could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const result = await authApi('GET', '/categories?type=product');
      setCategories(normalizeList(result));
    } catch (err) {
      setCategoryError(err.message || 'Product categories could not be loaded.');
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await loadProducts();
      await loadCategories();
    };

    void load();
  }, [loadCategories, loadProducts]);

  const categoryNames = useMemo(() => categories.map((category) => category.name).filter(Boolean).sort(), [categories]);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = !search || [product.title, product.desc, product.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search));
      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'published' && product.is_published)
        || (statusFilter === 'draft' && !product.is_published);
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, products, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      title: product.title ?? '',
      desc: product.desc ?? '',
      category: product.category ?? '',
      category_id: product.category_id ?? '',
      image: product.image ?? '',
      price: productPrice(product) || '',
      currency: productCurrency(product),
      features: listToText(product.meta?.features ?? product.features),
      specs: listToText(product.meta?.specs ?? product.specs),
      is_published: product.is_published ?? true,
      sort_order: product.sort_order ?? 0,
    });
    setError('');
    setModalOpen(true);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateCategoryForm = (field, value) => {
    setCategoryForm((current) => ({ ...current, [field]: value }));
  };

  const selectCategory = (categoryId) => {
    const category = categories.find((item) => String(item.id) === String(categoryId));

    setForm((current) => ({
      ...current,
      category_id: categoryId,
      category: category?.name ?? '',
    }));
  };

  const buildPayload = () => ({
    type: 'product',
    title: form.title.trim(),
    desc: form.desc.trim(),
    category: form.category.trim(),
    category_id: form.category_id || null,
    image: form.image.trim(),
    is_published: form.is_published,
    sort_order: Number(form.sort_order) || 0,
    meta: {
      price: form.price === '' ? 0 : Number(form.price),
      currency: form.currency.trim() || 'USD',
      features: textToList(form.features),
      specs: textToList(form.specs),
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const body = buildPayload();

      if (editing) {
        await authApi('PUT', `/content/${editing.id}`, body);
      } else {
        await authApi('POST', '/content', body);
      }

      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Product could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    setSavingCategory(true);
    setCategoryError('');

    try {
      const name = categoryForm.name.trim();
      await authApi('POST', '/categories', {
        name,
        slug: categoryForm.slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        type: 'product',
      });

      setCategoryForm(emptyCategoryForm);
      setCategoryModalOpen(false);
      await loadCategories();
    } catch (err) {
      setCategoryError(err.message || 'Category could not be saved.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete product "${product.title}"?`)) return;

    setDeletingId(product.id);
    setError('');

    try {
      await authApi('DELETE', `/content/${product.id}`);
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Product could not be deleted.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage shop products, pricing, and images</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {(error || categoryError) && !modalOpen && !categoryModalOpen && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || categoryError}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search products"
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All categories</option>
            {categoryNames.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                visibleProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ProductThumb product={product} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">{product.title}</p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{product.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category || '-'}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {productCurrency(product)} {productPrice(product).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          product.is_published
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {product.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label={`Delete ${product.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {visibleProducts.length} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Product' : 'Add Product'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              value={form.title}
              onChange={(event) => updateForm('title', event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.desc}
              onChange={(event) => updateForm('desc', event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <div className="flex gap-2">
                <select
                  value={form.category_id}
                  onChange={(event) => selectCategory(event.target.value)}
                  required
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryError('');
                    setCategoryModalOpen(true);
                  }}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 px-3 text-gray-600 transition hover:bg-gray-50"
                  aria-label="Add product category"
                >
                  <Tags className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(event) => updateForm('sort_order', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => updateForm('price', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Currency</label>
              <input
                value={form.currency}
                onChange={(event) => updateForm('currency', event.target.value.toUpperCase())}
                maxLength={10}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <ImageUpload
            label="Product Image"
            value={form.image}
            onChange={(value) => updateForm('image', value)}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Included Features
            </label>
            <textarea
              value={form.features}
              onChange={(event) => updateForm('features', event.target.value)}
              rows={4}
              placeholder="One feature per line"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Product Details / Specs
            </label>
            <textarea
              value={form.specs}
              onChange={(event) => updateForm('specs', event.target.value)}
              rows={4}
              placeholder="One detail per line"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(event) => updateForm('is_published', event.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Published
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={categoryModalOpen}
        title="Add Product Category"
        onClose={() => setCategoryModalOpen(false)}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          {categoryError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {categoryError}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category Name</label>
            <input
              value={categoryForm.name}
              onChange={(event) => updateCategoryForm('name', event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
            <input
              value={categoryForm.slug}
              onChange={(event) => updateCategoryForm('slug', event.target.value)}
              placeholder="Auto-generated if blank"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingCategory}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {savingCategory ? 'Saving...' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
