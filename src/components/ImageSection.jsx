import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const ImageSection = ({ currentImage, onImageSelect, onReset, onAnalyze, onSave, loading, result, onNavigate }) => {

  let analysisText = result;
  let searchKeywords = [];

  if (result) {
    const searchSplit = result.split(/SEARCH:|SEARCH/); 
    if (searchSplit.length > 1) {
      const rawKeywords = searchSplit[searchSplit.length - 1]; 
      analysisText = searchSplit.slice(0, -1).join("").replace('🔍', '').trim();
      searchKeywords = rawKeywords.split(",").map(item => item.trim()).filter(i => i);
    }
  }

  const handleShopClick = (keyword) => {
    window.open(`https://www.pinterest.com/search/pins/?q=${keyword} outfit aesthetic`, '_blank');
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden"> 
      
      <AnimatePresence mode='wait'>
        {currentImage ? (
          // ✨ RESULT MODE (Compact & Scrollable)
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 p-4 flex flex-col h-full max-h-[85vh] w-full max-w-sm mx-auto"
          >
            <div className="bg-white rounded-3xl p-3 shadow-xl border border-purple-50 relative flex flex-col h-full">
                {/* Image Area */}
                <div className="relative w-full h-64 shrink-0 bg-gray-50 rounded-2xl overflow-hidden flex justify-center items-center">
                <img 
                    src={currentImage} 
                    alt="Selected" 
                    className="w-full h-full object-contain" 
                />
                {!loading && (
                    <button onClick={onReset} className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">✕</button>
                )}
                {loading && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin mb-3"></div>
                        <p className="text-xs font-bold tracking-widest uppercase animate-pulse">Styling...</p>
                    </div>
                )}
                </div>

                {/* Content */}
                {result ? (
                <div className="flex-1 flex flex-col min-h-0 mt-3 gap-3">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2 shrink-0">
                        <span className="text-xl">✨</span>
                        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-lg">Verdict</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        <div className="prose prose-sm text-gray-600 leading-relaxed text-xs font-medium">
                            <ReactMarkdown>{analysisText}</ReactMarkdown>
                        </div>
                    </div>
                    {searchKeywords.length > 0 && (
                        <div className="shrink-0 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {searchKeywords.map((keyword, index) => (
                                <button key={index} onClick={() => handleShopClick(keyword)} className="whitespace-nowrap bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-purple-100 flex items-center gap-1">
                                    🛍️ {keyword}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="grid grid-cols-[1fr_auto] gap-2 shrink-0">
                        <button onClick={onSave} className="bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-md flex justify-center items-center gap-2"><span>💾</span> Save to Closet</button>
                        <button onClick={onReset} className="w-12 bg-gray-100 text-gray-600 rounded-xl font-bold flex items-center justify-center">↻</button>
                    </div>
                </div>
                ) : (
                !loading && (
                    <div className="mt-auto mb-2">
                        <button onClick={onAnalyze} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2">✨ Analyze Outfit</button>
                        <button onClick={onSave} className="w-full mt-2 text-gray-400 font-bold text-xs">Skip AI & Just Save</button>
                    </div>
                )
                )}
            </div>
          </motion.div>
        ) : (
          
          // ✨ UPLOAD MODE (Ab Pura Bhara Hua Dikhega) 🛠️
          <motion.div 
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-4 w-full h-full" // Padding de di taaki kinaro se chipke na
          >
              <div className="relative group cursor-pointer w-full h-full bg-white rounded-3xl shadow-sm border-2 border-dashed border-purple-100 hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-300">
                  
                  {/* Click Area */}
                  <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={onImageSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                  />

                  {/* Centered Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      
                      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <span className="text-4xl">📸</span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-800 mb-2">Upload Outfit</h2>
                      <p className="text-gray-400 text-xs mb-8 px-4 leading-relaxed max-w-xs">
                          Tap anywhere in this box to upload photos from your gallery
                      </p>
                      
                      <div className="bg-black text-white py-3 px-8 rounded-full font-bold text-xs shadow-lg inline-flex items-center gap-2 group-hover:-translate-y-1 transition-transform">
                          <span>Select Photos</span>
                      </div>
                  </div>

              </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer Spacer */}
      <div className="h-20 shrink-0"></div> 
    </div>
  );
};

export default ImageSection;