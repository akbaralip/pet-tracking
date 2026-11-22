import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, QrCode, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-4 text-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 1 Foundation Live
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {user?.first_name || 'Pet Parent'}!
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Your PetTrace account is active. Manage your profile, secure your pets with smart QR tags, and track emergency alerts in real-time.
          </p>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Pets Registered */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
              Coming in Phase 2
            </span>
          </div>
          <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Registered Pets</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">0 Pets</p>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            Register your first pet profile in Phase 2
          </p>
        </div>

        {/* Card 2: Active QR Tags */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
              Ready to Pair
            </span>
          </div>
          <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Smart QR Tags</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">0 Active</p>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            Scan packaging code to activate newly delivered collars
          </p>
        </div>

        {/* Card 3: Protection Mode */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md">
              System Online
            </span>
          </div>
          <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Lost Pet Alert Engine</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">All Safe</p>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            Instant reverse-geolocation ping upon physical tag scan
          </p>
        </div>
      </div>

      {/* Account Info Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Account Credentials & Profile Overview</h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified details connected to your primary pet emergency notifications</p>
          </div>
          <Link
            to="/profile"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Manage Profile <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Email Address</span>
            <span className="font-semibold text-slate-800 break-all">{user?.email}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Full Name</span>
            <span className="font-semibold text-slate-800">{user?.full_name || 'Not set'}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Phone Number</span>
            <span className="font-semibold text-slate-800">{user?.phone_number || 'No phone added'}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Role & Permissions</span>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
