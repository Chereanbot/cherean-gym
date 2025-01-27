import { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaBlog, FaProjectDiagram, FaCode, FaEnvelope, FaTimes, FaClock, 
  FaChevronRight, FaHistory, FaTags, FaCalendar, FaEye } from 'react-icons/fa';
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
    case 'blog': return 'text-blue-600';
    case 'project': return 'text-green-600';
    case 'service': return 'text-purple-600';
    case 'message': return 'text-orange-600';
    default: return 'text-gray-600';
  }
};

const getTypeBgColor = (type) => {
  switch (type.toLowerCase()) {
    case 'blog': return 'bg-blue-50 hover:bg-blue-100';
    case 'project': return 'bg-green-50 hover:bg-green-100';
    case 'service': return 'bg-purple-50 hover:bg-purple-100';
    case 'message': return 'bg-orange-50 hover:bg-orange-100';
    default: return 'bg-gray-50 hover:bg-gray-100';
  }
};

export default function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showResults) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => {
            const total = (results?.items?.length || 0) + (recentSearches?.length || 0);
            return prev < total - 1 ? prev + 1 : 0;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => {
            const total = (results?.items?.length || 0) + (recentSearches?.length || 0);
            return prev > 0 ? prev - 1 : total - 1;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            const items = [...(results?.items || []), ...(recentSearches || [])];
            const selectedItem = items[selectedIndex];
            if (selectedItem) {
              if (selectedItem.query) {
                handleRecentSearchClick(selectedItem);
              } else {
                const href = selectedItem.type === 'message' 
                  ? '/admin/messages' 
                  : `/admin/${selectedItem.type}/${selectedItem.slug || selectedItem._id}`;
                window.location.href = href;
              }
            }
          }
          break;
        case 'Escape':
          setShowResults(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showResults, selectedIndex, results, recentSearches]);

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
  }, [debouncedQuery, selectedType]);

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const response = await fetch('/api/admin/search/header', {
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
      const response = await fetch(
        `/api/admin/search/header?q=${encodeURIComponent(debouncedQuery)}${selectedType !== 'all' ? `&type=${selectedType}` : ''}`
      );
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        setShowResults(true);
        setSelectedIndex(-1);
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
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleRecentSearchClick = (search) => {
    setQuery(search.query);
    performSearch();
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    inputRef.current?.focus();
  };

  const searchTypes = [
    { id: 'all', label: 'All' },
    { id: 'blog', label: 'Blogs', icon: FaBlog },
    { id: 'project', label: 'Projects', icon: FaProjectDiagram },
    { id: 'service', label: 'Services', icon: FaCode },
    { id: 'message', label: 'Messages', icon: FaEnvelope }
  ];

  return (
    <div className="relative w-full md:w-[28rem] lg:w-[32rem]" ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder={`Search ${selectedType === 'all' ? 'anything' : selectedType + 's'}...`}
          className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-300/50 bg-white/95 backdrop-blur-md focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-700 placeholder-gray-500"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-md rounded-xl shadow-xl shadow-black/10 border border-white/20 max-h-[32rem] overflow-hidden"
          >
            {/* Search Types */}
            <div className="p-3 border-b border-gray-200/50 bg-slate-100/95">
              <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                {searchTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                      ${selectedType === type.id 
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' 
                        : 'bg-white/90 text-gray-700 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50'}`}
                  >
                    {type.icon && <type.icon className="w-4 h-4" />}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(32rem-4rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200/80 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200/80 rounded-md w-3/4"></div>
                        <div className="h-3 bg-gray-200/80 rounded-md w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query ? (
                results?.items?.length > 0 ? (
                  <div className="py-2">
                    {Object.entries(results.grouped).map(([type, items]) => items.length > 0 && (
                      <div key={type}>
                        <div className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100/95 flex items-center justify-between border-y border-gray-200/50">
                          <span className="flex items-center gap-2">
                            {getTypeIcon(type)({ className: `w-4 h-4 ${getTypeColor(type)}` })}
                            {type.toUpperCase()}
                          </span>
                          <Link href={`/admin/${type}`} className="text-blue-500 hover:text-blue-600 flex items-center gap-1.5 text-sm font-medium">
                            View All
                            <FaChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                        {items.map((item, idx) => {
                          const isSelected = selectedIndex === idx;
                          const Icon = getTypeIcon(type);
                          const colorClass = getTypeColor(type);
                          const href = type === 'message' 
                            ? `/admin/messages` 
                            : `/admin/${type}/${item.slug || item._id}`;

                          return (
                            <Link
                              key={item._id}
                              href={href}
                              className={`block px-4 py-3 transition-colors ${
                                isSelected ? 'bg-gray-100/80' : 'hover:bg-gray-50/80'
                              }`}
                              onClick={() => setShowResults(false)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg ${getTypeBgColor(type)} flex items-center justify-center transition-colors`}>
                                  <Icon className={`h-5 w-5 ${colorClass}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-800 truncate">
                                    {item.title || item.name}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                                    <span className="flex items-center gap-1.5">
                                      <FaCalendar className="w-3 h-3" />
                                      {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                    {item.views && (
                                      <span className="flex items-center gap-1.5">
                                        <FaEye className="w-3 h-3" />
                                        {item.views} views
                                      </span>
                                    )}
                                    {item.tags && item.tags.length > 0 && (
                                      <span className="flex items-center gap-1.5">
                                        <FaTags className="w-3 h-3" />
                                        {item.tags[0]}{item.tags.length > 1 ? ` +${item.tags.length - 1}` : ''}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {item.score && (
                                  <div className={`text-xs font-medium ${colorClass} px-3 py-1.5 rounded-lg shadow-sm ${getTypeBgColor(type)}`}>
                                    {Math.round(item.score * 100)}% match
                                  </div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gray-100/90 flex items-center justify-center">
                      <FaSearch className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      No matches found for "{query}". Try adjusting your search.
                    </p>
                  </div>
                )
              ) : recentSearches.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100/95 flex items-center gap-2 border-y border-gray-200/50">
                    <FaHistory className="w-4 h-4" />
                    RECENT SEARCHES
                  </div>
                  {recentSearches.map((search, idx) => {
                    const isSelected = selectedIndex === (results?.items?.length || 0) + idx;
                    return (
                      <button
                        key={search._id}
                        onClick={() => handleRecentSearchClick(search)}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          isSelected ? 'bg-gray-100/80' : 'hover:bg-gray-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gray-100/90 flex items-center justify-center">
                            <FaClock className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {search.query}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                              <span className="flex items-center gap-1.5">
                                <FaCalendar className="w-3 h-3" />
                                {new Date(search.timestamp).toLocaleDateString()}
                              </span>
                              {search.type !== 'all' && (
                                <span className="flex items-center gap-1.5">
                                  {getTypeIcon(search.type)({ className: `w-3 h-3 ${getTypeColor(search.type)}` })}
                                  {search.type}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 