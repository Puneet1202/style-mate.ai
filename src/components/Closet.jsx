import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { deleteFromCloset } from '../services/closetService';
import { toast } from 'react-hot-toast';

const Closet = ({ onBack, uploadingItems = [] }) => {
  const [items, setItems] = useState([]);
  const [viewingItem, setViewingItem] = useState(null);

  useEffect(() => {
    fetchCloset();
    if (uploadingItems.length === 0) fetchCloset();
  }, [uploadingItems]);

  const fetchCloset = async () => {
    try {
      const { data, error } = await supabase
        .from('closet')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = (id, imageUrl, e) => {
    e.stopPropagation();
    toast((t) => (
      <div className="flex flex-col items-center gap-2">
        <span className="font-bold text-sm">Delete?</span>
        <div className="flex gap-2">
          <button onClick={() => { toast.dismiss(t.id); performDelete(id, imageUrl); }} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Yes</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-gray-200 px-3 py-1 rounded text-xs">No</button>
        </div>
      </div>
    ));
  };

  const performDelete = async (id, imageUrl) => {
    setItems(prev => prev.filter(item => item.id !== id));
    await deleteFromCloset(id, imageUrl);
  };

  const allItems = [...uploadingItems, ...items];

  return (
    <div className="p-4 h-full flex flex-col bg-gray-50 relative">
      <div className="flex justify-between mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-purple-800">My Closet 🚪</h2>
        <button onClick={onBack} className="bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">← Back</button>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-24 overflow-y-auto">
        {allItems.map((item) => (
          <div key={item.id} onClick={() => !item.isUploading && setViewingItem(item)} className="bg-white rounded-xl shadow-sm overflow-hidden relative aspect-square">
            {!item.isUploading && (
              <button onClick={(e) => handleDeleteItem(item.id, item.image_url, e)} className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center z-10">✕</button>
            )}
            {item.isUploading && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><div className="animate-spin h-6 w-6 border-2 border-white rounded-full"></div></div>}
            <img src={item.image_url} alt="Cloth" className={`w-full h-full object-cover ${item.isUploading ? 'opacity-80' : ''}`} />
          </div>
        ))}
      </div>

      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black flex justify-center items-center">
            <button onClick={() => setViewingItem(null)} className="absolute top-10 right-5 text-white text-2xl font-bold">✕</button>
            <img src={viewingItem.image_url} className="max-w-full max-h-[80vh] object-contain" />
        </div>
      )}
    </div>
  );
};

export default Closet;