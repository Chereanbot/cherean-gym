import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'di7rpky2s',
  api_key: process.env.CLOUDINARY_API_KEY || '531829581687916',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'THchaMj4ho76L-QVrfGrvhmYueU',
  secure: true
})

export default cloudinary 