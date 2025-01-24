import { NextResponse } from 'next/server';
import connectDB from '@/database';
import Settings from '@/models/Settings';

// Get settings
export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({});
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update settings
export async function PUT(request) {
  try {
    await connectDB();
    const updates = await request.json();
    
    // Get or create settings with defaults
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }

    // Deep merge updates with existing settings
    const mergeObjects = (target, source) => {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          mergeObjects(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      });
    };

    // Apply updates
    mergeObjects(settings, updates);
    
    // Save and return updated settings
    await settings.save();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.errors // Include validation error details
    }, { status: 500 });
  }
}

// Create new settings
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const settings = await Settings.findOne({});
    if (settings) {
      return NextResponse.json(
        { error: 'Settings already exist. Use PUT to update.' },
        { status: 400 }
      );
    }

    const newSettings = await Settings.create(data);
    return NextResponse.json(newSettings, { status: 201 });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.errors // Include validation error details
    }, { status: 500 });
  }
} 