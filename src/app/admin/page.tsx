'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Trash2, 
  Eye, 
  ExternalLink, 
  X,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UnifiedRecord {
  id: string;
  source_table: 'bookings' | 'applications';
  customer_name: string;
  mobile_number: string;
  email: string;
  service_selected: string;
  address?: string;
  documents_required?: string[];
  booking_status: 'Pending' | 'In Progress' | 'Documents Collected' | 'Submitted' | 'Approved' | 'Rejected' | 'Completed';
  created_at: string;
  additional_notes?: string;
}

export default function AdminDashboardPage() {
  const [records, setRecords] = useState<UnifiedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');

  // Inspector Modal state
  const [selectedRecord, setSelectedRecord] = useState<UnifiedRecord | null>(null);

  const statuses = [
    'All',
    'Pending',
    'In Progress',
    'Documents Collected',
    'Submitted',
    'Approved',
    'Rejected',
    'Completed'
  ];

  const fetchSupabaseRecords = async () => {
    setLoading(true);
    try {
      console.log('[Admin Dashboard] Querying Supabase tables bookings and applications...');

      const unified: UnifiedRecord[] = [];

      // 1. Fetch from 'bookings' table
      const { data: bookingsData, error: bErr } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bErr) {
        console.warn('[Admin Supabase bookings fetch note]:', bErr.message);
      } else if (bookingsData) {
        bookingsData.forEach(b => {
          unified.push({
            id: b.id,
            source_table: 'bookings',
            customer_name: b.customer_name || 'Customer',
            mobile_number: b.mobile_number || 'N/A',
            email: b.email || 'N/A',
            service_selected: b.service_selected || 'Document Service',
            address: b.address,
            documents_required: b.documents_required || [],
            booking_status: b.booking_status || 'Pending',
            created_at: b.created_at || new Date().toISOString()
          });
        });
      }

      // 2. Fetch from 'applications' table
      const { data: appsData, error: aErr } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (aErr) {
        console.warn('[Admin Supabase applications fetch note]:', aErr.message);
      } else if (appsData) {
        appsData.forEach(a => {
          // Avoid duplicate ID if present in both
          if (!unified.some(u => u.id === a.id)) {
            unified.push({
              id: a.id,
              source_table: 'applications',
              customer_name: a.full_name || a.applicant_name || 'Customer',
              mobile_number: a.phone_number || a.mobile_number || 'N/A',
              email: a.email || 'N/A',
              service_selected: a.certificate_type || a.service_title || 'Document Service',
              address: a.address || a.pickup_address,
              documents_required: a.uploaded_documents || [],
              booking_status: a.status || a.booking_status || 'Pending',
              created_at: a.created_at || new Date().toISOString(),
              additional_notes: a.additional_notes
            });
          }
        });
      }

      // Fallback via API routes if empty
      if (unified.length === 0) {
        const res = await fetch('/api/bookings');
        const apiRes = await res.json();
        if (apiRes.success && apiRes.bookings) {
          apiRes.bookings.forEach((b: any) => {
            unified.push({
              id: b.id,
              source_table: 'bookings',
              customer_name: b.customer_name || b.full_name || 'Customer',
              mobile_number: b.mobile_number || b.phone_number || 'N/A',
              email: b.email || 'N/A',
              service_selected: b.service_selected || b.certificate_type || 'Document Service',
              address: b.address,
              documents_required: b.documents_required || b.uploaded_documents || [],
              booking_status: b.booking_status || b.status || 'Pending',
              created_at: b.created_at || new Date().toISOString()
            });
          });
        }
      }

      setRecords(unified);
    } catch (err) {
      console.error('[Admin Dashboard Exception]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupabaseRecords();

    // Realtime listener for live sync
    const channelBookings = supabase
      .channel('public:bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchSupabaseRecords();
      })
      .subscribe();

    const channelApps = supabase
      .channel('public:applications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        fetchSupabaseRecords();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelBookings);
      supabase.removeChannel(channelApps);
    };
  }, []);

  // Update Status in Supabase
  const handleUpdateStatus = async (record: UnifiedRecord, newStatus: string) => {
    setUpdatingId(record.id);
    try {
      console.log(`[Admin Update Status] Record ${record.id} -> ${newStatus} in table ${record.source_table}`);

      const targetTable = record.source_table === 'bookings' ? 'bookings' : 'applications';
      const statusField = record.source_table === 'bookings' ? 'booking_status' : 'status';

      const { error } = await supabase
        .from(targetTable)
        .update({ [statusField]: newStatus, updated_at: new Date().toISOString() })
        .eq('id', record.id);

      if (error) {
        console.error(`[Admin Update Error]:`, error.message);
        // Try updating applications fallback
        await supabase.from('applications').update({ status: newStatus }).eq('id', record.id);
      }

      setRecords(prev =>
        prev.map(r => (r.id === record.id ? { ...r, booking_status: newStatus as any } : r))
      );

      if (selectedRecord && selectedRecord.id === record.id) {
        setSelectedRecord(prev => prev ? { ...prev, booking_status: newStatus as any } : null);
      }

    } catch (err) {
      console.error('Update status exception:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Record in Supabase
  const handleDeleteRecord = async (record: UnifiedRecord) => {
    if (!confirm(`Are you sure you want to delete booking #${record.id} permanently from Supabase?`)) return;

    try {
      console.log(`[Admin Delete Record] Deleting ${record.id} from table ${record.source_table}`);

      const targetTable = record.source_table === 'bookings' ? 'bookings' : 'applications';
      const { error } = await supabase
        .from(targetTable)
        .delete()
        .eq('id', record.id);

      if (error) {
        console.error('[Admin Delete Error]:', error.message);
        await supabase.from('applications').delete().eq('id', record.id);
      }

      setRecords(prev => prev.filter(r => r.id !== record.id));
      if (selectedRecord?.id === record.id) setSelectedRecord(null);

    } catch (err) {
      console.error('Delete record exception:', err);
    }
  };

  // Filter Computation
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesStatus = statusFilter === 'All' || r.booking_status === statusFilter;
      const matchesService = serviceFilter === 'All' || (r.service_selected || '').toLowerCase().includes(serviceFilter.toLowerCase());
      
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        (r.customer_name || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.mobile_number || '').toLowerCase().includes(q) ||
        (r.service_selected || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q);

      return matchesStatus && matchesService && matchesSearch;
    });
  }, [records, statusFilter, serviceFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 gradient-glow space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-Time Supabase Admin Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Customer Service Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              View, search, filter by service type or status, update booking progress, inspect uploaded documents, and delete records instantly in Supabase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSupabaseRecords}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
              <span>Sync Supabase</span>
            </button>
            <div className="p-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-center shrink-0">
              <span className="text-[10px] text-indigo-200 uppercase block">Total Bookings</span>
              <span className="text-xl font-black">{records.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, email, mobile, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">Filter by Status (All)</option>
            {statuses.filter(s => s !== 'All').map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Service Selected Filter */}
        <div className="md:col-span-3">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">Filter by Service (All)</option>
            <option value="Aadhaar">Aadhaar Services</option>
            <option value="PAN">PAN Card</option>
            <option value="Income">Income Certificate</option>
            <option value="Domicile">Domicile / Residence</option>
            <option value="Driving">Driving Licence</option>
            <option value="Passport">Passport</option>
            <option value="GST">GST Registration</option>
          </select>
        </div>

      </div>

      {/* Bookings Table */}
      <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">Booking ID / Date</th>
                <th className="px-5 py-4">Customer Name & Contact</th>
                <th className="px-5 py-4">Service Selected</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Booking Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* ID & Date */}
                    <td className="px-5 py-4 space-y-1">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                        {r.id.substring(0, 15)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="px-5 py-4 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {r.customer_name}
                      </span>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-500" />{r.mobile_number}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-indigo-500" />{r.email}</span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {r.service_selected}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="px-5 py-4 text-[11px] max-w-[200px] truncate">
                      <span className="text-slate-600 dark:text-slate-400">
                        {r.address || 'Doorstep Delivery'}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={r.booking_status || 'Pending'}
                        onChange={(e) => handleUpdateStatus(r, e.target.value)}
                        disabled={updatingId === r.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border shadow-sm transition-all focus:outline-none ${
                          r.booking_status === 'Completed' || r.booking_status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : r.booking_status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                            : r.booking_status === 'In Progress' || r.booking_status === 'Documents Collected'
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Documents Collected">Documents Collected</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                          title="Inspect Details & Documents"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteRecord(r)}
                          className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                          title="Delete Booking from Supabase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                    No bookings found matching your search or filter parameters.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* INSPECTOR MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Booking Inspector</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {selectedRecord.service_selected}
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500">Record ID: {selectedRecord.id}</span>
            </div>

            <div className="space-y-3 text-xs bg-slate-100/70 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-semibold text-emerald-600">{selectedRecord.mobile_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-semibold text-indigo-600">{selectedRecord.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-semibold text-right max-w-[250px]">{selectedRecord.address || 'Doorstep Collection'}</span>
              </div>
            </div>

            {/* Document Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Uploaded Documents (Supabase Bucket 'documents'):
              </h4>

              {selectedRecord.documents_required && selectedRecord.documents_required.length > 0 ? (
                <div className="space-y-2">
                  {selectedRecord.documents_required.map((docUrl, idx) => (
                    <a
                      key={idx}
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold line-clamp-1">Attached Document #{idx + 1}</span>
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No document files attached.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
