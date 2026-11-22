import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, QrCode, Heart, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../api/authApi';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, refreshToken } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout(refreshToken);
    } catch {
      // Ignored - proceed with client logout
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-slate-900">Pet<span className="text-indigo-600">Trace</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            Dashboard
          </Link>
          <span className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Heart className="w-4 h-4 text-rose-500" /> My Pets
          </span>
          <span className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer">
            <ShoppingBag className="w-4 h-4 text-emerald-500" /> Shop Products
          </span>
          <span className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer">
            <QrCode className="w-4 h-4 text-amber-500" /> Activate Tag
          </span>
        </nav>

        {/* User Auth Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs">
                  {user.first_name ? user.first_name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-medium text-slate-700">
                  {user.first_name} {user.last_name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
