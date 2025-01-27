import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Review from '@/models/Review';

// Get a single review
export async function GET(request, { params }) {
    try {
        await connectDB();
        
        const review = await Review.findById(params.id);
        
        if (!review) {
            return NextResponse.json(
                { success: false, message: 'Review not found' },
                { status: 404 }
            );
        }
        
        // For now, return all reviews without auth check
        return NextResponse.json({
            success: true,
            data: review
        });
        
    } catch (error) {
        console.error('Error fetching review:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch review' },
            { status: 500 }
        );
    }
}

// Update a review
export async function PUT(request, { params }) {
    try {
        await connectDB();
        
        const body = await request.json();
        
        // Find and update review
        const review = await Review.findById(params.id);
        
        if (!review) {
            return NextResponse.json(
                { success: false, message: 'Review not found' },
                { status: 404 }
            );
        }
        
        // Update review fields
        Object.assign(review, body);
        
        await review.save();
        
        return NextResponse.json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
        
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update review' },
            { status: 500 }
        );
    }
}

// Delete a review
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        
        const review = await Review.findByIdAndDelete(params.id);
        
        if (!review) {
            return NextResponse.json(
                { success: false, message: 'Review not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete review' },
            { status: 500 }
        );
    }
} 