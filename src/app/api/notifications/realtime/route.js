import { NextResponse } from 'next/server'
import { WebSocketServer } from 'ws'
import connectToDB from '@/database'
import Notification from '@/models/Notification'

let wss = null

// Initialize WebSocket server
if (!wss && typeof window === 'undefined') {
  wss = new WebSocketServer({ 
    noServer: true,
    path: '/api/notifications/realtime'
  })
  
  wss.on('connection', (ws) => {
    console.log('Client connected')
    
    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })
}

// Broadcast notification to all connected clients
export const broadcastNotification = (notification) => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification))
      }
    })
  }
}

// Handle WebSocket upgrade
export async function GET(req) {
  if (!req.headers.get('upgrade')?.toLowerCase() === 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 })
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req)
    
    wss.handleUpgrade(req, socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, req)
    })

    return response
  } catch (err) {
    console.error('WebSocket upgrade failed:', err)
    return new Response('WebSocket upgrade failed', { status: 500 })
  }
}

// Create a new notification and broadcast it
export async function POST(request) {
  try {
    await connectToDB()
    
    const data = await request.json()
    
    // Validate required fields
    if (!data.message) {
      return NextResponse.json({
        success: false,
        error: 'Message is required'
      }, { status: 400 })
    }

    // Create notification
    const notification = await Notification.create({
      message: data.message,
      type: data.type || 'info',
      category: data.category || 'general',
      link: data.link,
      importance: data.importance || 'low',
      metadata: data.metadata,
      expiresAt: data.expiresAt
    })

    // Broadcast to connected clients
    broadcastNotification(notification)

    return NextResponse.json({
      success: true,
      data: notification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 })
  }
} 