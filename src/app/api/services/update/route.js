import connectToDB from "@/database"
import Service from "@/models/Service"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function PUT(req) {
  try {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const extractData = await req.json()

    const updateData = await Service.findByIdAndUpdate(id, extractData, { new: true })

    if (updateData) {
      return NextResponse.json({
        success: true,
        message: "Service updated successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to update service. Please try again"
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