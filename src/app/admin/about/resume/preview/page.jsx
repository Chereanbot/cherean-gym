'use client'

import { useState, useEffect } from 'react'
import { FaSpinner, FaPrint, FaShare, FaDownload, FaEdit } from 'react-icons/fa'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'

function CVPreview() {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useGoogleViewer, setUseGoogleViewer] = useState(false)

  useEffect(() => {
    try {
      // Get the PDF URL from localStorage
      const url = localStorage.getItem('generatedPdfUrl')
      console.log('Retrieved PDF URL:', url) // Debug log

      if (url) {
        // Clean the URL if needed
        const cleanUrl = url.trim()
        console.log('Using URL:', cleanUrl) // Debug log
        setPdfUrl(cleanUrl)
      } else {
        setError('No PDF URL found. Please generate a CV first.')
      }
    } catch (err) {
      console.error('Error accessing localStorage:', err)
      setError('Error accessing CV data. Please try generating again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handlePrint = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')?.print()
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Professional CV',
        text: 'Check out my professional CV',
        url: pdfUrl
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handlePreviewError = () => {
    console.log('PDF preview failed, switching to Google Docs viewer')
    setUseGoogleViewer(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FaSpinner className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        {error}
        <div className="mt-4">
          <Link
            href="/admin/about/resume"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Go back to CV Generator
          </Link>
        </div>
      </div>
    )
  }

  if (!pdfUrl) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-600 rounded-lg">
        No CV available. Please generate one first.
        <div className="mt-4">
          <Link
            href="/admin/about/resume"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Go back to CV Generator
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CV Preview</h1>
          <p className="text-slate-600 mt-1">Review and download your professional CV</p>
          <p className="text-xs text-slate-500 mt-1">PDF URL: {pdfUrl}</p> {/* Debug info */}
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/about/resume"
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <FaEdit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <FaPrint className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <FaShare className="w-4 h-4" />
            <span>Share</span>
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <FaDownload className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="bg-white rounded-lg shadow-lg print:shadow-none">
        <div className="relative w-full h-[800px]">
          {useGoogleViewer ? (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
              className="absolute inset-0 w-full h-full rounded-lg"
              style={{ border: 'none' }}
            />
          ) : (
            <iframe
              src={pdfUrl}
              className="absolute inset-0 w-full h-full rounded-lg"
              style={{ border: 'none' }}
              onError={handlePreviewError}
            />
          )}
        </div>
      </div>

      {/* Fallback Download Button */}
      <div className="mt-4 text-center">
        <p className="text-slate-600 mb-2">
          If the preview doesn't load, you can:
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setUseGoogleViewer(!useGoogleViewer)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <span>{useGoogleViewer ? 'Try Direct Preview' : 'Try Google Docs Viewer'}</span>
          </button>
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <FaDownload className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CVPreviewPage() {
  return (
    <AdminLayout>
      <CVPreview />
    </AdminLayout>
  )
} 