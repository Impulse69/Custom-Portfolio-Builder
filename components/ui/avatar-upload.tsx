"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'

interface AvatarUploadProps {
  value: {
    type: 'image' | 'initials'
    imageUrl?: string
    initials: string
  }
  onChange: (value: { type: 'image' | 'initials'; imageUrl?: string; initials: string }) => void
  className?: string
}

// Keep stored avatars small: plenty for a 192px display circle, and small
// enough to embed as a data URL when no upload backend is configured.
const OUTPUT_SIZE = 512
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB source file

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

// Rotation-aware crop (react-easy-crop's documented recipe): draw the rotated
// image onto a bounding-box canvas, then cut the crop area out of that.
const getCroppedCanvas = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
): Promise<HTMLCanvasElement> => {
  const image = await createImage(imageSrc)
  const rotRad = (rotation * Math.PI) / 180

  const bBoxWidth = Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height)
  const bBoxHeight = Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height)

  const canvas = document.createElement('canvas')
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.translate(-image.width / 2, -image.height / 2)
  ctx.drawImage(image, 0, 0)

  const output = document.createElement('canvas')
  const size = Math.min(OUTPUT_SIZE, pixelCrop.width)
  output.width = size
  output.height = size
  const outputCtx = output.getContext('2d')
  if (!outputCtx) throw new Error('Canvas is not supported in this browser.')
  outputCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size,
  )
  return output
}

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))

export function AvatarUpload({ value, onChange, className }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Unsupported file type',
        description: 'Please choose a JPG, PNG, or WebP image.',
        variant: 'destructive',
      })
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please choose an image under 10MB.',
        variant: 'destructive',
      })
      return
    }
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Try the Supabase upload endpoint for a hosted URL; if it isn't configured
  // (or fails), embed the image directly so the feature works without any setup.
  const uploadOrEmbed = async (canvas: HTMLCanvasElement): Promise<{ url: string; hosted: boolean }> => {
    const blob = await canvasToBlob(canvas)
    if (blob) {
      try {
        const formData = new FormData()
        formData.append('file', blob, 'avatar.jpg')
        const response = await fetch('/api/upload-avatar', { method: 'POST', body: formData })
        if (response.ok) {
          const result = await response.json()
          if (result.imageUrl) return { url: result.imageUrl, hosted: true }
        }
      } catch {
        // Fall through to the embedded data URL
      }
    }
    return { url: canvas.toDataURL('image/jpeg', 0.9), hosted: false }
  }

  const handleSaveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setIsUploading(true)
    try {
      const canvas = await getCroppedCanvas(imageSrc, croppedAreaPixels, rotation)
      const { url, hosted } = await uploadOrEmbed(canvas)
      onChange({
        type: 'image',
        imageUrl: url,
        initials: value.initials,
      })
      setImageSrc(null)
      toast({
        title: 'Avatar updated',
        description: hosted
          ? 'Your photo was uploaded and added to the portfolio.'
          : 'Your photo was saved with the portfolio (no upload service configured — it is embedded directly).',
      })
    } catch (error) {
      toast({
        title: 'Could not save image',
        description: error instanceof Error ? error.message : 'Something went wrong while cropping the image.',
        variant: 'destructive',
      })
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

      <Dialog open={!!imageSrc} onOpenChange={(open) => !open && setImageSrc(null)}>
        <DialogContent className="sm:max-w-[425px] h-[540px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Crop your photo</DialogTitle>
            <DialogDescription>Drag to position, then adjust zoom and rotation.</DialogDescription>
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
              <Label htmlFor="zoom" className="w-16">Zoom</Label>
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
              <Label htmlFor="rotation" className="w-16">Rotation</Label>
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
                'Save photo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
