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
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .prose hr {
          display: none;
        }
      `}</style>
      
      <AnimatePresence mode='wait'>
        {currentImage ? (
          // ✨ RESULT MODE
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 overflow-y-auto no-scrollbar px-4 py-6"
          >
            <div className="max-w-md mx-auto space-y-4 pb-6">
              
              {/* Image Card */}
              <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="relative w-full h-80 bg-gray-100">
                  <img 
                    src={currentImage} 
                    alt="Outfit" 
                    className="w-full h-full object-cover" 
                  />
                  
                  {!loading && (
                    <button 
                      onClick={onReset}
                      className="absolute top-3 right-3 w-9 h-9 bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black transition-all"
                    >
                      ✕
                    </button>
                  )}
                  
                  {loading && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-3 border-white/30 border-t-purple-400 rounded-full animate-spin mb-3"></div>
                      <p className="text-white text-sm font-medium">Analyzing...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Verdict Card */}
              {result && (
                <div className="bg-white rounded-3xl shadow-lg p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-lg">✨</span>
                    </div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      Style Verdict
                    </h3>
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed">
                    <ReactMarkdown>{analysisText}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Shop Buttons */}
              {searchKeywords.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {searchKeywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => handleShopClick(keyword)}
                      className="whitespace-nowrap bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-xs font-semibold border border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      🛍️ {keyword}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {result ? (
                <div className="flex gap-3">
                  <button 
                    onClick={onSave}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>💾</span>
                    <span>Save to Closet</span>
                  </button>
                  
                  <button 
                    onClick={onReset}
                    className="w-14 bg-white text-gray-600 rounded-2xl font-bold shadow-lg hover:bg-gray-50 transition-all text-xl"
                  >
                    ↻
                  </button>
                </div>
              ) : (
                !loading && (
                  <div className="space-y-2">
                    <button 
                      onClick={onAnalyze}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>✨</span>
                      <span>Analyze My Outfit</span>
                    </button>
                    
                    <button 
                      onClick={onSave}
                      className="w-full text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors py-2"
                    >
                      Skip analysis and save
                    </button>
                  </div>
                )
              )}
              
            </div>
          </motion.div>
        ) : (
          
          // ✨ UPLOAD MODE
          <motion.div 
            key="upload"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex items-center justify-center px-4 py-6"
          >
            <div className="w-full max-w-md">
              <div className="relative bg-white rounded-3xl shadow-lg border-2 border-dashed border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 overflow-hidden">
                
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={onImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="relative flex flex-col items-center text-center p-12">
                  
                  <motion.div 
                    className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-5xl">📸</span>
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                    Upload Your Outfit
                  </h2>
                  
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs">
                    Get instant AI-powered style analysis and personalized fashion recommendations ✨
                  </p>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 px-10 rounded-full font-bold shadow-xl inline-flex items-center gap-2">
                    <span>📷</span>
                    <span>Choose Photos</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer Space */}
      <div className="h-20 shrink-0"></div>
    </div>
  );
};

export default ImageSection;