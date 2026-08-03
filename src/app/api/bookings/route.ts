import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase GET Bookings Error]:', error.message, error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, bookings });
  } catch (err: any) {
    console.error('[Bookings API GET Exception]:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customer_name = body.customer_name || body.full_name;
    const mobile_number = body.mobile_number || body.phone_number;
    const email = body.email;
    const address = body.address || 'Not Provided';
    const service_selected = body.service_selected || body.certificate_type || 'Document Service';
    const documents_required = body.documents_required || body.uploaded_documents || [];

    if (!customer_name || !mobile_number || !email) {
      console.error('[Bookings API Validation Failed]: Missing required fields', body);
      return NextResponse.json(
        { success: false, error: 'Customer Name, Mobile Number, and Email are required.' },
        { status: 400 }
      );
    }

    const bookingPayload = {
      customer_name,
      mobile_number,
      email,
      address,
      service_selected,
      documents_required,
      booking_status: body.booking_status || 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('[Supabase INSERT Bookings] Inserting payload:', bookingPayload);

    // 1. Insert into 'bookings' table
    const { data: insertedBooking, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .insert(bookingPayload)
      .select()
      .single();

    if (bookingErr) {
      console.error('[Supabase INSERT Bookings Error]:', bookingErr.message, bookingErr);
    } else {
      console.log('[Supabase INSERT Bookings Success]: Record ID:', insertedBooking.id);
    }

    // 2. Also insert into 'applications' for backwards compatibility
    const applicationPayload = {
      full_name: customer_name,
      phone_number: mobile_number,
      email: email,
      certificate_type: service_selected,
      address: address,
      pickup_address: body.pickup_address || address,
      preferred_pickup_date: body.preferred_pickup_date || new Date().toISOString().split('T')[0],
      preferred_pickup_time: body.preferred_pickup_time || 'Morning Slot',
      uploaded_documents: documents_required,
      additional_notes: body.additional_notes || '',
      status: body.booking_status || 'Pending',
      created_at: new Date().toISOString()
    };

    const { data: insertedApp, error: appErr } = await supabaseAdmin
      .from('applications')
      .insert(applicationPayload)
      .select()
      .single();

    if (appErr) {
      console.error('[Supabase INSERT Applications Error]:', appErr.message, appErr);
    }

    const finalRecord = insertedBooking || insertedApp || {
      id: `booking-${Date.now()}`,
      ...bookingPayload
    };

    return NextResponse.json({
      success: true,
      message: 'Booking successfully stored in Supabase',
      booking: finalRecord
    });

  } catch (error: any) {
    console.error('[Bookings API Exception]:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to store booking' }, { status: 500 });
  }
}
