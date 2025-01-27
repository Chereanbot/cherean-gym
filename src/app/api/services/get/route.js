import { connectDB } from '@/lib/database'
import Service from "@/models/Service"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await connectDB()
    const services = await Service.find({}).sort({ order: 1 })

    if (services) {
      return NextResponse.json({
        success: true,
        data: services
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch services! Please try again"
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