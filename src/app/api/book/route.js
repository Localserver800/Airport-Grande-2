import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { supabase } from '../../../lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, checkIn, checkOut, roomId, roomLabel, specialRequests, paymentRef } = body;

    // --- SECURITY: Input Validation ---
    if (!name || !email || !phone || !checkIn || !checkOut || !roomId || !paymentRef) {
      return NextResponse.json({ success: false, message: 'Missing required booking information.' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 });
    }

    // Date validation
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return NextResponse.json({ success: false, message: 'Invalid stay dates.' }, { status: 400 });
    }

    // 1. Insert into Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('bookings')
      .insert([{
        guest_name: name.substring(0, 100), // Sanitization: Limit length
        guest_email: email.toLowerCase(),
        guest_phone: phone.substring(0, 20),
        check_in: checkIn,
        check_out: checkOut,
        room_id: roomId,
        room_name: roomLabel || 'Standard Room',
        special_requests: (specialRequests || '').substring(0, 500),
        status: 'confirmed', // Keep as 'confirmed' for now as it's called after payment
        payment_ref: paymentRef
      }]);

    if (insertError) throw insertError;

    // 2. Send Confirmation Email via Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.HOTEL_EMAIL,
        pass: process.env.HOTEL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Airport Grande Lodge" <${process.env.HOTEL_EMAIL}>`,
      to: email,
      subject: `Your Booking Ticket - ${roomLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #b45309;">Airport Grande</h2>
          <h3>Booking Confirmation</h3>
          <p>Dear ${name},</p>
          <p>Thank you for choosing us! Your reservation for <strong>${roomLabel}</strong> is locked in.</p>
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">PAYMENT REFERENCE:</p>
            <h1 style="margin: 5px 0; color: #b45309; letter-spacing: 2px;">${paymentRef}</h1>
          </div>
          <p><strong>Check-in:</strong> ${checkIn}</p>
          <p><strong>Check-out:</strong> ${checkOut}</p>
          <p><em>Please show this reference number to the front desk upon arrival to receive your keys.</em></p>
          <p>Safe travels!</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully to:", email);
    } catch (emailErr) {
      console.error("Nodemailer Error:", emailErr);
      // We don't crash the whole process if only the email fails, 
      // but we log it so you can see it in Vercel Logs.
    }

    // 3. Sync to Google Calendar (Silently)
    try {
      if (process.env.GOOGLE_CREDENTIALS) {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/calendar.events'],
        });
        const calendar = google.calendar({ version: 'v3', auth });

        await calendar.events.insert({
          calendarId: process.env.HOTEL_EMAIL,
          requestBody: {
            summary: `Booking: ${roomLabel} - ${name}`,
            location: 'Airport Grande Luxury Lodge',
            description: `Ref: ${paymentRef}\nPhone: ${phone}\nEmail: ${email}\nRequests: ${specialRequests || 'None'}`,
            start: { dateTime: new Date(`${checkIn}T14:00:00+00:00`).toISOString(), timeZone: 'Africa/Accra' },
            end: { dateTime: new Date(`${checkOut}T11:00:00+00:00`).toISOString(), timeZone: 'Africa/Accra' },
            colorId: '5',
          },
        });
      } else {
        console.warn('Google Calendar Sync skipped: GOOGLE_CREDENTIALS not found.');
      }
    } catch (calError) {
      console.error('Google Calendar Sync Failed:', calError.message);
    }

    return NextResponse.json({ success: true, message: `Booking reserved! We just emailed your ticket to ${email}.` });

  } catch (error) {
    console.error('Server Booking Error:', error);
    return NextResponse.json({ success: false, message: 'Server error. Please contact support with your payment reference.' }, { status: 500 });
  }
}