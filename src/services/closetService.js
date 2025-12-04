import { supabase } from './supabaseClient';
import imageCompression from 'browser-image-compression';

export const saveToCloset = async (imageFile, aiDescription) => {
  try {
    // 👇 1. SABSE PEHLE: Current User ka ID nikalo
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        throw new Error("User login nahi hai! Phele login karo.");
    }

    console.log(`Original Size: ${imageFile.size / 1024 / 1024} MB`);

    // 2. COMPRESSION SETTINGS
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    // 3. COMPRESS KARO
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`Compressed Size: ${compressedFile.size / 1024 / 1024} MB`);

    // 4. Unique File Name (User ID bhi filename mein jod dete hain taaki unique rahe)
    const fileName = `${user.id}/${Date.now()}_${imageFile.name}`;

    // 5. Upload Photo
    const { error: uploadError } = await supabase.storage
      .from('closet_images')
      .upload(fileName, compressedFile);

    if (uploadError) throw uploadError;

    // 6. Public URL Nikalo
    const { data } = supabase.storage
      .from('closet_images')
      .getPublicUrl(fileName);
      
    const publicUrl = data.publicUrl;

    // 7. Database Entry (Ab User ID ke saath)
    const { error: insertError } = await supabase
      .from('closet')
      .insert([
        { 
          user_id: user.id, // 👈 YE SABSE IMPORTANT HAI (RLS ke liye)
          image_url: publicUrl, 
          ai_description: aiDescription,
          category: 'Uncategorized',
          weather: 'All Season'
        }
      ]);

    if (insertError) throw insertError;

    return { success: true, url: publicUrl };

  } catch (error) {
    console.error("Closet Save Error:", error);
    return { success: false, error: error.message };
  }
};

export const deleteFromCloset = async (itemId, imageUrl) => {
  try {
    // Delete karte waqt bhi user check karna achi practice hai
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User login nahi hai!");

    // URL se filename nikalna thoda tricky ho sakta hai agar folder use kiya ho
    // Best way: URL ka last part lo
    const fileName = imageUrl.substring(imageUrl.lastIndexOf('closet_images/') + 14);

    if (!fileName) throw new Error("File name nahi mila!");

    // 1. Storage se udao
    const { error: storageError } = await supabase.storage
      .from('closet_images')
      .remove([fileName]);

    if (storageError) {
        console.error("Storage delete error:", storageError);
    }

    // 2. Database se udao (Sirf agar wo item current user ka hai)
    const { error: dbError } = await supabase
      .from('closet')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id); // 👈 Security Check: Sirf apna item delete kar sake

    if (dbError) throw dbError;

    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
};

// src/services/closetService.js ke END mein:

export const updateClosetItem = async (id, newDescription) => {
  try {
    const { error } = await supabase
      .from('closet')
      .update({ ai_description: newDescription })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false };
  }
};