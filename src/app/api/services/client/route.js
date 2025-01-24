import connectToDB from "@/database"
import Service from "@/models/Service"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await connectToDB()
    
    // Only fetch active services and sort by order
    const services = await Service.find({ status: 'Active' })
      .sort({ order: 1 })
      .select('title description icon technologies') // Only select needed fields

    if (services) {
      return NextResponse.json({
        success: true,
        data: services
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch services"
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