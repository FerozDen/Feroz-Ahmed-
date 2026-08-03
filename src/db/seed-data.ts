export interface ServiceItem {
  id: string;
  title: string;
  category: 'Identity' | 'Income & Tax' | 'Residence & Caste' | 'Vehicle & Driving' | 'Business & Legal';
  description: string;
  estimatedDays: number;
  feeAmount: number;
  requiredDocs: string[];
  popular?: boolean;
  icon: string;
  badge?: string;
}

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'aadhaar-new',
    title: 'New Aadhaar Card Enrolment',
    category: 'Identity',
    description: 'Fresh enrolment for Aadhaar Card with biometric verification and official acknowledgement slip.',
    estimatedDays: 7,
    feeAmount: 150,
    requiredDocs: ['Proof of Identity', 'Proof of Address', 'Date of Birth Proof'],
    popular: true,
    icon: 'Fingerprint',
    badge: 'High Demand'
  },
  {
    id: 'aadhaar-update',
    title: 'Aadhaar Address & Mobile Update',
    category: 'Identity',
    description: 'Update demographic details including residential address, mobile number, and email in Aadhaar.',
    estimatedDays: 3,
    feeAmount: 100,
    requiredDocs: ['Valid Address Proof (Utility bill / Rent Agreement)', 'Current Aadhaar Number'],
    popular: true,
    icon: 'Edit3'
  },
  {
    id: 'pan-new',
    title: 'New PAN Card Application (Form 49A)',
    category: 'Income & Tax',
    description: 'Instant e-PAN & physical PAN card allotment for individuals and non-citizens.',
    estimatedDays: 5,
    feeAmount: 220,
    requiredDocs: ['Identity Proof', 'Address Proof', 'Passport Photo'],
    popular: true,
    icon: 'CreditCard',
    badge: 'Popular'
  },
  {
    id: 'pan-correction',
    title: 'PAN Card Correction / Reprint',
    category: 'Income & Tax',
    description: 'Correct name, date of birth, photo, father’s name or request a duplicate physical PAN card.',
    estimatedDays: 4,
    feeAmount: 180,
    requiredDocs: ['Existing PAN Copy', 'Supporting Correction Document'],
    icon: 'FileCheck'
  },
  {
    id: 'income-certificate',
    title: 'State Income Certificate Issue',
    category: 'Income & Tax',
    description: 'Official Tehsildar certified annual income certificate for scholarship, subsidies, and government schemes.',
    estimatedDays: 10,
    feeAmount: 250,
    requiredDocs: ['Salary Slip / ITR', 'Ration Card / Voter ID', 'Self Declaration Affidavit'],
    popular: true,
    icon: 'TrendingUp',
    badge: 'Govt Subsidy'
  },
  {
    id: 'domicile-certificate',
    title: 'Residence / Domicile Certificate',
    category: 'Residence & Caste',
    description: 'Official proof of permanent residence in state for education admissions & recruitment.',
    estimatedDays: 12,
    feeAmount: 300,
    requiredDocs: ['Continuous 10-yr Residence Proof', 'School Leaving Cert', 'Aadhaar Card'],
    popular: true,
    icon: 'Home'
  },
  {
    id: 'caste-certificate',
    title: 'Caste / Tribe Certificate (SC/ST/OBC)',
    category: 'Residence & Caste',
    description: 'Verification and issuance of Caste Certificate for reservation and welfare benefits.',
    estimatedDays: 15,
    feeAmount: 350,
    requiredDocs: ['Father/Relative Caste Proof', 'Voter Card', 'School Register Copy'],
    icon: 'ShieldCheck'
  },
  {
    id: 'driving-licence-renew',
    title: 'Driving Licence Renewal & DL Service',
    category: 'Vehicle & Driving',
    description: 'Renew expired Smart Card Driving Licence or apply for International Driving Permit (IDP).',
    estimatedDays: 7,
    feeAmount: 450,
    requiredDocs: ['Existing DL Copy', 'Medical Fitness Certificate Form 1A', 'Aadhaar Card'],
    popular: true,
    icon: 'Car',
    badge: 'Fast Track'
  },
  {
    id: 'passport-fresh',
    title: 'Tatkal & Normal Fresh Passport',
    category: 'Identity',
    description: 'End-to-end assistance for Passport appointment booking, Annexure filing, and Police verification guide.',
    estimatedDays: 14,
    feeAmount: 1750,
    requiredDocs: ['Aadhaar Card', 'PAN Card', 'Bank Passbook / Electricity Bill'],
    popular: true,
    icon: 'Globe'
  },
  {
    id: 'gst-registration',
    title: 'New GST Registration & Filing',
    category: 'Business & Legal',
    description: 'GSTIN Registration for businesses, startups, and freelancers with certificate delivery.',
    estimatedDays: 4,
    feeAmount: 999,
    requiredDocs: ['PAN Card', 'Business Premises Electricity Bill/NOC', 'Bank Statement'],
    icon: 'Briefcase'
  }
];

export interface StoredDocument {
  id: string;
  title: string;
  category: 'Identity' | 'Income & Tax' | 'Residence' | 'Vehicle' | 'Education';
  documentNumber: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png';
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  isVerified: boolean;
  metadata: {
    issuingAuthority: string;
    holderName: string;
    state: string;
  };
}

export const INITIAL_DOCUMENTS: StoredDocument[] = [
  {
    id: 'doc-101',
    title: 'Aadhaar Card (UIDAI)',
    category: 'Identity',
    documentNumber: 'XXXX-XXXX-9842',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    issueDate: '2021-04-12',
    expiryDate: 'Lifetime',
    status: 'Active',
    isVerified: true,
    metadata: {
      issuingAuthority: 'Unique Identification Authority of India',
      holderName: 'Rahul Sharma',
      state: 'Maharashtra'
    }
  },
  {
    id: 'doc-102',
    title: 'Permanent Account Number (PAN)',
    category: 'Income & Tax',
    documentNumber: 'ABCPS1234K',
    fileSize: '850 KB',
    fileType: 'pdf',
    issueDate: '2019-08-20',
    expiryDate: 'Lifetime',
    status: 'Active',
    isVerified: true,
    metadata: {
      issuingAuthority: 'Income Tax Department of India',
      holderName: 'Rahul Sharma',
      state: 'Central'
    }
  },
  {
    id: 'doc-103',
    title: 'Smart Card Driving License',
    category: 'Vehicle',
    documentNumber: 'MH02 2018009411',
    fileSize: '2.1 MB',
    fileType: 'pdf',
    issueDate: '2018-09-15',
    expiryDate: '2026-08-28', // Expiring in 25 days!
    status: 'Expiring Soon',
    isVerified: true,
    metadata: {
      issuingAuthority: 'RTO Andheri, Mumbai',
      holderName: 'Rahul Sharma',
      state: 'Maharashtra'
    }
  },
  {
    id: 'doc-104',
    title: 'State Income Certificate (FY 2025-26)',
    category: 'Income & Tax',
    documentNumber: 'INC/2025/98231',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    issueDate: '2025-05-10',
    expiryDate: '2026-03-31', // Expired or near
    status: 'Expiring Soon',
    isVerified: true,
    metadata: {
      issuingAuthority: 'Tehsildar Office, Pune',
      holderName: 'Rahul Sharma',
      state: 'Maharashtra'
    }
  },
  {
    id: 'doc-105',
    title: 'Indian Passport (36 Pages)',
    category: 'Identity',
    documentNumber: 'Z8472910',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    issueDate: '2016-01-10',
    expiryDate: '2026-01-09',
    status: 'Expired',
    isVerified: true,
    metadata: {
      issuingAuthority: 'Regional Passport Office, Mumbai',
      holderName: 'Rahul Sharma',
      state: 'Central'
    }
  }
];

export interface ApplicationTrackItem {
  id: string;
  applicationNumber: string;
  serviceTitle: string;
  category: string;
  applicantName: string;
  status: 'Submitted' | 'Verification' | 'Processing' | 'Completed' | 'Rejected';
  currentStep: number; // 1 to 4
  feePaid: number;
  submittedAt: string;
  estimatedCompletion: string;
  stepsHistory: {
    title: string;
    description: string;
    completed: boolean;
    timestamp?: string;
  }[];
}

export const INITIAL_APPLICATIONS: ApplicationTrackItem[] = [
  {
    id: 'app-901',
    applicationNumber: 'CR-2026-849201',
    serviceTitle: 'Driving Licence Renewal & DL Service',
    category: 'Vehicle & Driving',
    applicantName: 'Rahul Sharma',
    status: 'Processing',
    currentStep: 3,
    feePaid: 450,
    submittedAt: '2026-08-01',
    estimatedCompletion: '2026-08-07',
    stepsHistory: [
      { title: 'Application Submitted', description: 'Form and uploaded DL documents received.', completed: true, timestamp: '2026-08-01 10:15 AM' },
      { title: 'Document Verification', description: 'Identity and Form 1A verified by certiR agent.', completed: true, timestamp: '2026-08-02 02:30 PM' },
      { title: 'RTO Authority Processing', description: 'Application submitted to RTO portal for smart card printing.', completed: false, timestamp: 'In Progress' },
      { title: 'Digital & Physical Delivery', description: 'Updated e-DL sent to Vault & physical card dispatched.', completed: false }
    ]
  },
  {
    id: 'app-902',
    applicationNumber: 'CR-2026-729104',
    serviceTitle: 'State Income Certificate Issue',
    category: 'Income & Tax',
    applicantName: 'Rahul Sharma',
    status: 'Verification',
    currentStep: 2,
    feePaid: 250,
    submittedAt: '2026-08-02',
    estimatedCompletion: '2026-08-11',
    stepsHistory: [
      { title: 'Application Submitted', description: 'Salary slips and declaration filed successfully.', completed: true, timestamp: '2026-08-02 11:00 AM' },
      { title: 'Tehsildar Scrutiny', description: 'Reviewing income tax declarations and address proof.', completed: false, timestamp: 'Under Review' },
      { title: 'Digital Signature & Approval', description: 'Authorized officer signing digital certificate.', completed: false },
      { title: 'Certificate Issued', description: 'Direct download available in your Vault.', completed: false }
    ]
  }
];
