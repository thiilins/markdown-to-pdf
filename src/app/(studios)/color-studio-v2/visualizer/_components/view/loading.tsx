export const VisualizerLoading = () => {
  return (
    <div className='flex h-96 items-center justify-center'>
      <div className='text-center'>
        <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600' />
        <p className='text-sm text-neutral-500'>Carregando templates...</p>
      </div>
    </div>
  )
}
