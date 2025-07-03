"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AvatarUploadProps {
  value: {
    imageUrl?: string
  }
  onChange: (value: {
    imageUrl?: string
  }) => void
  name: string
  className?: string
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob | null> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/png')
  })
}

export function AvatarUpload({ value, onChange, name, className }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ')
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`
    }
    return name.slice(0, 2)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPG, PNG, and WebP are allowed.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setIsUploading(true)
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (!croppedBlob) {
        throw new Error('Failed to crop image.')
      }
      const formData = new FormData()
      formData.append('file', croppedBlob, 'avatar.png')
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
      const result = await response.json()
      onChange({
        imageUrl: result.imageUrl,
      })
      setImageSrc(null)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onChange({})
  }

  return (
    <div className={cn('relative group', className)}>
      <Avatar className="w-32 h-32">
        {value.imageUrl ? (
          <AvatarImage src={value.imageUrl} alt={name} />
        ) : null}
        <AvatarFallback className="text-2xl font-bold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            Upload a photo...
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRemoveImage}>
            Remove photo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Dialog open={!!imageSrc} onOpenChange={() => setImageSrc(null)}>
        <DialogContent className="sm:max-w-[425px] h-[500px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative flex-1 bg-gray-900">
            <Cropper
              image={imageSrc || ''}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              cropShape="round"
              showGrid={false}
              restrictPosition={false}
              classes={{
                containerClassName: 'bg-transparent',
                mediaClassName: 'object-contain',
                cropAreaClassName: 'rounded-full border-2 border-primary',
              }}
            />
          </div>
          <DialogFooter className="flex flex-col gap-4 p-6 pt-4">
            <div className="flex items-center gap-4">
              <label htmlFor="zoom" className="text-sm font-medium">Zoom</label>
              <input
                id="zoom"
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="rotation" className="text-sm font-medium">Rotation</label>
              <input
                id="rotation"
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <Button onClick={handleSaveCroppedImage} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Cropped Image'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
