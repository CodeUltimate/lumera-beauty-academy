'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Layers,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getAllCategories } from '@/data/categories';
import { mockEducators } from '@/data/mockData';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const [categories, setCategories] = useState(getAllCategories());

  const pendingEducators = mockEducators.filter((e) => !e.verified).slice(0, 3);
  const stats = {
    totalUsers: 12847,
    totalEducators: 523,
    totalStudents: 12324,
    totalClasses: 1892,
    totalRevenue: 284750,
    monthlyRevenue: 42680,
    pendingApprovals: 8,
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isVisible: !cat.isVisible } : cat
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extralight text-[var(--charcoal)]">Admin Dashboard</h1>
          <p className="text-[var(--text-secondary)] font-light mt-1">
            Platform overview and management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Total Users</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs font-light text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% this month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Total Classes</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">
                  {stats.totalClasses.toLocaleString()}
                </p>
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  342 this month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Monthly Revenue</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">
                  {formatPrice(stats.monthlyRevenue)}
                </p>
                <p className="text-xs font-light text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +32% vs last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Pending Approvals</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">
                  {stats.pendingApprovals}
                </p>
                <p className="text-xs font-light text-[var(--champagne)] mt-1">
                  Requires attention
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--champagne)]/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Management */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-[var(--charcoal)]">Category Management</h2>
              <Link
                href="/admin/categories"
                className="text-sm font-light text-[var(--champagne)] hover:underline"
              >
                Manage all →
              </Link>
            </div>

            <div className="card-premium divide-y divide-[var(--border-light)]">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Layers className="w-5 h-5 text-[var(--text-muted)]" />
                    <div>
                      <p className="text-sm font-medium text-[var(--charcoal)]">
                        {category.name}
                      </p>
                      <p className="text-xs font-light text-[var(--text-muted)]">
                        {category.description.slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCategoryVisibility(category.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                      category.isVisible
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[var(--cream)] text-[var(--text-muted)]'
                    }`}
                  >
                    {category.isVisible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Pending Educator Approvals */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-[var(--charcoal)]">Pending Approvals</h2>
              <Link
                href="/admin/approvals"
                className="text-sm font-light text-[var(--champagne)] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {mockEducators.slice(0, 3).map((educator) => (
                <div key={educator.id} className="card-premium p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center">
                        <span className="text-sm font-light text-[var(--charcoal)]">
                          {educator.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--charcoal)]">
                          {educator.name}
                        </p>
                        <p className="text-xs font-light text-[var(--text-muted)]">
                          {educator.specialty.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="mt-10">
          <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Link href="/admin/reports" className="card-premium p-6 text-center group">
              <BarChart3 className="w-8 h-8 text-[var(--champagne)] mx-auto mb-3" />
              <h3 className="text-sm font-medium text-[var(--charcoal)]">View Reports</h3>
            </Link>

            <Link href="/admin/educators" className="card-premium p-6 text-center group">
              <Users className="w-8 h-8 text-[var(--champagne)] mx-auto mb-3" />
              <h3 className="text-sm font-medium text-[var(--charcoal)]">Manage Educators</h3>
            </Link>

            <Link href="/admin/categories" className="card-premium p-6 text-center group">
              <Layers className="w-8 h-8 text-[var(--champagne)] mx-auto mb-3" />
              <h3 className="text-sm font-medium text-[var(--charcoal)]">Categories</h3>
            </Link>

            <Link href="/admin/approvals" className="card-premium p-6 text-center group">
              <CheckCircle className="w-8 h-8 text-[var(--champagne)] mx-auto mb-3" />
              <h3 className="text-sm font-medium text-[var(--charcoal)]">Approvals</h3>
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
