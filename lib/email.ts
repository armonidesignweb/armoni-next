export const sendEmail = async ({ to, subject, htmlContent }: { to: string; subject: string; htmlContent: string }) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY is missing. Email delivery is disabled.");
    return false;
  }

  const payload = {
    sender: { name: "Armoni Design", email: "armonidesignweb@gmail.com" },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Brevo API Error:", errorText);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Brevo API Fetch Error:", error);
    return false;
  }
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = "Armoni Design'a Hoş Geldiniz!";
  const htmlContent = `
    <div style="font-family: sans-serif; max-w-md mx-auto;">
      <h2>Merhaba ${name},</h2>
      <p>Armoni Design dünyasına hoş geldiniz! Hesabınız başarıyla oluşturuldu.</p>
      <p>Ürünlerimizi ve kampanyalarımızı müşteri panelinizden takip edebilirsiniz.</p>
      <br />
      <p>Sevgiler,</p>
      <p>Armoni Design Ekibi</p>
    </div>
  `;
  return sendEmail({ to, subject, htmlContent });
};

export const sendVerificationEmail = async (to: string, name: string, token: string) => {
  const subject = "Armoni Design - E-posta Doğrulama";
  const htmlContent = `
    <div style="font-family: sans-serif; max-w-md mx-auto;">
      <h2>Merhaba ${name},</h2>
      <p>E-posta adresinizi doğrulamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify?token=${token}">E-posta Adresimi Doğrula</a></p>
      <br />
      <p>Sevgiler,</p>
      <p>Armoni Design Ekibi</p>
    </div>
  `;
  return sendEmail({ to, subject, htmlContent });
};

export const sendTemporaryPasswordEmail = async (to: string, name: string, temporaryPassword: string) => {
  const subject = "Armoni Design - Geçici Şifreniz";
  const htmlContent = `
    <div style="font-family: sans-serif; max-w-md mx-auto;">
      <h2>Merhaba ${name},</h2>
      <p>Şifre sıfırlama talebinde bulundunuz.</p>
      <p>Hesabınız için oluşturulan geçici şifreniz aşağıdadır:</p>
      <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <strong style="font-size: 24px; letter-spacing: 2px; color: #18181b;">${temporaryPassword}</strong>
      </div>
      <p>Bu şifre ile giriş yaptıktan sonra, <strong>lütfen güvenlik amacıyla Profil sayfanızdan şifrenizi hemen değiştirin.</strong></p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://armonidesign.com'}/tr/login" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 10px;">Giriş Yap</a></p>
      <p style="margin-top: 30px; font-size: 14px; color: #71717a;">Eğer bu talebi siz yapmadıysanız, lütfen bizimle hemen iletişime geçin.</p>
      <br />
      <p>Sevgiler,</p>
      <p>Armoni Design Ekibi</p>
    </div>
  `;
  return sendEmail({ to, subject, htmlContent });
};

export const sendPasswordChangedEmail = async (to: string, name: string) => {
  const subject = "Armoni Design - Şifreniz Değiştirildi";
  const htmlContent = `
    <div style="font-family: sans-serif; max-w-md mx-auto;">
      <h2>Merhaba ${name},</h2>
      <p>Hesabınızın şifresi başarıyla değiştirildi.</p>
      <p>Eğer bu işlemi siz yapmadıysanız lütfen acilen bizimle iletişime geçin.</p>
      <br />
      <p>Sevgiler,</p>
      <p>Armoni Design Ekibi</p>
    </div>
  `;
  return sendEmail({ to, subject, htmlContent });
};

export const sendSupportNotificationEmail = async (subjectMatter: string, message: string, customerEmail: string) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'iletisim@armonidesign.com';
  const subject = `Yeni Destek Talebi: ${subjectMatter}`;
  const htmlContent = `
    <div style="font-family: sans-serif; max-w-md mx-auto;">
      <h2>Yeni Destek Talebi</h2>
      <p><strong>Müşteri:</strong> ${customerEmail}</p>
      <p><strong>Konu:</strong> ${subjectMatter}</p>
      <p><strong>Mesaj:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">${message}</blockquote>
    </div>
  `;
  return sendEmail({ to: adminEmail, subject, htmlContent });
};
