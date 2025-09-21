
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'lg':
        return 'h-12 w-12'
      default:
        return 'h-8 w-8'
    }
  }

  return (
    <div 
      className={`animate-spin rounded-full border-b-2 border-blue-600 ${getSizeClasses()} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Both named and default exports for compatibility
export { LoadingSpinner }
export default LoadingSpinner

// Export the interface for type safety
export type { LoadingSpinnerProps }
