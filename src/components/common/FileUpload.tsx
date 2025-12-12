import { useState, useRef } from 'react';
import { Upload, X, File, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadFile, formatFileSize, validateFile, type UploadProgress, type UploadResult } from '../../services/mediaService';

interface FileUploadProps {
  value?: string; // Current file URL
  onChange: (url: string) => void;
  onUploadComplete?: (result: UploadResult) => void;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
}

const FileUpload = ({
  value,
  onChange,
  onUploadComplete,
  maxSize = 10 * 1024 * 1024, // 10MB default
  allowedTypes = [],
  className = '',
  label = 'Upload File',
  required = false,
  disabled = false,
  accept,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validation = validateFile(file, {
      maxSize,
      allowedTypes: allowedTypes.length > 0 ? allowedTypes : undefined,
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Start upload
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadFile(file, {
        onProgress: (progressData: UploadProgress) => {
          setProgress(progressData.percentage);
        },
      });

      setUploadedFile(result);
      onChange(result.url);

      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
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
        {!uploadedFile && !value ? (
          <div
            onClick={handleClick}
            className={`
              relative border-2 border-dashed rounded-lg p-6
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
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || uploading}
            />

            <div className="flex flex-col items-center justify-center text-center">
              {uploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-green-ecco animate-spin mb-3" />
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
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-white font-semibold mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">
                    Max size: {formatFileSize(maxSize)}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <File className="w-8 h-8 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">
                    {uploadedFile?.filename || 'Uploaded file'}
                  </p>
                  {uploadedFile && (
                    <p className="text-sm text-gray-400">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  )}
                </div>
              </div>
              {!disabled && !uploading && (
                <button
                  onClick={handleRemove}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {uploading && (
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-ecco h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1 text-center">{progress}%</p>
              </div>
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
        {uploadedFile && !uploading && !error && (
          <div className="flex items-center gap-2 text-green-ecco text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>File uploaded successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

