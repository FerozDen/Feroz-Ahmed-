import { createClient } from '@supabase/supabase-js';
import { INITIAL_SERVICES, INITIAL_DOCUMENTS, INITIAL_APPLICATIONS } from './seed-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uhvxsvvacrcyhskpmouc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodnhzdnZhY3JjeWhza3Btb3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MzU0NTgsImV4cCI6MjEwMTMxMTQ1OH0.yJ8a119bOwpWIjdB7JYvxZekkHJH1Vvb1KWrqr31HB0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncToSupabase() {
  console.log('--- Connecting to Supabase Project uhvxsvvacrcyhskpmouc ---');

  console.log('1. Seeding Services Catalog into Supabase...');
  for (const s of INITIAL_SERVICES) {
    const { error } = await supabase.from('services').upsert({
      id: s.id,
      title: s.title,
      category: s.category,
      description: s.description,
      estimated_days: s.estimatedDays,
      fee_amount: s.feeAmount,
      required_docs: s.requiredDocs,
      popular: s.popular || false,
      icon: s.icon,
      badge: s.badge || null
    });
    if (error) {
      console.log(`Note on service ${s.id}:`, error.message);
    } else {
      console.log(`Successfully synced service: ${s.title}`);
    }
  }

  console.log('2. Seeding Sample Vault Documents into Supabase...');
  for (const d of INITIAL_DOCUMENTS) {
    const { error } = await supabase.from('documents').upsert({
      title: d.title,
      category: d.category,
      document_number: d.documentNumber,
      file_size: d.fileSize,
      file_type: d.fileType,
      issue_date: d.issueDate,
      expiry_date: d.expiryDate,
      status: d.status,
      is_verified: d.isVerified,
      metadata: d.metadata
    });
    if (error) {
      console.log(`Note on document ${d.title}:`, error.message);
    } else {
      console.log(`Successfully synced document: ${d.title}`);
    }
  }

  console.log('3. Seeding Applications into Supabase...');
  for (const a of INITIAL_APPLICATIONS) {
    const { error } = await supabase.from('applications').upsert({
      application_number: a.applicationNumber,
      applicant_name: a.applicantName,
      service_title: a.serviceTitle,
      category: a.category,
      status: a.status,
      current_step: a.currentStep,
      fee_paid: a.feePaid,
      submitted_at: a.submittedAt,
      estimated_completion: a.estimatedCompletion,
      steps_history: a.stepsHistory
    });
    if (error) {
      console.log(`Note on app ${a.applicationNumber}:`, error.message);
    } else {
      console.log(`Successfully synced application: ${a.applicationNumber}`);
    }
  }

  console.log('--- Supabase Sync Finished ---');
}

syncToSupabase();
