import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with the correct environment variable names
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    try {
        // Verify Cloudinary configuration
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || 
            !process.env.CLOUDINARY_API_SECRET || 
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            throw new Error('Cloudinary configuration is missing');
        }

        const formData = await request.formData();
        const file = formData.get('file');
        const device = formData.get('device'); // 'iPhone' or 'macBook'

        if (!file) {
            return NextResponse.json({
                success: false,
                message: "No file provided"
            }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary with device-specific folder and transformation
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'device-frames',
                    resource_type: 'image',
                    transformation: device === 'iPhone' 
                        ? [
                            { width: 828, height: 1792, crop: "fill" },  // iPhone resolution
                            { quality: "auto" },
                            { fetch_format: "auto" }
                        ]
                        : [
                            { width: 1440, height: 900, crop: "fill" },  // MacBook resolution
                            { quality: "auto" },
                            { fetch_format: "auto" }
                        ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id
        });

    } catch (error) {
        console.error('Error uploading device image:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Error uploading image'
        }, { status: 500 });
    }
} 