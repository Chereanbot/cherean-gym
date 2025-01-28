'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaCalendar, FaClock, FaUser, FaArrowLeft, FaShare, FaTwitter, FaFacebook, FaLinkedin, FaBookmark, FaRegBookmark, FaHeart, FaRegHeart, FaCopy, FaWhatsapp, FaComment, FaPinterest, FaEye, FaReply, FaThumbsUp, FaRegThumbsDown, FaUserCircle, FaRegPaperPlane } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { toast } from 'react-hot-toast'

export default function ClientBlogDetailView({ params }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(null)
  const [views, setViews] = useState(0)
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [showEngagementPrompt, setShowEngagementPrompt] = useState(false)
  const [promptType, setPromptType] = useState(null)

  const { ref: contentRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const timelineColors = [
    'from-green-400 to-green-600',
    'from-emerald-400 to-emerald-600',
    'from-teal-400 to-teal-600',
    'from-green-500 to-emerald-500'
  ]

  const sectionThemes = [
    { gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-800' },
    { gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50', text: 'text-teal-800' },
    { gradient: 'from-green-500 to-teal-500', bg: 'bg-green-50', text: 'text-green-800' },
    { gradient: 'from-cyan-500 to-emerald-500', bg: 'bg-cyan-50', text: 'text-cyan-800' }
  ]

  const engagementPrompts = {
    reading: {
      25: "You're getting into it! Like what you're reading?",
      50: "Halfway through! This deserves a share if you're finding it valuable!",
      75: "Almost there! Don't forget to bookmark for later reference!",
      100: "Great job finishing! How about leaving a comment with your thoughts?"
    }
  }

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/blog/client/post/${params.slug}`)
        const data = await response.json()
        
        if (data.success) {
          setPost(data.data.post)
        } else {
          throw new Error(data.message || 'Failed to fetch post')
        }
      } catch (error) {
        setError(error.message)
        console.error('Error fetching blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.slug])

  useEffect(() => {
    if (!post) return

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(progress)

      const progressPercentage = Math.round(progress)
      Object.keys(engagementPrompts.reading).forEach(threshold => {
        if (progressPercentage === parseInt(threshold)) {
          setPromptType('reading')
          setShowEngagementPrompt(true)
          setTimeout(() => setShowEngagementPrompt(false), 5000)
        }
      })

      const wordsLeft = post.content.split(' ').length * (1 - (progress / 100))
      const minutesLeft = Math.ceil(wordsLeft / 200)
      setEstimatedTimeLeft(minutesLeft)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [post])

  const handleShare = (platform) => {
    const url = window.location.href
    const text = post.title

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Link copied to clipboard!')
      })
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    const heart = document.createElement('div')
    heart.className = 'floating-heart'
    heart.innerHTML = '❤️'
    document.body.appendChild(heart)
    setTimeout(() => heart.remove(), 1000)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Removed from bookmarks' : 'Added to bookmarks')
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment = {
      id: Date.now(),
      text: commentText,
      author: 'Current User',
      date: new Date(),
      likes: 0,
      replyTo: replyTo,
      replies: []
    }

    if (replyTo) {
      setComments(prevComments => {
        return prevComments.map(comment => {
          if (comment.id === replyTo) {
            return { ...comment, replies: [...comment.replies, newComment] }
          }
          return comment
        })
      })
    } else {
      setComments(prev => [...prev, newComment])
    }

    setCommentText('')
    setReplyTo(null)
    setShowCommentForm(false)
    toast.success('Comment added successfully!')
  }

  const handleCommentLike = (commentId) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        return comment
      })
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error || 'Blog post not found'}
        </div>
        <Link
          href="/blog"
          className="flex items-center text-green-500 hover:text-green-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 z-50"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.1 }}
      />

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl z-40 border border-gray-100"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
        >
          {isLiked ? (
            <FaHeart className="w-6 h-6 text-red-500" />
          ) : (
            <FaRegHeart className="w-6 h-6 text-gray-500 group-hover:text-red-500" />
          )}
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            {isLiked ? 'Unlike' : 'Like'} post
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
        >
          {isSaved ? (
            <FaBookmark className="w-6 h-6 text-green-500" />
          ) : (
            <FaRegBookmark className="w-6 h-6 text-gray-500 group-hover:text-green-500" />
          )}
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            {isSaved ? 'Remove bookmark' : 'Bookmark'}
          </span>
        </motion.button>

        <div className="w-full h-px bg-gray-200 my-2"></div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('twitter')}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
        >
          <FaTwitter className="w-6 h-6 text-[#1DA1F2]" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Share on Twitter
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('facebook')}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
        >
          <FaFacebook className="w-6 h-6 text-[#4267B2]" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Share on Facebook
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('linkedin')}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
        >
          <FaLinkedin className="w-6 h-6 text-[#0077B5]" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Share on LinkedIn
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('whatsapp')}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
        >
          <FaWhatsapp className="w-6 h-6 text-[#25D366]" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Share on WhatsApp
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('pinterest')}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
        >
          <FaPinterest className="w-6 h-6 text-[#E60023]" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Share on Pinterest
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('copy')}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors relative group"
        >
          <FaCopy className="w-6 h-6 text-gray-500" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Copy link
          </span>
        </motion.button>

        <div className="w-full h-px bg-gray-200 my-2"></div>

        <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center">
            <FaEye className="w-4 h-4 mr-1" />
            <span>{views} views</span>
          </div>
          <div className="flex items-center">
            <FaComment className="w-4 h-4 mr-1" />
            <span>{comments.length} comments</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {estimatedTimeLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 z-40 border border-gray-100"
          >
            <div className="text-sm text-gray-600">
              <div className="mb-3 font-medium">Reading Progress</div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(readingProgress)}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span>{Math.round(readingProgress)}% complete</span>
                <span>~{estimatedTimeLeft} min left</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEngagementPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 z-50 border border-gray-100 max-w-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {readingProgress < 50 ? (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-xl">
                    🎯
                  </div>
                ) : readingProgress < 75 ? (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl">
                    🌟
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white text-xl">
                    🎉
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">
                  {engagementPrompts.reading[Math.round(readingProgress)]}
                </p>
                <div className="mt-3 flex gap-2">
                  {readingProgress >= 25 && (
                    <button
                      onClick={handleLike}
                      className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      {isLiked ? '❤️ Liked!' : '🤍 Like'}
                    </button>
                  )}
                  {readingProgress >= 50 && (
                    <button
                      onClick={() => setShowShareMenu(true)}
                      className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      📤 Share
                    </button>
                  )}
                  {readingProgress >= 75 && (
                    <button
                      onClick={handleSave}
                      className="text-sm px-3 py-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                    >
                      {isSaved ? '📑 Saved!' : '🔖 Save'}
                    </button>
                  )}
                  {readingProgress >= 90 && (
                    <button
                      onClick={() => setShowCommentForm(true)}
                      className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                    >
                      💭 Comment
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowEngagementPrompt(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" /> Back to Blog
            </Link>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaShare className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>
          </div>

          <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <motion.div 
              className="relative h-[500px] w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${btoa(
                  `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="400" fill="#e2e8f0"/>
                  </svg>`
                )}`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
            </motion.div>

            <motion.div 
              className="relative -mt-32 bg-white rounded-t-3xl px-8 pt-12 pb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {post.category && (
                <motion.span 
                  className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {post.category}
                </motion.span>
              )}

              <motion.h1 
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-emerald-400 mb-8 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {post.title}
              </motion.h1>

              <motion.div 
                className="flex flex-wrap items-center gap-8 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                  <FaCalendar className="mr-2 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center bg-purple-50 px-4 py-2 rounded-full">
                  <FaClock className="mr-2 text-purple-600" />
                  <span className="text-purple-700 font-medium">
                    {post.readTime} min read
                  </span>
                </div>
                {post.author && (
                  <div className="flex items-center bg-amber-50 px-4 py-2 rounded-full">
                    <FaUser className="mr-2 text-amber-600" />
                    <span className="text-amber-700 font-medium">
                      {post.author}
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div 
                ref={contentRef}
                className="prose prose-lg md:prose-xl max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="relative pl-12 border-l-4 border-green-200">
                  {post.content.split('\n\n').map((paragraph, index) => {
                    const theme = sectionThemes[index % sectionThemes.length]
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="mb-12 relative group"
                      >
                        <div className="absolute -left-[48px] flex items-center justify-center">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-r ${theme.gradient} border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          <div className={`absolute h-full w-1 top-full left-1/2 transform -translate-x-1/2 bg-gradient-to-b ${theme.gradient} opacity-20`} />
                        </div>

                        <div className={`${theme.bg} rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 relative group-hover:translate-x-2`}>
                          <div className={`absolute -left-3 top-6 w-3 h-[2px] bg-gradient-to-r ${theme.gradient}`} />
                          
                          <div className={`text-xs ${theme.text} mb-2 flex items-center font-medium`}>
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} mr-2`} />
                            <span>Section {index + 1}</span>
                          </div>

                          <div 
                            className={`prose prose-lg ${theme.text}`}
                            dangerouslySetInnerHTML={{ __html: paragraph }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-16 pt-8 border-t border-gray-200"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h3>

                  <div className="mb-8">
                    <button
                      onClick={() => setShowCommentForm(!showCommentForm)}
                      className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <FaRegPaperPlane className="mr-2" />
                      Add Comment
                    </button>

                    {showCommentForm && (
                      <motion.form
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleComment}
                        className="mt-4"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <FaUserCircle className="w-10 h-10 text-gray-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="border border-gray-200 rounded-lg shadow-sm">
                              <textarea
                                rows="4"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                placeholder="Add your comment..."
                              />
                            </div>
                            <div className="mt-3 flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowCommentForm(false)
                                  setCommentText('')
                                  setReplyTo(null)
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.form>
                    )}
                  </div>

                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <FaUserCircle className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(comment.date).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="mt-2 text-gray-700">{comment.text}</p>
                            <div className="mt-4 flex items-center space-x-4">
                              <button
                                onClick={() => handleCommentLike(comment.id)}
                                className="flex items-center text-sm text-gray-500 hover:text-green-600"
                              >
                                <FaThumbsUp className="w-4 h-4 mr-1" />
                                {comment.likes}
                              </button>
                              <button
                                onClick={() => {
                                  setReplyTo(comment.id)
                                  setShowCommentForm(true)
                                }}
                                className="flex items-center text-sm text-gray-500 hover:text-green-600"
                              >
                                <FaReply className="w-4 h-4 mr-1" />
                                Reply
                              </button>
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-100">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                      <FaUserCircle className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">{reply.author}</p>
                                        <p className="text-sm text-gray-500">
                                          {new Date(reply.date).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <p className="mt-2 text-gray-700">{reply.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              <div className="fixed right-8 top-1/2 transform -translate-y-1/2 w-2 h-64 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="w-full bg-gradient-to-b from-green-500 to-emerald-500"
                  style={{ height: `${readingProgress}%` }}
                />
              </div>
            </motion.div>
          </article>
        </motion.div>
      </div>

      <style jsx global>{`
        .floating-heart {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 100px;
          pointer-events: none;
          animation: float-up 1s ease-out forwards;
          z-index: 9999;
        }

        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -200%) scale(1.5);
          }
        }

        .prose {
          color: #374151;
          max-width: none;
        }

        .prose h2 {
          color: #047857;
          font-weight: 700;
          font-size: 2rem;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.3;
          padding-left: 1rem;
          border-left: 4px solid #10B981;
          background: linear-gradient(to right, #f0fdf4, transparent);
        }

        .prose h3 {
          color: #065f46;
          font-weight: 600;
          font-size: 1.5rem;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          padding-left: 1rem;
          border-left: 2px solid #34d399;
        }

        .prose p {
          margin: 1.5rem 0;
          line-height: 1.8;
          position: relative;
          transition: all 0.3s ease;
        }

        .prose p:hover {
          transform: translateX(8px);
        }

        .prose a {
          color: #059669;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .prose a:hover {
          color: #047857;
          border-bottom-color: currentColor;
        }

        .prose blockquote {
          font-style: italic;
          border-left-width: 4px;
          border-left-color: #10B981;
          background: linear-gradient(to right, #f0fdf4, transparent);
          padding: 1.5rem;
          border-radius: 0.75rem;
          margin: 2rem 0;
        }

        .prose blockquote p {
          margin: 0;
          font-size: 1.125rem;
          color: #065f46;
        }

        .prose ul, .prose ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }

        .prose li {
          margin: 0.5rem 0;
          padding-left: 0.5rem;
        }

        .prose code {
          background-color: #F3F4F6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: #1F2937;
        }

        .prose pre {
          background-color: #1F2937;
          border-radius: 0.75rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }

        .prose pre code {
          background-color: transparent;
          padding: 0;
          color: #F9FAFB;
          font-size: 0.875rem;
        }

        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }

        .prose th {
          background-color: #F9FAFB;
          font-weight: 600;
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 2px solid #E5E7EB;
        }

        .prose td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #E5E7EB;
        }

        .prose tr:hover {
          background-color: #F9FAFB;
        }

        .prose > div > div:hover .timeline-node {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        html {
          scroll-behavior: smooth;
        }

        .prose > div > div {
          transition: all 0.3s ease;
        }

        .prose > div > div:hover {
          transform: translateX(4px);
        }

        .comment-transition {
          transition: all 0.3s ease;
        }

        .comment-transition:hover {
          transform: translateX(4px);
        }

        .timeline-node {
          transition: all 0.3s ease;
        }

        .timeline-node:hover {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </>
  )
} 