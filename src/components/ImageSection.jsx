import React from 'react';
import ReactMarkdown from 'react-markdown';

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
    <div className="p-4 flex flex-col h-full"> 
      
      {currentImage ? (
        <div className="bg-white rounded-3xl p-3 shadow-lg border border-purple-50 relative flex flex-col gap-4">
          
          <div className="relative w-full bg-gray-50 rounded-2xl overflow-hidden flex justify-center items-center" style={{ maxHeight: '40vh' }}>
            <img 
                src={currentImage} 
                alt="Selected" 
                className="w-full h-full object-contain" 
            />
            
            {!loading && (
                <button 
                onClick={onReset}
                className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center font-bold z-10"
                >
                ✕
                </button>
            )}
          </div>

          {result ? (
            <div className="animate-fade-in flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-purple-800 text-lg">Stylist Verdict</h3>
              </div>
              
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                <ReactMarkdown>{analysisText}</ReactMarkdown>
              </div>

              {searchKeywords.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-purple-400 mb-2 uppercase tracking-wider">
                        🛒 Shop The Look
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {searchKeywords.map((keyword, index) => (
                            <button 
                                key={index}
                                onClick={() => handleShopClick(keyword)}
                                className="bg-white text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-100 shadow-sm flex items-center gap-1 active:scale-95 transition-transform"
                            >
                                🔍 {keyword}
                            </button>
                        ))}
                    </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                  <button 
                      onClick={onSave} 
                      className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2"
                  >
                      <span>💾</span> Save
                  </button>
                  <button 
                      onClick={onReset} 
                      className="px-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200"
                  >
                      New
                  </button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <button 
                onClick={onAnalyze}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex justify-center items-center gap-2 ${
                  loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-linear-to-r from-purple-600 to-indigo-600'
                }`}
              >
                {loading ? (
                  <>Thinking... 🧠</>
                ) : (
                  <>Ask Stylist ✨</>
                )}
              </button>
              
              {!loading && (
                <button 
                  onClick={onSave}
                  className="w-full mt-3 py-3 text-purple-600 font-bold text-sm bg-purple-50 rounded-xl"
                >
                  Skip & Just Save 💾
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={onImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-inner">
                <span className="text-4xl">📸</span>
            </div>
            
            <h2 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Style Check</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed px-4">
                Upload your outfit to get an AI rating and shopping suggestions.
            </p>
            
            <div className="bg-black text-white py-4 px-8 rounded-2xl font-bold text-sm shadow-xl inline-flex items-center gap-3 transform group-hover:-translate-y-1 transition-all">
                <span>Select Photo</span>
            </div>
            </div>
        </div>
      )}

      {/* 👇 YAHAN HAI LOGIC: Ye code tumhara missing tha */}
      <div className="flex justify-between gap-3 mt-8">
        {['My Closet', 'AI Mix', 'Find'].map((item, index) => (
          <div 
            key={index} 
            onClick={() => {
                if (item === 'My Closet') {
                    if (onNavigate) onNavigate('closet'); // <-- Ab ye error nahi dega
                } else {
                    alert("Coming Soon! 🚧");
                }
            }}
            className="bg-purple-50 p-4 rounded-2xl flex-1 text-center cursor-pointer hover:bg-purple-100 transition-colors shadow-sm active:scale-95 transform duration-100"
          >
            <div className="text-xl mb-2">{index === 0 ? '👕' : index === 1 ? '✨' : '🔍'}</div>
            <p className="text-xs font-bold text-gray-700">{item}</p>
          </div>
        ))}
      </div>
      
      <div className="h-20"></div> 
    </div>
  );
};

export default ImageSection;