import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ImageModel } from '@/models/Image';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || id.length !== 24) {
      return new NextResponse('Invalid Image ID', { status: 400 });
    }

    await connectToDatabase();
    
    const image = await ImageModel.findById(id);
    
    if (!image) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', image.contentType);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(image.data as any, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
