import React from 'react';

const BottomNav = ({ onNavigate, activeTab }) => {
  return (
    <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center text-gray-400">
      
      {/* Home Button */}
      <div 
        onClick={() => onNavigate('home')}
        className={`${activeTab === 'home' ? 'text-purple-600' : 'hover:text-purple-600'} flex flex-col items-center cursor-pointer`}
      >
        <span className="text-xl mb-1">🏠</span>
        <span className="text-[10px] font-medium">Home</span>
      </div>

      {/* Discover Button (Dummy for now) */}
      <div className="hover:text-purple-600 flex flex-col items-center cursor-pointer transition-colors">
        <span className="text-xl mb-1">🧭</span>
        <span className="text-[10px] font-medium">Discover</span>
      </div>

      {/* Upload Button (Center) */}
      <div 
        onClick={() => onNavigate('home')}
        className="hover:text-purple-600 flex flex-col items-center cursor-pointer -mt-8"
      >
         <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white transform hover:scale-110 transition-transform">
            <span className="text-xl">+</span>
         </div>
      </div>

      {/* Closet Button */}
      <div 
        onClick={() => onNavigate('closet')}
        className={`${activeTab === 'closet' ? 'text-purple-600' : 'hover:text-purple-600'} flex flex-col items-center cursor-pointer`}
      >
        <span className="text-xl mb-1">👕</span>
        <span className="text-[10px] font-medium">Closet</span>
      </div>

      {/* 👇 PROFILE BUTTON (Fixed) */}
      <div 
        onClick={() => onNavigate('profile')} // 👈 Ye line add ki hai
        className={`${activeTab === 'profile' ? 'text-purple-600' : 'hover:text-purple-600'} flex flex-col items-center cursor-pointer transition-colors`}
      >
        <span className="text-xl mb-1">👤</span>
        <span className="text-[10px] font-medium">Profile</span>
      </div>

    </nav>
  );
};

export default BottomNav;