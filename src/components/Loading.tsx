export default function Loading({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  )
}
