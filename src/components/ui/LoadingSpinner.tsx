export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div
      className={`${sizes[size]} rounded-full border-2 border-surface-border border-t-brand-500 animate-spin`}
      role="status"
      aria-label="Loading"
    />
  )
}
