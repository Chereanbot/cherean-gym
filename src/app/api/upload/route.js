import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    try {
        // Verify Cloudinary configuration
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration is incomplete');
        }

        // Get the form data
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary with preset
        const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            resource_type: 'auto'
        });

        return NextResponse.json({
            success: true,
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        
        // Handle specific Cloudinary errors
        if (error.http_code === 401) {
            return NextResponse.json(
                { success: false, error: 'Authentication failed. Please check Cloudinary credentials.' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to upload file' },
            { status: 500 }
        );
    }
} 