"use client"

import { useState, useRef, type ChangeEvent, type SyntheticEvent } from 'react'
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
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { validateImageFile } from '@/lib/image-utils'

interface AvatarUploadProps {
  value: {
    type: 'image' | 'initials'
    imageUrl?: string
    initials: string
  }
  onChange: (value: { type: 'image' | 'initials'; imageUrl?: string; initials: string }) => void
  /** Shown when no initials are set, e.g. derived from the person's name. */
  fallbackInitials?: string
  className?: string
}

// Keep stored avatars small: plenty for a 192px display circle, and small
// enough to embed as a data URL when no upload backend is configured.
const OUTPUT_SIZE = 512

// GitHub-style initial selection: a centered square covering most of the photo.
function initialCrop(width: number, height: number): Crop {
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height)
}

// Cut the selected square out of the displayed image at natural resolution,
// on a white background so transparent PNGs don't turn black in the JPEG.
function cropToCanvas(image: HTMLImageElement, crop: PixelCrop): HTMLCanvasElement {
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const size = Math.max(1, Math.round(Math.min(OUTPUT_SIZE, crop.width * scaleX)))

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    size,
    size,
  )
  return canvas
}

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))

export function AvatarUpload({ value, onChange, fallbackInitials, className }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const validationError = validateImageFile(file)
    if (validationError) {
      toast({ title: 'Could not use this image', description: validationError, variant: 'destructive' })
      return
    }
    setCrop(undefined)
    setCompletedCrop(undefined)
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = event.currentTarget
    const nextCrop = initialCrop(width, height)
    setCrop(nextCrop)
    setCompletedCrop(convertToPixelCrop(nextCrop, width, height))
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
    const image = imgRef.current
    if (!image || !completedCrop?.width || !completedCrop?.height) return
    setIsUploading(true)
    try {
      const canvas = cropToCanvas(image, completedCrop)
      const { url, hosted } = await uploadOrEmbed(canvas)
      onChange({
        type: 'image',
        imageUrl: url,
        initials: value.initials,
      })
      setImageSrc(null)
      toast({
        title: 'Profile picture updated',
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

  // Switching display type keeps the uploaded photo, so toggling back to
  // "image" restores it. Only the explicit Remove button deletes the photo.
  const handleTypeChange = (newType: 'image' | 'initials') => {
    onChange({
      ...value,
      type: newType,
    })
  }

  const displayUrl = value.type === 'image' ? value.imageUrl : undefined
  const displayInitials = value.initials || fallbackInitials || '?'

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        {/* key forces a remount when switching between image and initials so
            Radix's avatar loading status resets — otherwise the fallback stays
            hidden (blank circle) after an image is removed. */}
        <Avatar key={displayUrl ?? 'initials'} className="w-32 h-32">
          {displayUrl ? (
            <AvatarImage src={displayUrl} alt="Avatar" />
          ) : null}
          <AvatarFallback className="text-2xl font-bold">
            {displayInitials}
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
              placeholder={fallbackInitials || 'JD'}
              maxLength={3}
              className="text-center uppercase"
            />
            {!value.initials && fallbackInitials && (
              <p className="text-xs text-muted-foreground">
                Using &quot;{fallbackInitials}&quot; from your name — type here to override.
              </p>
            )}
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
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[480px]">
          <DialogHeader className="border-b p-4 pr-12 text-left">
            <DialogTitle>Crop your new profile picture</DialogTitle>
            <DialogDescription>
              Drag the selection to reposition it, or resize it with the corner handles.
            </DialogDescription>
          </DialogHeader>

          <div className="flex max-h-[60vh] items-center justify-center overflow-auto bg-muted/40 p-4">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_pixelCrop, percentCrop) => setCrop(percentCrop)}
                onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                aspect={1}
                minWidth={32}
                keepSelection
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Photo to crop"
                  onLoad={handleImageLoad}
                  className="max-h-[52vh] w-auto select-none"
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter className="border-t p-4">
            <Button
              className="w-full"
              onClick={handleSaveCroppedImage}
              disabled={isUploading || !completedCrop?.width}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Set new profile picture'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
