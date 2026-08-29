import crypto from 'crypto';
import { cookies } from 'next/headers';
import { Session } from '@/models/Session';
import { User, IUser } from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

const SESSION_COOKIE_NAME = 'session_token';
const SESSION_EXPIRY_DAYS = 7;

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === derivedHash;
}

export async function createSession(userId: string) {
  await connectToDatabase();
  
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);
  
  await Session.create({
    token,
    userId,
    expiresAt,
  });
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
  
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) return null;
  
  await connectToDatabase();
  
  const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } }).populate('userId');
  if (!session || !session.userId) return null;
  
  const user = session.userId as unknown as IUser;
  if (!user.isActive) return null;
  
  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      phone: user.phone,
    }
  };
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (token) {
    await connectToDatabase();
    await Session.deleteOne({ token });
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Initial Admin Seeding Utility
export async function seedAdmin() {
  await connectToDatabase();
  const adminEmail = process.env.ADMIN_EMAIL || 'iletisim@armonidesign.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  
  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'ArmoniAdmin2026!';
    const { hash, salt } = hashPassword(adminPassword);
    
    await User.create({
      name: 'Armoni Admin',
      email: adminEmail,
      passwordHash: hash,
      passwordSalt: salt,
      role: 'admin',
      isActive: true,
    });
    console.log('Default admin seeded.');
  }
}
