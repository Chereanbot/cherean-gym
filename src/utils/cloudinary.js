// Helper function to convert File to base64
const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// Helper function to validate file type
const validateFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
    }
    return true;
};

export const uploadImage = async (file) => {
    try {
        // Validate file type
        validateFileType(file);

        const formData = new FormData();
        formData.append('file', file);
        
        // Get configuration
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        // Validate configuration
        if (!preset || !cloudName) {
            console.error('Cloudinary Configuration:', { preset, cloudName });
            throw new Error('Cloudinary configuration is incomplete');
        }

        // Add upload parameters
        formData.append('upload_preset', preset);
        formData.append('cloud_name', cloudName);

        console.log('Uploading to Cloudinary with preset:', preset);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Cloudinary Error Response:', data);
            throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
        }

        if (data.error) {
            console.error('Cloudinary API Error:', data.error);
            throw new Error(data.error.message || 'Error from Cloudinary API');
        }

        if (!data.secure_url) {
            console.error('Unexpected Cloudinary Response:', data);
            throw new Error('Failed to get image URL from Cloudinary');
        }

        console.log('Successfully uploaded to Cloudinary:', {
            publicId: data.public_id,
            format: data.format,
            size: data.bytes
        });

        return {
            success: true,
            url: data.secure_url,
            publicId: data.public_id
        };
    } catch (error) {
        console.error('Detailed upload error:', error);
        return {
            success: false,
            error: error.message || 'Failed to upload image'
        };
    }
}; 