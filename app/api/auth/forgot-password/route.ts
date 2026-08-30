import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import crypto from 'crypto';
import { sendTemporaryPasswordEmail } from '@/lib/email';
import { hashPassword } from '@/lib/auth';

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
      // Generate temporary password
      const temporaryPassword = crypto.randomBytes(6).toString('hex'); // 12 character hex string
      
      // Hash and update user
      const { hash, salt } = hashPassword(temporaryPassword);
      user.passwordHash = hash;
      user.passwordSalt = salt;
      await user.save();
      
      console.log(`Temporary password generated for ${email}`);
      
      // Send Temporary Password Email
      try {
        await sendTemporaryPasswordEmail(user.email, user.name, temporaryPassword);
      } catch (e) {
        console.error('Failed to send temporary password email', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
