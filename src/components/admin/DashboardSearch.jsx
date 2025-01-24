import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaBlog, FaProjectDiagram, FaCode, FaEnvelope, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';

const getTypeIcon = (type) => {
  switch (type) {
    case 'blog': return FaBlog;
    case 'project': return FaProjectDiagram;
    case 'service': return FaCode;
    case 'message': return FaEnvelope;
    default: return FaSearch;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'blog': return 'text-blue-500';
    case 'project': return 'text-green-500';
    case 'service': return 'text-purple-500';
    case 'message': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
};

export default function DashboardSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch();
    } else {
      setResults(null);
    }
  }, [debouncedQuery]);

  const performSearch = async () => {
    if (!debouncedQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(debouncedQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search content..."
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {showResults && (query || loading) && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : results?.items?.length > 0 ? (
            <div className="py-2">
              {Object.entries(results.grouped).map(([type, items]) => (
                <div key={type}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                    {type.toUpperCase()}
                  </div>
                  {items.map((item) => {
                    const Icon = getTypeIcon(type);
                    const colorClass = getTypeColor(type);
                    const href = type === 'message' 
                      ? `/admin/messages` 
                      : `/admin/${type}/${item.slug || ''}`;

                    return (
                      <Link
                        key={item._id}
                        href={href}
                        className="block px-4 py-2 hover:bg-gray-50"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${colorClass}`} />
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 