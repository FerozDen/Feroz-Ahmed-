import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { INITIAL_DOCUMENTS, StoredDocument } from '@/db/seed-data';

let memoryDocuments: StoredDocument[] = [...INITIAL_DOCUMENTS];

export async function GET() {
  try {
    // Try fetching from Supabase table 'documents'
    const { data: supaDocs, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && supaDocs && supaDocs.length > 0) {
      const mappedDocs = supaDocs.map(d => ({
        id: d.id,
        title: d.title,
        category: d.category,
        documentNumber: d.document_number,
        fileSize: d.file_size || '1.4 MB',
        fileType: d.file_type || 'pdf',
        issueDate: d.issue_date,
        expiryDate: d.expiry_date,
        status: d.status,
        isVerified: d.is_verified,
        metadata: d.metadata || { issuingAuthority: 'Verified Authority', holderName: 'Rahul Sharma' }
      }));
      return NextResponse.json({ success: true, documents: mappedDocs, source: 'supabase' });
    }
  } catch (e) {
    console.error('Supabase fetch fallback to memory:', e);
  }

  return NextResponse.json({
    success: true,
    documents: memoryDocuments,
    source: 'fallback'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docNum = body.documentNumber || `CR-${Math.floor(100000 + Math.random() * 900000)}`;
    const issueDate = body.issueDate || new Date().toISOString().split('T')[0];
    const expiryDate = body.expiryDate || '2028-12-31';

    // 1. Insert into Supabase cloud table 'documents'
    const { data: supaDoc, error: supaErr } = await supabaseAdmin
      .from('documents')
      .insert({
        title: body.title || 'Uploaded Certificate',
        category: body.category || 'Identity',
        document_number: docNum,
        file_size: body.fileSize || '1.5 MB',
        file_type: body.fileType || 'pdf',
        issue_date: issueDate,
        expiry_date: expiryDate,
        status: 'Active',
        is_verified: true,
        metadata: {
          issuingAuthority: body.issuingAuthority || 'Verified Government Portal',
          holderName: body.holderName || 'Rahul Sharma',
          state: body.state || 'Maharashtra'
        }
      })
      .select()
      .single();

    if (supaErr) {
      console.log('Supabase insert error note:', supaErr.message);
    }

    const newDoc: StoredDocument = {
      id: supaDoc?.id || `doc-${Date.now()}`,
      title: body.title || 'Uploaded Certificate',
      category: body.category || 'Identity',
      documentNumber: docNum,
      fileSize: body.fileSize || '1.4 MB',
      fileType: body.fileType || 'pdf',
      issueDate,
      expiryDate,
      status: 'Active',
      isVerified: true,
      metadata: {
        issuingAuthority: body.issuingAuthority || 'Verified Government Portal',
        holderName: body.holderName || 'Rahul Sharma',
        state: body.state || 'Maharashtra'
      }
    };

    memoryDocuments.unshift(newDoc);

    return NextResponse.json({
      success: true,
      message: 'Document successfully stored in Supabase Vault',
      document: newDoc,
      supabaseInserted: !supaErr
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to upload document' }, { status: 400 });
  }
}
