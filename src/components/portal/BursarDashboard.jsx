import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, Clock, CreditCard, Building2, Check, X,
  ShieldCheck, Loader2, FileText, UserCheck, Search, Filter, AlertCircle
} from 'lucide-react';

const defaultFeePayments = [
  {
    id: 'RCP-2026-002',
    paymentId: 'RCP-2026-002',
    studentId: 'NSHS/2024/002',
    studentName: 'Chidimma Okonkwo',
    amount: '₦125,000',
    bankName: 'GTBank Mobile App',
    reference: 'GTB-TRF-4412093',
    dateSubmitted: '2026-08-25',
    status: 'Pending',
    class: 'SSS 2 (Commercial)',
  },
  {
    id: 'RCP-2026-003',
    paymentId: 'RCP-2026-003',
    studentId: 'NSHS/2024/003',
    studentName: 'Ibrahim Danjuma',
    amount: '₦125,000',
    bankName: 'Zenith Bank Transfer',
    reference: 'ZEN-PAY-7762190',
    dateSubmitted: '2026-08-27',
    status: 'Pending',
    class: 'SSS 1 (Science)',
  },
  {
    id: 'RCP-2026-001',
    paymentId: 'RCP-2026-001',
    studentId: 'NSHS/2024/001',
    studentName: 'Adewale Johnson',
    amount: '₦125,000',
    bankName: 'First Bank Nigeria',
    reference: 'FBN-TRF-9823411',
    dateSubmitted: '2026-08-22',
    status: 'Approved',
    class: 'SSS 3 (Science)',
  },
];

export default function BursarDashboard({ data, onApprovePayment, onRejectPayment }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [processingAction, setProcessingAction] = useState('');

  const rawPayments = Array.isArray(data?.feePayments) && data.feePayments.length > 0
    ? data.feePayments
    : defaultFeePayments;

  const filteredPayments = rawPayments.filter((p) => {
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch = !searchTerm ||
      p.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totalCollected = rawPayments
    .filter((p) => p.status === 'Approved')
    .reduce((acc, p) => acc + parseInt(String(p.amount || 0).replace(/[^0-9]/g, '') || 0), 0);

  const pendingCount = rawPayments.filter((p) => p.status === 'Pending').length;

  const handleApprove = async (payment) => {
    const payId = payment.id || payment.paymentId || payment.reference;
    setProcessingId(payId);
    setProcessingAction('approve');

    try {
      if (onApprovePayment) {
        await onApprovePayment(payId);
      }
      setActionFeedback(`Payment for ${payment.studentName} (${payment.amount}) approved successfully! Fee clearance issued.`);
      setTimeout(() => setActionFeedback(''), 4500);
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setProcessingId(null);
      setProcessingAction('');
    }
  };

  const handleReject = async (payment) => {
    const payId = payment.id || payment.paymentId || payment.reference;
    setProcessingId(payId);
    setProcessingAction('reject');

    try {
      if (onRejectPayment) {
        await onRejectPayment(payId);
      }
      setActionFeedback(`Payment for ${payment.studentName} (${payment.amount}) declined.`);
      setTimeout(() => setActionFeedback(''), 4500);
    } catch (err) {
      console.error('Rejection failed:', err);
    } finally {
      setProcessingId(null);
      setProcessingAction('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Notification Banner */}
      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center gap-2.5 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-green-primary flex-shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue Approved</span>
            <div className="text-xl sm:text-2xl font-black text-green-primary mt-0.5">₦{totalCollected.toLocaleString()}</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center text-green-primary flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending Approvals</span>
            <div className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">{pendingCount} Receipts</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Official Bank Account</span>
            <div className="text-xs sm:text-sm font-black text-[#1B2521] mt-0.5">First Bank: 1029384756</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Payment Approval Ledger & Modern Card Feed */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h3 className="font-extrabold text-lg text-[#1B2521]">Fee Payment Approvals</h3>
            <p className="text-xs text-gray-500">Review student bank transfer receipts and approve or decline clearance</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {['All', 'Pending', 'Approved', 'Declined'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-green-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st}
                {st === 'Pending' && pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950 text-[10px] font-black">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, admission number, or bank reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs bg-[#FAFCFA] focus:outline-none focus:border-green-primary"
          />
        </div>

        {/* 1. MOBILE VIEW: Modern, Sleek, Touch-Friendly Payment Cards */}
        <div className="block md:hidden space-y-3 pt-1">
          {filteredPayments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAFCFA] border border-gray-200 text-center text-xs text-gray-400 italic">
              No payment receipts found matching current filter.
            </div>
          ) : (
            filteredPayments.map((p) => {
              const payId = p.id || p.paymentId || p.reference;
              const isApproving = processingId === payId && processingAction === 'approve';
              const isRejecting = processingId === payId && processingAction === 'reject';

              return (
                <div
                  key={payId}
                  className="p-4 rounded-2xl bg-[#FAFCFA] border border-gray-200/90 shadow-xs space-y-3 transition-all"
                >
                  {/* Top Bar: Receipt ID & Status Badge */}
                  <div className="flex justify-between items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#06452C] font-mono text-[11px] font-black border border-emerald-200">
                      {payId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                      p.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : p.status === 'Declined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {p.status === 'Pending' ? '⏳ Pending Approval' : p.status}
                    </span>
                  </div>

                  {/* Student & Payment Info */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1B2521] leading-snug">{p.studentName}</h4>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        {p.studentId} {p.class ? `· ${p.class}` : ''}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-green-primary text-base leading-snug">{p.amount}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.dateSubmitted}</div>
                    </div>
                  </div>

                  {/* Bank & Reference Details */}
                  <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-xs space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-[11px]">Bank:</span>
                      <span className="font-bold text-gray-700">{p.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-[11px]">Reference:</span>
                      <span className="font-mono font-bold text-gray-600">{p.reference}</span>
                    </div>
                  </div>

                  {/* Action Buttons for Mobile */}
                  {p.status === 'Pending' ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleApprove(p)}
                        disabled={isApproving || isRejecting}
                        className="py-2.5 px-3 bg-green-primary hover:bg-green-dark text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
                      >
                        {isApproving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>Approving...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Fee</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleReject(p)}
                        disabled={isApproving || isRejecting}
                        className="py-2.5 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-60 cursor-pointer"
                      >
                        {isRejecting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-700" />
                            <span>Declining...</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-gray-400 italic py-1">
                      ✓ Fee clearance finalized ({p.status})
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 2. DESKTOP VIEW: High-Density Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-200 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 whitespace-nowrap">Receipt ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Amount</th>
                <th className="py-3.5 px-4">Bank Transfer Info</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Date</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 italic">
                    No payment receipts match current filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const payId = p.id || p.paymentId || p.reference;
                  const isApproving = processingId === payId && processingAction === 'approve';
                  const isRejecting = processingId === payId && processingAction === 'reject';

                  return (
                    <tr key={payId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-gray-700 whitespace-nowrap">{payId}</td>
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-[#1B2521] text-xs">{p.studentName}</div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">{p.studentId} {p.class ? `· ${p.class}` : ''}</div>
                      </td>
                      <td className="py-4 px-4 font-black text-green-primary text-sm whitespace-nowrap">{p.amount}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-800 text-xs leading-snug">{p.bankName}</div>
                        <div className="text-[11px] text-gray-400 font-mono leading-snug mt-0.5">Ref: {p.reference}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-500 font-mono text-xs whitespace-nowrap">{p.dateSubmitted}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                          p.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : p.status === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        {p.status === 'Pending' ? (
                          <div className="flex justify-end gap-2 items-center">
                            <button
                              onClick={() => handleApprove(p)}
                              disabled={isApproving || isRejecting}
                              className="px-3.5 py-1.5 bg-green-primary text-white text-xs font-black rounded-xl hover:bg-green-dark transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
                            >
                              {isApproving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(p)}
                              disabled={isApproving || isRejecting}
                              className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-xl hover:bg-red-200 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-60 cursor-pointer"
                            >
                              {isRejecting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <X className="w-3.5 h-3.5" />
                              )}
                              <span>Decline</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium italic">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
