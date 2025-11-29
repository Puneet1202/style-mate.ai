import React from 'react';
import ReactMarkdown from 'react-markdown';

const ImageSection = ({ currentImage, onImageSelect, onReset, onAnalyze, onSave, loading, result, onNavigate }) => {

  // 👇 LOGIC UPDATE: Ab ye Emoji aur Colon dono handle karega
  let analysisText = result;
  let searchKeywords = [];

  if (result) {
    // Hum "SEARCH" word dhoondenge (last wala, taaki beech mein kahin use hua ho to galti na ho)
    // Hum Regex use kar rahe hain jo "SEARCH:" ya sirf "SEARCH" dono pakad lega
    const searchSplit = result.split(/SEARCH:|SEARCH/); 

    // Agar split ho gaya (matlab SEARCH mil gaya)
    if (searchSplit.length > 1) {
      // Aakhri hissa Keywords hain
      const rawKeywords = searchSplit[searchSplit.length - 1]; 
      
      // Baaki sab Analysis text hai (Emoji hata kar clean kar rahe hain)
      analysisText = searchSplit.slice(0, -1).join("").replace('🔍', '').trim();
      
      // Keywords ko comma se tod kar saaf kar lo
      searchKeywords = rawKeywords.split(",").map(item => item.trim()).filter(i => i);
    }
  }

  // 👇 FUNCTION: Pinterest Search
  const handleShopClick = (keyword) => {
    window.open(`https://www.pinterest.com/search/pins/?q=${keyword} fashion style`, '_blank');
  };

  return (
    <div className="p-5">
      {currentImage ? (
        <div className="bg-gray-50 rounded-3xl p-4 shadow-inner relative transition-all">
          <img src={currentImage} alt="Selected" className="w-full h-64 object-cover rounded-2xl mb-4 shadow-lg" />
          
          {!loading && (
            <button 
              onClick={onReset}
              className="absolute top-6 right-6 bg-white text-red-500 w-8 h-8 rounded-full shadow-md flex items-center justify-center font-bold hover:bg-red-50 transition-colors"
            >
              ✕
            </button>
          )}

          {result ? (
            <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm text-left animate-fade-in">
              <h3 className="font-bold text-purple-700 mb-4 flex items-center gap-2 text-lg">
                <span>✨</span> Stylist Says:
              </h3>
              
              {/* Text Area */}
              <div className="prose prose-purple prose-sm max-w-none text-gray-600 mb-6 leading-relaxed">
                <ReactMarkdown>{analysisText}</ReactMarkdown>
              </div>

              {/* 👇 Buttons Area */}
              {searchKeywords.length > 0 && (
                <div className="mb-6 bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <p className="text-[10px] font-bold text-purple-400 mb-2 uppercase tracking-wider">
                        🛒 Shop Similar Items
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {searchKeywords.map((keyword, index) => (
                            <button 
                                key={index}
                                onClick={() => handleShopClick(keyword)}
                                className="bg-white text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-200 shadow-sm hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1"
                            >
                                🔍 {keyword}
                            </button>
                        ))}
                    </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                  <button 
                      onClick={onSave} 
                      className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-purple-700 transition-all flex justify-center items-center gap-2"
                  >
                      <span>💾</span> Save to Closet
                  </button>

                  <button 
                      onClick={onReset} 
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all border border-gray-200"
                  >
                      New Upload
                  </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button 
                onClick={onAnalyze}
                disabled={loading}
                className={`w-full py-3 rounded-full font-bold shadow-lg text-white transition-all flex justify-center items-center ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  'Ask AI Stylist 🤖'
                )}
              </button>

              {!loading && (
                <button 
                  onClick={onSave}
                  className="w-full py-3 rounded-full font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-all flex justify-center items-center gap-2"
                >
                  <span>💾</span> Just Save to Closet
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-white text-center shadow-lg relative transform transition-transform hover:scale-[1.01]">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={onImageSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm text-2xl animate-bounce">📷</div>
          <h2 className="text-2xl font-bold mb-2">Upload Outfit</h2>
          <p className="text-purple-100 text-sm mb-6">Snap a pic of your clothes to get instant styling advice.</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-sm shadow-md inline-block hover:bg-gray-50">Try Now</button>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex justify-between gap-3 mt-8">
        {['My Closet', 'AI Mix', 'Find'].map((item, index) => (
          <div 
            key={index} 
            onClick={() => {
                if (item === 'My Closet') {
                    if (onNavigate) onNavigate('closet');
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
    </div>
  );
};

export default ImageSection;