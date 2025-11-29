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
    <div className="p-4 flex flex-col h-full overflow-hidden"> 
      
      {currentImage ? (
        <div className="bg-white rounded-3xl p-3 shadow-lg border border-purple-50 relative flex flex-col h-full">
          
          {/* IMAGE AREA */}
          <div className="relative w-full h-64 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
            <img 
                src={currentImage} 
                alt="Selected" 
                className="w-full h-full object-contain" 
            />
            {!loading && (
                <button onClick={onReset} className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center font-bold z-10">✕</button>
            )}
          </div>

          {result ? (
            <div className="flex-1 flex flex-col min-h-0 mt-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2 shrink-0">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-purple-800 text-lg">Verdict</h3>
              </div>
              
              {/* TEXT SCROLLABLE */}
              <div className="flex-1 overflow-y-auto pr-1 text-sm text-gray-600 leading-relaxed custom-scrollbar">
                <ReactMarkdown>{analysisText}</ReactMarkdown>
              </div>

              {/* SHOP BUTTONS */}
              {searchKeywords.length > 0 && (
                <div className="bg-purple-50 p-2 rounded-xl mt-2 shrink-0">
                    <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                        {searchKeywords.map((keyword, index) => (
                            <button key={index} onClick={() => handleShopClick(keyword)} className="bg-white text-purple-700 px-3 py-1 rounded-lg text-xs font-bold border border-purple-100 shadow-sm flex items-center gap-1">
                                🔍 {keyword}
                            </button>
                        ))}
                    </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 pt-2 shrink-0">
                  <button onClick={onSave} className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm shadow-lg flex justify-center items-center gap-2">
                      <span>💾</span> Save
                  </button>
                  <button onClick={onReset} className="px-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm">New</button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <button onClick={onAnalyze} disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex justify-center items-center gap-2 ${loading ? 'bg-gray-300' : 'bg-linear-to-r from-purple-600 to-indigo-600'}`}>
                {loading ? 'Thinking...' : 'Ask Stylist ✨'}
              </button>
              {!loading && (
                <button onClick={onSave} className="w-full mt-3 py-3 text-purple-600 font-bold text-sm bg-purple-50 rounded-xl">Skip & Just Save 💾</button>
              )}
            </div>
          )}
        </div>
      ) : (
        // UPLOAD UI
        <div className="flex-1 flex flex-col justify-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <input type="file" multiple accept="image/*" onChange={onImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-inner"><span className="text-4xl">📸</span></div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Style Check</h2>
            <p className="text-gray-500 text-sm mb-8 px-4">Upload your outfit to get an AI rating and shopping suggestions.</p>
            <div className="bg-black text-white py-4 px-8 rounded-2xl font-bold text-sm shadow-xl inline-flex items-center gap-3"><span>Select Photo</span></div>
            </div>
        </div>
      )}
      <div className="h-20 shrink-0"></div> 
    </div>
  );
};

export default ImageSection;