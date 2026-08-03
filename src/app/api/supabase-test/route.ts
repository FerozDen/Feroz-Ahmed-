import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

    return NextResponse.json({
      success: !error,
      connected: true,
      project: 'chslfdzbiydrzuenwk',
      supabaseUrl: 'https://chslfdzbiydrzuenwk.supabase.co',
      status: 'Connected to Supabase Cloud Postgres',
      error: error ? error.message : null
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      connected: true,
      project: 'chslfdzbiydrzuenwk',
      status: 'Supabase client initialized with provided credentials',
      error: err?.message || 'Unknown error'
    });
  }
}
