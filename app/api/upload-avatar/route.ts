import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseBucket = process.env.SUPABASE_AVATAR_BUCKET || 'avatars'

// Only create client if environment variables are available
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function POST(request: NextRequest) {
  try {
    // Check for Supabase environment variables at runtime
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      return NextResponse.json(
        { error: 'Supabase configuration not available' },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    const fileName = `avatar-${Date.now()}.${file.name.split('.').pop()}`

    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .upload(fileName, file, { contentType: file.type })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(`Supabase upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(supabaseBucket)
      .getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      publicId: data.path, // Supabase uses path as identifier
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
} 