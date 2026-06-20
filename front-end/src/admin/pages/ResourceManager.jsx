import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { authApi } from '../../lib/api';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';
import { normalizeId, normalizeList } from '../utils';
import { cmsResources } from '../config/resources';

function buildEmptyForm(fields) {
  return fields.reduce((form, field) => {
    if (field.default !== undefined) form[field.key] = field.default;
    else if (field.type === 'checkbox') form[field.key] = false;
    else if (field.type === 'number') form[field.key] = 0;
    else form[field.key] = '';
    return form;
  }, {});
}

function buildResourcePath(config) {
  if (!config?.query) return config?.endpoint;

  const params = new URLSearchParams(config.query);
  return `${config.endpoint}?${params.toString()}`;
}

function FieldInput({ field, value, onChange, optionsMap }) {
  const commonClass =
    'w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500';

  if (field.type === 'textarea') {
    return (
      <textarea
        rows={4}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={commonClass}
        required={field.required}
      />
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        Active / Published
      </label>
    );
  }

  if (field.type === 'select') {
    const options = field.optionsEndpoint
      ? optionsMap[field.key] ?? []
      : (field.options ?? []).map((option) => ({ id: option, name: option }));

    return (
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={commonClass}
        required={field.required}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name ?? option.title ?? option.id}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      value={value ?? ''}
      onChange={(e) =>
        onChange(field.type === 'number' ? e.target.value : e.target.value)
      }
      className={commonClass}
      required={field.required}
    />
  );
}

export default function ResourceManager() {
  const { resourceKey } = useParams();
  const config = cmsResources[resourceKey];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [optionsMap, setOptionsMap] = useState({});

  const fields = useMemo(() => config?.fields ?? [], [config]);
  const columns = useMemo(() => config?.columns ?? [], [config]);

  const loadItems = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      const result = await authApi('GET', buildResourcePath(config));
      setItems(normalizeList(result.data ?? result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [config]);

  const loadSelectOptions = useCallback(async () => {
    if (!config) return;

    const selectFields = fields.filter((field) => field.optionsEndpoint);
    const entries = await Promise.all(
      selectFields.map(async (field) => {
        try {
          const result = await authApi('GET', field.optionsEndpoint);
          const list = normalizeList(result.data ?? result).map((item) =>
            normalizeId({
              id: item.id,
              name: item[field.optionLabel] ?? item.name ?? item.title,
              title: item.title,
            }),
          );
          return [field.key, list];
        } catch {
          return [field.key, []];
        }
      }),
    );

    setOptionsMap(Object.fromEntries(entries));
  }, [config, fields]);

  useEffect(() => {
    loadItems();
    loadSelectOptions();
  }, [loadItems, loadSelectOptions]);

  if (!config) {
    return <div className="text-red-600">Unknown resource: {resourceKey}</div>;
  }

  const openCreate = () => {
    setEditing(null);
    setForm({ ...buildEmptyForm(fields), ...(config.defaults ?? {}) });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    const nextForm = buildEmptyForm(fields);
    fields.forEach((field) => {
      nextForm[field.key] = item[field.key] ?? (field.type === 'checkbox' ? false : '');
    });
    setForm(nextForm);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const body = { ...(config.defaults ?? {}), ...form };
      fields.forEach((field) => {
        if (field.type === 'number' && body[field.key] !== '') {
          body[field.key] = Number(body[field.key]);
        }
        if (body[field.key] === '') {
          body[field.key] = null;
        }
      });

      if (editing) {
        await authApi('PUT', `${config.endpoint}/${editing.id}`, body);
      } else {
        await authApi('POST', config.endpoint, body);
      }

      setModalOpen(false);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const singularLabel = config.singularLabel ?? config.label.slice(0, -1);
    if (!window.confirm(`Delete this ${singularLabel.toLowerCase()}?`)) return;

    try {
      await authApi('DELETE', `${config.endpoint}/${item.id}`);
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderCell = (item, column) => {
    const value = item[column];
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';

    const relatedField = fields.find((field) => field.key === column && field.type === 'select');
    if (relatedField && value != null && value !== '') {
      const options = relatedField.optionsEndpoint
        ? optionsMap[column] ?? []
        : (relatedField.options ?? []).map((option) => ({ id: option, name: option }));
      const match = options.find((option) => String(option.id) === String(value));
      if (match) return match.name ?? match.title ?? String(value);
    }

    if (value == null || value === '') return '-';
    return String(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.label}</h1>
          <p className="text-gray-500 mt-1">Manage {config.label.toLowerCase()} via API</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add {config.singularLabel ?? config.label.slice(0, -1)}
        </button>
      </div>

      {error && !modalOpen && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-gray-500">
              {columns.map((column) => (
                <th key={column} className="px-6 py-4 font-medium capitalize">
                  {column.replace(/_/g, ' ')}
                </th>
              ))}
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-400">
                  No records yet
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                  {columns.map((column) => (
                    <td key={column} className="px-6 py-4 text-gray-700 max-w-xs truncate">
                      {renderCell(item, column)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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

      <Modal
        open={modalOpen}
        title={editing ? `Edit ${config.singularLabel ?? config.label.slice(0, -1)}` : `Add ${config.singularLabel ?? config.label.slice(0, -1)}`}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {fields.map((field) => (
            <div key={field.key}>
              {field.type === 'image' ? (
                <ImageUpload
                  label={field.label}
                  value={form[field.key]}
                  onChange={(value) => setForm({ ...form, [field.key]: value })}
                />
              ) : (
                <>
                  {field.type !== 'checkbox' && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                  )}
                  <FieldInput
                    field={field}
                    value={form[field.key]}
                    onChange={(value) => setForm({ ...form, [field.key]: value })}
                    optionsMap={optionsMap}
                  />
                </>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg font-medium"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
