import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getSession } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { sendPasswordChangedEmail } from '@/lib/email';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mevcut şifre ve yeni şifre gereklidir' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalıdır' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Verify current password
    const isValid = verifyPassword(currentPassword, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 });
    }

    // Hash new password
    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    await user.save();

    // Send notification email
    try {
      await sendPasswordChangedEmail(user.email, user.name);
    } catch (e) {
      console.error('Failed to send password changed email', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
