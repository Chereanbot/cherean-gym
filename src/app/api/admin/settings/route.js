import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectToDB from '@/database';
import Settings from '@/models/Settings';
import DashboardSettings from "@/models/DashboardSettings";

// Admin authentication middleware
const authenticateAdmin = async (req) => {
  const headersList = headers();
  const email = headersList.get('admin-email');
  const password = headersList.get('admin-password');

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    throw new Error('Unauthorized access');
  }
  return true;
};

// Get all admin settings including API keys
export async function GET(req) {
  try {
    await authenticateAdmin(req);
    await connectToDB();

    // Get or create settings
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({
        general: {
          siteName: 'Cherinet Afewerk',
          siteDescription: 'Personal Portfolio & Blog'
        }
      });
    }

    const adminSettings = {
      mongodb: {
        uri: process.env.MONGODB_URI,
      },
      cloudinary: {
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      ai: {
        gemini: process.env.GEMINI_API_KEY,
        openai: process.env.OPENAI_API_KEY,
      },
      email: {
        sendgridKey: process.env.SENDGRID_API_KEY,
        senderEmail: process.env.SENDER_EMAIL,
      },
      security: {
        recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
        jwtSecret: process.env.JWT_SECRET,
      },
      oauth: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
      analytics: {
        gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      },
      payment: {
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
      vercel: {
        token: process.env.VERCEL_TOKEN,
        projectId: process.env.VERCEL_PROJECT_ID,
        orgId: process.env.VERCEL_ORG_ID,
      },
      rateLimiting: {
        max: process.env.RATE_LIMIT_MAX,
        windowMs: process.env.RATE_LIMIT_WINDOW_MS,
      },
      cache: {
        redisUrl: process.env.REDIS_URL,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        settings,
        adminSettings
      }
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: error.message === 'Unauthorized access' ? 401 : 500 });
  }
}

// Update admin settings
export async function PUT(req) {
  try {
    await authenticateAdmin(req);
    await connectToDB();
    
    const updates = await req.json();

    // Get or create settings
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({
        general: {
          siteName: 'Cherinet Afewerk',
          siteDescription: 'Personal Portfolio & Blog'
        }
      });
    }

    // Here you would typically update your .env file or environment variables
    return NextResponse.json({ 
      message: 'Settings updated successfully',
      updates 
    }, { status: 200 });
  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update admin settings' },
      { status: error.message === 'Unauthorized access' ? 401 : 500 }
    );
  }
}

// Test admin credentials
export async function POST(req) {
  try {
    await authenticateAdmin(req);
    await connectToDB();

    // Get or create settings
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({
        general: {
          siteName: 'Cherinet Afewerk',
          siteDescription: 'Personal Portfolio & Blog'
        }
      });
    }

    return NextResponse.json({ 
      message: 'Authentication successful',
      isAdmin: true 
    }, { status: 200 });
  } catch (error) {
    console.error('Admin authentication error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: error.message === 'Unauthorized access' ? 401 : 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

// Get current settings
export async function GET_DASHBOARD() {
    try {
        await connectToDB();
        
        let settings = await DashboardSettings.findOne();
        if (!settings) {
            settings = await DashboardSettings.create({});
        }
        
        return NextResponse.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching dashboard settings:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch dashboard settings'
            },
            { status: 500 }
        );
    }
}

// Update settings
export async function PUT_DASHBOARD(request) {
    try {
        await connectToDB();
        
        const updates = await request.json();
        
        let settings = await DashboardSettings.findOne();
        if (!settings) {
            settings = await DashboardSettings.create(updates);
        } else {
            // Update only the provided fields
            if (updates.widgets) {
                settings.widgets = { ...settings.widgets, ...updates.widgets };
            }
            if (updates.quickActions) {
                settings.quickActions = { ...settings.quickActions, ...updates.quickActions };
            }
            
            settings.lastUpdated = new Date();
            await settings.save();
        }
        
        return NextResponse.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error updating dashboard settings:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update dashboard settings'
            },
            { status: 500 }
        );
    }
} 