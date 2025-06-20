import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = "https://ntqtginlrtwwhexyaqxp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cXRnaW5scnR3d2hleHlhcXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTAxMTMsImV4cCI6MjA2NTcyNjExM30.1oTJ6MP9xgj35Ba64BcaZxjO61NPn4TRq_oY-4S24fU";
const supabaseBucket = "avatars"; // or your custom bucket name

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
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