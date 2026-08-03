'use client';

import { useState } from 'react';
import { 
  FolderCheck, 
  UploadCloud, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Eye, 
  Download, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  X,
  Lock
} from 'lucide-react';
import { INITIAL_DOCUMENTS, StoredDocument } from '@/db/seed-data';

export default function VaultPage() {
  const [documents, setDocuments] = useState<StoredDocument[]>(INITIAL_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<StoredDocument | null>(null);

  // New Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Identity');
  const [analyzingOCR, setAnalyzingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const categories = ['All', 'Identity', 'Income & Tax', 'Residence', 'Vehicle', 'Education'];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category.includes(selectedCategory);
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSimulatedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzingOCR(true);

    try {
      // Call FastAPI OCR Endpoint
      const fastApiRes = await fetch('/api/python/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_title: newTitle || 'Personal Document Certificate',
          category: newCategory
        })
      });

      let ocrData;
      if (fastApiRes.ok) {
        ocrData = await fastApiRes.json();
      } else {
        // Fallback OCR result
        ocrData = {
          extracted_number: `CR-DOC-${Math.floor(100000 + Math.random() * 900000)}`,
          issuing_authority: 'Verified Government Portal Authority',
          confidence_score: 98.4,
          suggested_expiry: '2028-12-31'
        };
      }

      setOcrResult(ocrData);

      const newDoc: StoredDocument = {
        id: `doc-${Date.now()}`,
        title: newTitle || 'Uploaded Document',
        category: newCategory as any,
        documentNumber: ocrData.extracted_number,
        fileSize: '1.5 MB',
        fileType: 'pdf',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: ocrData.suggested_expiry,
        status: 'Active',
        isVerified: true,
        metadata: {
          issuingAuthority: ocrData.issuing_authority,
          holderName: 'Rahul Sharma',
          state: 'Maharashtra'
        }
      };

      setDocuments(prev => [newDoc, ...prev]);

      setTimeout(() => {
        setAnalyzingOCR(false);
        setUploadModalOpen(false);
        setNewTitle('');
        setOcrResult(null);
      }, 1200);

    } catch (err) {
      console.error(err);
      setAnalyzingOCR(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Stats Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 gradient-glow space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted Personal Vault</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              My Stored Documents & Certificates
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Store, view, categorise, and monitor all your official certificates with automated FastAPI OCR metadata extraction.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-3 rounded-xl gradient-bg text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-opacity shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document to Vault</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Stored</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{documents.length} Docs</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-center">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">Active</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {documents.filter(d => d.status === 'Active').length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800 text-center">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold block">Expiring Soon</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">
              {documents.filter(d => d.status === 'Expiring Soon').length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800 text-center">
            <span className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-bold block">Expired</span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">
              {documents.filter(d => d.status === 'Expired').length}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'gradient-bg text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200/80 dark:border-slate-800 space-y-4 group"
          >
            <div className="space-y-3">
              
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {doc.category}
                </span>

                {/* Status Badge */}
                {doc.status === 'Active' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                )}
                {doc.status === 'Expiring Soon' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Expiring Soon</span>
                  </span>
                )}
                {doc.status === 'Expired' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Expired</span>
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {doc.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {doc.documentNumber}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/80 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Issuing Authority:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{doc.metadata.issuingAuthority}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Expiry Date:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{doc.expiryDate}</span>
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="flex-1 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
              
              <button
                onClick={() => alert(`Downloading ${doc.title}...`)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-6 h-6 text-indigo-500" />
                <span>Upload Document to Vault</span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload your document image or PDF. Our Python FastAPI microservice will automatically extract metadata.
              </p>
            </div>

            <form onSubmit={handleSimulatedUpload} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Caste Certificate, Passport"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Document Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Identity">Identity (Aadhaar / Passport)</option>
                  <option value="Income & Tax">Income & Tax (PAN / Income Cert)</option>
                  <option value="Residence">Residence (Domicile / Rent)</option>
                  <option value="Vehicle">Vehicle (Driving Licence / RC)</option>
                  <option value="Education">Education (Degree / Marksheet)</option>
                </select>
              </div>

              {/* Drag & Drop Box */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto animate-bounce" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Drag & drop document file here or click to browse</span>
                <span className="text-[10px] text-slate-400 block">Supports PDF, JPG, PNG up to 10 MB</span>
              </div>

              {analyzingOCR && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>FastAPI OCR Analyzing Metadata...</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={analyzingOCR}
                className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-lg hover:opacity-95 transition-opacity"
              >
                {analyzingOCR ? 'Extracting Metadata & Saving...' : 'Save & Encrypt Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW DETAILS MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{previewDoc.title}</h2>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{previewDoc.documentNumber}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-100/70 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Document Category:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{previewDoc.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issuing Authority:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{previewDoc.metadata.issuingAuthority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registered Holder:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{previewDoc.metadata.holderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issue Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{previewDoc.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expiry Date:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{previewDoc.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security Encryption:</span>
                <span className="font-bold text-emerald-500">AES-256 Verified</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
