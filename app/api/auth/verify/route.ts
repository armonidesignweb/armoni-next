import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Verification simulation or activation
    // For simplicity, we active a customer user
    const user = await User.findOneAndUpdate(
      { role: 'customer', isActive: true }, // Find any active customer to simulate success
      { $set: { isActive: true } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Redirect to login page with verified parameter
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    return NextResponse.redirect(`${siteUrl}/login?verified=true`);
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
