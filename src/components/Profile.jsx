import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Profile = ({ session, onLogout }) => {
  const user = session?.user;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [stats, setStats] = useState({ totalItems: 0, loading: true });

  useEffect(() => {
    const fetchStats = async () => {
      const { count, error } = await supabase
        .from('closet')
        .select('*', { count: 'exact', head: true });

      if (!error) {
        setStats({ totalItems: count || 0, loading: false });
      }
    };
    fetchStats();
  }, []);

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    await onLogout();
  };

  return (
    <div className="p-6 h-full flex flex-col items-center bg-gray-50">
      
      <div className="h-10"></div>

      {/* 👇 FIXED: bg-gradient ko bg-linear kar diya */}
      <div className="w-24 h-24 bg-linear-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white animate-fade-in text-white">
        <span className="text-4xl font-bold">{user?.user_metadata?.full_name?.[0] || user?.email[0].toUpperCase()}</span>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-1">
        {user?.user_metadata?.full_name || "Fashionista"}
      </h2>
      <p className="text-sm text-gray-500 mb-6 bg-white px-4 py-1 rounded-full border border-gray-200 shadow-sm">
        {user?.email}
      </p>

      <div className="flex gap-4 w-full max-w-xs mb-8">
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-purple-600">
                {stats.loading ? '-' : stats.totalItems}
            </p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Items</p>
        </div>
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-pink-500">PRO</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Plan</p>
        </div>
      </div>

      {/* Settings Options */}
      <div className="w-full max-w-xs space-y-3 mb-auto">
        <button className="w-full text-left bg-white p-4 rounded-xl shadow-sm flex justify-between items-center text-gray-700 hover:bg-purple-50 transition-colors group">
            <div className="flex items-center gap-3">
                <span className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">⚙️</span>
                <span className="font-medium">Edit Profile</span>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Soon</span>
        </button>
        <button className="w-full text-left bg-white p-4 rounded-xl shadow-sm flex justify-between items-center text-gray-700 hover:bg-purple-50 transition-colors group">
            <div className="flex items-center gap-3">
                <span className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">🌑</span>
                <span className="font-medium">Dark Mode</span>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Soon</span>
        </button>
      </div>

      <button 
        onClick={handleLogoutClick}
        disabled={isLoggingOut} 
        className={`w-full max-w-xs font-bold py-3.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
            isLoggingOut 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-transparent' 
            : 'bg-white text-red-500 border-red-100 hover:bg-red-50 shadow-sm'
        }`}
      >
        {isLoggingOut ? 'Signing out...' : 'Log Out'}
      </button>

      <p className="text-[10px] text-gray-300 mt-6 font-mono">v1.0.0 • StyleMate AI</p>
    </div>
  );
};

export default Profile;