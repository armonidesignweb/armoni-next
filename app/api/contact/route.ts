import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Ad, e-posta ve mesaj alanları zorunludur.' }, { status: 400 });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Geçersiz e-posta adresi.' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'armonidesign@gmail.com';
    const subject = `Yeni İletişim Formu Mesajı: ${name}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111; margin-bottom: 20px;">Yeni İletişim Formu Mesajı</h2>
        <p><strong>Gönderen:</strong> ${name}</p>
        <p><strong>E-posta (Reply-To):</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Belirtilmedi'}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Mesaj:</strong></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6;">${message}</div>
      </div>
    `;

    const success = await sendEmail({
      to: adminEmail,
      subject,
      htmlContent,
      replyTo: email,
    });

    if (!success) {
      return NextResponse.json({ error: 'E-posta gönderilirken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
