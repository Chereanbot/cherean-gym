import { connectToDB } from "@/database"
import Contact from "@/models/Contact"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function DELETE(req) {
    try {
        await connectToDB()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Message ID is required"
            })
        }

        const deletedMessage = await Contact.findByIdAndDelete(id)

        if (deletedMessage) {
            return NextResponse.json({
                success: true,
                message: "Message deleted successfully"
            })
        } else {
            return NextResponse.json({
                success: false,
                message: "Message not found"
            })
        }
    } catch (error) {
        console.error("Error in contact/delete:", error)
        return NextResponse.json({
            success: false,
            message: "Error deleting message"
        })
    }
} 