import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SupportTicket } from '@/models/SupportTicket';
import { getSession } from '@/lib/auth';
import { sendSupportNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const ticket = await SupportTicket.create({
      userId: session.user.id,
      subject,
      messages: [{ sender: 'customer', message }],
      status: 'new',
    });

    // Send Support Notification Email
    try {
      await sendSupportNotificationEmail(subject, message, session.user.email);
    } catch (e) {
      console.error('Failed to send support email', e);
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('Support ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
