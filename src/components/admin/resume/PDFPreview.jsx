'use client'

import { useState, useEffect } from 'react'
import { FaDownload, FaEdit, FaSpinner, FaTimes } from 'react-icons/fa'

const PDFPreview = ({ pdfUrl, onEdit, onClose }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Reset loading state when PDF URL changes
    setLoading(true)
  }, [pdfUrl])

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">CV Preview</h2>
          <div className="flex items-center space-x-4">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              <FaDownload className="mr-2" />
              Download
            </button>
            
            {/* Edit Button */}
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex items-center p-2 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="relative w-full h-[calc(90vh-100px)] bg-gray-100 rounded">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full rounded"
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}

export default PDFPreview 