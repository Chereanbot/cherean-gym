import { connectDB } from '@/lib/database'
import Service from "@/models/Service"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req) {
  try {
    await connectDB()
    const extractData = await req.json()
    const saveData = await Service.create(extractData)

    if (saveData) {
      return NextResponse.json({
        success: true,
        message: "Service added successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to add service. Please try again"
      })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again"
    })
  }
} 