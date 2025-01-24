'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimationWrapper from "../animation-wrapper"
import Image from 'next/image'
import Link from 'next/link'
import { 
  FaSearch, 
  FaCalendar, 
  FaClock, 
  FaUser, 
  FaTag, 
  FaArrowLeft, 
  FaArrowRight,
  FaArrowUp,
  FaArrowDown 
} from 'react-icons/fa'

export default function ClientBlogView() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchData()
  }, [currentPage, searchQuery, selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)
      let queryParams = `?page=${currentPage}`
      if (searchQuery) queryParams += `&search=${encodeURIComponent(searchQuery)}`
      if (selectedCategory) queryParams += `&category=${encodeURIComponent(selectedCategory)}`

      const response = await fetch(`/api/blog/client/posts${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setPosts(data.data)
        setTotalPages(data.pagination.pages)
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const BlogCard = ({ post, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden group">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm opacity-90">{post.excerpt.substring(0, 100)}...</p>
        </div>
      </div>
      <div className="p-6 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.category && (
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
              {post.category}
            </span>
          )}
          {post.tags && post.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              #{tag}
            </span>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-green-600 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FaCalendar className="mr-2" />
              {new Date(post.date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2" />
              {post.readTime} min read
            </div>
          </div>
          {post.author && (
            <div className="flex items-center">
              <FaUser className="mr-2" />
              {post.author}
            </div>
          )}
        </div>
      </div>
      <div className="px-6 pb-6">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-block w-full text-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Read More
        </Link>
      </div>
    </motion.div>
  )

  const sortPosts = (postsToSort) => {
    return [...postsToSort].sort((a, b) => {
      const aValue = sortBy === 'date' ? new Date(a.date) : a.readTime
      const bValue = sortBy === 'date' ? new Date(b.date) : b.readTime
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    })
  }

  const filteredAndSortedPosts = sortPosts(posts)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mt-24 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto">
      <AnimationWrapper className="grid grid-flow-row gap-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-center items-center text-center"
        >
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
            Blog Posts
          </h1>
          <p className="text-gray-600 mt-4 mb-8 max-w-2xl">
            Insights, tutorials, and updates from my journey in web development and technology
          </p>
        </motion.div>

        <div className="w-full max-w-4xl mx-auto mb-12">
          <div className="relative mb-6">
            <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
              isSearchFocused ? 'text-green-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                isSearchFocused 
                  ? 'border-green-500 ring-2 ring-green-200' 
                  : 'border-gray-300 hover:border-gray-400'
              } focus:outline-none`}
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
            >
              <option value="date">Sort by Date</option>
              <option value="readTime">Sort by Read Time</option>
            </select>
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-green-500 transition-colors"
            >
              {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === '' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setSelectedCategory(category.name)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category.name 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {filteredAndSortedPosts.length > 0 ? (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
            >
              {filteredAndSortedPosts.map((post, index) => (
                <BlogCard key={post._id} post={post} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg">No blog posts found.</div>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded transition-all ${
                  currentPage === i + 1
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </AnimationWrapper>
    </div>
  )
} 