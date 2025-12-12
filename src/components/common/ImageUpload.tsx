import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadFile, compressImage, generateThumbnail, formatFileSize, validateFile, type UploadProgress, type UploadResult } from '../../services/mediaService';
import { ALLOWED_FILE_TYPES } from '../../services/mediaService';

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (url: string) => void;
  onUploadComplete?: (result: UploadResult) => void;
  maxSize?: number; // in bytes
  compress?: boolean;
  quality?: number;
  aspectRatio?: number; // width/height ratio
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const ImageUpload = ({
  value,
  onChange,
  onUploadComplete,
  maxSize = 5 * 1024 * 1024, // 5MB default
  compress = true,
  quality = 0.8,
  aspectRatio,
  className = '',
  label = 'Upload Image',
  required = false,
  disabled = false,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validation = validateFile(file, {
      maxSize,
      allowedTypes: ALLOWED_FILE_TYPES.images,
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Start upload
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadFile(file, {
        onProgress: (progressData: UploadProgress) => {
          setProgress(progressData.percentage);
        },
        compress,
        quality,
      });

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);

      // Update with uploaded URL
      onChange(result.url);
      setPreview(result.url);

      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="space-y-2">
        {/* Upload Area */}
        {!preview ? (
          <div
            onClick={handleClick}
            className={`
              relative border-2 border-dashed rounded-lg p-8
              transition-colors cursor-pointer
              ${disabled || uploading
                ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed'
                : 'border-gray-700 bg-gray-800 hover:border-green-ecco hover:bg-gray-800/80'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_FILE_TYPES.images.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || uploading}
            />

            <div className="flex flex-col items-center justify-center text-center">
              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-green-ecco animate-spin mb-4" />
                  <p className="text-white font-semibold mb-2">Uploading...</p>
                  <div className="w-full max-w-xs bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-ecco h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">{progress}%</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-white font-semibold mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, GIF, WEBP up to {formatFileSize(maxSize)}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
              <img
                src={preview}
                alt="Preview"
                className={`w-full h-auto ${aspectRatio ? 'object-cover' : ''}`}
                style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : {}}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-green-ecco animate-spin mx-auto mb-2" />
                    <p className="text-white text-sm">{progress}%</p>
                  </div>
                </div>
              )}
              {!disabled && !uploading && (
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            {!uploading && (
              <button
                onClick={handleClick}
                disabled={disabled}
                className="mt-2 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Change Image
              </button>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {preview && !uploading && !error && (
          <div className="flex items-center gap-2 text-green-ecco text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Image uploaded successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

