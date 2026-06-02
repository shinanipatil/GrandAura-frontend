export default function LoadingSpinner({ fullScreen, size = 'md' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  const spinner = (
    <div className={`${sizes[size]} border-2 border-gold-200 border-t-gold-400 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-cream">
        {spinner}
      </div>
    );
  }
  return <div className="flex justify-center py-12">{spinner}</div>;
}
