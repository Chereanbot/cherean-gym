import { NextResponse } from 'next/server';
import connectDB from '@/database';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

// Get dashboard settings
export async function GET() {
  try {
    await connectDB();
    
    // Get settings or create default if not exists
    let settings = await Settings.findOne({ type: 'dashboard' });
    
    if (!settings) {
      settings = await Settings.create({
        type: 'dashboard',
        data: {
          colors: {
            visitors: '#8B5CF6',
            pageViews: '#EC4899',
            session: '#10B981',
            bounceRate: '#F59E0B',
            blogs: '#6366F1',
            projects: '#F43F5E',
            services: '#059669',
            devices: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B']
          },
          refreshInterval: 30000, // 30 seconds
          showTrends: true,
          layout: {
            compactCards: false,
            showCharts: true,
            chartsPosition: 'middle' // top, middle, bottom
          },
          theme: { mode: 'light', primaryColor: 'green', accentColor: 'blue' },
          widgets: {
            blogs: {
              visible: true,
              order: 1,
              bgColor: 'blue',
              showDrafts: true,
              showPublished: true,
              showCount: true
            },
            projects: {
              visible: true,
              order: 2,
              bgColor: 'green',
              showActive: true,
              showCompleted: true,
              showCount: true
            },
            services: {
              visible: true,
              order: 3,
              bgColor: 'purple',
              showCount: true
            },
            experience: {
              visible: true,
              order: 4,
              bgColor: 'orange',
              showCount: true
            },
            education: {
              visible: true,
              order: 5,
              bgColor: 'pink',
              showCount: true
            },
            messages: {
              visible: true,
              order: 6,
              bgColor: 'yellow',
              showUnread: true,
              showTotal: true,
              showCount: true
            }
          },
          quickActions: {
            newBlog: { visible: true, order: 1, showDescription: true },
            newProject: { visible: true, order: 2, showDescription: true },
            manageServices: { visible: true, order: 3, showDescription: true },
            updateExperience: { visible: true, order: 4, showDescription: true },
            viewMessages: { visible: true, order: 5, showDescription: true },
            editProfile: { visible: true, order: 6, showDescription: true }
          },
          notifications: { showInDashboard: true, position: 'top-right', autoHide: true, duration: 5000 }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: settings.data
    });
  } catch (error) {
    console.error('Error fetching dashboard settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard settings' },
      { status: 500 }
    );
  }
}

// Update dashboard settings
export async function PUT(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Ensure devices colors array exists
    if (data.colors && !Array.isArray(data.colors.devices)) {
      data.colors.devices = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
    }
    
    // Validate the color values
    if (data.colors) {
      for (const [key, value] of Object.entries(data.colors)) {
        if (key !== 'devices' && typeof value === 'string' && !value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
          return NextResponse.json(
            { success: false, error: `Invalid color value for ${key}` },
            { status: 400 }
          );
        }
      }
    }

    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      { type: 'dashboard' },
      { 
        $set: { 
          type: 'dashboard',
          data: {
            ...data,
            colors: {
              ...data.colors
            },
            updatedAt: new Date()
          }
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      data: settings.data
    });
  } catch (error) {
    console.error('Error updating dashboard settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update dashboard settings' },
      { status: 500 }
    );
  }
} 