import { useEffect, useState } from 'react';
import { ImageOff, Upload } from 'lucide-react';
import { uploadFile } from '../../lib/api';
import { mediaUrl } from '../../lib/mediaUrl';

export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [localPreview, setLocalPreview] = useState('');

  useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    if (localPreview) URL.revokeObjectURL(localPreview);

    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploading(true);
    setError('');
    setPreviewError(false);

    try {
      const result = await uploadFile(file);
      onChange(result.path);
      URL.revokeObjectURL(preview);
      setLocalPreview('');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-3 items-start">
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-700">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload from computer'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        <input
          value={value || ''}
          onChange={(e) => {
            setPreviewError(false);
            onChange(e.target.value);
          }}
          placeholder="Or paste image URL"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      {(localPreview || value) && (
        <div className="mt-3">
          {previewError ? (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400">
              <ImageOff className="h-6 w-6" />
            </div>
          ) : (
            <img
              src={localPreview || mediaUrl(value)}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-lg border"
              onError={() => setPreviewError(true)}
            />
          )}
          <p className="mt-1 text-xs text-gray-500 break-all">
            {localPreview ? 'Local preview, uploading...' : mediaUrl(value)}
          </p>
        </div>
      )}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
