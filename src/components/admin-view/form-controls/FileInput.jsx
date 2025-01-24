import { useState, useRef } from 'react';
import { FaUpload, FaFile, FaImage, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Image from 'next/image';

export default function FileInput({
  label,
  name,
  onChange,
  accept,
  error,
  helper,
  required,
  className = '',
  disabled = false,
  preview = true,
  maxSize = 5, // in MB
  currentFile = null,
  onRemove,
  ...props
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentFile);
  const fileInputRef = useRef(null);

  const isImage = accept?.includes('image');

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      onChange({ target: { name, value: null } }, new Error(`File size must be less than ${maxSize}MB`));
      return;
    }

    // Create preview URL for images
    if (preview && isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    onChange({ target: { name, value: file } });
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-4
          ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'}
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-green-500'}
          transition-all duration-200
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          onChange={(e) => handleFileChange(e.target.files[0])}
          accept={accept}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />

        <div className="text-center">
          {preview && previewUrl && isImage ? (
            <div className="relative inline-block">
              <Image
                src={previewUrl}
                alt="Preview"
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <>
              {isImage ? (
                <FaImage className="mx-auto h-12 w-12 text-gray-400" />
              ) : (
                <FaFile className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {isDragging ? (
                    'Drop your file here'
                  ) : (
                    <>
                      Drag and drop your file here, or{' '}
                      <span className="text-green-500">browse</span>
                    </>
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {`Maximum file size: ${maxSize}MB`}
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="absolute top-2 right-2">
            <FaExclamationCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {(error || helper) && (
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
} 