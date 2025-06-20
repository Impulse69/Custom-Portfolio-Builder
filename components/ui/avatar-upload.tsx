"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  // Dialog,
  // DialogContent,
  // DialogHeader,
  // DialogTitle,
  // DialogFooter,
} from '@/components/ui/dialog'
// import Cropper from 'react-easy-crop'
// import type { Area } from 'react-easy-crop'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

interface AvatarUploadProps {
  value: {
    type: 'image' | 'initials'
    imageUrl?: string
    initials: string
  }
  onChange: (value: { type: 'image' | 'initials'; imageUrl?: string; initials: string }) => void
  className?: string
}

// const createImage = (url: string): Promise<HTMLImageElement> =>
//   new Promise((resolve, reject) => {
//     const image = new Image()
//     image.addEventListener('load', () => resolve(image))
//     image.addEventListener('error', (error) => reject(error))
//     image.setAttribute('crossOrigin', 'anonymous') // Needed for cross-origin images
//     image.src = url
//   })

// const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob | null> => {
//   const image = await createImage(imageSrc)
//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d')

//   if (!ctx) {
//     return null
//   }

//   const scaleX = image.naturalWidth / image.width
//   const scaleY = image.naturalHeight / image.height

//   canvas.width = pixelCrop.width
//   canvas.height = pixelCrop.height

//   ctx.drawImage(
//     image,
//     pixelCrop.x * scaleX,
//     pixelCrop.y * scaleY,
//     pixelCrop.width * scaleX,
//     pixelCrop.height * scaleY,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height
//   )

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => {
//       resolve(blob)
//     }, 'image/png') // We want to send raw uncompressed image, png is good for that
//   })
// }

export function AvatarUpload({ value, onChange, className }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  // const [imageSrc, setImageSrc] = useState<string | null>(null)
  // const [crop, setCrop] = useState({ x: 0, y: 0 })
  // const [zoom, setZoom] = useState(1)
  // const [rotation, setRotation] = useState(0)
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
  //   setCroppedAreaPixels(croppedAreaPixels)
  // }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPG, PNG, and WebP are allowed.')
      return
    }

    // Directly upload the file without cropping
    await handleUploadImage(file)

    // const reader = new FileReader()
    // reader.onload = () => {
    //   setImageSrc(reader.result as string)
    // }
    // reader.readAsDataURL(file)
  }

  const handleUploadImage = async (file: File) => {
    // if (!imageSrc || !croppedAreaPixels) return // No longer needed for direct upload

    setIsUploading(true)
    try {
      // const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)

      // if (!croppedBlob) {
      //   throw new Error('Failed to crop image.')
      // }

      const formData = new FormData()
      formData.append('file', file, file.name) // Send the original file

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      console.log("Upload result:", result);
      onChange({
        type: 'image',
        imageUrl: result.imageUrl,
        initials: value.initials,
      })
      // setImageSrc(null) // No longer needed for direct upload
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onChange({
      type: 'initials',
      initials: value.initials,
    })
  }

  const handleInitialsChange = (initials: string) => {
    onChange({
      type: value.type,
      imageUrl: value.imageUrl,
      initials: initials.toUpperCase().slice(0, 3),
    })
  }

  const handleTypeChange = (newType: 'image' | 'initials') => {
    onChange({
      ...value,
      type: newType,
      // Clear imageUrl if switching to initials type
      imageUrl: newType === 'initials' ? undefined : value.imageUrl,
    })
  }

  const displayUrl = value.type === 'image' ? value.imageUrl : undefined

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        <Avatar className="w-32 h-32">
          {displayUrl ? (
            <AvatarImage src={displayUrl} alt="Avatar" />
          ) : null}
          <AvatarFallback className="text-2xl font-bold">
            {value.initials}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex items-center space-x-2">
          <Switch
            id="avatarType"
            checked={value.type === 'image'}
            onCheckedChange={(checked) => handleTypeChange(checked ? 'image' : 'initials')}
          />
          <Label htmlFor="avatarType">Use Image Avatar</Label>
        </div>

        {value.type === 'image' ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            
            {value.imageUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
        ) : null}

        {value.type === 'initials' && (
          <div className="space-y-2 w-full">
            <Label htmlFor="initials">Initials</Label>
            <Input
              id="initials"
              value={value.initials}
              onChange={(e) => handleInitialsChange(e.target.value)}
              placeholder="JD"
              maxLength={3}
              className="text-center uppercase"
            />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Cropper Dialog Removed Temporarily */}
      {/* <Dialog open={!!imageSrc} onOpenChange={() => setImageSrc(null)}>
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
              <Label htmlFor="zoom">Zoom</Label>
              <Input
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
              <Label htmlFor="rotation">Rotation</Label>
              <Input
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
      </Dialog> */}
    </div>
  )
}