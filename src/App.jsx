import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ImageSection from './components/ImageSection';
import Inspiration from './components/Inspiration';
import Closet from './components/Closet';
import Auth from './components/Auth';
import Profile from './components/Profile';
import { analyzeOutfit } from './services/gemini';
import { saveToCloset } from './services/closetService';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './services/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [uploadQueue, setUploadQueue] = useState([]);

  // 👇 IMPORTANT: Session Listener (Login/Logout Detection)
  useEffect(() => {
    // 1. App start hote hi check karo
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Jasoos lagao: Jaise hi auth state badle (Login ya Logout), turant update karo
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // Agar session null hua (logout), to login screen aa jayegi
      
      if (!session) {
        // Agar logout hua, to sab kuch reset kar do
        setCurrentView('home');
        setSelectedImage(null);
        setResult("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 👇 Agar Session nahi hai, to seedha Auth (Login) page dikhao
  if (!session) {
    return (
      <>
        <Toaster position="bottom-center" />
        <Auth />
      </>
    );
  }

  // ... BAAKI APP LOGIC SAME RAHEGA ...
  
  const handleImageUpload = (event) => {
    // (Purana code same rakho)
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
        const totalFiles = files.length;
        const toastId = toast.loading(`Uploading ${totalFiles} items... 🚀`);
        setTimeout(() => setCurrentView('closet'), 100);

        const uploadPromises = Array.from(files).map(async (file) => {
            const tempId = Date.now() + Math.random();
            const tempItem = {
                id: tempId,
                image_url: URL.createObjectURL(file),
                ai_description: "Queued...",
                isUploading: true
            };
            setUploadQueue(prev => [tempItem, ...prev]);

            try {
                await saveToCloset(file, "Bulk Uploaded (No AI)");
                setUploadQueue(prev => prev.filter(item => item.id !== tempId));
            } catch (error) {
                console.error("Upload failed", error);
            }
        });

        Promise.all(uploadPromises).then(() => {
            toast.success("All items saved successfully! ✨", { id: toastId });
        }).catch(() => {
            toast.error("Some uploads failed.", { id: toastId });
        });
        return;
    }

    const file = files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setResult("");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const toastId = toast.loading('Stylist is thinking... 🧠');
    const aiResponse = await analyzeOutfit(selectedFile);
    toast.dismiss(toastId);
    setResult(aiResponse);
    setLoading(false);
  };

  const handleSaveToCloset = () => {
    if (!selectedFile) {
      toast.error("Photo to select karo! 📸");
      return;
    }
    const fileToUpload = selectedFile;
    const descriptionToSave = result || "Uploaded by User";
    
    handleReset(); 

    toast.promise(
      saveToCloset(fileToUpload, descriptionToSave),
      {
        loading: 'Uploading in background... ☁️',
        success: 'Saved to Closet! ✅',
        error: 'Upload failed ❌',
      }
    );
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult("");
  }

  // 👇 Logout Function update
  const handleLogout = async () => {
      toast.loading("Logging out...", { id: 'auth-toast' });
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Logout failed!", { id: 'auth-toast' });
      } else {
        toast.success("See you soon! 👋", { id: 'auth-toast' });
        setSession(null); // Force update state
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center font-sans">
      
      <Toaster 
        position="bottom-center" 
        reverseOrder={false} 
        gutter={8}
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '50px',
            padding: '8px 16px',
            marginBottom: '70px',
          },
          loading: { style: { background: '#fff', color: '#333', border: '1px solid #eee' } },
        }}
      />

      <div className="w-full max-w-md h-[100vh] sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Header + Logout */}
        <div className="relative">
            {currentView === 'home' && <Header />}
        </div>

        <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {currentView === 'home' ? (
            <>
              <ImageSection 
                currentImage={selectedImage} 
                onImageSelect={handleImageUpload}
                onReset={handleReset}
                onAnalyze={handleAnalyze}
                onSave={handleSaveToCloset}
                loading={loading}
                result={result}
                onNavigate={setCurrentView}
              />
              <Inspiration />
            </>
          ) : currentView === 'closet' ? (
            <Closet 
                onBack={() => setCurrentView('home')} 
                uploadingItems={uploadQueue} 
            />
          ) : currentView === 'profile' ? (
            <Profile 
                session={session} 
                onLogout={handleLogout} 
            />
          ) : null}
        </div>

        <BottomNav onNavigate={setCurrentView} activeTab={currentView} />
      </div>
    </div>
  );
}

export default App;