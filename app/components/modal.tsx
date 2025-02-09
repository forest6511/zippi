import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            onClick={onClose}
            className="bg-white rounded-full p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="閉じる"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-auto p-6">{children}</div>
      </div>
      <button
        className="fixed inset-0 w-full h-full cursor-default focus:outline-none"
        onClick={onClose}
        aria-label="モーダルを閉じる"
        tabIndex={-1}
      />
    </div>
  )
}
