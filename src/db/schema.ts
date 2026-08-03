import { pgTable, text, timestamp, integer, boolean, uuid, jsonb } from 'drizzle-orm/pg-core';

// User table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  role: text('role').default('user').notNull(), // 'user' | 'agent' | 'admin'
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Document Store (Vault) table
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'Identity' | 'Income' | 'Tax' | 'Residence' | 'Education' | 'Other'
  documentNumber: text('document_number'),
  fileUrl: text('file_url'),
  fileSize: text('file_size'),
  fileType: text('file_type'), // 'pdf' | 'jpg' | 'png'
  issueDate: text('issue_date'),
  expiryDate: text('expiry_date'),
  status: text('status').default('Active').notNull(), // 'Active' | 'Expiring Soon' | 'Expired'
  isVerified: boolean('is_verified').default(true),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Services Catalog table
export const services = pgTable('services', {
  id: text('id').primaryKey(), // e.g. 'aadhaar-new', 'pan-correction', 'income-cert'
  title: text('title').notNull(),
  category: text('category').notNull(), // 'Identity' | 'Financial' | 'Certificates' | 'Vehicle'
  description: text('description').notNull(),
  estimatedDays: integer('estimated_days').notNull(),
  feeAmount: integer('fee_amount').notNull(),
  requiredDocs: text('required_docs').array(),
  popular: boolean('popular').default(false),
  icon: text('icon').notNull(),
});

// Service Applications table
export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationNumber: text('application_number').notNull().unique(),
  userId: uuid('user_id').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  serviceId: text('service_id').notNull(),
  serviceTitle: text('service_title').notNull(),
  category: text('category').notNull(),
  status: text('status').default('Submitted').notNull(), // 'Submitted' | 'Verification' | 'Processing' | 'Completed' | 'Rejected'
  currentStep: integer('current_step').default(1).notNull(), // 1 to 4
  applicantDetails: jsonb('applicant_details').notNull(),
  attachedDocs: jsonb('attached_docs'),
  notes: text('notes'),
  feePaid: integer('fee_paid').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Document Renewals table
export const renewals = pgTable('renewals', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').notNull(),
  userId: uuid('user_id').notNull(),
  documentTitle: text('document_title').notNull(),
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  status: text('status').default('Pending Approval').notNull(),
  newExpiryDate: text('new_expiry_date'),
  fee: integer('fee').notNull(),
});
