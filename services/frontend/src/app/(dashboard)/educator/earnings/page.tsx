'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { classesApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

const mockTransactions = [
  { id: '1', className: 'Advanced Lip Filler Techniques', studentName: 'Emma Thompson', amount: 299, platformFee: 59.80, netAmount: 239.20, date: new Date('2024-11-20'), status: 'completed' },
  { id: '2', className: 'Chemical Peels: Protocols', studentName: 'Sarah Mitchell', amount: 229, platformFee: 45.80, netAmount: 183.20, date: new Date('2024-11-18'), status: 'completed' },
  { id: '3', className: 'Advanced Lip Filler Techniques', studentName: 'Jennifer Park', amount: 299, platformFee: 59.80, netAmount: 239.20, date: new Date('2024-11-15'), status: 'completed' },
  { id: '4', className: 'Chemical Peels: Protocols', studentName: 'Maria Santos', amount: 229, platformFee: 45.80, netAmount: 183.20, date: new Date('2024-11-12'), status: 'completed' },
  { id: '5', className: 'Advanced Lip Filler Techniques', studentName: 'Lisa Chen', amount: 299, platformFee: 59.80, netAmount: 239.20, date: new Date('2024-11-10'), status: 'pending' },
];

const chartDataByRange: Record<string, { label: string; amount: number }[]> = {
  '7days': [
    { label: 'Mon', amount: 1200 },
    { label: 'Tue', amount: 980 },
    { label: 'Wed', amount: 1450 },
    { label: 'Thu', amount: 1100 },
    { label: 'Fri', amount: 1680 },
    { label: 'Sat', amount: 890 },
    { label: 'Sun', amount: 1120 },
  ],
  '30days': [
    { label: 'Week 1', amount: 1850 },
    { label: 'Week 2', amount: 2100 },
    { label: 'Week 3', amount: 1920 },
    { label: 'Week 4', amount: 2550 },
  ],
  '90days': [
    { label: 'Sep', amount: 6200 },
    { label: 'Oct', amount: 7100 },
    { label: 'Nov', amount: 8420 },
  ],
  'year': [
    { label: 'Jan', amount: 3200 },
    { label: 'Feb', amount: 3800 },
    { label: 'Mar', amount: 4100 },
    { label: 'Apr', amount: 3900 },
    { label: 'May', amount: 4500 },
    { label: 'Jun', amount: 4250 },
    { label: 'Jul', amount: 5100 },
    { label: 'Aug', amount: 4800 },
    { label: 'Sep', amount: 6200 },
    { label: 'Oct', amount: 7100 },
    { label: 'Nov', amount: 8420 },
    { label: 'Dec', amount: 0 },
  ],
};

export default function EducatorEarningsPage() {
  const [timeRange, setTimeRange] = useState('30days');
  const [isExporting, setIsExporting] = useState(false);

  const totalEarnings = 42680;
  const monthlyEarnings = 8420;
  const pendingPayout = 3280;
  const nextPayoutDate = new Date('2024-11-28');

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const blob = await classesApi.downloadEarningsReportPdf();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `earnings-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link
              href="/educator"
              className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-extralight text-[var(--charcoal)]">Earnings</h1>
            <p className="text-[var(--text-secondary)] font-light mt-1">
              Track your revenue and payouts
            </p>
          </div>
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-light text-[var(--text-muted)]">Total Earnings</p>
              <DollarSign className="w-5 h-5 text-[var(--champagne)]" />
            </div>
            <p className="text-3xl font-extralight text-[var(--charcoal)]">
              {formatPrice(totalEarnings)}
            </p>
            <p className="text-xs font-light text-[var(--text-muted)] mt-1">All time</p>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-light text-[var(--text-muted)]">This Month</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-extralight text-[var(--charcoal)]">
              {formatPrice(monthlyEarnings)}
            </p>
            <p className="text-xs font-light text-green-600 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +24% vs last month
            </p>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-light text-[var(--text-muted)]">Pending Payout</p>
              <Calendar className="w-5 h-5 text-[var(--champagne)]" />
            </div>
            <p className="text-3xl font-extralight text-[var(--charcoal)]">
              {formatPrice(pendingPayout)}
            </p>
            <p className="text-xs font-light text-[var(--text-muted)] mt-1">
              Next: {formatDate(nextPayoutDate)}
            </p>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-light text-[var(--text-muted)]">Platform Fee</p>
              <DollarSign className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <p className="text-3xl font-extralight text-[var(--charcoal)]">20%</p>
            <p className="text-xs font-light text-[var(--text-muted)] mt-1">You keep 80%</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="card-premium p-6 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light text-[var(--charcoal)]">Revenue Overview</h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-premium w-auto py-2 text-sm"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
            </select>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between space-x-4" style={{ height: '256px' }}>
            {(chartDataByRange[timeRange] || chartDataByRange['30days']).map((data, index, arr) => {
              const maxAmount = Math.max(...arr.map((d) => d.amount));
              const barHeight = maxAmount > 0 ? (data.amount / maxAmount) * 200 : 0; // Max bar height is 200px
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-gradient-to-t from-[var(--champagne)] to-[var(--champagne-light)] rounded-t transition-all duration-300"
                    style={{ height: `${barHeight}px`, minHeight: data.amount > 0 ? '4px' : '0px' }}
                  />
                  <div className="mt-3 text-center">
                    <p className="text-xs font-light text-[var(--text-muted)]">{data.label}</p>
                    <p className="text-xs font-light text-[var(--charcoal)]">
                      {data.amount >= 1000 ? `$${(data.amount / 1000).toFixed(1)}k` : `$${data.amount}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions */}
        <div className="card-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-light)]">
            <h2 className="text-lg font-light text-[var(--charcoal)]">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)]">
                  <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                    Class
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                    Student
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                    Amount
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                    Net
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-[var(--border-light)] last:border-0">
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-[var(--charcoal)]">
                        {transaction.className}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-[var(--text-secondary)]">
                        {transaction.studentName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-[var(--text-secondary)]">
                        {formatDate(transaction.date)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-light text-[var(--charcoal)]">
                        {formatPrice(transaction.amount)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-medium text-[var(--champagne)]">
                        {formatPrice(transaction.netAmount)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          transaction.status === 'completed'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
