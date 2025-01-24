import connectToDB from "@/database";
import Home from "@/models/Home";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function PUT(req) {
    try {
        await connectToDB();
        const extractData = await req.json();
        const { _id,heading,summary } = extractData;

        const updateData = await Home.findByIdAndUpdate(
            {
                _id: _id
            },
            {heading,summary},
            {new: true}
        );
        if (updateData) {
            return NextResponse.json({
                success: true,
                message: "Updated successfully"
            });
        }else { 
            return NextResponse.json({
                success: false,
                message: "Something goes wrong Please try again"
            });
        } 

    } catch (e) {
        console.log(e);
        
        return NextResponse.json({
            success: false,
            message: "Something goes wrong Please try again"
        });
    }
}
