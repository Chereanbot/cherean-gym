'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaCalendar, FaClock, FaUser, FaTag, FaArrowLeft } from 'react-icons/fa'
import CommonLayout from '@/components/client-view/common-layout'

export default function BlogDetail({ params }) {
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        console.log('Fetching blog post with slug:', params.slug)
        const response = await fetch(`/api/blog/client/post/${params.slug}`)
        const data = await response.json()
        console.log('Received data:', data)

        if (data.success) {
          setPost(data.data.post)
          setRelatedPosts(data.data.relatedPosts)
        } else {
          console.error('Failed to fetch post:', data.message)
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.slug])

  if (loading) {
    return (
      <CommonLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </CommonLayout>
    )
  }

  if (!post) {
    return (
      <CommonLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog post not found</h1>
          <Link
            href="/blog"
            className="flex items-center text-green-500 hover:text-green-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Blog
          </Link>
        </div>
      </CommonLayout>
    )
  }

  return (
    <CommonLayout>
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Blog
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-[400px] w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && (
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              )}
              {post.tags?.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <FaCalendar className="mr-2" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2" />
                {post.readTime} min read
              </div>
              {post.author && (
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  {post.author}
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              {post.content}
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      Read More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CommonLayout>
  )
} 