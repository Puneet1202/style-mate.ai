import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { deleteFromCloset } from '../services/closetService';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { toast } from 'react-hot-toast'; // 👈 Ye line add karo top par imports mein

// 👇 1. Framer Motion Import kiya
import { motion, AnimatePresence } from 'framer-motion';

const Closet = ({ onBack, uploadingItems = [] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCloset();
    if (uploadingItems.length === 0) {
        fetchCloset();
    }
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
    } finally {
      setLoading(false);
    }
  };

  // 👇 UPDATED: Clean Delete Logic (No Stacking)
  const handleDeleteItem = (id, imageUrl) => {
    
    // Sabse pehle purane toast hata do (taaki screen saaf rahe)
    toast.dismiss();

    const performDelete = async () => {
        // UI se hatao
        setItems(currentItems => currentItems.filter(item => item.id !== id));
        
        // Backend se udao
        const response = await deleteFromCloset(id, imageUrl);
        
        if (!response.success) {
            toast.error("Delete failed!", { id: 'delete-status' }); // Fixed ID
            fetchCloset();
        } else {
            // 👇 MAGIC FIX: 'id' dene se ye stack nahi hoga, bas update hoga
            toast.success("Outfit deleted 👋", { 
                id: 'delete-status', // Ye naam same rahega
                duration: 2000 
            });
        }
    };

    // Confirmation Toast
    toast((t) => (
      <div className="flex flex-col items-center gap-2">
        <span className="font-bold text-sm">Delete this outfit? 🗑️</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete();
            }}
            className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-sm hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-xs font-bold border hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      id: 'confirm-toast', // Isko bhi ID de di taaki confirmation bhi stack na ho
      duration: 5000,
      position: 'bottom-center',
      style: {
        border: '1px solid #ffdede',
        background: '#fff',
        color: '#333',
      },
    });
  };

  const allItems = [...uploadingItems, ...items];

  // 👇 Animation Settings
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Ek ke baad ek aayenge (0.1s gap)
      }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="p-4 h-full flex flex-col bg-gray-50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
            <h2 className="text-2xl font-bold text-purple-800">My Closet 🚪</h2>
            <p className="text-xs text-gray-500">{allItems.length} Items</p>
        </div>
        <button onClick={onBack} className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-transform">
          ← Back
        </button>
      </div>

      {loading && items.length === 0 ? (
         <div className="flex-1 flex items-center justify-center flex-col text-gray-400 animate-pulse">
            <span className="text-4xl mb-2">🧥</span>
            <p>Loading wardrobe...</p>
         </div>
      ) : allItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center flex-col text-center">
            <p className="text-6xl mb-4">🤷‍♂️</p>
            <h3 className="text-xl font-bold text-gray-700">Closet Empty!</h3>
            <button onClick={onBack} className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg">Upload Now</button>
        </div>
      ) : (
        /* 👇 SCROLLABLE GRID CONTAINER */
        /* 'pb-24' diya taaki last item bottom nav ke peeche na chupe */
        <motion.div 
            className="grid grid-cols-2 gap-4 pb-24"
            variants={containerVars}
            initial="hidden"
            animate="show"
        >
          <AnimatePresence mode='popLayout'>
            {allItems.map((item) => (
              <motion.div 
                key={item.id} 
                layout // Smooth position change jab koi delete ho
                variants={itemVars}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.8 }} // Delete hone par shrink effect
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative group"
              >
                
                {!item.isUploading && (
                  <button 
                      onClick={() => handleDeleteItem(item.id, item.image_url)}
                      className="absolute top-2 right-2 bg-white/90 text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50 cursor-pointer"
                  >✕</button>
                )}

                <div className="relative w-full aspect-square"> 
                    {item.isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/10 backdrop-blur-[2px]">
                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}

                    <Zoom>
                      <img 
                          src={item.image_url} 
                          alt="Cloth" 
                          className={`w-full h-full object-cover transition-transform ${item.isUploading ? 'opacity-80' : 'hover:scale-110 cursor-zoom-in'}`}
                      />
                    </Zoom>
                </div>

                <div className="p-3">
                   <div className="inline-block bg-purple-50 text-purple-600 text-[10px] px-2 py-1 rounded-full font-bold mb-2">
                      {item.isUploading ? '⏳ Uploading...' : `📅 ${new Date(item.created_at).toLocaleDateString()}`}
                   </div>
                   <p className="text-xs font-medium text-gray-700 line-clamp-1 truncate">
                      {item.ai_description?.split('**')[2] || item.ai_description?.substring(0, 20) || "Processing..."}
                   </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Closet;