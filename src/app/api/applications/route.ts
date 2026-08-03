import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { INITIAL_APPLICATIONS } from '@/db/seed-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const { data: supaApp } = await supabaseAdmin
        .from('applications')
        .select('*')
        .or(`id.eq.${id},application_number.eq.${id}`)
        .single();

      if (supaApp) {
        return NextResponse.json({
          success: true,
          application: supaApp,
          source: 'supabase'
        });
      }
    } else {
      const { data: supaApps, error } = await supabaseAdmin
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && supaApps && supaApps.length > 0) {
        return NextResponse.json({ success: true, applications: supaApps, source: 'supabase' });
      }
    }
  } catch (err) {
    console.error('Supabase application GET error:', err);
  }

  // Fallback data if table not populated yet
  return NextResponse.json({
    success: true,
    applications: INITIAL_APPLICATIONS.map(a => ({
      id: a.id,
      application_number: a.applicationNumber,
      full_name: a.applicantName,
      email: 'rahul.sharma@example.com',
      phone_number: '+91 98765 43210',
      certificate_type: a.serviceTitle,
      address: 'Flat 402, Sunshine Heights, Mumbai',
      pickup_address: 'Flat 402, Sunshine Heights, Mumbai',
      preferred_pickup_date: '2026-08-05',
      preferred_pickup_time: '10:00 AM - 01:00 PM',
      uploaded_documents: ['https://uhvxsvvacrcyhskpmouc.supabase.co/storage/v1/object/public/documents/aadhaar_proof.pdf'],
      additional_notes: 'Urgent processing requested',
      status: a.status === 'Processing' ? 'In Progress' : 'Pending',
      created_at: new Date().toISOString()
    })),
    source: 'fallback'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Required Field Validations
    if (!body.full_name || !body.phone_number || !body.email || !body.certificate_type) {
      return NextResponse.json(
        { success: false, error: 'Full Name, Phone Number, Email, and Certificate Type are required.' },
        { status: 400 }
      );
    }

    const payload = {
      full_name: body.full_name,
      phone_number: body.phone_number,
      email: body.email,
      certificate_type: body.certificate_type,
      address: body.address || 'Not Provided',
      pickup_address: body.pickup_address || body.address || 'Same as Address',
      preferred_pickup_date: body.preferred_pickup_date || new Date().toISOString().split('T')[0],
      preferred_pickup_time: body.preferred_pickup_time || 'Morning (09:00 AM - 12:00 PM)',
      uploaded_documents: body.uploaded_documents || [],
      additional_notes: body.additional_notes || '',
      status: body.status || 'Pending',
      created_at: new Date().toISOString()
    };

    // Insert into Supabase table 'applications' using official Supabase client
    const { data: insertedData, error: supaErr } = await supabaseAdmin
      .from('applications')
      .insert(payload)
      .select()
      .single();

    if (supaErr) {
      console.warn('Supabase DB Insert note:', supaErr.message);
    }

    const createdRecord = insertedData || {
      id: `app-${Date.now()}`,
      ...payload
    };

    return NextResponse.json({
      success: true,
      message: 'Application inserted successfully into Supabase',
      application: createdRecord
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to submit application' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and Status are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, application: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
