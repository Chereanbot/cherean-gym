import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaBlog, FaProjectDiagram, FaCode, FaEnvelope, FaTimes, FaClock, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

const getTypeIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'blog': return FaBlog;
    case 'project': return FaProjectDiagram;
    case 'service': return FaCode;
    case 'message': return FaEnvelope;
    default: return FaSearch;
  }
};

const getTypeColor = (type) => {
  switch (type.toLowerCase()) {
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
  const [recentSearches, setRecentSearches] = useState([]);
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

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const response = await fetch('/api/admin/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      const data = await response.json();
      
      if (data.success) {
        setRecentSearches(data.data);
      }
    } catch (error) {
      console.error('Error fetching recent searches:', error);
    }
  };

  const performSearch = async () => {
    if (!debouncedQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/search/ai?q=${encodeURIComponent(debouncedQuery)}`);
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

  const handleRecentSearchClick = (search) => {
    setQuery(search.query);
    performSearch();
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search content..."
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (query || !loading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          >
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
            ) : query ? (
              results?.items?.length > 0 ? (
                <div className="py-2">
                  {Object.entries(results.grouped).map(([type, items]) => items.length > 0 && (
                    <div key={type}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 flex items-center justify-between">
                        <span>{type.toUpperCase()}</span>
                        <Link href={`/admin/${type}`} className="text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                          View All
                          <FaChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                      {items.map((item) => {
                        const Icon = getTypeIcon(type);
                        const colorClass = getTypeColor(type);
                        const href = type === 'message' 
                          ? `/admin/messages` 
                          : `/admin/${type}/${item.slug || item._id}`;

                        return (
                          <Link
                            key={item._id}
                            href={href}
                            className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowResults(false)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${getTypeColor(type).replace('text-', 'bg-').replace('500', '100')} flex items-center justify-center`}>
                                <Icon className={`h-4 w-4 ${colorClass}`} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {item.title || item.name}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                  {item.score && (
                                    <span className="text-indigo-500">
                                      {Math.round(item.score * 100)}% match
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaSearch className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">No results found</h3>
                  <p className="text-gray-500 text-sm">
                    No matches found for "{query}". Try adjusting your search.
                  </p>
                </div>
              )
            ) : recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                  RECENT SEARCHES
                </div>
                {recentSearches.map((search) => (
                  <button
                    key={search._id}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <FaClock className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {search.query}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(search.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 