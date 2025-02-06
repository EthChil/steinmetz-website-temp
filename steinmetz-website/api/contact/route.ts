import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactEmailTemplate } from '@/components/ContactEmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Steinmetz <founders@steinmetzmotors.com>', // Update with your verified domain
      to: process.env.ALERT_EMAIL!,
      subject: 'New Contact Form Submission - Steinmetz Website',
      react: await ContactEmailTemplate(formData),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 