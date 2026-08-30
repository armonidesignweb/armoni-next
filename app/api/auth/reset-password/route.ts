import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { sendPasswordChangedEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // In a real implementation, we would verify the token against the DB
    // For now, we simulate the flow
    // Find a user (for simulation purposes, let's just get any user or handle by email if passed)
    // To make it somewhat realistic, we can't do much without the email, so we expect email in body for this mock
    const { email } = await request.json().catch(() => ({ email: null }));
    
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
       // Mock fallback
       user = await User.findOne({ role: 'customer' });
    }

    if (user) {
      const { hash, salt } = hashPassword(newPassword);
      user.passwordHash = hash;
      user.passwordSalt = salt;
      await user.save();
      
      // Send Password Changed Email
      try {
        await sendPasswordChangedEmail(user.email, user.name);
      } catch (e) {
        console.error('Failed to send password changed email', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
