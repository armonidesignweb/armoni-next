import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, company, phone, acceptTerms } = await request.json();

    if (!name || !email || !password || !acceptTerms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Security: Do not allow registering admin accounts via public registration
    const adminEmail = process.env.ADMIN_EMAIL || 'iletisim@armonidesign.com';
    if (email.toLowerCase() === adminEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot register with this email' }, { status: 403 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const { hash, salt } = hashPassword(password);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      passwordSalt: salt,
      role: 'customer', // Hardcoded to prevent role injection
      company,
      phone,
      isActive: true,
      lastLogin: new Date()
    });

    await createSession(user._id.toString());

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
