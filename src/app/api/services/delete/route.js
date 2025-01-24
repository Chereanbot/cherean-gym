import connectToDB from "@/database"
import Service from "@/models/Service"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function DELETE(req) {
  try {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const deleteData = await Service.findByIdAndDelete(id)

    if (deleteData) {
      return NextResponse.json({
        success: true,
        message: "Service deleted successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to delete service. Please try again"
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