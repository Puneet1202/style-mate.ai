const Header = () => {
  return (
    <header className="p-5 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-purple-700">StyleMate<span className="text-purple-400">.ai</span></h1>
        <p className="text-xs text-gray-500">Your AI Fashion Assistant</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
        <span>🔔</span>
      </div>
    </header>
  );
};

export default Header;