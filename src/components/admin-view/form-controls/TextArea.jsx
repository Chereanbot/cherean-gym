import { useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  helper,
  required,
  rows = 3,
  maxLength,
  className = '',
  disabled = false,
  showCount = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value?.length || 0;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`
            block w-full rounded-lg shadow-sm px-4 py-2
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            transition-all duration-200
            ${isFocused ? 'ring-2' : ''}
          `}
          {...props}
        />

        {error && (
          <div className="absolute top-2 right-2">
            <FaExclamationCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        {(error || helper) && (
          <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helper}
          </p>
        )}
        
        {showCount && (
          <p className="text-sm text-gray-500">
            {characterCount}{maxLength ? `/${maxLength}` : ''} characters
          </p>
        )}
      </div>
    </div>
  );
} 