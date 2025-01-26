import { useState } from "react"
import { Modal } from "./modal"

interface Image {
  url: string
  description: string
}

interface ImageGalleryProps {
  images: Image[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)

  return (
    <>
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-4">
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0">
              <button onClick={() => setSelectedImage(image)} className="p-0 border-0 bg-transparent cursor-pointer">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.description}
                  className="w-32 h-24 md:w-48 md:h-36 object-cover rounded-lg transition-transform hover:scale-105"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <div className="flex flex-col items-center">
            <img
              src={selectedImage.url || "/placeholder.svg"}
              alt={selectedImage.description}
              className="max-w-full max-h-[70vh] object-contain"
            />
            <p className="mt-4 text-center text-gray-700">{selectedImage.description}</p>
          </div>
        )}
      </Modal>
    </>
  )
}

