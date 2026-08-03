export interface ServiceItem {
  id: string;
  title: string;
  category: 'Identity' | 'Income & Tax' | 'Residence & Caste' | 'Vehicle & Driving' | 'Business & Legal' | 'Property & Certificates';
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
    id: 'birth-certificate',
    title: 'Birth Certificate Assistance',
    category: 'Property & Certificates',
    description: 'Fresh birth registration, duplicate copy issuance, or name addition in Municipal records.',
    estimatedDays: 7,
    feeAmount: 299,
    requiredDocs: ['Hospital Discharge Summary / Slip', 'Parents Identity Proof', 'Address Proof'],
    popular: true,
    icon: 'Baby',
    badge: 'Popular'
  },
  {
    id: 'income-certificate',
    title: 'State Income Certificate Issue',
    category: 'Income & Tax',
    description: 'Official Tehsildar certified annual income certificate for scholarship, subsidies, and government schemes.',
    estimatedDays: 7,
    feeAmount: 250,
    requiredDocs: ['Salary Slip / ITR / Bank Statement', 'Ration Card / Voter ID', 'Self Declaration Affidavit'],
    popular: true,
    icon: 'TrendingUp',
    badge: 'Govt Subsidy'
  },
  {
    id: 'caste-certificate',
    title: 'Caste / Tribe Certificate (SC/ST/OBC)',
    category: 'Residence & Caste',
    description: 'Verification and issuance of official Caste Certificate for education reservation and welfare benefits.',
    estimatedDays: 10,
    feeAmount: 350,
    requiredDocs: ['Father/Relative Caste Proof', 'Voter Card / Aadhaar', 'School Register Copy'],
    popular: true,
    icon: 'ShieldCheck',
    badge: 'High Demand'
  },
  {
    id: 'ews-certificate',
    title: 'Economically Weaker Section (EWS) Cert',
    category: 'Income & Tax',
    description: '10% central & state government reservation certificate for eligible candidates.',
    estimatedDays: 8,
    feeAmount: 299,
    requiredDocs: ['Family Income Proof', 'Property Declaration Affidavit', 'Aadhaar & PAN'],
    popular: true,
    icon: 'Award',
    badge: 'Fast Track'
  },
  {
    id: 'domicile-certificate',
    title: 'Residence / Domicile Certificate',
    category: 'Residence & Caste',
    description: 'Official proof of permanent residence in state for education admissions & government recruitment.',
    estimatedDays: 8,
    feeAmount: 300,
    requiredDocs: ['Continuous 10-yr Residence Proof', 'School Leaving Cert', 'Aadhaar Card'],
    popular: true,
    icon: 'Home'
  },
  {
    id: 'marriage-certificate',
    title: 'Marriage Registration Certificate',
    category: 'Property & Certificates',
    description: 'Legal registration under Special Marriage Act or Hindu Marriage Act with official certificate.',
    estimatedDays: 10,
    feeAmount: 499,
    requiredDocs: ['Bride & Groom Age Proof', 'Wedding Card / Photos', 'Witness Identity Proofs'],
    popular: true,
    icon: 'Heart',
    badge: 'Doorstep Assist'
  },
  {
    id: 'death-certificate',
    title: 'Death Certificate Issue',
    category: 'Property & Certificates',
    description: 'Official Municipal / Panchayat death record registration and duplicate certificate issuance.',
    estimatedDays: 5,
    feeAmount: 250,
    requiredDocs: ['Doctor / Hospital Cause of Death Slip', 'Deceased Aadhaar / Voter ID', 'Applicant ID Proof'],
    icon: 'FileText'
  },
  {
    id: 'encumbrance-certificate',
    title: 'Encumbrance Certificate (EC) Issue',
    category: 'Property & Certificates',
    description: 'Property search report verifying liability, mortgage, or clean title history from Sub-Registrar.',
    estimatedDays: 4,
    feeAmount: 399,
    requiredDocs: ['Property Sale Deed Copy', 'Survey / Khata Number', 'Applicant ID Proof'],
    popular: true,
    icon: 'Key',
    badge: 'Property Legal'
  },
  {
    id: 'property-mutation',
    title: 'Property Mutation & Revenue Record (Khata)',
    category: 'Property & Certificates',
    description: 'Transfer of title ownership in municipal land records (Pahani, Patta, 7/12, or Khata).',
    estimatedDays: 14,
    feeAmount: 799,
    requiredDocs: ['Registered Sale Deed', 'Latest Property Tax Paid Receipt', 'Seller & Buyer Aadhaar'],
    icon: 'Building'
  },
  {
    id: 'driving-licence-renew',
    title: 'Driving Licence Renewal & Vehicle RC',
    category: 'Vehicle & Driving',
    description: 'Renew expired Smart Card Driving Licence, address change, or Vehicle RC Transfer assistance.',
    estimatedDays: 7,
    feeAmount: 450,
    requiredDocs: ['Existing DL / RC Copy', 'Medical Fitness Certificate Form 1A', 'Aadhaar Card'],
    popular: true,
    icon: 'Car',
    badge: 'Doorstep Pickup'
  },
  {
    id: 'passport-fresh',
    title: 'Passport Assistance (Fresh & Tatkal)',
    category: 'Identity',
    description: 'End-to-end assistance for Passport appointment booking, Annexure filing, and Police verification guide.',
    estimatedDays: 12,
    feeAmount: 1499,
    requiredDocs: ['Aadhaar Card', 'PAN Card', 'Bank Passbook / Electricity Bill'],
    popular: true,
    icon: 'Globe'
  },
  {
    id: 'pan-new',
    title: 'New PAN Card & Correction (Form 49A)',
    category: 'Income & Tax',
    description: 'Instant e-PAN & physical PAN card allotment or name/DOB correction with doorstep delivery.',
    estimatedDays: 4,
    feeAmount: 220,
    requiredDocs: ['Identity Proof', 'Address Proof', 'Passport Photo'],
    popular: true,
    icon: 'CreditCard'
  },
  {
    id: 'aadhaar-update',
    title: 'Aadhaar Enrolment & Update Assistance',
    category: 'Identity',
    description: 'Update demographic details (address, mobile, name) or new enrolment appointment booking.',
    estimatedDays: 3,
    feeAmount: 150,
    requiredDocs: ['Valid Address Proof (Utility bill / Rent Agreement)', 'Current Aadhaar Number'],
    popular: true,
    icon: 'Fingerprint'
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
    expiryDate: '2026-08-28',
    status: 'Expiring Soon',
    isVerified: true,
    metadata: {
      issuingAuthority: 'RTO Andheri, Mumbai',
      holderName: 'Rahul Sharma',
      state: 'Maharashtra'
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
  currentStep: number;
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
    serviceTitle: 'Driving Licence Renewal & Vehicle RC',
    category: 'Vehicle & Driving',
    applicantName: 'Rahul Sharma',
    status: 'Processing',
    currentStep: 3,
    feePaid: 450,
    submittedAt: '2026-08-01',
    estimatedCompletion: '2026-08-07',
    stepsHistory: [
      { title: 'Application Submitted', description: 'Form and uploaded DL documents received.', completed: true, timestamp: '2026-08-01 10:15 AM' },
      { title: 'Doorstep Pickup', description: 'Field executive collected physical copies.', completed: true, timestamp: '2026-08-02 02:30 PM' },
      { title: 'Government Processing', description: 'Submitted to official Issuing Authority portal.', completed: false, timestamp: 'In Progress' },
      { title: 'Certificate Delivered', description: 'Certificate delivered to home address.', completed: false }
    ]
  }
];
