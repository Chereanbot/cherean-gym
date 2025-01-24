/**
 * Converts a PDFKit document to a buffer
 * @param {PDFDocument} doc - The PDFKit document
 * @returns {Promise<Buffer>} The PDF as a buffer
 */
export function getStream(doc) {
  return new Promise((resolve, reject) => {
    const chunks = []
    
    // Handle data chunks
    doc.on('data', function(chunk) {
      chunks.push(chunk)
    })
    
    // Handle end of document
    doc.on('end', function() {
      resolve(Buffer.concat(chunks))
    })
    
    // Handle errors
    doc.on('error', function(err) {
      reject(err)
    })
  })
}

/**
 * Formats a phone number to a standard format
 * @param {string} phone - The phone number to format
 * @returns {string} The formatted phone number
 */
export function formatPhone(phone) {
  if (!phone) return ''
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Cleans a URL by removing tracking parameters
 * @param {string} url - The URL to clean
 * @returns {string} The cleaned URL
 */
export function cleanUrl(url) {
  try {
    const urlObj = new URL(url)
    // Remove common tracking parameters
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    paramsToRemove.forEach(param => urlObj.searchParams.delete(param))
    return urlObj.toString()
  } catch {
    return url
  }
} 