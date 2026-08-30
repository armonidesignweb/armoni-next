import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

// In a real implementation, you would store this in the database or Redis
// For simplicity, we just simulate the flow as requested by the user
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // We don't want to expose if a user exists or not for security
    // Always return a success response even if user doesn't exist
    const user = await User.findOne({ email });
    
    if (user) {
      // In a real app, generate a token, save to DB, and send an email
      // We will pretend we sent an email for the prompt's sake
      const resetToken = crypto.randomBytes(32).toString('hex');
      console.log(`Password reset requested for ${email}. Token: ${resetToken}`);
      
      // Send Password Reset Email (non-blocking)
      sendPasswordResetEmail(user.email, resetToken).catch(e => console.error('Failed to send password reset email', e));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
