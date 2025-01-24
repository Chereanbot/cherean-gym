import { useState } from 'react';
import { FaEye, FaEyeSlash, FaExclamationCircle, FaChevronDown } from 'react-icons/fa';

export function Input({
    label,
    name,
    type = 'text',
    value = '',
    onChange,
    placeholder,
    error,
    className = '',
    disabled = false
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full px-3 py-2 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        ${disabled ? 'bg-gray-100' : ''}
                        ${error ? 'border-red-300' : ''}
                    `}
                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function TextArea({
    label,
    value = '',
    onChange,
    placeholder,
    error,
    className = '',
    rows = 4
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`
                    w-full px-3 py-2 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    ${error ? 'border-red-300' : ''}
                `}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function Select({
    label,
    value = '',
    onChange,
    options = [],
    placeholder,
    error,
    className = ''
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
                        w-full px-3 py-2 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        appearance-none
                        ${error ? 'border-red-300' : ''}
                    `}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaChevronDown className="text-gray-400" />
                </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function FileInput({
    label,
    onChange,
    accept,
    error,
    className = ''
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                type="file"
                onChange={onChange}
                accept={accept}
                className={`
                    block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100
                    ${error ? 'border-red-300' : ''}
                `}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
} 