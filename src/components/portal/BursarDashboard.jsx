import React, { useState } from 'react';

export default function BursarDashboard({ data, onApprovePayment, onRejectPayment }) {
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredPayments = data.feePayments.filter((p) => {
    if (filterStatus === 'All') return true;
    return p.status === filterStatus;
  });

  const totalCollected = data.feePayments
    .filter((p) => p.status === 'Approved')
    .reduce((acc, p) => acc + parseInt(p.amount.replace(/[^0-9]/g, '') || 0), 0);

  const pendingCount = data.feePayments.filter((p) => p.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue Approved</span>
          <div className="text-2xl font-black text-green-primary mt-1">₦{totalCollected.toLocaleString()}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Approvals</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount} Receipts</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bursar Account</span>
          <div className="text-sm font-bold text-[#1B2521] mt-1">First Bank: 1029384756</div>
        </div>
      </div>

      {/* Payment Approval Ledger */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-[#1B2521]">Fee Payment Approvals</h3>
            <p className="text-xs text-gray-500">Review student bank transfer receipts and approve or decline payment</p>
          </div>

          <div className="flex gap-2">
            {['All', 'Pending', 'Approved', 'Declined'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === st
                    ? 'bg-green-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                <th className="p-3">Receipt ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Bank Transfer Info</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-400 italic">
                    No payment receipts match current filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-700">{p.id}</td>
                    <td className="p-3 font-bold text-[#1B2521]">
                      {p.studentName}
                      <span className="block text-[10px] text-gray-400 font-normal">{p.studentId}</span>
                    </td>
                    <td className="p-3 font-extrabold text-green-primary">{p.amount}</td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-800">{p.bankName}</div>
                      <div className="text-[11px] text-gray-400">Ref: {p.reference}</div>
                    </td>
                    <td className="p-3 text-gray-500">{p.dateSubmitted}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : p.status === 'Declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {p.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onApprovePayment(p.id)}
                            className="px-3 py-1.5 rounded bg-green-primary text-white font-bold text-[11px] hover:bg-green-dark"
                          >
                            ✓ Approve Payment
                          </button>
                          <button
                            onClick={() => onRejectPayment(p.id)}
                            className="px-3 py-1.5 rounded bg-red-100 text-red-700 font-bold text-[11px] hover:bg-red-200"
                          >
                            ✕ Decline
                          </button>
                        </>
                      )}
                      {p.status !== 'Pending' && (
                        <span className="text-gray-400 italic text-[11px]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
