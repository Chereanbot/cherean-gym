import ErrorBoundary from '@/components/error-boundary'

export default function BlogLayout({ children }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
} 