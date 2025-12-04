import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { deleteFromCloset } from '../services/closetService';
import { toast } from 'react-hot-toast';

const Closet = ({ onBack, uploadingItems = [] }) => {
  const [items, setItems] = useState([]);
  const [viewingItem, setViewingItem] = useState(null);

  useEffect(() => {
    fetchCloset();
    
    // 👇 AUTO-REFRESH LOGIC (Jasoos)
    // Har 4 second mein check karega agar koi item "Analyzing" state mein hai
    const interval = setInterval(() => {
      // Check karo kya list mein koi item "Analyzing" ya "Uploaded" state mein hai?
      const isAnyItemPending = items.some(item => 
        item.ai_description?.includes('Analyzing') || 
        item.ai_description?.includes('Uploaded by User')
      );

      // Agar haan, to data refresh karo
      if (isAnyItemPending) {
        console.log("Refreshing for AI updates...");
        fetchCloset(true); // 'true' matlab silent refresh (loading mat dikhao)
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [items]); // items change hone par logic update hoga

  const fetchCloset = async (silent = false) => {
    try {
      const { data, error } = await supabase
        .from('closet')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data);
    } catch (error) {
      if (!silent) console.error(error);
    }
  };

  const handleDeleteItem = (id, imageUrl, e) => {
    e.stopPropagation();
    toast.dismiss();
    toast((t) => (
      <div className="flex flex-col items-center gap-2">
        <span className="font-bold text-sm">Delete this? 🗑️</span>
        <div className="flex gap-2">
          <button onClick={() => { toast.dismiss(t.id); performDelete(id, imageUrl); }} className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold">Yes</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-gray-200 px-3 py-1 rounded text-xs">No</button>
        </div>
      </div>
    ), { id: 'delete-confirm', position: 'bottom-center' });
  };

  const performDelete = async (id, imageUrl) => {
    setItems(prev => prev.filter(item => item.id !== id));
    await deleteFromCloset(id, imageUrl);
    toast.success("Deleted", { id: 'delete-status' });
  };

  const allItems = [...uploadingItems, ...items];

  // Helper to check AI Status
  const isAnalyzing = (desc) => {
    return desc?.includes('Analyzing') || desc?.includes('Uploaded by User');
  };

  return (
    <div className="p-4 h-full flex flex-col bg-gray-50 relative">
      <div className="flex justify-between mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-purple-800">My Closet 🚪</h2>
        <button onClick={onBack} className="bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm border">← Back</button>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-24 overflow-y-auto custom-scrollbar">
        {allItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => !item.isUploading && setViewingItem(item)} 
            className={`bg-white rounded-xl shadow-sm overflow-hidden relative aspect-square border ${isAnalyzing(item.ai_description) ? 'border-purple-300' : 'border-gray-100'}`}
          >
            {!item.isUploading && (
              <button onClick={(e) => handleDeleteItem(item.id, item.image_url, e)} className="absolute top-2 right-2 bg-black/50 text-white w-7 h-7 rounded-full flex items-center justify-center z-10 backdrop-blur-sm active:scale-90">✕</button>
            )}
            
            {/* Uploading Spinner */}
            {item.isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                    <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent"></div>
                </div>
            )}
            
            <img src={item.image_url} alt="Cloth" className={`w-full h-full object-cover transition-opacity ${item.isUploading ? 'opacity-80' : ''}`} />

            {/* 👇 AI STATUS BADGE (Nishaani) */}
            {!item.isUploading && (
                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/60 to-transparent">
                    {isAnalyzing(item.ai_description) ? (
                        // Agar AI chal raha hai: Pulsing Badge
                        <div className="inline-flex items-center gap-1 bg-purple-500/90 backdrop-blur-md text-white px-2 py-1 rounded-full text-[10px] font-bold animate-pulse shadow-sm">
                            <span className="animate-spin">✨</span> AI Styling...
                        </div>
                    ) : (
                        // Agar Ho gaya: Normal Text
                        <p className="text-white text-[10px] font-medium line-clamp-1">
                            {item.ai_description?.split('**')[2] || item.ai_description?.substring(0, 20)}
                        </p>
                    )}
                </div>
            )}
          </div>
        ))}
      </div>

      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black flex justify-center items-center animate-fade-in p-4">
            <button onClick={() => setViewingItem(null)} className="absolute top-8 right-6 text-white text-3xl font-bold p-2 bg-white/10 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-md">✕</button>
            <img src={viewingItem.image_url} className="max-w-full max-h-[80vh] object-contain rounded-lg" alt="Full View"/>
            
            {/* Full View mein bhi dikhao agar analyzing hai */}
            <div className="absolute bottom-10 left-0 w-full text-center px-4">
                <div className="bg-black/60 backdrop-blur-md text-white p-4 rounded-2xl inline-block max-w-sm">
                    {isAnalyzing(viewingItem.ai_description) ? (
                        <p className="flex items-center gap-2 justify-center text-purple-300 font-bold animate-pulse">
                            <span>✨</span> AI is writing the description...
                        </p>
                    ) : (
                        <p className="text-sm">{viewingItem.ai_description}</p>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Closet;